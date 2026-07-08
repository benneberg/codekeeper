import React, { useState } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { Shield, Hammer, Eye, Compass, Activity, FileCheck, Layers, BookOpen, UserCheck, AlertTriangle, Play, Sparkles, CheckCircle } from "lucide-react";

interface Props {
  repo: MockRepository;
}

interface Agent {
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  findings: string[];
  risks: { area: string; severity: number; reason: string }[];
  recommendations: string[];
}

export default function AgentOrchestrator({ repo }: Props) {
  const [runningSwarm, setRunningSwarm] = useState(false);
  const [swarmCompleted, setSwarmCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("consensus");
  const [logs, setLogs] = useState<string[]>([]);

  // Map 8 specialized agents based on repository context
  const agents: Agent[] = [
    {
      name: "Architect Agent",
      role: "System coupling & layer violations inspector",
      icon: <Layers className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        repo.id === "iot-gateway"
          ? "Direct coupling: DeviceManager.cs inherits and manipulates DeviceDbContext directly, bypassing repository patterns."
          : "Direct bypassing: AuthController.ts imports UserDatabase class directly, bypasses services, and runs unparameterized SQL.",
        "Static structure limits database abstraction flexibility."
      ],
      risks: [
        { area: "Structural Coupling", severity: 7.8, reason: "Direct dependency on database driver prevents clean unit-testing." }
      ],
      recommendations: [
        "Abstract database layer using generic Repository and Unit of Work interfaces.",
        "Decouple direct imports between controllers and drivers."
      ]
    },
    {
      name: "Code Quality Agent",
      role: "Maintainability rating & complex logic parser",
      icon: <Hammer className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        repo.id === "iot-gateway"
          ? "Suppressed Exception: TelemetryPipeline.cs contains an empty catch block without logging, causing silent pipeline failures."
          : "SQL query string concatenation inside login method. Violates naming standards.",
        "High complexity found in business registration logic."
      ],
      risks: [
        { area: "Error Handling Suppression", severity: 8.0, reason: "Silent fail-states impede system debuggability." }
      ],
      recommendations: [
        "Inject explicit logger instances and re-throw critical database faults.",
        "Refactor high cyclomatic complexity routines using early-return guard blocks."
      ]
    },
    {
      name: "Security Agent",
      role: "Vulnerabilities & secret disclosure auditor",
      icon: <Shield className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        repo.id === "iot-gateway"
          ? "Hardcoded password found in MqttClient.cs connection arguments: 'secPass123_ioT'."
          : "VULNERABILITY: Raw unparameterized SQL query inside auth.controller.ts is highly vulnerable to injection inputs.",
        "Sensitive files lack configuration ignore rules."
      ],
      risks: [
        { area: "Credential Leakage / Injection", severity: 9.5, reason: "Plain-text secrets and raw SQL inputs risk total container compromise." }
      ],
      recommendations: [
        repo.id === "iot-gateway"
          ? "Migrate raw connection arguments to standard environment configurations."
          : "Utilize parameterized driver placeholders or migrate entirely to standard Knex/TypeORM query builders."
      ]
    },
    {
      name: "Observability Agent",
      role: "Logging, telemetry & trace instrumentation analyst",
      icon: <Eye className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        "Zero performance metric gauges or counters initialized in data collection loops.",
        "Correlation ID tracking is completely missing from incoming presentation endpoints."
      ],
      risks: [
        { area: "Production Blind Spots", severity: 7.0, reason: "Complete lack of operational warning monitors makes real-time crash tracing impossible." }
      ],
      recommendations: [
        "Inject structured logging contracts inside critical processing paths.",
        "Instrument connection retries with incremental backoff metrics."
      ]
    },
    {
      name: "Refactoring Agent",
      role: "Causality propagation optimizer",
      icon: <Compass className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        "Multiple target modules exhibit tight coupling risks with static utility helpers.",
        "Imports resolve file-to-file without interface gateways, complicating upgrades."
      ],
      risks: [
        { area: "Downstream Regression Cascade", severity: 6.5, reason: "A change to database structure instantly propagates compile errors to controllers." }
      ],
      recommendations: [
        "Establish interface boundaries between modules to restrict change blast radii."
      ]
    },
    {
      name: "Migration Agent",
      role: "Automated recipe & dependency path mapping provider",
      icon: <Activity className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        "Identified 2 core structures suitable for automated OpenRewrite refactoring recipes."
      ],
      risks: [],
      recommendations: [
        "Configure recipe org.openrewrite.dotnet.SecureConfig to extract hardcoded secrets.",
        "Run generic clean-up recipes to resolve empty catch-block patterns."
      ]
    },
    {
      name: "Documentation Agent",
      role: "Auto-ADR & knowledge generator",
      icon: <BookOpen className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        "Missing Architecture Decision Records (ADRs) explaining coupling decisions.",
        "Public API controllers lack documentation blocks."
      ],
      risks: [],
      recommendations: [
        "Generate docs/adr/0001-decouple-storage.md documenting boundaries.",
        "Compile README.md detailing local environment configuration requirements."
      ]
    },
    {
      name: "Technical Debt Agent",
      role: "Technical debt analyzer & prioritizer",
      icon: <UserCheck className="w-4 h-4 text-slate-800" />,
      color: "border-slate-200 text-slate-900 bg-[#faf9f6]",
      findings: [
        `Code smell index is rated highly, yielding a Grade of ${repo.technicalDebt.rating}.`,
        "Suppressed fail-states and raw SQL constructs accumulate 40+ engineering hours of debt."
      ],
      risks: [],
      recommendations: [
        "Prioritize the high-severity security vulnerabilities during the upcoming refactoring sprint."
      ]
    }
  ];

  const triggerSwarm = () => {
    setRunningSwarm(true);
    setSwarmCompleted(false);
    setLogs(["[SWARM ORCHESTRATOR] Initializing Multi-Agent Swarm...", "[SWARM ORCHESTRATOR] Dispatching 8 specialized engineers in parallel..."]);

    const steps = [
      { name: "Architect Agent", action: "Analyzing circular dependency loops and storage-layer bypass patterns..." },
      { name: "Code Quality Agent", action: "Auditing complexity ratings and examining exception suppressions..." },
      { name: "Security Agent", action: "Scanning for hardcoded key formats and raw SQL injection entry points..." },
      { name: "Observability Agent", action: "Scanning try/catch paths for logger missing integrations..." },
      { name: "Consensus Optimizer", action: "Aggregating findings and computing consensus scores..." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [
          ...prev,
          `\n[${step.name}] ${step.action}`,
          `>> Completed. Mapped ${idx + 1} findings with ground-truth facts.`
        ]);
        if (idx === steps.length - 1) {
          setRunningSwarm(false);
          setSwarmCompleted(true);
          setActiveTab("consensus");
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf9f6] p-5 rounded-lg border border-slate-200">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Sparkles className="w-4 h-4 text-slate-800" />
            Parallel Agent Swarm Orchestration
          </h3>
          <p className="text-xs text-slate-600 font-sans">
            Dispatch all 8 specialized agents to inspect compiled CCC artifacts. Our engine compares their independent findings to detect overlaps and evaluate architectural risks.
          </p>
        </div>
        <button
          id="trigger-swarm-btn"
          disabled={runningSwarm}
          onClick={triggerSwarm}
          className="px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-850 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs font-mono transition-all duration-150 cursor-pointer text-white flex items-center gap-2 self-start md:self-center"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {runningSwarm ? "Running Audits..." : "Deploy Agent Swarm"}
        </button>
      </div>

      {runningSwarm && (
        <div className="bg-[#faf9f6] border border-slate-200 rounded-lg p-4 font-mono text-[11px] text-slate-700 h-56 overflow-y-auto space-y-1 shadow-inner">
          <div className="text-slate-500 border-b border-slate-200 pb-1.5 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 animate-pulse" />
            <span>Swarm live audit logs</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap">{log}</div>
          ))}
        </div>
      )}

      {swarmCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent tab selector */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 mb-1 font-mono">
              Select Agent Perspective
            </div>
            <button
              onClick={() => setActiveTab("consensus")}
              className={`w-full p-3.5 rounded border text-left transition-all duration-150 cursor-pointer flex items-center justify-between ${
                activeTab === "consensus"
                  ? "bg-slate-900 border-slate-950 text-white font-bold"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <span className="text-xs font-bold flex items-center gap-2 font-sans">
                <Sparkles className="w-4 h-4" />
                Swarm Consensus Matrix
              </span>
              <span className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.2 rounded ${
                activeTab === "consensus" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                Aggregated
              </span>
            </button>

            {agents.map((agent) => {
              const isActive = activeTab === agent.name;
              return (
                <button
                  key={agent.name}
                  onClick={() => setActiveTab(agent.name)}
                  className={`w-full p-3.5 rounded border text-left transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-slate-900 border-slate-950 text-white font-bold"
                      : "bg-white border-slate-200 hover:bg-[#faf9f6] text-slate-600"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-slate-800"}`}>{agent.icon}</span>
                  <div className="text-left font-sans text-xs">
                    <div className="font-bold truncate">{agent.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Perspective details panel */}
          <div className="lg:col-span-8">
            {activeTab === "consensus" ? (
              <div className="border border-slate-200 bg-white p-5 rounded-lg space-y-5 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-1">
                  <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">
                    Swarm Consensus Summary
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Combined insights parsed from 8 parallel reasoning tracks, aligned against .llm-context files.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs font-sans uppercase">
                      <AlertTriangle className="w-4 h-4" />
                      Critical Overlapping Consensus Threat (Score 9.5)
                    </div>
                    <p className="text-slate-700 text-xs font-sans leading-relaxed">
                      All agents (Security, Architect, Quality) flagged high coupling issues coupled with unparameterized database inputs. This allows raw command injection, bypasses code boundary structures, and lacks observability counters.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Consensus Directives Matrix:</span>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-800 font-sans">
                        <span>Refactoring Recipe Action Item</span>
                        <span>Confidence</span>
                      </div>
                      <div className="p-3 bg-white flex justify-between text-slate-700 font-sans">
                        <span>1. Extract plain-text connection passwords to env</span>
                        <span className="font-mono font-bold text-emerald-700">99.2%</span>
                      </div>
                      <div className="p-3 bg-white flex justify-between text-slate-700 font-sans">
                        <span>2. Restructure DB connections behind service interfaces</span>
                        <span className="font-mono font-bold text-emerald-700 font-sans">94.5%</span>
                      </div>
                      <div className="p-3 bg-white flex justify-between text-slate-700 font-sans">
                        <span>3. Resolve suppressed empty catch statement in pipeline</span>
                        <span className="font-mono font-bold text-emerald-700">92.0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              (() => {
                const agent = agents.find(a => a.name === activeTab)!;
                return (
                  <div className="border border-slate-200 bg-white p-5 rounded-lg space-y-5 shadow-sm">
                    <div className="border-b border-slate-100 pb-3 mb-1 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          {agent.icon}
                          {agent.name} Findings
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-sans">{agent.role}</p>
                      </div>
                    </div>

                    {/* Agent details */}
                    <div className="space-y-4 text-xs font-sans">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Key findings:</span>
                        <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-1">
                          {agent.findings.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      {agent.risks.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Vulnerability risk levels:</span>
                          {agent.risks.map((r, idx) => (
                            <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded flex justify-between items-center">
                              <div className="space-y-0.5">
                                <span className="font-bold text-rose-800">{r.area}</span>
                                <p className="text-[11px] text-slate-600 leading-normal">{r.reason}</p>
                              </div>
                              <span className="font-mono font-bold bg-rose-100 border border-rose-200 text-rose-700 px-2 py-0.5 rounded">
                                Severity: {r.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Prescribed recommendations:</span>
                        <div className="space-y-2">
                          {agent.recommendations.map((rec, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-700 leading-relaxed">
                              • {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
