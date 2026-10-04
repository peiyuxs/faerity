import { makePlantSearchPlan } from "@/lib/geminiPlantSearch";
import { getPlantSearchCatalog, getPlantsByIds } from "@/lib/plantSearch";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const query =
    body && typeof body === "object" && "query" in body
      ? body.query
      : undefined;

  if (typeof query !== "string" || !query.trim() || query.length > 250) {
    return Response.json(
      { error: "Enter a search between 1 and 250 characters." },
      { status: 400 },
    );
  }

  try {
    const plants = await getPlantSearchCatalog();
    const month = new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "UTC",
    }).format(new Date());
    const plan = await makePlantSearchPlan(
      query.trim(),
      month,
      plants,
    );
    const [results, suggestions, inSeason] = await Promise.all([
      getPlantsByIds(plan.results),
      getPlantsByIds(plan.suggestions),
      getPlantsByIds(plan.inSeason),
    ]);

    return Response.json({
      results,
      suggestions,
      inSeason,
      seasonNote: "Seasonality is an estimate for a temperate Northern Hemisphere climate.",
    });
  } catch (error) {
    console.error("Plant search failed:", error);
    return Response.json(
      {
        error: "Plant search failed. Please try again.",
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 },
    );
  }
}
