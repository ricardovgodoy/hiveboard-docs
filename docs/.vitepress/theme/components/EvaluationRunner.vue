<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const STORAGE_KEY = 'hiveboard-evaluation-runner-v1'
const REQUIRED_TRIALS = 5

const tasks = [
  {
    id: 'valve_ball', name: 'Ball valve', family: 'Torque', timeout: 60,
    image: '/images/tasks/torque_valve_noFriction_3d.png',
    success: 'Rotate the handle 90° from the closed state to the open state.',
    reset: 'Return the handle to the closed position and confirm that the attachment is fully seated.'
  },
  {
    id: 'valve_ball_ring', name: 'Ball valve with friction ring', family: 'Torque', timeout: 90,
    image: '/images/tasks/torque_valve_noFriction_3d.png',
    success: 'Rotate the handle 90° from closed to open with the friction ring fitted.',
    reset: 'Fit the friction ring, return the handle to closed, and confirm that the attachment is seated.'
  },
  {
    id: 'valve_gate_small', name: 'Small gate valve', family: 'Torque', timeout: 90,
    image: '/images/tasks/small_valve_3d.png',
    success: 'Complete one full turn of the valve stem.',
    reset: 'Return the stem to the marked initial orientation without changing the board position.'
  },
  {
    id: 'valve_gate_large', name: 'Large gate valve', family: 'Torque', timeout: 120,
    image: '/images/tasks/big_valve_3d.png',
    success: 'Complete one full turn of the valve stem.',
    reset: 'Return the stem to the marked initial orientation without changing the board position.'
  },
  {
    id: 'circuit_breaker', name: 'Circuit breaker', family: 'Torque', timeout: 60,
    image: '/images/tasks/switch_3d.png',
    success: 'Move the toggle to the opposite state and hold it there.',
    reset: 'Return the toggle to its initial state and confirm that it moves freely.'
  },
  {
    id: 'light_bulb', name: 'Light bulb and socket', family: 'Precision', timeout: 120,
    image: '/images/tasks/lamp_3d.png',
    success: 'Thread the bulb into the socket until it is seated.',
    reset: 'Remove the bulb, restore the documented starting pose, and inspect the thread.'
  },
  {
    id: 'thread_m8', name: 'M8 threaded fastener', family: 'Precision', timeout: 120,
    image: '/images/tasks/m8_3d.png',
    success: 'Thread the bolt along the available length.',
    reset: 'Return the bolt to the documented initial engagement and check that the thread is clear.'
  },
  {
    id: 'thread_m30', name: 'M30 threaded fastener', family: 'Precision', timeout: 120,
    image: '/images/tasks/m30_3d.png',
    success: 'Thread the bolt along the available length.',
    reset: 'Return the bolt to the documented initial engagement and check that the thread is clear.'
  },
  {
    id: 'peg_insertion', name: 'Threaded peg insertion', family: 'Precision', timeout: 120,
    image: '/images/tasks/peg_and_hole_3d.png',
    success: 'Thread the free 8 mm peg into the empty socket until it is seated.',
    reset: 'Remove the peg and return it to the initial pose next to the empty socket.'
  },
  {
    id: 'button', name: 'Covered button', family: 'Composed assembly', timeout: 60,
    image: '/images/tasks/button_3d.png',
    success: 'Open the cover and press the button.',
    reset: 'Close the cover and confirm that the button has returned.',
    stages: ['Open cover', 'Press button']
  },
  {
    id: 'lock', name: 'Lock and key', family: 'Composed assembly', timeout: 180,
    image: '/images/tasks/key_3d.png',
    success: 'Grasp the key, insert it vertically, and rotate it to unlock.',
    reset: 'Remove the key, return the lock to its initial state, and restore the key pose.',
    stages: ['Grasp key', 'Insert key vertically', 'Rotate to unlock']
  },
  {
    id: 'drawer', name: 'Sliding drawer', family: 'Composed assembly', timeout: 120,
    image: '/images/tasks/box_3d.png',
    success: 'Grasp the handle, pull the drawer open, and push it closed.',
    reset: 'Return the drawer to the fully closed initial position.',
    stages: ['Grasp handle', 'Pull open', 'Push closed']
  },
  {
    id: 'shock_absorber', name: 'Shock absorber', family: 'Composed assembly', timeout: 180,
    image: '/images/tasks/spring_3d.png',
    success: 'Grasp the pin, align it with the hole, and insert it fully.',
    reset: 'Remove the pin, restore its starting pose, and check both occupied board cells.',
    stages: ['Grasp pin', 'Align with hole', 'Insert fully']
  }
]

