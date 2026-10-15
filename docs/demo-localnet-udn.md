---
sidebar_position: 3
---

# Provision a VM – Localnet CUDN

import LabVideo from '@site/src/components/LabVideo';

<LabVideo name="lab-4399-localnet-vm" />

## Overview & Purpose
When migrating enterprise VMware workloads to the cloud, applications frequently require direct Layer 2 adjacency to corporate VPC subnets, static IP/MAC preservation, and native integration with cloud security groups and routing tables.

**Localnet CUDNs** bridge OpenShift Virtualization directly to the underlying IBM Cloud VPC network on Bare Metal infrastructure:
- **Dedicated Secondary Localnet CUDN**: Each lab project (`lab-4399-ph-lab-N`) has a dedicated Localnet CUDN scoped to its namespace with an access VLAN (VLANs 400–439).
- **VPC Subnets & Bare Metal VNIs**: IBM Cloud VPC subnets are pure Layer 3 networks without native VLANs. On Bare Metal worker nodes, Open vSwitch (OVS) tags VM traffic with a local VLAN ID, which the attached **Virtual Network Interface (VNI)** maps directly into the target VPC subnet.
- **MAC Pinning & MAC Learning**: Pinning the VM's MAC address to the VNI provides automatic DHCP IP assignment from the VPC. In addition, VNI MAC learning supports custom MAC addresses and static IP configurations within the subnet range.

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

> 💡 **Note on Permissions:** In this training environment, your VNI has already been created and attached to the cluster worker nodes by the administrators. We will explore the VNI configuration form, but **DO NOT CREATE A NEW VNI**.

**a.** In the IBM Cloud console, click the hamburger menu (upper left) → **Infrastructure** → **Network** → **Virtual network interfaces**.

![Infrastructure → Network → Virtual network interfaces](/img/lab/image49.png)

The list opens on the wrong region and looks empty. Set **Region** to **Dallas (us-south)** before you continue.

**b.** Click **Create** to view the VNI creation wizard.

![Create VNI button](/img/lab/image50.png)

**c.** Take a look at the standard fields requred to create a new VNI. Here's some example values - don't fill these in.

| Field | Example Value |
| :--- | :--- |
| Region | Dallas (`us-south`) |
| Name | `lab-4399-example` |
| Resource group | `techexchange-2026-lab-4399` |

As a lab user you will see an "Authorization error" on this form, and the **Resource group** will be empty. This is expected. You cannot create a VNI here.



**d.** Scroll down.  Under **Network configuration**, notice the VPC is `vpc-lab-4399` and each lab has a corresponding dedicated subnet (e.g. Lab 1 uses `lab-4399-ph-lab-1-subnet`). These represent the VPC(s) and the subnets that the new VNI could be attached to.

![Network configuration with subnet selection](/img/lab/image54.png)

**e.** ⚠️ **DO NOT CLICK CREATE.** Scroll back to the top of the screen and click back to the **Virtual network interfaces** list.

![Create VNI button](/img/lab/back-to-vni-list.png)

---

### Step 2 – Retrieve Your Assigned VNI Details

**a.** Locate the VNI corresponding to **YOUR** lab number in the list and click on it.

> **Pattern:** `lab-4399-ph-lab-common-lab-<your lab number>` (e.g. `lab-4399-ph-lab-common-lab-1`)

![VNI list with lab number highlighted](/img/lab/image57.png)

**b.** Make a note of the **MAC address** and **Primary IP** displayed on the VNI detail page. You will need this MAC address in Step 4g and use the Primary IP to verify your configuration at the end of the lab.

**c.** *(Optional)* Inspect the VNI Attachment:
1. Click the hamburger menu → **Infrastructure** → **OpenShift virtualization** → **virtualization-4399**.
2. Click **VNI attachments** in the left navigation to see how the VNI binds to the Bare Metal worker node.

![VNI attachment detail view](/img/lab/image59.png)

