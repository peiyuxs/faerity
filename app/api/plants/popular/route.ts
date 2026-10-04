import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, scientific_name, common_names, family, edible_portion,
              edible_uses, description, found_in, click_count, last_clicked_at
       FROM plants
       ORDER BY click_count DESC,
                last_clicked_at DESC NULLS LAST,
                lower(COALESCE(NULLIF(btrim(common_names), ''), scientific_name)),
                id
       LIMIT 10`,
    );

    return Response.json(result.rows, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load popular plants:", error);
    return Response.json(
      { error: "Could not load popular plants." },
      { status: 500 },
    );
  }
}
