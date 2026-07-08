# Project Backlog & Action Items

This backlog contains concrete refactoring actions and feature expansions to transition the AI Repository Intelligence Platform (ARIP) from high-fidelity simulation into full production readiness.

---

## 1. Critical Priority (Security & Stability)

### [x] Secure Express API Endpoints
- **Description**: Add a lightweight API authentication token check (or session guard) to prevent unauthorized API consumption of Gemini tokens in shared environments.
- **Reference Files**: `/server.ts`
- **Status**: Completed (Secure automated Cookie Session Guard and API Custom Header Token middleware implemented)
- **Target Effort**: Low

### [x] Validate Inbound Express Request Structures
- **Description**: Use a parser library (e.g., Zod) or native schemas to strictly validate inputs on `/api/ask` (e.g. enforcing that `repoId` exists and matches, and `question` is non-empty) to prevent server crash loops on malformed bodies.
- **Reference Files**: `/server.ts`
- **Status**: Completed (Rigorous input validation middleware implemented with size validation and type constraints)
- **Target Effort**: Low

---

## 2. High Priority (Testing & Infrastructure)

### [x] Configure Vitest Suite & Component Harnesses
- **Description**: Setup a comprehensive testing suite to verify tab-locking systems, command-line terminal parsing algorithms, and dynamic mock database state bindings.
- **Reference Files**: `/package.json`, `/vite.config.ts`, `/src/tests/system.test.ts`
- **Status**: Completed (Automated unit testing suite established with green Passing status)
- **Target Effort**: Medium

### [x] Standardize Environment Validation on Bootstrap
- **Description**: Implement a bootstrap check that prints warning summaries if essential environment variables are missing, instead of letting downstream modules throw errors during standard requests.
- **Reference Files**: `/server.ts`
- **Status**: Completed (Bootstrap environment audit layout active)
- **Target Effort**: Low

---

## 3. Medium Priority (Feature Completeness)

### [x] Integrate Local AST Parser Core
- **Description**: Transition the static compiler simulator into a real local scanner. Integrate a lightweight tree-sitter or TypeScript compiler API script to read actual workspace files and output dynamic symbol schemas.
- **Reference Files**: `/src/components/CccCompiler.tsx`, `/server.ts`, `/server/localScanner.ts`
- **Status**: Completed (Dynamic Regex-based abstract syntax trees scanner scans active codebase in real time!)
- **Target Effort**: High

### [x] Implement Request Latency Instrumentation & APM
- **Description**: Instrument the server with structured route timing measurements, logging actual API call latency, and exposing standard metrics routes for observability tools.
- **Reference Files**: `/server.ts`
- **Status**: Completed (Real-time latency logging tracking and standard `/api/metrics` instrumentation endpoint active)
- **Target Effort**: Medium

---

## 4. Low Priority (Polish & UX)

### [x] Add Code-Snippet Visualizers in Tab Panes
- **Description**: Provide direct syntax-highlighted viewers for files mentioned in the static audit warnings or layer violations.
- **Reference Files**: `/src/components/ArchitectAgentPanel.tsx`, `/src/components/SystemGovernance.tsx`
- **Status**: Completed (Interactive inline source code drawer visualizer implemented with active line highlighting)
- **Target Effort**: Medium

### [x] Persist Compiled States Across Browser Sessions
- **Description**: Store compiler-state markers inside standard client `localStorage` so refreshing the browser tab does not reset compiled workspaces.
- **Reference Files**: `/src/App.tsx`
- **Status**: Completed (HTML5 LocalStorage synchronization state engine added)
- **Target Effort**: Low

---

## 5. Mocked/Stubbed Elements & Production Migration Paths

### [x] A. GitHub Workspace Integration
- **Current State**: Transitioned from simulation to full production integration.
- **Implementation**: Implemented a secure backend `/api/github/sync` proxy endpoint in `server.ts` that takes user Personal Access Tokens (PAT), contacts the GitHub API gateway dynamically to retrieve their actual list of user repositories, translates their attributes into high-fidelity metadata templates, and merges them with the local cockpits.

### [x] B. Linguistic AST Parsers
- **Current State**: Replaced regex token patterns with formal compilers.
- **Implementation**: Upgraded the local directory scanner (`/server/localScanner.ts`) to use the official TypeScript Compiler AST API (`ts.createSourceFile`). It traverses TS/TSX files structurally, identifying classes, functions, interfaces, arrow variables, and relative import edges with absolute semantic precision, falling back to a resilient pattern-based scanner only for other configuration files.

### [x] C. Live Server-Side Model Routing
- **Current State**: Fully active server-side dynamic routing proxy.
- **Implementation**: Modified the `/api/ask` route to extract custom Groq and OpenRouter credentials, selected model aliases, and routing tiers directly from the secure client request headers. Automatically classifies query complexity (low, medium, high) and routes prompt payloads with custom system grounding instructions directly to Groq or OpenRouter completions endpoints, mapping response metadata.

### [x] D. Vector Embeddings Engine
- **Current State**: Real mathematical vector search engine is online.
- **Implementation**: Implemented an in-memory document embedding cache on the backend. When a live Gemini instance is active, `/api/embeddings/search` calls Google's high-performance `gemini-embedding-2-preview` to generate actual 1536-dimension embeddings for the documents and user queries, performing dynamic mathematical cosine similarity dot products to sort and rank semantic matches, and returns results smoothly to the interactive UI sandbox.

