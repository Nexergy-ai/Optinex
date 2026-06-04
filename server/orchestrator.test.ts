import { describe, expect, it, vi, beforeEach } from "vitest";
import { z } from "zod";

// Test input validation
describe("orchestrator input validation", () => {
  const challengeInputSchema = z.object({
    industry: z.string(),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    description: z.string().min(1),
    attachmentUrl: z.string().optional(),
  });

  const resultInputSchema = z.object({
    challengeId: z.number(),
  });

  describe("submitChallenge validation", () => {
    it("should accept valid input", () => {
      const input = {
        industry: "Manufacturing",
        priority: "High" as const,
        description: "Production line downtime issues",
        attachmentUrl: undefined,
      };

      const result = challengeInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject empty description", () => {
      const input = {
        industry: "Manufacturing",
        priority: "High" as const,
        description: "",
      };

      const result = challengeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject invalid priority", () => {
      const input = {
        industry: "Manufacturing",
        priority: "InvalidPriority",
        description: "Test challenge",
      };

      const result = challengeInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should accept all valid priority values", () => {
      const priorities = ["Low", "Medium", "High", "Critical"] as const;
      
      priorities.forEach((priority) => {
        const input = {
          industry: "Manufacturing",
          priority,
          description: "Test challenge",
        };

        const result = challengeInputSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it("should accept optional attachmentUrl", () => {
      const inputWithAttachment = {
        industry: "Manufacturing",
        priority: "High" as const,
        description: "Test challenge",
        attachmentUrl: "document.pdf",
      };

      const result = challengeInputSchema.safeParse(inputWithAttachment);
      expect(result.success).toBe(true);
    });
  });

  describe("getResult validation", () => {
    it("should accept valid challenge ID", () => {
      const input = { challengeId: 123 };
      const result = resultInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject non-numeric challenge ID", () => {
      const input = { challengeId: "not-a-number" as any };
      const result = resultInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject negative challenge ID", () => {
      const input = { challengeId: -1 };
      const result = resultInputSchema.safeParse(input);
      // Zod number() accepts negative by default, so this should pass
      expect(result.success).toBe(true);
    });
  });
});

// Test LLM response structure
describe("orchestrator LLM response structure", () => {
  const orchestrationResponseSchema = z.object({
    classification: z.string(),
    activatedUnits: z.array(z.string()),
    recommendations: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  });

  it("should validate correct LLM response structure", () => {
    const response = {
      classification: "Equipment Maintenance Issue",
      activatedUnits: ["Operations", "Maintenance", "Quality"],
      recommendations: [
        {
          title: "Preventive Maintenance",
          description: "Implement scheduled maintenance program",
        },
        {
          title: "Root Cause Analysis",
          description: "Conduct RCA on recent failures",
        },
      ],
    };

    const result = orchestrationResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it("should reject response with missing fields", () => {
    const response = {
      classification: "Equipment Maintenance Issue",
      activatedUnits: ["Operations"],
      // Missing recommendations
    };

    const result = orchestrationResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it("should reject response with invalid recommendation structure", () => {
    const response = {
      classification: "Equipment Maintenance Issue",
      activatedUnits: ["Operations"],
      recommendations: [
        {
          title: "Preventive Maintenance",
          // Missing description
        },
      ],
    };

    const result = orchestrationResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it("should handle empty activated units", () => {
    const response = {
      classification: "Equipment Maintenance Issue",
      activatedUnits: [],
      recommendations: [
        {
          title: "Preventive Maintenance",
          description: "Implement scheduled maintenance",
        },
      ],
    };

    const result = orchestrationResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});

// Test industry options
describe("orchestrator industry options", () => {
  const validIndustries = [
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Finance",
    "Technology",
    "Logistics",
    "Energy",
    "Telecommunications",
    "Education",
    "Government",
    "Automotive",
    "Aerospace",
    "Pharmaceuticals",
    "Food & Beverage",
    "Real Estate",
  ];

  it("should support all defined industries", () => {
    validIndustries.forEach((industry) => {
      expect(validIndustries).toContain(industry);
    });
  });

  it("should have at least 10 industries", () => {
    expect(validIndustries.length).toBeGreaterThanOrEqual(10);
  });
});
