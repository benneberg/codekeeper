import React, { useState } from "react";
import { Cpu, Shuffle, Sparkles, Sliders, Zap, Check, ShieldAlert } from "lucide-react";

interface ModelRoute {
  tier: string;
  provider: string;
  modelName: string;
  latencyTarget: string;
  costWeight: string;
  primaryTasks: string;
  icon: any;
}

export default function ModelRouter() {
  const [selectedComplexity, setSelectedComplexity] = useState<"low" | "medium" | "high">("low");
  const [testPrompt, setTestPrompt] = useState("Analyze a simple string formatting error in server.ts");
  const [routedModel, setRoutedModel] = useState<any>({
    tier: "Fast Tier",
    provider: "Groq Engine",
    model: "llama-3-8b-instant",
    cost: "$0.00005",
    latency: "82ms",
    confidence: "99.4%"
  });

  const routes: ModelRoute[] = [
    {
      tier: "Fast Tier",
      provider: "Groq API Node",
      modelName: "llama-3-8b-instant",
      latencyTarget: "< 150ms",
      costWeight: "Extremely Low",
      primaryTasks: "Syntax checks, token formatting, direct keyword symbols search",
      icon: Zap
    },
    {
      tier: "Medium Tier",
      provider: "OpenRouter Gateway",
      modelName: "gemini-2.5-flash / haiku",
      latencyTarget: "300ms - 500ms",
      costWeight: "Moderate",
      primaryTasks: "Reverse dependency analysis, impact propagation tracing, logs summaries",
      icon: Shuffle
    },
    {
      tier: "Premium Tier",
      provider: "Server Core Dedicated API",
      modelName: "claude-3.5-sonnet / gemini-1.5-pro",
      latencyTarget: "1.2s - 2.5s",
      costWeight: "High Value",
      primaryTasks: "Complete architectural audits, refactoring prescriptions, multithreading reasoning",
      icon: Sparkles
    }
  ];

  const handleComplexityChange = (complexity: "low" | "medium" | "high") => {
    setSelectedComplexity(complexity);
    if (complexity === "low") {
      setTestPrompt("Analyze a simple string formatting error in server.ts");
      setRoutedModel({
        tier: "Fast Tier",
        provider: "Groq Engine",
        model: "llama-3-8b-instant",
        cost: "$0.00005",
        latency: "82ms",
        confidence: "99.4%"
      });
    } else if (complexity === "medium") {
      setTestPrompt("Trace backward dependencies for src/Controllers/DeviceController.cs");
      setRoutedModel({
        tier: "Medium Tier",
        provider: "OpenRouter Gateway",
        model: "google/gemini-2.5-flash",
        cost: "$0.00035",
        latency: "410ms",
        confidence: "94.8%"
      });
    } else {
      setTestPrompt("Perform deep architectural review of the repository dependency boundary layout");
      setRoutedModel({
        tier: "Premium Tier",
        provider: "Server Core Dedicated",
        model: "anthropic/claude-3.5-sonnet",
        cost: "$0.01500",
        latency: "1.84s",
        confidence: "98.9%"
      });
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
          <Shuffle className="w-5 h-5 text-slate-700" />
          AI Model Routing Strategy Cockpit
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Dynamically route incoming agent reasoning queries to different latency and cost-weighted model tiers. Leverage Groq nodes for lightning sub-100ms syntax parses, and OpenRouter / Core paths for semantic planning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Grid Column: Model Tiers specification */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Active Routing Tiers Configuration
          </h4>

          <div className="space-y-3.5">
            {routes.map((route, idx) => {
              const IconComp = route.icon;
              return (
                <div key={idx} className="border border-slate-200 bg-white rounded-lg p-4 flex gap-4 items-start shadow-sm hover:shadow transition-shadow">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-900 shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 font-sans">{route.tier}</span>
                      <span className="font-mono text-slate-500 font-bold text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        {route.provider}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-slate-700 font-semibold">
                      Model Target: <span className="text-slate-900 font-bold">{route.modelName}</span>
                    </div>

                    <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                      {route.primaryTasks}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-slate-100 font-mono text-[10px] text-slate-500">
                      <div>Latency Budget: <span className="text-slate-800 font-semibold">{route.latencyTarget}</span></div>
                      <div>Relative Cost: <span className="text-slate-800 font-semibold">{route.costWeight}</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Grid Column: Dynamic Router Testing Tool */}
        <div className="lg:col-span-5">
          <div className="border border-slate-200 bg-white rounded-lg p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-slate-900" />
                Live Router Test Emulator
              </h4>

              <div className="space-y-3 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-700 font-semibold block">Select Task Complexity Profile</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "medium", "high"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleComplexityChange(lvl)}
                        className={`py-2 px-2.5 rounded border text-center font-mono text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                          selectedComplexity === lvl
                            ? "bg-slate-900 border-slate-950 text-white"
                            : "bg-[#faf9f6] border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {lvl === "low" ? "Low (Fast)" : lvl === "medium" ? "Medium" : "High (Premium)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-700 font-semibold block">Simulated Agent Query Prompt</label>
                  <textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Routing decision readout */}
              <div className="bg-[#faf9f6] border border-slate-200 rounded-lg p-4 space-y-3.5">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-1.5">
                  Router Decisive Matching Report
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-mono text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Matched Route:</span>
                    <span className="font-bold text-slate-900">{routedModel.tier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Selected Provider:</span>
                    <span className="font-bold text-slate-900">{routedModel.provider}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Assigned Model:</span>
                    <span className="font-bold text-slate-900 text-[11px]">{routedModel.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Confidence Score:</span>
                    <span className="font-bold text-emerald-700">{routedModel.confidence}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Estimated Cost:</span>
                    <span className="font-bold text-slate-900">{routedModel.cost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Latency Budget:</span>
                    <span className="font-bold text-slate-900">{routedModel.latency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Decisions automatically grounded on task length and target schema complexity rules.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
