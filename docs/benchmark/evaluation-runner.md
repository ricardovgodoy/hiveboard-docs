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

Platform profiles can be reused across evaluations, and session backups can be imported on another computer. After all 13 conditions have five trials, the runner validates the records and creates a submission package with the result files and standardized external-camera video filenames.

<ClientOnly>
  <EvaluationRunner />
</ClientOnly>
