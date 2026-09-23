import { pageMetadata } from "@/lib/page-metadata";
import { AuthOtpTwo } from "@/components/auth-otp-two";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/otp-2")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/otp-2",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationOtpTwoPage({
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
      <AuthOtpTwo />
    </BuildExperience>
  );
}
