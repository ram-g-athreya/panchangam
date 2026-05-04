# AGENTS.md

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agent/AGENT-PROGRESS.md` for the latest verified state and next step.
3. Read `.agent/ARCHITECTURE.md` and ensure that the code is organized as specified.
4. Read `.agent/task_list.yaml` and choose the highest-priority unfinished feature.
5. Review recent commits with `git log --oneline -5`.
6. Run `./init.sh`.
7. Run the required smoke or end-to-end verification before starting new work.

If baseline verification is already failing, fix that first. Do not stack new
feature work on top of a broken starting state.

## Working Rules

- Work on one feature at a time.
- Do not mark a feature complete just because code was added.
- Keep changes within the selected feature scope unless a blocker forces a narrow supporting fix.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.

## Required Artifacts

- `.agent/task_list.yaml`: source of truth for feature state
- `.agent/AGENT-PROGRESS.md`: session log and current verified status
- `init.sh`: standard startup and verification path
- `session-handoff.md`: optional compact handoff for larger sessions

## Definition Of Done

A feature is `done` only when all of the following are true:

- the target behavior is implemented
- TypeScript compiles without errors (`npm run check`).
- the required verification actually ran
- evidence is recorded in `.agent/task_list.yaml` with status `pass`. Also log progress in `.agent/AGENT-PROGRESS.md`
- no console errors during normal operation.
- the repository remains restartable from the standard startup path

## Working with the Feature List

The `task_list.yaml` file is the source of truth for project progress:

- Each feature has a `status`: `"pass"`, `"fail"`, `"not-started"`.
- When implementing a feature, update its status to `"pass"` with evidence.
- If a feature is blocked, set status to `"fail"` with a reason.
- Never delete features from the list.

## End Of Session

Before ending a session:

1. Update `.agent/AGENT-PROGRESS.md`.
2. Update `.agent/task_list.yaml`.
3. Record any unresolved risk or blocker.
4. Commit with a descriptive message once the work is in a safe state.
5. Leave the repo clean enough for the next session to run `./init.sh`
   immediately.
