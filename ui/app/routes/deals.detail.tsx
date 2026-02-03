import type { Route } from "./+types/deals.detail";
import { Link, useLoaderData } from "react-router";
import type { Deal } from "../types/Deal";
import { apiUrl } from "../lib/api";

export function meta({ data }: Route.MetaArgs) {
  const deal = data as Deal | undefined;
  const title = deal?.extracted_json?.entities?.company ?? deal?.id ?? "Deal";
  return [
    { title: `${title} | Deal Briefer` },
    { name: "description", content: "Deal details" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { id } = params;
  const url = apiUrl(`/api/deals/${id}/`);
  const response = await fetch(url, {
    signal: request.signal,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Response("Deal not found", { status: 404 });
  }
  const deal: Deal = await response.json();
  return deal;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h2>
      <div className="text-gray-900 dark:text-gray-100">{children}</div>
    </section>
  );
}

export default function DealDetail() {
  const deal = useLoaderData<typeof loader>();

  const entities = deal.extracted_json?.entities;
  const tags = deal.extracted_json?.tags;
  const brief = deal.extracted_json?.investment_brief;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          ← Back to deals
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {entities?.company ?? "—"}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                deal.status === "processed"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : deal.status === "failed"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
              }`}
            >
              {deal.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created {new Date(deal.created_at).toLocaleString()}
            {" · "}
            Updated {new Date(deal.updated_at).toLocaleString()}
          </p>
        </header>

        <div className="space-y-6">
          {entities && (
            <Section title="Entities">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Sector
                  </dt>
                  <dd className="mt-0.5">{entities.sector ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Geography
                  </dt>
                  <dd className="mt-0.5">{entities.geography ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Stage
                  </dt>
                  <dd className="mt-0.5">{entities.stage ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Round size (USD)
                  </dt>
                  <dd className="mt-0.5">
                    {entities.round_size_usd != null
                      ? entities.round_size_usd.toLocaleString()
                      : "—"}
                  </dd>
                </div>
                {entities.founders?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Founders
                    </dt>
                    <dd className="mt-0.5">
                      {entities.founders.join(", ")}
                    </dd>
                  </div>
                ) : null}
                {entities.notable_metrics?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Notable metrics
                    </dt>
                    <dd className="mt-0.5">
                      {entities.notable_metrics.join(", ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Section>
          )}

          {tags && (tags.category?.length || tags.stage?.length) ? (
            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {tags.category?.map((c) => (
                  <span
                    key={c}
                    className="inline-flex rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {c}
                  </span>
                ))}
                {tags.stage !== undefined && (
                  <span
                    key={tags.stage}
                    className="inline-flex rounded-md bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300"
                  >
                    {tags.stage}
                  </span>
                )}
              </div>
            </Section>
          ) : null}

          {brief?.length ? (
            <Section title="Investment brief">
              <ul className="list-disc list-inside space-y-2 text-sm">
                {brief.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section title="Raw text">
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-sm overflow-x-auto">
              {deal.raw_text || "—"}
            </pre>
          </Section>

          {deal.last_error ? (
            <Section title="Last error">
              <p className="text-sm text-red-700 dark:text-red-300">
                {deal.last_error}
              </p>
            </Section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
