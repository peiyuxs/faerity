"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/app/components/searchBar";
import type { Plant } from "@/lib/plants";

export default function PlantDetailView({ plant }: { plant: Plant }) {
  const [viewCount, setViewCount] = useState(plant.click_count);
  const [trackingError, setTrackingError] = useState("");
  const recorded = useRef(false);
  const name = plant.common_names?.trim() || plant.scientific_name;

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    async function recordView() {
      try {
        const response = await fetch("/api/plants/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plantId: plant.id }),
        });
        if (!response.ok) {
          throw new Error(`Click tracking failed with status ${response.status}`);
        }

        const result: { click_count: number } = await response.json();
        setViewCount(result.click_count);
        window.dispatchEvent(new Event("plant-clicked"));
      } catch (error) {
        console.error("Could not record plant view:", error);
        setTrackingError("View count could not be updated.");
      }
    }

    void recordView();
  }, [plant.id]);

  return (
    <div className="min-h-screen">
      <header className="Banner header-fade-in flex min-h-28 items-center gap-6 px-5 py-4 text-white sm:px-8">
        <Link href="/" aria-label="Faerity home" className="flex shrink-0 items-center gap-3">
          <span className="fae h-20 w-20" />
          <span className="faerity text-4xl text-pink">Faerity</span>
        </Link>
        <form action="/ask" method="get" className="SearchBar min-w-0 flex-1">
          <SearchBar placeholder="Search plants..." />
        </form>
      </header>

      <main className="page-fade-up mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 font-serif text-white sm:px-8 md:grid-cols-[minmax(16rem,0.8fr)_1.2fr] md:gap-12 md:py-12">
        <div
          role="img"
          aria-label={`Image placeholder for ${name}`}
          className="flex min-h-80 items-center justify-center rounded-xl bg-black/20 text-center text-light-green md:min-h-[34rem]"
        >
          Plant image coming soon
        </div>

        <article className="self-center">
          <h1 className="mb-5 text-5xl text-pink sm:text-7xl">{name}</h1>
          <dl className="space-y-3 text-xl leading-relaxed sm:text-2xl">
            <div>
              <dt className="inline font-semibold">Scientific Name: </dt>
              <dd className="inline italic">{plant.scientific_name}</dd>
            </div>
            {plant.common_names && (
              <div>
                <dt className="inline font-semibold">Common Names: </dt>
                <dd className="inline">{plant.common_names}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-semibold">Family: </dt>
              <dd className="inline">{plant.family || "Unknown"}</dd>
            </div>
            {plant.edible_portion && (
              <div>
                <dt className="inline font-semibold">Edible portion: </dt>
                <dd className="inline">{plant.edible_portion}</dd>
              </div>
            )}
            {plant.edible_uses && (
              <div>
                <dt className="inline font-semibold">Edible uses: </dt>
                <dd className="inline">{plant.edible_uses}</dd>
              </div>
            )}
            {plant.description && (
              <div>
                <dt className="inline font-semibold">Description: </dt>
                <dd className="inline">{plant.description}</dd>
              </div>
            )}
            {plant.found_in && (
              <div>
                <dt className="inline font-semibold">Found in: </dt>
                <dd className="inline">{plant.found_in}</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 text-lg">
            {viewCount} {viewCount === 1 ? "view" : "views"}
          </p>
          {trackingError && (
            <p role="status" className="mt-2 text-sm text-light-green">
              {trackingError}
            </p>
          )}
        </article>
      </main>
    </div>
  );
}
