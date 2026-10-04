import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }


   // const interaction = await ai.interactions.create({
     // model: "gemini-3.5-flash-lite",
     // input: prompt,
    //});
    //return NextResponse.json({ result: interaction.output_text });
    const result = `Here's a recipe using ${prompt}:\n\n1. Wash and prepare the plant\n2. Sauté with garlic and olive oil\n3. Season to taste\n\n(This is a dummy response — Gemini is disabled to save credits)`;
    return NextResponse.json({ result });


  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}