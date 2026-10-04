"use client";

import { ViewTransition } from "react";
import { useState } from "react";
import SearchHeader from "@/app/components/searchHeader";

export default function AskForm({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const [result, setResult] = useState(
    initialQuery.trim()
      ? `Dummy search result: your search for "${initialQuery.trim()}" was received.`
      : "",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    setResult(
      `Dummy search result: your search for "${input.trim()}" was received.`,
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ViewTransition enter="fade-in" exit="fade-in" default="none">
        <div className="header-fade-in">
          <SearchHeader
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </ViewTransition>
      <ViewTransition enter="fade-up" exit="fade-up" default="none">
        <main className="page-fade-up max-w-2xl mx-auto px-4 py-10 flex-1 w-full">
          {result && (
            <div
              role="status"
              className="mt-6 rounded-lg bg-white p-6 text-gray-700 shadow whitespace-pre-wrap"
            >
              {result}
            </div>
          )}
        </main>
      </ViewTransition>
    </div>
  );
}
