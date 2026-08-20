import { Skeleton } from "@/components/ui/skeleton";

export default function MonitorsLoading() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border bg-card p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
