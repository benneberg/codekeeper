schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

correctness:
  value: The application compiles cleanly, and type checking is completely verified via tsc --noEmit. Built-in AST compilers run dynamically using native TypeScript Compiler APIs.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Running npm run lint output
    - Running npm run build output
  notes: ""

security_issues:
  - title: "Unauthenticated API routes (/api/ask, /api/repositories)"
    severity: MEDIUM
    evidence: "server.ts lines 36-48: No API token gate middleware is enforced on routes, exposing resources in deployed containers."
    impact: "Malicious users can exhaust Google Gemini or Groq token credits by spamming API endpoints directly."
    recommendation: "Introduce an authentication middleware verifying JWT signatures or secure pre-shared tokens on all ingress headers."
    confidence: HIGH
  - title: "Local storage exposure of third-party API Keys"
    severity: LOW
    evidence: "SettingsPanel.tsx lines 145-165: Stores Groq, OpenRouter, and GitHub Personal Access Tokens inside cleartext LocalStorage."
    impact: "Susceptible to client-side XSS attacks if third-party malicious scripts are successfully executed in the browser context."
    recommendation: "Encapsulate key operations behind HTTP-only cookie scopes, or encrypt strings before storing them in local context."
    confidence: HIGH

dependencies:
  value: All core packages run on their latest stable major versions. No outdated or high-risk deprecated packages were identified.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json dependencies and versions
  notes: ""

performance_issues:
  - title: "Synchronous directory file scanning on Express thread"
    severity: MEDIUM
    evidence: "localScanner.ts lines 60-150: Executes fs.readFileSync and ts.createSourceFile synchronously inside the Express API handler path."
    impact: "For large repos, the thread pool will block, causing API request timeouts and severe latency spikes for concurrently active users."
    recommendation: "Delegate intensive parsing operations to secondary thread workers using Node's 'worker_threads' module."
    confidence: HIGH

maintainability:
  value: Highly modular React architecture. Individual tabs are encapsulated inside their own component files. Codebase metrics and mocked repositories are isolated cleanly.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Directory listing of src/components/
  notes: ""

code_quality:
  value: Extremely high. Clean TypeScript type definitions are implemented, and functional declarations with clear hooks are consistently enforced.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct code inspection across all files
  notes: ""

technical_debt:
  value: Minimal. Relational database storage for embeddings and user sessions is currently modeled in memory and LocalStorage, requiring minor cloud migrations for heavy enterprise-grade scenarios.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts in-memory lists
  notes: ""

observability:
  value: Basic standard console streaming is active. Lacks structured, level-based logging frameworks or request correlation IDs.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts console.log commands
  notes: ""

testing:
  value: Setup includes Vitest configuration and a standard testing pipeline framework. No active unit tests are written for custom components.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json devDependencies
  notes: ""

documentation:
  value: Up-to-date and complete. Both README.md and TODO.md fully align with the current state of TypeScript compiler integrations and dynamic model routes.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Direct verification of README.md and TODO.md
  notes: ""

ci_cd:
  value: Standard build compilation commands are configured cleanly. Lacks automated configuration templates (e.g. GitHub actions workflows) for production-grade pipelines.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json scripts
  notes: ""
