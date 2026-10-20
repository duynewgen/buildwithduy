"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

const LOGO_SRC = "/other/mcdonalds-logo.svg";

const DEFAULT_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "SQL",
  "HTML",
  "CSS",
  "C",
  "C++",
  "C#",
  "Java",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Ruby",
  "PHP",
  "R",
  "Scala",
  "Dart",
  "Lua",
  "Perl",
  "Haskell",
  "Elixir",
  "Assembly",
  "Bash",
];

const fieldClass =
  "mt-1 w-full rounded-xl border-2 border-[#fc0] bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-[#da291c]";

export function OtherMcdonaldsJobApplication() {
  const [firstName, setFirstName] = useState("Duy");
  const [lastName, setLastName] = useState("Nguyen");
  const [degree, setDegree] = useState("Business");
  const [gpa, setGpa] = useState("0.8");
  const [nationality, setNationality] = useState("Vietnam");
  const [languages, setLanguages] = useState(DEFAULT_LANGUAGES);
  const [languageDraft, setLanguageDraft] = useState("");

  function addLanguage(raw: string) {
    const next = raw.trim().replace(/,+$/, "");
    if (!next) return;
    setLanguages((current) =>
      current.some((language) => language.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    );
    setLanguageDraft("");
  }

  function removeLanguage(language: string) {
    setLanguages((current) => current.filter((item) => item !== language));
  }

  function onLanguageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addLanguage(languageDraft);
      return;
    }
    if (event.key === "Backspace" && !languageDraft && languages.length > 0) {
      removeLanguage(languages[languages.length - 1]!);
    }
  }

  return (
    <div className="w-full max-w-lg text-zinc-900">
      <img src={LOGO_SRC} alt="McDonald's" className="mx-auto h-16 w-auto" />
      <p className="mt-4 text-center text-2xl text-[#da291c] sm:text-3xl">
        Job Application - Fries Assistant
      </p>

      <form
        className="mt-6 space-y-4 text-left"
        onSubmit={(event) => {
          event.preventDefault();
          addLanguage(languageDraft);
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-base" htmlFor="mcdonalds-first-name">
            First name
            <input
              id="mcdonalds-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={fieldClass}
              autoComplete="given-name"
            />
          </label>

          <label className="block text-base" htmlFor="mcdonalds-last-name">
            Last name
            <input
              id="mcdonalds-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={fieldClass}
              autoComplete="family-name"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-base" htmlFor="mcdonalds-degree">
            Degree
            <input
              id="mcdonalds-degree"
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block text-base" htmlFor="mcdonalds-gpa">
            GPA
            <input
              id="mcdonalds-gpa"
              value={gpa}
              onChange={(event) => setGpa(event.target.value)}
              className={fieldClass}
              inputMode="decimal"
            />
          </label>
        </div>

        <label className="block text-base" htmlFor="mcdonalds-nationality">
          Nationality
          <input
            id="mcdonalds-nationality"
            value={nationality}
            onChange={(event) => setNationality(event.target.value)}
            className={fieldClass}
          />
        </label>

        <div>
          <label className="block text-base" htmlFor="mcdonalds-languages">
            Languages
          </label>
          <div className="mt-1 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border-2 border-[#fc0] bg-white px-2 py-2 focus-within:border-[#da291c]">
            {languages.map((language) => (
              <span
                key={language}
                className="inline-flex items-center gap-1 rounded-full bg-[#fff3c4] px-2.5 py-1 text-sm text-zinc-900"
              >
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(language)}
                  className="cursor-pointer rounded-full p-0.5 text-zinc-500 transition hover:bg-[#fc0]/60 hover:text-zinc-900"
                  aria-label={`remove ${language}`}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <input
              id="mcdonalds-languages"
              value={languageDraft}
              onChange={(event) => setLanguageDraft(event.target.value)}
              onKeyDown={onLanguageKeyDown}
              onBlur={() => addLanguage(languageDraft)}
              placeholder={languages.length === 0 ? "add a language" : "add more"}
              className="min-w-[7rem] flex-1 bg-transparent px-1 py-1 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 cursor-pointer rounded-full border-2 border-[#a00] bg-[#da291c] px-5 py-2.5 text-base text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
