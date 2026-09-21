import type { Metadata } from "next";
import { BirthdayRoman } from "@/components/birthday-roman";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/roman")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayRomanPage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
    >
      <BirthdayRoman />
    </BuildShell>
  );
}
