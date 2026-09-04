---
layout: home

hero:
  name: HiveBoard Documentation
  text: Build, simulate, and evaluate the benchmark
  tagline: A practical guide to reproducing HiveBoard, running its common evaluation protocol, and using the same mechanisms in simulation.
  image:
    src: /images/hiveboard-preview.webp
    alt: HiveBoard with interchangeable manipulation modules
  actions:
    - theme: brand
      text: Choose a workflow
      link: /getting-started/quick-start
    - theme: alt
      text: Browse the modules
      link: /hardware/modules

features:
  - icon: 🖨️
    title: Reproduce the hardware
    details: Download the printable parts, apply the recommended print profile, and verify the press-fit interface before producing the full board.
    link: /hardware/printing
    linkText: Printing guide
  - icon: 📋
    title: Run comparable trials
    details: Follow one protocol for task success, timeouts, stage-wise scoring, failure causes, and trial logging.
    link: /benchmark/protocol
    linkText: Evaluation protocol
  - icon: ◈
    title: Work in simulation
    details: Understand the articulated asset formats, nominal physical parameters, and the separate Isaac Lab integration.
    link: /simulation/assets
    linkText: Simulation guide
---

## Start with your goal

<div class="workflow-grid">
  <a class="workflow-card" href="./hardware/printing">
    <span class="step">1</span>
    <strong>Build a physical HiveBoard</strong>
    <span>Print the base and attachments, check tolerances, assemble the mechanisms, and mount the board.</span>
  </a>
  <a class="workflow-card" href="./benchmark/protocol">
    <span class="step">2</span>
    <strong>Evaluate a platform</strong>
    <span>Prepare the setup, run five trials per attachment, and record results using the shared template.</span>
  </a>
  <a class="workflow-card" href="./simulation/assets">
    <span class="step">3</span>
    <strong>Use the digital benchmark</strong>
    <span>Load the articulated assets or start from the dedicated Isaac Lab implementation.</span>
  </a>
</div>

## What is HiveBoard?

HiveBoard is an open, modular, fully 3D-printable benchmark for manipulation of functional mechanisms. Its interchangeable attachments cover rotational, threaded, insertion, linear, and multi-stage tasks. The same artifact and protocol can be used with robot grippers, dexterous hands, teleoperated systems, and worn prosthetic hands.

This documentation is the operational companion to the [project website](https://hiveboard-bench.github.io). The project page presents the research and results; these pages explain how to reproduce and use the benchmark.

::: warning Prototype documentation
This is a review copy maintained in Ricardo Godoy's personal repository. The canonical parts, assets, and protocol remain in the [HiveBoard repository](https://github.com/EESC-LabRoM/HiveBoard).
:::

