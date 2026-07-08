import React, { useState } from "react";
import { Database, Search, Library, FileText, Check, Cpu, Sparkles } from "lucide-react";

interface DocumentVector {
  id: string;
  category: "ADR" | "Documentation" | "Issue" | "Pull Request" | "CCC Artifact";
  title: string;
  snippet: string;
  tokens: number;
}

export default function EmbeddingLayer() {
  const [selectedDb, setSelectedDb] = useState<"qdrant" | "weaviate" | "pgvector">("qdrant");
  const [searchQuery, setSearchQuery] = useState("auth token credentials");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([
    {
      title: "ADR-004: JWT Session Validation",
      category: "ADR",
      snippet: "Use JSON Web Tokens generated on the AuthController for secure stateless validation of client identity. Hardcoded secrets inside config/jwt must be externalized.",
      similarity: 0.945,
      tokens: 180
    },
    {
      title: "Issue #18: Fix unparameterized SQL operations",
      category: "Issue",
      snippet: "AuthController directly references raw db queries instead of clean parameterized prepared expressions. Potential risk of SQL Injection.",
      similarity: 0.812,
      tokens: 240
    }
  ]);

  const allDocuments: DocumentVector[] = [
    { id: "VEC-01", category: "ADR", title: "ADR-004: JWT Session Validation", snippet: "Use JSON Web Tokens generated on the AuthController for secure stateless validation of client identity...", tokens: 180 },
    { id: "VEC-02", category: "ADR", title: "ADR-009: Repository Pattern Segregation", snippet: "Establish clear service interfaces over DB context targets to prevent downstream regression propagation...", tokens: 290 },
    { id: "VEC-03", category: "Documentation", title: "CCC Artifact compilation manual", snippet: "Defines the symbol AST output parameters dumped directly into the .llm-context/ directory layout...", tokens: 410 },
    { id: "VEC-04", category: "Issue", title: "Issue #18: Fix unparameterized SQL operations", snippet: "AuthController directly references raw db queries instead of clean parameterized prepared expressions...", tokens: 240 },
    { id: "VEC-05", category: "Pull Request", title: "PR #42: Add MQTT client connection retries", snippet: "Introduces incremental backoff retry blocks on the client connector path for secure IoT streams...", tokens: 320 }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate smart semantic cosine search after short timeout
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let matches = [];

      if (query.includes("auth") || query.includes("token") || query.includes("cred")) {
        matches = [
          {
            title: "ADR-004: JWT Session Validation",
            category: "ADR",
            snippet: "Use JSON Web Tokens generated on the AuthController for secure stateless validation of client identity. Hardcoded secrets inside config/jwt must be externalized.",
            similarity: 0.952,
            tokens: 180
          },
          {
            title: "Issue #18: Fix unparameterized SQL operations",
            category: "Issue",
            snippet: "AuthController directly references raw db queries instead of clean parameterized prepared expressions. Potential risk of SQL Injection.",
            similarity: 0.824,
            tokens: 240
          }
        ];
      } else if (query.includes("mqtt") || query.includes("iot") || query.includes("retry") || query.includes("connect")) {
        matches = [
          {
            title: "PR #42: Add MQTT client connection retries",
            category: "Pull Request",
            snippet: "Introduces incremental backoff retry blocks on the client connector path for secure IoT streams. Solves transient dropouts.",
            similarity: 0.918,
            tokens: 320
          },
          {
            title: "ADR-009: Repository Pattern Segregation",
            category: "ADR",
            snippet: "Establish clear service interfaces over DB context targets to prevent downstream regression propagation and enable mock testing environments.",
            similarity: 0.735,
            tokens: 290
          }
        ];
      } else {
        // Fallback random-ish semantic matches
        matches = [
          {
            title: "CCC Artifact compilation manual",
            category: "Documentation",
            snippet: "Defines the symbol AST output parameters dumped directly into the .llm-context/ directory layout for agent grounding context.",
            similarity: 0.781,
            tokens: 410
          },
          {
            title: "ADR-009: Repository Pattern Segregation",
            category: "ADR",
            snippet: "Establish clear service interfaces over DB context targets to prevent downstream regression propagation.",
            similarity: 0.694,
            tokens: 290
          }
        ];
      }

      setSearchResults(matches);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
          <Database className="w-5 h-5 text-slate-700" />
          Semantic Embedding Layer Dashboard
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Store and fetch high-dimensional vector representations of codebase ADRs, manual logs, PR discussions, and issues. Provide semantic context search capabilities directly to your AI reasoning agent swarm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: DB selector and Vector stats */}
        <div className="lg:col-span-4 space-y-5">
          {/* Engine Selector */}
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Vector Database Engine
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "qdrant", name: "Qdrant Vector DB", desc: "Fast Rust-based engine with HNSW indexing" },
                { id: "weaviate", name: "Weaviate Cloud", desc: "Fully-featured GraphQL semantic layer" },
                { id: "pgvector", name: "PostgreSQL pgvector", desc: "Relational-embedded vector search indexes" }
              ].map((db) => (
                <button
                  key={db.id}
                  onClick={() => setSelectedDb(db.id as any)}
                  className={`p-3 rounded border text-left transition-all duration-150 cursor-pointer ${
                    selectedDb === db.id
                      ? "bg-slate-900 border-slate-950 text-white"
                      : "bg-[#faf9f6] border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-bold font-sans flex items-center gap-1.5">
                    {selectedDb === db.id && <Check className="w-3.5 h-3.5" />}
                    {db.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 font-mono ${selectedDb === db.id ? "text-slate-300" : "text-slate-500"}`}>
                    {db.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Database metrics */}
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-3.5 shadow-sm font-mono text-xs text-slate-700">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Vector Engine Metrics
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Vector Dimensions:</span>
                <span className="font-bold text-slate-900">1536 (text-embedding-3)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Embeddings:</span>
                <span className="font-bold text-slate-900">2,482 Vectors</span>
              </div>
              <div className="flex justify-between">
                <span>Indexing Algorithm:</span>
                <span className="font-bold text-slate-900">HNSW (Cosine similarity)</span>
              </div>
              <div className="flex justify-between">
                <span>Query Latency:</span>
                <span className="font-bold text-slate-900">~1.45ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Document search and index viewer */}
        <div className="lg:col-span-8 space-y-5">
          {/* Interactive Semantic Search Form */}
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Query Semantic Retrieval Sandbox
            </h4>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter semantic concept (e.g. 'auth credentials', 'mqtt retry logic')..."
                  className="w-full bg-[#faf9f6] border border-slate-200 rounded pl-9 pr-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded font-mono text-xs cursor-pointer select-none"
              >
                {isSearching ? "Computing Embeddings..." : "Fetch Vectors"}
              </button>
            </form>

            {/* Results Display */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                Ranked Semantic Matches (Similarity &gt; 0.7)
              </div>

              <div className="space-y-3">
                {searchResults.map((res, i) => (
                  <div key={i} className="p-3.5 bg-[#fcfbfa] border border-slate-200 rounded-lg space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-sans">
                      <span className="font-bold text-slate-900">{res.title}</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded text-[10px]">
                        Similarity: {(res.similarity * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed font-sans italic">
                      "{res.snippet}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Category: {res.category}</span>
                      <span>Token size: {res.tokens}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* List of currently indexed documents */}
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Browse Index Map Documents ({allDocuments.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {allDocuments.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between items-center font-mono text-[10px] text-slate-500">
                    <span>{doc.id}</span>
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-bold uppercase">{doc.category}</span>
                  </div>
                  <div className="font-sans font-semibold text-slate-800 truncate">{doc.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{doc.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
