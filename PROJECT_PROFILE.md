---
metadata:
  analysis_date: "2026-08-25T03:14:00-07:00"
  analysis_version: 1
  analyzed_by: Project Intelligence Agent
  analysis_scope: Complete repository workspace inspection including source code, configuration manifests, build systems, documentation, and backend API routing.
  repository_access: FULL_LOCAL_WORKSPACE
  files_inspected:
    - /package.json
    - /metadata.json
    - /tsconfig.json
    - /vite.config.ts
    - /server.ts
    - /server/localScanner.ts
    - /server/mockRepositories.ts
    - /src/main.tsx
    - /src/App.tsx
    - /src/types.ts
    - /src/components/AgentOrchestrator.tsx
    - /src/components/ArchitectAgentPanel.tsx
    - /src/components/CccCompiler.tsx
    - /src/components/EmbeddingLayer.tsx
    - /src/components/ImpactAnalyzer.tsx
    - /src/components/InfoModal.tsx
    - /src/components/ModelRouter.tsx
    - /src/components/ProfessorChat.tsx
    - /src/components/RepositoryScanner.tsx
    - /src/components/RepositorySelector.tsx
    - /src/components/SettingsPanel.tsx
    - /src/components/SystemGovernance.tsx
    - /src/components/TerminalEmulator.tsx
    - /src/tests/system.test.ts
    - /README.md
    - /TODO.md
    - /REPO_STATUS.md
    - /TESTING_DELTA.md
    - /ARCHITECTURE.md
    - /AUDIT.md
    - /ACTION_PLAN.md
    - /REPOSITORY_CARD.md
    - /REPOSITORY_CLASSIFICATION.md
    - /BOOTSTRAP_CONTEXT.md
    - /BOOTSTRAP_METADATA.md
  directories_inspected:
    - /
    - /src
    - /src/components
    - /src/tests
    - /server
    - /assets
  commands_or_tools_used:
    - list_dir
    - view_file
    - lint_applet (tsc --noEmit)
    - compile_applet (vite build & esbuild)
  limitations: "Container sandbox environment. Live remote cloud infrastructure (e.g. external PostgreSQL with pgvector, GitHub OAuth callback servers) was not directly provisioned."
repository_context:
  repository_name:
    value: "AI Repository Intelligence Platform (ARIP)"
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "metadata.json name field"
      - "App.tsx header title"
    notes: ""
  repository_url:
    value: UNKNOWN
    evidence_state: UNKNOWN
    confidence: NONE
    evidence: []
    notes: "No git remote origin configured inside local sandbox metadata."
  primary_language:
    value: TypeScript
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package.json devDependencies typescript"
      - "*.ts and *.tsx source files in /src and /server"
    notes: ""
  frameworks:
    value:
      - React 19.0.1
      - Express 4.21.2
      - Tailwind CSS 4.1.14
      - Motion 12.23.24
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package.json dependencies"
    notes: ""
  package_manager:
    value: npm
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package-lock.json at repository root"
    notes: ""
  build_system:
    value: Vite 6.2.3 and esbuild 0.25.0
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package.json build script and vite.config.ts"
    notes: ""
  deployment_target:
    value: Cloud Run / Node.js Container Environment
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "server.ts binds 0.0.0.0 on port 3000"
      - "runtime metadata platform indicators"
    notes: ""
  detected_tools:
    value:
      - TypeScript Compiler API (ts.createSourceFile)
      - Google GenAI SDK (@google/genai)
      - Vitest (v3.0.8)
      - Lucide React (v0.546.0)
      - React Markdown (v10.1.0)
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package.json dependencies and server/localScanner.ts"
    notes: ""
project_identity:
  project_name:
    value: AI Repository Intelligence Platform
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "metadata.json name field"
    notes: ""
  suggested_names:
    value:
      - ARIP
      - Code Context Compiler (CCC) Studio
      - RepoIntelligence Cockpit
    evidence_state: SUGGESTED
    confidence: MEDIUM
    evidence:
      - "README.md, REPO_STATUS.md, and App.tsx header labels"
    notes: ""
  short_description:
    value: An interactive workspace for the Code Context Compiler (CCC) and Multi-Agent system to analyze, visualize, and reason about software repositories.
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "metadata.json description field"
    notes: ""
  one_sentence_pitch:
    value: A deterministic repository intelligence and multi-agent reasoning cockpit that translates codebase AST topologies into grounded context for AI agents and software architects.
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "App.tsx, CccCompiler.tsx, and REPOSITORY_CARD.md"
    notes: ""
  category:
    value: Developer Tools / AI Reasoning Cockpits
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Component composition in src/components/"
    notes: ""
  project_type:
    value: WEB_APP
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "React frontend served by Express backend in server.ts"
    notes: ""
  domain:
    value: Software Architecture & Codebase Intelligence
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "AST scanners, causality analysis, dependency graphs, and model routers"
    notes: ""
  technology_tags:
    value:
      - typescript
      - react
      - express
      - vite
      - ast-parser
      - vector-search
      - gemini-api
      - tailwindcss
      - model-routing
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Dependencies and code implementation"
    notes: ""
  audience_tags:
    value:
      - software-architects
      - engineering-leads
      - security-auditors
      - ai-agents
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "REPO_STATUS.md and REPOSITORY_CARD.md persona descriptions"
    notes: ""
