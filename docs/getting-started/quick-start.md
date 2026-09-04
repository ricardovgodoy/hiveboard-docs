# Choose a workflow

HiveBoard supports physical evaluation, direct use of articulated assets, and learning-based simulation. Begin with the path that matches your goal.

## Build the physical benchmark

Use this route if you want to evaluate a robot, gripper, hand, prosthesis, or teleoperation system on the printed artifact.

1. Review the [printing requirements](/hardware/printing).
2. Print one base cell and one attachment to check the press fit.
3. Print and [assemble the full benchmark](/hardware/assembly).
4. Select the modules relevant to your evaluation from the [module reference](/hardware/modules).
5. Follow the [evaluation protocol](/benchmark/protocol).
6. Record the trials with the supplied [CSV or XLSX template](/benchmark/logging).

## Evaluate an existing board

Use this route when the hardware is already available.

1. Check every attachment for damage, free motion, and secure seating.
2. Fix the base to a rigid surface and document its orientation.
3. Read the task-specific success criteria and timeouts.
4. Complete familiarization before recording.
5. Run five recorded trials for every selected attachment.
6. Validate and report the results using the reproducibility checklist.

Go directly to the [evaluation protocol](/benchmark/protocol).

## Work in simulation

Choose between two levels of support:

- **Articulated assets:** use the URDF or USD files from the main repository in your own simulator or robotics stack.
- **Isaac Lab environment:** use the dedicated repository for training and evaluation workflows built around Isaac Lab.

Read [Simulation assets](/simulation/assets) before selecting the implementation. The physical and simulation parameters should be reported separately because friction, contact, and press-fit behavior vary between printed instances.

## Minimum reporting package

A physical benchmark result should identify:

- the HiveBoard release or commit;
- printer, material, and any post-processing;
- board mounting orientation;
- robot and end-effector;
- control interface or policy;
- the completed trial log; and
- any broken, replaced, or reseated parts.

