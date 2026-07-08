export interface SymbolItem {
  name: string;
  type: "class" | "function" | "method" | "interface" | "route";
  file: string;
  line: number;
  description: string;
}

export interface DependencyEdge {
  target: string;
  importName: string;
  confidence: number;
}

export interface StaticAnalysisWarning {
  rule: string;
  tool: "Semgrep" | "SonarQube" | "ESLint" | "CodeQL";
  severity: "high" | "medium" | "low";
  file: string;
  line: number;
  message: string;
}

export interface MockRepository {
  id: string;
  name: string;
  description: string;
  language: "C#" | "TypeScript" | "Python" | "Go" | "React";
  files: string[];
  fileContents: Record<string, string>;
  symbols: SymbolItem[];
  dependencies: Record<string, DependencyEdge[]>;
  architectureRules: string[];
  staticAnalysis: StaticAnalysisWarning[];
  observabilityCoverage: {
    logging: number; // 0 to 100
    metrics: number;
    tracing: number;
    gaps: string[];
  };
  securityRisk: {
    score: number; // 0 to 10
    threats: string[];
  };
  technicalDebt: {
    score: number; // 0 to 100
    rating: "A" | "B" | "C" | "D" | "F";
    smells: string[];
  };
}

export const mockRepositories: MockRepository[] = [
  {
    id: "iot-gateway",
    name: "IoT-Gateway",
    description: "Enterprise gateway for device lifecycle registration, telemetry digestion, and MQTT broker bridge.",
    language: "C#",
    files: [
      "src/DeviceManager.cs",
      "src/TelemetryPipeline.cs",
      "src/MqttClient.cs",
      "src/Data/DeviceDbContext.cs",
      "src/Controllers/DeviceController.cs"
    ],
    fileContents: {
      "src/DeviceManager.cs": `using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace IoTGateway.Services
{
    public class DeviceManager : IDeviceManager
    {
        private readonly DeviceDbContext _context;

        // CRITICAL RISK: DeviceManager is tightly coupled to the Database Context directly.
        // This violates the clean architecture boundary.
        public DeviceManager(DeviceDbContext context)
        {
            _context = context;
        }

        public async Task<Device> RegisterDeviceAsync(string deviceId, string deviceType)
        {
            if (string.IsNullOrEmpty(deviceId))
                throw new ArgumentException("DeviceId is required", nameof(deviceId));

            var device = new Device { Id = deviceId, Type = deviceType, RegisteredAt = DateTime.UtcNow, IsActive = true };
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task<bool> IsDeviceValidAsync(string deviceId)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId);
            return device != null && device.IsActive;
        }
    }
}`,
      "src/TelemetryPipeline.cs": `using System;
using System.Threading.Tasks;
using IoTGateway.Services;

namespace IoTGateway.Pipeline
{
    public class TelemetryPipeline
    {
        private readonly IDeviceManager _deviceManager;

        public TelemetryPipeline(IDeviceManager deviceManager)
        {
            _deviceManager = deviceManager;
        }

        public async Task DigestTelemetryAsync(string deviceId, string rawPayload)
        {
            // OBSERVABILITY GAP: Exceptions are caught but suppressed without logging!
            // This is a major operational risk.
            try
            {
                var isValid = await _deviceManager.IsDeviceValidAsync(deviceId);
                if (!isValid)
                {
                    return; // Fail silently
                }

                // Process payload...
                var data = ParsePayload(rawPayload);
                SaveTelemetry(deviceId, data);
            }
            catch (Exception)
            {
                // SUPPRESSED EXCEPTION - No logs, no metrics!
            }
        }

        private object ParsePayload(string raw)
        {
            // Naive JSON decoding
            return new { ts = DateTime.UtcNow, val = raw };
        }

        private void SaveTelemetry(string deviceId, object data)
        {
            // Simulating save to time-series DB
        }
    }
}`,
      "src/MqttClient.cs": `using System;
using System.Text;
using System.Threading.Tasks;

namespace IoTGateway.Network
{
    public class MqttClient
    {
        // SECURITY VIOLATION: Hardcoded API credentials used for local telemetry fallback.
        private const string ConnectionString = "Host=mqtt.iot.enterprise.local;Port=1883;Username=admin;Password=Secr3tPassword123!";

        public async Task PublishMessageAsync(string topic, string payload)
        {
            Console.WriteLine($"Publishing to {topic}: {payload}");
            await Task.Delay(10); // Simulated write
        }
    }
}`,
      "src/Data/DeviceDbContext.cs": `using Microsoft.EntityFrameworkCore;

namespace IoTGateway.Data
{
    public class DeviceDbContext : DbContext
    {
        public DbSet<Device> Devices { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=devices.db");
        }
    }

    public class Device
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public DateTime RegisteredAt { get; set; }
        public bool IsActive { get; set; }
    }
}`,
      "src/Controllers/DeviceController.cs": `using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IoTGateway.Services;

namespace IoTGateway.Controllers
{
    [ApiController]
    [Route("api/devices")]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceManager _deviceManager;

        public DeviceController(IDeviceManager deviceManager)
        {
            _deviceManager = deviceManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var device = await _deviceManager.RegisterDeviceAsync(request.Id, request.Type);
            return Ok(device);
        }
    }

    public class RegisterRequest
    {
        public string Id { get; set; }
        public string Type { get; set; }
    }
}`
    },
    symbols: [
      { name: "DeviceManager", type: "class", file: "src/DeviceManager.cs", line: 7, description: "Manages the core lifecycle of IoT device registration." },
      { name: "RegisterDeviceAsync", type: "method", file: "src/DeviceManager.cs", line: 18, description: "Registers a device asynchronously and saves it to SQLite db." },
      { name: "IsDeviceValidAsync", type: "method", file: "src/DeviceManager.cs", line: 28, description: "Checks if a device exists and is currently active." },
      { name: "TelemetryPipeline", type: "class", file: "src/TelemetryPipeline.cs", line: 7, description: "Ingests raw IoT data streams, validates sending devices." },
      { name: "DigestTelemetryAsync", type: "method", file: "src/TelemetryPipeline.cs", line: 16, description: "Processes incoming telemetry payloads; suppresses exceptions." },
      { name: "MqttClient", type: "class", file: "src/MqttClient.cs", line: 7, description: "Establishes connection to system MQTT message broker." },
      { name: "PublishMessageAsync", type: "method", file: "src/MqttClient.cs", line: 12, description: "Publishes local packets to message queues." },
      { name: "DeviceDbContext", type: "class", file: "src/Data/DeviceDbContext.cs", line: 5, description: "EF Core database context for devices." },
      { name: "DeviceController", type: "class", file: "src/Controllers/DeviceController.cs", line: 9, description: "REST API Endpoint controller for device operations." }
    ],
    dependencies: {
      "src/DeviceManager.cs": [
        { target: "src/Data/DeviceDbContext.cs", importName: "IoTGateway.Data", confidence: 0.95 }
      ],
      "src/TelemetryPipeline.cs": [
        { target: "src/DeviceManager.cs", importName: "IoTGateway.Services", confidence: 0.9 }
      ],
      "src/Controllers/DeviceController.cs": [
        { target: "src/DeviceManager.cs", importName: "IoTGateway.Services", confidence: 0.9 }
      ]
    },
    architectureRules: [
      "ARCH-01: Network clients (MqttClient) must acquire credentials from secure ConfigurationProvider, never hardcode them.",
      "ARCH-02: TelemetryPipeline must provide explicit error logging and raise warning metrics upon digestion failures.",
      "ARCH-03: Services (DeviceManager) should decouple direct DbContext access behind a clean Repository boundary."
    ],
    staticAnalysis: [
      { rule: "SEMGREP-SEC-01", tool: "Semgrep", severity: "high", file: "src/MqttClient.cs", line: 10, message: "Hardcoded credential string found in connection string assignment." },
      { rule: "SONAR-ERR-04", tool: "SonarQube", severity: "medium", file: "src/TelemetryPipeline.cs", line: 36, message: "Empty catch block. Exceptions should be properly logged or rethrown." },
      { rule: "SONAR-WARN-09", tool: "SonarQube", severity: "low", file: "src/DeviceManager.cs", line: 20, message: "Avoid throwing generic exception argument check inside high-throughput tasks." }
    ],
    observabilityCoverage: {
      logging: 15,
      metrics: 0,
      tracing: 10,
      gaps: [
        "Empty catch block in TelemetryPipeline suppresses all errors.",
        "Zero performance metrics emitted during payload parsing.",
        "Distributed tracing (OpenTelemetry) not initialized in Controllers."
      ]
    },
    securityRisk: {
      score: 8.5,
      threats: [
        "Insecure hardcoded password in MqttClient (`Secr3tPassword123!`).",
        "SQLite file-based database containing credentials readable by system users.",
        "No API throttling or OAuth scope validation on DeviceController register endpoint."
      ]
    },
    technicalDebt: {
      score: 45,
      rating: "C",
      smells: [
        "Tight coupling: DeviceManager directly inherits and manipulates Database Context.",
        "Supressed error pipeline: Failures are silenced, creating blind spots.",
        "Hardcoded constants: System relies on constant strings instead of dynamic configs."
      ]
    }
  },
  {
    id: "secure-auth-service",
    name: "Secure-Auth-Service",
    description: "JWT-based authentication microservice, handling token issuance, refreshes, and dynamic user security models.",
    language: "TypeScript",
    files: [
      "src/auth.controller.ts",
      "src/token.service.ts",
      "src/user.db.ts",
      "src/config/jwt.ts"
    ],
    fileContents: {
      "src/auth.controller.ts": `import { Request, Response } from "express";
import { TokenService } from "./token.service";
import { UserDatabase } from "./user.db";

export class AuthController {
  private tokenService = new TokenService();
  private userDb = new UserDatabase();

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // ARCHITECTURAL VIOLATION: AuthController directly bypasses user service
    // and queries the database layer. In certain cases, it executes raw queries!
    const user = await this.userDb.queryRaw(\`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`);
    
    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = this.tokenService.generateAccessToken(user[0].id, user[0].role);
    const refreshToken = this.tokenService.generateRefreshToken(user[0].id);

    return res.json({ token, refreshToken });
  }
}`,
      "src/token.service.ts": `import jwt from "jsonwebtoken";

