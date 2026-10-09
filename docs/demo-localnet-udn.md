---
sidebar_position: 3
---

# Provision a VM – Localnet UDN

## Overview & Purpose
When migrating enterprise VMware workloads to the cloud, applications frequently require direct Layer 2 adjacency to corporate VPC subnets, static IP/MAC preservation, and native integration with cloud security groups and routing tables.

**Localnet CUDNs** bridge OpenShift Virtualization directly to the underlying IBM Cloud VPC network on Bare Metal infrastructure:
- **Dedicated Secondary Localnet CUDN**: Each lab project (`lab-4399-ph-lab-N`) has a dedicated Localnet CUDN scoped to its namespace with an access VLAN (VLANs 400–439).
- **Host-Level OVS Bridging & Bare Metal VNIs**: IBM Cloud VPC subnets are Layer 3 networks (there are no native VLANs in a VPC). VLAN separation is enabled through **Virtual Network Interfaces (VNIs)** attached to the Bare Metal worker nodes. When a VNI is associated with a node's PCI interface using a VLAN ID, outbound traffic is automatically 802.1Q tagged, and inbound tagged traffic is directed to the appropriate interface.
- **VPC Identity & MAC Address Binding**: In ROVS, VNIs are attached directly at the cluster level to the worker nodes. Pinning the VM's virtual NIC MAC address to its assigned VPC VNI MAC ensures deterministic IP allocation from the IBM Cloud DHCP service while inheriting all VPC security group and routing policies. *(Note: MAC learning is also supported on the VNI attachment, allowing custom MAC addresses and statically configured IPs within the VPC subnet range).*

---

## Learning Objectives
By completing this lab, you will be able to:
- **Inspect** pre-created IBM Cloud Virtual Network Interfaces (VNIs) and understand their binding to OpenShift Bare Metal worker nodes.
- **Provision** a virtual machine with a custom Localnet network attachment and pinned MAC address.
- **Configure** guest OS initial boot credentials using Cloud-init.
- **Verify** that the guest OS acquires the reserved VPC IP and demonstrates full network reachability.

---

## Architecture Diagram

The diagram below illustrates the per-lab Secondary Localnet architecture. Each lab project connects to a dedicated, single-namespace **Localnet CUDN** (VLANs 400–439), bridged via Open vSwitch (OVS) on Bare Metal worker nodes to its designated `/29` VPC subnet through attached IBM Cloud Virtual Network Interfaces (VNIs):

![Localnet UDN & VPC VNI Architecture](/img/lab/arch-localnet-udn.png)

:::info Understanding VLANs in IBM Cloud VPC
IBM Cloud VPC subnets are Layer 3 CIDR blocks and do not have native VLANs. On **VPC Bare Metal servers**, VLAN interfaces allow Open vSwitch (OVS) to tag traffic with a VLAN ID. The IBM Cloud VPC Bare Metal infrastructure uses the attached VNI to map that VLAN ID directly into the target VPC subnet.
:::

---

## Key Concepts

- **Virtual Network Interface (VNI)**: An IBM Cloud VPC resource providing dedicated IP, MAC address, and security group enforcement.
- **VNI Attachment & MAC Learning**: Binds a VNI to a Bare Metal PCI interface with an assigned VLAN ID, mapping tagged host traffic into a specific VPC subnet while supporting MAC learning for custom MACs and static IPs.
- **Localnet CUDN**: An OVN-Kubernetes network attachment that bridges VM traffic directly to the physical/virtual network on Bare Metal worker nodes via OVS.
- **MAC Address Pinning**: Matching the guest VM's virtual NIC MAC to the VPC VNI MAC to ensure deterministic IP allocation from VPC DHCP.
- **Cloud-init**: Industry-standard package for automating early guest OS initialization (credentials, SSH keys, network configs).

⏱️ **Estimated Completion Time:** 20 minutes

---

## Hands-On Steps

### Step 1 – Understand and Inspect the Virtual Network Interface (VNI)

> 💡 **Note on Permissions:** In this training environment, your VNI has already been created and attached to the cluster worker nodes by the administrators. We will explore the VNI configuration form, but **DO NOT CLICK CREATE**.

**a.** In the IBM Cloud console, click the hamburger menu (upper left) → **Infrastructure** → **Network** → **Virtual network interfaces**.

![Infrastructure → Network → Virtual network interfaces](/img/lab/image49.png)

**b.** Click **Create** to view the VNI creation wizard.

![Create VNI button](/img/lab/image50.png)

**c.** Observe the standard VNI configuration parameters:

| Field | Value |
| :--- | :--- |
| Region | Dallas (`us-south`) |
| Name | `lab-4399-example` |
| Resource group | `techexchange-2026-lab-4399` |

![VNI creation form filled out](/img/lab/image53.png)

**d.** Under **Network configuration**, notice the VPC is `vpc-lab-4399` and each lab has a corresponding dedicated subnet (e.g. Lab 1 uses `lab-4399-ph-lab-1-subnet`).

![Network configuration with subnet selection](/img/lab/image54.png)

