"use client";

import { useState } from "react";

const LOGO_SRC = "/other/mcdonalds-logo.svg";

const LANGUAGE_OPTIONS = [
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
  "COBOL",
  "Fortran",
  "Lisp",
  "Prolog",
  "Zig",
  "Solidity",
  "Scratch",
  "Brainfuck",
  "MATLAB",
  "Julia",
  "OCaml",
  "Erlang",
  "Clojure",
  "F#",
  "Objective-C",
  "Visual Basic",
  "Pascal",
  "Ada",
  "Nim",
  "Crystal",
  "Groovy",
  "PowerShell",
  "GraphQL",
  "Sass",
  "Whitespace",
];

const fieldClass =
  "mt-1 w-full rounded-xl border-2 border-[#fc0] bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-[#da291c]";

export function OtherMcdonaldsJobApplication() {
  const [name, setName] = useState("Duy Nguyen");
  const [major, setMajor] = useState("Business");
  const [gpa, setGpa] = useState("0.8");
  const [nationality, setNationality] = useState("Vietnam");
  const [language, setLanguage] = useState("");

  return (
    <div className="w-full max-w-lg text-zinc-900">
      <img src={LOGO_SRC} alt="McDonald's" className="mx-auto h-16 w-auto" />
      <p className="mt-4 text-center text-2xl text-[#da291c] sm:text-3xl">
        Job Application - Fries Assistant
      </p>

      <form
        className="mt-6 space-y-4 text-left"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="block text-base" htmlFor="mcdonalds-name">
          Name
          <input
            id="mcdonalds-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            autoComplete="name"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-base" htmlFor="mcdonalds-major">
            Major
            <input
              id="mcdonalds-major"
              value={major}
              onChange={(event) => setMajor(event.target.value)}
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

        <label className="block text-base" htmlFor="mcdonalds-language">
          Languages
          <select
            id="mcdonalds-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              choose a language
            </option>
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

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
