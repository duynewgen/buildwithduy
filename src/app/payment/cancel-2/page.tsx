import { pageMetadata } from "@/lib/page-metadata";
import { PaymentCancelTwo } from "@/components/payment-cancel-two";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/cancel-2")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/cancel-2",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentCancelTwoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/payment"
      contentClassName="max-w-lg"
    >
      <PaymentCancelTwo />
    </BuildExperience>
  );
}
