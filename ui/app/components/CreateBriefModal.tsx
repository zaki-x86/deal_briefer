import { useState, useCallback } from "react";
import { apiUrl } from "../lib/api";

interface CreateBriefModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBriefModal({
  open,
  onClose,
  onSuccess,
}: CreateBriefModalProps) {
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setRawText("");
    setError(null);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = rawText.trim();
      if (!text) {
        setError("Please enter or paste some text.");
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        const response = await fetch(apiUrl("/api/deals/"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_text: text }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.error ?? "Failed to create deal.");
          setSubmitting(false);
          return;
        }
        reset();
        onClose();
        onSuccess();
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
        setSubmitting(false);
      }
    },
    [rawText, onClose, onSuccess, reset]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-brief-title"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="create-brief-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Create brief
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-4 py-3 flex-1 min-h-0">
            <label htmlFor="create-brief-raw-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raw text
            </label>
            <textarea
              id="create-brief-raw-text"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste deal or brief text here..."
              rows={10}
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-y min-h-[120px]"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create brief"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
