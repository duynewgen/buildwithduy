"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

const PROJECT_FILE = "backend.sql";
const HOLD_MS = 180;
const FLIP_MS = 700;
const MODAL_MS = 220;

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#14532d";
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.beginPath();
  ctx.moveTo(-size * 0.7, 0);
  ctx.lineTo(size * 0.7, 0);
  ctx.stroke();
  ctx.restore();
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  petal: string,
  center: string,
  petals = 6,
) {
  for (let i = 0; i < petals; i += 1) {
    const angle = (i / petals) * Math.PI * 2;
    const px = x + Math.cos(angle) * size * 0.42;
    const py = y + Math.sin(angle) * size * 0.42;
    ctx.fillStyle = petal;
    ctx.beginPath();
    ctx.ellipse(px, py, size * 0.42, size * 0.22, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x - size * 0.06, y - size * 0.06, size * 0.06, 0, Math.PI * 2);
  ctx.fill();
}

function drawBud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.55, size * 0.8, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(x - size * 0.35, y + size * 0.2, size * 0.35, size * 0.18, 0.8, 0, Math.PI * 2);
  ctx.fill();
}

function BackendDesign({
  onClose,
  onReady,
}: {
  onClose: () => void;
  onReady?: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef(COLORS[0].value);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const seededRef = useRef(false);
  const flippedRef = useRef(false);
  const readySentRef = useRef(false);
  const renderBackRef = useRef<(() => void) | null>(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    flippedRef.current = flipped;
  }, [flipped]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const hold = window.setTimeout(() => setFlipped(true), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, []);

  useEffect(() => {
    if (!flipped) return;
    const done = window.setTimeout(() => {
      if (!readySentRef.current) {
        readySentRef.current = true;
        onReady?.();
      }
    }, FLIP_MS);
    return () => window.clearTimeout(done);
  }, [flipped, onReady]);

  useEffect(() => {
    const frame = frameRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!frame || !front || !back) return;

    const paint = document.createElement("canvas");
    paintRef.current = paint;
    const frontCtx = front.getContext("2d");
    const backCtx = back.getContext("2d");
    const paintCtx = paint.getContext("2d");
    if (!frontCtx || !backCtx || !paintCtx) return;

    let width = 0;
    let height = 0;
    let fontSize = 120;

    const fontFamily = () => getComputedStyle(document.body).fontFamily;

    const withWord = (
      ctx: CanvasRenderingContext2D,
      mirror: boolean,
      draw: (ctx: CanvasRenderingContext2D) => void,
    ) => {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      if (mirror) ctx.scale(-1, 1);
      ctx.font = `900 ${fontSize}px ${fontFamily()}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      draw(ctx);
      ctx.restore();
    };

    const fitFont = () => {
      let size = height * 0.7;
      frontCtx.font = `900 ${size}px ${fontFamily()}`;
      const measured = frontCtx.measureText("END").width;
      if (measured > width * 0.88) size *= (width * 0.88) / measured;
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

    const paintLetterGarden = (
      letter: "E" | "N" | "D",
      layout: (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => void,
    ) => {
      const ratio = window.devicePixelRatio || 1;
      const layer = document.createElement("canvas");
      layer.width = paint.width;
      layer.height = paint.height;
      const layerCtx = layer.getContext("2d");
      if (!layerCtx) return;

      layerCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layout(layerCtx, width / 2, height / 2, fontSize);

      const mask = document.createElement("canvas");
      mask.width = paint.width;
      mask.height = paint.height;
      const maskCtx = mask.getContext("2d");
      if (!maskCtx) return;
      maskCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      maskCtx.translate(width / 2, height / 2);
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

      paintLetterGarden("E", (ctx, cx, cy, size) => {
        const x = cx - size * 0.95;
        ctx.fillStyle = "#f97316";
        ctx.fillRect(x - size * 0.55, cy - size * 0.55, size * 1.1, size * 1.1);
        drawLeaf(ctx, x - size * 0.18, cy + size * 0.18, size * 0.16, -0.8);
        drawLeaf(ctx, x + size * 0.2, cy + size * 0.28, size * 0.14, 0.6);
        drawFlower(ctx, x - size * 0.08, cy - size * 0.18, size * 0.18, "#da291c", "#facc15");
        drawFlower(ctx, x + size * 0.16, cy + size * 0.02, size * 0.14, "#7c3aed", "#facc15", 5);
        drawBud(ctx, x + size * 0.02, cy + size * 0.28, size * 0.1, "#da291c");
        drawFlower(ctx, x - size * 0.22, cy + size * 0.08, size * 0.11, "#2563eb", "#facc15", 5);
      });

      paintLetterGarden("N", (ctx, cx, cy, size) => {
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(cx - size * 0.45, cy - size * 0.55, size * 0.9, size * 1.1);
        drawLeaf(ctx, cx - size * 0.12, cy + size * 0.22, size * 0.15, -0.5);
        drawLeaf(ctx, cx + size * 0.14, cy - size * 0.05, size * 0.13, 1.1);
        drawFlower(ctx, cx, cy - size * 0.12, size * 0.17, "#facc15", "#da291c");
        drawFlower(ctx, cx - size * 0.18, cy + size * 0.12, size * 0.13, "#2563eb", "#facc15", 5);
        drawFlower(ctx, cx + size * 0.16, cy + size * 0.18, size * 0.12, "#da291c", "#facc15", 5);
        drawBud(ctx, cx + size * 0.02, cy + size * 0.32, size * 0.09, "#7c3aed");
      });

      paintLetterGarden("D", (ctx, cx, cy, size) => {
        const x = cx + size * 0.95;
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(x - size * 0.55, cy - size * 0.55, size * 1.1, size * 1.1);
        drawLeaf(ctx, x - size * 0.2, cy + size * 0.2, size * 0.15, -0.9);
        drawLeaf(ctx, x + size * 0.12, cy + size * 0.08, size * 0.12, 0.4);
        drawFlower(ctx, x - size * 0.05, cy - size * 0.22, size * 0.16, "#facc15", "#da291c");
        drawFlower(ctx, x + size * 0.12, cy - size * 0.02, size * 0.13, "#f97316", "#facc15", 5);
        drawFlower(ctx, x - size * 0.16, cy + size * 0.14, size * 0.14, "#da291c", "#facc15", 5);
        drawBud(ctx, x + size * 0.04, cy + size * 0.3, size * 0.1, "#7c3aed");
        drawFlower(ctx, x + size * 0.18, cy + size * 0.18, size * 0.1, "#16a34a", "#facc15", 5);
      });

      seededRef.current = true;
    };

    const renderFront = () => {
      const ratio = window.devicePixelRatio || 1;
      frontCtx.setTransform(1, 0, 0, 1, 0, 0);
      frontCtx.clearRect(0, 0, front.width, front.height);
      frontCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      frontCtx.fillStyle = "#ffffff";
      withWord(frontCtx, false, (ctx) => ctx.fillText("END", 0, 0));
      frontCtx.strokeStyle = "#18181b";
      frontCtx.lineWidth = Math.max(5, fontSize * 0.022);
      frontCtx.lineJoin = "round";
      withWord(frontCtx, false, (ctx) => ctx.strokeText("END", 0, 0));
    };

    const renderBack = () => {
      const ratio = window.devicePixelRatio || 1;
      backCtx.setTransform(1, 0, 0, 1, 0, 0);
      backCtx.clearRect(0, 0, back.width, back.height);
      backCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const face = document.createElement("canvas");
      face.width = back.width;
      face.height = back.height;
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
        faceCtx.save();
        faceCtx.translate(width, 0);
        faceCtx.scale(-1, 1);
        faceCtx.drawImage(paint, 0, 0, width, height);
        faceCtx.restore();
        backCtx.drawImage(face, 0, 0, width, height);
      }

      backCtx.strokeStyle = "#18181b";
      backCtx.lineWidth = Math.max(5, fontSize * 0.022);
      backCtx.lineJoin = "round";
      withWord(backCtx, true, (ctx) => ctx.strokeText("END", 0, 0));
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
      for (const canvas of [front, back]) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      paint.width = Math.round(width * ratio);
      paint.height = Math.round(height * ratio);
      paintCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (snapshot.width > 0) {
        paintCtx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, width, height);
      }
      fitFont();
      if (!seededRef.current) seedLetters();
      renderFront();
      renderBack();
    };

    const stamp = (x: number, y: number) => {
      const radius = Math.max(16, fontSize * 0.07);
      // back face shows mirrored END; map pointer into upright paint space
      const px = width - x;
      paintCtx.fillStyle = colorRef.current;
      paintCtx.beginPath();
      paintCtx.arc(px, y, radius, 0, Math.PI * 2);
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
      renderBack();
    };

    const localPoint = (event: PointerEvent) => {
      const rect = back.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onDown = (event: PointerEvent) => {
      if (!flippedRef.current) return;
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
    back.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) resize();
    });

    renderBackRef.current = renderBack;

    return () => {
      cancelled = true;
      renderBackRef.current = null;
      observer.disconnect();
      back.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto w-full [perspective:1000px]">
        <div
          ref={frameRef}
          className="relative mx-auto h-52 w-full sm:h-64"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: `transform ${FLIP_MS}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
          }}
        >
          <canvas
            ref={frontRef}
            className="absolute inset-0 h-full w-full"
            style={{ backfaceVisibility: "hidden" }}
          />
          <canvas
            ref={backRef}
            className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {COLORS.map((swatch) => (
          <button
            key={swatch.name}
            type="button"
            aria-label={swatch.name}
            aria-pressed={color === swatch.value}
            onClick={() => setColor(swatch.value)}
            className={[
              "h-8 w-8 cursor-pointer rounded-full border border-zinc-300",
              color === swatch.value ? "ring-2 ring-zinc-900 ring-offset-2" : "",
            ].join(" ")}
            style={{ backgroundColor: swatch.value }}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectPreview() {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-xs justify-center border-2 border-orange-600 bg-white p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/other/backend-preview.png"
        alt=""
        className="h-28 w-28 object-contain"
      />
    </div>
  );
}

export function OtherBackend() {
  const [mounted, setMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [payMounted, setPayMounted] = useState(false);
  const [payActive, setPayActive] = useState(false);
  const closeTimerRef = useRef(0);
  const payTimerRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(payTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalMounted && !payMounted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (payMounted) closePay();
      else closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalMounted, payMounted]);

  function openModal() {
    window.clearTimeout(closeTimerRef.current);
    setReady(false);
    setModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalActive(true));
    });
  }

  function closeModal() {
    setModalActive(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setModalMounted(false);
      setReady(false);
    }, MODAL_MS);
  }

  function openPay() {
    window.clearTimeout(payTimerRef.current);
    setPayMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPayActive(true));
    });
  }

  function closePay() {
    setPayActive(false);
    window.clearTimeout(payTimerRef.current);
    payTimerRef.current = window.setTimeout(() => {
      setPayMounted(false);
    }, MODAL_MS);
  }

  return (
    <div className="w-full max-w-sm text-zinc-900" style={scrappyFont}>
      <p className="text-3xl text-red-700">Agentic Backend Design</p>

      <ProjectPreview />
      <p className="mt-3 text-base break-all">{PROJECT_FILE}</p>

      <button
        type="button"
        onClick={openModal}
        className="mt-4 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
        style={scrappyFont}
      >
        Run backend
      </button>

      {mounted && modalMounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  modalActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closeModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="backend-title"
                className={[
                  "relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl transition duration-200 ease-out",
                  modalActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <div className="flex items-center justify-between">
                  <p id="backend-title" className="text-2xl text-red-700">
                    {ready ? "Backend successfully designed" : "Running..."}
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="close"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="mt-4">
                  <BackendDesign onClose={closeModal} onReady={() => setReady(true)} />
                </div>

                <p className="mt-3 text-center text-sm break-all">{PROJECT_FILE}</p>
                {ready ? (
                  <button
                    type="button"
                    onClick={openPay}
                    className="mx-auto mt-4 block cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                    style={scrappyFont}
                  >
                    Run again
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && payMounted
        ? createPortal(
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="close"
                className={[
                  "absolute inset-0 cursor-pointer bg-zinc-900/40 transition-opacity duration-200 ease-out",
                  payActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={closePay}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="credits-title"
                className={[
                  "relative z-10 w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl transition duration-200 ease-out",
                  payActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-2 scale-[0.98] opacity-0",
                ].join(" ")}
                style={scrappyFont}
              >
                <button
                  type="button"
                  onClick={closePay}
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
                <p id="credits-title" className="text-2xl text-red-700">
                  You ran out of credits
                </p>
                <p className="mt-4 font-sans text-5xl text-zinc-900 tabular-nums">$99</p>
                <p className="mt-1 text-lg">credits</p>
                <button
                  type="button"
                  className="mt-6 cursor-pointer rounded-full border-2 border-red-900 bg-red-600 px-5 py-2 text-xl text-white"
                  style={scrappyFont}
                >
                  Pay $99
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
