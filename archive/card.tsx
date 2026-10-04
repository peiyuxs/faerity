"use client";

import { useState } from "react";
import type { Plant } from "@/lib/plants";

export default function Card({ plant }: { plant: Plant }) {
  const [expanded, setExpanded] = useState(false);
  const [trackedCount, setTrackedCount] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const clickCount =
    trackedCount === null
      ? plant.click_count
      : Math.max(plant.click_count, trackedCount);

  async function handleDetailsClick() {
    setExpanded((isExpanded) => !isExpanded);
    setError("");
    setPending(true);

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
      setTrackedCount(result.click_count);
      window.dispatchEvent(new Event("plant-clicked"));
    } catch (cause) {
      console.error("Could not record plant click:", cause);
      setError("Could not record this click. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg bg-light-green p-6 text-dark-green shadow">
      <div>
        <h3 className="text-3xl text-center text-white italic">
          {plant.common_names || plant.scientific_name}
        </h3>
        {plant.common_names && (
          <p className="mt-1 text-center text-sm italic text-white/80">
            {plant.scientific_name}
          </p>
        )}
      </div>

      <p className="text-sm">
        <span className="font-semibold">Family:</span> {plant.family || "Unknown"}
      </p>
      {plant.description && (
        <p className="text-sm leading-relaxed">
          {expanded || plant.description.length <= 180
            ? plant.description
            : `${plant.description.slice(0, 180).trimEnd()}...`}
        </p>
      )}
      {expanded &&
        (plant.edible_portion || plant.edible_uses || plant.found_in) && (
          <dl className="space-y-2 text-sm">
            {plant.edible_portion && (
              <div>
                <dt className="font-semibold">Edible portion</dt>
                <dd>{plant.edible_portion}</dd>
              </div>
            )}
            {plant.edible_uses && (
              <div>
                <dt className="font-semibold">Edible uses</dt>
                <dd>{plant.edible_uses}</dd>
              </div>
            )}
            {plant.found_in && (
              <div>
                <dt className="font-semibold">Found in</dt>
                <dd>{plant.found_in}</dd>
              </div>
            )}
          </dl>
        )}
      <p className="mt-auto text-sm font-semibold">
        {clickCount} {clickCount === 1 ? "click" : "clicks"}
      </p>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={handleDetailsClick}
        disabled={pending}
        className="w-full rounded-xl bg-light-pink p-2 text-center text-dark-green transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Saving..." : expanded ? "Show less" : "View details"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-white">
          {error}
        </p>
      )}
    </article>
  );
}
