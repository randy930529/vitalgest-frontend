import { SkeletonBlock, SkeletonLine, SkeletonPanel } from "@/app/ui/skeleton";

export function CurrentGuardSkeleton() {
  return (
    <SkeletonPanel ariaLabel="Cargando guardia en curso">
      <SkeletonLine className="h-6 w-56" />
      <SkeletonLine className="h-4 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>
      <SkeletonBlock className="h-48" />
    </SkeletonPanel>
  );
}

export function GuardHistorySkeleton() {
  return (
    <SkeletonPanel ariaLabel="Cargando historial de guardias">
      <SkeletonLine className="h-6 w-64" />
      <SkeletonLine className="h-4 w-80" />
      <SkeletonBlock className="h-[320px]" />
    </SkeletonPanel>
  );
}
