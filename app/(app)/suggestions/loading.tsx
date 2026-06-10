import { Skeleton } from "@/components/ui/skeleton";

export default function SuggestionsLoading() {
  return (
    <div className="px-container-margin pt-lg">
      <Skeleton className="mb-2 h-8 w-56" />
      <Skeleton className="mb-lg h-5 w-72" />
      <div className="mx-auto flex max-w-lg flex-col gap-lg">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-outline-variant"
          >
            <Skeleton className="h-[320px] w-full sm:h-[400px]" />
            <div className="space-y-md p-lg">
              <div className="flex items-start gap-md">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
