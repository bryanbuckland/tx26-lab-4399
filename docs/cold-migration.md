---
sidebar_position: 4
---

# Cold Migration – Migrate a VMware VM to ROVS

This end-to-end lab takes you from a clean ROVS cluster to a successfully migrated VMware VM — all in one walkthrough. It ties together the MTV operator (pre-installed on ROVS), VPC networking, and ODF storage into a complete migration scenario.

MTV migrates VMs to Red Hat OpenShift Virtualization running on Red Hat OpenShift.

![MTV migration overview](/img/lab/image90.png)

---

## What MTV Does

1. Reads the VM's disk, CPU, memory, and network configuration from vCenter.
2. Converts the VM disk from **VMDK** format to a KubeVirt-compatible image using `virt-v2v`.
3. Creates a **VirtualMachine CR** in OpenShift with mapped resources.
4. Starts the VM and (optionally) powers off the source.

---

## Migration Types

| Type | Description |
|------|-------------|
| **Cold Migration** | The source virtual servers are **stopped** while the data is copied. This is the default migration type. |
| **Warm Migration** | Most of the data is copied during the precopy stage. The virtual servers are then stopped and the remaining data is copied during the cutover stage. |

---

## Step 1 – Create a Network Map

**a.** Open the OpenShift web console. In the left navigation menu, click **Migration for Virtualization** → **Network maps**.

![Migration for Virtualization → Network maps](/img/lab/image93.png)

**b.** Click **Create network map** → **Create with form**.

![Create network map – Create with form](/img/lab/image95.png)

**c.** Fill out the form:

| Field | Value |
|-------|-------|
| Network map name | `<your lab number>-networkmap` (e.g. `lab1-networkmap`) |
| Project | Select YOUR project |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Source network | `6a7c55c9e78638eb8066f39-segment` |
| Target network | `lab-4399-ph-lab-<your lab number>/lab-4399-ph-lab-<your lab number>` |

![Network map form filled out](/img/lab/image96.png)

**d.** Click **Create**.

---

## Step 2 – Create a Storage Map

**a.** In the left navigation menu, click **Migration for Virtualization** → **Storage maps**.

![Migration for Virtualization → Storage maps](/img/lab/image98.png)

**b.** Click **Create storage map** → **Create with form**.

![Create storage map – Create with form](/img/lab/image100.png)

**c.** Fill out the form:

| Field | Value |
|-------|-------|
| Storage map name | `<your lab number>-storagemap` (e.g. `lab1-storagemap`) |
| Project | Select YOUR project |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Source storage | `6a7c55c9e78638eb8066f39-storage` |
| Target storage | `ocs-storagecluster-ceph-rpd` |

![Storage map form filled out](/img/lab/image101.png)

**d.** Click **Create**.

---

## Step 3 – Access the MTV UI

**a.** In the left navigation menu, click **Migration for Virtualization** → **Migration plans**.

![Migration for Virtualization → Migration plans](/img/lab/image104.png)

**b.** Click **Create Plan**.

---

## Step 4 – Create a Migration Plan

In the **General** tab, fill in the following:

| Field | Value |
|-------|-------|
| Plan name | `cold-migration-lab<your lab number>` (e.g. `cold-migration-lab1`) |
| Plan project | Select YOUR project number (e.g. `lab-4399-ph-lab-1`) |
| Source provider | `vcenter-prod` |
| Target provider | `host` |
| Target namespace | `vm-lab<your lab number>` (e.g. `vm-js`) |

![Migration plan general settings](/img/lab/image106.png)

Click **Next**.

---

## Step 5 – Select Your Project's VM

1. Expand the **lab-4399** dropdown.
2. Scroll to find YOUR lab number → click the checkbox next to your lab number.

![VM selection with lab-4399 dropdown expanded](/img/lab/image108.png)

3. Click **Next**.

---

## Step 6 – Network Map

**a.** Confirm **"Use an existing network map"** is selected.

**b.** From the dropdown, select your network map.

![Network map dropdown selection](/img/lab/image109.png)

**c.** Click **Next**.

---

## Step 7 – Storage Map

**a.** Confirm **"Use an existing storage map"** is selected.

**b.** From the dropdown, select your storage map.

![Storage map dropdown selection](/img/lab/image110.png)

Click **Next**.

---

## Step 8 – Select Migration Type

**a.** Select **Cold migration**.

**b.** Click **Next**.

![Cold migration type selected](/img/lab/image111.png)

---

## Step 9 – Create Plan

**a.** Leave all other settings as they are.

**b.** Click **Skip to Review**.

**c.** Click **Create plan**.

![Create plan – Skip to Review](/img/lab/image112.png)

---

## Step 10 – Start the Migration

**a.** Back on **Migration plans** → click the 3 dots (⋮) on your migration plan.

**b.** Click **Start**.

![Migration plan 3-dot menu → Start](/img/lab/image113.png)

---

## Step 11 – Monitor Migration Progress

**a.** Click on the migration plan. Wait for the status to reach **Completed**.
