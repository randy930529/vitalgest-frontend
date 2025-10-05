export function InlineErrors({
  errors,
  errorId,
}: {
  errors: string[];
  errorId: string;
}) {
  return (
    <div id={errorId} aria-live="polite" aria-atomic="true">
      {errors.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
