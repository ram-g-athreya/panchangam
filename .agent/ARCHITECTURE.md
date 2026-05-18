# ARCHITECTURE.md

The app should be built using Typescript, React and Vite. The entry point is the `App.tsx` file.

## Folder Structure

- All code resides within the `src` folder
- Entry point of the application is `App.tsx`
- Images and fonts are located in the `assets` folder
- Reusable components such as header, navigation, buttons, etc. are specified in the `components` directory
- The `core` directory should contain the core Panchangam logic
- The `pages` directory specifies individual pages
- Stylesheets are placed inside the `styles` directory
- The `tests` directory contains all the tests associated with the project

## Routes

Following URL paths are supported in the application

- `/` which should map to `src/pages/DailyView.tsx`

## Tests
- The test files are located under the `tests` folder
- Each test case describes the parameters that need to be passed in to the function under test and all expected output should be verified within the same test

## Coding Conventions

- TypeScript strict mode is enabled. No `any` types without a comment explaining why.
- Use named exports (no default exports).
- For all functions ensure that the function parameters have proper types and the return type is explicitly defined.
- Define all `consts` at the top of a file after imports.