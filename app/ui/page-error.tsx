import Link from "next/link";

const customErrorTitles: Record<number, string> = {
  404: "404 Not Found",
  500: "500 Internal Server Error",
};

export function Notfound404({
  error,
  message,
  goBack,
}: {
  error: number;
  message?: string;
  goBack: string;
}) {
  return (
    <>
      <h2 className="text-xl font-semibold">{customErrorTitles[error]}</h2>
      <p>{message && message}</p>
      <Link
        href={goBack}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Volver
      </Link>
    </>
  );
}
