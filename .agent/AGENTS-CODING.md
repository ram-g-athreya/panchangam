# Coding Agent

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

You as a coding agent need to implement the feature based on Typescript and general 
software engineering best practices.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agent/logs/CODING-PROGRESS.md` for the latest verified state and next step.
3. Read `.agent/ARCHITECTURE.md` and ensure that the code is organized as specified.
4. Read `.agent/UI-STYLE.md` and ensure that the CSS styles are applied as specified.
5. Read `.agent/task_list.yaml` and choose the highest-priority unfinished task.
6. Ignore the `.agent/archive` directory completely
7. Review recent commits with `git log --oneline -5`.
8. Run `.agent/scripts/init.sh`.
9. Run the required end-to-end verification before starting new work.

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
- `.agent/logs/CODING-PROGRESS.md`: coding session log and current verified status
- `.agent/scripts/init.sh`: standard startup and verification path

## Working with the task List

The `task_list.yaml` file is the source of truth for project progress:

- Each task can have any one of the the following `status`: 
    - `not_started`
    - `in_progress`
    - `ready_for_review`
    - `under_review`
    - `changes_requested`
    - `approved`
    - `done`
- Pick up the highest priority `not_started` task first, if none are available pick the highest priority `changes_requested` task
- When you are beginning or continuing a task set its status to `in_progress`
- When you are finished with your changes: 
    - Run verification (`npm run check`) and see if everything works fine. If not, **fix the issues** and try again
    - If verification passes: 
        - Log progress in `.agent/logs/CODING-PROGRESS.md` at the **end of the file**
        - Evidence is recorded in `.agent/task_list.yaml` with status `ready_for_review`        
        - The reviewer agent will look at the work done and provide review if any
- Never delete tasks from the list.
- Never add new tasks or work on anything not specified in the list.

## Definition Of Done

A task is done only when all of the following are true:

- the target behavior is implemented
- TypeScript compiles, linted and tests run without errors (`npm run check`).
- the required verification actually ran
- no console errors during normal operation.
- the repository remains restartable from the standard startup path
- the reviewer has set the status to `approved`
- At this point, update `.agent/task_list.yaml` with status `done`.
- Prompt to commit the changes with a suitable commit message
