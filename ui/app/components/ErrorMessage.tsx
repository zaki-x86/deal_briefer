interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-red-800 dark:text-red-200"
      role="alert"
    >
      <p className="font-medium">Error</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
