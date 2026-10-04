import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Pool } from "pg";

const credentialsPath = resolve(
  process.cwd(),
  "tiger-cloud-faerity-credentials.env",
);

if (existsSync(credentialsPath)) {
  config({ path: credentialsPath });
}

const connectionString = process.env.TIMESCALE_SERVICE_URL;
const sslMode = process.env.PGSSLMODE?.toLowerCase();

function getConnectionString(): string {
  if (!connectionString) {
    throw new Error("TIMESCALE_SERVICE_URL is not configured.");
  }

  const url = new URL(connectionString);
  url.searchParams.set("uselibpqcompat", "true");

  if (sslMode) {
    url.searchParams.set("sslmode", sslMode);
  }

  return url.toString();
}

export const pool = new Pool({
  ...(connectionString
    ? { connectionString: getConnectionString() }
    : {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT ?? "5432"),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        ssl:
          sslMode === "disable"
            ? false
            : sslMode === "require"
              ? { rejectUnauthorized: false }
              : true,
      }),
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("Unexpected idle PostgreSQL connection error:", error);
});
