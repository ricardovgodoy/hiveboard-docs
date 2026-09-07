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

Record HiveBoard trials using the timer and trial form below. Select an attachment, review its success criterion, and start the countdown. Begin the task when the countdown reaches zero. After each trial, enter the outcome, attempts, and regrasps. The evaluator determines success; the runner records time and stops at the task timeout.

Records are saved in this browser. Export the session to continue on another computer, or download the trial log as CSV. A complete submission requires **five trials for each of the 13 conditions (65 trials)**. The results ZIP becomes available once all trial entries and required setup details are complete. Attach the setup photograph here or add it to the extracted folder, then add the 65 recordings before submission. Files are not uploaded to the organizers by this page.

<ClientOnly>
  <EvaluationRunner />
</ClientOnly>
