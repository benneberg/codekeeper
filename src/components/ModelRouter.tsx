import React, { useState, useEffect } from "react";
import { Cpu, Shuffle, Sparkles, Sliders, Zap, Check, ShieldAlert, Key, AlertTriangle } from "lucide-react";

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
  // Persistence States for each routing tier
  const [fastProvider, setFastProvider] = useState("Groq fast inference api");
  const [fastModel, setFastModel] = useState("llama-3-8b-instant");
  
  const [mediumProvider, setMediumProvider] = useState("OpenRouter");
  const [mediumModel, setMediumModel] = useState("google/gemini-2.5-flash");
  
  const [premiumProvider, setPremiumProvider] = useState("OpenRouter");
  const [premiumModel, setPremiumModel] = useState("anthropic/claude-3.5-sonnet");

  // API Key Checks
  const [hasGroqKey, setHasGroqKey] = useState(false);
  const [hasOpenRouterKey, setHasOpenRouterKey] = useState(false);

  // Emulator State
  const [selectedComplexity, setSelectedComplexity] = useState<"low" | "medium" | "high">("low");
  const [testPrompt, setTestPrompt] = useState("Analyze a simple string formatting error in server.ts");
  const [routedModel, setRoutedModel] = useState<any>({
    tier: "Fast Tier",
    provider: "Groq fast inference api",
    model: "llama-3-8b-instant",
    cost: "$0.00005",
    latency: "82ms",
    confidence: "99.4%"
  });

  // Load and check keys from localStorage
  const refreshKeysAndSelections = () => {
    try {
      const gKey = localStorage.getItem("arip_groq_api_key") || "";
      const orKey = localStorage.getItem("arip_openrouter_api_key") || "";
      setHasGroqKey(gKey.trim().length > 0);
      setHasOpenRouterKey(orKey.trim().length > 0);

      // Load selections
      const savedFastP = localStorage.getItem("arip_fast_provider") || "Groq fast inference api";
      const savedFastM = localStorage.getItem("arip_fast_model") || "llama-3-8b-instant";
      const savedMediumP = localStorage.getItem("arip_medium_provider") || "OpenRouter";
      const savedMediumM = localStorage.getItem("arip_medium_model") || "google/gemini-2.5-flash";
      const savedPremiumP = localStorage.getItem("arip_premium_provider") || "OpenRouter";
      const savedPremiumM = localStorage.getItem("arip_premium_model") || "anthropic/claude-3.5-sonnet";

      setFastProvider(savedFastP);
      setFastModel(savedFastM);
      setMediumProvider(savedMediumP);
      setMediumModel(savedMediumM);
      setPremiumProvider(savedPremiumP);
      setPremiumModel(savedPremiumM);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshKeysAndSelections();

    // Listen for storage events in case keys are configured in Settings Panel
    window.addEventListener("storage", refreshKeysAndSelections);
    return () => {
      window.removeEventListener("storage", refreshKeysAndSelections);
    };
  }, []);

  // Update routing emulator results dynamically whenever selections or complexity profiles change
  useEffect(() => {
    if (selectedComplexity === "low") {
      setRoutedModel({
        tier: "Fast Tier",
        provider: fastProvider,
        model: fastModel,
        cost: fastProvider === "Groq fast inference api" ? "$0.00005" : "$0.00015",
        latency: fastProvider === "Groq fast inference api" ? "78ms" : "320ms",
        confidence: "99.4%"
      });
    } else if (selectedComplexity === "medium") {
      setRoutedModel({
        tier: "Medium Tier",
        provider: mediumProvider,
        model: mediumModel,
        cost: mediumProvider === "OpenRouter" ? "$0.00035" : "$0.00020",
        latency: mediumProvider === "OpenRouter" ? "410ms" : "280ms",
        confidence: "94.8%"
      });
    } else {
      setRoutedModel({
        tier: "Premium Tier",
        provider: premiumProvider,
        model: premiumModel,
        cost: premiumProvider === "OpenRouter" ? "$0.01500" : "$0.01200",
        latency: premiumProvider === "OpenRouter" ? "1.84s" : "1.45s",
        confidence: "98.9%"
      });
    }
  }, [selectedComplexity, fastProvider, fastModel, mediumProvider, mediumModel, premiumProvider, premiumModel]);

  const savePreference = (key: string, value: string) => {
    localStorage.setItem(key, value);
    // Dispatch event to keep sync
    window.dispatchEvent(new Event("storage"));
  };

  // Provider Options and Models lists
  const providerModels: Record<string, string[]> = {
    "Groq fast inference api": ["llama-3-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
    "OpenRouter": ["google/gemini-2.5-flash", "anthropic/claude-3-haiku", "meta-llama/llama-3-70b-instruct", "anthropic/claude-3.5-sonnet"],
    "Server Core Dedicated": ["claude-3.5-sonnet", "gemini-1.5-pro", "gpt-4o-mini"]
  };

  const handleComplexityChange = (complexity: "low" | "medium" | "high") => {
    setSelectedComplexity(complexity);
    if (complexity === "low") {
      setTestPrompt("Analyze a simple string formatting error in server.ts");
    } else if (complexity === "medium") {
      setTestPrompt("Trace backward dependencies for src/Controllers/DeviceController.cs");
    } else {
      setTestPrompt("Perform deep architectural review of the repository dependency boundary layout");
    }
  };

  const checkKeyConfigured = (provider: string) => {
    if (provider === "Groq fast inference api") return hasGroqKey;
    if (provider === "OpenRouter") return hasOpenRouterKey;
    return true; // Server Core doesn't need key
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
          <Shuffle className="w-5 h-5 text-slate-700" />
          AI Model Routing Strategy Cockpit
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Dynamically configure and map LLM providers and models to cost-weighted latency tiers. Verify that API keys are active, and test the matching routing profile below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Grid Column: Model Tiers specification and dropdowns */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>Active Routing Tiers Configuration</span>
            <span className="text-[10px] text-slate-500 font-normal normal-case">Changes persist instantly</span>
          </h4>

          <div className="space-y-4">
            {/* FAST TIER */}
            <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3.5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-2.5 items-center">
                  <div className="p-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 font-sans text-xs">Fast Tier (Sub-100ms AST)</span>
                    <p className="text-[10px] text-slate-500">Syntax checks, symbol parsing, keyword lookups.</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                  checkKeyConfigured(fastProvider) 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                }`}>
                  {checkKeyConfigured(fastProvider) ? "API Key Present" : "Key Required"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Provider</label>
                  <select
                    value={fastProvider}
                    onChange={(e) => {
                      const prov = e.target.value;
                      setFastProvider(prov);
                      const defaultModel = providerModels[prov][0];
                      setFastModel(defaultModel);
                      savePreference("arip_fast_provider", prov);
                      savePreference("arip_fast_model", defaultModel);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Groq fast inference api">Groq Fast Inference</option>
                    <option value="OpenRouter">OpenRouter</option>
                    <option value="Server Core Dedicated">Server Core Dedicated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Model Select</label>
                  <select
                    value={fastModel}
                    onChange={(e) => {
                      setFastModel(e.target.value);
                      savePreference("arip_fast_model", e.target.value);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                  >
                    {providerModels[fastProvider]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* MEDIUM TIER */}
            <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3.5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-2.5 items-center">
                  <div className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 font-sans text-xs">Medium Tier (Impact Analysis)</span>
                    <p className="text-[10px] text-slate-500">Reverse dependency audits, metrics reports.</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                  checkKeyConfigured(mediumProvider) 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                }`}>
                  {checkKeyConfigured(mediumProvider) ? "API Key Present" : "Key Required"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Provider</label>
                  <select
                    value={mediumProvider}
                    onChange={(e) => {
                      const prov = e.target.value;
                      setMediumProvider(prov);
                      const defaultModel = providerModels[prov][0];
                      setMediumModel(defaultModel);
                      savePreference("arip_medium_provider", prov);
                      savePreference("arip_medium_model", defaultModel);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Groq fast inference api">Groq Fast Inference</option>
                    <option value="OpenRouter">OpenRouter</option>
                    <option value="Server Core Dedicated">Server Core Dedicated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Model Select</label>
                  <select
                    value={mediumModel}
                    onChange={(e) => {
                      setMediumModel(e.target.value);
                      savePreference("arip_medium_model", e.target.value);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                  >
                    {providerModels[mediumProvider]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PREMIUM TIER */}
            <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3.5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-2.5 items-center">
                  <div className="p-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 font-sans text-xs">Premium Tier (Structural Refactorings)</span>
                    <p className="text-[10px] text-slate-500">Multi-agent audits, architectural refactoring scripts.</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${
                  checkKeyConfigured(premiumProvider) 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-red-50 text-red-700 border-red-200 animate-pulse"
                }`}>
                  {checkKeyConfigured(premiumProvider) ? "API Key Present" : "Key Required"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Provider</label>
                  <select
                    value={premiumProvider}
                    onChange={(e) => {
                      const prov = e.target.value;
                      setPremiumProvider(prov);
                      const defaultModel = providerModels[prov][0];
                      setPremiumModel(defaultModel);
                      savePreference("arip_premium_provider", prov);
                      savePreference("arip_premium_model", defaultModel);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Groq fast inference api">Groq Fast Inference</option>
                    <option value="OpenRouter">OpenRouter</option>
                    <option value="Server Core Dedicated">Server Core Dedicated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Model Select</label>
                  <select
                    value={premiumModel}
                    onChange={(e) => {
                      setPremiumModel(e.target.value);
                      savePreference("arip_premium_model", e.target.value);
                    }}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                  >
                    {providerModels[premiumProvider]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
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
                        id={`complexity-btn-${lvl}`}
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
                <div className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-1.5 flex justify-between items-center">
                  <span>Router Decisive Matching Report</span>
                  {!checkKeyConfigured(routedModel.provider) && (
                    <span className="flex items-center gap-0.5 text-red-600 font-bold uppercase text-[8px] tracking-normal animate-pulse">
                      <AlertTriangle className="w-2.5 h-2.5" /> Missing Key
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-mono text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Matched Route:</span>
                    <span className="font-bold text-slate-900">{routedModel.tier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Selected Provider:</span>
                    <span className="font-bold text-slate-900 truncate block max-w-full" title={routedModel.provider}>{routedModel.provider}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Assigned Model:</span>
                    <span className="font-bold text-slate-900 text-[11px] truncate block max-w-full" title={routedModel.model}>{routedModel.model}</span>
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
              <span>Decisions automatically grounded on your custom mapped LLM preferences.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
