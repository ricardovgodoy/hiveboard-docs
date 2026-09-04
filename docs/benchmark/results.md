# Report results

Report performance per attachment and preserve the trial-level data. Aggregate values alone hide the failure modes and stage progression that make the benchmark informative.

## Recommended metrics

| Metric | Calculation | Report for |
|---|---|---|
| Success rate | Successful trials ÷ recorded trials | Every attachment |
| Completion time | Median and individual successful-trial times | Every attachment with successes |
| Attempts | Median and individual counts | Every attachment |
| Regrasps | Median and individual counts | Every attachment |
| Stage completion | Fraction reaching each stage | Composed tasks |
| Failure distribution | Count by primary failure cause | Unsuccessful trials |
| Strategy distribution | Count of prehensile and non-prehensile trials | Every attachment |

With five trials per attachment, always show the numerator and denominator—for example, `4/5 (80%)`—rather than only a percentage.

## Keep conditions separate

Do not merge results across:

- different end-effectors;
- different control interfaces or policies;
- horizontal and vertical board mounting;
- ball valve trials with and without the friction ring;
- materially different print settings or modified parts; or
- simulation and physical trials.

## Accompanying files

A shareable result package should contain:

```text
result-package/
├── trials.csv
├── setup.jpg
└── platform.md
```

The platform description should identify the robot, end-effector, control method, board orientation, relevant calibration, HiveBoard version, and any deviations from the protocol.

## Interpretation

HiveBoard exposes different constraints across attachments. A low score can indicate incompatible grasp geometry, insufficient force, kinematic limits, perception difficulty, slip, or insufficient control precision. Report these causes instead of interpreting every unsuccessful trial as the same type of failure.

Comparisons between platforms should state which factors differ. The protocol characterizes the complete manipulation platform and should not be used to attribute a result to the gripper, robot, controller, or operator in isolation without a controlled experiment.

