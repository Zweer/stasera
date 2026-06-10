import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <div className="px-container-margin pt-lg">
      <Skeleton className="mb-lg h-14 w-full rounded-xl" />
      <div className="mb-xl flex gap-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-full" />
        ))}
      </div>
      <Skeleton className="mb-md h-7 w-48" />
      <div className="space-y-md">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
