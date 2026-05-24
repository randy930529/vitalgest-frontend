"use client";

import Link from "next/link";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import {
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { UserType } from "@/app/lib/definitions";
import { STYLES } from "@/app/lib/config/constants";
import ModalTrigger from "@/app/ui/button-modal";
import UserMenuDropdown from "@/app/ui/profile/user-menu-dropdown";

export default function NavBar({
  user,
  showCog,
  variant = "light",
}: {
  user: UserType;
  showCog?: boolean;
  variant?: "light" | "dark";
}) {
  const { id, email, name, lastname } = user;
  const iconButtonClass =
    variant === "dark"
      ? "mx-1 p-2 text-slate-100 rounded-lg hover:text-white hover:bg-white/15 focus:ring-2 focus:ring-white/35"
      : "mx-1 p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600";

  return (
    <nav className="relative flex w-full items-center justify-center md:w-auto md:justify-end lg:order-2">
      {showCog && (
        <Link
          href="/dashboard"
          data-tooltip-id="admin-tooltip"
          className={iconButtonClass}
        >
          <span className="sr-only">Link administration</span>
          {/* <!-- Cog icon --> */}
          <Cog6ToothIcon className="w-8 h-8" />
          <Tooltip id="admin-tooltip" content="Panel Administrativo" />
        </Link>
      )}
      {/* <!-- Notifications --> */}
      <button
        type="button"
        data-tooltip-id="notification-tooltip"
        data-dropdown-toggle="notification-dropdown"
        className={iconButtonClass}
      >
        <span className="sr-only">View notifications</span>
        {/* <!-- Bell icon --> */}
        <BellIcon className="w-8 h-8" />
        <Tooltip id="notification-tooltip" content="Notificaciones" />
      </button>
      {/* <!-- help --> */}
      <ModalTrigger
        title="Manual de usuario"
        type="info"
        modelContent={<HelpManualContent />}
        buttonToggle={<HelpButtonToggle className={iconButtonClass} />}
      />
      <UserMenuDropdown
        key={`user-${id}`}
        id={id}
        email={email}
        name={name}
        lastname={lastname}
        buttonClassName={iconButtonClass}
      />
    </nav>
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
    <button
      type="button"
      data-tooltip-id="question-tooltip"
      className={className}
      onClick={onClose}
    >
      <span className="sr-only">View help</span>
      <QuestionMarkCircleIcon className="w-8 h-8" />
      <Tooltip id="question-tooltip" content="Ayuda" />
    </button>
  );
}
