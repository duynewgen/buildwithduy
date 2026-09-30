"use client";

import type { ComponentType } from "react";
import { BirthdayAngryCake } from "@/components/birthday-angry-cake";
import { BirthdayArabic } from "@/components/birthday-arabic";
import { BirthdayBounce } from "@/components/birthday-bounce";
import { BirthdayBinary } from "@/components/birthday-binary";
import { BirthdayChemistry } from "@/components/birthday-chemistry";
import { BirthdayChinese } from "@/components/birthday-chinese";
import { BirthdayClick } from "@/components/birthday-click";
import { BirthdayLottery } from "@/components/birthday-lottery";
import { BirthdayMath } from "@/components/birthday-math";
import { BirthdayMorse } from "@/components/birthday-morse";
import { BirthdayPlinko } from "@/components/birthday-plinko";
import { BirthdayRoman } from "@/components/birthday-roman";
import { BirthdaySliders } from "@/components/birthday-sliders";
import { BirthdayWheel } from "@/components/birthday-wheel";
import { BirthdayWords } from "@/components/birthday-words";
import { BuildExperience } from "@/components/build-experience";
import type { YearPickerProps } from "@/lib/creator";
import { formExperiments, type FormExperiment } from "@/lib/builds";

const pickers: Record<string, ComponentType<YearPickerProps>> = {
  slider: BirthdaySliders,
  "angry-cake": BirthdayAngryCake,
  lottery: BirthdayLottery,
  words: BirthdayWords,
  roman: BirthdayRoman,
  arabic: BirthdayArabic,
  chinese: BirthdayChinese,
  math: BirthdayMath,
  chemistry: BirthdayChemistry,
  binary: BirthdayBinary,
  morse: BirthdayMorse,
  "wheel-of-fortune": BirthdayWheel,
  bounce: BirthdayBounce,
  click: BirthdayClick,
  "drop-the-cake": BirthdayPlinko,
};

export function FormBuildPage({
  experiment,
  creator,
}: {
  experiment: FormExperiment;
  creator: boolean;
}) {
  const Picker = pickers[experiment.slug];
  if (!Picker) return null;

  return (
    <BuildExperience
      creator={creator}
      title={experiment.title}
      description={experiment.description}
      backHref="/form"
      creatorInline={experiment.inline}
      prompt={experiment.prompt}
      YearPicker={Picker}
    >
      <Picker />
    </BuildExperience>
  );
}
