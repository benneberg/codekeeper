import React, { useState, useRef, useEffect } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { ChatMessage } from "../types";
import { Send, Sparkles, RefreshCw, Cpu, Database, AlertCircle } from "lucide-react";
import Markdown from "react-markdown";

interface Props {
  repo: MockRepository;
}

export default function ProfessorChat({ repo }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick questions
  const suggestedQuestions = [
    { label: "Architectural coupling risk", text: "What is the highest architectural coupling risk in this codebase?" },
    { label: "Security & Vulnerabilities", text: "Are there any hardcoded secrets or security risks in this repository?" },
    { label: "Improve Observability", text: "How can we improve observability, logging, and tracing coverage here?" },
    { label: "Prioritized Refactoring", text: "Analyze the technical debt and outline a prioritized refactoring prescription." }
  ];

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const loadingPhrases = [
      "Accessing compiled Code Context Compiler (CCC) artifacts...",
      "Resolving AST Symbol declarations in index.json...",
      "Traversing resolved file-to-file dependency-graph...",
      "Evaluating static analysis risk map (Semgrep/Sonar)...",
      "Grounded reasoning running on Gemini models..."
    ];

    let phraseIdx = 0;
    setLoadingMsg(loadingPhrases[phraseIdx]);
    const phraseInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % loadingPhrases.length;
      setLoadingMsg(loadingPhrases[phraseIdx]);
    }, 1200);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const token = sessionStorage.getItem("arip_api_token") || "arip-secure-session-token-2026";
      
      const groqKey = localStorage.getItem("arip_groq_api_key") || "";
      const openRouterKey = localStorage.getItem("arip_openrouter_api_key") || "";
      
      const fastProvider = localStorage.getItem("arip_fast_provider") || "Groq fast inference api";
      const fastModel = localStorage.getItem("arip_fast_model") || "llama-3-8b-instant";
      
      const mediumProvider = localStorage.getItem("arip_medium_provider") || "OpenRouter";
      const mediumModel = localStorage.getItem("arip_medium_model") || "google/gemini-2.5-flash";
      
      const premiumProvider = localStorage.getItem("arip_premium_provider") || "OpenRouter";
      const premiumModel = localStorage.getItem("arip_premium_model") || "anthropic/claude-3.5-sonnet";

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-token": token,
          "x-groq-key": groqKey,
          "x-openrouter-key": openRouterKey,
          "x-fast-provider": fastProvider,
          "x-fast-model": fastModel,
          "x-medium-provider": mediumProvider,
          "x-medium-model": mediumModel,
          "x-premium-provider": premiumProvider,
          "x-premium-model": premiumModel
        },
        body: JSON.stringify({
          question: textToSend,
          repoId: repo.id,
          chatHistory
        })
      });

      if (!res.ok) {
        throw new Error("Failed to contact Repository Professor backend API");
      }

      const data = await res.json();
      clearInterval(phraseInterval);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      clearInterval(phraseInterval);
      console.error(err);

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: `⚠️ **API Connection Error:** Unable to reach the Repository Professor service. Please check your network or server logs.\n\n*Detail: ${err.message}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[540px] bg-[#faf9f6] border border-slate-200 rounded-lg overflow-hidden text-slate-900 shadow-xs">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-sans">
            <Cpu className="w-3.5 h-3.5 text-slate-800" />
            Repository Professor v4
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Grounding: ACTIVE (.llm-context/) | Target: {repo.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            gemini-3.5-flash
          </span>
          <button
            onClick={clearChat}
            className="text-[10px] text-slate-600 hover:text-slate-900 font-mono border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer transition-all duration-150"
          >
            Clear Thread
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto space-y-5">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-sans">Consult the Repository Professor</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
                All AST symbols and dependency hierarchies in this workspace are indexed. Ask about structural couplings, security vulnerability remediation, or observability gaps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full text-left pt-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.text)}
                  className="p-3.5 rounded-lg bg-white hover:bg-[#faf9f6] border border-slate-200 text-xs text-slate-700 font-sans cursor-pointer transition-all duration-150 text-left line-clamp-2"
                >
                  <span className="text-slate-900 font-bold block text-[9px] uppercase tracking-wider mb-1 font-mono">
                    {q.label}
                  </span>
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-4 text-xs select-text ${
                    m.role === "user"
                      ? "bg-slate-900 text-white font-mono"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  {m.role === "user" ? (
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 pl-1 font-mono">{m.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-3 bg-white p-4 border border-slate-200 rounded-lg max-w-sm">
            <RefreshCw className="w-4 h-4 text-slate-700 animate-spin" />
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase text-slate-800 font-mono tracking-wider">Professor Reasoning</div>
              <p className="text-[10px] text-slate-500 font-mono">{loadingMsg}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-slate-200 p-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${repo.name} modules, coupling, or debt...`}
            className="flex-1 bg-[#faf9f6] border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-150 flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
