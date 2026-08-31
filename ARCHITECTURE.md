# System Architecture

This document is the authoritative architectural specification for the AI Repository Intelligence Platform (ARIP). It describes the current implementation, component boundaries, data flow, state management, security boundaries, and architectural invariants.

---

## 1. Architectural Style & Boundaries

ARIP is built as a **Full-Stack Single-Container Service** combining an Express HTTP backend and a React single-page application (SPA) bundled with Vite.

```
+-------------------------------------------------------------------------+
|                        Container Sandbox (Port 3000)                    |
|                                                                         |
|  +--------------------------------+  +-------------------------------+  |
|  |       React SPA (Vite)         |  |      Express Backend API      |  |
|  |                                |  |          (server.ts)          |  |
|  | - Navigation & View Tabs       |  | - API Auth Guard & APM       |  |
|  | - AST Graph & Metrics UI       |  | - Model Router & Gateway      |  |
|  | - Terminal Emulator            |  | - Vector Embeddings Engine    |  |
|  | - LocalStorage Session State   |  | - GitHub Sync Proxy           |  |
|  +---------------+----------------+  +---------------+---------------+  |
|                  |                                   |                  |
|                  +----------- HTTP Requests ---------+                  |
|                                                      |                  |
|                             +------------------------+---------------+  |
|                             |    localScanner.ts     |  mockRepos    |  |
|                             |  TS Compiler AST API   |  Benchmarks   |  |
|                             +------------------------+---------------+  |
+-------------------------------------------------------------------------+
                                       |
                   External API Gateways (Outbound HTTPS)
            +--------------------+--------------------+--------------------+
            |                    |                    |                    |
     Google Gemini API      Groq API Gateway    OpenRouter API     GitHub REST API
     (@google/genai SDK)    (Header Proxy)      (Header Proxy)     (Header Proxy)
```

### Ingress & Port Constraint
- The service binds strictly to **host `0.0.0.0` and port `3000`**.
- In development (`NODE_ENV !== "production"`), Express mounts Vite middleware (`middlewareMode: true`, `appType: "spa"`).
- In production, Express serves pre-built static assets from `dist/` with SPA HTML fallback (`app.get("*")`).

---

## 2. Major Components & Responsibilities

### 2.1 Express Backend (`server.ts`)
- **API Routing & Dispatch**: Exposes endpoints for session bootstrap, repository metadata, fact-grounded Q&A, vector embeddings search, GitHub repository synchronization, and runtime metrics.
- **Security & Authorization (`apiAuthGuard`)**: Enforces API authentication via Bearer tokens, custom headers (`x-api-token`), or HTTP session cookies (`arip_session`).
- **Input Validation (`validateAskRequest`)**: Enforces payload structural validation on Q&A requests, verifying repository identifiers, question character limits (max 2000), and history schemas.
- **Model Router & Proxy**: Evaluates query complexity and routes requests to Groq, OpenRouter, or Google Gemini based on client header configuration.
- **Vector Embeddings Engine**: Computes 1536-dimensional embeddings using `gemini-embedding-2-preview` and ranks results using mathematical cosine similarity.
- **APM Instrumentation (`metricsMiddleware`)**: Measures per-route request counts, failure rates, and execution latencies in milliseconds.

### 2.2 TypeScript AST Scanner (`server/localScanner.ts`)
- **Filesystem Traversal (`walkDirectory`)**: Recursively traverses the workspace directory while excluding build artifacts (`node_modules`, `dist`, `.git`, `.llm-context`).
- **AST Parsing Engine (`parseLocalFile`)**: Uses the native TypeScript Compiler API (`ts.createSourceFile`) to extract classes, interfaces, function declarations, line numbers, and relative import edges.
- **Fallback Pattern Scanner**: Employs structural regex parsing for non-TypeScript files (JSON, Markdown, configuration files) when AST compilation is inapplicable.

