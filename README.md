# BlockMarket Web

The BlockMarket website, built with Next.js 16, React 19, Tailwind CSS 4 and Motion.

## Run it locally

**You need:** [Node.js](https://nodejs.org) 20.9 or newer (22 LTS recommended) and Git.

```bash
git clone https://github.com/VedaantK/blockmarket-web.git
cd blockmarket-web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Edits to the code reload the page automatically.

No environment variables or API keys are needed.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Lint with ESLint |
| `npm test` | Run tests with Vitest |

## Troubleshooting

- **Port 3000 already in use:** run `npm run dev -- -p 3001` and open http://localhost:3001.
- **Install errors:** check `node -v` is 20.9+. If you use nvm, run `nvm use` (the repo has an `.nvmrc`).

## Project layout

- `app/` – routes and pages (Next.js App Router)
- `components/` – UI components
- `lib/` – shared helpers and data
- `public/`, `assets/` – images and static files
