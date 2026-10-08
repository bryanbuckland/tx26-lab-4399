// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LAB-4399: From VMware to OpenShift Virtualization',
  tagline: 'A Hands-On Migration Lab — IBM TechXchange 2026',
  favicon: 'img/favicon-32.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://bryanbuckland.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/tx26-lab-4399/',

  // GitHub pages deployment config.
  organizationName: 'bryanbuckland',
  projectName: 'tx26-lab-4399',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'LAB-4399',
        logo: {
          alt: 'OpenShift Virtualization',
          src: 'img/favicon-32.png',
          width: 28,
          height: 28,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'labSidebar',
            position: 'left',
            label: 'Lab Guide',
          },
          {
            href: 'https://github.com/IBM/tx26-lab-4399',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Lab Sections',
            items: [
              { label: 'Introduction', to: '/docs/intro' },
              { label: 'Layer 2 UDN', to: '/docs/demo-layer2-udn' },
              { label: 'Localnet UDN', to: '/docs/demo-localnet-udn' },
              { label: 'Cold Migration', to: '/docs/cold-migration' },
              { label: 'Warm Migration', to: '/docs/warm-migration' },
            ],
          },
          {
            title: 'IBM Resources',
            items: [
              { label: 'IBM TechXchange', href: 'https://www.ibm.com/community/ibm-techxchange-conference/' },
              { label: 'OpenShift Virtualization', href: 'https://www.redhat.com/en/technologies/cloud-computing/openshift/virtualization' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} IBM Corporation. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
