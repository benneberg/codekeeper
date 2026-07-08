import React, { useState, useRef, useEffect } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { Terminal, CornerDownLeft } from "lucide-react";

interface Props {
  repo: MockRepository;
  isCompiled: boolean;
  onCompiled: () => void;
}

export default function TerminalEmulator({ repo, isCompiled, onCompiled }: Props) {
  const [history, setHistory] = useState<string[]>([
    "Welcome to ARIP CLI (Code Context Compiler v2.8.4)",
    "Type 'help' to see the list of available deterministic ccc commands.",
    `Active repository context: ${repo.name} (${repo.language})`,
    ""
  ]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, `ccc@arip-compiler:~$ ${cmdString}`]);
    setInput("");

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();

    if (command === "clear") {
      setHistory([]);
      return;
    }

    if (command === "help") {
      setHistory(prev => [
        ...prev,
        "Available ccc CLI commands:",
        "  ccc generate          - Runs the Code Context Compiler to build .llm-context/",
        "  ccc explore <query>   - Queries the symbol index by keywords (e.g. 'ccc explore auth')",
        "  ccc impact <file>     - Evaluates the change blast radius of a target file",
        "  ccc system analyze    - Performs architecture-wide coupling and risk analysis",
        "  ccc ask \"<question>\"  - Submits a custom prompt query directly to the Repository Professor",
        "  clear                 - Clears the terminal screen log",
        ""
      ]);
      return;
    }

    if (trimmed === "ccc generate") {
      setHistory(prev => [
        ...prev,
        `[CCC ENGINE] Booting context compiler targeting workspace root: ./${repo.id}/`,
        "[STEP 1/5] Scanning codebase files...",
        `  -> Found ${repo.files.length} supported code files.`,
        "[STEP 2/5] Running AST Parsers...",
        `  -> Extracted ${repo.symbols.length} symbol definitions correctly.`,
        "[STEP 3/5] Resolving import structures...",
        "[STEP 4/5] Executing static quality audits...",
        "[STEP 5/5] Emitting deterministic context outputs in .llm-context/",
        "✓ CCC Compilation completed successfully.",
        ""
      ]);
      onCompiled();
      return;
    }

    if (trimmed.startsWith("ccc explore")) {
      const query = parts.slice(2).join(" ").toLowerCase();
      if (!query) {
        setHistory(prev => [...prev, "Error: Must specify a keyword query (e.g. ccc explore auth)", ""]);
        return;
      }

      const matches = repo.symbols.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.file.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        setHistory(prev => [...prev, `No matching AST symbols found for query: '${query}'`, ""]);
        return;
      }

      setHistory(prev => [
        ...prev,
        `Matched ${matches.length} indexed AST symbols:`,
        ...matches.map(m => `  [Symbol: ${m.name}] Type: ${m.type} in ${m.file} (Line: ${m.line})`),
        ""
      ]);
      return;
    }

    if (trimmed.startsWith("ccc impact")) {
      const targetFile = parts.slice(2).join(" ");
      if (!targetFile) {
        setHistory(prev => [...prev, "Error: Must specify a target file path (e.g. ccc impact src/auth/AuthController.ts)", ""]);
        return;
      }

      // Fuzzy match
      const matchFile = repo.files.find(f => f.toLowerCase().includes(targetFile.toLowerCase())) || targetFile;

      // Dependents lookup
      const directDeps: string[] = [];
      Object.entries(repo.dependencies).forEach(([file, edges]) => {
        if (edges.some(e => e.target === matchFile)) {
          directDeps.push(file);
        }
      });

      const totalAffected = directDeps.length;
      const score = Math.min(1.0, totalAffected / 4);

      setHistory(prev => [
        ...prev,
        "=== CCC CAUSALITY IMPACT REPORT ===",
        `Target File:       ${matchFile}`,
        `Blast risk factor: ${(score * 100).toFixed(0)}%`,
        "Direct Dependents:",
        ...directDeps.map(d => `  - ${d}`),
        totalAffected === 0 ? "  - No direct dependents found." : "",
        "===================================",
        ""
      ]);
      return;
    }

    if (trimmed === "ccc system analyze") {
      const score = Math.max(20, 100 - repo.technicalDebt.score - (repo.securityRisk.score * 4));
      setHistory(prev => [
        ...prev,
        "┌──────────────────────────────────────────────────────────┐",
        "│             CCC SYSTEM ARCHITECTURE REPORT               │",
        "├──────────────────────────────────────────────────────────┤",
        `│ Modularity integrity score:               ${score.toString().padEnd(14)} │`,
        `│ Security vulnerability index:             ${(100 - (repo.securityRisk.score * 10)).toString().padEnd(14)} │`,
        `│ Technical debt index:                     ${repo.technicalDebt.score.toString().padEnd(14)} │`,
        "├──────────────────────────────────────────────────────────┤",
        "│ Top Refactoring Prescriptions:                           │",
        repo.id === "iot-gateway"
          ? "│ 1. Extract plain-text broker passwords inside MqttClient │\n│ 2. Decouple direct EF DbContext inside DeviceManager     │"
          : "│ 1. parameterize queries to secure SQL injections         │\n│ 2. Extract JWT secrets out of source credentials         │",
        "└──────────────────────────────────────────────────────────┘",
        ""
      ]);
      return;
    }

    if (trimmed.startsWith("ccc ask")) {
      const question = trimmed.match(/"([^"]+)"/) || trimmed.match(/'([^']+)'/);
      const queryText = question ? question[1] : parts.slice(2).join(" ");

      if (!queryText) {
        setHistory(prev => [...prev, 'Error: Question must be wrapped in quotes (e.g. ccc ask "What is risky?")', ""]);
        return;
      }

      setHistory(prev => [...prev, "[CCC QUERY] Connecting with Repository Professor...", ""]);

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: queryText, repoId: repo.id })
        });

        if (!res.ok) throw new Error("API call failed");
        const data = await res.json();

        const answerLines = data.answer
          .split("\n")
          .map((line: string) => line.replace(/###/g, "").replace(/\*\*/g, "").replace(/`/g, ""))
          .filter((line: string) => line.trim().length > 0);

        setHistory(prev => [...prev, ...answerLines, ""]);
      } catch (err: any) {
        setHistory(prev => [...prev, `Error querying professor API: ${err.message}`, ""]);
      }
      return;
    }

    setHistory(prev => [...prev, `Unknown command: '${command}'. Type 'help' to review guidelines.`, ""]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-[500px] shadow-sm">
      <div className="bg-[#faf9f6] border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-slate-800">
          <Terminal className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-mono font-bold">Terminal - CCC CLI Grounding Console</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">ccc@arip-compiler:~</span>
      </div>

      {/* Terminal log stream */}
      <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] text-slate-800 bg-white space-y-1 select-text scroll-smooth">
        {history.map((line, i) => {
          let lineClass = "text-slate-700";
          if (line.startsWith("ccc@arip-compiler:~$")) {
            lineClass = "text-slate-900 font-bold mt-2";
          } else if (line.startsWith("┌") || line.startsWith("├") || line.startsWith("└") || line.startsWith("│")) {
            lineClass = "text-slate-400 font-mono";
          } else if (line.startsWith("✓") || line.includes("successfully")) {
            lineClass = "text-emerald-700 font-bold";
          } else if (line.startsWith("Error:")) {
            lineClass = "text-rose-600 font-bold";
          }

          return (
            <div key={i} className={`whitespace-pre ${lineClass}`}>
              {line}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal input line */}
      <div className="bg-[#faf9f6] border-t border-slate-200 p-3 shrink-0 flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-slate-900 shrink-0">ccc@arip-compiler:~$</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="flex-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-slate-900 focus:outline-none placeholder-slate-400"
            placeholder="Type 'help' or commands (e.g. ccc system analyze)..."
            autoFocus
          />
          <button type="submit" className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
