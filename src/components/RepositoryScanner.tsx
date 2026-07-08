import React, { useState } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { GitBranch, RefreshCw, Radio, Check, Calendar, Plus, Link2, AlertTriangle, Play } from "lucide-react";

interface Props {
  repo: MockRepository;
  onTriggerRefresh: () => void;
}

export default function RepositoryScanner({ repo, onTriggerRefresh }: Props) {
  const [webhookUrl, setWebhookUrl] = useState("https://arip-webhooks.dev/api/github");
  const [scheduledInterval, setScheduledInterval] = useState("Every 6 Hours");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Scanner Initialized for Repository " + repo.name,
    "Awaiting changes via Webhooks on path /github-webhook"
  ]);
  const [isCopied, setIsCopied] = useState(false);

  // Trigger simulated GitHub Webhook event payload
  const handleSimulateWebhook = () => {
    setIsRefreshing(true);
    const newLogs = [
      `[WEBHOOK TRIGGERED] Push event received from branch 'main' by user 'benneberg'`,
      `-> Comparing commit SHA 8b0f23a...4f1e92d`,
      `-> Detected changes in ${repo.id === "secure-auth-service" ? "src/auth.controller.ts" : repo.id === "enterprise-billing-system" ? "billing/services.py" : "src/DeviceManager.cs"}`,
      `-> Auto-cloning updated git changes from master branch...`,
      `-> Launching background AST symbols generation / index rebuild...`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < newLogs.length) {
        setLogs(prev => [...prev, newLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        onTriggerRefresh();
        setLogs(prev => [...prev, "✓ Codebase context synchronized with latest snapshot! CCC Engine fully grounded.", ""]);
        setIsRefreshing(false);
      }
    }, 800);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
          <GitBranch className="w-5 h-5 text-slate-700" />
          Repository Scanner & Synchronization
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Hook up your repository snapshots with GitHub triggers. Automate AST symbol discovery through secure HTTP payloads or routine cron intervals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration settings panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Scanner IO Setup Specifications
            </h4>

            {/* Inputs & Outputs definition */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1 bg-[#faf9f6] p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800 font-mono text-[10px] uppercase">Inputs:</div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  • GitHub Webhook URL payloads (JSON)<br />
                  • git clone credentials & branch (main/master)<br />
                  • Scheduled timer tickers (6h / 12h / 24h cron)
                </p>
              </div>

              <div className="space-y-1 bg-[#faf9f6] p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800 font-mono text-[10px] uppercase">Outputs:</div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  • Updated workspace tree structures<br />
                  • AST symbol maps & JSON file signatures<br />
                  • Background trigger parameters to CCC compiler
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Active Trigger Strategies
            </h4>

            <div className="space-y-4 text-xs">
              {/* Webhook configurator */}
              <div className="space-y-1.5">
                <label className="font-mono text-slate-700 text-[11px] block">Webhook Target Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-[#faf9f6] border border-slate-200 px-3 py-1.5 rounded font-mono text-[11px] text-slate-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyWebhook}
                    className="px-3 py-1.5 text-[11px] font-mono border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Scheduled Scans */}
              <div className="space-y-1.5">
                <label className="font-mono text-slate-700 text-[11px] block">Routine Chronometer Cycle</label>
                <div className="flex gap-2">
                  <select
                    value={scheduledInterval}
                    onChange={(e) => setScheduledInterval(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded font-mono text-[11px] text-slate-700 focus:outline-none focus:border-slate-400"
                  >
                    <option>Every 1 Hour (Aggressive)</option>
                    <option>Every 6 Hours (Balanced)</option>
                    <option>Every 24 Hours (Conservative)</option>
                    <option>Disable Routine Scanning</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  Scanner Active
                </span>

                {/* Simulate Push event trigger button */}
                <button
                  onClick={handleSimulateWebhook}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Refactoring AST...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Simulate GitHub Push Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live scanner console logs stream */}
        <div className="lg:col-span-7">
          <div className="border border-slate-200 bg-white rounded-lg p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="space-y-3 flex-1">
              <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Scanner Daemon Logs Console
              </h4>

              <div className="bg-[#faf9f6] border border-slate-200 rounded-lg p-4 font-mono text-[11px] text-slate-700 space-y-1.5 min-h-72 max-h-96 overflow-y-auto">
                {logs.map((log, index) => {
                  let textStyle = "text-slate-600";
                  if (log.startsWith("✓")) {
                    textStyle = "text-emerald-700 font-bold";
                  } else if (log.startsWith("[WEBHOOK")) {
                    textStyle = "text-slate-900 font-semibold";
                  } else if (log.startsWith("->")) {
                    textStyle = "text-slate-500 pl-3";
                  }
                  return (
                    <div key={index} className={`whitespace-pre-wrap leading-relaxed ${textStyle}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-500 font-mono text-[10px]">
              <AlertTriangle className="w-4 h-4 text-slate-600" />
              <span>Scanning utilizes light shallow git clones to minimize resource load over local sandbox directories.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
