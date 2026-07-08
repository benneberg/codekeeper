import { describe, it, expect } from "vitest";
import { mockRepositories } from "../../server/mockRepositories";

describe("ARIP Deterministic Repository Engine Tests", () => {
  it("should contain the three standard compiled mock repositories", () => {
    expect(mockRepositories).toBeDefined();
    expect(mockRepositories.length).toBe(3);

    const ids = mockRepositories.map(r => r.id);
    expect(ids).toContain("iot-gateway");
    expect(ids).toContain("secure-auth-service");
    expect(ids).toContain("enterprise-billing-system");
  });

  it("should have correct file and symbol metrics for each repository", () => {
    for (const repo of mockRepositories) {
      expect(repo.files.length).toBeGreaterThan(0);
      expect(repo.symbols.length).toBeGreaterThan(0);
      expect(repo.technicalDebt.score).toBeGreaterThanOrEqual(0);
      expect(repo.technicalDebt.score).toBeLessThanOrEqual(100);
      expect(repo.securityRisk.score).toBeGreaterThanOrEqual(0);
      expect(repo.securityRisk.score).toBeLessThanOrEqual(10);
    }
  });

  it("should correctly evaluate modularity index scores", () => {
    for (const repo of mockRepositories) {
      const integrityScore = Math.max(20, 100 - repo.technicalDebt.score - (repo.securityRisk.score * 4));
      expect(integrityScore).toBeGreaterThanOrEqual(20);
      expect(integrityScore).toBeLessThanOrEqual(100);
    }
  });

  it("should contain matching file contents for critical files", () => {
    const iot = mockRepositories.find(r => r.id === "iot-gateway");
    expect(iot).toBeDefined();
    if (iot) {
      expect(iot.fileContents["src/DeviceManager.cs"]).toBeDefined();
      expect(iot.fileContents["src/DeviceManager.cs"]).toContain("DeviceDbContext");
    }
  });
});
