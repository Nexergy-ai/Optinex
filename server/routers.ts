import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOperationalChallenge, createOrchestrationResult, getOrchestrationResult } from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  orchestrator: router({
    submitChallenge: protectedProcedure
      .input(
        z.object({
          industry: z.string(),
          priority: z.enum(["Low", "Medium", "High", "Critical"]),
          description: z.string().min(1),
          attachmentUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Create the challenge record
        const challengeResult = await createOperationalChallenge(ctx.user.id, {
          industry: input.industry,
          priority: input.priority,
          description: input.description,
          attachmentUrl: input.attachmentUrl,
        });

        const challengeId = (challengeResult as any).insertId as number;

        // Call LLM to process the challenge
        const systemPrompt = `You are an Operational Intelligence Orchestrator. Analyze the operational challenge and provide:
1. A classification of the problem type
2. A list of business units that should be activated (e.g., "Operations", "Supply Chain", "Quality", "Finance", "HR", "Technology", "Customer Service")
3. Strategic recommendations

Respond in JSON format with keys: classification, activatedUnits (array of strings), recommendations (array of objects with title and description).`;

        const userMessage = `Industry: ${input.industry}\nPriority: ${input.priority}\nChallenge: ${input.description}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "orchestration_response",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  classification: { type: "string" },
                  activatedUnits: {
                    type: "array",
                    items: { type: "string" },
                  },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
                required: ["classification", "activatedUnits", "recommendations"],
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content) throw new Error("No response from LLM");

        const parsed = typeof content === "string" ? JSON.parse(content) : content;

        // Store the orchestration result
        await createOrchestrationResult(challengeId, {
          classification: parsed.classification,
          activatedUnits: JSON.stringify(parsed.activatedUnits),
          recommendations: JSON.stringify(parsed.recommendations),
        });

        return {
          challengeId,
          ...parsed,
        };
      }),

    getResult: protectedProcedure
      .input(z.object({ challengeId: z.number() }))
      .query(async ({ input }) => {
        const result = await getOrchestrationResult(input.challengeId);

        if (!result) return null;

        return {
          ...result,
          activatedUnits: JSON.parse(result.activatedUnits),
          recommendations: JSON.parse(result.recommendations),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
