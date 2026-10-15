// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  labSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Provisioning VMs',
      items: [
        {
          type: 'doc',
          id: 'demo-layer2-udn',
          label: 'VM with Secondary Layer 2 CUDN',
        },
        {
          type: 'doc',
          id: 'demo-localnet-udn',
          label: 'VM with Localnet CUDN',
        },
      ],
    },
    {
      type: 'category',
      label: 'Migrating Workloads from VMware',
      items: [
        {
          type: 'doc',
          id: 'cold-migration',
          label: 'Cold Migration from VMware',
        },
        {
          type: 'doc',
          id: 'warm-migration',
          label: 'Warm Migration from VMware',
        },
      ],
    },
    {
      type: 'html',
      value: '<hr style="margin: 0.75rem 0.75rem; border-color: #dde5ee;" />',
    },
    {
      type: 'category',
      label: 'Useful Links',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'IBM Cloud Virtualization Solutions',
          href: 'https://cloud.ibm.com/docs/virtualization-solutions',
        },
        {
          type: 'link',
          label: 'Red Hat OpenShift Virtualization Service on IBM Cloud',
          href: 'https://www.ibm.com/products/openshift-virtualization',
        },
      ],
    },
  ],
};

export default sidebars;
