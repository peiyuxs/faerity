import { pool } from "@/lib/db";

export async function GET() {
  const bucket = Math.floor(Date.now() / 3_600_000);

  try {
    const result = await pool.query(
      `SELECT id, scientific_name, common_names, family, edible_portion,
              edible_uses, description, found_in, click_count, last_clicked_at
       FROM plants
       ORDER BY md5($1::text || ':' || id::text)
       LIMIT 1`,
      [String(bucket)],
    );

    return Response.json(
      { plant: result.rows[0] ?? null, bucket },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load the featured plant:", error);
    return Response.json(
      { error: "Could not load the featured plant." },
      { status: 500 },
    );
  }
}
