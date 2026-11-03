"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  { name: "red", value: "#da291c" },
  { name: "orange", value: "#f97316" },
  { name: "yellow", value: "#facc15" },
  { name: "green", value: "#16a34a" },
  { name: "blue", value: "#2563eb" },
  { name: "purple", value: "#7c3aed" },
  { name: "black", value: "#18181b" },
  { name: "white", value: "#ffffff" },
];

export function OtherBackend() {
  const frameRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef(COLORS[0].value);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const seededRef = useRef(false);
  const [color, setColor] = useState(COLORS[0].value);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const frame = frameRef.current;
    const view = viewRef.current;
    if (!frame || !view) return;

    const paint = document.createElement("canvas");
    paintRef.current = paint;
    const viewCtx = view.getContext("2d");
    const paintCtx = paint.getContext("2d");
    if (!viewCtx || !paintCtx) return;

    let width = 0;
    let height = 0;
    let fontSize = 120;

    const fontFamily = () => getComputedStyle(document.body).fontFamily;

    const mirrored = (
      ctx: CanvasRenderingContext2D,
      draw: (ctx: CanvasRenderingContext2D) => void,
    ) => {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(-1, 1);
      ctx.font = `900 ${fontSize}px ${fontFamily()}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      draw(ctx);
      ctx.restore();
    };

    const fitFont = () => {
      let size = height * 0.78;
      viewCtx.font = `900 ${size}px ${fontFamily()}`;
      const measured = viewCtx.measureText("END").width;
      if (measured > width * 0.92) size *= (width * 0.92) / measured;
      fontSize = size;
    };

    const eLocalCenter = () => {
      paintCtx.font = `900 ${fontSize}px ${fontFamily()}`;
      const endWidth = paintCtx.measureText("END").width;
      const eWidth = paintCtx.measureText("E").width;
      return -endWidth / 2 + eWidth / 2;
    };

    const paintBloom = (
      x: number,
      y: number,
      radius: number,
      color: string,
      alpha = 1,
    ) => {
      const glow = paintCtx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, color);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      paintCtx.globalAlpha = alpha;
      paintCtx.fillStyle = glow;
      paintCtx.beginPath();
      paintCtx.arc(x, y, radius, 0, Math.PI * 2);
      paintCtx.fill();
      paintCtx.globalAlpha = 1;
    };

    const seedE = () => {
      if (seededRef.current) return;

      const ex = width * 0.78;
      const top = height * 0.22;
      const mid = height * 0.5;
      const bottom = height * 0.78;
      const arm = width * 0.68;

      const sky = paintCtx.createLinearGradient(ex, top - 20, ex, bottom + 20);
      sky.addColorStop(0, "#fb7185");
      sky.addColorStop(0.35, "#fdba74");
      sky.addColorStop(0.7, "#fde68a");
      sky.addColorStop(1, "#bbf7d0");
      paintCtx.fillStyle = sky;
      paintCtx.fillRect(width * 0.55, height * 0.08, width * 0.42, height * 0.84);

      paintBloom(arm, top, fontSize * 0.22, "#f472b6", 0.95);
      paintBloom(ex - fontSize * 0.02, top + fontSize * 0.02, fontSize * 0.16, "#fb7185", 0.9);
      paintBloom(arm + fontSize * 0.04, mid, fontSize * 0.2, "#fdba74", 0.92);
      paintBloom(ex, mid - fontSize * 0.04, fontSize * 0.14, "#f9a8d4", 0.85);
      paintBloom(arm, bottom, fontSize * 0.24, "#86efac", 0.9);
      paintBloom(ex - fontSize * 0.06, bottom - fontSize * 0.02, fontSize * 0.18, "#fde68a", 0.88);
      paintBloom(ex + fontSize * 0.04, mid + fontSize * 0.12, fontSize * 0.12, "#c084fc", 0.7);
      paintBloom(arm + fontSize * 0.08, top + fontSize * 0.18, fontSize * 0.08, "#fef08a", 1);
      paintBloom(arm - fontSize * 0.02, bottom - fontSize * 0.16, fontSize * 0.07, "#fef9c3", 1);
      paintBloom(ex - fontSize * 0.1, mid + fontSize * 0.02, fontSize * 0.06, "#ffffff", 0.85);

      const mask = document.createElement("canvas");
      mask.width = paint.width;
      mask.height = paint.height;
      const maskCtx = mask.getContext("2d");
      if (!maskCtx) return;
      const ratio = window.devicePixelRatio || 1;
      maskCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      maskCtx.translate(width / 2, height / 2);
      maskCtx.scale(-1, 1);
      maskCtx.font = `900 ${fontSize}px ${fontFamily()}`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      maskCtx.fillStyle = "#000";
      maskCtx.fillText("E", eLocalCenter(), 0);

      paintCtx.globalCompositeOperation = "destination-in";
      paintCtx.setTransform(1, 0, 0, 1, 0, 0);
      paintCtx.drawImage(mask, 0, 0);
      paintCtx.globalCompositeOperation = "source-over";
      paintCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      seededRef.current = true;
    };

    const render = () => {
      viewCtx.setTransform(1, 0, 0, 1, 0, 0);
      viewCtx.clearRect(0, 0, view.width, view.height);
      viewCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      viewCtx.globalCompositeOperation = "source-over";
      viewCtx.fillStyle = "#ffffff";
      mirrored(viewCtx, (ctx) => ctx.fillText("END", 0, 0));
      viewCtx.globalCompositeOperation = "source-atop";
      viewCtx.drawImage(paint, 0, 0, width, height);
      viewCtx.globalCompositeOperation = "source-over";
      viewCtx.strokeStyle = "#18181b";
      viewCtx.lineWidth = Math.max(5, fontSize * 0.022);
      viewCtx.lineJoin = "round";
      mirrored(viewCtx, (ctx) => ctx.strokeText("END", 0, 0));
    };

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      const nextWidth = Math.max(1, rect.width);
      const nextHeight = Math.max(1, rect.height);
      const snapshot = document.createElement("canvas");
      snapshot.width = paint.width;
      snapshot.height = paint.height;
      snapshot.getContext("2d")?.drawImage(paint, 0, 0);

      width = nextWidth;
      height = nextHeight;
      const ratio = window.devicePixelRatio || 1;
      view.width = Math.round(width * ratio);
      view.height = Math.round(height * ratio);
      paint.width = Math.round(width * ratio);
      paint.height = Math.round(height * ratio);
      paintCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (snapshot.width > 0) {
        paintCtx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, width, height);
      }
      fitFont();
      if (!seededRef.current) seedE();
      render();
    };

    const stamp = (x: number, y: number) => {
      const radius = Math.max(16, fontSize * 0.07);
      paintCtx.fillStyle = colorRef.current;
      paintCtx.beginPath();
      paintCtx.arc(x, y, radius, 0, Math.PI * 2);
      paintCtx.fill();
    };

    const paintStroke = (x: number, y: number) => {
      const last = lastRef.current;
      if (!last) {
        stamp(x, y);
      } else {
        const distance = Math.hypot(x - last.x, y - last.y);
        const step = Math.max(4, fontSize * 0.02);
        const count = Math.max(1, Math.ceil(distance / step));
        for (let i = 1; i <= count; i += 1) {
          const t = i / count;
          stamp(last.x + (x - last.x) * t, last.y + (y - last.y) * t);
        }
      }
      lastRef.current = { x, y };
      render();
    };

    const localPoint = (event: PointerEvent) => {
      const rect = view.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onDown = (event: PointerEvent) => {
      drawingRef.current = true;
      lastRef.current = null;
      const point = localPoint(event);
      paintStroke(point.x, point.y);
    };

    const onMove = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      const point = localPoint(event);
      paintStroke(point.x, point.y);
    };

    const onUp = () => {
      drawingRef.current = false;
      lastRef.current = null;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    view.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) resize();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      view.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={frameRef}
        className="relative h-[min(68dvh,560px)] w-full overflow-hidden rounded-3xl shadow-[0_20px_70px_rgba(168,85,247,0.35)] ring-1 ring-fuchsia-300/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/other/backend-garden.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.28)_0%,transparent_55%),linear-gradient(to_bottom,rgba(236,72,153,0.12),transparent_40%,rgba(34,211,238,0.14))]" />
        <canvas
          ref={viewRef}
          className="relative z-10 h-full w-full touch-none cursor-crosshair"
        />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {COLORS.map((swatch) => (
          <button
            key={swatch.name}
            type="button"
            aria-label={swatch.name}
            aria-pressed={color === swatch.value}
            onClick={() => setColor(swatch.value)}
            className={[
              "h-8 w-8 cursor-pointer rounded-full border border-zinc-300 sm:h-9 sm:w-9",
              color === swatch.value ? "ring-2 ring-zinc-900 ring-offset-2" : "",
            ].join(" ")}
            style={{ backgroundColor: swatch.value }}
          />
        ))}
      </div>
    </div>
  );
}