### 2.3 Benchmark Registry (`server/mockRepositories.ts`)
- Contains static benchmark definitions (IoT Gateway in C#, Secure Auth Service in Go, Enterprise Billing in TypeScript) used for baseline architectural comparisons and regression testing.

### 2.4 Client SPA (`src/App.tsx` & `src/components/`)
- **App Shell (`src/App.tsx`)**: Manages active tab switching, workspace selection, and compiler lock state.
- **CCC Compiler (`src/components/CccCompiler.tsx`)**: Triggers real-time AST analysis of active workspaces, displaying symbol tables and dependency maps.
- **Professor Chat (`src/components/ProfessorChat.tsx`)**: Conversational interface grounded in compiled AST facts and architectural rules.
- **Architect Agent (`src/components/ArchitectAgentPanel.tsx`)**: Evaluates domain boundary cohesion and detected layer violations.
- **Causality Impact Analyzer (`src/components/ImpactAnalyzer.tsx`)**: Visualizes dependency directed acyclic graphs (DAGs) and computes refactoring blast radiuses.
- **Model Router (`src/components/ModelRouter.tsx`)**: Configures provider allocations and complexity thresholds for fast, medium, and complex queries.
- **Embedding Layer (`src/components/EmbeddingLayer.tsx`)**: Queries the backend vector engine and visualizes cosine similarity scores.
- **System Governance (`src/components/SystemGovernance.tsx`)**: Displays observability coverage percentages and technical debt ratings.
- **Settings Panel (`src/components/SettingsPanel.tsx`)**: Manages client-side API keys and GitHub personal access tokens.
- **Terminal Emulator (`src/components/TerminalEmulator.tsx`)**: CLI interface executing local inspection commands (`ccc system analyze`, `help`, `clear`).

---

## 3. Data Flow & Workflows

### 3.1 Workspace AST Compilation Flow
1. User triggers workspace scan or selects `active-workspace`.
2. Frontend requests `GET /api/repositories/active-workspace`.
3. Backend invokes `performLocalWorkspaceScan()` in `server/localScanner.ts`.
4. `walkDirectory` scans workspace files; `ts.createSourceFile` builds AST nodes for each `.ts`/`.tsx` file.
5. Symbols (classes, interfaces, functions) and dependency edges are assembled into a structured telemetry object.
6. The JSON payload is returned to the client and rendered in the CCC Compiler view.

### 3.2 Fact-Grounded Q&A Flow (`/api/ask`)
1. User enters a query in Professor Chat.
2. Client sends `POST /api/ask` with query text, `repoId`, chat history, and optional routing headers (`x-groq-key`, `x-openrouter-key`).
3. `apiAuthGuard` verifies session token or cookie.
4. `validateAskRequest` validates payload types and constraints.
5. Backend compiles ground-truth context from AST symbols, dependency graphs, architectural rules, and static warnings.
6. Query complexity is classified (`low`, `medium`, `high`).
7. If custom provider keys exist in headers, the prompt is dispatched via HTTPS to Groq or OpenRouter; otherwise, it is dispatched to Google Gemini (`gemini-3.5-flash`).
8. If no cloud keys are configured, the server emits a pre-computed fallback response citing compiled repository facts.
9. Response is returned to the client and rendered with markdown formatting.

### 3.3 Semantic Vector Search Flow (`/api/embeddings/search`)
1. User submits a search query in the Embedding Layer view.
2. Client sends `POST /api/embeddings/search`.
3. If Google Gemini is available, the server embeds indexed documents (cached in memory) and the incoming query using `gemini-embedding-2-preview`.
4. Vector dot products and Euclidean norms are computed:
   $$\text{similarity} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$
5. Documents are ranked by cosine similarity and returned to the client.

### 3.4 GitHub Synchronization Flow (`/api/github/sync`)
1. User enters a GitHub Personal Access Token (PAT) in the Settings view.
2. Client sends `POST /api/github/sync` with token in request body.
3. Backend proxies an authenticated request to `https://api.github.com/user/repos`.
4. Remote repositories are transformed into normalized workspace descriptors and returned to the client.
5. Client merges remote repositories into local state.

---

## 4. State Management & Persistence

| Data | Storage Location | Durability |
|---|---|---|
| Active repository selection | Browser `localStorage` (`arip_selected_repo`) | Survives tab reload |
| Third-party API keys (Groq, OpenRouter, GitHub PAT) | Browser `localStorage` (`arip_*_key`, `arip_github_token`) | Client-isolated; never stored in server database |
| Document embeddings cache | Server process memory (`documentEmbeddingsCache`) | Ephemeral; populated on demand, resets on restart |
| APM runtime metrics | Server process memory (`metricsRegistry`) | Ephemeral; resets on process restart |
| Local workspace files | Container filesystem | Source of truth for AST scanner |

---

## 5. External Integrations

| Service | Protocol | Authentication | Purpose |
|---|---|---|---|
| Google Gemini API | HTTPS (`@google/genai`) | `GEMINI_API_KEY` (server-side environment) | Grounded chat completions and vector embeddings |
| Groq Inference API | HTTPS REST (`api.groq.com`) | `x-groq-key` request header | Ultra-fast low-latency inference routing |
| OpenRouter API | HTTPS REST (`openrouter.ai`) | `x-openrouter-key` request header | Custom multi-model LLM completions |
| GitHub REST API | HTTPS REST (`api.github.com`) | `Authorization: Bearer <PAT>` (proxied from client) | Remote repository synchronization |

---

## 6. Security Boundaries

1. **Server-Side API Key Isolation**: The `GEMINI_API_KEY` is loaded exclusively via `process.env` on the backend and is never sent to the browser or included in Vite client bundles.
2. **Zero-Telemetry Client Credentials**: Third-party credentials (Groq, OpenRouter, GitHub PAT) reside exclusively in browser `localStorage`. They are transmitted directly in request headers on active proxy calls and are never stored in server logs or persistent backend files.
3. **API Access Control**: The `apiAuthGuard` middleware gates protected endpoints (`/api/ask`, `/api/embeddings/search`, `/api/github/sync`, `/api/metrics`) using token verification (`Authorization: Bearer`, `x-api-token`, or `arip_session` cookie).
4. **Input Sanitization**: Request bodies are validated using strict type and length assertions before passing into model prompts, preventing prompt injection and malformed payload crashes.

---

## 7. Architectural Invariants

1. **Port & Host Invariant**: The application must always bind to port `3000` on host `0.0.0.0`. Port `3000` is the single externally routed container port.
2. **Production Bundle Invariant**:
   - Frontend compiles to static files in `dist/`.
   - Backend bundles into a standalone CommonJS file at `dist/server.cjs` via `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
   - Production entry command is `node dist/server.cjs`.
3. **Deterministic AST Invariant**: Given the same filesystem state, `parseLocalFile` in `localScanner.ts` must produce the exact same symbols and dependency edges every time.
4. **Zero-Crash Fallback Invariant**: In the absence of external API keys (`GEMINI_API_KEY`, Groq, OpenRouter), the backend must gracefully degrade to local simulation mode without throwing unhandled exceptions or returning HTTP 500 errors.

---

## 8. Testing Strategy & Verification

- **Unit Testing**: Vitest runs test suites located in `src/tests/` (e.g., `src/tests/system.test.ts`), asserting structural metrics, symbol counts, technical debt rating formulas, and mock repository integrity.
- **Static Verification**: TypeScript compiler runs `tsc --noEmit` (`npm run lint`) to guarantee type safety across client and server files.
- **Production Build Verification**: `npm run build` verifies that both the Vite client bundle and the esbuild backend bundle compile cleanly without errors.
