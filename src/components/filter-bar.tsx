"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  INDUSTRIES,
  URGENCIES,
  USE_CASES,
  industryLabels,
  sortLabels,
  SORTS,
  urgencyLabels,
  useCaseLabels,
} from "@/lib/constants";
import type { ServiceFilters } from "@/types";

const selectClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-700";

export function FilterBar({ filters }: { filters: ServiceFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.q ?? "");

  const hasActiveFilters = Boolean(
    filters.q ||
    filters.category ||
    filters.useCase ||
    filters.industry ||
    filters.urgency ||
    filters.sort !== "popular",
  );

  function go(params: URLSearchParams) {
    params.delete("page"); // any change goes back to page 1
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    go(params);
  }

  // Debounced search: wait 300ms after the last keystroke before updating the URL
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === (searchParams.get("q") ?? "")) return;

    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 300);

    return () => clearTimeout(id);
  }, [query, searchParams, pathname, router]);

  function clearAll() {
    setQuery("");
    router.push(pathname, { scroll: false });
  }

  return (
    <section aria-label="Search and filters" className="space-y-4">
      <div>
        <label
          htmlFor="service-search"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          Search services
        </label>
        <input
          id="service-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try logo, mugs, banner..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-indigo-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="f-usecase"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Use case
          </label>
          <select
            id="f-usecase"
            value={filters.useCase ?? ""}
            onChange={(e) => setParam("useCase", e.target.value)}
            className={selectClass}
          >
            <option value="">All use cases</option>
            {USE_CASES.map((v) => (
              <option key={v} value={v}>
                {useCaseLabels[v]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="f-industry"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Industry
          </label>
          <select
            id="f-industry"
            value={filters.industry ?? ""}
            onChange={(e) => setParam("industry", e.target.value)}
            className={selectClass}
          >
            <option value="">All industries</option>
            {INDUSTRIES.map((v) => (
              <option key={v} value={v}>
                {industryLabels[v]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="f-urgency"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Turnaround
          </label>
          <select
            id="f-urgency"
            value={filters.urgency ?? ""}
            onChange={(e) => setParam("urgency", e.target.value)}
            className={selectClass}
          >
            <option value="">Any turnaround</option>
            {URGENCIES.map((v) => (
              <option key={v} value={v}>
                {urgencyLabels[v]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="f-sort"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Sort by
          </label>
          <select
            id="f-sort"
            value={filters.sort}
            onChange={(e) =>
              setParam(
                "sort",
                e.target.value === "popular" ? "" : e.target.value,
              )
            }
            className={selectClass}
          >
            {SORTS.map((v) => (
              <option key={v} value={v}>
                {sortLabels[v]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-indigo-700"
        >
          Clear all filters
        </button>
      )}
    </section>
  );
}
