export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading services</span>
      <div className="h-9 w-64 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded bg-slate-200" />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="aspect-4/3 animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-9 animate-pulse rounded bg-slate-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
