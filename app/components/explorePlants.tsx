"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import PlantCard from "@/app/components/plantCard";
import type { Plant } from "@/lib/plants";

export default function ExplorePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let currentRequest: AbortController | undefined;

    async function loadPlants() {
      currentRequest?.abort();
      const controller = new AbortController();
      currentRequest = controller;

      try {
        const response = await fetch("/api/plants", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`All plants request failed: ${response.status}`);
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
        console.error("Could not load all plants:", cause);
        if (active) {
          setError("Plants could not be loaded.");
        }
      } finally {
        if (active && currentRequest === controller) {
          setLoading(false);
        }
      }
    }

    const onPlantClicked = () => {
      void loadPlants();
    };

    void loadPlants();
    window.addEventListener("plant-clicked", onPlantClicked);

    return () => {
      active = false;
      currentRequest?.abort();
      window.removeEventListener("plant-clicked", onPlantClicked);
    };
  }, []);

  return (
    <section aria-labelledby="explore-plants-title" className="py-10">
      <h2 id="explore-plants-title" className="mb-6 mt-10 text-5xl md:text-8xl">
        Explore All Plants
      </h2>
      {loading && <p role="status">Loading plants...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && plants.length === 0 && (
        <p>No plants are available yet.</p>
      )}
      {!loading && !error && plants.length > 0 && (
        <Marquee
          autoFill
          pauseOnHover
          speed={35}
          gradient={false}
          className="py-2"
        >
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </Marquee>
      )}
    </section>
  );
}
