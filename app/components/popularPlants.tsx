"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Marquee from "react-fast-marquee";
import PlantCard from "@/app/components/plantCard";
import type { Plant } from "@/lib/plants";

export default function PopularPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

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
      <h2 id="popular-plants-title" className="mb-6 text-5xl md:text-8xl">
        Popular Plants
      </h2>
      {loading && <p role="status">Loading popular plants...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && plants.length === 0 && (
        <p>No plants are available yet.</p>
      )}
      {!loading && !error && plants.length > 0 && (
        <>
          <div className="flex items-center gap-[2vw]">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous popular plant"
              className="shrink-0 cursor-pointer border-y-[14px] border-y-transparent border-r-[20px] border-r-pink"
            />
            <div
              ref={emblaRef}
              className="min-w-0 flex-1 overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Popular plants"
            >
              <div className="flex touch-pan-y">
                {plants.map((plant) => (
                  <div key={plant.id} className="shrink-0">
                    <PlantCard plant={plant} />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next popular plant"
              className="shrink-0 cursor-pointer border-y-[14px] border-y-transparent border-l-[20px] border-l-pink"
            />
          </div>
          <h2 className="mb-6 mt-10 text-5xl md:text-8xl">
            Explore All Plants
          </h2>
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
        </>
      )}
    </section>
  );
}