const emptySession = () => ({
  evaluation_mode: 'physical',
  lab_id: '',
  platform_id: '',
  robot_model: '',
  end_effector: '',
  control_method: '',
  board_orientation: 'horizontal',
  hiveboard_version: '',
  date: ''
})

const emptyTrialForm = () => ({
  outcome: 'success',
  failure_cause: '',
  n_attempts: 1,
  n_regrasps: 0,
  stage_reached: '',
  strategy: 'prehensile',
  notes: ''
})

const step = ref('setup')
const session = reactive(emptySession())
const selectedTaskId = ref(tasks[0].id)
const trials = ref([])
const timerState = ref('idle')
const countdown = ref(5)
const elapsedMs = ref(0)
const trialForm = reactive(emptyTrialForm())
const error = ref('')
const mounted = ref(false)
let ticker = null
let startMark = 0

const currentTask = computed(() => tasks.find(task => task.id === selectedTaskId.value) || tasks[0])
const currentTrials = computed(() => trials.value.filter(trial => trial.attachment_id === currentTask.value.id))
const currentTrialNumber = computed(() => Math.min(currentTrials.value.length + 1, REQUIRED_TRIALS))
const elapsedSeconds = computed(() => elapsedMs.value / 1000)
const displayTime = computed(() => formatTime(elapsedMs.value))
const sessionReady = computed(() => [
  session.lab_id, session.platform_id, session.robot_model, session.end_effector,
  session.control_method, session.hiveboard_version, session.date
].every(value => String(value).trim()))

function formatTime(ms) {
  const total = Math.max(0, ms) / 1000
  const minutes = Math.floor(total / 60)
  const seconds = (total % 60).toFixed(2).padStart(5, '0')
  return `${String(minutes).padStart(2, '0')}:${seconds}`
}

function clearTicker() {
  if (ticker) window.clearInterval(ticker)
  ticker = null
}

function beep(frequency = 660, duration = 0.08) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.08, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
    oscillator.addEventListener('ended', () => context.close())
  } catch (_) {}
}

function startSession() {
  error.value = ''
  if (!sessionReady.value) {
    error.value = 'Complete all required session fields before continuing.'
    return
  }
  const identifierPattern = /^[a-z0-9_]+$/
  if (!identifierPattern.test(session.lab_id.trim()) || !identifierPattern.test(session.platform_id.trim())) {
    error.value = 'Laboratory ID and platform ID may contain only lowercase letters, numbers, and underscores.'
    return
  }
  step.value = 'task'
}

function openTask(taskId) {
  selectedTaskId.value = taskId
  resetTimer()
  step.value = 'trial'
}

function startCountdown() {
  if (currentTrials.value.length >= REQUIRED_TRIALS) {
    step.value = 'review'
    return
  }
  error.value = ''
  countdown.value = 5
  timerState.value = 'countdown'
  beep(520)
  clearTicker()
  ticker = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value > 0) {
      beep(520)
    } else {
      clearTicker()
      startTimer()
    }
  }, 1000)
}

function startTimer() {
  timerState.value = 'running'
  elapsedMs.value = 0
  startMark = performance.now()
  beep(880, 0.16)
  ticker = window.setInterval(updateTimer, 50)
}

