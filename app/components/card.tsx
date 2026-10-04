'use client'; // Enables client-side onInteraction interactions

import { useState } from "react";

/* .card {
  margin: 2vh;
  margin-right: 3vh;
  background-color: #85b19b;
  color: #EEC0F0;
} */

// Carousel  logic
const slides = [
    { name: "Name", recipe: "This is the first slide content." },
    { name: "Name", recipe: "This is the second slide content." },
    { name: "Name", recipe: "This is the third slide content." },
];
const [index, setIndex] = useState(0);
const next = () => setIndex((index + 1) % slides.length);
const prev = () => setIndex((index - 1 + slides.length) % slides.length);

export default function SearchBar() {
    return (
        slides.map((slide, i) => (
            <div key={i} className="min-w-full bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">{slide.name}</h3>
                <p className="text-gray-600">{slide.recipe}</p>
            </div>
        ))
    );
}