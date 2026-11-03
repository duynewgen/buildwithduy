"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Brush,
  Circle,
  Eraser,
  PaintBucket,
  Pencil,
  Pipette,
  Slash,
  Square,
  Type,
} from "lucide-react";

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

const MENUS = ["File", "Edit", "View", "Image", "Colors", "Help"];

const TOOLS = [
  { name: "free-form select", icon: Slash },
  { name: "select", icon: Square },
  { name: "eraser", icon: Eraser },
  { name: "fill", icon: PaintBucket },
  { name: "eyedropper", icon: Pipette },
  { name: "magnifier", icon: Circle },
  { name: "pencil", icon: Pencil },
  { name: "brush", icon: Brush },
  { name: "airbrush", icon: Circle },
  { name: "text", icon: Type },
  { name: "line", icon: Slash },
  { name: "curve", icon: Slash },
  { name: "rectangle", icon: Square },
  { name: "polygon", icon: Square },
  { name: "ellipse", icon: Circle },
  { name: "rounded rectangle", icon: Square },
] as const;

const raised =
  "border border-[#808080] border-r-[#ffffff] border-b-[#ffffff] shadow-[inset_1px_1px_0_#ffffff]";
const sunken =
  "border border-[#ffffff] border-r-[#808080] border-b-[#808080] shadow-[inset_1px_1px_0_#808080]";

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const PROJECT_FILE = "backend.sql";

