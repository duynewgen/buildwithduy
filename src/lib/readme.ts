import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Exact contents of the repo README.md (read at build / request time). */
export function getReadmeMarkdown() {
  return readFileSync(join(process.cwd(), "README.md"), "utf8");
}
