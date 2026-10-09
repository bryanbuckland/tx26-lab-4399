---
sidebar_position: 2
---

# Provision a VM – Secondary Layer 2 CUDN (Routed)

## Overview & Purpose
In OpenShift, workloads and virtual machines are deployed within **Projects (Namespaces)**. While default container networking provides a cluster-wide flat overlay, OpenShift Virtualization supports **Secondary Cluster User Defined Networks (CUDNs)** to deliver dedicated, software-defined Layer 2 broadcast domains across cluster nodes.

In this lab, you will provision a Linux virtual machine attached to a **Secondary Layer 2 CUDN** (`layer2-routed-1`):
- **Shared Geneve-Encapsulated L2 Overlay**: The CUDN is cluster-scoped and shared across all lab tenant projects (`lab-4399-ph-lab-1` through `lab-4399-ph-lab-40`), allowing VMs across different namespaces to participate in the same private L2 network.
- **Routing & DHCP via Pod-Router Appliance**: Instead of requiring dedicated IBM Cloud VPC VNIs or MAC pinning for every VM, a centralized containerized **pod-router** (`pod-router-lab-4399-ph-layer2-routed-1`) running in the cluster serves DHCP (`10.26.3.10`–`10.26.3.254`) and acts as the default gateway (`10.26.3.1`).
- **Seamless VPC Ingress & Egress**: The pod-router bridges traffic through an uplink interface on VLAN 220 to the IBM Cloud VPC FW Uplink subnet (`10.26.2.0/24`). A custom route in the IBM Cloud VPC directs traffic for `10.26.3.0/24` to the pod-router.
- **Distributed Security Policies**: OpenShift multi-network policies can be applied to this secondary CUDN to provide micro-segmentation directly at each VM's virtual NIC, functioning just like **Distributed Firewalls (DFW)** in VMware NSX.

---

## Learning Objectives
By completing this lab, you will be able to:
- **Understand** the architecture and benefits of Secondary Layer 2 CUDNs with pod-based routing in OpenShift Virtualization.
- **Provision** a virtual machine attached to the shared Layer 2 CUDN using the OpenShift Web Console.
- **Verify** that the guest OS acquires its IP address from the pod-router DHCP server and validates persistence.
- **Test** end-to-end network reachability routed through the pod-router to external services.

---

## Architecture Diagram

The diagram below illustrates the shared Secondary Layer 2 CUDN topology, showing how tenant VMs in different projects communicate across the Geneve overlay and route north-south via the pod-router:

![Secondary Layer 2 CUDN Architecture](/img/lab/arch-layer2-udn.png)

---

## Key Concepts

- **Secondary CUDN (Cluster User Defined Network)**: A cluster-scoped network that provides an isolated secondary network interface to VMs across one or more projects.
- **Layer 2 Geneve Overlay**: Encapsulated overlay network carrying tenant traffic between OpenShift worker nodes without requiring physical network reconfiguration.
- **Pod-Router Gateway**: A specialized router pod that provides DHCP address allocation, default gateway routing, and uplink bridging to the VPC network.
- **Multi-Network Policies**: Declarative security rules enforced by OVN-Kubernetes on secondary networks to filter traffic between VMs (analogous to NSX Distributed Firewall).

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

**f.** In the **Network** dropdown, select the **Layer-2** network binding type attached to the shared CUDN (`lab-4399-ph-layer2-routed-1`). Click **Save**.

![Layer-2 network binding type selected](/img/lab/image35.png)

**g.** Click **Create VirtualMachine**.

---

### Step 5 – Watch the VM Start

**a.** Watch the status column update in the console:

```text
Provisioning → Starting → Running
```

![Status column showing Provisioning to Running](/img/lab/image38.png)

**b.** View the Network details to verify the assigned IP address (in the `10.26.3.0/24` range assigned by the pod-router).

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

🎉 **Congratulations, you have completed Lab 1! You have successfully provisioned a VM connected to a shared Secondary Layer 2 CUDN with pod-router gateway routing.**
