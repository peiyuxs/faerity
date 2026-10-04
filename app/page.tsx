'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
export default function Home() {

    const [searchQuery, setSearchQuery] = useState('');
 
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

  

  const slides = [

    { name: "Name", recipe: "This is the first slide content." },
    { name: "Name", recipe: "This is the second slide content." },
    { name: "Name", recipe: "This is the third slide content." },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Banner */}
      <header className="Banner bg-[#4e314f] text-white h-[100vh]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="fae h-[12vh]"></div>
          <h1 className="faerity text-5xl font-semibold" style={{ textAlign: 'center'}}>
            Faerity
          </h1>
          <p className="text-lg mt-4 text-center">Hey it's me, it's Faerity! I know everything . . .</p>
          <div className="SearchBar flex justify-center">
            <input
                id="searchInput"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
            />
          </div>
          <p className="text-lg mt-4 text-center">about plants</p>
        </div>
      </header>
      <div className="info">
        {/* Carousel */}
        <main className="max-w-6xl mx-auto px-4 py-10 flex-1">
          <h2 className="text-3xl font-bold mb-6 text-#EEC0F0">Popular Recipes</h2>

          <div className="carousel relative overflow-hidden">
            <div
              className="card flex transition-transform duration-500"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className="min-w-full bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold mb-2">{slide.name}</h3>
                  <p className="text-gray-600">{slide.recipe}</p>
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
      </div>
      {/* Footer */}
      <footer className="bg-[#4e314f] text-[#85b19b] py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Disclaimer: Please be wary of trying a new plant due to the potential risks involved.
            Some of these plants can be toxic or cause allergic reactions.</p>
        </div>
      </footer>
    </div>
  );
}
