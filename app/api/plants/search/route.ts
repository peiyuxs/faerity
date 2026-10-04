import { makePlantSearchPlan } from "@/lib/geminiPlantSearch";
import { searchPlants } from "@/lib/plantSearch";

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
    const month = new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "UTC",
    }).format(new Date());
    const plan = await makePlantSearchPlan(query.trim(), month);
    const results = await searchPlants(plan.results);
    const suggestions = await searchPlants(
      plan.suggestions,
      results.map((plant) => plant.id),
    );
    const inSeason = await searchPlants(
      plan.inSeason,
      results.map((plant) => plant.id),
    );

    return Response.json({
      results,
      suggestions,
      inSeason,
      seasonNote: "Seasonality is inferred and may vary by location.",
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
