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
              <li key={sublink.name} className="w-full">
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
  const labelClass = LinkIcon ? "hidden md:block" : "block";
  const isSubLink = !LinkIcon;
  const linkClass = isSubLink
    ? "group flex h-[48px] w-full items-center justify-start gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-800 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 md:justify-start md:px-3"
    : "group flex h-[52px] w-[52px] flex-none items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 md:h-[48px] md:w-full md:justify-start md:px-3";

  return (
    <Link key={link.name} href={link.href} className={linkClass}>
      {LinkIcon && (
        <LinkIcon className="h-5 w-5 text-slate-700 transition group-hover:text-rose-600" />
      )}
      <p className={labelClass}>{link.name}</p>
    </Link>
  );
}
