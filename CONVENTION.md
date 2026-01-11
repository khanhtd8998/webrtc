```
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
```