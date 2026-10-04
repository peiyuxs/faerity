import { GoogleGenAI } from "@google/genai";
import type { PlantSearchCandidate } from "@/lib/plantSearch";

const MODEL = "gemini-3.5-flash-lite";

export type PlantOfHourPick = {
  plantId: number;
  reason: string;
};

const responseSchema = {
  type: "object",
  properties: {
    plantId: { type: "integer" },
    reason: { type: "string" },
  },
  required: ["plantId", "reason"],
};

export async function choosePlantOfHour(
  date: Date,
  timeZone: string,
  plants: PlantSearchCandidate[],
): Promise<PlantOfHourPick> {
  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new Error("Set GEMINI_KEY in the project-root .env file.");
  }

  const localDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  }).format(date);
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.interactions.create({
    model: MODEL,
    input: JSON.stringify({
      localDateAndTime: localDate,
      timeZone,
      availablePlants: plants.map(({ id, scientific_name, common_names }) => ({
        id,
        scientificName: scientific_name,
        commonNames: common_names,
      })),
    }),
    system_instruction:
      "Choose one plant from availablePlants as the plant of the hour. Consider the local date, season, day of week, time of day, and a relevant nearby holiday or cultural symbolism when appropriate. Pick a plant actually present in the list. Write a warm, engaging explanation close to 140 words, describing why this plant suits this hour and time of year. Ground the explanation in general seasonal, symbolic, or cultural context. Do not invent specific botanical facts or holidays. You do not have live weather data: never claim actual weather or current local conditions. If no holiday is relevant, focus on seasonal or symbolic context. Return JSON only, with plantId and reason.",
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: responseSchema,
    },
    generation_config: { max_output_tokens: 300 },
  });

  if (!response.output_text) {
    throw new Error("Gemini returned an empty plant-of-the-hour pick.");
  }

  const parsed: unknown = JSON.parse(response.output_text);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini returned an invalid plant-of-the-hour pick.");
  }

  const pick = parsed as Record<string, unknown>;
  if (
    typeof pick.plantId !== "number" ||
    !plants.some((plant) => plant.id === pick.plantId) ||
    typeof pick.reason !== "string" ||
    pick.reason.trim().length < 10
  ) {
    throw new Error("Gemini returned an incomplete plant-of-the-hour pick.");
  }

  return { plantId: pick.plantId, reason: pick.reason.trim().slice(0, 1600) };
}
