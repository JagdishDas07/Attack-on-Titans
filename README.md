# Attack on Titan — Beyond the Walls

An interactive, animation-driven exploration of the *Attack on Titan* universe — the story, the three walls, and a true-to-scale comparison of every titan. Built with React 19, Vite, and GSAP.

## Tech Stack

- **[React 19](https://react.dev/)** — UI library
- **[Vite](https://vite.dev/)** — dev server & build tool
- **[GSAP](https://gsap.com/)** — scroll/timeline animations
- **ESLint** — linting with React Hooks & React Refresh rules

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local dev server with hot module replacement:

```bash
npm run dev
```

The app will be available at the URL printed in your terminal (typically `http://localhost:5173`).

### Build

Create a production build:

```bash
npm run build
```

Output is written to the `dist/` folder.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint across the project:

```bash
npm run lint
```

## Project Structure

```
.
├── index.html          # HTML entry point
├── src/
│   └── main.jsx         # React entry point
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json
```

## Scripts

| Script    | Description                        |
|-----------|-------------------------------------|
| `dev`     | Start the Vite dev server           |
| `build`   | Build the app for production        |
| `lint`    | Run ESLint                          |
| `preview` | Preview the production build        |

## License

This project is a fan-made, non-commercial tribute. *Attack on Titan* and all related characters and imagery are property of their respective owners (Jagdish).
