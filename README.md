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