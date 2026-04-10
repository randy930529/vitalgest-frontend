import Link from "next/link";
import {
  ExclamationTriangleIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

type StateFeedbackProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyStateCard({
  title,
  description,
  actionLabel,
  actionHref,
}: StateFeedbackProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
      <div className="flex items-start gap-3">
        <span className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
          <InboxIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-semibold text-slate-800">{title}</p>
          <p className="mt-2 text-sm">{description}</p>
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorStateCard({
  title,
  description,
  actionLabel,
  actionHref,
}: StateFeedbackProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <div className="flex items-start gap-3">
        <span className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600">
          <ExclamationTriangleIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-2 text-sm text-rose-600">{description}</p>
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="mt-4 inline-flex items-center rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
