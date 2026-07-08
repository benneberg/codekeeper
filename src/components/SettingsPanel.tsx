import React, { useState, useEffect } from "react";
import { 
  Settings, Key, Github, RefreshCw, Check, Shield, AlertCircle, Info, Database, 
  Trash2, Plus, CheckSquare, Square, Eye, EyeOff, Server, ToggleLeft, ToggleRight
} from "lucide-react";

interface MockGithubRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  filesCount: number;
}

export default function SettingsPanel() {
  // Credentials State
  const [groqKey, setGroqKey] = useState("");
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [githubToken, setGithubToken] = useState("");

  // Visibility toggles
  const [showGroq, setShowGroq] = useState(false);
  const [showOpenRouter, setShowOpenRouter] = useState(false);
  const [showGithub, setShowGithub] = useState(false);

  // Connection and synchronization States
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [syncStatusText, setSyncStatusText] = useState("");
  const [syncHistory, setSyncHistory] = useState<string[]>([]);

  // Repositories permission management
  const [availableRepos, setAvailableRepos] = useState<MockGithubRepo[]>([
    { id: "iot-gateway", name: "IoT-Gateway", description: "Enterprise gateway for device lifecycle registration and telemetry digestion.", language: "C#", filesCount: 5 },
    { id: "secure-auth-service", name: "secure-auth-service", description: "OAuth2 authentication server, JWT signer, and security gatekeeper.", language: "TypeScript", filesCount: 6 },
    { id: "enterprise-billing-system", name: "enterprise-billing-system", description: "Invoicing pipeline, subscription triggers, and Stripe integrations.", language: "Python", filesCount: 4 },
  ]);

  // List of active/enabled repo IDs (empty means all are enabled by default)
  const [enabledRepoIds, setEnabledRepoIds] = useState<string[]>([]);
  
  // Custom repos to register and sync
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [newRepoLang, setNewRepoLang] = useState("TypeScript");

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedGroq = localStorage.getItem("arip_groq_api_key") || "";
      const savedOpenRouter = localStorage.getItem("arip_openrouter_api_key") || "";
      const savedGithub = localStorage.getItem("arip_github_token") || "";
      const savedConnected = localStorage.getItem("arip_github_authenticated") === "true";
      
      setGroqKey(savedGroq);
      setOpenRouterKey(savedOpenRouter);
      setGithubToken(savedGithub);
      setIsGithubConnected(savedConnected);

      const savedEnabledRepos = localStorage.getItem("arip_enabled_repos");
      if (savedEnabledRepos) {
        setEnabledRepoIds(JSON.parse(savedEnabledRepos));
      } else {
        // By default, enable all three standard ones
        const defaultIds = ["iot-gateway", "secure-auth-service", "enterprise-billing-system", "active-workspace"];
        setEnabledRepoIds(defaultIds);
        localStorage.setItem("arip_enabled_repos", JSON.stringify(defaultIds));
      }

      const savedCustomRepos = localStorage.getItem("arip_custom_repos");
      if (savedCustomRepos) {
        const customList = JSON.parse(savedCustomRepos) as MockGithubRepo[];
        setAvailableRepos(prev => [
          ...prev,
          ...customList
        ]);
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage:", e);
    }
  }, []);

  // Save specific API Key
  const saveKey = (provider: string, value: string) => {
    try {
      if (provider === "groq") {
        localStorage.setItem("arip_groq_api_key", value);
        alert("Groq API key saved successfully (persisted in local state).");
      } else if (provider === "openrouter") {
        localStorage.setItem("arip_openrouter_api_key", value);
        alert("OpenRouter API key saved successfully (persisted in local state).");
      } else if (provider === "github") {
        localStorage.setItem("arip_github_token", value);
        alert("GitHub auth token saved successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all configuration keys
  const clearKeys = () => {
    if (confirm("Are you sure you want to clear all API keys and GitHub credentials from local system storage?")) {
      localStorage.removeItem("arip_groq_api_key");
      localStorage.removeItem("arip_openrouter_api_key");
      localStorage.removeItem("arip_github_token");
      localStorage.removeItem("arip_github_authenticated");
      localStorage.removeItem("arip_enabled_repos");
      localStorage.removeItem("arip_custom_repos");
      
      setGroqKey("");
      setOpenRouterKey("");
      setGithubToken("");
      setIsGithubConnected(false);
      setEnabledRepoIds(["iot-gateway", "secure-auth-service", "enterprise-billing-system", "active-workspace"]);
      setAvailableRepos([
        { id: "iot-gateway", name: "IoT-Gateway", description: "Enterprise gateway for device lifecycle registration and telemetry digestion.", language: "C#", filesCount: 5 },
        { id: "secure-auth-service", name: "secure-auth-service", description: "OAuth2 authentication server, JWT signer, and security gatekeeper.", language: "TypeScript", filesCount: 6 },
        { id: "enterprise-billing-system", name: "enterprise-billing-system", description: "Invoicing pipeline, subscription triggers, and Stripe integrations.", language: "Python", filesCount: 4 },
      ]);
      
      // Dispatch storage event to trigger reactive reload on active windows
      window.dispatchEvent(new Event("storage"));
      alert("All credentials wiped successfully.");
    }
  };

  // Simulated GitHub Auth / Sync Flow
  const handleGithubConnect = () => {
    if (!githubToken.trim()) {
      alert("Please enter a valid GitHub auth token or Personal Access Token (PAT) first.");
      return;
    }

    setSyncProgress(10);
    setSyncStatusText("Connecting to api.github.com secure gateway...");
    setSyncHistory([`[GITHUB] Initiating OAuth connection with PAT: *********`]);

    setTimeout(() => {
      setSyncProgress(35);
      setSyncStatusText("Verifying token scopes and repository access permissions...");
      setSyncHistory(prev => [...prev, `[GITHUB] Handshake completed successfully. Scopes detected: 'repo', 'workflow'`]);
    }, 800);

    setTimeout(() => {
      setSyncProgress(65);
      setSyncStatusText("Synchronizing selected repository files & AST schemas...");
      setSyncHistory(prev => [...prev, `[GITHUB] Fetching metadata for ${enabledRepoIds.length} active workspace bindings...`]);
    }, 1600);

    setTimeout(() => {
      setSyncProgress(90);
      setSyncStatusText("Validating abstract syntax tree symbols and compiling indices...");
      setSyncHistory(prev => [...prev, `[GITHUB] Synced ${enabledRepoIds.length} repositories successfully without telemetry gaps.`]);
    }, 2400);

    setTimeout(() => {
      setSyncProgress(null);
      setIsGithubConnected(true);
      localStorage.setItem("arip_github_authenticated", "true");
      // Persist token if not already
      localStorage.setItem("arip_github_token", githubToken);
      // Dispatch storage event so App.tsx can reload repositories dynamically
      window.dispatchEvent(new Event("storage"));
      alert("GitHub authentication and repository synchronization completed!");
    }, 3200);
  };

  // Toggle individual repository permissions
  const toggleRepoPermission = (repoId: string) => {
    let updated: string[];
    if (enabledRepoIds.includes(repoId)) {
      // Disabling repo: remove from active list
      updated = enabledRepoIds.filter(id => id !== repoId);
    } else {
      // Enabling repo: add to list
      updated = [...enabledRepoIds, repoId];
    }
    setEnabledRepoIds(updated);
    localStorage.setItem("arip_enabled_repos", JSON.stringify(updated));
    // Dispatch storage event so App.tsx can immediately filter repository listing
    window.dispatchEvent(new Event("storage"));
  };

  // Add custom repository mapping to simulate real synchronization
  const handleAddCustomRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) {
      alert("Please provide a repository name.");
      return;
    }

    const cleanId = newRepoName.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    
    // Check if duplicate
    if (availableRepos.some(r => r.id === cleanId)) {
      alert("A repository with this identifier already exists in your workspace mapping.");
      return;
    }

    const newRepo: MockGithubRepo = {
      id: cleanId,
      name: newRepoName.trim(),
      description: newRepoDesc.trim() || "User imported GitHub workspace. Synced with local compiler AST engines.",
      language: newRepoLang,
      filesCount: Math.floor(Math.random() * 5) + 3
    };

    const updatedList = [...availableRepos, newRepo];
    setAvailableRepos(updatedList);

    // Save only custom repos to arip_custom_repos
    const savedCustom = localStorage.getItem("arip_custom_repos");
    const currentCustomList = savedCustom ? JSON.parse(savedCustom) : [];
    const newCustomList = [...currentCustomList, newRepo];
    localStorage.setItem("arip_custom_repos", JSON.stringify(newCustomList));

    // Also auto-enable this new repo
    const updatedEnabled = [...enabledRepoIds, cleanId];
    setEnabledRepoIds(updatedEnabled);
    localStorage.setItem("arip_enabled_repos", JSON.stringify(updatedEnabled));

    setNewRepoName("");
    setNewRepoDesc("");
    
    // Dispatch storage event
    window.dispatchEvent(new Event("storage"));

    // Quick animation-like feedback in history
    setSyncHistory(prev => [...prev, `[GITHUB] Dynamically registered & synchronized new repository: ${newRepo.name} (${newRepo.language})`]);
    alert(`Successfully synchronized ${newRepoName} with the ARIP workspace!`);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
          <Settings className="w-5 h-5 text-slate-700" />
          Workspace Settings & API Keys
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Securely configure your third-party API credentials, authentication tokens, and GitHub workspaces. All keys are saved strictly client-side inside local browser storage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Credentials & Security Keys */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-slate-900" />
              API Key Credentials Configuration
            </h4>

            {/* Groq Key Input */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-mono font-semibold text-slate-700">Groq Fast Inference API Key</label>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  {groqKey ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showGroq ? "text" : "password"}
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-400 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroq(!showGroq)}
                    className="absolute right-2 top-2 text-slate-500 hover:text-slate-800"
                  >
                    {showGroq ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  onClick={() => saveKey("groq", groqKey)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[11px] font-bold rounded cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Powers the high-frequency low-complexity routines (sub-100ms AST scans).
              </p>
            </div>

            {/* OpenRouter Key Input */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-mono font-semibold text-slate-700">OpenRouter API Key</label>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  {openRouterKey ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showOpenRouter ? "text" : "password"}
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-400 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenRouter(!showOpenRouter)}
                    className="absolute right-2 top-2 text-slate-500 hover:text-slate-800"
                  >
                    {showOpenRouter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  onClick={() => saveKey("openrouter", openRouterKey)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[11px] font-bold rounded cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Enables routing to premium models (Gemini Flash, Claude, or LLaMA 70B) for deep architectural causality.
              </p>
            </div>

            {/* GitHub Token Input */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-mono font-semibold text-slate-700">GitHub Personal Access Token (PAT)</label>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  {githubToken ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showGithub ? "text" : "password"}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="github_pat_..."
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-400 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGithub(!showGithub)}
                    className="absolute right-2 top-2 text-slate-500 hover:text-slate-800"
                  >
                    {showGithub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <button
                  onClick={() => saveKey("github", githubToken)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[11px] font-bold rounded cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Used to authorize repository synchronization, load AST hierarchies, and manage workspace permissions.
              </p>
            </div>

            {/* Wipe settings */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-500 font-mono">Storage location: Local Browser Context</span>
              <button
                onClick={clearKeys}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset System State
              </button>
            </div>
          </div>

          {/* GitHub Connection Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-slate-900" />
              GitHub Security Connection Manager
            </h4>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full border ${isGithubConnected ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">GitHub Connection Status</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {isGithubConnected ? "AUTHENTICATED & SYNCED" : "UNAUTHORIZED BOUNDARY"}
                  </div>
                </div>
              </div>

              {/* GitHub Auth Button */}
              <button
                onClick={handleGithubConnect}
                disabled={syncProgress !== null}
                className={`px-4 py-2 text-[11px] font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer transition-all ${
                  isGithubConnected 
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-rose-900 hover:bg-rose-800 text-white border-rose-950"
                }`}
              >
                {syncProgress !== null ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : isGithubConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Re-Sync Repos</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>Connect GitHub</span>
                  </>
                )}
              </button>
            </div>

            {/* Sync Progress Readout */}
            {syncProgress !== null && (
              <div className="space-y-2 bg-slate-900 border border-slate-950 rounded-lg p-4 font-mono text-[10px] text-white">
                <div className="flex justify-between items-center font-bold text-[9px] text-slate-400 uppercase">
                  <span>GitHub Synchronization Progress</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${syncProgress}%` }} />
                </div>
                <p className="text-slate-300 leading-normal animate-pulse text-[9px]">
                  &gt; {syncStatusText}
                </p>
              </div>
            )}

            {/* Simulated OAuth Terminal History logs */}
            {syncHistory.length > 0 && (
              <div className="bg-slate-950 rounded-lg border border-slate-900 p-3 font-mono text-[9px] text-slate-300 space-y-1 max-h-[140px] overflow-y-auto">
                <div className="text-slate-500 select-none border-b border-slate-900 pb-1.5 mb-1.5 uppercase">
                  Workspace Log Streams
                </div>
                {syncHistory.map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-rose-400">#</span> {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Repository Permission Manager & Synchronizer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-900" />
              Repository Permissions & Synchronization
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Control which synchronized repositories are mapped into your workspace context. Only enabled repositories with checked permissions will appear in the platform selector.
            </p>

            {/* Repositories selection checklist */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {/* Default Active Workspace */}
              <div className="p-3 border border-slate-200 bg-slate-50 rounded-lg text-xs flex items-start gap-3">
                <div className="pt-0.5 select-none">
                  <CheckSquare className="w-4 h-4 text-slate-800" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 font-sans">Active Workspace (Local)</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-900 text-white border px-1.5 py-0.2 rounded uppercase">
                      SYSTEM ROOT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Reflects the live physical files on the current server workspace scanned dynamically.
                  </p>
                </div>
              </div>

              {/* Individual mapped repos */}
              {availableRepos.map((repo) => {
                const isEnabled = enabledRepoIds.includes(repo.id);
                return (
                  <div 
                    key={repo.id} 
                    onClick={() => toggleRepoPermission(repo.id)}
                    className={`p-3 border rounded-lg text-xs flex items-start gap-3 cursor-pointer transition-all duration-150 ${
                      isEnabled 
                        ? "bg-white border-slate-900 hover:bg-slate-50" 
                        : "bg-slate-50 border-slate-200 hover:bg-white opacity-60"
                    }`}
                  >
                    <div className="pt-0.5 select-none">
                      {isEnabled ? (
                        <CheckSquare className="w-4 h-4 text-slate-900" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 font-sans">{repo.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border bg-slate-50 text-slate-600 font-bold uppercase">
                            {repo.language}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border bg-slate-50 text-slate-600 font-bold uppercase">
                            {repo.filesCount} files
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {repo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form to dynamically Register and Sync a new GitHub repository */}
            <form onSubmit={handleAddCustomRepo} className="pt-4 border-t border-slate-100 space-y-3.5">
              <div className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Synchronize New GitHub Repository
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-700 font-semibold block">Repository Name</label>
                  <input
                    type="text"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="e.g. enterprise-payments"
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-700 font-semibold block">Primary Language</label>
                  <select
                    value={newRepoLang}
                    onChange={(e) => setNewRepoLang(e.target.value)}
                    className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="C#">C#</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[11px] font-mono text-slate-700 font-semibold block">Repository Description</label>
                <input
                  type="text"
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  placeholder="Inbound transaction logs, webhooks and clearing ledger mapping..."
                  className="w-full bg-[#faf9f6] border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-900 hover:bg-rose-800 text-white font-mono text-[11px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Register & Synchronize Repository
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