function updateTimer() {
  elapsedMs.value = performance.now() - startMark
  if (elapsedSeconds.value >= currentTask.value.timeout) {
    elapsedMs.value = currentTask.value.timeout * 1000
    finishTiming(true)
  }
}

function finishTiming(timedOut = false) {
  if (timerState.value !== 'running') return
  updateTimerOnce()
  clearTicker()
  if (timedOut) elapsedMs.value = currentTask.value.timeout * 1000
  Object.assign(trialForm, emptyTrialForm(), { outcome: timedOut ? 'timeout' : 'success' })
  timerState.value = 'form'
  beep(timedOut ? 360 : 740, 0.18)
}

function updateTimerOnce() {
  if (startMark) elapsedMs.value = Math.min(performance.now() - startMark, currentTask.value.timeout * 1000)
}

function cancelCountdown() {
  clearTicker()
  timerState.value = 'idle'
  countdown.value = 5
}

function resetTimer() {
  clearTicker()
  timerState.value = 'idle'
  countdown.value = 5
  elapsedMs.value = 0
  startMark = 0
  Object.assign(trialForm, emptyTrialForm())
  error.value = ''
}

function saveTrial() {
  error.value = ''
  const unsuccessful = trialForm.outcome !== 'success'
  if (unsuccessful && !trialForm.failure_cause) {
    error.value = 'Select one primary failure cause.'
    return
  }
  if (currentTask.value.stages && trialForm.stage_reached === '') {
    error.value = 'Record the last completed stage, including 0 if no stage was completed.'
    return
  }
  if (Number(trialForm.n_attempts) < 1 || Number(trialForm.n_regrasps) < 0) {
    error.value = 'Attempts must be at least 1 and regrasps cannot be negative.'
    return
  }

  const nextId = trials.value.reduce((max, trial) => Math.max(max, Number(trial.trial_id)), 0) + 1
  trials.value.push({
    trial_id: nextId,
    lab_id: session.lab_id.trim(),
    platform_id: session.platform_id.trim(),
    attachment_id: currentTask.value.id,
    date: session.date,
    outcome: trialForm.outcome,
    failure_cause: unsuccessful ? trialForm.failure_cause : '',
    completion_time_s: trialForm.outcome === 'success' ? elapsedSeconds.value.toFixed(2) : '',
    n_attempts: Number(trialForm.n_attempts),
    n_regrasps: Number(trialForm.n_regrasps),
    stage_reached: currentTask.value.stages ? Number(trialForm.stage_reached) : '',
    strategy: trialForm.strategy,
    notes: trialForm.notes.trim()
  })
  resetTimer()
  if (currentTrials.value.length >= REQUIRED_TRIALS) step.value = 'review'
}

function removeTrial(trialId) {
  if (!window.confirm('Remove this trial from the session?')) return
  trials.value = trials.value.filter(trial => trial.trial_id !== trialId)
}

function csvEscape(value) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function downloadCsv() {
  const columns = [
    'trial_id', 'lab_id', 'platform_id', 'attachment_id', 'date', 'outcome',
    'failure_cause', 'completion_time_s', 'n_attempts', 'n_regrasps',
    'stage_reached', 'strategy', 'notes'
  ]
  const rows = trials.value
    .slice()
    .sort((a, b) => a.trial_id - b.trial_id)
    .map(trial => columns.map(column => csvEscape(trial[column])).join(','))
  downloadFile(`hiveboard_${session.lab_id}_${session.date}.csv`, [columns.join(','), ...rows].join('\n') + '\n', 'text/csv;charset=utf-8')
}

function downloadPlatform() {
  const content = `# HiveBoard platform description

- Evaluation mode: ${session.evaluation_mode}
- Laboratory ID: ${session.lab_id}
- Platform ID: ${session.platform_id}
- Robot: ${session.robot_model}
- End-effector: ${session.end_effector}
- Control method or interface: ${session.control_method}
- Board orientation: ${session.board_orientation}
- HiveBoard version or commit: ${session.hiveboard_version}
- Evaluation date: ${session.date}
`
  downloadFile('platform.md', content, 'text/markdown;charset=utf-8')
}

