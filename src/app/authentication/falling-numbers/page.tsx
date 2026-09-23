import { pageMetadata } from "@/lib/page-metadata";
import { AuthFallingNumbers } from "@/components/auth-falling-numbers";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/falling-numbers")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/falling-numbers",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationFallingNumbersPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/authentication"
      contentClassName="max-w-lg"
    >
      <AuthFallingNumbers />
    </BuildExperience>
  );
}
