import React, { useState } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { AlertOctagon, HelpCircle, ArrowDown, ChevronRight, Layers } from "lucide-react";

interface Props {
  repo: MockRepository;
}

export default function ImpactAnalyzer({ repo }: Props) {
  const [selectedFile, setSelectedFile] = useState<string>(repo.files[0] || "");

  // Reverse dependency lookup
  const getDirectDependents = (target: string) => {
    const list: string[] = [];
    Object.entries(repo.dependencies).forEach(([file, edges]) => {
      if (edges.some(e => e.target === target)) {
        list.push(file);
      }
    });
    return list;
  };

  const getTransitiveDependents = (target: string) => {
    const visited = new Set<string>();
    const stack = [target];
    const affected: string[] = [];

    while (stack.length > 0) {
      const node = stack.pop()!;
      Object.entries(repo.dependencies).forEach(([file, edges]) => {
        if (edges.some(e => e.target === node)) {
          if (!visited.has(file)) {
            visited.add(file);
            affected.push(file);
            stack.push(file);
          }
        }
      });
    }

    return affected;
  };

  const directDeps = getDirectDependents(selectedFile);
  const transitiveDeps = getTransitiveDependents(selectedFile).filter(f => !directDeps.includes(f));
  
  // Calculate simulated risk score
  const totalAffected = directDeps.length + transitiveDeps.length;
  const riskScore = Math.min(1.0, totalAffected / 4);

  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-lg flex flex-col space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Select Code Target</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">Pick a file to evaluate system-wide change impact</p>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {repo.files.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded text-xs font-mono transition-all duration-150 cursor-pointer border ${
                  selectedFile === file
                    ? "bg-slate-900 border-slate-950 text-white font-bold"
                    : "bg-white border-slate-100 hover:bg-[#faf9f6] text-slate-700"
                }`}
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        {/* Right blast analysis */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-1 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">
                  Causality Blast Radius
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Static simulation tracing downstream compiler regression paths.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Risk Level:</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                  riskScore > 0.7 ? "bg-rose-50 text-rose-700 border-rose-200" :
                  riskScore > 0.3 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {riskScore > 0.7 ? "CRITICAL" : riskScore > 0.3 ? "MODERATE" : "SAFE"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#faf9f6] border border-slate-200 rounded-lg flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-500 font-mono">TARGET COMPILER NODE</div>
                <div className="text-xs font-mono font-bold text-slate-900">{selectedFile}</div>
              </div>

              <div className="flex items-center gap-4 text-center font-mono">
                <div className="p-2 border border-slate-200 rounded min-w-[70px] bg-white">
                  <div className="text-lg font-bold text-slate-900">{directDeps.length}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Direct</div>
                </div>
                <div className="p-2 border border-slate-200 rounded min-w-[70px] bg-white">
                  <div className="text-lg font-bold text-slate-900">{transitiveDeps.length}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Transitive</div>
                </div>
              </div>
            </div>

            {/* Dependency flow list */}
            <div className="space-y-3 pt-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                AFFECTED COMPILER CHANNELS ({totalAffected})
              </div>

              {totalAffected === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
                  This module has no downstream consumers. Modifying it is isolated.
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {directDeps.map((dep) => (
                    <div key={dep} className="p-3 border border-slate-200 rounded-lg flex justify-between items-center bg-white font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                        <span>{dep}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded">
                        Direct downstream
                      </span>
                    </div>
                  ))}

                  {transitiveDeps.map((dep) => (
                    <div key={dep} className="p-3 border border-slate-200 rounded-lg flex justify-between items-center bg-white font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        <span>{dep}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                        Indirect downstream
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
