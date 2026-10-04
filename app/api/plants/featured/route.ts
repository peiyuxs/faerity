import {
  choosePlantOfHour,
  type PlantOfHourPick,
} from "@/lib/geminiPlantOfHour";
import { getPlantSearchCatalog, getPlantsByIds } from "@/lib/plantSearch";

const hourlyPicks = new Map<string, Promise<PlantOfHourPick>>();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedTimeZone = url.searchParams.get("timeZone") || "UTC";
    const timeZone = new Intl.DateTimeFormat("en-US", {
      timeZone: requestedTimeZone,
    }).resolvedOptions().timeZone;
    const now = new Date();
    const localHour = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now);
    const cacheKey = `${timeZone}:${localHour}`;
    let pickPromise = hourlyPicks.get(cacheKey);

    if (!pickPromise) {
      pickPromise = (async () => {
        const plants = await getPlantSearchCatalog();
        if (plants.length === 0) {
          throw new Error("No plants are available in the database.");
        }
        return choosePlantOfHour(now, timeZone, plants);
      })().catch((error: unknown) => {
        hourlyPicks.delete(cacheKey);
        throw error;
      });
      hourlyPicks.set(cacheKey, pickPromise);
      if (hourlyPicks.size > 100) {
        const oldestKey = hourlyPicks.keys().next().value;
        if (oldestKey) hourlyPicks.delete(oldestKey);
      }
    }

    const pick = await pickPromise;
    const [plant] = await getPlantsByIds([pick.plantId]);

    return Response.json(
      { plant: plant ?? null, reason: pick.reason },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load the Gemini plant of the hour:", error);
    return Response.json(
      {
        error: "Could not load the featured plant.",
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 },
    );
  }
}
