"use client";

export default function ServiceError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center"
    >
      <h2 className="text-lg font-semibold text-rose-900">
        We couldn&apos;t load this service
      </h2>
      <p className="mt-1 text-rose-800">Please try again in a moment.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-rose-700"
      >
        Try again
      </button>
    </div>
  );
}
