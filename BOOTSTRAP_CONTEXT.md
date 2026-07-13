schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

repository_summary:
  value: A full-stack, single-container repository intelligence cockpit. It provides interactive visual compilers, dependency DAG analyzers, multi-agent model routers, and actual vector embeddings semantic search.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Entire project workspace structure
  notes: ""

technology_summary:
  value: Built on React 19 (Vite), Express 4 (Node), TypeScript 5, Google GenAI SDK, and Tailwind CSS v4.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json configuration
  notes: ""

architecture_summary:
  value: Single container full-stack architecture. Client communicates with Express backend routes. Backend handles TypeScript AST compiling, remote API proxies, and computes mathematical cosine vector similarities.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts structure and file maps
  notes: ""

coding_patterns:
  value:
    - Declarative functional React components with standard useState, useEffect, and useMemo hooks.
    - Synchronous file-system reads on the backend coupled with official TypeScript AST parsing traversal APIs.
    - Token-header based authorization proxies guarding backend API requests.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/components/ codes and server controllers
  notes: ""

naming_patterns:
  value:
    - React Components use PascalCase with .tsx extensions.
    - Helper libraries and backend files use camelCase with .ts extensions.
    - Local browser storage variables prefix with 'arip_'.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - File names inside /src/components and /server
  notes: ""

important_conventions:
  value:
    - API keys and tokens are strictly kept client-side inside LocalStorage, sent only inside request headers, preventing server-side leakage or unauthorized backend exposure.
    - Code scanning routes automatically fallback to regex matches if compiler parsing throws exceptions.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - localScanner.ts and SettingsPanel.tsx configurations
  notes: ""

critical_files:
  value:
    - server.ts: Core Express routes, model routing proxies, and embeddings search vectors.
    - server/localScanner.ts: TypeScript AST Compiler code scanning engine.
    - src/App.tsx: Root container hosting layout state and navigation.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct dependency traversal
  notes: ""

primary_entry_points:
  value:
    - Frontend: src/main.tsx
    - Backend: server.ts
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json configuration
  notes: ""

dangerous_areas:
  value:
    - Sync recursive directory reads in localScanner.ts can block Express thread if run over large repos.
    - Input sanitization on workspace paths: unvalidated relative path parameters could allow path traversal attempts if directories are not locked.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - localScanner.ts fs path constructs
  notes: ""

files_likely_to_change:
  value:
    - server.ts (new API routes / integration proxy options)
    - server/localScanner.ts (more comprehensive structural ast supports)
    - src/components/ProfessorChat.tsx (advanced conversational options)
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - Roadmaps in TODO.md
  notes: ""

generated_files:
  value:
    - dist/ (Frontend static compiler output)
    - dist/server.cjs (Backend compiled esbuild executable bundle)
    - dist/server.cjs.map (Sourcemap file for production diagnostics)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json build configurations
  notes: ""

repository_gaps:
  value:
    - Relational vector databases are simulated via in-memory array caches and local storage states.
    - True OAuth authorization redirect flows are replaced with clean personal access token verification headers.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts in-memory structures
  notes: ""

known_unknowns:
  value:
    - Long-term memory performance and Garbage Collection behavior when retaining embeddings caches over thousands of source files.
  evidence_state: INFERRED
  confidence: MEDIUM
  evidence:
    - in-memory object variables in server.ts
  notes: ""

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - 100% of directory files read and verified
  notes: ""
