import { timestamp, text, json, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const roles = pgEnum("role", ["user", "guest"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roles("role").notNull().default("guest"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const meal = pgTable("meal", {
  name: text("name").notNull(),
  ingredients: json("ingredients"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const pantry = pgTable("pantry", {
  ingredients: json("ingredients"),
});
