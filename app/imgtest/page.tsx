"use client";

import { useEffect, useState } from "react";

// paste the iNaturalist medium_url between the quotes below
const IMG_URL = "https://inaturalist-open-data.s3.amazonaws.com/photos/252786276/medium.jpg";

export default function ImgTest() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    const img = new Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("failed to load");
    img.src = IMG_URL;
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <p>
        Image status: <b>{status}</b>
      </p>
      <img src={IMG_URL} alt="test" width={300} />
    </main>
  );
}