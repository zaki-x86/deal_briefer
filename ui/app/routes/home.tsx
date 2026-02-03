import type { Route } from "./+types/home";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Deal } from "../types/Deal";
import { apiUrl, buildDealsQuery, type DealsListParams } from "../lib/api";
import { DealTable } from "../components/DealTable";
import { DealsToolbar } from "../components/DealsToolbar";
import { Pagination } from "../components/Pagination";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

const PAGE_SIZE = 20;

function paramsFromSearchParams(searchParams: URLSearchParams): DealsListParams {
  const page = searchParams.get("page");
  return {
    page: page ? Math.max(1, parseInt(page, 10)) || 1 : 1,
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    sector: searchParams.get("sector") ?? undefined,
    company: searchParams.get("company") ?? undefined,
    stage: searchParams.get("stage") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    ordering: searchParams.get("ordering") ?? "-created_at",
  };
}

function searchParamsFromParams(params: DealsListParams): URLSearchParams {
  const q = new URLSearchParams();
  if (params.page != null && params.page > 1) q.set("page", String(params.page));
  if (params.search?.trim()) q.set("search", params.search.trim());
  if (params.status?.trim()) q.set("status", params.status.trim());
  if (params.sector?.trim()) q.set("sector", params.sector.trim());
  if (params.company?.trim()) q.set("company", params.company.trim());
  if (params.stage?.trim()) q.set("stage", params.stage.trim());
  if (params.category?.trim()) q.set("category", params.category.trim());
  if (params.ordering?.trim() && params.ordering !== "-created_at") {
    q.set("ordering", params.ordering.trim());
  }
  return q;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deal Briefer Dashboard" },
    { name: "description", content: "Welcome to Deal Briefer Dashboard" },
  ];
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = paramsFromSearchParams(searchParams);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setParams = useCallback(
    (next: DealsListParams) => {
      setSearchParams(searchParamsFromParams(next), { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      const query = buildDealsQuery(params);
      const response = await fetch(apiUrl(`/api/deals/${query}`), {
        credentials: "include",
      });
      if (!response.ok) {
        setError("Failed to fetch deals");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setDeals(data.results ?? []);
      setTotalCount(data.count ?? 0);
      setLoading(false);
    };
    fetchDeals().catch((err) => {
      console.error(err);
      setError("Failed to fetch deals");
      setLoading(false);
    });
  }, [
    params.page,
    params.search,
    params.status,
    params.sector,
    params.company,
    params.stage,
    params.category,
    params.ordering,
  ]);

  if (loading && deals.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Deals
          </h1>
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error && deals.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Deals
          </h1>
          <ErrorMessage message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deals
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Search and filter, then click a row to view deal details.
          </p>
        </header>

        <div className="space-y-4">
          <DealsToolbar params={params} onParamsChange={setParams} />

          {error && (
            <ErrorMessage message={error} />
          )}

          <DealTable deals={deals} />

          <Pagination
            page={params.page ?? 1}
            count={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setParams({ ...params, page })}
          />
        </div>
      </div>
    </main>
  );
}
