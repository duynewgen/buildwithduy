import Link from "next/link";

type BackPillProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
};

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3 5 8l5 5" />
      <path d="M5 8h7" />
    </svg>
  );
}

const pillClassName =
  "inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-sm text-zinc-800 transition hover:border-zinc-900 hover:bg-zinc-50";

export function BackPill({ href, onClick, className = "" }: BackPillProps) {
  const classes = `${pillClassName} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        <BackIcon />
        back
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <BackIcon />
      back
    </button>
  );
}
