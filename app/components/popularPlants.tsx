"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/card";
import type { Plant } from "@/lib/plants";

export default function PopularPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let currentRequest: AbortController | undefined;

    async function loadPopularPlants() {
      currentRequest?.abort();
      const controller = new AbortController();
      currentRequest = controller;

      try {
        const response = await fetch("/api/plants/popular", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Popular plants request failed: ${response.status}`);
        }

        const result: Plant[] = await response.json();
        if (active) {
          setPlants(result);
          setError("");
        }
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") {
          return;
        }
        console.error("Could not load popular plants:", cause);
        if (active) {
          setError("Popular plants could not be loaded.");
        }
      } finally {
        if (active && currentRequest === controller) {
          setLoading(false);
        }
      }
    }

    const onPlantClicked = () => {
      void loadPopularPlants();
    };

    void loadPopularPlants();
    window.addEventListener("plant-clicked", onPlantClicked);

    return () => {
      active = false;
      currentRequest?.abort();
      window.removeEventListener("plant-clicked", onPlantClicked);
    };
  }, []);

  return (
    <section aria-labelledby="popular-plants-title" className="py-10">
      <h2 id="popular-plants-title" className="mb-6 text-6xl sm:text-8xl">
        Popular Plants
      </h2>
      {loading && <p role="status">Loading popular plants...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && plants.length === 0 && (
        <p>No plants are available yet.</p>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plants.map((plant, index) => (
          <div key={plant.id} className="flex flex-col gap-2">
            <p className="text-xl" aria-label={`Rank ${index + 1}`}>
              #{index + 1}
            </p>
            <Card plant={plant} />
          </div>
        ))}
      </div>
    </section>
  );
}