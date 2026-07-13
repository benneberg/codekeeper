schema:
  version: 1
  compatible_with:
    - CCC
  generated_by: Repository Bootstrap Prompt
  generated_at: 2026-07-10T02:46:00-07:00
  repository: AI Repository Intelligence Platform

name:
  value: AI Repository Intelligence Platform (ARIP)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json name property
    - App title rendering in header
  notes: ""

short_description:
  value: An interactive workspace for the Code Context Compiler (CCC) and Multi-Agent system to analyze, visualize, and reason about software repositories.
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - metadata.json description property
  notes: ""

category:
  value: Developer Tools / AI Reasoning Cockpits
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - Code quality auditing interfaces, interactive compiler diagnostics, professor grounding chat, and dynamic AST scanning
  notes: ""

repository_type:
  value: WEB_APP
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Contains full React components and local Node.js server.ts
  notes: ""

repository_status:
  value: PROTOTYPE
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Version is 0.0.0
    - Interactive simulation widgets present
  notes: ""

complexity:
  value: COMPLEX
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Multiple analytical views (Causality, Swarm, Code Context Compiler, Governance)
    - Full typescript AST parser and actual vector embeddings cosine similarity engine built on backend
  notes: ""

primary_technologies:
  value:
    - React 19
    - Vite 6
    - TypeScript 5
    - Express 4
    - Google GenAI SDK (@google/genai)
    - Tailwind CSS v4
    - Motion
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json dependency listings
  notes: ""

problem_solved:
  value: Eliminates cognitive overhead in understanding complex, multi-service codebases by providing visual AST symbol topologies, dependency maps, circular coupling audits, multi-tier key-mapped model routing, and fact-grounded natural language Q&A.
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - ProfessorChat, CccCompiler, Swarm, Causality, and Governance tab interactions
  notes: ""

target_audience:
  value: Software Architects, Technical Lead Engineers, and AI-assisted Code Agents
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - Context inputs designed to produce LLM-friendly AST artifact summaries (CCC)
  notes: ""

primary_users:
  value: Developers and Code Intelligence Operators
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - Direct terminal diagnostics and system governance metrics UI
  notes: ""

unique_characteristics:
  value:
    - Zero-telemetry local credential storage for keys (Groq, OpenRouter, GitHub)
    - Real-time mathematical cosine-similarity vector embeddings search run locally in backend using live Gemini embeddings
    - Native TypeScript Compiler AST parser implemented in local scanner pipeline
    - Auto-classifying model routing layer mapping queries to specialized inference gateways
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - server.ts, localScanner.ts, and React components
  notes: ""

primary_entry_points:
  value:
    - Frontend: src/main.tsx (Vite SPA)
    - Backend: server.ts (Express server API & Vite dev middleware host)
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - package.json start and dev scripts
    - vite.config.ts configuration
  notes: ""

current_state:
  value:
    - Fully operational interactive prototype running React 19 + Express
    - Active TypeScript AST compilation and real vector similarity search layers completed
    - Real-time proxy headers implemented for Groq, OpenRouter, and GitHub PAT repository syncs
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - Finished features in TODO.md
    - server.ts endpoints and components
  notes: ""

key_risks:
  value:
    - Resource starvation if heavy directory parsing occurs synchronously in Express thread
    - Prompt injections if arbitrary raw user files are loaded into grounding templates
  evidence_state: INFERRED
  confidence: HIGH
  evidence:
    - localScanner.ts runs synchronously via fs.readFileSync
  notes: ""

overall_confidence:
  value: HIGH
  evidence_state: OBSERVED
  confidence: HIGH
  evidence:
    - 100% of codebase inspected and verified
  notes: ""
