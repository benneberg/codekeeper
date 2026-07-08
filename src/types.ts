import { MockRepository, SymbolItem, DependencyEdge, StaticAnalysisWarning } from "../server/mockRepositories";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface CompileStep {
  label: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  logLines: string[];
}

export interface AgentReasoning {
  agentName: string;
  iconName: string;
  role: string;
  status: "idle" | "thinking" | "completed";
  findings: string[];
  risks: { area: string; severity: number; reason: string }[];
  recommendations: string[];
}

export interface CliCommandHistory {
  input: string;
  output: string[];
}
