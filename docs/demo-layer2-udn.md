---
sidebar_position: 2
---

# Provision a VM – Layer 2 Primary UDN

## Overview & Purpose
In traditional container platforms, virtual machines share the standard Kubernetes pod network (OVN-Kubernetes overlay), which can introduce NAT complexity or dynamic IP reassignment across pod lifecycles. OpenShift Virtualization introduces **User Defined Networks (UDNs)** and **Cluster User Defined Networks (CUDNs)** to provide dedicated, isolated software-defined networks for virtual machines.

In this lab, you will deploy a Linux virtual machine connected to a **Layer 2 Primary CUDN** (`layer2-routed-1`). This architecture creates an isolated Geneve-encapsulated L2 broadcast domain across the cluster nodes:
- **No VPC VNI or MAC Pinning Required**: The VM receives its IP directly via internal OVN DHCP from the CUDN subnet.
- **IP Persistence**: The IP address is bound to the VirtualMachine lifecycle and remains stable across restarts.
- **Egress Routing via Pod-Router**: Outbound traffic to the intranet/internet is routed seamlessly through a designated central pod-router appliance connected to the VPC uplink subnet.

---

## Learning Objectives
By completing this lab, you will be able to:
- **Understand** the architecture and benefits of Layer 2 Geneve-encapsulated CUDNs in OpenShift.
- **Provision** a virtual machine with a custom Layer-2 network binding in the OpenShift Web Console.
- **Verify** internal guest OS network configuration and persistent IP assignment.
- **Test** outbound connectivity from the VM through the pod-router to external services.

---

## Architecture Diagram

The diagram below illustrates how your lab VM attaches to the shared Layer 2 CUDN (`10.26.3.0/24`) and routes outbound traffic through the pod-router:

![Layer 2 Primary UDN Architecture](/img/lab/arch-layer2-udn.png)

---

## Key Concepts

- **Primary CUDN (Cluster User Defined Network)**: A cluster-scoped network definition that spans multiple lab namespaces, providing private L2 overlay connectivity.
- **Layer 2 Binding**: Direct layer-2 bridging inside the guest pod without VXLAN/Geneve encapsulation overhead at the container interface.
- **Pod-Router Gateway**: A containerized router pod bridging the internal L2 CUDN to the VPC network (`10.26.2.0/24` on VLAN 220), allowing VPC custom routes to reach VM workloads.
- **Multi-Network Security Policies**: OpenShift enables micro-segmentation rules on secondary CUDNs, functioning like **Distributed Firewalls (DFW)** in VMware NSX.

⏱️ **Estimated Completion Time:** 15 minutes

---

## Hands-On Steps

### Step 1 – Access the OpenShift Web Console

**a.** Open [cloud.ibm.com](https://cloud.ibm.com) and confirm the account selector (upper right) is set to **2326338 – ITZ-VMWARE**.

![Account selector showing 2326338 – ITZ-VMWARE](/img/lab/image10.png)

**b.** Click the hamburger menu (upper left) → **Infrastructure** → **OpenShift virtualization**.

![Hamburger menu – Infrastructure – OpenShift virtualization](/img/lab/image12.png)

![OpenShift virtualization navigation](/img/lab/image15.png)

**c.** Click the cluster name **virtualization-4399**.

![Cluster list with virtualization-4399](/img/lab/image17.png)

**d.** Click the blue **OpenShift web console** button (upper right of the cluster detail page).

![OpenShift web console button](/img/lab/image18.png)

> The OpenShift console opens in a new tab, already authenticated.

---

### Step 2 – Navigate to Virtualization

**a.** In the dropdown, click **Virtualization** → **VirtualMachines**. Set the project selector at the top to your assigned project: **`lab-4399-ph-lab-<your lab number>`**.

![Virtualization → VirtualMachines menu](/img/lab/image20.png)

---

### Step 3 – Create a Virtual Machine from Instance Type

**a.** Click **Create** → **From Instance Type**.

![Create → From Instance Type](/img/lab/image22.png)

---

### Step 4 – Configure and Create the VM

**a.** Select **centos-stream9**.

![centos-stream9 selected](/img/lab/image24.png)

**b.** Scroll down and select **General Purpose**. Click the U series dropdown and select **small: 1 CPUs, 2 GiB Memory**.

![General Purpose U series small selected](/img/lab/image26.png)

**c.** Scroll down and change the VM name to `<initials>-layer2-vm` (e.g. `js-layer2-vm`).

![VM name set to layer2-vm](/img/lab/image27.png)

**d.** ⚠️ **DO NOT CLICK CREATE.** Click **Customize VirtualMachine**.

**e.** In the Customize screen, click the **Configuration** tab, then navigate to the **Network** tab on the left. Click the kebab menu (⋮) on the default interface row and choose **Edit**.

![Configuration → Network tab with kebab Edit](/img/lab/image34.png)

**f.** In the **Network** dropdown, select the **Layer-2** network binding type. Click **Save**.

![Layer-2 network binding type selected](/img/lab/image35.png)

**g.** Click **Create VirtualMachine**.

---

### Step 5 – Watch the VM Start

**a.** Watch the status column update in the console:

```text
Provisioning → Starting → Running
```

![Status column showing Provisioning to Running](/img/lab/image38.png)

**b.** View the Network details to verify the assigned IP address.

---

### Step 6 – Open the In-Browser Console & Validate Connectivity

**a.** In the VM Details section, click **Open web console**.

![Open web console button](/img/lab/image41.png)

**b.** Log in with the guest login credentials (`centos` / `ChangeMe123!`). Then check the IP configuration:

```bash
ip addr show
```

> **Hint:** Use the Copy and Paste to Console buttons.

![Console with ip addr show output](/img/lab/image44.png)

**c.** Verify outbound reachability through the pod router:

```bash
curl http://lab.techzone.ibm.local/
```

---

🎉 **Congratulations, you have completed Lab 1! You have successfully provisioned a cloud-native VM on a Layer 2 Primary CUDN.**
