# AI Repository Intelligence Platform (ARIP)

## 1. Overview
ARIP (v2.8) is a developer platform designed for deterministic software semantic analysis and multi-agent reasoning. By avoiding generic LLM speculation, ARIP scans Abstract Syntax Trees (AST) and compiles direct repository metrics (vulnerability ratings, modularity scores, coupling maps) to cleanly ground conversational code agents and consensus-based swarms in objective factual evidence.

---

## 2. Installation
To set up the development environment locally:

1. Clone the repository to your workspace.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Add your Google Gemini API key to your configuration or `.env` file (see `.env.example`):
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *Note: If no API key is specified, the application automatically runs in dynamic offline simulation mode with rule-matched fallback responses.*

---

## 3. Usage
To launch the application development server:
```bash
npm run dev
```
The application will boot up on port 3000. Access the dashboard in your browser at `http://localhost:3000`.

### Interaction Workflow:
1. **Workspace Selector**: Choose a target repository (e.g. IoT Gateway, SaaS Auth, Billing).
2. **Compile AST Context**: Navigate to the **CCC Compiler** or **Console** tab and execute the compiler. This unlocks the downstream reasoning panels.
3. **Review Metrics**: Check the **Architect Agent**, **Causality**, and **Governance** tabs for modularity index ratings, circular loop warnings, and change impact blast radiuses.
4. **Configure Settings & Keys**: Go to the **Settings** tab. Securely input and save API keys for **Groq fast inference API**, **OpenRouter**, and **GitHub** locally inside browser state.
5. **Map Model Routing Tiers**: Customize provider and model preferences (such as LLaMA-3, Gemini Flash, Claude Sonnet) inside the **Model Router** and test prompt complexity matching.
6. **Manage GitHub Workspaces**: Toggle permissions for loaded repositories or register new GitHub repositories to instantly synchronize with the workspace selector.
7. **Consult Professor**: Engage the fact-grounded chat assistant to receive targeted refactoring prescriptions citing precise line-number evidence.

---

## 4. Settings & Credentials Privacy
All configuration keys, credentials, and custom workspaces are saved **locally inside the client's browser context** (HTML5 LocalStorage). No private credentials or third-party keys are ever committed to logs or shared backends.

---

## 5. Testing
- Static code formatting and syntax checks are managed via TypeScript type compilation:
  ```bash
  npm run lint
  ```
- Detailed plans to implement Vitest unit and integration test harnesses are outlined in `TESTING_DELTA.md`.

---

## 6. Build & Deployment
The build process packages both frontend single-page assets and server entry points:

### Production Compilation:
```bash
```bash
npm run build
```
This command:
1. Triggers `vite build` to bundle client files into `/dist`.
2. Invokes `esbuild` to compile `server.ts` into a bundled, single CommonJS file `/dist/server.cjs`.

### Running Production Build:
To boot the production full-stack server container:
```bash
npm start
```
The standalone server binds to host `0.0.0.0` on port `3000`.

---

## 7. Production Migration & Future Roadmap
For detailed architectural blueprints on migrating simulated components (like OAuth integrations, Tree-Sitter compiler scopes, server-side credential proxies, and Pgvector vector embedding layers) to enterprise-ready cloud systems, see the `TODO.md` file.
