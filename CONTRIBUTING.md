# Contributing to ARIP

Thank you for your interest in contributing to the AI Repository Intelligence Platform (ARIP). This guide provides the necessary instructions for setting up your development environment, running tests, following code conventions, and submitting changes.

---

## Development Setup

1. **Clone the repository** and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd arip
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` (optional for local mock testing).

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The development server boots Express with Vite middleware on `http://localhost:3000`.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Express backend with Vite development middleware on port 3000 |
| `npm run build` | Builds client static assets (`dist/`) and bundles backend (`dist/server.cjs`) |
| `npm start` | Starts the production server using `node dist/server.cjs` |
| `npm run test` | Runs the Vitest automated test suite |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts (`dist/`) |

---

## Code Conventions & Standards

- **TypeScript**: Strict typing is enforced. Avoid `any` where possible. Add shared interfaces to `src/types.ts` or relevant module headers.
- **Component Architecture**:
  - Keep components modular within `src/components/`.
  - Prefer functional components with React hooks.
  - Avoid consolidating logic into single oversized files.
- **Styling**: Use Tailwind CSS utility classes. Do not create separate `.css` files.
- **Icons**: Import all icons as named imports from `lucide-react`.
- **Animations**: Use `motion` imported from `motion/react`.
- **Backend Rules**:
  - All secret keys must remain server-side in `process.env`. Never expose secret keys to the browser bundle.
  - Keep server bundling compatible with `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
  - Bind exclusively to `0.0.0.0:3000`.

---

## Pre-Submission Checklist

Before opening a pull request, verify that all checks pass:

1. **Run the linter / type checker**:
   ```bash
   npm run lint
   ```
   Ensure zero errors or missing imports.

2. **Run tests**:
   ```bash
   npm run test
   ```
   Ensure all tests pass.

3. **Verify the production build**:
   ```bash
   npm run build
   npm start
   ```
   Verify that `dist/server.cjs` compiles and starts without errors.
