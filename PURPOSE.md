# Product Purpose & Strategy

## 1. Product Summary
The AI Repository Intelligence Platform (ARIP) is an interactive, developer-centric platform that analyzes codebases using deterministic AST indexing rather than standard LLM guesswork. It grounds multi-agent reasoning, architectural validation, and conversational search inside highly verifiable code metrics and explicit structural facts.

## 2. Problem Statement
Generative AI tools and coding assistants frequently suffer from context hallucinations, lack of deep codebase understanding, and structural blind spots. They evaluate repositories as flat text files, overlooking concrete Abstract Syntax Tree (AST) relationships, module-coupling layers, and structural domain boundaries. This leads to insecure suggestions, circular dependency loops, and architectural regression.

## 3. Target Audience
- **Software Architects & Engineering Managers** (Confidence: High): Seeking to enforce architectural integrity rules, track technical debt ratings, and visualize system boundary violations.
- **Security & Compliance Engineers** (Confidence: High): Looking to run static analysis audits, spot plain-text secrets, and identify injection vectors with clear source code evidence.
- **Full-Stack Developers** (Confidence: Medium): Wanting high-precision, AST-grounded search interfaces and context-aware conversational code assistants.

## 4. Value Proposition
ARIP bridges the gap between deterministic compiler theory and modern AI agents. By compiling source code into a standard symbolic index and dependency map, the platform ensures that agent suggestions are 100% grounded in verifiable codebase facts, reducing hallucinations and enhancing system modularity.

## 5. Feature Registry

### Verified Features (Directly Executing in Codebase)
- **Multi-Workspaced Workspace Selector**: Switches smoothly between three diverse mock repositories (IoT Gateway, SaaS Auth Service, Stripe Billing Platform).
- **Code Context Compiler Tab**: Simulates high-fidelity compilation of AST symbol definitions, directed import structures, and vulnerability indices.
- **Architect Agent Panel**: Inspects detected layer boundary violations, evaluates domain boundary cohesion, and reports module-coupling metrics.
- **Repository Interactive Scanner**: Visualizes file directory layouts with quick status markers.
- **Dynamic Model Router Tab**: Provides cost and latency weight parameters for routing different verification tasks.
- **Smart Semantic Embedding Layer Tab**: Controls vector search stores (Qdrant, Weaviate, pgvector) with cosine similarity threshold toggles.
- **Professor Conversational Chat**: Communicates with a fact-grounded senior-architect agent, referencing real mock database files.
- **Swarm Multi-Agent Reasoning Panel**: Simulates an active group of 8 static-analysis agents (e.g. Code Quality, Security, Observability) working in parallel.
- **Causality Impact Analyzer**: Evaluates the blast-radius risk factor and dependent files for any target module.
- **System Governance Panel**: Reviews observability rating logs, traces coverage gaps, and priorities refactoring roadmaps.
- **Terminal CLI Console**: An emulator supporting interactive commands (`help`, `clear`, `ccc system analyze`, `ccc explore`).

### Inferred Features (Simulated with Rule-Based Fallbacks)
- **Local AST Tree-Sitter Execution**: Represented as a realistic compilation timeline in the UI, but uses mock datasets for rendering.
- **Vector Embeddings Database Generation**: Control sliders adjust metrics dynamically, but do not interface with a real cloud database instance.

### Future Features (Unimplemented Backlog)
- **Live Git Webhook Cloner**: Integration to clone and compile custom public/private repositories on demand.
- **Interactive Refactoring Editor**: Direct code repair interface allowing the user to apply agent-suggested prescriptions inside the browser window.
