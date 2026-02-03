export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]" role="status" aria-label="Loading">
      <div className="size-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
    </div>
  );
}
