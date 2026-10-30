---
sidebar_position: 5
---

# Warm Migration from VMware

import LabVideo from '@site/src/components/LabVideo';

<LabVideo name="lab-4399-warm-migration" />

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

### Step 0 - Delete your cold migrated VM
This lab warm-migrates the same virtual machine that you migrated in the cold migration lab. You can't have the same VM running twice in your environment due to network conflicts, so we need to delete the cold-migrated instance first.

**a.** In the OpenShift web console left navigation menu, click **Virtual Machines**, then the **Virtual machines** tab in the main screen area. You will see a table view of the three virtual machines that you have created so far.

**b.** click the 3 dots (⋮) at the right-hand end of the row for the virtual machine called `lab<your-lab-number>` (e.g. `lab-1').

**c.** Click **Delete**

**d.** Don't check any of the boxes in the  Delete Virtual Machine? pop-up - just click **Delete**.

### Step 1 – Access Migration Plans

**a.** In the OpenShift web console left navigation menu, click **Migration for Virtualization** → **Migration plans**.

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
| Target project | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |

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

> ⚠️ **Verify target network:** Confirm the network map's target network is set to `lab-4399-ph-lab-<your lab number>/lab-4399-ph-lab-common`. This ensures your migrated VM attaches to the shared `lab-common` CUDN (VLAN 500) rather than the per-lab namespace network.

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

**a.** On the **Migration plans** list, click the name of your warm migration plan (note the migration plan may already be open, in which case, skip this step).

**b.** Click **Start**. The warm migration of your source VM will now begin.

---

### Step 9 – Monitor Precopy & Cutover Execution

**a.** Click on the **Virtual machines** and click on the twisty to view execution progress:
- **Precopying**: MTV copies live disk blocks while the source VM stays online in vCenter.

![Create plan button](/img/lab/warm-migration-progress.png)

Wait for a few minutes while the migration executes.

Once the DiskTransfer stage has completed, you will notice that the Pipeline Status changes from **Running** to **Waiting**. This is because the migration has entered it's **Cutover** phase. Since this is a warm migration, you can schedule the cutover to a time suit your users.

![Migration Cutover Paused](/img/lab/cutover-paused.png)

**b.** Click the **Schedule cutover** link. To cutover immediately, click **set cutover** without changing any of the values in the pop-up.

**c.** You will see that the **Pipeline Status** returns to running and the VM will continue to migrate.

**d.** Wait a few more minutes until the migration completes and Pipeline Status shows **Succeeded** (Hint: you can click the **Details** tab to see a % complete status).

---

🎉 **Congratulations, you have completed Lab 4! You have executed a warm migration with minimal workload downtime.**
