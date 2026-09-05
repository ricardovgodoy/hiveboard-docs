---
aside: false
pageClass: runner-page
title: Evaluation Runner
description: Run HiveBoard trials and export a protocol-compatible CSV in the browser.
---

<script setup>
import EvaluationRunner from '../.vitepress/theme/components/EvaluationRunner.vue'
</script>

# Evaluation Runner

Use this page while running a HiveBoard evaluation. It guides each trial, applies the task timeout and success criteria, and exports a CSV compatible with the benchmark logging format. Session data remains in this browser and is not submitted to the organizers.

<ClientOnly>
  <EvaluationRunner />
</ClientOnly>

The web timer is provided for convenience. Use synchronized robot-side timestamps when the experimental system already records them reliably.
