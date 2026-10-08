---
sidebar_position: 5
---

# Warm Migration – Migrate a VMware VM to ROVS

## Overview & Purpose
For production enterprise workloads bound by strict Service Level Agreements (SLAs), extended maintenance windows are unacceptable. **Warm Migration** minimizes workload disruption by copying the bulk of the virtual disk data in the background while the source VMware VM remains online and serving live traffic.

Using **Changed Block Tracking (CBT)** snapshots, MTV streams initial disk blocks to OpenShift Data Foundation (ODF / Ceph) storage. When you are ready to cut over, MTV triggers a brief maintenance window: the source VM is powered down, final delta changes are synchronized, and the VM is started immediately on Red Hat OpenShift Virtualization.

---

## Learning Objectives
By completing this lab, you will be able to:
- **Understand** the multi-phase lifecycle of Warm Migration (Initial Precopy $\rightarrow$ Incremental Sync $\rightarrow$ Cutover).
- **Reuse** existing MTV Network and Storage maps for rapid migration plan creation.
- **Configure and Execute** an automated Warm Migration plan.
- **Analyze** target-state networking where migrated workloads attach to the shared `lab-common` Localnet CUDN.

---

## Architecture & Migration Topology

The diagram below illustrates the end-to-end migration pipeline from VMware Cloud Foundation (VCF) on Classic Infrastructure to OpenShift Virtualization on IBM Cloud VPC:

![MTV Migration Architecture](/img/lab/arch-migrate-mtv.png)

### Target Network Architecture for Migrated Workloads

Once migrated, production workloads can attach to the shared **Localnet CUDN** (`lab-common` / VLAN 500) on the dedicated VPC Subnet for migrated VMs (`10.26.6.0/24`):

![Target Network Architecture for Migrated VMs](/img/lab/arch-migrate-target-net.png)

---

## Key Concepts

- **Precopy Stage**: Continuous background replication of VM disk blocks while the source guest OS continues running without disruption.
- **Cutover Stage**: Final synchronization triggered automatically or at a designated change window; powers down source VM, copies residual delta blocks, and spins up the VM on ROVS.
- **Downtime Minimization**: Downtime is constrained only to the time required to sync delta blocks and boot the guest OS on KubeVirt.
- **Shared Localnet Migration Network**: Migrated workloads land on a centralized CUDN (`lab-common` / VLAN 500) mapped to VPC subnet `10.26.6.0/24`.

⏱️ **Estimated Completion Time:** 20 minutes

---

## Hands-On Steps

### Step 1 – Access Migration Plans

**a.** In the OpenShift web console left navigation menu, click **Migration for Virtualization** → **Migration plans**.

![Migration for Virtualization → Migration plans](/img/lab/image114.png)

> You will see your completed Cold Migration plan from Lab 3 in the list.

**b.** Click **Create plan**.

---

### Step 2 – Configure General Settings

On the **General settings** page, fill in the following fields:

| Field | Value |
| :--- | :--- |
| Plan name | `warm-migration-<initials>` (e.g. `warm-migration-js`) |
| Plan project | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Target namespace | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |

![General settings form](/img/lab/image106.png)

Click **Next**.

---

### Step 3 – Select the Source VM

**a.** Expand the **lab-4399** folder and select your assigned source VM from the list.

![Source VM selection](/img/lab/image115.png)

**b.** Click **Next**.

---

### Step 4 – Assign the Network Map

**a.** Confirm **"Use an existing network map"** is selected.

**b.** Select your existing network map (created in Lab 3) from the dropdown.

![Network map selection](/img/lab/image118.png)

**c.** Click **Next**.

---

### Step 5 – Assign the Storage Map

**a.** Confirm **"Use an existing storage map"** is selected.

**b.** Select your existing storage map (created in Lab 3) from the dropdown.

![Storage map selection](/img/lab/image119.png)

**c.** Click **Next**.

---

### Step 6 – Select Warm Migration Type

**a.** Select **Warm migration** as the migration type.

![Warm migration type selected](/img/lab/image120.png)

**b.** Click **Skip to Review**.

---

### Step 7 – Create the Plan

**a.** Review your settings and click **Create plan**.

![Create plan button](/img/lab/image121.png)

---

### Step 8 – Start the Warm Migration

**a.** On the **Migration plans** page, click the 3 dots (⋮) on your warm migration plan.

**b.** Click **Start**.

![Migration plan 3-dot menu → Start](/img/lab/image113.png)

---

### Step 9 – Monitor Precopy & Cutover Execution

**a.** Click on the migration plan name to view execution progress:
- **Precopying**: MTV copies live disk blocks while the source VM stays online in vCenter.
- **Cutover**: Source VM is stopped and the final changed blocks are synchronized to ODF storage.
- **Completed**: The target VM is launched on OpenShift Virtualization.

---

🎉 **Congratulations, you have completed Lab 4! You have executed a warm migration with minimal workload downtime.**
