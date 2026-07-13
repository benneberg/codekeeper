schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

overview:
  value: The AI Repository Intelligence Platform is a full-stack developer environment enabling advanced codebase analysis, interactive AST compilation, multi-agent reasoning, auto-classifying multi-gateway model routing, and vector semantic search.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Renders detailed bento-grid modules across ten diagnostic tabs
    - server.ts implements custom proxy interfaces
  notes: ""

purpose:
  value: Accelerate and secure architectural refactoring by modeling and visualizing complex, multi-service codebases, identifying circular couplings, auditing safety risks, and translating physical file structures into structured context tokens (CCC).
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - InfoModal.tsx, App.tsx, and CccCompiler.tsx contents
  notes: ""

scope:
  value: Includes complete frontend analytical dashboard interfaces, local directory scanning pipelines, dynamic symbol graph compilers, server-side model routing gateways, and local-credential storage configurations.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Directory contents of /src/components and /server
  notes: ""

capabilities:
  value:
    - Live workspace repository selection and metadata updates
    - Real-time TypeScript AST parsing of class, interface, function declarations and dependency imports
    - Auto-classifying model routing mapping chat prompts to specialized external inference targets (Groq / OpenRouter)
    - Cosine similarity matching using live Gemini embeddings
    - System modularity, coupling, and circular dependencies health auditing
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts endpoints, localScanner.ts, and React files
  notes: ""

verified_features:
  value:
    - Integrated compiler console and compilation logs emulator
    - Live Professor grounding chat with multi-turn history
    - Real-time GitHub API proxy synchronizing remote repositories using custom PAT tokens
    - TypeScript AST compiler API parsing class/interface declarations dynamically
    - Header-driven model router checking local Groq and OpenRouter credentials
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct browser state execution and console verification tests
  notes: ""

inferred_features:
  value:
    - The platform is designed to scale into a headless pipeline capable of operating as an automated CI/CD code quality check gateway.
  evidence_state: INFERRED
  confidence: MEDIUM
  evidence:
    - Standard outputs structured to mimic pipeline build steps
  notes: ""

future_indicators:
  value:
    - TODO.md roadmap outlines enterprise migration paths for tree-sitter parsers and pgvector SQL storage.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - TODO.md content
  notes: ""

technology_stack:
  value:
    frontend:
      - React 19.0.1
      - Vite 6.2.3
      - Tailwind CSS 4.1.14
      - Motion 12.23.24
      - Lucide React 0.546.0
      - React Markdown 10.1.0
    backend:
      - Node.js 22.14.0
      - Express 4.21.2
      - tsx 4.21.0
      - esbuild 0.25.0
      - Google GenAI SDK (@google/genai v2.4.0)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json dependencies
  notes: ""

repository_structure:
  value:
    - root: Configurations (.gitignore, tsconfig.json, vite.config.ts, package.json, metadata.json)
    - src/: Client React sources
      - src/main.tsx: Client bootstrapper
      - src/App.tsx: Shell container and tab navigation
      - src/components/: Modular diagnostic panels
    - server/: Backend utilities
      - server/localScanner.ts: TypeScript Compiler AST scanner
      - server/mockRepositories.ts: Simulated codebase configurations and metrics
    - server.ts: Standalone Express backend server & proxy routes
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct listing of project directories
  notes: ""

configuration:
  value:
    - env: Managed via .env.example (GEMINI_API_KEY)
    - client_state: Saved inside HTML5 LocalStorage under key prefixes 'arip_'
    - server_port: Hardcoded to port 3000 on host 0.0.0.0
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - .env.example
    - server.ts listen parameters
  notes: ""

build_process:
  value:
    - command: npm run build
    - output:
        frontend: Compiled client static bundles written to /dist
        backend: Express server bundled to /dist/server.cjs via esbuild
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json scripts
  notes: ""

deployment:
  value:
    - target: Cloud Run / Docker Container Containerized Environments
    - ingress: External reverse proxy routing strictly to port 3000
    - start: npm start (node dist/server.cjs)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json scripts
    - Environment port binding constraints
  notes: ""

repository_boundaries:
  value:
    - Local directory scanning is isolated to the workspace root directory context.
    - All third-party secrets (Groq, OpenRouter) remain purely client-side unless active requests are proxying through server.ts headers.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - localScanner.ts uses relative path checks
    - localStorage hooks in SettingsPanel.tsx
  notes: ""

known_unknowns:
  value:
    - Performance boundaries under massive monorepos where file trees exceed 100,000 nodes.
    - Dynamic authentication tokens timeout behavior for enterprise GitHub servers.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - localScanner.ts parses files synchronously
  notes: ""

confidence_summary:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Clean compilation, zero lint warnings, full structural coverage.
  notes: ""
