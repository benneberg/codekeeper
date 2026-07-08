import React from "react";
import { MockRepository } from "../../server/mockRepositories";
import { FolderGit2, AlertTriangle, Cpu, ShieldAlert, BadgeCheck } from "lucide-react";

interface Props {
  repositories: any[];
  selectedRepoId: string | null;
  onSelect: (id: string) => void;
}

export default function RepositorySelector({ repositories, selectedRepoId, onSelect }: Props) {
  return (
    <div className="w-full">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans tracking-tight">
          <FolderGit2 className="w-5 h-5 text-slate-700" />
          Target Engineering Workspaces
        </h2>
        <p className="text-xs text-slate-600 mt-1 font-sans">
          Select a repository to compile, reason over dependencies, run multi-agent audits, or query the Professor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {repositories.map((repo) => {
          const isSelected = repo.id === selectedRepoId;
          const langColors: Record<string, string> = {
            "C#": "bg-purple-50 text-purple-700 border-purple-200",
            "TypeScript": "bg-blue-50 text-blue-700 border-blue-200",
            "Python": "bg-yellow-50 text-yellow-700 border-yellow-200"
          };

          return (
            <button
              key={repo.id}
              id={`repo-btn-${repo.id}`}
              onClick={() => onSelect(repo.id)}
              className={`text-left p-6 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-slate-950 ring-1 ring-slate-950 scale-[1.01] shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-400 hover:shadow-xs"
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-3 w-full">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${langColors[repo.language] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                    {repo.language}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 font-bold">
                      {repo.fileCount} files
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 font-bold">
                      {repo.symbolCount} symbols
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-sans tracking-tight">
                  {repo.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 min-h-[2rem] leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] font-mono w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[9px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Security Risk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-xs ${repo.securityScore > 7 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {repo.securityScore}/10
                    </span>
                    <div className="w-12 bg-slate-100 h-1.5 rounded overflow-hidden border border-slate-200">
                      <div
                        className={`h-full ${repo.securityScore > 7 ? 'bg-rose-600' : 'bg-emerald-600'}`}
                        style={{ width: `${repo.securityScore * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[9px]">
                    <Cpu className="w-3.5 h-3.5 text-amber-600" />
                    <span>Technical Debt</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-xs text-slate-800`}>
                      Grade {repo.techDebtRating}
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.1 rounded font-bold ${
                      repo.techDebtRating === "A" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      repo.techDebtRating === "B" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
                      "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      Score {repo.technicalDebt}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
