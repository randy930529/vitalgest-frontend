import Link from "next/link";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Inicio", href: "/dashboard", icon: HomeIcon },
  { name: "Usuarios", href: "/dashboard/users", icon: UserGroupIcon },
  {
    name: "Delegaciones",
    href: "/dashboard/delegations",
    icon: BuildingOfficeIcon,
  },
  {
    name: "Ambulancias",
    href: "/dashboard/ambulances",
    icon: TruckIcon,
  },
  {
    name: "Guardias",
    href: "/dashboard/guards",
    icon: ShieldCheckIcon,
  },
  {
    name: "Insumos",
    href: `/dashboard/supplies/pharmacies/{pharmacyId}`,
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
