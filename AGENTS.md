<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Typography

- Body/UI font is Rubik via `font-sans`. Do not fall back to a generic system stack as the primary body font — Rubik only (Schoolbell for titles).
- All numeric displays (slider values, dates, counters, step indicators, etc.) use Rubik via `font-sans` (or inherit the body font). Never use monospace (`font-mono`) or Schoolbell (`font-display`) for numbers.
- Keep Schoolbell (`font-display`) for big titles only.

# Copy

- All UI wording is lowercase (titles, descriptions, buttons, labels, errors, metadata). Do not use CSS `uppercase` on labels or other copy.

# Buttons

- Action buttons use a pill shape (`rounded-full`), matching the top-left back pill.

# Build pages

- URL shape: `/{category}/{build}` (e.g. `/birthday/slider`). Do not put a build at a bare category root.
- Category pages at `/{category}` are simple directories (small logo + category nav + build shortcuts). Do not redirect them into a build.
- Categories live in `src/lib/builds.ts` (`categories`) in sidebar order; empty categories are allowed.
- Site root `/` is the homepage (readme.md content). Logo links here. Categories live at `/{category}`.
- Build title is the short build name only (e.g. `slider`), not prefixed with the category.
- Use `BuildShell` for every experiment/build route; pass `backHref` to the category page.
- Title + description stay at the **top** (centered). Interactive build content is centered in the **remaining space below the header** (never overlays the title).
- Top-left back pill navigates to the category page. Do not put the logo on build pages.
- Metadata title template uses a hyphen: `%s - buildwithduy` (not a middle dot).
- Register every public build in `src/lib/builds.ts` (directories + sitemap). After each new build: route + registry entry + confirm sitemap.
- Creator filming mode: `?creator=true` on a build URL — no title/description; name + birth-year form; year field opens year-only build modal via `BuildExperience`.
- Every build ships a shortcut thumbnail demo that animates on card hover via `group-hover` (idle preview → short motion that hints at the interaction). Wire it in `BuildShortcut`. No idle autoplay loops.
- Date thumbnails always show today’s date (`src/lib/today.ts`); never hardcode or randomize. Use `suppressHydrationWarning` on the date text.

# Project context

Living conventions (also in `.cursor/rules/project-context.mdc`). Idea backlog: personal AgentStore `cursed-ideas.md` — private, never publish.

## Site

- Categories so far: `birthday`, `payment`, `authentication` (renamed from `password`).
- `/` = readme homepage. Category pages: fixed sidebar + scrolling content.
- Assets under `public/{category}/`. New build = route + `builds.ts` + hover demo + sitemap.

## Authentication builds

- Fake sign-in → cursed challenge → `you're checked in`.
- Demo phone `0123456789` (readonly). Dark zinc pill CTA (`verify with otp`). Card: `rounded-2xl … border-zinc-200`. Inputs `rounded-xl`; buttons `rounded-full`.
- Modals: portal + ~220ms fade (`modalMounted` / `modalActive`), Escape to close.
- OTP/games collect digits via play; prefer any-order unless the gag needs a fixed code. Tabular `font-sans` numbers only.
