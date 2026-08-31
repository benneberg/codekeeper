# LLM & Coding Agent Context

This document provides critical operational context and constraints for AI coding agents working on this codebase. For full system details, refer to the authoritative documents listed below.

---

## Authoritative Documentation Map

- **What the project is, usage, installation, API routes**: [README.md](../README.md)
- **Component responsibilities, data flow, invariants**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Security policies, authentication, credentials isolation**: [SECURITY.md](../SECURITY.md)
- **Contribution workflow, scripts, coding conventions**: [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Critical Invariants & Constraints

1. **Port & Host Binding**:
   - The application **must strictly bind to host `0.0.0.0` and port `3000`**.
   - Port 3000 is the only externally accessible port in container environments. Do not change or parameterize the port to other values.

2. **Full-Stack Single-Container Architecture**:
   - Backend is Express (`server.ts`).
   - In development, Express mounts Vite middleware (`createViteServer({ server: { middlewareMode: true }, appType: "spa" })`).
   - In production, Express serves `dist/` static files with a catch-all route sending `dist/index.html`.

3. **Backend Bundling & Production Execution**:
   - Backend compiles with esbuild: `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
   - Production entry command is `node dist/server.cjs`.
   - All server-side TypeScript code must remain CommonJS bundle-safe.

4. **Secret Isolation**:
   - `GEMINI_API_KEY` is server-only (`process.env.GEMINI_API_KEY`). **Never** expose it to the browser bundle or prefix with `VITE_`.
   - Third-party provider keys (Groq, OpenRouter) and GitHub PAT are stored client-side in `localStorage` and sent in request headers (`x-groq-key`, `x-openrouter-key`, `Authorization: Bearer`). Do not create server-side persistence for these.

5. **AST Compiler Engine**:
   - `server/localScanner.ts` uses the official TypeScript Compiler API (`ts.createSourceFile`) for structural AST parsing. Do not revert to naive regex parsing for TypeScript files.

---

## Common Traps & Pitfalls

- **Do not add unrequested backend servers or databases**: Persistent vector databases (e.g. Cloud SQL pgvector) are future backlog items. The current implementation uses an in-memory cache with cosine dot products.
- **Do not bypass API auth**: Stateful/query endpoints (`/api/ask`, `/api/embeddings/search`, `/api/github/sync`, `/api/metrics`) use `apiAuthGuard`. Tests and clients must supply the session cookie, `Authorization: Bearer`, or `x-api-token`.
- **Do not edit package scripts without verifying build compatibility**: The build command must bundle both frontend (`vite build`) and backend (`esbuild server.ts ...`).
