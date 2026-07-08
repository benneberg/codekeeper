import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { mockRepositories } from "./server/mockRepositories.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("✓ Gemini client successfully initialized with API key.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("⚠️ No active GEMINI_API_KEY detected in environment. Running with local simulated responses.");
}

// 1. API Endpoint: List repositories
app.get("/api/repositories", (req, res) => {
  const summary = mockRepositories.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    language: r.language,
    fileCount: r.files.length,
    symbolCount: r.symbols.length,
    securityScore: r.securityRisk.score,
    technicalDebt: r.technicalDebt.score,
    techDebtRating: r.technicalDebt.rating,
  }));
  res.json(summary);
});

// 2. API Endpoint: Get single repository details (before or after compile)
app.get("/api/repositories/:id", (req, res) => {
  const repo = mockRepositories.find(r => r.id === req.params.id);
  if (!repo) {
    return res.status(404).json({ error: "Repository not found" });
  }
  res.json(repo);
});

// 3. API Endpoint: Ask Repository Professor
app.post("/api/ask", async (req, res) => {
  const { question, repoId, chatHistory } = req.body;
  const repo = mockRepositories.find(r => r.id === repoId);

  if (!repo) {
    return res.status(404).json({ error: "Repository not found" });
  }

  // Compile full facts context from the simulated repository
  const symbolsContext = repo.symbols.map(s => `- Symbol: ${s.name} (${s.type}) in ${s.file}:${s.line} - ${s.description}`).join("\n");
  const depsContext = Object.entries(repo.dependencies).map(([file, edges]) => {
    return `- ${file} depends on: ${edges.map(e => `${e.target} (conf: ${e.confidence})`).join(", ")}`;
  }).join("\n");
  const rulesContext = repo.architectureRules.map(r => `- ${r}`).join("\n");
  const issuesContext = repo.staticAnalysis.map(w => `- [${w.severity.toUpperCase()}] ${w.tool} Warn: ${w.message} in ${w.file}:${w.line}`).join("\n");
  const securityContext = `Risk Score: ${repo.securityRisk.score}/10. Key Threats:\n${repo.securityRisk.threats.map(t => `  - ${t}`).join("\n")}`;
  const obsContext = `Logging: ${repo.observabilityCoverage.logging}%, Metrics: ${repo.observabilityCoverage.metrics}%, Tracing: ${repo.observabilityCoverage.tracing}%.\nGaps:\n${repo.observabilityCoverage.gaps.map(g => `  - ${g}`).join("\n")}`;
  const debtContext = `Rating: ${repo.technicalDebt.rating} (Debt Score: ${repo.technicalDebt.score}/100).\nSmells:\n${repo.technicalDebt.smells.map(s => `  - ${s}`).join("\n")}`;

  // Assemble full ground-truth context
  const systemContext = `
You are the **Repository Professor (v4)**, the primary user-facing architect-in-residence of the AI Repository Intelligence Platform (ARIP).
Your reasoning is STRICTLY grounded in facts provided by the Code Context Compiler (CCC).
You never guess, hallucinate, or assume details not present in the CCC artifacts.

Here are the compiled CCC v2 Facts for the repository **"${repo.name}"** (${repo.language}):

[FILES IN REPOSITORY]
${repo.files.map(f => `- ${f}`).join("\n")}

[AST SYMBOL INDEX]
${symbolsContext}

[DEPENDENCY GRAPH]
${depsContext}

[ARCHITECTURE RULES]
${rulesContext}

[STATIC ANALYSIS ISSUES (SEMGREP / SONAR / CODEQL)]
${issuesContext}

[SECURITY RISK ASSESSMENT]
${securityContext}

[OBSERVABILITY AUDIT]
${obsContext}

[TECHNICAL DEBT ASSESSMENT]
${debtContext}

Here is the code of key files in the repository for references:
${Object.entries(repo.fileContents).map(([file, content]) => `
--- File: ${file} ---
${content}
---------------------`).join("\n")}

---
CRITICAL RULES FOR RESPONDING:
1. Always answer in highly professional, technical, yet friendly senior-architect tone.
2. Structure your response clearly using standard markdown.
3. Cite precise symbols, files, and line numbers to evidence your claims (e.g. \`src/DeviceManager.cs:12\`).
4. In your response, ALWAYS include:
   - **Direct Answer**: Clear, objective explanation of the query.
   - **Ground Truth Evidence**: A section listing the specific files/symbols/rules from CCC that back this answer.
   - **Risks & Coupling**: Any architectural coupling, security threats, or logging blind spots relevant to the topic.
   - **Refactoring Prescription**: Actionable suggestions, including effort (Low/Medium/High) and expected ROI.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "system" as any, parts: [{ text: systemContext }] },
          ...(chatHistory || []).map((h: any) => ({
            role: h.role,
            parts: [{ text: h.text }]
          })),
          { role: "user" as any, parts: [{ text: question }] }
        ],
        config: {
          temperature: 0.2
        }
      });

      return res.json({
        answer: response.text || "No response received.",
        isSimulated: false
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({
        error: "Failed to communicate with Gemini API",
        details: err.message
      });
    }
  } else {
    // Elegant fallback simulation when GEMINI_API_KEY is not defined
    setTimeout(() => {
      let fallbackAnswer = "";
      const q = question.toLowerCase();

      if (q.includes("risk") || q.includes("security") || q.includes("credential") || q.includes("secret")) {
        fallbackAnswer = `### 🧠 Security & Risk Audit (Simulated Response)

Based on the compiled **CCC v2 Artifacts**, here is a deep security assessment for **${repo.name}**:

#### 1. Direct Answer
The repository presents a **high risk profile** (Security Score: ${repo.securityRisk.score}/10) driven by critical credential leakage and poor input verification structures.

#### 2. Ground Truth Evidence
- **Hardcoded Secrets**: Found in \`${repo.id === "iot-gateway" ? "src/MqttClient.cs:10" : "src/token.service.ts:4"}\` where credentials are written directly into source files.
- **SQL Injection vulnerability**: Located in \`${repo.id === "secure-auth-service" ? "src/auth.controller.ts:14" : "billing/stripe_client.py"}\` inside the raw database queries.

#### 3. Risks & Coupling
- **Credential Leakage**: Writing private keys or database login paths inside Git logs compromises the service.
- **Database Exposure**: Raw SQL interpolation bypasses parameters, exposing complete user tables to malicious actions.

#### 4. Refactoring Prescription
1. **Parameterize Database Operations**: Introduce parameterized queries. (Effort: Low, Impact: Critical)
2. **Dynamic Configuration Stores**: Extract key constants into environment parameters. (Effort: Low, Impact: High)`;
      } else if (q.includes("architecture") || q.includes("coupling") || q.includes("layer") || q.includes("structure")) {
        fallbackAnswer = `### 🏛️ Architectural Assessment (Simulated Response)

Here is the architectural review for **${repo.name}** compiled from dependencies and structures:

#### 1. Direct Answer
The system exhibits high structural coupling that violates the defined boundary rules:
${repo.architectureRules.map(r => `* ${r}`).join("\n")}

#### 2. Ground Truth Evidence
- **Tight Coupling**: Located in \`${repo.id === "iot-gateway" ? "src/DeviceManager.cs" : "src/auth.controller.ts"}\` where classes directly access the storage engine context, bypassing service/logical contracts.

#### 3. Risks & Coupling
- **Bypassed Layers**: Direct raw communication limits scalability, complicates test mocking, and aggregates technical debt.
- **Cascade failures**: High fan-in values expose multiple services to unexpected outages if database connections drop.

#### 4. Refactoring Prescription
- **Introduce Repository Pattern**: Decouple database drivers behind an abstraction interface layer. (Effort: Medium, Impact: Outstanding)`;
      } else if (q.includes("observability") || q.includes("logging") || q.includes("monitoring") || q.includes("error")) {
        fallbackAnswer = `### 📊 Observability Audit (Simulated Response)

Here is the operational readiness status for **${repo.name}**:

#### 1. Direct Answer
The repository has **extremely low logging & metrics coverage** (${repo.observabilityCoverage.logging}% overall), resulting in production blind spots.

#### 2. Ground Truth Evidence
- **Suppressed Errors**: Found inside \`${repo.id === "iot-gateway" ? "src/TelemetryPipeline.cs:36" : "src/user.db.ts"}\` where exception blocks handle errors by failing silently or printing basic stacktraces without structured tracing.

#### 3. Risks & Coupling
- **Silent failures**: System crashes will go undetected until users experience outages, as no error triggers or metrics alerts exist.
- **Diagnostics Void**: Without correlated trace identifiers, isolating distributed multi-service issues is nearly impossible.

#### 4. Refactoring Prescription
- **Enforce Structured Logger injection**: Implement robust try/catch log writing with correct context parameters. (Effort: Low, Impact: High)
- **Integrate OpenTelemetry**: Spawn traces upon request initiations. (Effort: Medium, Impact: Medium)`;
      } else {
        fallbackAnswer = `### 🧠 Repository Professor Analysis (Simulated Response)

Thank you for asking about **${repo.name}**. Here is the general architectural synthesis compiled from the Code Context Compiler (CCC):

#### 1. Direct Answer
The repository **${repo.name}** constitutes a ${repo.language} service designed to handle ${repo.description}

#### 2. Ground Truth Evidence
- **Files Analyzed**: ${repo.files.map(f => `\`${f}\``).join(", ")}
- **Symbols Discovered**: ${repo.symbols.map(s => `\`${s.name} (${s.type})\``).slice(0, 5).join(", ")}...

#### 3. Risks & Coupling
- **Static Alerts**: Detected ${repo.staticAnalysis.length} warning issues.
- **Technical Debt**: Debt rating is **${repo.technicalDebt.rating}** (Debt Score: ${repo.technicalDebt.score}/100) due to:
${repo.technicalDebt.smells.map(s => `  - ${s}`).join("\n")}

#### 4. Refactoring Prescription
- Run a targeted refactoring sprint to resolve the identified security risk (Score: ${repo.securityRisk.score}/10) and implement structural decouplings.

*Note: Real-time Gemini AI integration is currently operating in simulation mode. To activate real live answers, configure a valid \`GEMINI_API_KEY\` in your workspace secrets.*`;
      }

      res.json({
        answer: fallbackAnswer,
        isSimulated: true
      });
    }, 1000);
  }
});

// Serve frontend assets in production or use Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
