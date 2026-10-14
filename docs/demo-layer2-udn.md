---
sidebar_position: 2
---

# Provision a VM – Secondary Layer 2 CUDN (Routed)

import LabVideo from '@site/src/components/LabVideo';

<LabVideo name="lab-4399-layer2-vm" />

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

### Step 1 – Log into IBM Cloud and Access the OpenShift Web Console

**a.** Using the URL and credentials corresponding to the number provided to you by your workshop instructor, log into IBM Cloud and confirm the account selector (upper right) is set to **2326338 – ITZ-VMWARE**.

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

**a.** In the left menu, click **Virtualization**.

**b.** Click VirtualMachines on the left menu bar and then click the Virtual Machines tab in the main window.

> The first time you open Virtualization, a welcome dialog and some tips appear. Close them. A message "An error occurred: Forbidden" on the Overview tab is expected.

**c.** If there is no blue 'create' button visible at the top right of the screen, click 'Settings' on the left menu bar and select your the project name relating to the number / login details provided by your workshop instructor in the Project dropdown. The return to the Virtual Machines tab, using the steps in **a.**

![Virtualization → VirtualMachines menu](/img/lab/nav-to-virtualization.png)

---

### Step 3 – Create a Virtual Machine from Instance Type

**a.** Click the blue **Create** button.

**b.** Ensure Custom configuration (default) is selected.

![Create → From Custom Configuration](/img/lab/create-custom-config.png)

**c.** Change the Name to `<initials>-layer2-vm` (e.g. `js-layer2-vm`). You can add a description too.

**d.**  Scroll donwn and under Location, click the pencil icon. In the Project dropdown, select your assigned project: **`lab-4399-ph-lab-<your lab number>`**.

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

**h.** In the **Network** list, choose `lab-4399-ph-lab-<your lab number>/lab-4399-ph-layer2-routed-1`, the shared Layer 2 network. Click **Save**.

![Shared Layer 2 network selected](/img/lab/edit-net-interface.png)

**i.** Click **Next**

**j.** Review your settings, then Click **Create VirtualMachine**.

---

### Step 5 – Watch the VM Start

**a.** Watch the status column update in the console:

```text
Provisioning → Starting → Running
```

![Status column showing Provisioning to Running](/img/lab/image38.png)

**b.** Scroll down the screen slightly to view the Network details on the right of the screen and verify the assigned IP address (in the `10.26.3.0/24` range assigned by the pod-router).

---

### Step 6 – Open the In-Browser Console & Validate Connectivity

**a.** In the VM Details section, click **Open web console**.

![Open web console button](/img/lab/image41.png)

**b.** Log in with the guest login credentials that are provided at the top of the screen, above the console window.

> **Hint:** Use the Copy and Paste to Console buttons.

**c.** Then check the IP configuration:

```bash
ip addr show
```

![Console with ip addr show output](/img/lab/image44.png)

**d.** Verify outbound reachability through the pod router:

```bash
curl http://lab.techzone.ibm.local/
```

---

🎉 **Congratulations, you have completed Lab 1! You have successfully provisioned a VM connected to a shared Secondary Layer 2 CUDN with pod-router gateway routing.**
