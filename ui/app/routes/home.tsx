import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import type { Deal } from "../types/Deal";
import { apiUrl } from "../lib/api";
import { DealTable } from "../components/DealTable";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deal Briefer Dashboard" },
    { name: "description", content: "Welcome to Deal Briefer Dashboard" },
  ];
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      const response = await fetch(apiUrl("/api/deals/"), {
        credentials: "include",
      });
      if (!response.ok) {
        setError("Failed to fetch deals");
        setLoading(false);
        return;
      }
      const data: Deal[] = await response.json();
      setDeals(data);
      setLoading(false);
    };
    fetchDeals().catch((err) => {
      console.error(err);
      setError("Failed to fetch deals");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Deals Briefer Dashboard
          </h1>
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Deals Briefer Dashboard
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
            Deals Briefer Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Click a row to view deal details.
          </p>
        </header>
        <DealTable deals={deals} />
      </div>
    </main>
  );
}
