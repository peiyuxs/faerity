import { pool } from "@/lib/db";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "A valid JSON body is required." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("plantId" in body) ||
    typeof body.plantId !== "number" ||
    !Number.isSafeInteger(body.plantId) ||
    body.plantId <= 0
  ) {
    return Response.json({ error: "A valid plantId is required." }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE plants
       SET click_count = click_count + 1,
           last_clicked_at = now()
       WHERE id = $1
       RETURNING click_count, last_clicked_at`,
      [body.plantId],
    );

    if (result.rowCount === 0) {
      return Response.json({ error: "Plant not found." }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to record plant click:", error);
    return Response.json(
      { error: "Could not record the plant click." },
      { status: 500 },
    );
  }
}
