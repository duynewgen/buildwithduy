import { CategoryPageSkeleton } from "@/components/skeletons";

export default function Loading() {
  return <CategoryPageSkeleton category="payment" cards={6} />;
}
