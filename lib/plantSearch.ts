import { pool } from "@/lib/db";
import type { Plant } from "@/lib/plants";

const SEARCHABLE_COLUMNS = [
  "scientific_name",
  "common_names",
  "family",
  "edible_portion",
  "edible_uses",
  "description",
  "found_in",
] as const;

export async function searchPlants(
  terms: string[],
  excludedIds: number[] = [],
): Promise<Plant[]> {
  if (terms.length === 0) return [];

  const values: (string | number[])[] = [];
  const conditions = terms.flatMap((term) => {
    const parameter = `$${values.push(`%${term}%`)}`;
    return SEARCHABLE_COLUMNS.map(
      (column) => `COALESCE(${column}, '') ILIKE ${parameter}`,
    );
  });

  values.push(excludedIds);
  const excludeParameter = `$${values.length}`;

  const { rows } = await pool.query<Plant>(
    `SELECT id, scientific_name, common_names, family, edible_portion,
            edible_uses, description, found_in, click_count, last_clicked_at
     FROM plants
     WHERE (${conditions.join(" OR ")})
       AND id <> ALL(${excludeParameter}::int[])
     ORDER BY click_count DESC, id
     LIMIT 100`,
    values,
  );

  return rows;
}
