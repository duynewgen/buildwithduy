"use client";

import { useRef, useState } from "react";

const DEFAULT_URL = "www.duynewgen.com";

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

type UrlImage = {
  src: string;
  height: number;
};

function renderUrlImage(input: HTMLInputElement, text: string): UrlImage {
  const styles = getComputedStyle(input);
  const width = input.clientWidth;
  const height = input.clientHeight;
  const scale = 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return { src: "", height: input.offsetHeight };
  }

  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
  context.fillStyle = styles.color;
  context.textBaseline = "middle";
  context.fillText(text || " ", parseFloat(styles.paddingLeft), height / 2);

  return { src: canvas.toDataURL("image/png"), height: input.offsetHeight };
}

export function OtherUrlShortener() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [website, setWebsite] = useState(DEFAULT_URL);
  const [image, setImage] = useState<UrlImage | null>(null);
  const [width, setWidth] = useState(0);

  function shorten() {
    const input = inputRef.current;
    if (!image && input) {
      const next = renderUrlImage(input, website);
      const full = input.offsetWidth;
      setImage(next);
      setWidth(full);
      window.setTimeout(() => setWidth(Math.round(full * 0.28)), 40);
      return;
    }

    setWidth((current) => Math.max(48, Math.round(current * 0.7)));
  }

  return (
    <div className="w-full max-w-md text-red-950" style={scrappyFont}>
      <p className="text-3xl text-red-700">URL Shortener</p>

      <label className="mt-5 block text-xl" htmlFor="website">
        Put your website
        {image ? (
          <div
            className="mt-1 overflow-hidden border-2 border-orange-600 bg-white transition-[width] duration-[1500ms] ease-out"
            style={{ width, height: image.height }}
          >
            <img
              src={image.src}
              alt={website}
              className="h-full w-full object-fill"
            />
          </div>
        ) : (
          <input
            id="website"
            ref={inputRef}
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="mt-1 w-full border-2 border-orange-600 bg-white px-2 py-2 text-xl text-red-950 outline-none"
            style={scrappyFont}
          />
        )}
      </label>

      <button
        type="button"
        onClick={shorten}
        className="mt-4 cursor-pointer border-2 border-red-900 bg-red-600 px-4 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Shorten
      </button>
    </div>
  );
}
