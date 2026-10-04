"use client";

import { useState } from "react";

export default function AskPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResult(data.error ? `Error: ${data.error}` : data.result);
    } catch {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-[#4e314f] text-white py-10">
        <h1 className="text-2xl font-semibold text-center">Ask Faerity</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1 w-full">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Give me a recipe using dandelion greens"
            className="w-full p-3 rounded border border-gray-300 text-gray-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Ask Gemini"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white rounded-lg shadow p-6 text-gray-700 whitespace-pre-wrap">
            {result}
          </div>
        )}
      </main>
    </div>
  );
}