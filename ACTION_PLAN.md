schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

immediate_actions:
  - title: "Enforce API Key Headers Authentication"
    description: "Introduce a central Express middleware checking session headers or pre-shared tokens on /api/ask and /api/embeddings/search to block raw unauthorized model execution."
    priority: "CRITICAL"
    expected_benefit: "Completely secures backend endpoints against external resource credit drainage."
    difficulty: "EASY"
    evidence: "server.ts lines 36-48: No endpoint auth guards verified in active controllers."
    confidence: "HIGH"

high_priority_actions:
  - title: "Asynchronous Web Workers for AST Scanner"
    description: "Refactor localScanner.ts to run heavy AST traversals and file compilations inside background Node.js Worker Threads, keeping the Express event loop highly responsive."
    priority: "HIGH"
    expected_benefit: "Prevents synchronous request blocking, improving system throughput and concurrency capacity."
    difficulty: "MEDIUM"
    evidence: "localScanner.ts uses fs.readFileSync inside routing callback loops."
    confidence: "HIGH"

medium_priority_actions:
  - title: "Persist Vectors in Cloud SQL PostgreSQL"
    description: "Replace the backend in-memory document embedding array with a persistent Cloud SQL PostgreSQL database instance running the pgvector extension."
    priority: "MEDIUM"
    expected_benefit: "Ensures infinite database horizontal scalability and durable, indexing-supported similarity lookups."
    difficulty: "MEDIUM"
    evidence: "server.ts lines 260-310: Embeddings are saved inside transient cache registries."
    confidence: "HIGH"

low_priority_actions:
  - title: "Client-side Key Encryption"
    description: "Apply standard symmetric AES encryption to API keys before persisting them to HTML5 LocalStorage, deriving keys from dynamic user-input session passcodes."
    priority: "LOW"
    expected_benefit: "Improves local browser credential isolation and mitigates basic XSS access vectors."
    difficulty: "EASY"
    evidence: "SettingsPanel.tsx lines 145-165: Keys are loaded and saved in plain text strings."
    confidence: "HIGH"

quick_wins:
  - title: "Zod Payload Validation Rules"
    description: "Implement Zod request validation filters on all ingress Express payloads, immediately catching and discarding corrupted or malicious parameters."
    priority: "MEDIUM"
    expected_benefit: "Eliminates potential path traversal or prompt injection vectors at zero system overhead."
    difficulty: "EASY"
    evidence: "server.ts does not run schema payload validators."
    confidence: "HIGH"

long_term_actions:
  - title: "Enterprise OAuth2 Server Flows"
    description: "Replace simple client-side Personal Access Token fields with a robust backend-managed GitHub OAuth2 web application authorization pipeline."
    priority: "LOW"
    expected_benefit: "Provides seamless, high-security enterprise single sign-on without requiring users to manually generate or configure developer tokens."
    difficulty: "COMPLEX"
    evidence: "SettingsPanel.tsx uses direct client input forms for GitHub PAT."
    confidence: "HIGH"
