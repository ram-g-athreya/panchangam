# AGENTS.md

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agent/AGENT-PROGRESS.md` for the latest verified state and next step.
3. Read `.agent/ARCHITECTURE.md` and ensure that the code is organized as specified.
4. Read `.agent/UI-STYLE.md` and ensure that the CSS styles are applied as specified.
5. Read `.agent/task_list.yaml` and choose the highest-priority unfinished task.
6. Review recent commits with `git log --oneline -5`.
7. Run `./init.sh`.
8. Run the required smoke or end-to-end verification before starting new work.

If baseline verification is already failing, fix that first. Do not stack new
task work on top of a broken starting state.

## Working Rules

- Work on one task at a time.
- Do not mark a task complete just because code was added.
- Keep changes within the selected task scope unless a blocker forces a narrow supporting fix.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.

## Required Artifacts

- `.agent/task_list.yaml`: source of truth for task state
- `.agent/AGENT-PROGRESS.md`: session log and current verified status
- `init.sh`: standard startup and verification path

## Definition Of Done

A task is `done` only when all of the following are true:

- the target behavior is implemented
- TypeScript compiles, linted and tests run without errors (`npm run check`).
- the required verification actually ran
- evidence is recorded in `.agent/task_list.yaml` with status `passing`. Also log progress in `.agent/AGENT-PROGRESS.md` at the **end of the file**
- no console errors during normal operation.
- the repository remains restartable from the standard startup path

## Working with the task List

The `task_list.yaml` file is the source of truth for project progress:

- Each task has a `status`: `"passing"`, `"failing"`, `"not-started"`.
- When implementing a task, update its status to `"passing"` with evidence.
- If a task is blocked, set status to `"blocked"` with a reason.
- Never delete tasks from the list.
- Never add new tasks or work on anything not specified in the list.

## End Of Session

Before ending a session:

1. Append your progress log to the end of `.agent/AGENT-PROGRESS.md`.
2. Update `.agent/task_list.yaml`.
3. Record any unresolved risk or blocker.
4. Leave the repo clean enough for the next session to run `./init.sh` immediately.
5. Prompt to commit the changes with a suitable commit message
