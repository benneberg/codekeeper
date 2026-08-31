# Security Policy

This document outlines the security policies, access control model, credentials handling, and vulnerability reporting procedures for the AI Repository Intelligence Platform (ARIP).

---

## Supported Versions

| Version | Supported | Status |
|---|---|---|
| Latest main branch | Yes | Active development |

---

## Security Boundaries & Model

### 1. Environment & API Secrets Isolation
- **Server-Side Credentials (`GEMINI_API_KEY`)**: Loaded strictly via `process.env.GEMINI_API_KEY` on the Node.js server. The key is never exposed to the client bundle, never prefixed with `VITE_`, and never logged in console output or APM metrics.
- **Client-Side Pass-Through Credentials**: Third-party API keys (Groq, OpenRouter) and GitHub Personal Access Tokens (PAT) are stored in the user's browser `localStorage` under key prefixes `arip_*`. They are forwarded strictly inside request headers (`x-groq-key`, `x-openrouter-key`, `Authorization: Bearer`) when active calls are made, and are never persisted to any server database or disk file.

### 2. API Endpoint Protection (`apiAuthGuard`)
All stateful or billable backend endpoints are protected by centralized authorization middleware:
- **Protected Endpoints**:
  - `POST /api/ask`
  - `POST /api/embeddings/search`
  - `POST /api/github/sync`
  - `GET /api/metrics`
- **Accepted Authentication Mechanisms**:
  1. `Authorization: Bearer <API_TOKEN>`
  2. `x-api-token: <API_TOKEN>` header
  3. `arip_session` HTTP cookie (provisioned automatically on UI asset load)
- **Token Configuration**: Set via `API_AUTH_TOKEN` in `.env`. If unspecified, an internal session token is dynamically generated at startup.
- **Public Endpoints**:
  - `GET /api/session/bootstrap`: Initializes browser session credentials.
  - `GET /api/repositories`: Provides read-only metadata summaries.
  - `GET /api/repositories/:id`: Provides read-only AST symbol definitions.

### 3. Input Validation & Defense in Depth
- `POST /api/ask` executes schema verification (`validateAskRequest`) enforcing:
  - Non-empty, valid string for `repoId` (must match an active or registered repository).
  - Non-empty string for `question`, with length capped at 2,000 characters to prevent prompt injection and resource exhaustion.
  - Array validation on `chatHistory` entries.
- `POST /api/embeddings/search` validates that the query parameter is a non-empty string.
- `POST /api/github/sync` validates that the GitHub PAT is present before attempting upstream connections.

### 4. Filesystem Access
- The AST scanner (`server/localScanner.ts`) reads files strictly within the repository workspace directory using relative path normalization.
- Sensitive and build directories (`node_modules`, `.git`, `dist`, `.llm-context`) are explicitly ignored during directory traversal.

---

## Operational Security Guidelines

1. **Production Deployment**: Always run behind an HTTPS-terminating reverse proxy (e.g. Google Cloud Run) to protect credentials in transit.
2. **Key Rotation**: When rotating `GEMINI_API_KEY` or `API_AUTH_TOKEN`, update `.env` and restart the Node.js container process.
3. **Client-Side Storage**: In shared browser environments, clear the browser `localStorage` or click **Clear Stored Keys** in the Settings tab to purge cached API tokens.

---

## Reporting a Vulnerability

If you discover a potential security vulnerability in ARIP, please report it responsibly:

1. **Do not create a public issue**.
2. Email details of the vulnerability to the project maintainers with:
   - Description of the issue and potential impact
   - Steps or proof-of-concept to reproduce
   - Suggested fix or mitigation (if known)
3. The maintainers will acknowledge receipt within 48 hours and coordinate a fix and release timeline.
