# System Architecture Specification

## 1. Components
The system is structured as a full-stack, single-container web application:
- **Client Application (Vite + React 19)**: Built with functional React components,styled with Tailwind CSS v4, and animated using `motion`. It includes interactive sub-components matching individual analytical tabs.
- **Server API Router (Node.js + Express 4)**: Serves static compiled client assets from the `/dist` directory in production, provides REST API endpoints, and hosts a proxy to the Google Gemini API.
- **Symbolic Mock Engine (`/server/mockRepositories.ts`)**: Supplies realistic, deep structural facts including AST symbol lists, directed dependency edges, static analysis vulnerabilities, and debt scoring matrices.

*Confidence: High*

## 2. Data Flow & Source of Truth
- **Source of Truth**: The active database and mock repository structures inside `/server/mockRepositories.ts` act as the primary structural data truth.
- **Flow Scenario (User Consults Professor Chat)**:
  1. The client selects a repository workspace, prompting the `App` component to pull detailed characteristics from `/api/repositories/:id`.
  2. The user inputs a query in the `ProfessorChat` tab.
  3. The client issues a POST request to `/api/ask` containing the question and repo context.
  4. The Express server retrieves the workspace's files, symbols, dependency arrays, and warning files from the mock engine.
  5. The server joins this structural context into a highly restrictive system instruction block.
  6. If a `GEMINI_API_KEY` is present, the server invokes the unified Google GenAI client (`@google/genai`); otherwise, it resolves the request using a rule-based deterministic response simulation.
  7. The response flows back to the client and renders inside the chat interface using markdown parsing.

*Confidence: High*

## 3. Integrations
- **Google GenAI SDK (`@google/genai` v2.4.0)**: Used server-side to call the `gemini-3.5-flash` model with system instructions, user prompts, and conversation history.
- **Tailwind CSS v4 & Lucide Icons**: Extensively integrated for UI presentation and consistent vector symbol designs.

*Confidence: High*

## 4. Deployment Model
- **Platform**: Cloud Run / Containerized Environments.
- **Server Binding**: The Node.js Express server binds to host `0.0.0.0` on port `3000`, matching container proxy requirements.
- **Production Pipeline**:
  - `npm run build` triggers a two-part compile process: `vite build` translates React files to static bundles inside `/dist`, and `esbuild` compiles `server.ts` into `/dist/server.cjs` (bundling TypeScript and resolving local files).
  - `npm start` executes `node dist/server.cjs` in standalone container mode.

*Confidence: High*

## 5. Observability
- **Current Setup**: Basic standard stream tracking via `console.log` on startup and API route invocations.
- **Gaps**: Lacks request correlation identifiers, structured performance metrics (latency, credit consumption), or log levels.

*Confidence: High*

## 6. Risks & Threat Vectors
- **API Key Leakage Protection**: Handled perfectly by keeping the Gemini SDK key completely on the server-side, never rendering input fields or returning secrets to the client.
- **Resource Starvation risk**: If large codebases are uploaded in the future, running Tree-Sitter parsers on single-threaded synchronous Express worker pools could block API request lines.
- **Prompt Injection**: Unvalidated mock file structures are bundled directly into system instructions, which could allow maliciously written comments in source files to influence agent responses.

*Confidence: Medium-High*

## 7. Recommended Architectural Improvements
- **Worker Thread Pools**: Move future CPU-intensive AST parsing activities to background thread channels or asynchronous celery task queues.
- **Request Schemas**: Integrate Zod or equivalent request validator libraries on the Express layer to guarantee schema correctness.
- **Structured Loggers**: Migrate from standard console prints to custom logs (e.g. Pino or Winston) with request identifiers.

*Confidence: High*
