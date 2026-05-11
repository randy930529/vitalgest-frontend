import { modalComponents } from "@/app/lib/config/modalConfig";
import ModalTrigger from "@/app/ui/button-modal";

const ModalComponent = modalComponents.changePasswordForm;

export default function ChangePassword({ userId }: { userId: string }) {
  return (
    <ModalTrigger
      title="Cambiar contraseña"
      modelContent={<ModalComponent userId={userId} />}
      buttonToggle={<ButtonChangePassword onClose={() => {}} />}
    />
  );
}

function ButtonChangePassword({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="max-w-lg rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
      onClick={onClose}
    >
      Cambiar contraseña
    </button>
  );
}