export class TokenService {
  private secret = process.env.JWT_SECRET || "SUPER_DEFAULT_DEVELOPMENT_SECRET_DO_NOT_USE_IN_PROD";

  public generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ sub: userId, role }, this.secret, { expiresIn: "15m" });
  }

  public generateRefreshToken(userId: string): string {
    // Generate long-lived refresh token
    return jwt.sign({ sub: userId }, this.secret, { expiresIn: "7d" });
  }

  public verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      return null;
    }
  }
}`,
      "src/user.db.ts": `import { Client } from "pg";

export class UserDatabase {
  private client: Client;

  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    this.client.connect().catch(err => console.error("DB connection error", err));
  }

  // Raw query executor prone to SQL injection
  public async queryRaw(sql: string): Promise<any[]> {
    const res = await this.client.query(sql);
    return res.rows;
  }

  public async getUserById(id: string) {
    const res = await this.client.query("SELECT id, email, role FROM users WHERE id = $1", [id]);
    return res.rows[0];
  }
}`,
      "src/config/jwt.ts": `export const JWT_CONFIG = {
  expiresIn: '15m',
  refreshExpiresIn: '7d',
  algorithm: 'HS256'
};`
    },
    symbols: [
      { name: "AuthController", type: "class", file: "src/auth.controller.ts", line: 5, description: "Express controller handling API login requests." },
      { name: "login", type: "method", file: "src/auth.controller.ts", line: 9, description: "Authenticates users; runs raw SQL matching credentials." },
      { name: "TokenService", type: "class", file: "src/token.service.ts", line: 3, description: "Issues, signs, and decodes JWT tokens." },
      { name: "generateAccessToken", type: "method", file: "src/token.service.ts", line: 6, description: "Signs an access token valid for 15 minutes." },
      { name: "UserDatabase", type: "class", file: "src/user.db.ts", line: 3, description: "Direct gateway client for PostgreSQL database." },
      { name: "queryRaw", type: "method", file: "src/user.db.ts", line: 14, description: "Executes unparameterized raw SQL statements directly on Pg Client." }
    ],
    dependencies: {
      "src/auth.controller.ts": [
        { target: "src/token.service.ts", importName: "./token.service", confidence: 0.98 },
        { target: "src/user.db.ts", importName: "./user.db", confidence: 0.98 }
      ],
      "src/token.service.ts": [
        { target: "src/config/jwt.ts", importName: "./config/jwt", confidence: 0.8 }
      ]
    },
    architectureRules: [
      "ARCH-01: Express Controllers must NEVER initiate database statements; they must delegate to Service layer classes.",
      "ARCH-02: All queries running on the PostgreSQL engine must use parameterized variables ($1, $2) to avoid SQL Injection.",
      "ARCH-03: Security configuration keys must fall back to undefined or throw errors, rather than compiling default strings in source code."
    ],
    staticAnalysis: [
      { rule: "ESLINT-SQL-INJECTION", tool: "ESLint", severity: "high", file: "src/auth.controller.ts", line: 14, message: "SQL Injection vulnerability: variable interpolating raw query statement." },
      { rule: "SEMGREP-JWT-SECRET", tool: "Semgrep", severity: "high", file: "src/token.service.ts", line: 4, message: "Hardcoded fallback JWT signing secret detected." },
      { rule: "CODEQL-DB-PASS", tool: "CodeQL", severity: "medium", file: "src/user.db.ts", line: 11, message: "Database connection has unhandled promise rejection during connection failures." }
    ],
    observabilityCoverage: {
      logging: 40,
      metrics: 20,
      tracing: 30,
      gaps: [
        "DB Connection error is printed to stderr but does not trigger crash alert.",
        "Auth tokens are issued without writing audit log events for compliance."
      ]
    },
    securityRisk: {
      score: 9.8,
      threats: [
        "Critical SQL Injection inside AuthController.login() on `email` and `password` variables.",
        "Compromised fallback JWT signing key exposed in source code (`SUPER_DEFAULT_DEVELOPMENT_SECRET_DO_NOT_USE_IN_PROD`)."
      ]
    },
    technicalDebt: {
      score: 30,
      rating: "B",
      smells: [
        "Controller-DB tight coupling bypassing Service pattern.",
        "SQL Query string concatenation."
      ]
    }
  },
  {
    id: "enterprise-billing-system",
    name: "Enterprise-Billing-System",
    description: "Subscription core mapping Stripe customer accounts, issuing dynamic invoices, and validating financial transactions.",
    language: "Python",
    files: [
      "billing/services.py",
      "billing/stripe_client.py",
      "billing/models.py",
      "billing/views.py"
    ],
    fileContents: {
      "billing/services.py": `import logging
