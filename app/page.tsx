'use client';
import Image from "next/image";
import { useState } from "react";
export default function Home() {

  const slides = [
    { title: "Slide 1", text: "This is the first slide content." },
    { title: "Slide 2", text: "This is the second slide content." },
    { title: "Slide 3", text: "This is the third slide content." },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Banner */}
      <header className="bg-[#4e314f] text-white py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-2xl font-semibold" style={{color: 'var(--foreground)', textAlign: 'center'}}>
            Faerity
          </h1>
        </div>
      </header>

      {/* Carousel */}
      <main className="max-w-6xl mx-auto px-4 py-10 flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Popular Recipes</h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="min-w-full bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                <p className="text-gray-600">{slide.text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={prev}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Prev
            </button>
            <button
              onClick={next}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Disclaimer: Please be wary of trying a new plant due to the potential risks involved.
            Some of these plants can be toxic or cause allergic reactions.</p>
        </div>
      </footer>
    </div>
  );
}
