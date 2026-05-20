# Code Review Guidelines

## Core Operating Philosophy
- **High Signal-to-Noise Ratio**: Focus exclusively on logic errors, edge cases, data leaks, performance bottlenecks, and security flaws. Never comment on code formatting, missing semicolons, or trailing whitespace (assume the linting pipeline handles this).
- **Be Constructive, Not Pedantic**: Frame feedback as "Consider alternative X because of Y impact," rather than "This is wrong."
- **Acknowledge Intent**: If a change looks weird but is accompanied by an explanatory code comment or clear PR description, do not flag it as an error unless it is objectively broken.

## General Code Review Guidelines
- **Control Flow & State Bloat**: Look for deeply nested if/else blocks. Suggest early returns to keep functions flat and readable.
- **Magic Values & Hardcoding**: Flag any raw strings, numbers, or secret keys. Ensure they are extracted into centralized configuration objects, constants, or environment variables.
- **Error Handling**: Ensure async operations are safely wrapped in try/catch blocks or use explicit catch handlers. Check that errors are logged or surfaced cleanly, not just silenced.
- **Data Validation**: Verify that incoming untrusted data (from user inputs or external APIs) is properly sanitized or validated before processing.
- **Crisp Actionable Feedback**: Ensure that the feedback is short and actionable. Reference specific files or functions that need to be changed wherever possible and provide actionable feedback
- **DRY (Don't Repeat Yourself)**: If there are repeating or refactorable code blocks then provide appropriate feedback to do so.