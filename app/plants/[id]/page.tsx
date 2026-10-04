import { notFound } from "next/navigation";
import { pool } from "@/lib/db";
import type { Plant } from "@/lib/plants";
import PlantDetailView from "./plantDetailView";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  const { rows } = await pool.query<Plant>(
    `SELECT id, scientific_name, common_names, family, edible_portion,
            edible_uses, description, found_in, click_count, last_clicked_at
     FROM plants
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  const plant = rows[0];
  if (!plant) notFound();

  return <PlantDetailView plant={plant} />;
}
