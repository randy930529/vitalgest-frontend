"use client";

export default function TableCheckbox({
  id,
  checked,
  ariaLabel,
  onChange,
}: {
  id: string;
  checked: boolean;
  ariaLabel: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded-sm border-slate-300 bg-white text-rose-600 focus:ring-2 focus:ring-rose-300"
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
    </div>
  );
}
