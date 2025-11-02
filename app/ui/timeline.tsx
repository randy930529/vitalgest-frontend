import { TimelinePropsType } from "@/app/lib/definitions";
import { getStatusIcon } from "@/app/lib/utils";

export default function Timeline({
  steps,
  currentStepId,
  progress = 0,
  showStatus,
}: TimelinePropsType) {
  if (showStatus) {
    progress = 100;
  }

  return (
    <ol
      className={
        "flex flex-col justify-evenly gap-2 relative border-l border-gray-200 dark:border-gray-700"
      }
    >
      <div
        key={`progress-${progress}`}
        className={`absolute -left-0.5 top-0 h-[${String(
          progress
        )}%] border border-x-green-600 transition-all duration-300`}
        style={{ height: `${String(progress)}%` }}
      />

      {steps.map((step) => {
        const isCurrent = step.id === currentStepId;
        const status = showStatus
          ? getStatusIcon("completed")
          : getStatusIcon(step.status);
        const StatusIcon = status.icon;

        return (
          <li key={step.id} className="flex flex-row items-center">
            <span
              className={`text-xs mx-2 ml-3.5 p-0.5 text-center ${
                isCurrent && "font-semibold border border-blue-500 shadow-md"
              } shadow-md rounded sm:block md:text-sm`}
            >
              {step.label}
            </span>
            <StatusIcon
              className={`z-10 absolute bg-white w-6 h-6 -left-3.5 rounded-full ${status.color}`}
            />
          </li>
        );
      })}
    </ol>
  );
}
