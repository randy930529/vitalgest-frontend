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
  if (!isOpen) return null;

  return (
    // <!-- Main modal -->
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-modal h-full bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          {/* <!-- Modal header --> */}
          <div
            className={clsx(
              "flex justify-between items-center p-4 rounded-t border-b dark:border-gray-600 sm:px-8",
              {
                "bg-blue-800": type === "edit",
                "bg-red-400": type === "delete",
                "bg-white": type === "info",
              }
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={clsx(
                "text-lg font-semibold text-gray-300 dark:text-white",
                {
                  "text-gray-900": type === "info",
                }
              )}
            >
              {title}
            </h3>
            <button
              type="button"
              className={clsx(
                "text-gray-300 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white",
                {
                  "text-gray-400": type === "info",
                }
              )}
              data-modal-toggle="defaultModal"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div
            className="modal-body p-4 sm:px-8 sm:py-5"
            onClick={(e) => e.stopPropagation()}
          >
            {question && <p className="w-full text-center">{question}</p>}
            {details && (
              <div className="bg-orange-100 rounded-lg p-6">
                <p>{details}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