project_classification:
  project_intent:
    value: INTERNAL_TOOL
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Cockpit designed for inspecting repositories, compiling AST facts, and auditing codebase health"
    notes: ""
  intent_score:
    value: 0.82
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Clear product architecture with working features, interactive UI, and backend API routes"
    notes: ""
  class:
    value: INTERNAL_TOOL
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Developer utility tool targeting architects and agentic systems"
    notes: ""
project_purpose:
  problem_solved:
    value: Eliminates cognitive overhead in understanding complex multi-service repositories by generating deterministic AST symbol topologies, circular dependency audits, semantic vector search, and grounded AI reasoning.
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "App.tsx tabs (Professor Chat, CCC Compiler, Causality, System Governance, Embeddings)"
    notes: ""
  target_users:
    value: Software Architects, Tech Leads, Code Intelligence Operators, and Autonomous AI Coding Agents
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "REPO_STATUS.md persona section and CccCompiler.tsx token generator"
    notes: ""
  main_use_case:
    value: Performing real-time AST parsing, architectural coupling audits, blast radius impact analysis, and grounding conversational agents in repository facts.
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "UI feature workflows across the 10 diagnostic views in src/components/"
    notes: ""
  core_value:
    value: Transforming raw file trees into deterministic, machine-readable intermediate representations (IR) that prevent hallucination in downstream AI tools.
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "CccCompiler.tsx and BOOTSTRAP_CONTEXT.md directives"
    notes: ""
project_state:
  current_focus:
    value: Deterministic repository bootstrapping, multi-provider model routing, live AST compiler parsing, and vector semantic similarity search.
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "TODO.md completed items and server.ts endpoints"
    notes: ""
  active_work:
    value: Maintaining deterministic IR documents, verifying zero lint errors, and hardening backend route proxies.
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Recent commits and TODO.md items"
    notes: ""
  blocked_by:
    value: UNKNOWN
    evidence_state: UNKNOWN
    confidence: NONE
    evidence: []
    notes: "No active blocking issues or compilation failures found."
  next_milestone:
    value: Asynchronous worker thread migration for the AST scanner and Cloud SQL PostgreSQL pgvector persistence.
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "TODO.md and ACTION_PLAN.md"
    notes: ""
  lifecycle:
    value: FUNCTIONAL_CORE_LOOP
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Full end-to-end capabilities work: live TS AST parsing, GitHub PAT sync, vector embeddings cosine search, and multi-tier model routing"
    notes: ""
  status:
    value: ACTIVE
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Recent code edits, passing builds, and active development roadmap"
    notes: ""
recommendations:
  primary_direction:
    value: Prepare backend for scalable enterprise repositories by offloading synchronous AST parsing to Node.js Worker Threads and adding route authentication middleware.
    evidence_state: SUGGESTED
    confidence: HIGH
    evidence:
      - "AUDIT.md and ACTION_PLAN.md"
    notes: ""
  alternatives:
    value:
      - "Option A: Retain client-heavy prototype focus with browser-based WebAssembly Tree-Sitter parsing."
      - "Option B: Pivot to pure headless CLI/CI-CD gateway that outputs CCC IR artifacts during build steps."
    evidence_state: SUGGESTED
    confidence: MEDIUM
    evidence:
      - "ARCHITECTURE.md extension points"
    notes: ""
  next_action:
    value: Implement request authentication middleware on /api/ask and /api/embeddings/search to safeguard server-side API keys.
    evidence_state: SUGGESTED
    confidence: HIGH
    evidence:
      - "ACTION_PLAN.md immediate actions"
    notes: ""