**e.** ⚠️ **DO NOT CLICK CREATE.** Click **Cancel** or navigate back to the **Virtual network interfaces** list.

---

### Step 2 – Retrieve Your Assigned VNI Details

**a.** Locate the VNI corresponding to **YOUR** lab number in the list and click on it.

> **Pattern:** `lab-4399-ph-lab-<your lab number>-vm-1` (e.g. `lab-4399-ph-lab-1-vm-1`)

![VNI list with lab number highlighted](/img/lab/image57.png)

**b.** Note the **MAC address** and **Reserved IP** displayed on the VNI detail page — you will need this MAC address in Step 8.

**c.** *(Optional)* Inspect the VNI Attachment:
1. Click the hamburger menu → **Infrastructure** → **OpenShift virtualization** → **virtualization-4399**.
2. Click **VNI attachments** in the left navigation to see how the VNI binds to the Bare Metal worker node.

![VNI attachment detail view](/img/lab/image59.png)

---

### Step 3 – Navigate to OpenShift Virtualization

**a.** Switch to your OpenShift Web Console browser tab.

**b.** In the left navigation menu, click the dropdown → **Virtualization** → **VirtualMachines**. Set the project selector to your assigned project: **`lab-4399-ph-lab-<your lab number>`**.

![Virtualization → VirtualMachines with All Projects](/img/lab/image61.png)

---

### Step 4 – Open the VM Creation Wizard

**a.** Click **Create** → **From InstanceType**.

![Create VirtualMachines → From InstanceType](/img/lab/image63.png)

---

### Step 5 – Select the Boot Volume & InstanceType

**a.** Under the **InstanceTypes** tab, select **centos-stream9** as the operating system.

![centos-stream9 selected as boot volume](/img/lab/image65.png)

**b.** Select the **General Purpose** card (U series), and choose **small: 1 CPUs, 2 GiB Memory**.

![General Purpose U series small selected](/img/lab/image67.png)

---

### Step 6 – Name and Customize the VM

**a.** Set the VM Name to `<initials>-localnet-vm` (e.g. `js-localnet-vm`).

> ⚠️ **DO NOT CLICK Create VirtualMachine yet.** Click **Customize VirtualMachine** — the default wizard uses the cluster pod network without a fixed MAC. You must configure the Localnet network and pin the MAC address before creation.

![VM Name and Customize button](/img/lab/image27.png)

---

### Step 7 – Configure the Localnet Network Interface

**a.** In the Customize screen, click the **Configuration** tab, then click the **Network** tab on the left.

**b.** Click the kebab menu (⋮) on the default interface row and select **Edit**.

![Configuration → Network tab with kebab Edit](/img/lab/image74.png)

---

### Step 8 – Set Network Attachment & Pin the MAC Address

**a.** In the Edit network interface dialog:
- **Network:** Select the Localnet CUDN matching your lab: `lab-4399-ph-lab-<your lab number>` (e.g. `lab-4399-ph-lab-1`).
- **Expand Advanced Settings** → enter the **MAC address** copied from your VPC VNI in Step 2.

![MAC address set in Advanced Settings](/img/lab/image77.png)

**b.** Click **Save**.

---

### Step 9 – Set the Guest Password with Cloud-init

**a.** In the left-hand navigation list of the Customize wizard, click **Initial run**.

**b.** In the **Cloud-init** section, click **Edit**.

![Initial run – Cloud-init Edit](/img/lab/image80.png)

**c.** Set the root/centos password to `ChangeMe123!` and click **Apply**.

![Cloud-init password set to ChangeMe123!](/img/lab/image82.png)

---

### Step 10 – Create and Start the VM

**a.** Scroll down and click the blue **Create VirtualMachine** button at the bottom of the screen.

---

### Step 11 – Watch the VM Boot

**a.** Return to the **VirtualMachines** list. Observe the status progression:

```text
Provisioning → Starting → Running
```

---

### Step 12 – Inspect the VM Network Overview

**a.** Click on your VM and scroll to the **Network tile** — verify that the IP matches the reserved IP from your VPC VNI.

![Network tile showing static IP](/img/lab/image84.png)

**b.** Click the **Network tile** header to open **Configuration** → **Network**:
- Confirm the network attachment is bound to your dedicated Localnet CUDN.
- Confirm the **MAC address** matches your VPC VNI reservation.

![Network configuration showing MAC address match](/img/lab/image86.png)

---

### Step 13 – Validate Guest OS Network & Connectivity

**a.** Click the **Console** tab. Log in as user `centos` with password `ChangeMe123!`.

![In-browser console login](/img/lab/image88.png)

**b.** Verify the interface IP inside the guest OS:

```bash
ip addr show
```

![ip addr show output confirming static IP](/img/lab/image89.png)

**c.** Test outbound reachability across the network:

```bash
curl http://lab.techzone.ibm.local/
```

---

🎉 **Congratulations, you have completed Lab 2! You have deployed a VM with direct IBM Cloud VPC Subnet connectivity and MAC address pinning.**
