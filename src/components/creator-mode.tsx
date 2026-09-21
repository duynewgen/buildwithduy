"use client";

import {
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { BackPill } from "@/components/back-pill";
import type { YearPickerProps } from "@/lib/creator";

type CreatorModeProps = {
  backHref?: string;
  YearPicker: ComponentType<YearPickerProps>;
  contentClassName?: string;
};

export function CreatorMode({
  backHref = "/",
  YearPicker,
  contentClassName = "max-w-md",
}: CreatorModeProps) {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleYearChange = useCallback((next: number) => {
    setYear(next);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute left-6 top-6 z-20 sm:left-10 lg:left-16">
        <BackPill href={backHref} />
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center py-8">
        <form
          className={`w-full space-y-6 ${contentClassName}`}
          onSubmit={(event) => event.preventDefault()}
        >
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
              className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition hover:border-zinc-900 focus:border-zinc-900"
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
                "flex w-full cursor-pointer items-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-left text-sm outline-none transition hover:border-zinc-900",
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
            yearOnly
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
