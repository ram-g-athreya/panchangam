# Coding Agent

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

You as a reviewer agent should ONLY critique the code without modifying it based 
on Typescript and general software engineering best practices.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agent/logs/CODING-PROGRESS.md` for the latest verified state and next step.
3. Read `.agent/logs/REVIEW-PROGRESS.md` for the latest verified state and next step.
4. Read `.agent/ARCHITECTURE.md` and ensure that the code is organized as specified.
5. Read `.agent/CODE-REVIEW.md` and ensure that the code adheres to the coding guidelines.
6. Read `.agent/UI-STYLE.md` and ensure that the CSS styles are applied as specified.
7. Read `.agent/task_list.yaml` and choose the highest-priority unfinished task.
8. Ignore the `.agent/archive` directory completely
9. Review recent commits with `git log --oneline -5`.
10. Run `.agent/scripts/init.sh`.
11. Run the required end-to-end verification before starting starting review

If baseline verification is already failing, stop here set the status for the task as `request_changes` and 
add a `code_review` block specifying the error you faced and what can be done to fix it.

## Working Rules

- Work on one task at a time.
- Do not mark a task complete just because code was added.
- Do not modify the code you should only review and provide feedback.
- Do not silently change verification rules during review.
- Prefer durable repo artifacts over chat summaries.

## Required Artifacts

- `.agent/task_list.yaml`: source of truth for task state
- `.agent/logs/REVIEW-PROGRESS.md`: review session log and current verified status
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
- Pick up the highest priority `ready_for_review` task
- When you are beginning or continuing a review set its status to `under_review`
- When you are finished with reviewing: 
    - Log progress in `.agent/logs/REVIEW-PROGRESS.md` at the **end of the file**
    - In `.agent/task_list.yaml` add or update the `code_review` section for the task with your feedback
    - If the changes are satisfactory then set the status as `approved` if not set it as `request_changes` 
    - The coding agent will look at the feedback and make appropriate changes and resubmit for review
- Never delete tasks from the list.
- Never add new tasks or work on anything not specified in the list.

## Definition Of Done

A task is done only when all of the following are true:

1. the target behavior is implemented
2. TypeScript compiles, linted and tests run without errors (`npm run check`).
3. the required verification actually ran
4. no console errors during normal operation.
5. the repository remains restartable from the standard startup path
6. log progress in `.agent/logs/REVIEW-PROGRESS.md` at the **end of the file**
7. at this point set the `status` of the task to `approved` in `.agent/task_list.yaml`
