"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  type?: "edit" | "delete" | "info";
  question?: string;
  details?: string;
  onClose: () => void;
}

export default function Modal({
  children,
  isOpen,
  title,
  type = "edit",
  question,
  details,
  onClose,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, mounted]);

  if (!isOpen) return null;
  if (!mounted) return null;

  const modalContent = (
    // <!-- Main modal -->
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-[120] flex h-screen w-screen items-start justify-center overflow-y-auto overflow-x-hidden bg-black/50 px-2 py-4 sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div className="relative w-full max-w-2xl md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative max-h-[calc(100vh-2rem)] overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 sm:max-h-[calc(100vh-3rem)]">
          {/* <!-- Modal header --> */}
          <div
            className={clsx(
              "flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 sm:px-8",
              {
                "bg-blue-800": type === "edit",
                "bg-red-400": type === "delete",
                "bg-white": type === "info",
              },
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={clsx(
                "text-lg font-semibold text-gray-300 dark:text-white",
                {
                  "text-gray-900": type === "info",
                },
              )}
            >
              {title}
            </h3>
            <button
              type="button"
              className={clsx(
                "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-300 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                {
                  "text-gray-400": type === "info",
                },
              )}
              data-modal-toggle="defaultModal"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div
            className="modal-body max-h-[calc(100vh-6.5rem)] space-y-3 overflow-y-auto p-4 sm:max-h-[calc(100vh-8rem)] sm:px-8 sm:py-5"
            onClick={(e) => e.stopPropagation()}
          >
            {question && <p className="w-full text-center">{question}</p>}
            {details && (
              <div className="rounded-lg bg-orange-100 p-6">
                <p>{details}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
