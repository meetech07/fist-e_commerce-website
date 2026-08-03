import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <div className="mb-8">
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-11 w-72" />
        <Skeleton className="mt-3 h-4 w-[30rem] max-w-full" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
