schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

repository_type:
  value: WEB_APP
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json contains react and vite
    - App.tsx renders interactive single-page application tabs
    - server.ts mounts express.static serving dist/ folder
  notes: "The repository serves both as a React frontend client and an Express backend API, categorized as a full-stack web application."

repository_status:
  value: PROTOTYPE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - version in package.json is 0.0.0
    - TODO.md describes production preparation plans
    - Component simulations are present across key tabs
  notes: "Designed as an interactive, highly detailed analytical dashboard prototype with production migration plans documented."

complexity:
  value: COMPLEX
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Multi-component system inside src/components/
    - High-fidelity graph simulations, compiler models, causality analyzers, and server-side model routing
    - Real-time TypeScript AST parsing and Google embedding vector matching integrations
  notes: "High complexity owing to the diverse integration of multi-tier model routers, AST parsing engines, and custom semantic search."

primary_language:
  value: TypeScript
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json includes typescript devDependency
    - Files use .ts and .tsx extensions
    - tsconfig.json is present in root
  notes: ""

secondary_languages:
  value:
    - HTML
    - CSS
    - JavaScript
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - index.html in project root
    - src/index.css containing global styles
    - vite.config.ts for build config
  notes: ""

primary_framework:
  value: React
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json includes react dependency (v19.0.1)
    - src/main.tsx and src/App.tsx initialize React runtime
  notes: "Uses React 19 for declarative UI."

build_system:
  value: Vite
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json includes vite and @tailwindcss/vite
    - vite.config.ts exists in root
  notes: "Bundles frontend static files with Vite, and uses esbuild to bundle the backend server."

package_manager:
  value: npm
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package-lock.json exists in root
  notes: ""

test_framework:
  value: vitest
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json contains vitest under devDependencies and test script "vitest run"
  notes: ""

workspace_or_single_repository:
  value: SINGLE_REPOSITORY
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Single package.json file at the root
    - No multi-project workspaces (e.g. pnpm-workspace.yaml or lerna.json) configured
  notes: ""

repository_maturity:
  value: PROTOTYPE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json version is 0.0.0
    - Existing TODO.md defines missing roadmap segments
  notes: ""

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - All files inspected and validated via direct file viewing
    - App compiles and lints with 100% success rate
  notes: ""

evidence_summary:
  value:
    - Entire filesystem analyzed including server.ts, package.json, and all sub-components
    - Integrated TypeScript compiler API and real Gemini/Groq/OpenRouter router proxy
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - File inspections via view_file on all directories
  notes: ""

unknown_areas:
  value:
    - Real-world performance under massive monorepos where AST parser limits could cause lag
    - Long-term database state sync behavior
  evidence_state: INFERRED
  confidence: MEDIUM
  evidence:
    - localScanner.ts does not run inside web workers
  notes: ""
