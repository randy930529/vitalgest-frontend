import Link from "next/link";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Inicio", href: "/dashboard", icon: HomeIcon },
  { name: "Personal", href: "/dashboard/users", icon: UserGroupIcon },
  {
    name: "Vehículos",
    href: "/dashboard/vehicles",
    icon: ShieldCheckIcon,
  },
  {
    name: "Inventario",
    href: "/dashboard/inventory",
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
