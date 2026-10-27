"use client";

import { useEffect, useRef, useState } from "react";

const scrappyFont = {
  fontFamily: '"Times New Roman", Times, serif',
} as const;

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

const WORDS = ["translating", "fathoming", "thinking"];
const DOT_MS = 180;

export function OtherAsianParentsTranslator() {
  const [normal, setNormal] = useState("i'm sorry");
  const [parent, setParent] = useState("");
  const [step, setStep] = useState(-1);
  const timer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  function translate() {
    window.clearTimeout(timer.current);
    setParent("");
    setStep(0);
    const text = normal;
    let current = 0;
    const advance = () => {
      current += 1;
      if (current < WORDS.length * 3) {
        setStep(current);
        timer.current = window.setTimeout(advance, DOT_MS);
        return;
      }
      setParent(translateToParent(text));
      setStep(-1);
    };
    timer.current = window.setTimeout(advance, DOT_MS);
  }

  function edit(value: string) {
    window.clearTimeout(timer.current);
    setStep(-1);
    setNormal(value);
    setParent("");
  }

  const translating = step >= 0;
  const shown = translating
    ? `${WORDS[Math.floor(step / 3)]}${".".repeat((step % 3) + 1)}`
    : parent;

  return (
    <div className="w-full max-w-md text-red-950" style={scrappyFont}>
      <p className="text-3xl text-red-700">Asian Parents Translator</p>

      <label className="mt-5 block text-xl" htmlFor="normal-parents">
        Normal parents
        <textarea
          id="normal-parents"
          value={normal}
          onChange={(event) => edit(event.target.value)}
          rows={4}
          className="mt-1 w-full resize-none border-2 border-orange-600 bg-white px-2 py-2 text-xl text-red-950 outline-none"
          style={scrappyFont}
        />
      </label>

      <button
        type="button"
        onClick={translate}
        disabled={translating}
        className="mt-4 cursor-pointer border-2 border-red-900 bg-red-600 px-4 py-2 text-xl text-white disabled:cursor-default disabled:opacity-70"
        style={scrappyFont}
      >
        Translate
      </button>

      <label className="mt-4 block text-xl" htmlFor="parent">
        Asian parents
        <textarea
          id="parent"
          readOnly
          aria-busy={translating}
          value={shown}
          rows={4}
          className="mt-1 w-full resize-none border-2 border-red-800 bg-red-100 px-2 py-2 text-xl text-red-800 outline-none"
          style={scrappyFont}
        />
      </label>
    </div>
  );
}
