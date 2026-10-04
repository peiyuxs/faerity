"use client";

import { useState } from "react";
import PlantCard from "@/app/components/plantCard";
import type { Plant } from "@/lib/plants";

const PAGE_SIZE = 8;

export default function PlantResultsSection({
  title,
  plants,
  note,
}: {
  title: string;
  plants: Plant[];
  note?: string;
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(plants.length / PAGE_SIZE);
  const visiblePlants = plants.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="mt-12">
      <h2 className="text-6xl">{title}</h2>
      {note && <p className="mt-1 text-sm text-dark-green/70">{note}</p>}
      {plants.length === 0 ? (
        <p className="mt-4 text-pink/80">No matching plants found.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 justify-items-center gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {visiblePlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
          {pageCount > 1 && (
            <nav
              aria-label={`${title} pages`}
              className="mt-8 flex items-center justify-center gap-3 text-dark-green"
            >
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 0}
                onClick={() => setPage((current) => current - 1)}
                className="text-2xl text-pink disabled:opacity-35"
              >
                &#9664;
              </button>
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-current={page === index ? "page" : undefined}
                  onClick={() => setPage(index)}
                  className={`min-w-8 rounded-full px-2 py-1 ${
                    page === index ? "bg-light-pink font-bold" : "hover:bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={page === pageCount - 1}
                onClick={() => setPage((current) => current + 1)}
                className="text-2xl text-pink disabled:opacity-35"
              >
                &#9654;
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
