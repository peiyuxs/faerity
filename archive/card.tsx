"use client";

import { useState } from "react";
import Image from "next/image";
import type { Plant } from "@/lib/plants";

function getThumbnailUrl(thumbnail: string | null): string | null {
  if (!thumbnail) {
    return null;
  }

  try {
    const url = new URL(thumbnail.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default function Card({ plant }: { plant: Plant }) {
  const [pending, setPending] = useState(false);
  const thumbnailUrl = getThumbnailUrl(plant.thumbnail);
  const commonName = plant.common_names?.trim() || "Common name unavailable";

  async function handleCardClick() {
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

      window.dispatchEvent(new Event("plant-clicked"));
    } catch (cause) {
      console.error("Could not record plant click:", cause);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={`Select ${commonName}`}
      onClick={handleCardClick}
      disabled={pending}
      className="flex h-full w-full flex-col items-center gap-3 rounded-lg bg-light-green p-5 text-center shadow transition hover:bg-[#788878] disabled:cursor-wait"
    >
      <span className="text-3xl italic text-white">{commonName}</span>
      <span className="text-sm italic text-white/80">
        {plant.scientific_name}
      </span>
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt=""
          width={800}
          height={500}
          unoptimized
          className="h-48 w-full rounded-lg object-cover"
        />
      )}
    </button>
  );
}