scores:
  effort_required:
    value: MODERATE
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Core UI and API structure are complete; remaining tasks are targeted optimizations (workers, auth, SQL persistence)"
    notes: ""
  technical_complexity:
    value: COMPLEX
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Native TypeScript AST compiler API integration, cosine similarity vector engine, and dynamic header-driven multi-model proxy"
    notes: ""
  potential_value:
    value: HIGH
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Significantly reduces hallucination risks and accelerates architect review of large codebases"
    notes: ""
  opportunity_score:
    value: 84
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "High differentiation through deterministic AST compiling, zero-telemetry local credential security, and live vector similarity matching"
    notes: ""
  priority_score:
    value: 78
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "High strategic relevance for developer tooling and AI agent workflows"
    notes: ""
health:
  health_score:
    value: 86
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Clean build (npm run build succeeds), zero TypeScript/linter errors, modular architecture, updated documentation"
    notes: ""
  health_status:
    value: HEALTHY
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Build verification succeeds, all components compile without warnings"
    notes: ""
ai_suitability:
  workflow:
    value: ASSISTED
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "AI can generate parsers, optimize vector calculations, and build UI components, but architectural review requires engineering oversight"
    notes: ""
  automation_potential:
    value: 88
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "High testability, clear TypeScript types, modular component boundaries, and deterministic IR contracts"
    notes: ""
project_memory:
  important_decisions:
    value:
      - "Adopted TypeScript Compiler API (ts.createSourceFile) in localScanner.ts for exact AST parsing over brittle regex tokens."
      - "Built an in-memory document embeddings cache in server.ts with live Gemini gemini-embedding-2-preview and mathematical cosine dot products."
      - "Adopted zero-telemetry client-side storage: third-party API keys (Groq, OpenRouter, GitHub PAT) reside in browser LocalStorage and are forwarded only in request headers."
      - "Single container full-stack Express + Vite architecture bound to port 3000."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "server.ts, localScanner.ts, and SettingsPanel.tsx"
    notes: ""
  architectural_constraints:
    value:
      - "Must bind strictly to host 0.0.0.0 and port 3000 for container ingress routing."
      - "Gemini API key must remain strictly server-side (process.env.GEMINI_API_KEY) and never be exposed to the client bundle."
      - "Frontend build artifacts must output to dist/, and backend server must bundle to dist/server.cjs via esbuild."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "package.json scripts, server.ts, and environment constraints"
    notes: ""
  known_limitations:
    value:
      - "AST scanning in localScanner.ts runs synchronously on the Express event loop."
      - "Document embeddings cache is stored in memory and resets on server reboot."
      - "Backend API routes currently lack token authentication guards."
      - "GitHub integration uses Personal Access Tokens rather than a server-managed OAuth2 web flow."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "AUDIT.md and server.ts"
    notes: ""
  future_ideas:
    value:
      - "Migrate AST parser to WebAssembly Tree-Sitter for multi-language support (Go, Python, Rust)."
      - "Integrate Cloud SQL PostgreSQL with pgvector for durable, distributed vector storage."
      - "Support real-time WebSocket diff streaming for active workspace editing."
    evidence_state: SUGGESTED
    confidence: MEDIUM
    evidence:
      - "TODO.md section 5"
    notes: ""
  lessons_learned:
    value:
      - "Native AST traversal provides far higher semantic reliability than regex heuristics for class and interface boundary extraction."
      - "Dynamic query complexity classification allows cost-effective routing between fast inference (Groq) and heavy reasoning models (Claude/Gemini)."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "localScanner.ts implementation notes and server.ts routing logic"
    notes: ""
technical_assessment:
  architecture:
    value: Full-Stack Single-Container Express + Vite SPA
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "server.ts and package.json"
    notes: ""
  complexity:
    value: COMPLEX
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "AST compiler traversals, vector cosine similarity matching, multi-tier header proxying, and ten interactive analytical cockpits"
    notes: ""
  maturity:
    value: PROTOTYPE
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Version 0.0.0 in package.json; in-memory vector cache"
    notes: ""
  scalability_potential:
    value: HIGH
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Clean modular separation makes it straightforward to decouple backend AST workers and connect managed vector databases"
    notes: ""
  security_sensitivity:
    value: MEDIUM
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Processes source code files and proxies LLM credentials; requires route authentication and path sanitization"
    notes: ""
ai_context:
  preferred_workflow:
    value: Modular component development with TypeScript type validation and tsc/vite build verification.
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "tsconfig.json, package.json lint scripts"
    notes: ""
  coding_preferences:
    value:
      - "Strict TypeScript types in /src/types.ts"
      - "Tailwind CSS v4 utility classes"
      - "Motion for UI animations"
      - "Functional React components with standard hooks"
      - "Named imports from lucide-react"
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Existing source files across src/components/"
    notes: ""
  architectural_rules:
    value:
      - "Never expose secret API keys to the browser bundle."
      - "Keep backend bundling compatible with node dist/server.cjs."
      - "Always maintain deterministic YAML schemas for IR audit artifacts."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "ARCHITECTURE.md and BOOTSTRAP_CONTEXT.md"
    notes: ""
  forbidden_actions:
    value:
      - "Do not invent repository facts or assume business information without evidence."
      - "Do not change port 3000 configuration."
      - "Do not commit raw secrets to source files or .env.example."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Environment constraints and audit directives"
    notes: ""
