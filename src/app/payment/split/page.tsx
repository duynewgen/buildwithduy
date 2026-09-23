import { pageMetadata } from "@/lib/page-metadata";
import { PaymentSplit } from "@/components/payment-split";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/split")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/split",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentSplitPage({ searchParams }: PageProps) {
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
      <PaymentSplit />
    </BuildExperience>
  );
}
