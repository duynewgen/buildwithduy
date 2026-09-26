import Link from "next/link";
import { BirthdayAngryCakeDemo } from "@/components/birthday-angry-cake-demo";
import { BirthdayBounceDemo } from "@/components/birthday-bounce-demo";
import { BirthdayClickDemo } from "@/components/birthday-click-demo";
import { BirthdayLotteryDemo } from "@/components/birthday-lottery-demo";
import { BirthdayMathDemo } from "@/components/birthday-math-demo";
import { BirthdayPlinkoDemo } from "@/components/birthday-plinko-demo";
import { BirthdayPhysicsDemo } from "@/components/birthday-physics-demo";
import { BirthdayChemistryDemo } from "@/components/birthday-chemistry-demo";
import { BirthdayChineseDemo } from "@/components/birthday-chinese-demo";
import { BirthdayArabicDemo } from "@/components/birthday-arabic-demo";
import { BirthdayRomanDemo } from "@/components/birthday-roman-demo";
import { BirthdaySliderDemo } from "@/components/birthday-slider-demo";
import { BirthdayWordsDemo } from "@/components/birthday-words-demo";
import { PaymentApplePayDemo } from "@/components/payment-apple-pay-demo";
import { PaymentCancelDemo } from "@/components/payment-cancel-demo";
import { PaymentCancelTwoDemo } from "@/components/payment-cancel-two-demo";
import { PaymentCardDemo } from "@/components/payment-card-demo";
import { PaymentNoTipDemo } from "@/components/payment-no-tip-demo";
import { PaymentSplitDemo } from "@/components/payment-split-demo";
import { PasswordTwoFactorDemo } from "@/components/password-two-factor-demo";
import { PasswordTwoFactorTwoDemo } from "@/components/password-two-factor-two-demo";
import { AuthOtpDemo } from "@/components/auth-otp-demo";
import { AuthOtpTwoDemo } from "@/components/auth-otp-two-demo";
import { AuthFallingNumbersDemo } from "@/components/auth-falling-numbers-demo";
import { AuthSnakeDemo } from "@/components/auth-snake-demo";
import { AuthPayToProveDemo } from "@/components/auth-pay-to-prove-demo";
import { AuthFishingDemo } from "@/components/auth-fishing-demo";
import type { Build } from "@/lib/builds";
import { buildHref } from "@/lib/builds";

function BuildDemo({ path }: { path: string }) {
  if (path === "form/slider") {
    return <BirthdaySliderDemo />;
  }
  if (path === "form/angry-cake") {
    return <BirthdayAngryCakeDemo />;
  }
  if (path === "form/lottery") {
    return <BirthdayLotteryDemo />;
  }
  if (path === "form/words") {
    return <BirthdayWordsDemo />;
  }
  if (path === "form/roman") {
    return <BirthdayRomanDemo />;
  }
  if (path === "form/arabic") {
    return <BirthdayArabicDemo />;
  }
  if (path === "form/chinese") {
    return <BirthdayChineseDemo />;
  }
  if (path === "form/chemistry") {
    return <BirthdayChemistryDemo />;
  }
  if (path === "form/physics") {
    return <BirthdayPhysicsDemo />;
  }
  if (path === "form/bounce") {
    return <BirthdayBounceDemo />;
  }
  if (path === "form/click") {
    return <BirthdayClickDemo />;
  }
  if (path === "form/drop-the-cake") {
    return <BirthdayPlinkoDemo />;
  }
  if (path === "form/math") {
    return <BirthdayMathDemo />;
  }
  if (path === "payment/apple-pay") {
    return <PaymentApplePayDemo />;
  }
  if (path === "payment/no-tip") {
    return <PaymentNoTipDemo />;
  }
  if (path === "payment/card") {
    return <PaymentCardDemo />;
  }
  if (path === "payment/cancel") {
    return <PaymentCancelDemo />;
  }
  if (path === "payment/cancel-2") {
    return <PaymentCancelTwoDemo />;
  }
  if (path === "payment/split") {
    return <PaymentSplitDemo />;
  }
  if (path === "authentication/two-factor") {
    return <PasswordTwoFactorDemo />;
  }
  if (path === "authentication/two-factor-2") {
    return <PasswordTwoFactorTwoDemo />;
  }
  if (path === "authentication/otp-hint") {
    return <AuthOtpDemo />;
  }
  if (path === "authentication/rotary-phone") {
    return <AuthOtpTwoDemo />;
  }
  if (path === "authentication/falling-numbers") {
    return <AuthFallingNumbersDemo />;
  }
  if (path === "authentication/snake") {
    return <AuthSnakeDemo />;
  }
  if (path === "authentication/pay-to-prove") {
    return <AuthPayToProveDemo />;
  }
  if (path === "authentication/fishing") {
    return <AuthFishingDemo />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50">
      <span className="text-sm text-zinc-400">preview</span>
    </div>
  );
}

type BuildShortcutProps = {
  build: Build;
};

export function BuildShortcut({ build }: BuildShortcutProps) {
  return (
    <Link
      href={buildHref(build)}
      className="group flex h-full w-full max-w-56 cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-200 ease-out hover:-translate-y-1 hover:border-zinc-900 hover:shadow-md"
    >
      <div className="aspect-square w-full shrink-0 overflow-hidden border-b border-zinc-200">
        <BuildDemo path={build.path} />
      </div>
      <div className="flex flex-1 flex-col px-3 py-3 text-left">
        <h2 className="font-display text-xl tracking-tight text-zinc-900">
          {build.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 sm:text-md">
          {build.description}
        </p>
      </div>
    </Link>
  );
}
