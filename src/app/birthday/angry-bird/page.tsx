import type { Metadata } from "next";
import { BirthdayAngryBird } from "@/components/birthday-angry-bird";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/angry-bird")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayAngryBirdPage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
    >
      <BirthdayAngryBird />
    </BuildShell>
  );
}
