# Isaac Lab integration

<span class="status-pill">Pre-release integration</span>

The dedicated [Isaac Lab repository](https://github.com/EESC-LabRoM/isaaclab-hiveboard) is intended for runnable learning and evaluation workflows built around the HiveBoard assets.

::: warning Repository access
The Isaac Lab repository may be restricted while the integration is being prepared. Exact installation commands and version pins should be copied from its tested environment before this page becomes canonical.
:::

## What this integration should define

A reproducible HiveBoard environment should make the following items explicit:

| Component | Required information |
|---|---|
| Isaac versions | Compatible Isaac Sim and Isaac Lab versions |
| Robot | Supported embodiment and end-effector configuration |
| Scene | Board pose, active module, lighting, and cameras |
| Observations | Proprioception, images, depth, mechanism state, or privileged state |
| Actions | Joint, Cartesian, gripper, or policy-specific command space |
| Reset | Robot pose, mechanism state, object randomization, and seeds |
| Success | Task-specific completion test aligned with the physical protocol |
| Termination | Success, timeout, invalid state, or safety condition |
| Metrics | Success, episode length, stage progression, and failure information |

## Recommended first run

Once the repository is public and versioned, the first tutorial should provide one copyable path:

1. install the tested Isaac Lab release;
2. clone the HiveBoard integration;
3. register or install the extension;
4. list the available environments;
5. launch one environment with a single instance;
6. run a zero-action or scripted smoke test; and
7. launch the same task in headless vectorized mode.

The tutorial should use one attachment throughout instead of switching scenes between steps.

## Aligning simulation and physical evaluation

Use the same task names and success definitions where practical, but report simulation separately. The physical protocol uses operator-driven recorded trials and includes effects that may not be represented by the simulator, including press-fit release, printed-part damage, and manufacturing variation.

For a simulation result, report:

- repository commit;
- Isaac Sim and Isaac Lab versions;
- robot and end-effector;
- number of parallel environments;
- number and selection of evaluation seeds;
- observation and action spaces;
- reset distribution;
- reward definition; and
- success and termination checks.

## Documentation completion checklist

Before merging this prototype into the official documentation:

- [ ] Verify public repository access.
- [ ] Add a tested compatibility table.
- [ ] Add exact installation commands.
- [ ] Add the registered environment IDs.
- [ ] Add one command for interactive evaluation.
- [ ] Add one command for headless training.
- [ ] Link task configuration and success-check source files.
- [ ] Include a short troubleshooting section for common Isaac version mismatches.

