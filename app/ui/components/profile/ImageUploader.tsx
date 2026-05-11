import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CameraIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { ImageUploaderValue } from "@/app/lib/definitions";

type ImageUploaderProps = {
  label: string;
  hint: string;
  value: ImageUploaderValue;
  accept?: string;
  aspect?: "square" | "wide";
  emptyTitle: string;
  emptyDescription: string;
  buttonLabel: string;
  onChange: (file: File | null) => void;
  meta?: ReactNode;
};

function getPreviewSource(value: ImageUploaderValue) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return URL.createObjectURL(value as Blob);
}

export function ImageUploader({
  label,
  hint,
  value,
  accept = "image/*",
  aspect = "square",
  emptyTitle,
  emptyDescription,
  buttonLabel,
  onChange,
  meta,
}: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const source = getPreviewSource(value);
    setPreviewSrc(source);

    if (typeof value === "string" || !source) {
      return;
    }

    return () => {
      URL.revokeObjectURL(source);
    };
  }, [value]);

  function handleFile(file: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    onChange(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
        {previewSrc ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-medium text-rose-600 transition hover:text-rose-700"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          "group relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-dashed bg-white transition",
          aspect === "square" ? "min-h-[280px]" : "min-h-[210px]",
          previewSrc
            ? "border-rose-200 shadow-[0_20px_45px_-30px_rgba(244,63,94,0.45)]"
            : "border-slate-200 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)]",
          isDragging
            ? "border-rose-400 bg-rose-50/70"
            : "hover:border-rose-300 hover:bg-slate-50/70",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
        />

        {previewSrc ? (
          <div className="relative flex h-full flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(254,242,242,0.9),_rgba(255,255,255,1)_58%)] p-5">
            <div
              className={[
                "relative w-full overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_16px_36px_-28px_rgba(15,23,42,0.45)]",
                aspect === "square"
                  ? "aspect-square max-w-[240px]"
                  : "aspect-[16/7]",
              ].join(" ")}
            >
              <img
                src={previewSrc}
                alt={label}
                className={[
                  "h-full w-full",
                  aspect === "square" ? "object-cover" : "object-contain p-4",
                ].join(" ")}
              />
            </div>

            <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <CameraIcon className="h-4 w-4 text-rose-500" />
              Cambiar imagen
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-6 py-10 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-inner shadow-rose-100">
              <ArrowUpTrayIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-semibold text-slate-800">
                {emptyTitle}
              </p>
              <p className="mx-auto max-w-sm text-sm leading-6 text-slate-500">
                {emptyDescription}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-rose-500">
              {buttonLabel}
            </span>
            {meta ? <div className="pt-2">{meta}</div> : null}
          </div>
        )}
      </label>
    </div>
  );
}
