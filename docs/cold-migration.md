---
sidebar_position: 4
---

# Cold Migration – Migrate a VMware VM to ROVS

## Overview & Purpose
Modernizing legacy virtualized infrastructure requires a predictable, automated, and non-disruptive pathway from VMware vSphere to Red Hat OpenShift Virtualization on IBM Cloud (ROVS). The **Migration Toolkit for Virtualization (MTV)** orchestrates the discovery, conversion, resource mapping, and execution needed to migrate virtual machines at scale.

In this lab, you will perform an end-to-end **Cold Migration**. The source VMware VM is powered off, ensuring zero data drift while MTV:
1. Connects securely to the VMware vCenter provider across the IBM Cloud Transit Gateway.
2. Converts the VM disk format from **VMDK** to native KubeVirt container disks via `virt-v2v` and injects required VirtIO drivers.
3. Translates source VMware network port groups and datastores to OpenShift Localnet CUDNs and OpenShift Data Foundation (ODF / Ceph) storage classes.
4. Generates declarative `VirtualMachine` Custom Resources in OpenShift and launches the migrated workload.

---

## Learning Objectives
By completing this lab, you will be able to:
- **Configure Network Maps** to bind VMware NSX overlay segments to OpenShift Localnet CUDNs.
- **Configure Storage Maps** to redirect VMware datastores to OpenShift Data Foundation (`ocs-storagecluster-ceph-rpd`) storage classes.
- **Build and Execute** a declarative Cold Migration Plan within MTV.
- **Monitor the Migration Pipeline** from disk transfer through post-migration VM boot.

---

## Architecture & Data Flow Diagram

The diagram below illustrates the end-to-end migration topology connecting VMware Cloud Foundation (VCF) on Classic Infrastructure to OpenShift Virtualization on IBM Cloud VPC:

![MTV Migration Architecture](/img/lab/arch-migrate-mtv.png)

---

## Key Concepts

- **Migration Toolkit for Virtualization (MTV)**: Operator-driven migration platform based on upstream Konveyor Forklift.
- **`virt-v2v` Disk Conversion**: Converts guest operating system drivers, partitions, and disk formats to KubeVirt-native formats.
- **Storage Mapping**: Declarative translation rule connecting source VMware datastores to target Kubernetes `StorageClass` definitions backed by Ceph.
- **Network Mapping**: Declarative rule routing source VM network traffic directly to target OpenShift CUDNs.

⏱️ **Estimated Completion Time:** 25 minutes

---

## Hands-On Steps

### Step 1 – Create a Network Map

**a.** In the OpenShift web console left navigation menu, click **Migration for Virtualization** → **Network maps**.

![Migration for Virtualization → Network maps](/img/lab/image93.png)

**b.** Click **Create network map** → **Create with form**.

![Create network map – Create with form](/img/lab/image95.png)

**c.** Fill out the Network Map form:

| Field | Value |
| :--- | :--- |
| Network map name | `<your lab number>-networkmap` (e.g. `lab1-networkmap`) |
| Project | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Source network | `6a7c55c9e78638eb8066f39-segment` |
| Target network | `lab-4399-ph-lab-<your lab number>/lab-4399-ph-lab-<your lab number>` |

**d.** Click **Create**.

---

### Step 2 – Create a Storage Map

**a.** In the left navigation menu, click **Migration for Virtualization** → **Storage maps**.

![Migration for Virtualization → Storage maps](/img/lab/image98.png)

**b.** Click **Create storage map** → **Create with form**.

![Create storage map – Create with form](/img/lab/image100.png)

**c.** Fill out the Storage Map form:

| Field | Value |
| :--- | :--- |
| Storage map name | `<your lab number>-storagemap` (e.g. `lab1-storagemap`) |
| Project | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Source storage | `6a7c55c9e78638eb8066f39-storage` |
| Target storage | `ocs-storagecluster-ceph-rpd` |

**d.** Click **Create**.

---

### Step 3 – Access Migration Plans

**a.** In the left navigation menu, click **Migration for Virtualization** → **Migration plans**.

![Migration for Virtualization → Migration plans](/img/lab/image104.png)

**b.** Click **Create Plan**.

---

### Step 4 – Configure General Settings

In the **General** tab, fill in the following details:

| Field | Value |
| :--- | :--- |
| Plan name | `cold-migration-lab<your lab number>` (e.g. `cold-migration-lab1`) |
| Plan project | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |
| Source provider | `ocp-gym-vc` |
| Target provider | `host` |
| Target namespace | Select YOUR project (`lab-4399-ph-lab-<your lab number>`) |

![Migration plan general settings](/img/lab/image106.png)

Click **Next**.

---

### Step 5 – Select Your Source VM

**a.** Expand the **lab-4399** folder in the source VM inventory tree.

**b.** Select the checkbox next to **YOUR** lab VM.

![VM selection with lab-4399 dropdown expanded](/img/lab/image108.png)

**c.** Click **Next**.

---

### Step 6 – Assign the Network Map

**a.** Confirm **"Use an existing network map"** is selected.

**b.** Select the network map you created in Step 1 from the dropdown.

![Network map dropdown selection](/img/lab/image109.png)

**c.** Click **Next**.

---

### Step 7 – Assign the Storage Map

**a.** Confirm **"Use an existing storage map"** is selected.

**b.** Select the storage map you created in Step 2 from the dropdown.

![Storage map dropdown selection](/img/lab/image110.png)

**c.** Click **Next**.

---

### Step 8 – Select Cold Migration Type

**a.** Select **Cold migration** as the migration type.

![Cold migration type selected](/img/lab/image111.png)

**b.** Click **Next**.

---

### Step 9 – Review and Create the Plan

**a.** Review your configuration summary.

**b.** Click **Skip to Review**, then click **Create plan**.

![Create plan – Skip to Review](/img/lab/image112.png)

---

### Step 10 – Start the Migration

**a.** On the **Migration plans** list, click the 3 dots (⋮) next to your migration plan.

**b.** Click **Start**.

![Migration plan 3-dot menu → Start](/img/lab/image113.png)

---

### Step 11 – Monitor Migration Progress

**a.** Click on the migration plan name to view real-time pipeline execution:
- Volume creation on ODF Ceph storage.
- Disk transfer and `virt-v2v` conversion.
- Guest VM launch in OpenShift.

**b.** Wait for the status to reach **Completed**.

---

🎉 **Congratulations, you have completed Lab 3! You have successfully migrated an enterprise VMware virtual machine to OpenShift Virtualization using MTV.**
