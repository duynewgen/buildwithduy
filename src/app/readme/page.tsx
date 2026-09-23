import { redirect } from "next/navigation";

/** Old /readme URL — content now lives at `/`. */
export default function ReadmeRedirect() {
  redirect("/");
}
