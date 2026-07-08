# AI Repository Intelligence Platform (ARIP)

ARIP (v2.8) is a state-of-the-art developer platform engineered for **Deterministic Software Semantics & Multi-Agent Reasoning Swarms**. By avoiding generic LLM guesswork, ARIP targets Abstract Syntax Trees (AST) and explicit logical dependencies to ground AI agent capabilities.

---

## Key Core Features

### 1. Code Context Compiler (CCC)
The central deterministic facts engine. By parsing files into symbolic AST indexes (`symbol-index.json`), directed dependency graphs (`dependency-graph.json`), and security/observability maps, we compile a local grounding context stored cleanly inside the `.llm-context/` workspace folder.

### 2. Multi-Agent Reasoning Swarms
Consists of 8 specialized static analysis agents, including:
- **Architect Agent**: Reviews layers violations, tracks module coupling, and outlines domain boundary cohesion scores.
- **Security Agent**: Identifies unparameterized SQL operations, raw credential leakage, and hardcoded secrets.
- **Code Quality Agent**: Analyzes cyclomatic complexity, suppressing of empty try/catch block patterns, and naming compliance.

### 3. Smart Semantic Embedding Layer
Integrates vector database selectors (such as Qdrant, Weaviate, or pgvector) to store and query documentation, Architecture Decision Records (ADRs), pull requests, and issues with exact Cosine Similarity matching metrics.

### 4. Dynamic Model Router
A tiered cost/latency-weighted routing strategy. High-velocity checks go to sub-100ms Groq instances (`llama-3-8b`), while complete architectural audits leverage powerful cloud reasoning engines (`claude-3.5-sonnet`).

---

## High-Level Architecture Flow

```
   Source Code Repository
             ↓
    Repository Scanner (Git Webhooks / scheduled shallow clones)
             ↓
     CCC AST Compile Engine (Tree-Sitter / namespace parsing)
             ↓
   Canonical Grounded Context (.llm-context/) + Vector Embedding Databases
             ↓
  Multi-Agent Swarm (Consensus Matrix & Refactoring Prescriptions)
```

---

## Minimalist Scandinavian Style
Designed with premium **Scandinavian minimalism**:
- Crisp cream-paper backgrounds (`#fcfbfa`)
- Thin high-contrast vector lines & minimalist typography pairs (`Space Grotesk` Display, `Playfair Display` serif accents, and `JetBrains Mono` console blocks).
- Fast and fluid tab layouts optimizing negative space and information density.
