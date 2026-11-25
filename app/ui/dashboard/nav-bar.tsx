import { Suspense } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { UserType } from "@/app/lib/definitions";
import ButtonHelp from "@/app/ui/dashboard/button-help";
import UserMenuDropdown from "@/app/ui/profile/user-menu-dropdown";
import { WrapperNotifications } from "@/app/ui/dashboard/wrappers";
import LinkAdminDashboard from "@/app/ui/dashboard/link-admin-dashboard";
import NotificationsMenuDropdown from "@/app/ui/profile/notifications-menu-dropdown";

export default function NavBar({
  user,
  isAdmin,
  variant = "light",
}: {
  user: UserType;
  isAdmin?: boolean;
  variant?: "light" | "dark";
}) {
  const { id, email, name, lastname, delegationId } = user;

  const iconButtonClass =
    variant === "dark"
      ? "mx-1 p-2 text-slate-100 rounded-lg hover:text-white hover:bg-white/15 focus:ring-2 focus:ring-white/35"
      : "mx-1 p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600";

  return (
    <nav className="relative flex w-full items-center justify-center md:w-auto md:justify-end lg:order-2">
      {/* <!-- Dashboard --> */}
      <LinkAdminDashboard showCog={isAdmin} buttonClassName={iconButtonClass} />

      {/* <!-- Notifications --> */}
      <Suspense
        fallback={
          <button type="button" className={iconButtonClass}>
            <span className="sr-only">View notifications</span>
            {/* <!-- Bell icon --> */}
            <BellIcon className="w-8 h-8" />
          </button>
        }
      >
        <WrapperNotifications
          delegationId={delegationId}
          buttonClassName={iconButtonClass}
          isAdmin={isAdmin}
          WrappedComponent={NotificationsMenuDropdown}
        />
      </Suspense>

      {/* <!-- help --> */}
      <ButtonHelp className={iconButtonClass} />
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
