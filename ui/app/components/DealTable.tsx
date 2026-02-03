import { useNavigate } from "react-router";
import type { Deal } from "../types/Deal";

interface DealTableProps {
  deals: Deal[];
}

function cell(value: string | number | undefined | null, fallback = "—") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

export function DealTable({ deals }: DealTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Company
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Sector
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Category
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Stage
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {deals.map((deal) => {
            const entities = deal.extracted_json?.entities;
            const tags = deal.extracted_json?.tags;
            const company = entities?.company ?? "—";
            const sector = entities?.sector ?? "—";
            const category = tags?.category?.join(", ") ?? "—";
            const stage = tags?.stage ?? entities?.stage ?? "—";

            return (
              <tr
                key={deal.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/deals/${deal.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/deals/${deal.id}`);
                  }
                }}
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800/80"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {cell(company)}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{cell(sector)}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{cell(category)}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{cell(stage)}</td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(deal.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
