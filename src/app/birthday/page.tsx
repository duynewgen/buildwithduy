import type { Metadata } from "next";
import { BirthdaySliders } from "@/components/birthday-sliders";
import { BuildShell } from "@/components/build-shell";

export const metadata: Metadata = {
  title: "birthday slider",
  description:
    "pick your birthday with cursed month, day, and year sliders.",
};

export default function BirthdayPage() {
  return (
    <BuildShell
      title="birthday slider"
      description="slide month, day, and year — no decimals."
    >
      <BirthdaySliders />
    </BuildShell>
  );
}
