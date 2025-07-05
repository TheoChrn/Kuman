import { type Config } from "drizzle-kit";

console.log(process.env.POSTGRES_URL);

export default {
  dialect: "postgresql",
  dbCredentials: {
    ssl: {
      rejectUnauthorized: false,
    },

    url: process.env.POSTGRES_URL!,
  },
  casing: "snake_case",
  schema: ["./src/**/schema.ts"],
  out: "./migrations",
} satisfies Config;
