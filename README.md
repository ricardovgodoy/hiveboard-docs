# HiveBoard documentation

[Read the documentation](https://www.ricardovgodoy.com/hiveboard-docs/) · [Evaluation Runner](https://www.ricardovgodoy.com/hiveboard-docs/benchmark/evaluation-runner) · [Project website](https://hiveboard-bench.github.io)

This repository contains the HiveBoard documentation website and browser-based evaluation runner. It covers printing and assembly, task definitions, trial logging, result files, and simulation setup.

The documentation is maintained here for review before migration to the HiveBoard project website.

## Documentation

| Topic | Page |
|---|---|
| Printing and assembly | [Print the parts](https://www.ricardovgodoy.com/hiveboard-docs/hardware/printing) and [assemble the board](https://www.ricardovgodoy.com/hiveboard-docs/hardware/assembly) |
| Task definitions | [Module reference](https://www.ricardovgodoy.com/hiveboard-docs/hardware/modules) |
| Experimental procedure | [Evaluation protocol](https://www.ricardovgodoy.com/hiveboard-docs/benchmark/protocol) |
| Trial entries and results | [Record trials](https://www.ricardovgodoy.com/hiveboard-docs/benchmark/logging) and [report results](https://www.ricardovgodoy.com/hiveboard-docs/benchmark/results) |
| Simulation | [URDF and USD assets](https://www.ricardovgodoy.com/hiveboard-docs/simulation/assets) and [Isaac Lab integration](https://www.ricardovgodoy.com/hiveboard-docs/simulation/isaac-lab) |
| New mechanisms | [Add an attachment](https://www.ricardovgodoy.com/hiveboard-docs/guides/new-attachment) |

## Evaluation runner

The runner supports all **13 conditions, with five recorded trials per condition: 65 trials per complete evaluation**. The ball valve with and without the friction ring are separate conditions.

For each condition, the runner displays the success criterion, reset instructions, timeout, and an example video. A five-second countdown precedes the timer. The evaluator judges the outcome and records attempts, regrasps, strategy, failure cause, and completed stages where applicable.

Platform profiles and session backups can be exported as JSON and imported in another browser. Recorded trials are saved locally in the browser. Export a session backup before moving to another computer or clearing browser data.

The results ZIP becomes available when all 65 trial entries and required setup details pass validation. It contains:

| File | Contents |
|---|---|
| `trials.csv` | Trial records in the benchmark logging format |
| `platform.md` | Robot, end-effector, control interface, board orientation, printing details, and calibration notes |
| `manifest.json` | Submission ID, file references, trial counts, and expected recording filenames |
| `session.json` | Session backup for the runner |
| `recording-instructions.md` | External-camera recording instructions and filenames |
| `setup.jpg` | Setup photograph, if attached before export |
| `videos/` | Directory for the trial recordings, initially containing instructions |

Record every trial with an external camera. After extracting the ZIP, add the 65 recordings to `videos/` and add `setup.jpg` if it was not attached in the runner. Photographs and recordings are not included in JSON session backups.

“Trial records complete” refers to the log and setup fields. The runner does not review task success or video evidence. Online submission and public rankings are not implemented.

## Local development

Use Node.js 20 and npm, matching the GitHub Pages workflow.

```bash
git clone https://github.com/ricardovgodoy/hiveboard-docs.git
cd hiveboard-docs
npm ci
npm run docs:dev
```

Build and preview the static site:

```bash
npm run docs:build
npm run docs:preview
```

Run the evaluation runner regression tests:

```bash
node --test tests/evaluation-runner.test.mjs
```

The tests cover timer behavior, record validation, session imports, and ZIP contents. They do not exercise browser rendering or video playback.

## Source files

| Path | Contents |
|---|---|
| `docs/` | Documentation pages in Markdown |
| `docs/.vitepress/config.js` | Navigation, site URL paths, and VitePress configuration |
| `docs/.vitepress/theme/custom.css` | Documentation styles |
| `docs/.vitepress/theme/components/EvaluationRunner.vue` | Trial runner, validation, and exports |
| `docs/public/` | Images and other static assets |
| `tests/evaluation-runner.test.mjs` | Runner regression tests |
| `.github/workflows/deploy.yml` | Build and GitHub Pages deployment |

VitePress writes the production site to `docs/.vitepress/dist/`. GitHub Actions builds and deploys pushes to `main`.

The current site uses `/hiveboard-docs/` as its base path. When migrating it, update the base path and edit-link target in `docs/.vitepress/config.js`, the deployment configuration, and links to the documentation.

## Related repositories

- [EESC-LabRoM/HiveBoard](https://github.com/EESC-LabRoM/HiveBoard): printable parts, CAD models, URDF/USD assets, protocol, and trial templates.
- [EESC-LabRoM/isaaclab-hiveboard](https://github.com/EESC-LabRoM/isaaclab-hiveboard): Isaac Lab environments and training code.
- [hiveboard-bench/hiveboard-bench.github.io](https://github.com/hiveboard-bench/hiveboard-bench.github.io): project website, demonstration videos, and reported results.

When changing task criteria, timeouts, or CSV fields, check the source protocol and update the runner, documentation, and regression tests together.
