import { pool } from "@/lib/db";
import type { Plant } from "@/lib/plants";

export type PlantSearchCandidate = Pick<
  Plant,
  "id" | "scientific_name" | "common_names"
>;

const plantFields = `id, scientific_name, common_names, family, edible_portion,
                     edible_uses, description, found_in, thumbnail,
                     image_attribution, image_license, click_count, last_clicked_at`;

export async function getPlantSearchCatalog(): Promise<PlantSearchCandidate[]> {
  const { rows } = await pool.query<PlantSearchCandidate>(
    `SELECT id, scientific_name, common_names
     FROM plants
     ORDER BY id
     LIMIT 500`,
  );

  return rows;
}

export async function getPlantsByIds(ids: number[]): Promise<Plant[]> {
  if (ids.length === 0) return [];

  const { rows } = await pool.query<Plant>(
    `SELECT ${plantFields}
     FROM plants
     WHERE id = ANY($1::int[])
     ORDER BY array_position($1::int[], id)`,
    [ids],
  );

  return rows;
}