function newSession() {
  if (trials.value.length && !window.confirm('Clear the saved session and all recorded trials?')) return
  clearTicker()
  Object.assign(session, emptySession(), { date: new Date().toISOString().slice(0, 10) })
  trials.value = []
  selectedTaskId.value = tasks[0].id
  step.value = 'setup'
  resetTimer()
  window.localStorage.removeItem(STORAGE_KEY)
}

function handleKey(event) {
  const target = event.target
  if (target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.tagName)) return
  if (event.code !== 'Space' || step.value !== 'trial') return
  event.preventDefault()
  if (timerState.value === 'idle') startCountdown()
  else if (timerState.value === 'running') finishTiming(false)
}

onMounted(() => {
  session.date = new Date().toISOString().slice(0, 10)
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.session) Object.assign(session, saved.session)
    if (Array.isArray(saved?.trials)) trials.value = saved.trials
    if (tasks.some(task => task.id === saved?.selectedTaskId)) selectedTaskId.value = saved.selectedTaskId
    if (['setup', 'task', 'trial', 'review'].includes(saved?.step)) step.value = saved.step
  } catch (_) {}
  mounted.value = true
  window.addEventListener('keydown', handleKey)
  document.addEventListener('visibilitychange', updateTimerOnce)
})

watch(
  () => ({ session: { ...session }, trials: trials.value, selectedTaskId: selectedTaskId.value, step: step.value }),
  value => {
    if (mounted.value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true }
)

onUnmounted(() => {
  clearTicker()
  window.removeEventListener('keydown', handleKey)
  document.removeEventListener('visibilitychange', updateTimerOnce)
})
</script>

<template>
  <div class="runner">
    <nav class="runner-steps" aria-label="Evaluation progress">
      <button v-for="(label, key) in { setup: '1. Setup', task: '2. Task', trial: '3. Trial', review: '4. Review' }"
        :key="key" :class="{ active: step === key }" type="button"
        :disabled="key !== 'setup' && !sessionReady" @click="step = key">
        {{ label }}
      </button>
    </nav>

    <section v-if="step === 'setup'" class="runner-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Session configuration</p>
          <h2>Describe the evaluation setup</h2>
        </div>
        <p>Required fields are marked with an asterisk. These values are reused in every trial row.</p>
      </div>

      <div class="form-grid">
        <label>Evaluation mode *
          <select v-model="session.evaluation_mode">
            <option value="physical">Physical board</option>
            <option value="simulation">Simulation</option>
          </select>
        </label>
        <label>Evaluation date *
          <input v-model="session.date" type="date">
        </label>
        <label>Laboratory ID *
          <input v-model="session.lab_id" placeholder="usp_crob" pattern="[a-z0-9_]+">
          <span>Lowercase letters, numbers and underscores.</span>
        </label>
        <label>Platform ID *
          <input v-model="session.platform_id" placeholder="franka_2f85" pattern="[a-z0-9_]+">
          <span>Robot and end-effector combination.</span>
        </label>
        <label>Robot model *
          <input v-model="session.robot_model" placeholder="Franka Research 3">
        </label>
        <label>End-effector *
          <input v-model="session.end_effector" placeholder="Robotiq 2F-85">
        </label>
        <label>Control method or interface *
          <input v-model="session.control_method" placeholder="Cartesian teleoperation">
        </label>
        <label>Board orientation *
          <select v-model="session.board_orientation">
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>
        <label class="wide">HiveBoard release or commit *
          <input v-model="session.hiveboard_version" placeholder="Release tag or full commit hash">
        </label>
      </div>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="actions"><button class="primary" type="button" @click="startSession">Select task</button></div>
    </section>

    <section v-else-if="step === 'task'" class="runner-section">
      <div class="section-heading">
        <div><p class="eyebrow">Task selection</p><h2>Select an attachment</h2></div>
        <p>Each condition requires five recorded trials.</p>
      </div>
      <div class="task-grid">
        <button v-for="task in tasks" :key="task.id" class="task-card" type="button" @click="openTask(task.id)">
          <img :src="withBase(task.image)" :alt="`${task.name} render`">
          <span class="task-card-body">
            <strong>{{ task.name }}</strong>
            <span>{{ task.family }} · {{ task.timeout }} s</span>
            <span class="task-count">{{ trials.filter(t => t.attachment_id === task.id).length }}/5 trials</span>
          </span>
        </button>
      </div>
      <div class="actions split">
        <button class="secondary" type="button" @click="step = 'setup'">Edit setup</button>
        <button v-if="trials.length" class="secondary" type="button" @click="step = 'review'">Review {{ trials.length }} recorded trials</button>
      </div>
    </section>

    <section v-else-if="step === 'trial'" class="runner-section">
      <div class="trial-heading">
        <div>
          <p class="eyebrow">{{ currentTask.family }} · {{ currentTask.timeout }} second timeout</p>
          <h2>{{ currentTask.name }}</h2>
          <p>Trial {{ currentTrialNumber }} of {{ REQUIRED_TRIALS }}</p>
        </div>
        <button class="secondary compact" type="button" @click="step = 'task'">Change task</button>
      </div>

      <div class="trial-layout">
        <div class="task-reference">
          <img :src="withBase(currentTask.image)" :alt="`${currentTask.name} reference render`">
          <dl>
            <div><dt>Success</dt><dd>{{ currentTask.success }}</dd></div>
            <div v-if="currentTask.stages"><dt>Stages</dt><dd>{{ currentTask.stages.join(' → ') }}</dd></div>
            <div><dt>Reset</dt><dd>{{ currentTask.reset }}</dd></div>
          </dl>
          <a href="https://hiveboard-bench.github.io/#Simulation-Compatibility" target="_blank" rel="noreferrer">Open the interactive simulation ↗</a>
        </div>

        <div class="timer-panel" :class="timerState">
          <p v-if="timerState === 'countdown'" class="countdown-label">Starting in</p>
          <div v-if="timerState === 'countdown'" class="countdown" aria-live="assertive">{{ countdown }}</div>
          <div v-else class="stopwatch" aria-live="polite">{{ displayTime }}</div>
          <p v-if="timerState === 'idle'">A five-second countdown gives the operator time to prepare.</p>
          <p v-else-if="timerState === 'running'">Timer running · automatic timeout at {{ currentTask.timeout }} seconds</p>
          <p v-else-if="timerState === 'form'">Timing stopped. Complete the trial record below.</p>

          <div v-if="timerState === 'idle'" class="timer-actions">
            <button class="primary large" type="button" @click="startCountdown">Start countdown</button>
            <span>Keyboard: Space</span>
          </div>
          <div v-else-if="timerState === 'countdown'" class="timer-actions">
            <button class="secondary" type="button" @click="cancelCountdown">Cancel</button>
          </div>
          <div v-else-if="timerState === 'running'" class="timer-actions">
            <button class="stop large" type="button" @click="finishTiming(false)">Stop timer</button>
            <span>Keyboard: Space</span>
          </div>
        </div>
      </div>

      <form v-if="timerState === 'form'" class="trial-form" @submit.prevent="saveTrial">
        <h3>Trial record</h3>
        <div class="form-grid">
          <label>Outcome *
            <select v-model="trialForm.outcome">
              <option value="success">Success</option>
              <option value="fail">Fail</option>
              <option value="timeout">Timeout</option>
              <option value="safety_stop">Safety stop</option>
            </select>
          </label>
          <label v-if="trialForm.outcome === 'success'">Completion time
            <input :value="elapsedSeconds.toFixed(2)" type="text" readonly>
            <span>Seconds, recorded by the timer.</span>
          </label>
          <label v-else>Primary failure cause *
            <select v-model="trialForm.failure_cause">
              <option value="" disabled>Select one</option>
              <option value="grasp_geometry">Grasp geometry</option>
              <option value="kinematic_limit">Kinematic limit</option>
              <option value="perception">Perception</option>
              <option value="slip">Slip</option>
              <option value="force_limit">Force limit</option>
              <option value="control_precision">Control precision</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>Attempts *
            <input v-model.number="trialForm.n_attempts" type="number" min="1" step="1">
          </label>
          <label>Regrasps *
            <input v-model.number="trialForm.n_regrasps" type="number" min="0" step="1">
          </label>
          <label>Strategy *
            <select v-model="trialForm.strategy">
              <option value="prehensile">Prehensile</option>
              <option value="non_prehensile">Non-prehensile</option>
            </select>
          </label>
          <label v-if="currentTask.stages">Last completed stage *
            <select v-model="trialForm.stage_reached">
              <option value="" disabled>Select stage</option>
              <option :value="0">0 — No stage completed</option>
              <option v-for="(stageName, index) in currentTask.stages" :key="stageName" :value="index + 1">{{ index + 1 }} — {{ stageName }}</option>
            </select>
          </label>
          <label class="wide">Notes
            <textarea v-model="trialForm.notes" rows="3" placeholder="Deviation, adjustment, damage, or other observation"></textarea>
          </label>
        </div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <div class="actions split">
          <button class="secondary" type="button" @click="resetTimer">Discard timing</button>
          <button class="primary" type="submit">Save trial</button>
        </div>
      </form>

      <div v-if="currentTrials.length" class="recorded-summary">
        <strong>{{ currentTrials.length }}/5 recorded</strong>
        <span v-for="n in REQUIRED_TRIALS" :key="n" :class="{ filled: n <= currentTrials.length }"></span>
      </div>
    </section>

    <section v-else class="runner-section">
      <div class="section-heading">
        <div><p class="eyebrow">Session review</p><h2>Recorded trials</h2></div>
        <p>Progress is stored only in this browser until the files are downloaded.</p>
      </div>

      <div v-if="!trials.length" class="empty-state">
        <p>No trials have been recorded.</p>
        <button class="primary" type="button" @click="step = 'task'">Select a task</button>
      </div>
      <template v-else>
        <div class="review-stats">
          <div><strong>{{ trials.length }}</strong><span>Total trials</span></div>
          <div><strong>{{ trials.filter(t => t.outcome === 'success').length }}</strong><span>Successful</span></div>
          <div><strong>{{ new Set(trials.map(t => t.attachment_id)).size }}</strong><span>Attachments</span></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Trial</th><th>Attachment</th><th>Outcome</th><th>Time (s)</th><th>Attempts</th><th>Regrasps</th><th></th></tr></thead>
            <tbody>
              <tr v-for="trial in trials" :key="trial.trial_id">
                <td>{{ trial.trial_id }}</td><td><code>{{ trial.attachment_id }}</code></td><td>{{ trial.outcome }}</td>
                <td>{{ trial.completion_time_s || '—' }}</td><td>{{ trial.n_attempts }}</td><td>{{ trial.n_regrasps }}</td>
                <td><button class="text-button" type="button" @click="removeTrial(trial.trial_id)">Remove</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="actions split wrap">
          <div><button class="secondary" type="button" @click="step = 'task'">Record another task</button></div>
          <div class="download-actions">
            <button class="secondary" type="button" @click="downloadPlatform">Download platform.md</button>
            <button class="primary" type="button" @click="downloadCsv">Download trials.csv</button>
          </div>
        </div>
      </template>
      <div class="new-session"><button class="text-button" type="button" @click="newSession">Start a new session</button></div>
    </section>
  </div>
</template>

<style scoped>
.runner { margin: 1.5rem 0 3rem; border: 1px solid #dfe2e5; background: #fff; color: #24292f; }
.runner-steps { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid #dfe2e5; background: #f7f8fa; }
.runner-steps button { padding: .8rem .6rem; border: 0; border-right: 1px solid #dfe2e5; background: transparent; color: #57606a; font: inherit; font-size: .86rem; text-align: center; }
.runner-steps button:last-child { border-right: 0; }
.runner-steps button.active { box-shadow: inset 0 -3px #23527c; background: #fff; color: #183b5b; font-weight: 600; }
.runner-steps button:disabled { color: #9ca3af; cursor: not-allowed; }
.runner-section { padding: 1.5rem; }
.section-heading, .trial-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; }
.section-heading > p { max-width: 420px; margin: .25rem 0 0; color: #57606a; font-size: .9rem; }
.eyebrow { margin: 0 0 .25rem; color: #57606a; font-size: .76rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.runner h2 { margin: 0; padding: 0; border: 0; font-size: 1.35rem; }
.runner h3 { margin-top: 0; font-size: 1.08rem; }
.trial-heading p:last-child { margin: .35rem 0 0; color: #57606a; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.25rem; }
label { display: flex; flex-direction: column; gap: .38rem; color: #34414d; font-size: .88rem; font-weight: 600; }
label span { color: #6e7781; font-size: .76rem; font-weight: 400; }
input, select, textarea { box-sizing: border-box; width: 100%; min-height: 42px; padding: .58rem .68rem; border: 1px solid #c7cdd3; border-radius: 2px; background: #fff; color: #24292f; font: inherit; font-size: 1rem; }
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus, button:focus-visible { outline: 3px solid rgba(35, 82, 124, .18); outline-offset: 1px; border-color: #23527c; }
.wide { grid-column: 1 / -1; }
.actions { display: flex; justify-content: flex-end; gap: .7rem; margin-top: 1.25rem; }
.actions.split { justify-content: space-between; }
.actions.wrap { flex-wrap: wrap; }
.download-actions { display: flex; flex-wrap: wrap; gap: .7rem; }
button { cursor: pointer; }
button.primary, button.secondary, button.stop { min-height: 42px; padding: .55rem 1rem; border-radius: 2px; font: inherit; font-size: .9rem; font-weight: 600; }
button.primary { border: 1px solid #23527c; background: #23527c; color: #fff; }
button.primary:hover { background: #183b5b; }
button.secondary { border: 1px solid #aeb6bf; background: #fff; color: #263746; }
button.secondary:hover { background: #f3f4f6; }
button.stop { border: 1px solid #9b2c2c; background: #9b2c2c; color: #fff; }
button.large { min-width: 190px; min-height: 50px; font-size: 1rem; }
button.compact { min-height: 36px; padding: .35rem .75rem; }
.form-error { margin: 1rem 0 0; padding: .65rem .8rem; border-left: 3px solid #b42318; background: #fff1f0; color: #7a271a; font-size: .88rem; }
.task-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .85rem; }
.task-card { overflow: hidden; padding: 0; border: 1px solid #d6d9dd; border-radius: 2px; background: #fff; color: inherit; text-align: left; }
.task-card:hover { border-color: #23527c; box-shadow: 0 2px 8px rgba(31, 41, 51, .08); }
.task-card img { display: block; width: 100%; aspect-ratio: 16 / 8; object-fit: cover; border-bottom: 1px solid #e5e7eb; background: #f7f8fa; }
.task-card-body { display: grid; gap: .2rem; padding: .72rem .78rem .8rem; }
.task-card-body strong { font-size: .92rem; }
.task-card-body > span { color: #6e7781; font-size: .78rem; }
.task-card-body .task-count { margin-top: .25rem; color: #23527c; font-weight: 600; }
.trial-layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr); gap: 1.25rem; }
.task-reference { padding: 1rem; border: 1px solid #dfe2e5; background: #fafbfc; }
.task-reference img { display: block; width: 100%; aspect-ratio: 16 / 8.5; object-fit: cover; border: 1px solid #e1e4e8; background: #fff; }
.task-reference dl { margin: 1rem 0; }
.task-reference dl div { display: grid; grid-template-columns: 76px 1fr; gap: .75rem; padding: .58rem 0; border-bottom: 1px solid #e1e4e8; }
.task-reference dt { font-size: .78rem; font-weight: 700; text-transform: uppercase; }
.task-reference dd { margin: 0; font-size: .88rem; line-height: 1.55; }
.task-reference a { font-size: .84rem; }
.timer-panel { display: flex; min-height: 330px; padding: 1.25rem; border: 1px solid #cfd5db; align-items: center; justify-content: center; flex-direction: column; text-align: center; }
.timer-panel.running { border-color: #23527c; background: #f7fbff; }
.stopwatch, .countdown { color: #172b3a; font-variant-numeric: tabular-nums; line-height: 1; }
.stopwatch { font-family: var(--vp-font-family-mono); font-size: clamp(2.7rem, 7vw, 4.4rem); letter-spacing: -.06em; }
.countdown { font-size: 6rem; font-weight: 600; }
.countdown-label { margin-bottom: .6rem; text-transform: uppercase; letter-spacing: .08em; }
.timer-panel > p { max-width: 360px; color: #57606a; font-size: .86rem; }
.timer-actions { display: flex; margin-top: 1.2rem; align-items: center; gap: .8rem; flex-direction: column; }
.timer-actions span { color: #6e7781; font-size: .76rem; }
.trial-form { margin-top: 1.25rem; padding: 1.25rem; border: 1px solid #dfe2e5; background: #fafbfc; }
.recorded-summary { display: flex; margin-top: 1rem; align-items: center; gap: .45rem; color: #57606a; font-size: .82rem; }
.recorded-summary strong { margin-right: .3rem; }
.recorded-summary span { width: 24px; height: 5px; background: #dfe2e5; }
.recorded-summary span.filled { background: #23527c; }
.review-stats { display: grid; grid-template-columns: repeat(3, 1fr); margin-bottom: 1rem; border: 1px solid #dfe2e5; }
.review-stats div { display: flex; padding: 1rem; border-right: 1px solid #dfe2e5; flex-direction: column; }
.review-stats div:last-child { border-right: 0; }
.review-stats strong { font-size: 1.5rem; }
.review-stats span { color: #6e7781; font-size: .78rem; }
.table-wrap { overflow-x: auto; border: 1px solid #dfe2e5; }
.table-wrap table { display: table; width: 100%; margin: 0; border: 0; font-size: .84rem; }
.table-wrap th, .table-wrap td { white-space: nowrap; }
.text-button { padding: .2rem; border: 0; background: transparent; color: #23527c; font: inherit; font-size: .82rem; text-decoration: underline; }
.empty-state { padding: 2rem; border: 1px dashed #b8c0c8; text-align: center; }
.new-session { margin-top: 1.4rem; padding-top: .8rem; border-top: 1px solid #e5e7eb; text-align: right; }

@media (max-width: 900px) {
  .task-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .trial-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .runner-section { padding: 1rem; }
  .runner-steps button { padding: .7rem .25rem; font-size: .74rem; }
  .section-heading, .trial-heading { flex-direction: column; gap: .7rem; }
  .form-grid, .task-grid { grid-template-columns: 1fr; }
  .wide { grid-column: auto; }
  .actions.split { align-items: stretch; flex-direction: column; }
  .download-actions { flex-direction: column; }
  .review-stats { grid-template-columns: 1fr; }
  .review-stats div { border-right: 0; border-bottom: 1px solid #dfe2e5; }
  .review-stats div:last-child { border-bottom: 0; }
}
</style>
