# HiveBoard documentation prototype

This repository contains a standalone review copy of the HiveBoard documentation. It reorganizes the existing parts, printing guidance, evaluation protocol, trial logging instructions, simulation information, and extension guidance into a searchable website.

The canonical benchmark files remain in:

- [EESC-LabRoM/HiveBoard](https://github.com/EESC-LabRoM/HiveBoard)
- [EESC-LabRoM/isaaclab-hiveboard](https://github.com/EESC-LabRoM/isaaclab-hiveboard)
- [hiveboard-bench.github.io](https://hiveboard-bench.github.io)

## Local development

```bash
npm install
npm run docs:dev
```

## Production build

```bash
npm run docs:build
```

The static output is written to `docs/.vitepress/dist`.

## GitHub Pages

The included workflow builds and deploys the site from the `main` branch. The prototype is configured for:

`https://ricardovgodoy.github.io/hiveboard-docs/`

When the documentation is migrated to the official website, update the VitePress `base` path and edit-link target in `docs/.vitepress/config.js`.

