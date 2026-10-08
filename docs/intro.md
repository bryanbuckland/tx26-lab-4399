# LAB-4399: From VMware to OpenShift Virtualization

*A Hands-On Migration Lab — IBM TechXchange 2026*

---

Virtualization modernization is a critical imperative for organizations seeking to eliminate licensing friction, reduce operational silos, and build a unified platform for both cloud-native and virtualized applications. **Red Hat OpenShift Virtualization on IBM Cloud (ROVS)** brings enterprise virtual machines directly into Kubernetes on high-performance IBM Cloud VPC Bare Metal infrastructure.

In this hands-on lab, you will explore modern VM provisioning patterns, advanced Software-Defined Networking with OpenShift User Defined Networks (UDNs), and automated workload migration from VMware vSphere using the Migration Toolkit for Virtualization (MTV).

---

## Lab Environment Architecture

The workshop runs on a dedicated multi-tenant IBM Cloud environment designed to simulate an enterprise-grade hybrid migration landing zone.

![Lab Environment Architecture](/img/lab/arch-overview.png)

### OpenShift & OVN Networking Concepts

In OpenShift, workloads and virtual machines are deployed within **Projects (Namespaces)**. Cluster networking is driven by **OVN-Kubernetes**, providing high performance, multi-tenant isolation, and declarative network topologies:

- **Cluster User Defined Networks (CUDNs)**: Secondary CUDNs enable flexible, software-defined networking for virtual machines without altering the default cluster pod network. CUDNs can be scoped across a single project or shared across multiple projects.
- **Layer 2 (Geneve Overlay) CUDN**: Encapsulated overlay networks that provide private L2 broadcast domains across nodes, independent of underlying VPC subnets.
- **Localnet (VLAN-Backed) CUDN**: Direct L2 bridging to physical/virtual interfaces on Bare Metal worker nodes via Open vSwitch (OVS). This connects VMs directly to IBM Cloud VPC subnets through dedicated VLANs.
- **Multi-Network Security Policies**: OpenShift provides built-in multi-network policies to control ingress and egress traffic for VMs attached to secondary CUDNs. These act like **Distributed Firewalls (DFW)** in VMware NSX, providing micro-segmentation directly at the virtual NIC boundary.

---

## Multi-Tenancy & Access Boundaries

To ensure a smooth and safe learning experience, the environment enforces strict multi-tenancy rules and role-based access control (RBAC):

### ✅ What You Will Use & See
- **Your Assigned Lab Project (`lab-4399-ph-lab-<N>`)**: You have full operator access within your assigned lab namespace to provision VMs, build MTV Network/Storage maps, and run migration plans.
- **Your Dedicated VPC Subnet & VNI**: Each lab has a dedicated `/29` VPC subnet (`10.26.4.0/23` range) with a pre-created Virtual Network Interface (VNI) and MAC reservation.
- **Shared CUDNs**: You will attach VMs to pre-created CUDNs:
  - `lab-4399-ph-layer2-routed-1`: Shared Layer 2 Geneve overlay network.
  - `lab-4399-ph-lab-<N>`: Dedicated per-lab Localnet network.
  - `lab-4399-ph-lab-common`: Shared Localnet network (VLAN 500 / `10.26.6.0/24`) used for migrated workloads.
- **Migration Providers**: Pre-configured MTV providers (`ocp-gym-vc` for vCenter source and `host` for the local OpenShift cluster).

### 🚫 What Is Managed Infrastructure (Do Not Touch)
- **Pod Routers (`lab-4399-ph-pod-routers`)**: Pre-configured virtual routing pods and uplink subnets (`10.26.2.0/24` on VLAN 220) handling north-south traffic for Layer 2 CUDNs.
- **Cluster Infrastructure & Operators**: Do not alter OpenShift Virtualization, OVN-Kubernetes, ODF storage cluster, or MTV operator definitions.
- **Other Lab Projects (`lab-4399-ph-lab-X`)**: Never access, modify, or delete resources in fellow participants' namespaces.
- **VPC Infrastructure**: VPC routing tables, default security groups, and Bare Metal PCI network attachments are pre-configured by administrators.

---

## Lab Curriculum Overview

The hands-on curriculum is divided into two modules covering modern VM provisioning and enterprise migration:

| Lab Section | Focus Area | Description |
| :--- | :--- | :--- |
| **[1. Provision a VM – Layer 2 Primary UDN](./demo-layer2-udn)** | Cloud-Native Networking | Deploy a VM on a Layer 2 Geneve overlay with internal DHCP and persistent IP management. |
| **[2. Provision a VM – Localnet UDN](./demo-localnet-udn)** | Enterprise VPC Networking | Deploy a VM with a dedicated VPC VNI and MAC pinning for a like-for-like on-premise networking experience. |
| **[3. Cold Migration with MTV](./cold-migration)** | Workload Migration | Migrate an offline VMware VM to OpenShift using MTV, `virt-v2v`, and ODF Ceph storage. |
| **[4. Warm Migration with MTV](./warm-migration)** | Minimal Downtime Migration | Execute a multi-stage migration with live precopy block replication and scheduled cutover. |

---

## Prerequisites

Before starting the labs, ensure you have:
- An active IBM Cloud account with access to the **2326338 – ITZ-VMWARE** account.
- Access to the **virtualization-4399** OpenShift web console.
- Your assigned **Lab Number (1–40)** provided by your workshop instructor.

---

## Notices and Disclaimers

© 2026 International Business Machines Corporation. No part of this document may be reproduced or transmitted in any form without written permission from IBM.

Information in these presentations has been reviewed for accuracy as of the date of initial publication and could include unintentional technical or typographical errors. IBM shall have no responsibility to update this information.

IBM, the IBM logo, and ibm.com are trademarks of International Business Machines Corporation, registered in many jurisdictions worldwide.
