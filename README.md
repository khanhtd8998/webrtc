# 📦 Dependencies

| Package                        | Version   | Description                                                       |
|--------------------------------|-----------|-------------------------------------------------------------------|
| @hookform/resolvers            | ^5.2.2    | Validation resolvers for react-hook-form (works with Zod/Yup)     |
| antd                           | ^6.1.4    | Ant Design UI library (components, layout, forms)                 |
| lucide-react                   | ^0.562.0  | Modern SVG icon library for React                                 |
| react                          | ^19.2.0   | Core React library for building UI                                |
| react-dom                      | ^19.2.0   | React DOM renderer, connects React to browser                     |
| react-hook-form                | ^7.70.0   | Lightweight form management library                               |
| react-router                   | ^7.11.0   | Routing library for React (navigation between pages)              |
| zod                            | ^4.3.5    | TypeScript-first schema validation                                |
| zustand                        | ^5.0.9    | Simple state management library for React                         |

# 🛠️ DevDependencies

| Package                        | Version   | Description                                                       |
|--------------------------------|-----------|-------------------------------------------------------------------|
| @eslint/js                     | ^9.39.1   | ESLint core rules for JavaScript                                  |
| @types/node                    | ^24.10.1  | TypeScript type definitions for Node.js                           |
| @types/react                   | ^19.2.5   | TypeScript type definitions for React                             |
| @types/react-dom               | ^19.2.3   | TypeScript type definitions for React DOM                         |
| @vitejs/plugin-react-swc       | ^4.2.2    | Vite plugin for fast React compilation using SWC                  |
| eslint                         | ^9.39.1   | Linting tool for JavaScript/TypeScript                            |
| eslint-plugin-react-hooks      | ^7.0.1    | ESLint rules for React hooks usage                                |
| eslint-plugin-react-refresh    | ^0.4.24   | ESLint rules for React Fast Refresh                               |
| globals                        | ^16.5.0   | Provides global variables definitions for ESLint                  |
| typescript                     | ~5.9.3    | TypeScript compiler                                               |
| typescript-eslint              | ^8.46.4   | ESLint plugin + parser for TypeScript                             |
| vite                           | ^7.2.4    | Next-generation frontend build tool (bundler + dev server)        |

# 📜 Scripts

| Script        | Command                                                | Description                                      |
|---------------|--------------------------------------------------------|--------------------------------------------------|
| dev           | vite --host                                            | Start local development server with Vite         |
| build         | tsc -b && vite build                                   | Compile TypeScript and build production bundle   |
| lint          | eslint .                                               | Run ESLint to check code quality                 |
| preview       | vite preview                                           | Preview production build locally                 |
| lint:fix      | eslint . --fix                                         | Auto-fix linting issues                          |
| prettier      | prettier --check "src/**/(*.tsx\|*.ts\|*.css\|*.scss)" | Check code formatting with Prettier              |
| prettier:fix  | prettier --write "src/**/(*.tsx\|*.ts\|*.css\|*.scss)" | Auto-format code with Prettier                   |


# Project Structure

src/
├── assets/                # static files (images, icons, etc.)
├── components/            # reusable UI parts
│   ├── LoadingOverlay.tsx
│   ├── NotificationSection.tsx
│   ├── ToggleMediaButton.tsx
│   └── VideoPreview.tsx
├── hooks/                 # custom React hooks
│   ├── MediaStream/
│   └── useMediaDevices.ts
├── layout/                # app layouts
│   └── ProtectedLayout.tsx
├── pages/                 # main screens
│   ├── MeetingScreenPage/ # meeting UI
│   ├── PreCallPage/       # pre-call setup UI
│   └── SettingMediaPage/  # media settings UI
│   │   ├── components/
│   │   │   └── MediaSettingsForm.tsx
│   └── index.ts           # Central export file, re‑exports each page's index for easier imports
├── schema/                # validation schemas
│   └── mediaSetting.schema.ts
├── store/                 # state management
│   ├── MediaStore.ts
│   └── MediaStreamStore.ts
├── types/                 # TypeScript type definitions
│   ├── mediaDevice.ts
│   └── setting.ts
├── utils/                 # helper functions
│   └── media.ts
├── App.css                # global styles specific to the App component
├── App.tsx                # root React component, defines main UI structure and routes
├── index.css              # global CSS styles applied across the entire app
├── main.tsx               # application entry point, mounts App into DOM and initializes React
├── .editorconfig          # editor settings (indentation, charset, etc.) for consistent coding style
├── .gitignore             # specifies files/folders ignored by Git
├── .prettierignore        # files/folders ignored by Prettier formatting
├── .prettierrc            # Prettier configuration (rules for code formatting)
├── CONVENTION.md          # project conventions & guidelines (naming, coding style, etc.)
├── eslint.config.js       # ESLint configuration for linting TypeScript/JS code
├── index.html             # main HTML entry point for the app
├── package-lock.json      # auto-generated lock file for npm dependencies
├── package.json           # project metadata, scripts, and dependencies
├── README.md              # project documentation
├── tsconfig.app.json      # TypeScript config for the application code
├── tsconfig.json          # base TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node-related files (e.g., build scripts)
└── vite.config.ts         # Vite configuration (bundler, plugins, dev server)

# 📏 Coding Conventions

## 📝 Naming Rules
- **Components**: `PascalCase` (e.g., `VideoPreview.tsx`, `ToggleMediaButton.tsx`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useMediaDevices.ts`)
- **Stores**: `PascalCase` ending with `Store` (e.g., `MediaStore.ts`)
- **Schemas**: `camelCase` ending with `.schema.ts` (e.g., `mediaSetting.schema.ts`)
- **Types**: `camelCase` or `PascalCase` depending on usage (e.g., `mediaDevice.ts`, `Setting`)
- **Utils**: `camelCase` (e.g., `media.ts`)

## 🎨 Styling
- Use **CSS Modules** or **global CSS** (`App.css`, `index.css`) for consistent styling.
- Follow Prettier rules for indentation, spacing, and quotes.

## 🔄 Imports & Exports
- Each page has its own `index.ts` as entry point.
- `pages/index.ts` re‑exports all pages for cleaner imports:
  ```ts
  export { default as MeetingScreenPage } from './MeetingScreenPage';
  export { default as PreCallPage } from './PreCallPage';
  export { default as SettingMediaPage } from './SettingMediaPage';
````
