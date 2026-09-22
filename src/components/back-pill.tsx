import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackPillProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
};

const pillClassName =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-sm text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50";

export function BackPill({ href, onClick, className = "" }: BackPillProps) {
  const classes = `${pillClassName} ${className}`.trim();

  const content = (
    <>
      <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
      back
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
