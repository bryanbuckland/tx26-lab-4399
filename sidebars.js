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
      label: 'Demo – Provision VMs',
      items: [
        {
          type: 'doc',
          id: 'demo-layer2-udn',
          label: 'Layer 2 Primary UDN',
        },
        {
          type: 'doc',
          id: 'demo-localnet-udn',
          label: 'Localnet UDN',
        },
      ],
    },
    {
      type: 'category',
      label: 'Migration Toolkit for Virtualization',
      items: [
        {
          type: 'doc',
          id: 'cold-migration',
          label: 'Cold Migration',
        },
        {
          type: 'doc',
          id: 'warm-migration',
          label: 'Warm Migration',
        },
      ],
    },
  ],
};

export default sidebars;
