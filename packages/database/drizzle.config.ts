import type { Config } from "drizzle-kit";
console.log("process.env.DATABASE_URL: ", process.env.DATABASE_URL);
export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
