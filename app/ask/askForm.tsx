"use client";

import { ViewTransition } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchHeader from "@/app/components/searchHeader";
import type { Plant } from "@/lib/plants";
import PlantResultsSection from "./plantResultsSection";

type SearchResponse = {
  results: Plant[];
  suggestions: Plant[];
  inSeason: Plant[];
  seasonNote: string;
};

type SearchErrorResponse = {
  error?: string;
  details?: string;
};

export default function AskForm({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null,
  );
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVersion, setSearchVersion] = useState(0);
  const controller = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (query: string) => {
    controller.current?.abort();
    const nextController = new AbortController();
    controller.current = nextController;
    setSubmittedQuery(query.trim());
    setSearchResults(null);
    setError("");
    setLoading(true);
    setSearchVersion((version) => version + 1);

    try {
      const response = await fetch("/api/plants/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: nextController.signal,
      });
      const data = (await response.json()) as SearchResponse | SearchErrorResponse;
      if (!response.ok) {
        const apiError = data as SearchErrorResponse;
        throw new Error(apiError.details || apiError.error);
      }
      setSearchResults(data as SearchResponse);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      console.error("Could not search plants:", cause);
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Plant search failed. Please try again.",
      );
    } finally {
      if (!nextController.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialQuery.trim()) return;
    const timer = setTimeout(() => void runSearch(initialQuery), 0);
    return () => clearTimeout(timer);
  }, [initialQuery, runSearch]);

  useEffect(() => () => controller.current?.abort(), []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim()) void runSearch(input);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ViewTransition enter="fade-in" exit="fade-in" default="none">
        <div className="header-fade-in">
          <SearchHeader value={input} onChange={setInput} onSubmit={handleSubmit} />
        </div>
      </ViewTransition>
      <ViewTransition enter="fade-up" exit="fade-up" default="none">
        <main className="page-fade-up w-full max-w-6xl flex-1 px-4 py-10 mx-auto font-serif text-pink">
          {submittedQuery && (
            <h1 className="text-3xl">
              Results for &ldquo;{submittedQuery}&rdquo;
            </h1>
          )}
          {loading && (
            <p role="status" className="mt-6">
              Finding plants...
            </p>
          )}
          {error && (
            <p role="alert" className="mt-6">
              {error}
            </p>
          )}
          {searchResults && (
            searchResults.results.length === 0 &&
            searchResults.suggestions.length === 0 &&
            searchResults.inSeason.length === 0 ? (
              <p className="mt-6 text-light-green">No results</p>
            ) : (
              <>
                <PlantResultsSection
                  key={`${searchVersion}-results`}
                  title="Search results"
                  plants={searchResults.results}
                />
                <PlantResultsSection
                  key={`${searchVersion}-suggestions`}
                  title="You may also like..."
                  plants={searchResults.suggestions}
                />
                <PlantResultsSection
                  key={`${searchVersion}-in-season`}
                  title="In season"
                  plants={searchResults.inSeason}
                  note={searchResults.seasonNote}
                />
              </>
            )
          )}
        </main>
      </ViewTransition>
    </div>
  );
}
