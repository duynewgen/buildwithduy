import { pageMetadata } from "@/lib/page-metadata";
import { PasswordTwoFactorTwo } from "@/components/password-two-factor-two";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/two-factor-2")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/two-factor-2",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationTwoFactorTwoPage({
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
      <PasswordTwoFactorTwo />
    </BuildExperience>
  );
}
