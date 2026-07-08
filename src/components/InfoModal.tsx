import React, { useState } from "react";
import { X, HelpCircle, BookOpen, Layers, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"desc" | "guide" | "faq">("desc");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "What is the Code Context Compiler (CCC) engine?",
      a: "The CCC is a deterministic engine that maps language abstract syntax trees (ASTs) directly to static symbol structures. It compiles code files into structured JSON context outputs stored inside the `.llm-context/` directory so AI agents can consult factual syntax rather than guessing."
    },
    {
      q: "How does the AI model router evaluate which tier to trigger?",
      a: "Our router scores incoming prompts based on estimated token size, requested action, and target graph complexity. It dynamically routes simple checks to lightning-fast Groq fast inference API nodes and premium requests to OpenRouter gateways, based on your custom-mapped model preferences."
    },
    {
      q: "Where are my private API keys and settings saved?",
      a: "All keys for Groq, OpenRouter, and GitHub are stored securely client-side in your local browser state (HTML5 LocalStorage). They never leave your device or get committed to backend log files, ensuring strict credential privacy."
    },
    {
      q: "How do I migrate these simulated workspaces to a production environment?",
      a: "To transition from simulated states (like mock repository lists or regex code scanner) into real enterprise systems, check out our production migration roadmap outlined in the root TODO.md. This covers setting up GitHub OAuth servers, tree-sitter AST scanning, and pgvector relational embeddings."
    },
    {
      q: "What is a blast risk factor or change propagation?",
      a: "It calculates the logical dependency depth of a file. If a module has high fan-in (many other files import it), changing its parameters carries a large risk of downstream compiler breaks. Tracing this is known as propagation mapping."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#faf9f6] border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold font-sans text-base text-slate-900">System Information & Resource Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-white border-b border-slate-100 flex font-mono text-xs select-none">
          <button
            onClick={() => setActiveTab("desc")}
            className={`flex-1 py-3 border-b-2 text-center font-bold uppercase transition-all duration-150 cursor-pointer ${
              activeTab === "desc" ? "border-slate-950 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-3 border-b-2 text-center font-bold uppercase transition-all duration-150 cursor-pointer ${
              activeTab === "guide" ? "border-slate-950 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            User Guide
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex-1 py-3 border-b-2 text-center font-bold uppercase transition-all duration-150 cursor-pointer ${
              activeTab === "faq" ? "border-slate-950 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Tab content area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === "desc" && (
            <div className="space-y-4 text-slate-700 text-xs font-sans leading-relaxed">
              <div className="border border-slate-200 p-4 rounded bg-[#faf9f6] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 block">Abstract Vision</span>
                <p className="font-semibold text-slate-900 text-sm">
                  ARIP: AI Repository Intelligence Platform
                </p>
                <p className="text-xs text-slate-600">
                  ARIP bridges the semantic gap between Large Language Models and complex, multi-file codebases. By parsing Abstract Syntax Trees deterministically and mapping dependencies explicitly, we remove AI 'hallucinations' during system refactoring tasks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase">✓ Grounded Context</h4>
                  <p className="text-slate-600 text-[11px]">No guesswork. Agents review compiler-generated AST mappings before replying.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase">✓ Scalable Embeddings</h4>
                  <p className="text-slate-600 text-[11px]">Store ADRs and issue backlogs inside vector layers for immediate context search.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase">✓ Multi-Tier Router</h4>
                  <p className="text-slate-600 text-[11px]">Save costs and optimize performance by matching requests with the ideal hardware provider.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase">✓ Deep Blast-Radius Tracing</h4>
                  <p className="text-slate-600 text-[11px]">Quickly find which files depend on code changes to minimize build regressions.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="space-y-4 text-slate-700 text-xs font-sans leading-relaxed">
              <h4 className="font-bold text-slate-950 text-sm">Operational Instruction Set</h4>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">1. Generate Workspace Context</span>
                  Navigate to the <span className="text-slate-900 underline">CCC Compiler</span> tab and click <span className="italic">Generate Codebase Context</span>. This runs Tree-Sitter parsing routines over the selected repo.
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">2. Query the Professor & Swarms</span>
                  Ask the Professor custom questions, or spawn a specialized <span className="text-slate-900 underline">Agent Orchestrator</span> sweep to analyze security logs or debt.
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">3. Evaluate Blast Radius</span>
                  Use the <span className="text-slate-900 underline">Causality Impact</span> tab to trace upstream dependents. Identify exactly who breaks if you refactor an internal method.
                </div>

                <div className="p-3 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900 block mb-1">4. Synchronize GitHub snapshots</span>
                  Use the <span className="text-slate-900 underline">Repository Scanner</span> within the CLI Console panel to receive hooks and schedule routine shallow clones.
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-2 select-text">
              {faqs.map((f, i) => (
                <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-4 bg-[#faf9f6] hover:bg-slate-50 text-left font-sans text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <span>{f.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                  </button>

                  {openFaq === i && (
                    <div className="p-4 bg-white border-t border-slate-100 text-slate-600 text-xs font-sans leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#faf9f6] border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Scandinavian Minimal UI Design</span>
          <span>ARIP v2.8 Standard</span>
        </div>
      </div>
    </div>
  );
}
