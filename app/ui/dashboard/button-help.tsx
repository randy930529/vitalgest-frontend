"use client";

import clsx from "clsx";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { STYLES } from "@/app/lib/config/constants";
import ModalTrigger from "@/app/ui/button-modal";

export default function ButtonHelp({ className }: { className: string }) {
  return (
    <ModalTrigger
      title="Manual de usuario"
      type="info"
      modelContent={<HelpManualContent />}
      buttonToggle={<HelpButtonToggle className={className} />}
    />
  );
}

function HelpManualContent({ onClose: _onClose }: { onClose?: () => void }) {
  return (
    <div className={clsx("space-y-4 mb-6", STYLES.boxShadow)}>
      <div className="h-[70vh] w-full overflow-hidden rounded border border-slate-200">
        <iframe
          src="/docs/manual-usuario.pdf"
          title="Manual de usuario"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

function HelpButtonToggle({
  onClose,
  className,
}: {
  onClose?: () => void;
  className: string;
}) {
  return (
    <button type="button" title="Ayuda" className={className} onClick={onClose}>
      <span className="sr-only">View help</span>
      <QuestionMarkCircleIcon className="w-8 h-8" />
    </button>
  );
}
