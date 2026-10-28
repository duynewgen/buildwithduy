"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  FileText,
  Globe,
  Image,
  Languages,
  Mic,
  Pencil,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { googleSans } from "@/lib/google-translate-font";

const LINES: { test: RegExp; line: string }[] = [
  {
    test: /\b(hungry|starving|food|dinner|lunch|breakfast|snack|eat)\b/i,
    line: "You eat yet? Rice is in the pot. Why you wait.",
  },
  {
    test: /\b(tired|sleepy|sleep|exhausted|nap)\b/i,
    line: "Tired from what. Put the phone down. Sleep at 10.",
  },
  {
    test: /\b(going out|go out|hang(?:ing)? out|outside|party|friends?)\b/i,
    line: "Go where. With who. Come home early. Text me.",
  },
  {
    test: /\blove\b/i,
    line: "Love is a good grade. Come eat first.",
  },
  {
    test: /\b(money|cash|broke|dollars?|expensive|afford|buy|paid|pay)\b/i,
    line: "Money? You think money grow on tree. Ask your dad.",
  },
  {
    test: /\b(job|work|boss|interview|hired|office)\b/i,
    line: "What job. How much they pay. You tell uncle.",
  },
  {
    test: /\b(sick|hurt|pain|cold|fever|ill|headache)\b/i,
    line: "Drink hot water. You not that sick.",
  },
  {
    test: /\b(grades?|tests?|exams?|quiz|school|homework|class|college|gpa|scores?)\b/i,
    line: "What score. Why not higher. Your cousin got higher.",
  },
  {
    test: /\b(girlfriend|boyfriend|dating|crush)\b/i,
    line: "Study first. Who is the family.",
  },
  {
    test: /\b(ok|okay|fine|whatever)\b/i,
    line: "Okay what. Don't okay me. Look at me when I talk.",
  },
  {
    test: /\b(hi|hello|hey)\b/i,
    line: "You call now? Where were you yesterday.",
  },
  {
    test: /\bthanks?\b|\bthank you\b/i,
    line: "Thank you by coming home for dinner.",
  },
  {
    test: /\b(phone|text|call|voicemail)\b/i,
    line: "Why you not pick up. I call three time.",
  },
  {
    test: /\b(late|curfew)\b/i,
    line: "What time you call this. Door lock at 10.",
  },
];

