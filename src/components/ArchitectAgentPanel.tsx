import React, { useState } from "react";
import { MockRepository } from "../../server/mockRepositories";
import { Layers, ShieldAlert, BadgeCheck, Network, HelpCircle, GitCommit, CheckCircle } from "lucide-react";

interface Props {
  repo: MockRepository;
}

export default function ArchitectAgentPanel({ repo }: Props) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  // Simulated architecture review data with evidence, confidence, and metrics
  const reviewData = {
    iot: {
      layerViolations: [
        {
          id: "VIOL-01",
          source: "src/DeviceManager.cs",
          target: "src/Data/DeviceDbContext.cs",
          severity: "high",
          type: "Layer Boundary Bypass",
          description: "DeviceManager (Service Layer) directly references DeviceDbContext (Data Layer). Direct instantiation bypasses structural storage abstractions.",
          evidence: "public DeviceManager(DeviceDbContext context) { _context = context; }",
          line: 14,
          confidence: 0.98
        },
        {
          id: "VIOL-02",
          source: "src/MqttClient.cs",
          target: "src/TelemetryPipeline.cs",
          severity: "low",
          type: "Circular Dependency Loop",
          description: "MqttClient references TelemetryPipeline for telemetry parsing, while TelemetryPipeline creates a connection feedback channel back to MqttClient.",
          evidence: "class MqttClient { private TelemetryPipeline _pipe; ... }",
          line: 41,
          confidence: 0.89
        }
      ],
      couplingMatrix: [
        { module: "src/DeviceManager.cs", fanIn: 2, fanOut: 3, couplingIndex: 0.71, status: "acceptable" },
        { module: "src/MqttClient.cs", fanIn: 1, fanOut: 4, couplingIndex: 0.83, status: "high coupling" },
        { module: "src/TelemetryPipeline.cs", fanIn: 3, fanOut: 1, couplingIndex: 0.50, status: "stable" }
      ],
      domainBoundaries: [
        {
          boundary: "Device Management Context",
          modules: ["src/DeviceManager.cs", "src/DeviceModel.cs"],
          cohesionScore: 88,
          recommendation: "Keep current boundaries, but strictly enforce repository layers."
        },
        {
          boundary: "Telemetry Ingestion Context",
          modules: ["src/TelemetryPipeline.cs", "src/MqttClient.cs"],
          cohesionScore: 62,
          recommendation: "Strongly decouple MqttClient fallback network parameters from core parsing routines."
        }
      ]
    },
    auth: {
      layerViolations: [
        {
          id: "VIOL-01",
          source: "src/auth.controller.ts",
          target: "src/user.db.ts",
          severity: "high",
          type: "Storage Layer Bypass",
          description: "AuthController (Presentation Layer) directly references UserDatabase (Data Layer) and triggers raw unparameterized SQL operations.",
          evidence: "const user = await this.userDb.queryRaw(...) ;",
          line: 14,
          confidence: 0.99
        }
      ],
      couplingMatrix: [
        { module: "src/auth.controller.ts", fanIn: 0, fanOut: 2, couplingIndex: 0.67, status: "acceptable" },
        { module: "src/token.service.ts", fanIn: 1, fanOut: 1, couplingIndex: 0.50, status: "stable" },
        { module: "src/user.db.ts", fanIn: 1, fanOut: 0, couplingIndex: 0.50, status: "stable" }
      ],
      domainBoundaries: [
        {
          boundary: "Token Authentication Boundary",
          modules: ["src/auth.controller.ts", "src/token.service.ts", "src/config/jwt.ts"],
          cohesionScore: 92,
          recommendation: "Encapsulate signing rules inside TokenService entirely."
        },
        {
          boundary: "User Storage Gateway",
          modules: ["src/user.db.ts"],
          cohesionScore: 85,
          recommendation: "Migrate Raw query database operations into a dedicated Service interface."
        }
      ]
    },
    billing: {
      layerViolations: [
        {
          id: "VIOL-01",
          source: "billing/services.py",
          target: "billing/stripe_client.py",
          severity: "high",
          type: "Blocking Integration Bypass",
          description: "BillingService directly invokes StripeClient.create_charge within synchronous user threads without time limits or connection pool throttling.",
          evidence: "charge_id = self.stripe_client.create_charge(user_id, amount)",
          line: 14,
          confidence: 0.95
        }
      ],
      couplingMatrix: [
        { module: "billing/services.py", fanIn: 1, fanOut: 2, couplingIndex: 0.75, status: "complex" },
        { module: "billing/stripe_client.py", fanIn: 1, fanOut: 0, couplingIndex: 0.50, status: "stable" },
        { module: "billing/models.py", fanIn: 2, fanOut: 0, couplingIndex: 0.40, status: "stable" }
      ],
      domainBoundaries: [
        {
          boundary: "Stripe Payment Gateway",
          modules: ["billing/stripe_client.py"],
          cohesionScore: 95,
          recommendation: "Introduce Celery queue architecture to execute third-party HTTP connections in background channels."
        }
      ]
    }
  };

  // Select key based on repository ID
  const activeKey = repo.id === "iot-gateway" ? "iot" : repo.id === "saas-auth" ? "auth" : "billing";
  const data = reviewData[activeKey] || reviewData.iot;

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans tracking-tight">
          <Layers className="w-5 h-5 text-slate-700" />
          Deterministic Architect Agent Review
        </h3>
        <p className="text-xs text-slate-600 mt-1 font-sans">
          Ground-truth architectural analysis compiled from AST definitions. Discovers layer bypass errors, circular loops, and domain coupling constraints with exact source evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Violations */}
        <div className="lg:col-span-8 space-y-5">
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Detected Layer Boundary Violations
            </h4>

            <div className="space-y-3.5">
              {data.layerViolations.map((violation) => (
                <div key={violation.id} className="border border-slate-200 rounded-lg p-4 space-y-3.5 bg-white text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded text-[10px] uppercase">
                      {violation.type}
                    </span>
                    <span className="font-mono text-slate-500 font-bold text-[10px]">
                      Confidence: {(violation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-slate-800 font-sans leading-relaxed">
                    {violation.description}
                  </p>

                  <div className="p-3 bg-[#faf9f6] border border-slate-200 rounded font-mono text-[11px] text-slate-700 space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Source Code Evidence</div>
                    <div className="text-slate-900 font-semibold">{violation.evidence}</div>
                    <div className="text-[9px] text-slate-500">File: {violation.source} (Line: {violation.line}) → Target: {violation.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Boundaries */}
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Domain Boundary Evaluation
            </h4>

            <div className="space-y-3">
              {data.domainBoundaries.map((b, idx) => (
                <div key={idx} className="p-4 bg-[#fcfbfa] border border-slate-200 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-slate-900">{b.boundary}</span>
                    <span className="font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-[10px]">
                      Cohesion: {b.cohesionScore}%
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono">
                    Target Modules: {b.modules.join(", ")}
                  </div>

                  <p className="text-slate-700 font-sans leading-relaxed border-t border-slate-100 pt-2 italic">
                    "Prescription: {b.recommendation}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right coupling index */}
        <div className="lg:col-span-4 space-y-5">
          <div className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-sm font-sans">
            <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Module Coupling Matrix
            </h4>

            <div className="divide-y divide-slate-100 text-xs font-mono">
              {data.couplingMatrix.map((matrix, i) => (
                <div key={i} className="py-3.5 space-y-1.5 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 truncate max-w-[150px]">{matrix.module.split("/").pop()}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                      matrix.status === "stable" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      matrix.status === "acceptable" ? "bg-slate-50 text-slate-700 border border-slate-200" :
                      "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {matrix.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Fan-In: {matrix.fanIn} | Fan-Out: {matrix.fanOut}</span>
                    <span className="font-bold">Index: {matrix.couplingIndex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
