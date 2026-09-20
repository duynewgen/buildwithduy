import type { Metadata } from "next";
import { BirthdaySliders } from "@/components/birthday-sliders";
import { BuildShell } from "@/components/build-shell";

export const metadata: Metadata = {
  title: "birthday slider",
  description:
    "pick your birthday by sliding to your month, day, and year.",
};

export default function BirthdayPage() {
  return (
    <BuildShell
      title="birthday slider"
      description="slide to your month, day, and year. be careful with decimals."
    >
      <BirthdaySliders />
    </BuildShell>
  );
}