function translateSentence(sentence: string) {
  const text = sentence.trim();
  if (!text) return "";

  for (const { test, line } of LINES) {
    if (test.test(text)) return line;
  }

  const can = text.match(/^can i (.+?)[?.!]*$/i);
  if (can) {
    return `You want to ${can[1]}? Finish homework first. Then we see.`;
  }

  const want = text.match(/^i (?:want|need) (.+?)[?.!]*$/i);
  if (want) {
    return `${want[1]}? Why you need. We have at home.`;
  }

  const am = text.match(/^i(?:'m| am) (.+?)[?.!]*$/i);
  if (am) {
    return `You ${am[1]}? Your cousin is not like that.`;
  }

  return `${text.replace(/[?.!]+$/, "")}? Say it clearly. And did you eat.`;
}

function translateToParent(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^(?:i['’]?m|i am)\s+sorry[.!?]*$/i.test(trimmed) || /^sorry[.!?]*$/i.test(trimmed)) {
    return "SYNTAX ERROR";
  }
  return trimmed
    .split(/(?<=[.!?])\s+/)
    .map(translateSentence)
    .filter(Boolean)
    .join(" ");
}

const DOT_MS = 160;

const MODES = [
  { name: "Text", icon: Languages },
  { name: "Images", icon: Image },
  { name: "Documents", icon: FileText },
  { name: "Websites", icon: Globe },
];

function AsianParentsTranslateLogo() {
  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];
  const letters = "Asian Parents".split("");

  return (
    <p className="text-[22px] leading-none" aria-label="Asian Parents Translate">
      {letters.map((letter, index) => (
        <span key={index} style={{ color: letter === " " ? undefined : colors[index % colors.length] }}>
          {letter}
        </span>
      ))}
      <span className="ml-2 text-[#5f6368]">Translate</span>
    </p>
  );
}

const ALTERNATIVES = [
  { text: "Have you eaten?", tone: "Check in" },
  { text: "I cut some fruit for you", tone: "Care" },
];

export function OtherAsianParentsTranslator() {
  const [normal, setNormal] = useState("i'm sorry");
  const [parent, setParent] = useState("SYNTAX ERROR");
  const [dots, setDots] = useState(0);
  const timer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  function edit(value: string) {
    window.clearTimeout(timer.current);
    setNormal(value);
    setParent("");
    const text = value.trim();
    if (!text) {
      setDots(0);
      return;
    }
    setDots(1);
    let current = 1;
    const advance = () => {
      current += 1;
      if (current <= 3) {
        setDots(current);
        timer.current = window.setTimeout(advance, DOT_MS);
        return;
      }
      setParent(translateToParent(text));
      setDots(0);
    };
    timer.current = window.setTimeout(advance, DOT_MS);
  }

  const translating = dots > 0;
  const shown = translating ? `translating${".".repeat(dots)}` : parent;
  const showAlternatives = !translating && shown === "SYNTAX ERROR";
  const boxClass = showAlternatives ? "min-h-64" : "h-64";

  return (
    <div className={`${googleSans.className} w-full text-[#202124]`}>
      <AsianParentsTranslateLogo />
      <div className="mt-6 flex flex-wrap gap-2">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const selected = mode.name === "Text";
          return (
            <button
              key={mode.name}
              type="button"
              className={[
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium",
                selected
                  ? "border-[#d3e3fd] bg-[#d3e3fd] text-[#0842a0]"
                  : "border-[#dadce0] bg-transparent text-[#0b57d0]",
              ].join(" ")}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {mode.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-start">
        <section className="min-w-0 flex-1">
          <div className="flex h-12 items-center gap-1 px-1 text-sm font-medium">
            <span className="border-b-2 border-[#0b57d0] px-2 pb-2.5 pt-3 text-[#0b57d0]">
              Normal Parents
            </span>
          </div>
          <div className={`flex ${boxClass} flex-col rounded-2xl border border-[#e1e3e1] bg-white`}>
            <textarea
              aria-label="Source text"
              value={normal}
              onChange={(event) => edit(event.target.value)}
              className="w-full flex-1 resize-none bg-transparent px-4 pt-4 text-2xl leading-8 text-[#444746] outline-none"
            />
            <div className="flex items-center justify-between px-4 pb-3 text-[#5f6368]">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5" strokeWidth={1.75} />
                {normal ? <Volume2 className="h-5 w-5" strokeWidth={1.75} /> : null}
              </div>
              <div className="flex items-center gap-3">
                {normal ? (
                  <>
                    <button
                      type="button"
                      aria-label="clear"
                      onClick={() => edit("")}
                      className="text-[#5f6368]"
                    >
                      <X className="h-5 w-5" strokeWidth={1.75} />
                    </button>
                    <span className="text-xs">{normal.length}</span>
                  </>
                ) : null}
                <Pencil className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex h-12 items-center justify-center text-[#5f6368] lg:w-12">
          <ArrowLeftRight className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <section className="min-w-0 flex-1">
          <div className="flex h-12 items-center gap-1 px-1 text-sm font-medium">
            <span className="border-b-2 border-[#0b57d0] px-2 pb-2.5 pt-3 text-[#0b57d0]">
              Asian Parents
            </span>
          </div>
          <div
            className={`rounded-2xl bg-[#f0f4f9] px-5 pb-2 pt-4 ${boxClass}`}
            aria-live="polite"
            aria-busy={translating}
          >
            <div className="flex items-start justify-between gap-4">
              <p
                id="parent"
                className={[
                  "text-[28px] leading-9",
                  translating || !shown ? "text-[#5f6368]" : "text-[#1f1f1f]",
                ].join(" ")}
              >
                {shown || "Translation"}
              </p>
              {showAlternatives ? (
                <Star className="mt-1 h-5 w-5 text-[#5f6368]" strokeWidth={1.75} />
              ) : null}
            </div>
            {showAlternatives ? (
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-[#202124]">Alternatives</p>
                  <p className="text-[#0b57d0]">Expand all</p>
                </div>
                <ul className="mt-1">
                  {ALTERNATIVES.map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center justify-between gap-4 border-t border-[#dadce0] py-3.5"
                    >
                      <p className="text-base text-[#202124]">{item.text}</p>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#d3e3fd] px-2.5 py-0.5 text-xs text-[#0b57d0]">
                        {item.tone}
                        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <p className="mt-1 text-right text-xs text-[#70757a]">Send feedback</p>
        </section>
      </div>
    </div>
  );
}
