***Temp***
Add github actions
[Feature] AST Parser Background Worker Threads (Proposed in ACTION_PLAN.md):

Description: Offload filesystem AST parsing in server/localScanner.ts to Node.js worker_threads to avoid blocking the Express event loop on large workspaces.

Labels: enhancement, performance

[Feature] Persistent pgvector Storage in Cloud SQL (Proposed in ACTION_PLAN.md):

Description: Transition the in-memory document embeddings cache in server.ts to a managed PostgreSQL database with the pgvector extension for long-term document persistence.

Labels: enhancement, database

[Security] Client-Side Key Encryption (Proposed in ACTION_PLAN.md):

Description: Apply symmetric encryption (e.g. Web Crypto API AES-GCM) to client-side third-party API keys before storing them in browser localStorage.

Labels: security, frontend

[Feature] Enterprise GitHub OAuth2 Server Flow (Proposed in ACTION_PLAN.md):

Description: Complement direct Personal Access Token entry with a server-managed GitHub OAuth2 web application authorization flow.

Labels: enhancement, auth