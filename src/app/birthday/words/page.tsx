import type { Metadata } from "next";
import { BirthdayWords } from "@/components/birthday-words";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/words")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayWordsPage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
    >
      <BirthdayWords />
    </BuildShell>
  );
}
