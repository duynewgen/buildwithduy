import Image from "next/image";

export function PaymentApplePayDemo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-50 px-3">
      <div className="relative flex h-16 w-28 items-center justify-center overflow-hidden">
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-10 text-base opacity-0 group-hover:animate-apple-fall"
        >
          🍎
        </span>
        <Image
          src="/payment/buy-with-apple-pay.png"
          alt=""
          width={343}
          height={50}
          className="relative w-full object-contain"
          draggable={false}
        />
      </div>
      <p className="font-sans text-sm tabular-nums text-zinc-700">$4.00</p>
    </div>
  );
}
