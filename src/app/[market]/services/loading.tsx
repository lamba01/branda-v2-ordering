export default function Loading() {
  return (
    <div className="grid gap-8 lg:grid-cols-2" aria-busy="true">
      <span className="sr-only" role="status">
        Loading service
      </span>
      <div className="aspect-4/3 animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-9 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-16 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
