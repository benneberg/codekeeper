# AI Repository Intelligence Platform (ARIP)

## Overview
ARIP is a comprehensive full-stack repository bootstrap, audit, and intelligence platform. It scans codebase directories, runs native TypeScript Compiler AST analyzers to extract structural definitions, maps relative imports to build dependency graphs, hosts an auto-classifying multi-gateway model router, and uses live Google Gemini embeddings to compute cosine similarity for vector semantic search.

---

## Requirements
- **Runtime**: Node.js v18 or newer (v22.14.0 recommended)
- **Package Manager**: npm v9 or newer
- **Platform**: Compatible with standard Linux, macOS, and containerized cloud environments (e.g. Cloud Run)
- **Required Secret Keys**: Google Gemini Developer API Key (`GEMINI_API_KEY`) configured server-side (optional; runs in resilient simulated offline-fallback mode if missing)

---

## Installation
To configure and launch the development workspace locally:

1. Clone the repository to your local directory.
2. Install all required dependencies from the root directory:
   ```bash
   npm install
   ```

---

## Configuration
All environment-level keys are configured using standard environment files:

1. Create a `.env` file in the project root:
   ```env
   # .env
   GEMINI_API_KEY=your_actual_google_gemini_key
   ```
2. For secondary providers and remote workspaces, configure credentials inside the **Settings** tab:
   - **Groq API Key**: Stored locally in browser for ultra-fast, low-latency inference routing.
   - **OpenRouter API Key**: Stored locally in browser for customizable LLM completions.
   - **GitHub Personal Access Token (PAT)**: Stored locally in browser to dynamically synchronize real repositories from `api.github.com`.

---

## Usage
Launch the development server to run both the Express backend and Vite frontend hot-reload middleware concurrently:
```bash
npm run dev
```
Once booted, access the interactive dashboard cockpit at: `http://localhost:3000`

### Interaction Guidelines:
1. **Workspace Selection**: Load pre-registered mock codebases or input your GitHub PAT to sync real repositories.
2. **Compile AST Context**: Execute the **CCC Compiler** to parse classes, interface contracts, functions, and import paths in real time.
3. **Review Telemetry**: Analyze circular dependency loops, modularity ratings, and refactoring prescripitions on the **Architect Agent** and **Causality** dashboards.
4. **Model Router**: Toggle custom routing models and trigger complexity-based chat responses in the **Professor Chat** interface.
5. **Semantic Search**: Enter queries in the **Embedding Layer** tab to trigger real mathematical vector similarity scans.

---

## Testing
- Run typescript compilation checks and static lints:
  ```bash
  npm run lint
  ```
- Run vitest suite commands (framework details listed in `TESTING_DELTA.md`):
  ```bash
  npm run test
  ```

---

## Build
Compile all assets for production optimization:
```bash
npm run build
```
This single build command:
1. Compiles frontend React source bundles into the static `/dist` directory.
2. Bundles the backend Express server into a self-contained `/dist/server.cjs` file using esbuild, resolving relative imports and mapping production sourcemaps.

---

## Deployment
Launch the production full-stack server container locally or inside container systems (e.g., Google Cloud Run):
```bash
npm start
```
The server will boot and bind strictly to host `0.0.0.0` on port `3000`.

---

## Repository Structure
```
├── .env.example              # Env variable template
├── .gitignore                # Production ignore paths
├── ARCHITECTURE.md           # Architecture specification (Deterministic YAML)
├── AUDIT.md                  # Security and correctness audit results (Deterministic YAML)
├── ACTION_PLAN.md            # Action plan priorities (Deterministic YAML)
├── REPOSITORY_CLASSIFICATION.md # Repository metadata classifications (Deterministic YAML)
├── REPOSITORY_CARD.md        # Single-page repository executive card (Deterministic YAML)
├── REPOSITORY.md             # Full systems description (Deterministic YAML)
├── BOOTSTRAP_CONTEXT.md      # Primary LLM bootstrap reference (Deterministic YAML)
├── BOOTSTRAP_METADATA.md     # Audit script execution metadata (Deterministic YAML)
├── package.json              # Script paths and dependency manager manifests
├── vite.config.ts            # Vite compile and bundler configuration
├── tsconfig.json             # TypeScript configuration profile
├── server.ts                 # Full Express server, API proxies, and embeddings gateway
├── server/
│   ├── localScanner.ts       # Native TypeScript AST Compiler scanner
│   └── mockRepositories.ts   # Interactive simulation metrics databases
└── src/
    ├── main.tsx              # React client app bootloader
    ├── App.tsx               # Main UI shell and navigation orchestrator
    └── components/           # Analytical dashboard tabs
```
