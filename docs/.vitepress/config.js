import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HiveBoard Documentation',
  description: 'Build, simulate, and evaluate the HiveBoard manipulation benchmark.',
  lang: 'en-US',
  base: '/hiveboard-docs/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#f0a51a' }],
    ['link', { rel: 'icon', href: '/hiveboard-docs/images/hiveboard-mark.svg' }]
  ],
  themeConfig: {
    logo: '/images/hiveboard-mark.svg',
    siteTitle: 'HiveBoard Docs',
    search: { provider: 'local' },
    nav: [
      { text: 'Documentation', link: '/' },
      { text: 'Project website', link: 'https://hiveboard-bench.github.io' },
      {
        text: 'Repositories',
        items: [
          { text: 'Parts and protocol', link: 'https://github.com/EESC-LabRoM/HiveBoard' },
          { text: 'Isaac Lab', link: 'https://github.com/EESC-LabRoM/isaaclab-hiveboard' }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Documentation home', link: '/' },
          { text: 'Benchmark overview', link: '/getting-started/overview' },
          { text: 'Choose a workflow', link: '/getting-started/quick-start' }
        ]
      },
      {
        text: 'Build HiveBoard',
        items: [
          { text: 'Print the parts', link: '/hardware/printing' },
          { text: 'Assemble and mount', link: '/hardware/assembly' },
          { text: 'Module reference', link: '/hardware/modules' }
        ]
      },
      {
        text: 'Run the benchmark',
        items: [
          { text: 'Evaluation protocol', link: '/benchmark/protocol' },
          { text: 'Record trials', link: '/benchmark/logging' },
          { text: 'Report results', link: '/benchmark/results' }
        ]
      },
      {
        text: 'Simulation',
        items: [
          { text: 'Simulation assets', link: '/simulation/assets' },
          { text: 'Isaac Lab integration', link: '/simulation/isaac-lab' }
        ]
      },
      {
        text: 'Extend and reference',
        items: [
          { text: 'Add a new attachment', link: '/guides/new-attachment' },
          { text: 'Repository map', link: '/reference/repositories' },
          { text: 'Troubleshooting', link: '/reference/troubleshooting' },
          { text: 'Citation', link: '/reference/citation' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/EESC-LabRoM/HiveBoard' }
    ],
    editLink: {
      pattern: 'https://github.com/ricardovgodoy/hiveboard-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Open documentation for the HiveBoard benchmark.',
      copyright: 'HiveBoard contributors'
    },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    lastUpdated: { text: 'Updated' }
  }
})
