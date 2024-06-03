import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import * as schema from "../db/schema";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

export const db = drizzle(sql, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.session,
  schema.user,
);

export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
}
