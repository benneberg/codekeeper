# AI Repository Intelligence Platform (ARIP)

ARIP is a full-stack repository intelligence and codebase reasoning platform. It pairs deterministic compiler analysis with multi-agent architectural reasoning to eliminate context hallucinations and provide verified codebase insights.

---

## Why ARIP Exists

Generative AI coding assistants frequently treat codebases as flat text files, overlooking abstract syntax tree (AST) relationships, module-coupling layers, and structural domain boundaries. This leads to hallucinations, insecure suggestions, circular dependency loops, and architectural regression.

ARIP bridges deterministic compiler theory and AI reasoning:
- **Grounding in Code Facts**: Compiles source code into explicit AST symbol definitions and dependency graphs.
- **Architectural Auditing**: Detects layer boundary violations, circular imports, and blast radiuses before changes are merged.
- **Dynamic Model Routing**: Intelligently routes queries across model tiers (fast inference vs. deep reasoning) based on task complexity.
- **Mathematical Semantic Search**: Uses vector embeddings and cosine similarity to match symbols and architectural records.

---

## Current Capabilities

- **AST Symbol Indexing**: Real-time TypeScript AST parsing of classes, interfaces, functions, methods, and import edges using the native TypeScript Compiler API (`ts.createSourceFile`).
- **Dependency & Blast Radius Analysis**: Calculates dependency directed graphs (DAGs), circular import cycles, and blast radius impact scores for modified files.
- **Fact-Grounded Architectural Q&A**: "Professor Chat" interface grounded exclusively in compiled repository AST facts, architectural rules, and static analysis outputs.
- **Multi-Gateway Model Router**: Dynamic classification of query complexity (low, medium, high) with header-driven routing to Groq (ultra-low latency), OpenRouter (custom models), or server-side Google Gemini.
- **Vector Semantic Search**: In-memory document embedding search powered by Google Gemini (`gemini-embedding-2-preview`) with mathematical cosine similarity ranking.
- **Multi-Workspace Support**: Interactive inspection of live local workspaces, pre-configured architectural benchmarks (IoT Gateway, Secure Auth Service, Enterprise Billing), and dynamic GitHub synchronization.
- **Session & Endpoint Protection**: Centralized API token and cookie session guards (`apiAuthGuard`) and strict input schema validation (`validateAskRequest`).
- **Runtime APM Metrics**: In-flight request counting, error tracking, and route latency profiling via `/api/metrics`.

---

## System Requirements

- **Runtime**: Node.js v18 or newer (v22 recommended)
- **Package Manager**: npm v9 or newer
- **Environment**: Linux, macOS, or containerized environments (Google Cloud Run)
- **Port**: Binds strictly to port `3000` on host `0.0.0.0`

---

## Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configuration
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_google_gemini_api_key
API_AUTH_TOKEN=your_optional_secure_session_token
```

*Note: If `GEMINI_API_KEY` is not provided, the platform operates in resilient offline simulation mode with pre-computed ground-truth responses.*

Optional client-side credentials can be configured directly in the **Settings** tab:
- **Groq API Key**: Enables low-latency Llama-3 inference routing.
- **OpenRouter API Key**: Enables customizable model endpoints (e.g., Claude 3.5 Sonnet).
- **GitHub Personal Access Token (PAT)**: Enables live repository syncing from `api.github.com`.

*All third-party credentials entered in the browser remain in client-side LocalStorage and are forwarded only in request headers during active proxy calls.*

### 3. Running in Development
Start the full-stack dev server (Express backend + Vite development middleware):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## User-Facing API Overview

All API endpoints reside under `/api/*` and are served by Express on port `3000`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/session/bootstrap` | Bootstraps client session and returns active session token | No |
| `GET` | `/api/repositories` | Lists all available repositories with summary metrics | Public GET |
| `GET` | `/api/repositories/:id` | Returns detailed AST symbols, dependencies, and rules for a repo | Public GET |
| `POST` | `/api/ask` | Fact-grounded Q&A against repository AST context | Yes (`apiAuthGuard`) |
| `POST` | `/api/embeddings/search` | Performs vector cosine similarity search across indexed documents | Yes (`apiAuthGuard`) |
| `POST` | `/api/github/sync` | Syncs user repositories from GitHub using client-provided PAT | Yes (`apiAuthGuard`) |
| `GET` | `/api/metrics` | Returns APM runtime latency measurements and request statistics | Yes (`apiAuthGuard`) |

### Authentication
Protected endpoints require authentication via one of:
1. `Authorization: Bearer <API_TOKEN>` header
2. `x-api-token: <API_TOKEN>` header
3. `arip_session` HTTP cookie (automatically provisioned on UI page load)

---

## Testing & Quality Assurance

Run the Vitest test suite:
```bash
npm run test
```

Run TypeScript compilation and static lint checks:
```bash
npm run lint
```

---

## Production Build & Deployment

### Build
Compile the frontend static assets and bundle the backend server:
```bash
npm run build
```
This performs:
1. `vite build` — Emits optimized client bundles into `dist/`.
2. `esbuild server.ts` — Bundles the Express server into `dist/server.cjs` with external packages resolved and source maps enabled.

### Start
Launch the production server:
```bash
npm start
```
The server binds to `0.0.0.0:3000` and serves the static frontend alongside API routes.

---

## Authoritative Documentation

| Topic | Document |
|---|---|
| System architecture, components, data flow, invariants | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Development workflow, code conventions, test guidelines | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Security architecture, credentials isolation, vulnerability reporting | [SECURITY.md](SECURITY.md) |
| Instructions and runtime invariants for AI coding agents | [.llm-context/context.md](.llm-context/context.md) |