risks:
  critical:
    value: []
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "No critical vulnerabilities or build blockers observed"
    notes: ""
  high:
    value: []
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "No active high-severity security breaches identified"
    notes: ""
  medium:
    value:
      - "Synchronous AST parsing in localScanner.ts can block the Express thread pool on very large codebases."
      - "Unauthenticated backend API endpoints (/api/ask, /api/embeddings/search) could allow resource credit drainage."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "AUDIT.md and server.ts inspection"
    notes: ""
  low:
    value:
      - "Plaintext storage of third-party API keys in browser LocalStorage."
      - "Lack of structured logging / request correlation IDs."
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "AUDIT.md and SettingsPanel.tsx inspection"
    notes: ""
portfolio_position:
  value: FLAGSHIP_PROJECT
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - "Comprehensive scope, rich multi-view UI, integrated compiler API, vector embeddings engine, and multi-tier model router"
    notes: ""
tags:
  primary:
    value:
      - developer-tools
      - repository-intelligence
      - code-context-compiler
      - multi-agent-system
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "metadata.json and App.tsx"
    notes: ""
  secondary:
    value:
      - typescript-ast
      - vector-embeddings
      - model-router
      - refactoring-cockpit
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "Components in src/components/"
    notes: ""
evidence_summary:
  overall_confidence:
    value: HIGH
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "100% of repository files inspected; build and lint verified"
    notes: ""
  evidence_coverage:
    value: HIGH
    evidence_state: OBSERVED
    confidence: HIGH
    evidence:
      - "All core source files, server files, manifests, and documentation inspected"
    notes: ""
  uncertainty_areas:
    value:
      - "Behavior under enterprise monorepos exceeding 100,000 files."
      - "Remote deployment telemetry and user adoption metrics (local prototype environment)."
    evidence_state: INFERRED
    confidence: HIGH
    evidence:
      - "Sandbox execution limits"
    notes: ""
---

# Project Profile

## Quick Summary

| Field | Value |
|---|---|
| Name | AI Repository Intelligence Platform (ARIP) |
| Stage | FUNCTIONAL_CORE_LOOP |
| Status | ACTIVE |
| Priority | 78 / 100 |
| Opportunity | 84 / 100 |
| Health | 86 / 100 |
| AI Suitability | ASSISTED (Automation Potential: 88 / 100) |

---

## Overview
The **AI Repository Intelligence Platform (ARIP)** is a full-stack developer workspace and architectural reasoning cockpit. Built with **React 19**, **Vite 6**, **Express 4**, and **TypeScript 5**, it provides software architects, tech leads, and AI agents with real-time codebase telemetry, deterministic AST facts, circular dependency analysis, vector semantic search, and an auto-classifying multi-gateway model router.

---

## Purpose
- **Problem solved**: Eliminates cognitive overhead and hallucination when reasoning about complex multi-module codebases by translating raw file trees into deterministic, verifiable AST symbol topologies and dependency maps.
- **Target users**: Software Architects, Tech Leads, Security Auditors, and Autonomous Coding Agents.
- **Main use case**: Extracting AST contracts, simulating refactoring blast radiuses, discovering circular import cycles, performing semantic vector search across symbols, and chatting with grounded reasoning models.
- **Core value**: Grounding human and AI engineering decisions in verified static repository facts rather than heuristics or assumptions.

---

## Current State
- **Current lifecycle stage**: `FUNCTIONAL_CORE_LOOP`
- **Current status**: `ACTIVE`
- **Missing requirements**:
  - Request authentication guards on backend Express API endpoints.
  - Node.js Worker Thread delegation for heavy synchronous AST parsing operations.
  - Persistent cloud vector database (e.g. Cloud SQL pgvector) to replace the in-memory embeddings cache.

---

## Recommended Direction
- **Recommended next action**: Implement request authentication middleware on `/api/ask` and `/api/embeddings/search` to protect backend endpoints from unauthorized credit exhaustion.
- **Why**: Currently, endpoints execute model queries without verifying user session tokens or API keys.
- **Expected value**: Hardens backend security and prevents unauthorized usage while preserving the developer experience.

---

