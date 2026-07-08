import React from "react";
import { MockRepository, StaticAnalysisWarning } from "../../server/mockRepositories";
import { ShieldCheck, Flame, CheckSquare, AlertTriangle } from "lucide-react";

interface Props {
  repo: MockRepository;
}

export default function SystemGovernance({ repo }: Props) {
  // Compute standard scores from repository variables
  const integrityScore = Math.max(20, 100 - repo.technicalDebt.score - (repo.securityRisk.score * 4));
  const securityScore = Math.round(100 - (repo.securityRisk.score * 10));

  // Calculate observability average & grade
  const obsAverage = Math.round((repo.observabilityCoverage.logging + repo.observabilityCoverage.metrics + repo.observabilityCoverage.tracing) / 3);
  const obsGrade = obsAverage >= 80 ? "A" : obsAverage >= 60 ? "B" : "C";

  // Determine priority issues based on severity
  const roadmapItems = [
    {
      prio: "P0 - Emergency Fix",
      title: repo.id === "iot-gateway" ? "Extract hardcoded connection string from MqttClient" : "Parameterize Raw SQL User query in AuthController",
      effort: "Low",
      roi: "Vulnerability Remediation (100% Risk Elimination)",
      color: "border-rose-200 text-rose-700 bg-rose-50"
    },
    {
      prio: "P1 - Architecture Cleanup",
      title: repo.id === "iot-gateway" ? "Decouple direct DB Context calls behind Repository layer" : "Extract local configurations to JWT security model config",
      effort: "Medium",
      roi: "Enhanced Modularity (Enables isolated unit test mocks)",
      color: "border-amber-200 text-amber-700 bg-amber-50"
    },
    {
      prio: "P2 - Operational Readiness",
      title: repo.id === "iot-gateway" ? "Resolve suppressed exception and enable explicit telemetry logs" : "Implement global try/catch error logs on PG connection fails",
      effort: "Low",
      roi: "Observability boost (Clears production monitoring blind spots)",
      color: "border-slate-200 text-slate-700 bg-[#faf9f6]"
    }
  ];

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top statistics panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Modularity Integrity dial */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Architecture Modularity</span>
            <div className="text-2xl font-bold text-slate-900">{integrityScore}%</div>
            <p className="text-[10px] text-slate-600 font-sans leading-relaxed">Layered separation conformance score.</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-mono font-bold text-slate-950 text-xs bg-[#faf9f6]">
            {integrityScore >= 70 ? "Good" : "Weak"}
          </div>
        </div>

        {/* Security Index dial */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Security Score</span>
            <div className="text-2xl font-bold text-slate-900">{securityScore}/100</div>
            <p className="text-[10px] text-slate-600 font-sans leading-relaxed">No threat exposures remaining index.</p>
          </div>
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs ${
            securityScore >= 70 ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-rose-600 text-rose-700 bg-rose-50"
          }`}>
            {securityScore}%
          </div>
        </div>

        {/* Observability level */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Observability Rating</span>
            <div className="text-2xl font-bold text-slate-900">Grade {obsGrade}</div>
            <p className="text-[10px] text-slate-600 font-sans leading-relaxed">System trace log density quotient.</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center font-mono font-bold text-slate-700 text-xs bg-[#faf9f6]">
            {obsGrade}
          </div>
        </div>
      </div>

      {/* Main Governance dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prescription Roadmap */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">
              Prescribed Refactoring Prescription Roadmap
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Sequence of architectural interventions to reach a clean, decoupled state.
            </p>
          </div>

          <div className="space-y-3.5">
            {roadmapItems.map((item, idx) => (
              <div key={idx} className={`p-4 border rounded-lg space-y-2 ${item.color}`}>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span>{item.prio}</span>
                  <span className="bg-white/80 px-1.5 py-0.2 rounded border">Effort: {item.effort}</span>
                </div>
                <div className="text-xs font-sans font-bold leading-normal">{item.title}</div>
                <div className="text-[10px] font-mono opacity-80 pt-1 border-t border-black/5">
                  ROI: {item.roi}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Static scan issues list */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">
              Static Analysis Security Risk Catalog
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Live compiler detections mapped from standard Semgrep checklists.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {repo.staticAnalysis.map((warn, i) => (
              <div key={i} className="p-3.5 bg-[#fcfbfa] border border-slate-200 rounded-lg text-xs space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    High risk
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded font-bold text-slate-700 uppercase">
                    {warn.tool}
                  </span>
                </div>
                <div className="text-slate-800 font-sans font-semibold leading-relaxed">
                  {warn.message}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  File: {warn.file} | Line {warn.line}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
