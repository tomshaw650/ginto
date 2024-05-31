import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { session, user } from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);

export const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
}
