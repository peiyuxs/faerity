"use client";

import { useEffect, useState } from "react";
import PlantCard from "@/app/components/plantCard";
import type { Plant } from "@/lib/plants";

export default function PlantOfHour() {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout>;

    async function loadFeaturedPlant() {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await fetch(
          `/api/plants/featured?timeZone=${encodeURIComponent(timeZone)}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error(`Featured plant request failed: ${response.status}`);
        }

        const result: { plant: Plant | null; reason: string } =
          await response.json();
        if (!cancelled) {
          setPlant(result.plant);
          setReason(result.reason);
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

      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 100);
      const untilNextHour = nextHour.getTime() - Date.now();
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
      {loading && <p role="status">Deciding on the current hour's plant...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && !plant && <p>No plants are available yet.</p>}
      {plant && (
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
          <PlantCard plant={plant} />
          <div className="max-w-2xl">
            <h3 className="text-4xl text-pink">
              {plant.common_names || plant.scientific_name}
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-white">{reason}</p>
          </div>
        </div>
      )}
    </section>
  );
}