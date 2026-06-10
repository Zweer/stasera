import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 px-5 pt-6">
      <div className="flex flex-col items-center py-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="mt-4 h-7 w-36" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
      <div className="rounded-xl border border-outline-variant p-6">
        <Skeleton className="mb-4 h-7 w-32" />
        <div className="space-y-4">
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
