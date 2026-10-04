"use client";

import { useEffect, useState } from "react";
import PlantCard from "@/app/components/plantCard";
import type { Plant } from "@/lib/plants";

const HOUR_MS = 60 * 60 * 1000;

export default function PlantOfHour() {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout>;

    async function loadFeaturedPlant() {
      try {
        const response = await fetch("/api/plants/featured", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Featured plant request failed: ${response.status}`);
        }

        const result: { plant: Plant | null } = await response.json();
        if (!cancelled) {
          setPlant(result.plant);
          setError("");
        }
      } catch (cause) {
        console.error("Could not load the featured plant:", cause);
        if (!cancelled) {
          setError("The featured plant could not be loaded.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    function scheduleRefresh() {
      if (cancelled) {
        return;
      }

      const untilNextHour = HOUR_MS - (Date.now() % HOUR_MS) + 100;
      refreshTimer = setTimeout(() => {
        void loadFeaturedPlant().then(scheduleRefresh);
      }, untilNextHour);
    }

    void loadFeaturedPlant();
    scheduleRefresh();

    return () => {
      cancelled = true;
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <section aria-labelledby="plant-of-hour-title" className="py-10">
      <h2 id="plant-of-hour-title" className="mb-6 text-6xl sm:text-8xl">
        Plant of the Hour
      </h2>
      {loading && <p role="status">Finding tohour&apos;s plant...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && !plant && <p>No plants are available yet.</p>}
      {plant && (
        <div className="flex justify-center">
          <PlantCard plant={plant} />
        </div>
      )}
    </section>
  );
}