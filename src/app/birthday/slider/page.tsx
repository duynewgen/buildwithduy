import type { Metadata } from "next";
import { BirthdaySliders } from "@/components/birthday-sliders";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/slider")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdaySliderPage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
    >
      <BirthdaySliders />
    </BuildShell>
  );
}
