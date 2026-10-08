---
sidebar_position: 3
---

# Provision a VM – Localnet UDN

Localnet networking is the most "like for like" network setup when compared to on-premise deployments of Red Hat OpenShift Virtualization Engine. Localnet is the simplest and easiest to understand, but it may not be the most effective way to scale deployments of VMs across ROVS.

![Localnet UDN architecture overview](/img/lab/image45.png)

---

## Step 1 – Create the Virtual Network Interface (VNI)

> We will walk through the process of creating a VNI, but **DO NOT CLICK CREATE** at the end — a VNI is already created and attached for you.

**b.** Click the hamburger menu → **Infrastructure** → **Network** → **Virtual network interfaces**.

![Infrastructure → Network → Virtual network interfaces](/img/lab/image49.png)

**b.** Click **Create**.

![Create VNI button](/img/lab/image50.png)

**b.** Fill in the form:

| Field | Value |
|-------|-------|
| Region | Dallas (us-south) – confirm, do not change |
| Name | `lab-4399-example` |
| Resource group | `techxchange-2026-lab-4399` |

![VNI creation form filled out](/img/lab/image53.png)

**b.** Scroll down to **Network configuration**. Confirm the VPC is `vpc-lab-4399`. Then, choose the subnet that corresponds with **YOUR** lab number.

> Example: Lab 1 → `lab-4399-ph-lab-1-subnet`

![Network configuration with subnet selection](/img/lab/image54.png)

**b.** Leave all remaining fields as their defaults. **DO NOT CLICK CREATE.** Navigate back to the Virtual network interfaces page by clicking the tab at the top of the page.

![Navigate back to VNI list](/img/lab/image56.png)

---

## Investigate the VNI

**a.** Find the VNI that corresponds with **YOUR** lab number in the list and click on it.

> **Hint:** It should be in the format `lab-4399-ph-lab-<your lab number>-vm-1`

![VNI list with lab number highlighted](/img/lab/image57.png)

**b.** Attach the VNI to the Worker Node:

1. Click the **Hamburger menu**.
2. Navigate to **Infrastructure** → **OpenShift virtualization** → **virtualization-4399**.
3. In the left navigation click **VNI attachments**.
4. Scroll until you find an attached VNI with your lab number.
5. Open it and navigate around.

![VNI attachment detail view](/img/lab/image59.png)

---

## Step 2 – Navigate to VirtualMachines

**a.** Switch to the OpenShift web console tab. *(If needed, navigate back to step 0 to see how to do so.)*

**b.** In the left navigation menu, click the dropdown → **Virtualization** → **VirtualMachines**. Leave the Project selector set to **All Projects**.

![Virtualization → VirtualMachines with All Projects](/img/lab/image61.png)

---

## Step 3 – Open the VM Creation Wizard

**a.** Click **Create VirtualMachines** → **From InstanceType**.

![Create VirtualMachines → From InstanceType](/img/lab/image63.png)

---

## Step 4 – Select the Boot Volume

**a.** Under the **InstanceTypes** tab, select **centos-stream9** as the OS.

![centos-stream9 selected as boot volume](/img/lab/image65.png)

---

## Step 5 – Select the InstanceType

**a.** Choose the **General Purpose** card (U series), then from its dropdown select **small: 1 CPUs, 2 GiB Memory**.

![General Purpose U series small selected](/img/lab/image67.png)

---

## Step 6 – Name the VM

**a.** In the VirtualMachine details section, set the Name to `<initials>-localnet-vm` (e.g. `js-localnet-vm`).

> ⚠️ **DO NOT CLICK Create VirtualMachine.** Click **Customize VirtualMachine** — the default wizard puts the VM on the pod network with no fixed MAC. You need to set the Localnet network and MAC address before creation.

![Customize VirtualMachine warning](/img/lab/image69.png)

---

## Step 7 – Open Configuration

**a.** In the Customize screen, click the **Configuration** tab, then navigate to the **Network** tab on the left. Click the kebab menu (⋮) on the default interface row and choose **Edit**.

![Configuration → Network tab with kebab Edit](/img/lab/image74.png)

---

## Step 8 – Set Network and MAC Address

**a.** In the Edit network interface dialog:

- **Network:** Choose the one that matches YOUR VM (e.g. `lab-4399-ph-lab-1`)
- **Expand Advanced Settings** → set **MAC address** to the MAC Address you found in your VNI.

![MAC address set in Advanced Settings](/img/lab/image77.png)

Click **Save**.

---

## Step 9 – Set the Login Password

**a.** In the left-hand list, click **Initial run**, then click **Edit** on the Cloud-init section.

![Initial run – Cloud-init Edit](/img/lab/image80.png)

**b.** Set the password to `ChangeMe123!` and click **Apply**.

![Cloud-init password set to ChangeMe123!](/img/lab/image82.png)

---

## Step 10 – Create the VM

**a.** Scroll down and click the blue **Create VirtualMachine** button at the bottom of the screen.

![Create VirtualMachine button](/img/lab/image37.png)

---

## Step 11 – Watch the VM Boot

**a.** Return to the VirtualMachine list. Watch the Status column progress:

```
Provisioning → Starting → Running
```

![VM status progressing to Running](/img/lab/image83.png)

---

## Step 12 – Inspect the VM Overview

**a.** Scroll down and look at the **Network tile** — it shows the static IP assigned to this VM.

![Network tile showing static IP](/img/lab/image84.png)

**b.** Click the **Network tile** header to jump to **Configuration** → **Network**. Point out:

- **Network attachment:** Pod Networking
- **MAC address** matches the VNI reservation — this is what pins the IP permanently.

![Network configuration showing MAC address match](/img/lab/image86.png)

---

## Step 13 – Open the In-Browser Console

**a.** Click the **Console** tab. Log in as `centos` with the password `ChangeMe123!`

> **Hint:** Use the Copy and Paste to Console buttons to paste logon credentials.

![In-browser console login](/img/lab/image88.png)

---

## Step 14 – Show the Static IP Inside the VM

**a.** In the VM console, run:

```bash
ip addr show
```

![ip addr show output confirming static IP](/img/lab/image89.png)

**b.** Then run:

```bash
curl http://lab.techzone.ibm.local/
```

---

🎉 **Congratulations, you have completed part 1 of this lab!**
