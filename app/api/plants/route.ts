import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, scientific_name, common_names, family, edible_portion,
              edible_uses, description, found_in, click_count, last_clicked_at
       FROM plants
       ORDER BY lower(COALESCE(NULLIF(btrim(common_names), ''), scientific_name)),
                id`,
    );

    return Response.json(result.rows, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load all plants:", error);
    return Response.json(
      { error: "Could not load plants." },
      { status: 500 },
    );
  }
}