from billing.stripe_client import StripeClient
from billing.models import Invoice, Subscription

logger = logging.getLogger(__name__)

class BillingService:
    def __init__(self):
        self.stripe_client = StripeClient()

    def process_monthly_invoice(self, user_id, amount):
        logger.info(f"Initiating invoice processing for {user_id}")
        
        # High-risk: synchronuous network call to Stripe without timeout
        charge_id = self.stripe_client.create_charge(user_id, amount)
        
        if charge_id:
            invoice = Invoice(user_id=user_id, amount=amount, stripe_charge_id=charge_id, status="PAID")
            invoice.save()
            return invoice
        else:
            invoice = Invoice(user_id=user_id, amount=amount, status="FAILED")
            invoice.save()
            raise Exception("Stripe charge failed")`,
      "billing/stripe_client.py": `import os
import requests

class StripeClient:
    def __init__(self):
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        # BAD PRACTISE: No timeout set on API requests. If Stripe hangs, the whole thread pool blocks.
        self.base_url = "https://api.stripe.com/v1"

    def create_charge(self, user_id, amount):
        if not self.api_key:
            raise ValueError("Stripe API key missing")
            
        payload = {
            "amount": int(amount * 100),
            "currency": "usd",
            "customer": f"cus_{user_id}"
        }
        
        # Violates performance & safety rules: Synchronous requests block with no connection limits
        response = requests.post(
            f"{self.base_url}/charges",
            json=payload,
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        if response.status_code == 200:
            return response.json().get("id")
        return None`,
      "billing/models.py": `class Invoice:
    def __init__(self, user_id, amount, stripe_charge_id=None, status="PENDING"):
        self.user_id = user_id
        self.amount = amount
        self.stripe_charge_id = stripe_charge_id
        self.status = status

    def save(self):
        # Simulated database persist
        print(f"Saving Invoice for user {self.user_id}, status: {self.status}")

class Subscription:
    def __init__(self, user_id, plan, active=True):
        self.user_id = user_id
        self.plan = plan
        self.active = active`,
      "billing/views.py": `from billing.services import BillingService

class InvoiceView:
    def __init__(self):
        self.billing_service = BillingService()

    def post(self, request_data):
        user_id = request_data.get("user_id")
        amount = request_data.get("amount")
        
        invoice = self.billing_service.process_monthly_invoice(user_id, amount)
        return {"status": "success", "invoice_id": invoice.stripe_charge_id}`
    },
    symbols: [
      { name: "BillingService", type: "class", file: "billing/services.py", line: 7, description: "Coordinates user subscriptions and Stripe synchronization." },
      { name: "process_monthly_invoice", type: "function", file: "billing/services.py", line: 11, description: "Issues Stripe billing charges and updates db status." },
      { name: "StripeClient", type: "class", file: "billing/stripe_client.py", line: 4, description: "API proxy wrapper for interacting with Stripe v1 REST endpoints." },
      { name: "create_charge", type: "function", file: "billing/stripe_client.py", line: 10, description: "Submits subscription capture queries over HTTP requests." },
      { name: "Invoice", type: "class", file: "billing/models.py", line: 1, description: "Mock record representation for billing audits." }
    ],
    dependencies: {
      "billing/services.py": [
        { target: "billing/stripe_client.py", importName: "StripeClient", confidence: 0.95 },
        { target: "billing/models.py", importName: "Invoice", confidence: 0.9 }
      ],
      "billing/views.py": [
        { target: "billing/services.py", importName: "BillingService", confidence: 0.95 }
      ]
    },
    architectureRules: [
      "ARCH-01: Outgoing API services must enforce timeouts (maximum 3.0s) and handle networking failures with retry parameters.",
      "ARCH-02: Third-party billing providers must run asynchronously inside a background worker queue, never blocking user HTTP threads."
    ],
    staticAnalysis: [
      { rule: "SEMGREP-HTTP-TIMEOUT", tool: "Semgrep", severity: "high", file: "billing/stripe_client.py", line: 20, message: "HTTP request without standard timeout parameter. Risk of hanging infinite connection threads." },
      { rule: "PYLINT-EXCEPT", tool: "SonarQube", severity: "medium", file: "billing/services.py", line: 24, message: "Raising untyped Exception inside high-throughput billing service controller." }
    ],
    observabilityCoverage: {
      logging: 70,
      metrics: 30,
      tracing: 45,
      gaps: [
        "Network latency metrics (request duraton to Stripe) not captured.",
        "Failed charge reasons (Stripe status codes) not structured inside logger outputs."
      ]
    },
    securityRisk: {
      score: 4.2,
      threats: [
        "Stripe key exposure if environment variables log during exceptions.",
        "Missing validation on Invoice creation amount parameters (could allow negative totals)."
      ]
    },
    technicalDebt: {
      score: 28,
      rating: "B",
      smells: [
        "Synchronous integration: blocks active web requests on third-party latency.",
        "Loose exception types: generic ValueError / Exception without domain boundaries."
      ]
    }
  }
];
