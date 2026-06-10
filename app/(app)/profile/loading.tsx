import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-lg px-container-margin pt-lg">
      <div className="flex flex-col items-center py-md">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="mt-4 h-7 w-36" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
      <div className="rounded-xl border border-outline-variant p-lg">
        <Skeleton className="mb-md h-7 w-32" />
        <div className="space-y-md">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-1 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
