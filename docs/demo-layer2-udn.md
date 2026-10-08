---
sidebar_position: 2
---

# Provision a VM – Layer 2 Primary UDN

A VM whose entire pod network is a Layer 2 primary CUDN. No VNI, no VLAN, no MAC pinning. The IP is DHCP-assigned from the CUDN subnet and persistent for the life of the VM.

![Layer 2 UDN architecture diagram](/img/lab/image8.png)

---

## Step 1 – Access the OpenShift Web Console

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

## Step 2 – Navigate to Virtualization

**a.** In the dropdown, click **Virtualization** → **VirtualMachines**. Leave the namespace set to **All Namespaces**.

![Virtualization → VirtualMachines menu](/img/lab/image20.png)

---

## Step 3 – Create a Virtual Machine from Instance Type

**a.** Click **Create** → **From Instance Type**.

![Create → From Instance Type](/img/lab/image22.png)

---

## Step 4 – Create the VM

**a.** Select **centos-stream9**.

![centos-stream9 selected](/img/lab/image24.png)

**b.** Scroll down and select **General Purpose**. Click the U series dropdown and select **small: 1 CPUs, 2 GiB Memory**.

![General Purpose U series small selected](/img/lab/image26.png)

**c.** Scroll down and change the VM name to `<initials>-layer2-vm` (e.g. `js-layer2-vm`).

![VM name set to layer2-vm](/img/lab/image27.png)

**d.** ⚠️ **DO NOT CLICK CREATE.** Click **Customize VirtualMachine**.

![Customize VirtualMachine button](/img/lab/image29.png)

**e.** In the Customize screen, click the **Configuration** tab, then navigate to the **Network** tab on the left. Click the kebab menu (⋮) on the default interface row and choose **Edit**.

![Configuration → Network tab with kebab Edit](/img/lab/image34.png)

**f.** In the **Network** dropdown, select the **Layer-2** network binding type. Click **Save**.

![Layer-2 network binding type selected](/img/lab/image35.png)

**g.** Click **Create VirtualMachine**.

![Create VirtualMachine button](/img/lab/image37.png)

---

## Step 5 – Watch the VM Start

**a.** Watch the status column update:

```
Provisioning → Starting → Running
```

![Status column showing Provisioning to Running](/img/lab/image38.png)

**b.** View the Network details.

![VM Network details](/img/lab/image39.png)

---

## Step 6 – Open the In-Browser Console

**a.** In the VM Details section, click **Open web console**.

![Open web console button](/img/lab/image41.png)

**b.** Log in with the guest login credentials. Then run:

```bash
ip addr show
```

> **Hint:** Use the Copy and Paste to Console buttons.

![Console with ip addr show output](/img/lab/image44.png)

**c.** Then run:

```bash
curl http://lab.techzone.ibm.local/
```

---

🎉 **Congratulations, you have completed part 1 of this lab!**
