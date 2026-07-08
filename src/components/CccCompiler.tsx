import React, { useState, useEffect } from "react";
import { MockRepository, SymbolItem } from "../../server/mockRepositories";
import { Play, Code, FileText, FileCode, CheckCircle, Terminal, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  repo: MockRepository;
  isCompiled: boolean;
  onCompiled: () => void;
}

export default function CccCompiler({ repo, isCompiled, onCompiled }: Props) {
  const [compiling, setCompiling] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<string>("symbol-index.json");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (repo && repo.files.length > 0) {
      setSelectedFile(repo.files[0]);
    }
  }, [repo]);

  const compileSteps = [
    { label: "Initializing Scanner Engine", msg: "Scanning workspace root. Filtering files with supported extensions (.py, .ts, .cs)..." },
    { label: "Running Tree-Sitter AST Parsers", msg: "Parsing Abstract Syntax Trees (AST) using language grammars. Discovering class nodes and method signatures..." },
    { label: "Building Directed SymMap", msg: "Resolving namespaces, cross-reference import statements, and mapping declaration points..." },
    { label: "Conducting Static Code Audit", msg: "Running Semgrep + SonarQube modules. Correlating physical locations with structural definitions..." },
    { label: "Emitting Deterministic Context (.llm-context/)", msg: "Generating canonical context artifacts: tree.txt, symbol-index.json, dependency-graph.json, risk-map.json..." }
  ];

  const handleCompile = () => {
    setCompiling(true);
    setCurrentStep(0);
    setProgress(0);
    setLogLines([`[CCC ENGINE] Booting Context Compiler v2.8.4...`, `[CCC ENGINE] Targeting workspace root: ./${repo.id}/`]);

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < compileSteps.length) {
        const step = compileSteps[stepIdx];
        setLogLines(prev => [
          ...prev,
          `\n[STEP ${stepIdx + 1}/${compileSteps.length}] ${step.label.toUpperCase()}`,
          `>> ${step.msg}`,
          ...(stepIdx === 0 ? repo.files.map(f => `  + Detected: ${f}`) : []),
          ...(stepIdx === 1 ? repo.symbols.map(s => `  + Parsed Symbol: ${s.name} (${s.type}) in ${s.file}`) : []),
          ...(stepIdx === 2 ? Object.keys(repo.dependencies).map(f => `  -> Mapped imports for: ${f}`) : []),
          `>> Step completed successfully.`
        ]);
        setCurrentStep(stepIdx);
        setProgress(Math.round(((stepIdx + 1) / compileSteps.length) * 100));
        stepIdx++;
      } else {
        clearInterval(interval);
        setCompiling(false);
        setLogLines(prev => [...prev, `\n[CCC ENGINE] Context compiling finished! Canonical facts generated in .llm-context/`, `✓ Platform reasoning engines unlocked.`]);
        onCompiled();
      }
    }, 800);
  };

  const getArtifactContent = (name: string) => {
    switch (name) {
      case "tree.txt":
        return repo.files.join("\n");
      case "symbol-index.json":
        return JSON.stringify(repo.symbols, null, 2);
      case "dependency-graph.json":
        return JSON.stringify(repo.dependencies, null, 2);
      case "architecture-rules.json":
        return JSON.stringify(repo.architectureRules, null, 2);
      case "risk-map.json":
        return JSON.stringify(repo.staticAnalysis, null, 2);
      case "observability-map.json":
        return JSON.stringify(repo.observabilityCoverage, null, 2);
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {!isCompiled && !compiling ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-200">
            <Code className="w-8 h-8 text-slate-700 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Compile Repository Context</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              LLMs should never analyze raw source files directly. Generate deterministic code facts (symbol declarations, dependency graphs, static vulnerabilities) through our AST compile engine first.
            </p>
          </div>
          <button
            id="compile-start-btn"
            onClick={handleCompile}
            className="px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-850 font-bold font-mono text-xs text-white transition-all duration-150 cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            ccc generate --repo={repo.id}
          </button>
        </div>
      ) : compiling ? (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-900 animate-pulse flex items-center gap-1.5 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-700" />
                Compiling Context: {compileSteps[currentStep].label}
              </span>
              <span className="text-slate-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-[#faf9f6] rounded border border-slate-200 h-2.5 overflow-hidden">
              <div className="bg-slate-900 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-[#faf9f6] border border-slate-200 rounded-lg p-4 font-mono text-[11px] text-slate-700 h-80 overflow-y-auto space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-slate-500 border-b border-slate-200 pb-2 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>CCC Engine Compiler logs</span>
            </div>
            {logLines.map((line, i) => (
              <div key={i} className={`whitespace-pre-wrap ${line.startsWith("✓") ? "text-emerald-700 font-bold" : line.startsWith(">>") ? "text-slate-500" : line.startsWith("[STEP") ? "text-slate-900 font-bold" : ""}`}>
                {line}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Simulated CCC outputs */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3 mb-3">
                <FileText className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-xs uppercase tracking-wider font-mono">Compiled Artifacts (.llm-context/)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-mono">
                {[
                  "tree.txt",
                  "symbol-index.json",
                  "dependency-graph.json",
                  "architecture-rules.json",
                  "risk-map.json",
                  "observability-map.json"
                ].map((artifact) => (
                  <button
                    key={artifact}
                    onClick={() => setSelectedArtifact(artifact)}
                    className={`p-2.5 rounded border text-left transition-all duration-150 cursor-pointer ${
                      selectedArtifact === artifact
                        ? "bg-[#faf9f6] border-slate-900 text-slate-900 font-bold"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                    }`}
                  >
                    <div className="font-bold text-[9px] uppercase text-slate-400">Artifact</div>
                    <div className="truncate font-mono mt-0.5">{artifact}</div>
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-[#faf9f6] border border-slate-200 rounded p-3 font-mono text-[11px] h-80 overflow-auto text-slate-800">
                <pre className="whitespace-pre-wrap leading-relaxed">{getArtifactContent(selectedArtifact)}</pre>
              </div>
            </div>
          </div>

          {/* Right panel: File Code Explorer */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <FileCode className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-xs uppercase tracking-wider font-mono">AST Source Explorer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">AST Context Live</span>
                </div>
              </div>

              {/* File selector tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {repo.files.map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-150 cursor-pointer border ${
                      selectedFile === file
                        ? "bg-slate-900 text-white border-slate-950 font-bold"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {file.split("/").pop()}
                  </button>
                ))}
              </div>

              {/* Source code window */}
              <div className="flex-1 bg-[#faf9f6] border border-slate-200 rounded overflow-hidden flex flex-col h-96">
                <div className="bg-[#f0eee9] border-b border-slate-200 px-3 py-2 text-[10px] font-mono text-slate-600 flex items-center justify-between">
                  <span>Path: {selectedFile}</span>
                  <span className="text-slate-500">Read Mode: Deterministic Fact</span>
                </div>
                <div className="flex-1 p-3 font-mono text-xs overflow-auto text-slate-800 whitespace-pre leading-relaxed select-text">
                  {repo.fileContents[selectedFile] || "// Empty code content"}
                </div>
              </div>

              {/* Inline Static Analyzer Overlay warning */}
              {repo.staticAnalysis.filter(w => w.file === selectedFile).length > 0 && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>CCC Security Compiler Warning on this file:</span>
                  </div>
                  {repo.staticAnalysis
                    .filter(w => w.file === selectedFile)
                    .map((warn, i) => (
                      <div key={i} className="font-mono text-slate-700 pl-5 relative border-l border-rose-300">
                        <span className="text-rose-600 font-bold">[Line {warn.line}]</span> {warn.message} 
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 border border-rose-200 text-rose-700 ml-2 uppercase">
                          {warn.tool}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
