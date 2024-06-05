import {
  timestamp,
  text,
  jsonb,
  serial,
  pgEnum,
  pgTable,
} from "drizzle-orm/pg-core";

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
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ingredients: jsonb("ingredients")
    .array()
    .$type<
      Array<{ name: string; quantity: number | null; unit: string | null }>
    >(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const pantry = pgTable("pantry", {
  id: text("id").primaryKey(),
  item: jsonb("item").$type<{
    name: string;
    quantity: number | null;
    unit: string | null;
  }>(),
});