---

### Step 3 – Navigate to OpenShift Virtualization

**a.** Switch to your OpenShift Web Console browser tab.

**b.** In the left menu, click **Virtualization**.

**c.** Click VirtualMachines on the left menu bar and then click the Virtual Machines tab in the main window. Check that you see a blue **create** button at the top right of the screen.

**d.** If there is no blue 'create' button visible at the top right of the screen, click 'Settings' on the left menu bar and select your the project name relating to the number / login details provided by your workshop instructor in the Project dropdown. The return to the Virtual Machines tab, using the steps in **a.**

![Virtualization → VirtualMachines menu](/img/lab/nav-to-virtualization.png)

---

### Step 4 – Open the VM Creation Wizard

**a.** Click the blue **Create** button.

**b.** Ensure Custom configuration (default) is selected.

![Create → From Custom Configuration](/img/lab/create-custom-config.png)

**c.** Set the VM Name to `<initials>-localnet-vm` (e.g. `js-localnet-vm`). You can add a description too.


**d.**  Scroll donwn and check the details under Location. This should already be set to your assigned project. If not, click the pencil icon. In the Project dropdown, select your assigned project: **`lab-4399-ph-lab-<your lab number>`**.

**e.** click **Next**

---

### Step 4 – Choose an operating system, Boot Source and Compute Resources

**a.** Click Other Linux and from the dropdown, Select **centos-stream10**.

**b.** Click **Next**

![centos-stream9 selected](/img/lab/choose-vm-os.png)

**c.** On the Boot Source screen, click to highlight centos-stream10

**d.** click Next

![centos-stream9 selected](/img/lab/boot-source.png)

**e.** On the Compute resources screen, select **General Purpose**. Click the dropdown and select **small: 1 CPUs, 2 GiB Memory**.

![General Purpose U series small selected](/img/lab/compute-resources.png)

**f.** Click **Next**

**g.** In the Customize screen, click the **Network** tab. Click the kebab menu (⋮) on the default interface row in the displayed table and choose **Edit**.

![Configuration → Network tab with kebab Edit](/img/lab/customize-network.png)

**h.** In the Edit network interface dialog:
- **Network:** Select the Localnet CUDN matching your lab: `lab-4399-ph-lab-<your lab number>/lab-4399-ph-lab-common`.
- **Expand Advanced Settings** → enter the **MAC address** copied from your VPC VNI in Step 2.

![MAC address set in Advanced Settings](/img/lab/advanced-network1.png)

**i.** Click **Save**.

This has the effect of setting the network attachment and pinning the MAC address. **Do not click Next.**

---

### Step 5 – Set the Guest Password with Cloud-init

**a.** In the the Customization pane, click the **Initial run** tab.

![Initial run tab](/img/lab/click-init-run.png)


**b.** In the **Cloud-init** section, click **Edit**.

**c.** Set the password for user `centos` to `ChangeMe123!` and click **Apply** and then **Next**.

---

### Step 6 – Create and Start the VM

**a.** Check the new VM's configuration details and click the blue **Create VirtualMachine** button at the bottom of the screen. This will create the VM and start it.

---

### Step 7 – Watch the VM Boot

**a.** Return to the **VirtualMachines** list. Observe the status progression:

```text
Provisioning → Starting → Running
```

---

### Step 8 – Inspect the VM Network Overview

**a.** Scroll down slightly to view the **Network tile** on the righ hand side — verify that the IP matches the reserved IP from your VPC VNI. This screenshot shows an example.

![Network configuration](/img/lab/network-tile.png)

**b.** Click the **Network tile** header to open **Configuration** → **Network**:
- Confirm the network attachment is bound to your dedicated Localnet CUDN.
- Confirm the **MAC address** matches your VPC VNI reservation.

![Network configuration showing MAC address match](/img/lab/confirm-mac.png)

---

### Step 9 – Validate Guest OS Network & Connectivity

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
