"use client";

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
      <SearchHeader
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
      <main className="max-w-2xl mx-auto px-4 py-10 flex-1 w-full">
        {result && (
          <div
            role="status"
            className="mt-6 rounded-lg bg-white p-6 text-gray-700 shadow whitespace-pre-wrap"
          >
            {result}
          </div>
        )}
      </main>
    </div>
  );
}
