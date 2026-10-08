---
sidebar_position: 5
---

# Warm Migration – Migrate a VMware VM to ROVS

Warm migration copies most of the VM data during a precopy stage while the source VM is still running. The source VM is then stopped, and only the remaining changed data is copied during the final cutover stage — minimizing downtime.

---

## Step 1 – Access the MTV UI

**a.** Open the OpenShift web console.

**b.** In the left navigation menu, click the dropdown and navigate to **Migration for Virtualization** → **Migration plans**.

![Migration for Virtualization → Migration plans](/img/lab/image114.png)

> You will see your previous cold migration in the list.

**c.** Click **Create plan**.

---

## Step 2 – General Settings

On the **General settings** page, fill in the following fields:

| Field | Value |
|-------|-------|
| Plan name | `warm-migration-<initials>` (e.g. `warm-migration-js`) |
| Plan project | Select YOUR project |
| Source provider | `vcenter-prod` |
| Target provider | `host` |
| Target namespace | `vm-<initials>` (e.g. `vm-js`) |

![General settings form](/img/lab/image106.png)

Click **Next**.

---

## Step 3 – Select the Source VM

Select your source VM from the list.

![Source VM selection](/img/lab/image115.png)

Click **Next**.

---

## Step 5 – Select Your Network Map

Select your network map from the dropdown.

![Network map selection](/img/lab/image118.png)

Click **Next**.

---

## Step 6 – Select Your Storage Map

Select your storage map from the dropdown.

![Storage map selection](/img/lab/image119.png)

Click **Next**.

---

## Step 7 – Select Warm Migration

Select **Warm migration** as the migration type.

![Warm migration type selected](/img/lab/image120.png)

Click **Skip to Review**.

---

## Step 8 – Create Plan

Click **Create plan**.

![Create plan button](/img/lab/image121.png)

---

## Step 9 – Start the Migration

Back on **Migration plans** → click the 3 dots (⋮) on your migration plan. Click **Start**.

![Migration plan 3-dot menu → Start](/img/lab/image113.png)

---

## Step 10 – Monitor Migration Progress

Click on the migration plan. Wait for the status to reach **Completed**.