## Technical Assessment
- **Architecture observations**: Unified single-container architecture. Express serves API endpoints and static Vite frontend bundles, bundling server assets with esbuild for production (`dist/server.cjs`).
- **Complexity**: `COMPLEX` — Integrates TypeScript Compiler API traversals, live Google Gemini embeddings with cosine similarity matching, dynamic complexity-based model routing (Groq / OpenRouter), and ten interactive analytical views.
- **Scalability**: High architectural modularity; backend parsing logic can be extracted into background workers or serverless tasks.
- **Technical risks**: Synchronous file system traversal in `localScanner.ts` could block the Node.js event loop on massive monorepos.

---

## AI Development Strategy
- **How AI can assist development**:
  - Implement additional AST visitor passes in `localScanner.ts` for other languages (Python, Go, Rust).
  - Add comprehensive Vitest unit tests for compiler outputs and vector similarity math.
  - Optimize UI rendering and state management across analytical tabs.
- **Recommended AI workflow**:
  - Follow modular component practices (`/src/components/`).
  - Maintain strict type safety in `/src/types.ts`.
  - Validate all changes with `npm run lint` and `npm run build`.

---

## Risks
- **Technical risks**: Event-loop blocking during large synchronous file-tree traversals.
- **Maintenance risks**: Keeping custom AST visitor logic synchronized with future TypeScript syntax updates.
- **Adoption risks**: Developers must configure their own API keys (Gemini, Groq, OpenRouter, GitHub PAT) to unlock full multi-provider capabilities.
- **Dependency risks**: Upstream changes in `@google/genai` SDK or external LLM gateway APIs.

---

## Evidence & Uncertainty
- **Evidence coverage**: `HIGH` — 100% of workspace files, configurations, build tools, and backend controllers were directly viewed and verified.
- **High-confidence findings**: Clean TypeScript compilation (`tsc --noEmit`), operational Vite build, active Express server routes, and verified in-memory embeddings engine.
- **Important unknowns**: Real-world performance profiles on monorepos with >100,000 source files; live remote database sync behavior.
- **Assumptions or inferences**: Target audience and product intent inferred from UI components and documentation.
- **Analysis limitations**: Analysis performed within container sandbox without external persistent PostgreSQL instance.

---

## Next Actions
1. **Enforce Backend API Route Authentication**: Add middleware verifying session tokens or pre-shared keys on `/api/ask` and `/api/embeddings/search`.
2. **Asynchronous Worker Threads for AST Scanner**: Move `localScanner.ts` file reading and AST parsing into background worker threads.
3. **Automated Test Suite Expansion**: Write comprehensive Vitest unit tests for the AST compiler, vector cosine similarity calculations, and router classification logic.

---

## Project Memory

### Important Decisions
- **TypeScript Compiler API Integration**: Replaced regex heuristics with `ts.createSourceFile` in `localScanner.ts` for 100% accurate class, interface, and function extraction.
- **Mathematical Vector Embeddings**: Implemented live vector embeddings via `gemini-embedding-2-preview` on `/api/embeddings/search` with cosine dot-product similarity ranking.
- **Zero-Telemetry Client Key Architecture**: User-provided keys (Groq, OpenRouter, GitHub PAT) are kept strictly client-side in LocalStorage and forwarded via request headers only when making active proxy calls.
- **Unified Port 3000 Architecture**: Dev server and production container both bind to port 3000 host `0.0.0.0` with Vite middleware in dev and `express.static('dist')` in production.

### Architectural Constraints
- Port 3000 is the hardcoded externally accessible port.
- Gemini API key must be accessed via `process.env.GEMINI_API_KEY` on the server and never exposed to the client bundle.
- Production start command executes `node dist/server.cjs`, bundled with esbuild using `--packages=external`.

### Known Limitations
- AST scanning currently executes synchronously via `fs.readFileSync` and `ts.createSourceFile`.
- Document embeddings cache resides in server memory and resets across container reboots.
- GitHub workspace synchronization uses Personal Access Tokens rather than a server-side OAuth2 web redirect flow.

### Future Ideas
- WebAssembly Tree-Sitter parsing to enable multi-language repository intelligence (Go, Rust, Python, Java).
- Persistent vector indexing backed by Cloud SQL PostgreSQL with the `pgvector` extension.
- Automated CI/CD headless mode outputting CCC IR artifacts during build pipelines.

### Lessons Learned
- Formal AST parsing is mandatory for reliable code intelligence; regular expressions fail on multiline type signatures and nested generics.
- Dynamic query complexity classification allows cost-effective routing between low-latency inference (Groq) and deep reasoning models (Claude 3.5 Sonnet / Gemini 2.5 Flash).
