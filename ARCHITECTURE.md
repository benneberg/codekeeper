schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

architecture_style:
  value: Full-Stack Single-Container Service Architecture
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json defines unified scripts
    - server.ts mounts express.static serving dist/ folder
  notes: "Unified development and deployment setup where Node.js hosts API endpoints and serves frontend client bundles."

major_components:
  value:
    - Client UI Cockpit: SPA client utilizing modular components corresponding to analytical dashboards (Professor Chat, Embedded Space, Compiler, Systems, Settings).
    - API Proxy Router (server.ts): Express gateway exposing API endpoints, proxying remote requests, and loading relative filesystem states.
    - TypeScript Compiler AST Parsing Engine (localScanner.ts): Official Compiler API processor analyzing local TS/TSX constructs structurally.
    - Mock Codebase Metrics Registry (mockRepositories.ts): Pre-loaded software telemetry schemas for simulation sandboxing.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - src/components/ directory listing
    - server/ directory files
  notes: ""

responsibilities:
  value:
    - Client UI: Collects custom user configuration, inputs, and renders semantic graphs, dependency DAGs, and interactive metrics.
    - Express Backend: Authenticates requests via session tokens, serves local code assets, parses local workspace abstract syntax trees, and proxies prompt payloads to external model interfaces.
    - localScanner.ts: Translates flat files into structured token maps (classes, interfaces, dependency vectors) for downstream LLM grounding.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - App.tsx navigation and state handlers
    - server.ts API controllers
  notes: ""

dependency_flow:
  value:
    - Client SPA makes direct HTTP API requests to server.ts endpoints using custom fetch hooks.
    - server.ts calls localScanner.ts and mockRepositories.ts internally to assemble workspace telemetry.
    - server.ts resolves model grounding prompts using either standard Google GenAI SDK or custom header keys to external providers (Groq / OpenRouter).
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts imports localScanner
    - ProfessorChat.tsx initiates API requests to /api/ask
  notes: ""

data_flow:
  value:
    - Query Flow: User inputs question inside Professor Chat -> Request sent to /api/ask with context parameters -> Backend determines complexity -> If custom header keys (Groq, OpenRouter) are present, request routes to external completions API, otherwise queries server-side Gemini -> Grounded answer returned to client.
    - Sync Flow: User inserts GitHub PAT token in Settings -> Request sent to /api/github/sync -> Backend queries api.github.com -> Returns live repo definitions -> React state merges them and saves list to client LocalStorage.
    - Search Flow: User triggers query in Embeddings tab -> POST sent to /api/embeddings/search -> Backend requests Gemini embedContent vector -> Computes cosine similarity against cache -> Returns sorted matches.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts API implementations
    - SettingsPanel.tsx, EmbeddingLayer.tsx, ProfessorChat.tsx fetch calls
  notes: ""

source_of_truth:
  value:
    - Codebase Structure: The active workspace directory (read via relative fs paths) is the source of truth for AST scanner telemetry.
    - User Settings: HTML5 LocalStorage in the browser context stores credentials and selected repository preferences.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - localScanner.ts reads relative directories
    - localStorage hooks in SettingsPanel.tsx
  notes: ""

entry_points:
  value:
    - Frontend: src/main.tsx (Vite root entry point loading React DOM)
    - Backend: server.ts (Express entry point loading static SPA directories)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json dev, build, and start scripts
    - vite.config.ts configuration
  notes: ""

external_systems:
  value:
    - GitHub REST API: Reached via https://api.github.com to query live repositories.
    - Google Gemini Developer API: Reached via @google/genai SDK to generate grounded chat answers and token embeddings.
    - Groq Inference API: Reached via https://api.groq.com/openai/v1/chat/completions for fast LLM inference.
    - OpenRouter Gateway: Reached via https://openrouter.ai/api/v1/chat/completions for custom routed model endpoints.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts custom proxy headers and API fetch paths
  notes: ""

extension_points:
  value:
    - Addition of other custom language compilers inside localScanner.ts.
    - Integration of durable cloud databases (e.g. Firestore / Cloud SQL) to replace local in-memory embeddings cache.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - TODO.md roadmap segments
  notes: ""

configuration:
  value:
    - Environmental Keys: process.env.GEMINI_API_KEY
    - Client Keys: LocalStorage variables ('arip_groq_api_key', 'arip_openrouter_api_key', 'arip_github_token')
    - System Ports: Port 3000 host 0.0.0.0
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - .env.example
    - server.ts code
  notes: ""

constraints:
  value:
    - Port constraint: Single container, strictly bound to port 3000.
    - Synchronous parsing constraint: Runs single-threaded synchronous directory checks.
    - Client isolation: No central cloud SQL storage is present; all settings remain completely offline-first inside client's browser context.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - localScanner.ts fs operations
    - package.json script port binds
  notes: ""

architecture_risks:
  value:
    - Running recursive synchronous filesystem searches inside Express request queues can lock event loops under massive project directory states.
    - Storing private API keys inside LocalStorage is secure from server-side databases, but vulnerable to XSS attacks if untrusted scripts are injected into client static files.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - fs.readFileSync use in localScanner.ts
  notes: ""

improvement_opportunities:
  value:
    - Move file-scanning AST operations into dedicated background Worker Threads or async task cues.
    - Replace mock repositories completely with physical directory targets inside a dynamic local workspace editor.
    - Implement Zod validation schemas for all inbound backend API payloads to prevent shell escape attempts.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - server.ts is currently accepting unfiltered parameters
  notes: ""

unknown_areas:
  value:
    - System performance metrics when parsing code bases that exceed 10 million physical lines of code.
    - Rate limiting tolerances of external model APIs under rapid multi-turn chat interaction bursts.
  evidence_state: INFERRED
  confidence: MEDIUM
  evidence:
    - No request rate limits are configured in server.ts
  notes: ""
