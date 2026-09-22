"use client";

import {
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { BackPill } from "@/components/back-pill";
import {
  CREATOR_YEAR,
  parseStartYear,
  type YearPickerProps,
} from "@/lib/creator";

type CreatorModeProps = {
  backHref?: string;
  YearPicker: ComponentType<YearPickerProps>;
};

export function CreatorMode({
  backHref = "/",
  YearPicker,
}: CreatorModeProps) {
  const [name, setName] = useState("build with duy");
  const [year, setYear] = useState<number | null>(null);
  const [startYearText, setStartYearText] = useState(String(CREATOR_YEAR.min));
  const [modalOpen, setModalOpen] = useState(false);

  const minYear = parseStartYear(startYearText);

  const handleYearChange = useCallback((next: number) => {
    setYear(next);
  }, []);

  const handleStartYearChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextText = event.target.value;
      setStartYearText(nextText);
      const nextMin = parseStartYear(nextText);
      setYear((current) =>
        current === null || current < nextMin ? null : current,
      );
    },
    [],
  );

  return (
    <main className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 flex flex-col items-start gap-3 sm:left-10 lg:left-16">
        <BackPill href={backHref} />
        <div className="space-y-1.5">
          <label
            htmlFor="creator-start-year"
            className="block text-sm tracking-wide text-zinc-500"
          >
            start year
          </label>
          <input
            id="creator-start-year"
            type="text"
            inputMode="numeric"
            value={startYearText}
            onChange={handleStartYearChange}
            className="w-24 rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-sans text-sm tabular-nums text-zinc-900 outline-none transition hover:border-zinc-900 focus:border-zinc-900"
          />
        </div>
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
        <form
          className="w-full max-w-md space-y-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1 className="text-lg text-zinc-900">interest form</h1>

          <div className="space-y-2 text-left">
            <label
              htmlFor="creator-name"
              className="text-sm tracking-wide text-zinc-500"
            >
              name
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition hover:border-zinc-900 focus:border-zinc-900"
            />
          </div>

          <div className="space-y-2 text-left">
            <span className="text-sm tracking-wide text-zinc-500">
              when were you born
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={[
                "flex w-full cursor-pointer items-center rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-left text-sm outline-none transition hover:border-zinc-900",
                year === null ? "text-zinc-400" : "text-zinc-900",
              ].join(" ")}
            >
              {year === null ? "add your birthyear" : String(year)}
            </button>
          </div>
        </form>
      </div>

      {modalOpen ? (
        <CreatorModal onClose={() => setModalOpen(false)}>
          <YearPicker
            key={minYear}
            yearOnly
            minYear={minYear}
            initialYear={year ?? undefined}
            onYearChange={handleYearChange}
          />
        </CreatorModal>
      ) : null}
    </main>
  );
}

function CreatorModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="close"
        className="absolute inset-0 cursor-pointer bg-zinc-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-3">
          <span className="text-sm text-zinc-500">pick a year</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
