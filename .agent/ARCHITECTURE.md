# ARCHITECTURE.md

The app should be built using Typescript, React and Vite. The entry point is the `App.tsx` file.

## Folder Structure

- All code resides within the `src` folder
- Entry point of the application is `App.tsx`
- Images and fonts are located in the `assets` folder
- Reusable components such as header, buttons, etc. are specified in the `components` directory
- The `core` directory should contain the core Panchangam logic
- The `pages` directory specifies individual pages
- Stylesheets are placed inside the `styles` directory

## Coding Conventions

- TypeScript strict mode is enabled. No `any` types without a comment explaining why.
- Use named exports (no default exports).
