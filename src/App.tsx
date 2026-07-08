import React, { useState, useEffect } from "react";
import RepositorySelector from "./components/RepositorySelector";
import CccCompiler from "./components/CccCompiler";
import AgentOrchestrator from "./components/AgentOrchestrator";
import ProfessorChat from "./components/ProfessorChat";
import ImpactAnalyzer from "./components/ImpactAnalyzer";
import SystemGovernance from "./components/SystemGovernance";
import TerminalEmulator from "./components/TerminalEmulator";
import ArchitectAgentPanel from "./components/ArchitectAgentPanel";
import RepositoryScanner from "./components/RepositoryScanner";
import ModelRouter from "./components/ModelRouter";
import EmbeddingLayer from "./components/EmbeddingLayer";
import SettingsPanel from "./components/SettingsPanel";
import InfoModal from "./components/InfoModal";
import { MockRepository } from "../server/mockRepositories";
import {
  Cpu,
  Brain,
  Layers,
  ShieldCheck,
  Terminal,
  AlertCircle,
  RefreshCw,
  BarChart3,
  HelpCircle,
  GitBranch,
  Shuffle,
  Database,
  Info,
  Settings
} from "lucide-react";

export default function App() {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [activeRepo, setActiveRepo] = useState<MockRepository | null>(null);
  const [compiledRepos, setCompiledRepos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("arip_compiled_repos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<string>("ccc");
  const [loading, setLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Persist compiled repos to localStorage when modified
  useEffect(() => {
    try {
      localStorage.setItem("arip_compiled_repos", JSON.stringify(compiledRepos));
    } catch (err) {
      console.error("Failed to save compiled repos to localStorage:", err);
    }
  }, [compiledRepos]);

  // Load repositories summary
  const loadRepositories = () => {
    fetch("/api/session/bootstrap")
      .then((res) => {
        if (!res.ok) throw new Error("Bootstrap failed");
        return res.json();
      })
      .then((session) => {
        const token = session.token || "arip-secure-session-token-2026";
        sessionStorage.setItem("arip_api_token", token);
        return fetch("/api/repositories", {
          headers: { "x-api-token": token }
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          let merged = [...data];
          
          // Merge dynamic custom repos from localStorage
          try {
            const savedCustom = localStorage.getItem("arip_custom_repos");
            if (savedCustom) {
              const customRepos = JSON.parse(savedCustom);
              if (Array.isArray(customRepos)) {
                customRepos.forEach((cr: any) => {
                  if (!merged.some(r => r.id === cr.id)) {
                    merged.push({
                      id: cr.id,
                      name: cr.name,
                      description: cr.description,
                      language: cr.language,
                      fileCount: cr.filesCount || 4,
                      symbolCount: Math.floor((cr.filesCount || 4) * 2.5),
                      securityScore: 1.5,
                      technicalDebt: 10,
                      techDebtRating: "A"
                    });
                  }
                });
              }
            }
          } catch (e) {
            console.error("Error parsing custom repos:", e);
          }

          // Filter by enabled repositories list (GitHub permission settings)
          try {
            const savedEnabled = localStorage.getItem("arip_enabled_repos");
            if (savedEnabled) {
              const enabledIds = JSON.parse(savedEnabled);
              if (Array.isArray(enabledIds)) {
                merged = merged.filter(r => enabledIds.includes(r.id));
              }
            }
          } catch (e) {
            console.error("Error parsing enabled repos:", e);
          }

          setRepositories(merged);
          
          if (merged.length > 0) {
            setSelectedRepoId((curr) => {
              if (curr && merged.some(r => r.id === curr)) return curr;
              return merged[0].id;
            });
          } else {
            setSelectedRepoId(null);
          }
        } else {
          console.error("Invalid repositories data response format:", data);
          setRepositories([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch repositories:", err);
        setRepositories([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRepositories();

    // Dynamically re-filter/synchronize repositories list when localStorage updates from SettingsPanel
    const handleStorageChange = () => {
      loadRepositories();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Load detailed repo data when selector changes
  useEffect(() => {
    if (selectedRepoId) {
      setLoading(true);
      const token = sessionStorage.getItem("arip_api_token") || "arip-secure-session-token-2026";
      
      // Load custom repository mock structure client-side if selected
      const savedCustom = localStorage.getItem("arip_custom_repos");
      let customRepoDetails = null;
      if (savedCustom) {
        try {
          const list = JSON.parse(savedCustom);
          const found = list.find((cr: any) => cr.id === selectedRepoId);
          if (found) {
            customRepoDetails = {
              id: found.id,
              name: found.name,
              description: found.description,
              language: found.language,
              files: Array.from({ length: found.filesCount }, (_, i) => `src/File${i + 1}.ts`),
              fileContents: Array.from({ length: found.filesCount }).reduce((acc: any, _, i) => {
                acc[`src/File${i + 1}.ts`] = `// Synchronized GitHub workspace: ${found.name}\nexport function main() {\n  console.log("AST verification check complete!");\n}`;
                return acc;
              }, {}),
              symbols: Array.from({ length: Math.floor(found.filesCount * 2.5) }).map((_, i) => ({
                name: `verifyModule${i + 1}`,
                type: "function",
                file: `src/File${Math.floor(i / 2.5) + 1}.ts`,
                line: i * 5 + 2,
                description: `Exported entrypoint helper for ${found.name}`
              })),
              dependencies: {},
              architectureRules: ["RULE-01: Custom repo must comply with local static verification rules."],
              staticAnalysis: [],
              observabilityCoverage: { logging: 90, metrics: 80, tracing: 75, gaps: [] },
              securityRisk: { score: 1.5, threats: [] },
              technicalDebt: { score: 10, rating: "A", smells: [] }
            };
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (customRepoDetails) {
        setActiveRepo(customRepoDetails);
        setLoading(false);
      } else {
        fetch(`/api/repositories/${selectedRepoId}`, {
          headers: { "x-api-token": token }
        })
          .then((res) => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
          })
          .then((data) => {
            setActiveRepo(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch repository details:", err);
            setLoading(false);
          });
      }
    } else {
      setActiveRepo(null);
    }
  }, [selectedRepoId]);

  const handleSelectRepo = (id: string) => {
    setSelectedRepoId(id);
    setActiveTab("ccc");
  };

  const handleOnCompiled = () => {
    if (selectedRepoId && !compiledRepos.includes(selectedRepoId)) {
      setCompiledRepos((prev) => [...prev, selectedRepoId]);
    }
  };

  const isCurrentRepoCompiled = selectedRepoId ? compiledRepos.includes(selectedRepoId) : false;

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Platform Top Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded border border-slate-900 flex items-center justify-center bg-white shadow-xs">
            <Brain className="w-5 h-5 text-slate-900 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 font-sans uppercase">
                AI Repository Intelligence Platform
              </h1>
              <span className="text-[9px] font-mono bg-slate-900 text-white border border-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                v2.8 Standard
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5 tracking-wide">
              Deterministic Software Semantics & Multi-Agent Reasoning Swarms
            </p>
          </div>
        </div>

        {/* Global System Status Bars & Controls */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>CCC COMPILER: ONLINE</span>
          </div>

          {/* Elegant Info modal toggler */}
          <button
            onClick={() => setIsInfoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-150 cursor-pointer select-none font-bold"
          >
            <Info className="w-3.5 h-3.5 text-white" />
            <span>EXPLAIN SYSTEM</span>
          </button>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Repo selector */}
        {loading && repositories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-slate-800 animate-spin" />
            <span className="text-xs font-mono text-slate-600">Loading system workspaces...</span>
          </div>
        ) : (
          <RepositorySelector
            repositories={repositories}
            selectedRepoId={selectedRepoId}
            onSelect={handleSelectRepo}
          />
        )}

        {/* Selected Workspace Operations Panels */}
        {activeRepo && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
            {/* Tab navigation headers - highly minimal line styled */}
            <div className="bg-[#faf9f6] border-b border-slate-200 px-4 flex flex-wrap items-stretch shrink-0 gap-1">
              <button
                id="tab-ccc"
                onClick={() => setActiveTab("ccc")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "ccc"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                CCC Compiler
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Analyzes and compiles codebase facts into deterministic AST structures.
                </div>
              </button>

              <button
                id="tab-architect"
                onClick={() => setActiveTab("architect")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "architect"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Architect Agent
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Formulates high-level system boundaries and clean refactoring plans.
                </div>
              </button>

              <button
                id="tab-scanner"
                onClick={() => setActiveTab("scanner")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "scanner"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                Scanner
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Extracts real-time workspace code files, symbol lists, and code metrics.
                </div>
              </button>

              <button
                id="tab-router"
                onClick={() => setActiveTab("router")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "router"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                Model Router
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Directs prompts to customized, cost-effective, and low-latency model tiers.
                </div>
              </button>

              <button
                id="tab-embeddings"
                onClick={() => setActiveTab("embeddings")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "embeddings"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Embedding Layer
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Visualizes code semantic clusters and similarity rankings in multi-dimensional space.
                </div>
              </button>

              <button
                id="tab-chat"
                disabled={!isCurrentRepoCompiled}
                onClick={() => setActiveTab("chat")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                  activeTab === "chat"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                Professor
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Grounds interactive model conversations on compiled code symbols and contexts.
                </div>
              </button>

              <button
                id="tab-agents"
                disabled={!isCurrentRepoCompiled}
                onClick={() => setActiveTab("agents")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                  activeTab === "agents"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Swarm
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Executes parallel audits, risk analysis swarms, and architecture recommendations.
                </div>
              </button>

              <button
                id="tab-impact"
                disabled={!isCurrentRepoCompiled}
                onClick={() => setActiveTab("impact")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                  activeTab === "impact"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Causality
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Traces forward and backward dependency impact paths across components.
                </div>
              </button>

              <button
                id="tab-governance"
                disabled={!isCurrentRepoCompiled}
                onClick={() => setActiveTab("governance")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                  activeTab === "governance"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Governance
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Evaluates static test analysis, compliance reports, and tech debt scores.
                </div>
              </button>

              <button
                id="tab-cli"
                onClick={() => setActiveTab("cli")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "cli"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Console
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Runs workspace terminal utilities, AST logs, and sandbox script runs.
                </div>
              </button>

              <button
                id="tab-settings"
                onClick={() => setActiveTab("settings")}
                className={`relative group px-4 py-3.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  activeTab === "settings"
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 font-mono text-[10px] px-2.5 py-1.5 rounded border border-slate-950 shadow-md whitespace-normal w-56 text-center z-50 pointer-events-none tracking-wide normal-case leading-relaxed font-normal font-sans">
                  <div className="font-bold text-rose-400 mb-0.5 uppercase text-[9px] tracking-wider">module info</div>
                  Configure secure credentials for Groq, OpenRouter, and GitHub repositories.
                </div>
              </button>
            </div>

            {/* Compiled state locking prompt */}
            {!isCurrentRepoCompiled &&
            activeTab !== "ccc" &&
            activeTab !== "cli" &&
            activeTab !== "scanner" &&
            activeTab !== "router" &&
            activeTab !== "embeddings" &&
            activeTab !== "architect" &&
            activeTab !== "settings" ? (
              <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12">
                <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm font-sans">Context Compilation Required</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono">
                    Please compile this workspace's codebase facts inside the <strong>CCC Compiler</strong> tab first. AI agents require deterministic AST symbols context for high-precision reasoning.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("ccc")}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-white rounded cursor-pointer transition-all duration-150"
                >
                  Return to CCC Compiler
                </button>
              </div>
            ) : (
              <div className="p-6">
                {activeTab === "ccc" && (
                  <CccCompiler
                    repo={activeRepo}
                    isCompiled={isCurrentRepoCompiled}
                    onCompiled={handleOnCompiled}
                  />
                )}

                {activeTab === "architect" && (
                  <ArchitectAgentPanel repo={activeRepo} />
                )}

                {activeTab === "scanner" && (
                  <RepositoryScanner
                    repo={activeRepo}
                    onTriggerRefresh={handleOnCompiled}
                  />
                )}

                {activeTab === "router" && (
                  <ModelRouter />
                )}

                {activeTab === "embeddings" && (
                  <EmbeddingLayer />
                )}

                {activeTab === "chat" && (
                  <ProfessorChat repo={activeRepo} />
                )}

                {activeTab === "agents" && (
                  <AgentOrchestrator repo={activeRepo} />
                )}

                {activeTab === "impact" && (
                  <ImpactAnalyzer repo={activeRepo} />
                )}

                {activeTab === "governance" && (
                  <SystemGovernance repo={activeRepo} />
                )}

                {activeTab === "cli" && (
                  <TerminalEmulator
                    repo={activeRepo}
                    isCompiled={isCurrentRepoCompiled}
                    onCompiled={handleOnCompiled}
                  />
                )}

                {activeTab === "settings" && (
                  <SettingsPanel />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Platform Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 mt-auto shrink-0 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
        <div>© 2026 AI Repository Intelligence Platform (ARIP). All rights reserved.</div>
        <div className="flex items-center gap-3">
          <span>Secure Sandbox Environment</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>AST Engines: Node.js / Tree-Sitter</span>
        </div>
      </footer>

      {/* Info Resource Guide Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
