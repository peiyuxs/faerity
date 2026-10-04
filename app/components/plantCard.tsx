"use client";

import Link from "next/link";
import type { Plant } from "@/lib/plants";

export default function PlantCard({
  plant,
  animate = true,
}: {
  plant: Plant;
  animate?: boolean;
}) {
  return (
    <article className={`${animate ? "card-fade-up " : ""}mx-5 flex h-60 w-40 flex-col gap-4 overflow-hidden rounded-xl bg-light-green p-6 text-dark-green shadow`}>
      <Link
        href={`/plants/${plant.id}`}
        className="flex min-h-0 flex-1 flex-col overflow-hidden text-white"
        aria-label={`View details for ${plant.common_names || plant.scientific_name}`}
      >
        <h3 className="text-center text-xl leading-6 italic">
          {plant.common_names || plant.scientific_name}
        </h3>
        {plant.common_names && (
          <p className="mt-1 text-center text-sm italic text-white/80">
            {plant.scientific_name}
          </p>
        )}
        <p className="mt-3 text-sm">
          <span className="font-semibold">Family:</span>{" "}
          {plant.family || "Unknown"}
        </p>
        {plant.description && (
          <p className="mt-2 overflow-hidden text-sm leading-relaxed">
            {plant.description.slice(0, 130).trimEnd()}
            {plant.description.length > 130 ? "..." : ""}
          </p>
        )}
      </Link>
      <p className="shrink-0 text-sm font-semibold text-white">
        {plant.click_count} {plant.click_count === 1 ? "view" : "views"}
      </p>
      <Link
        href={`/plants/${plant.id}`}
        className="mt-auto w-full shrink-0 rounded-xl bg-light-pink p-1 text-center text-sm text-dark-green transition hover:bg-white"
      >
        View details
      </Link>
    </article>
  );
}
