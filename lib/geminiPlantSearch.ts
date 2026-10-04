import { GoogleGenAI } from "@google/genai";
import type { PlantSearchCandidate } from "@/lib/plantSearch";

const USE_GEMINI_SEARCH = true; // Set to false to skip Gemini and show direct name matches only.
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const MAX_PLANTS_PER_SECTION = 20;

export type PlantSearchPlan = {
  results: number[];
  suggestions: number[];
  inSeason: number[];
};

const responseSchema = {
  type: "object",
  properties: {
    results: { type: "array", items: { type: "integer" } },
    suggestions: { type: "array", items: { type: "integer" } },
    inSeason: { type: "array", items: { type: "integer" } },
  },
  required: ["results", "suggestions", "inSeason"],
};

function cleanIds(value: unknown, validIds: Set<number>): number[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (id): id is number =>
          Number.isInteger(id) && validIds.has(id),
      ),
    ),
  ].slice(0, MAX_PLANTS_PER_SECTION);
}

export async function makePlantSearchPlan(
  query: string,
  month: string,
  plants: PlantSearchCandidate[],
): Promise<PlantSearchPlan> {
  const validIds = new Set(plants.map((plant) => plant.id));

  if (!USE_GEMINI_SEARCH) {
    const normalizedQuery = query.trim().toLowerCase();
    const directMatches = plants
      .filter((plant) =>
        `${plant.scientific_name} ${plant.common_names ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .map((plant) => plant.id);
    return { results: directMatches, suggestions: [], inSeason: [] };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new Error("Set GEMINI_KEY in the project-root .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.interactions.create({
    model: GEMINI_MODEL,
    input: JSON.stringify({
      query,
      currentMonth: month,
      availablePlants: plants.map(({ id, scientific_name, common_names }) => ({
        id,
        scientificName: scientific_name,
        commonNames: common_names,
      })),
    }),
    system_instruction:
      "You select plants from an edible-plant database for a search page. Return JSON arrays of database IDs only; every ID must be in availablePlants. results are the best direct matches for the user's query. suggestions are different, related plants. inSeason are different plants from the catalog that are plausibly in bloom or harvest this month in a temperate Northern Hemisphere climate. The month is approximate; do not claim certainty. Do not select a plant just because its family name or description contains a query word. Never repeat IDs between arrays. Return an empty array when nothing in the catalog is a reasonable match. Select at most 12 IDs per array.",
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: responseSchema,
    },
    generation_config: { max_output_tokens: 250 },
  });

  if (!response.output_text) {
    throw new Error("Gemini returned an empty search plan.");
  }

  const plan: unknown = JSON.parse(response.output_text);
  if (!plan || typeof plan !== "object") {
    throw new Error("Gemini returned an invalid search plan.");
  }

  const fields = plan as Record<string, unknown>;
  const results = cleanIds(fields.results, validIds);
  const resultIds = new Set(results);
  const suggestions = cleanIds(fields.suggestions, validIds).filter(
    (id) => !resultIds.has(id),
  );
  const usedIds = new Set([...resultIds, ...suggestions]);
  const inSeason = cleanIds(fields.inSeason, validIds).filter(
    (id) => !usedIds.has(id),
  );

  return { results, suggestions, inSeason };
}
