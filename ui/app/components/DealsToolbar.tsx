import { useEffect, useState } from "react";
import type { DealsListParams } from "../lib/api";

const DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "pending", label: "Pending" },
  { value: "processed", label: "Processed" },
  { value: "failed", label: "Failed" },
];

const STAGE_OPTIONS = [
  { value: "", label: "Any stage" },
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "Any category" },
  { value: "fintech", label: "Fintech" },
  { value: "deep tech", label: "Deep tech" },
  { value: "climate tech", label: "Climate tech" },
];

const ORDERING_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "-updated_at", label: "Recently updated" },
  { value: "updated_at", label: "Least recently updated" },
  { value: "status", label: "Status A–Z" },
  { value: "-status", label: "Status Z–A" },
];

interface DealsToolbarProps {
  params: DealsListParams;
  onParamsChange: (params: DealsListParams) => void;
}

export function DealsToolbar({ params, onParamsChange }: DealsToolbarProps) {
  const [searchLocal, setSearchLocal] = useState(params.search ?? "");
  const [sectorLocal, setSectorLocal] = useState(params.sector ?? "");
  const [companyLocal, setCompanyLocal] = useState(params.company ?? "");

  useEffect(() => {
    setSearchLocal(params.search ?? "");
    setSectorLocal(params.sector ?? "");
    setCompanyLocal(params.company ?? "");
  }, [params.search, params.sector, params.company]);

  const update = (partial: Partial<DealsListParams>) => {
    onParamsChange({ ...params, ...partial, page: 1 });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchLocal !== (params.search ?? "")) {
        onParamsChange({ ...params, search: searchLocal || undefined, page: 1 });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchLocal, params.search]);

  const flushSector = () => {
    if (sectorLocal !== (params.sector ?? "")) update({ sector: sectorLocal || undefined });
  };
  const flushCompany = () => {
    if (companyLocal !== (params.company ?? "")) update({ company: companyLocal || undefined });
  };

  const clearAll = () => {
    setSearchLocal("");
    setSectorLocal("");
    setCompanyLocal("");
    onParamsChange({
      page: 1,
      ordering: "-created_at",
    });
  };

  const hasActiveFilters =
    params.search?.trim() ||
    params.status?.trim() ||
    params.sector?.trim() ||
    params.company?.trim() ||
    params.stage?.trim() ||
    params.category?.trim();

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="deals-search" className="sr-only">
            Search deals
          </label>
          <input
            id="deals-search"
            type="search"
            placeholder="Search in raw text..."
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search in raw text"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label htmlFor="deals-status" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                id="deals-status"
                value={params.status ?? ""}
                onChange={(e) => update({ status: e.target.value || undefined })}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value || "any"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="deals-stage" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Stage
              </label>
              <select
                id="deals-stage"
                value={params.stage ?? ""}
                onChange={(e) => update({ stage: e.target.value || undefined })}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o.value || "any"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="deals-category" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                id="deals-category"
                value={params.category ?? ""}
                onChange={(e) => update({ category: e.target.value || undefined })}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value || "any"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="deals-sector" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Sector
              </label>
              <input
                id="deals-sector"
                type="text"
                placeholder="Sector"
                value={sectorLocal}
                onChange={(e) => setSectorLocal(e.target.value)}
                onBlur={flushSector}
                onKeyDown={(e) => e.key === "Enter" && flushSector()}
                className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="deals-company" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Company
              </label>
              <input
                id="deals-company"
                type="text"
                placeholder="Company"
                value={companyLocal}
                onChange={(e) => setCompanyLocal(e.target.value)}
                onBlur={flushCompany}
                onKeyDown={(e) => e.key === "Enter" && flushCompany()}
                className="w-36 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="ml-auto">
            <label htmlFor="deals-ordering" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sort
            </label>
            <select
              id="deals-ordering"
              value={params.ordering ?? "-created_at"}
              onChange={(e) => update({ ordering: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ORDERING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
