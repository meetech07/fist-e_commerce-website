import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <div className="relative mb-10 overflow-hidden rounded-3xl">
        <Skeleton className="h-52 w-full rounded-none sm:h-64" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
