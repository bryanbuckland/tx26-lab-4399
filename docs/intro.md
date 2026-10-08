# LAB-4399: From VMware to OpenShift Virtualization

*A Hands-On Migration Lab*

---

Virtualization modernization is a key step in helping organizations increase flexibility, reduce complexity, and prepare for future application modernization initiatives. OpenShift Virtualization enables enterprises to run existing virtual machines alongside containers on a single platform, simplifying operations and accelerating innovation.

In this hands-on lab, you will learn how to migrate VMware workloads to OpenShift Virtualization and experience the technologies that help organizations modernize their virtualization environments with confidence.

## Lab Overview

| Section | Description |
|---------|-------------|
| [Provision a VM – Layer 2 UDN](./demo-layer2-udn) | Provision a VM whose entire pod network is a Layer 2 primary CUDN |
| [Provision a VM – Localnet UDN](./demo-localnet-udn) | Provision a VM using Localnet networking for a like-for-like on-premise experience |
| [Cold Migration](./cold-migration) | Migrate a VMware VM to ROVS with the source VM stopped |
| [Warm Migration](./warm-migration) | Migrate a VMware VM with minimal downtime using precopy + cutover |

## Prerequisites

Before starting this lab, ensure you have the following ready:

- A working ROVS cluster with all operators healthy
- The `oc`, `virtctl`, and `ibmcloud` CLIs installed
- A VPC subnet with a Public Gateway attached (for outbound internet access)
- At least one allowed VLAN on your bare metal server's PCI network attachment
- OVS bridge and bridge mapping NNCPs applied and available

## Notices and Disclaimers

© 2026 International Business Machines Corporation. No part of this document may be reproduced or transmitted in any form without written permission from IBM.

Information in these presentations has been reviewed for accuracy as of the date of initial publication and could include unintentional technical or typographical errors. IBM shall have no responsibility to update this information.

IBM, the IBM logo, and ibm.com are trademarks of International Business Machines Corporation, registered in many jurisdictions worldwide.