function BackendPaint({ onClose }: { onClose: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef(COLORS[0].value);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const seededRef = useRef(false);
  const [color, setColor] = useState(COLORS[0].value);
  const [tool, setTool] = useState("brush");

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      let size = height * 0.68;
      viewCtx.font = `900 ${size}px ${fontFamily()}`;
      const measured = viewCtx.measureText("END").width;
      if (measured > width * 0.86) size *= (width * 0.86) / measured;
      fontSize = size;
    };

    const letterLocalCenter = (letter: "E" | "N" | "D") => {
      paintCtx.font = `900 ${fontSize}px ${fontFamily()}`;
      const endWidth = paintCtx.measureText("END").width;
      const eWidth = paintCtx.measureText("E").width;
      const nWidth = paintCtx.measureText("N").width;
      const dWidth = paintCtx.measureText("D").width;
      if (letter === "E") return -endWidth / 2 + eWidth / 2;
      if (letter === "N") return -endWidth / 2 + eWidth + nWidth / 2;
      return -endWidth / 2 + eWidth + nWidth + dWidth / 2;
    };

    const scribble = (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      colors: string[],
    ) => {
      for (let i = 0; i < 64; i += 1) {
        const fill = colors[Math.floor(Math.random() * colors.length)]!;
        const x = x0 + Math.random() * (x1 - x0);
        const y = y0 + Math.random() * (y1 - y0);
        const radius = fontSize * (0.05 + Math.random() * 0.16);
        ctx.fillStyle = fill;
        ctx.beginPath();
        if (Math.random() > 0.4) {
          ctx.ellipse(
            x,
            y,
            radius,
            radius * (0.3 + Math.random() * 0.75),
            Math.random() * Math.PI,
            0,
            Math.PI * 2,
          );
        } else {
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      for (let i = 0; i < 10; i += 1) {
        const stroke = colors[Math.floor(Math.random() * colors.length)]!;
        const x = x0 + Math.random() * (x1 - x0);
        const y = y0 + Math.random() * (y1 - y0);
        const dx = (Math.random() - 0.5) * fontSize * 0.55;
        const dy = (Math.random() - 0.5) * fontSize * 0.55;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = fontSize * (0.04 + Math.random() * 0.08);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + dx * 0.4 + (Math.random() - 0.5) * fontSize * 0.2,
          y + dy * 0.2 + (Math.random() - 0.5) * fontSize * 0.2,
          x + dx,
          y + dy,
        );
        ctx.stroke();
      }
    };

    const seedLetter = (letter: "E" | "N" | "D", colors: string[], x0: number, x1: number) => {
      const ratio = window.devicePixelRatio || 1;
      const layer = document.createElement("canvas");
      layer.width = paint.width;
      layer.height = paint.height;
      const layerCtx = layer.getContext("2d");
      if (!layerCtx) return;

      layerCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      scribble(layerCtx, x0, height * 0.08, x1, height * 0.92, colors);

      const mask = document.createElement("canvas");
      mask.width = paint.width;
      mask.height = paint.height;
      const maskCtx = mask.getContext("2d");
      if (!maskCtx) return;
      maskCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      maskCtx.translate(width / 2, height / 2);
      maskCtx.scale(-1, 1);
      maskCtx.font = `900 ${fontSize}px ${fontFamily()}`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      maskCtx.fillStyle = "#000";
      maskCtx.fillText(letter, letterLocalCenter(letter), 0);

      layerCtx.globalCompositeOperation = "destination-in";
      layerCtx.setTransform(1, 0, 0, 1, 0, 0);
      layerCtx.drawImage(mask, 0, 0);

      paintCtx.setTransform(1, 0, 0, 1, 0, 0);
      paintCtx.drawImage(layer, 0, 0);
      paintCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const seedLetters = () => {
      if (seededRef.current) return;
      seedLetter("D", ["#f97316", "#16a34a", "#7c3aed"], width * 0.02, width * 0.38);
      seedLetter("N", ["#da291c", "#f97316", "#facc15"], width * 0.34, width * 0.66);
      seedLetter("E", ["#16a34a", "#2563eb", "#7c3aed"], width * 0.62, width * 0.98);
      seededRef.current = true;
    };

    const render = () => {
      const ratio = window.devicePixelRatio || 1;
      const depth = Math.max(2, Math.round(fontSize * 0.016));
      const stepX = fontSize * 0.01;
      const stepY = fontSize * 0.012;

      viewCtx.setTransform(1, 0, 0, 1, 0, 0);
      viewCtx.clearRect(0, 0, view.width, view.height);
      viewCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      viewCtx.globalCompositeOperation = "source-over";

      // chunky extrusion behind the mirrored word (reads down-right on screen)
      for (let i = depth; i >= 1; i -= 1) {
        const t = i / depth;
        const shade = Math.round(28 + t * 78);
        viewCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
        mirrored(viewCtx, (ctx) => ctx.fillText("END", i * stepX, -i * stepY));
      }

      // paint only the front face so the sides stay solid 3d
      const face = document.createElement("canvas");
      face.width = view.width;
      face.height = view.height;
      const faceCtx = face.getContext("2d");
      if (faceCtx) {
        faceCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
        faceCtx.fillStyle = "#ffffff";
        faceCtx.save();
        faceCtx.translate(width / 2, height / 2);
        faceCtx.scale(-1, 1);
        faceCtx.font = `900 ${fontSize}px ${fontFamily()}`;
        faceCtx.textAlign = "center";
        faceCtx.textBaseline = "middle";
        faceCtx.fillText("END", 0, 0);
        faceCtx.restore();
        faceCtx.globalCompositeOperation = "source-atop";
        faceCtx.drawImage(paint, 0, 0, width, height);
        viewCtx.drawImage(face, 0, 0, width, height);
      }

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
      if (!seededRef.current) seedLetters();
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
    <div
      className="flex h-full min-h-0 w-full flex-col"
      style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}
    >
      <div className={`flex h-full min-h-0 w-full flex-col bg-[#c0c0c0] p-0.5 ${raised}`}>
        <div className="flex items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-1.5 py-1 text-white">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center bg-[#c0c0c0] text-[9px] text-black">
              ✏
            </span>
            <p className="truncate text-[13px] font-bold tracking-tight">backend - Paint</p>
          </div>
          <div className="flex shrink-0 gap-0.5">
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center bg-[#c0c0c0] text-[11px] leading-none text-black ${raised}`}
            >
              _
            </span>
            <span
              className={`flex h-[18px] w-[18px] items-center justify-center bg-[#c0c0c0] text-[11px] leading-none text-black ${raised}`}
            >
              □
            </span>
            <button
              type="button"
              aria-label="close"
              onClick={onClose}
              className={`flex h-[18px] w-[18px] cursor-pointer items-center justify-center bg-[#c0c0c0] text-[11px] leading-none text-black ${raised}`}
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex gap-3 border-b border-[#808080] px-2 py-0.5 text-[12px] text-black">
          {MENUS.map((menu) => (
            <span key={menu}>
              <span className="underline">{menu[0]}</span>
              {menu.slice(1)}
            </span>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 gap-1 p-1">
          <div className={`flex w-[58px] shrink-0 flex-col gap-1 bg-[#c0c0c0] p-1 ${sunken}`}>
            <div className="grid grid-cols-2 gap-0.5">
              {TOOLS.map((item) => {
                const Icon = item.icon;
                const selected = item.name === tool;
                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={item.name}
                    aria-pressed={selected}
                    onClick={() => setTool(item.name)}
                    className={`flex h-7 w-7 items-center justify-center bg-[#c0c0c0] text-black ${
                      selected ? sunken : raised
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                );
              })}
            </div>
            <div className={`mt-1 flex flex-1 items-end justify-center p-1 ${sunken}`}>
              <div className="mb-1 flex items-end gap-0.5">
                {[4, 7, 10].map((size) => (
                  <span
                    key={size}
                    className="rounded-full bg-black"
                    style={{ width: size, height: size }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`flex min-h-0 min-w-0 flex-1 bg-[#808080] p-2 ${sunken}`}>
            <div
              ref={frameRef}
              className={`relative h-full min-h-0 w-full flex-1 overflow-hidden bg-white ${raised}`}
            >
              <canvas
                ref={viewRef}
                className="relative h-full w-full touch-none cursor-crosshair"
              />
            </div>
          </div>
        </div>

        <div className={`mx-1 mb-1 flex items-center gap-3 bg-[#c0c0c0] px-2 py-1.5 ${sunken}`}>
          <div className={`relative h-10 w-10 shrink-0 bg-[#c0c0c0] ${sunken}`}>
            <span
              className={`absolute left-1 top-1 h-5 w-5 border border-black ${raised}`}
              style={{ backgroundColor: color }}
            />
            <span
              className={`absolute bottom-1 right-1 h-5 w-5 border border-black bg-white ${raised}`}
            />
          </div>
          <div className="grid grid-cols-8 gap-0.5">
            {COLORS.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                aria-label={swatch.name}
                aria-pressed={color === swatch.value}
                onClick={() => setColor(swatch.value)}
                className={`h-5 w-5 cursor-pointer border border-black ${
                  color === swatch.value ? "outline outline-1 outline-offset-1 outline-black" : ""
                }`}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>
        </div>

        <div
          className={`mx-1 mb-1 flex items-center justify-between px-2 py-0.5 text-[11px] text-black ${sunken}`}
        >
          <span>For Help, click Help Topics on the Help Menu.</span>
          <span>{COLORS.find((swatch) => swatch.value === color)?.name}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectPreview() {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-xs justify-center border-2 border-orange-600 bg-white p-6">
      <svg viewBox="0 0 72 88" className="h-28 w-24" aria-hidden>
        <path
          d="M12 4h34l18 18v58a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
          fill="#ffffff"
          stroke="#d4d4d8"
          strokeWidth="2"
        />
        <path d="M46 4v14a4 4 0 0 0 4 4h14" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="2" />
        <rect x="10" y="48" width="52" height="22" rx="3" fill="#e11d48" />
        <text
          x="36"
          y="64"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Rubik, sans-serif"
          fontSize="14"
          fontWeight="700"
        >
          PDF
        </text>
        <path d="M18 18h22M18 28h28M18 38h24" stroke="#d4d4d8" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function OtherBackend() {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">Backend design assignment</p>

      <ProjectPreview />
      <p className="mt-3 text-base break-all">{PROJECT_FILE}</p>

      <button
        type="button"
        onClick={() => setOpened(true)}
        className="mt-4 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Open submission
      </button>

      {mounted && opened
        ? createPortal(
            <div className="fixed inset-0 z-[100] bg-white">
              <BackendPaint onClose={() => setOpened(false)} />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
