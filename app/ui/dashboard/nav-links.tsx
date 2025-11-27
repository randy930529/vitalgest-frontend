import Link from "next/link";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import NavSubLinks from "@/app/ui/dashboard/nav-sublinks";

export type LinkProp = {
  name: string;
  href: string;
  icon?: React.ElementType;
};

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
    href: "",
    icon: DocumentDuplicateIcon,
    sublinks: [
      {
        name: "Farmacias",
        href: `/dashboard/supplies/pharmacies`,
      },
      {
        name: "Ambulancias",
        href: `/dashboard/supplies/ambulances`,
      },
    ],
  },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        if (!link.sublinks) return <NavLink key={link.name} link={link} />;

        const LinkIcon = link.icon;
        return (
          <NavSubLinks
            key={link.name}
            name={link.name}
            icon={<LinkIcon className="w-6 h-6" />}
          >
            {link.sublinks.map((sublink) => (
              <li key={sublink.name} className="pl-8">
                <NavLink key={"sub-" + sublink.name} link={sublink} />
              </li>
            ))}
          </NavSubLinks>
        );
      })}
    </>
  );
}

function NavLink({ link }: { link: LinkProp }) {
  const LinkIcon = link.icon;

  return (
    <Link
      key={link.name}
      href={link.href}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      {LinkIcon && <LinkIcon className="w-6 h-6" />}
      <p className="hidden md:block">{link.name}</p>
    </Link>
  );
}
