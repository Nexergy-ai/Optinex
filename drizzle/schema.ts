import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const operationalChallenges = mysqlTable("operational_challenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  industry: varchar("industry", { length: 64 }).notNull(),
  priority: mysqlEnum("priority", ["Low", "Medium", "High", "Critical"]).notNull(),
  description: text("description").notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OperationalChallenge = typeof operationalChallenges.$inferSelect;
export type InsertOperationalChallenge = typeof operationalChallenges.$inferInsert;

export const orchestrationResults = mysqlTable("orchestration_results", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challengeId").notNull().references(() => operationalChallenges.id),
  classification: text("classification").notNull(),
  activatedUnits: text("activatedUnits").notNull(), // JSON string
  recommendations: text("recommendations").notNull(), // JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrchestrationResult = typeof orchestrationResults.$inferSelect;
export type InsertOrchestrationResult = typeof orchestrationResults.$inferInsert;