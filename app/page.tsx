'use client';
import { useState } from "react";
export default function Home() {

  // Carousel  logic
  const slides = [
    { name: "Lorem ipsum", img: "https://cms.interiorcompany.com/wp-content/uploads/2024/01/blue-puya-unique-flowers.jpg"},
    { name: "Dolor amet", img: "https://images3.alphacoders.com/700/700973.jpg" },
    { name: "Sigma rizzler", img: "https://en.bcdn.biz/Images/2016/12/6/ed154ed8-77b5-4452-930c-ba42068e8116.jpg" },
    { name: "Lorem ipsum", img: "https://cms.interiorcompany.com/wp-content/uploads/2024/01/blue-puya-unique-flowers.jpg"},
    { name: "Dolor amet", img: "https://images3.alphacoders.com/700/700973.jpg" },
    { name: "Sigma rizzler", img: "https://en.bcdn.biz/Images/2016/12/6/ed154ed8-77b5-4452-930c-ba42068e8116.jpg" },
    { name: "Lorem ipsum", img: "https://cms.interiorcompany.com/wp-content/uploads/2024/01/blue-puya-unique-flowers.jpg"},
    { name: "Dolor amet", img: "https://images3.alphacoders.com/700/700973.jpg" },
    { name: "Sigma rizzler", img: "https://en.bcdn.biz/Images/2016/12/6/ed154ed8-77b5-4452-930c-ba42068e8116.jpg" },
  ];
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <header className="Banner text-white h-[100vh] flex flex-col justify-center">
        <div className="fae h-[35vh]"></div> {/* Image */}
        <h1 className="faerity text-[10rem] text-pink text-center leading-15">
          Faerity
        </h1>
        <div className="flex flex-col justify-center w-full">
          <p className="text-4xl font-serif text-center italic mt-10">
            Hey, it's me, it's Faerity! I know everything...
          </p>
          <div className="SearchBar flex justify-center py-5">
            <input className="h-[7vh] w-[75vw] font-serif text-dark-green"
              id="searchInput"
              type="text"
              placeholder="I know about a million things..."
            />
          </div>
          <p className="text-lg font-serif text-center italic pb-10">about plants</p>
        </div>
      </header>
      <div className="font-serif text-pink px-20">
        {/* Carousel */}
        <main className="py-10">
          <h2 className="text-8xl mb-6">Popular Plants</h2>
          <div className="carousel relative overflow-hidden">
            <button onClick={prev} aria-label="Previous plant" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border-y-[14px] border-y-transparent border-r-[20px] border-r-pink" />
            <button onClick={next} aria-label="Next plant" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border-y-[14px] border-y-transparent border-l-[20px] border-l-pink" />
            <div className="card flex flex-row gap-5 transition-transform duration-500"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className="flex flex-col p-12 gap-5 bg-light-green rounded-lg shadow">
                  <h3 className="text-4xl text-center text-white italic leading-10">{slide.name}</h3>
                  <img src={slide.img} className="h-50 w-40 object-cover" /> {/* Image */}
                  <button className="w-full bg-light-pink rounded-xl text-dark-green text-center p-2">Learn more</button>
                </div>
              ))}
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
