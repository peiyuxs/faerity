<<<<<<< Updated upstream
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the{" "}
            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              page.tsx
            </code>{" "}
            file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
=======
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
>>>>>>> Stashed changes
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
