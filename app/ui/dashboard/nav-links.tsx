import { NAVLINKS } from "@/app/lib/config/constants";
import {
  NavLink,
  NavSubLinks,
  type NavLinkData,
} from "@/app/ui/components/navigation";

type LinkProp = NavLinkData & {
  sublinks?: readonly {
    name: string;
    href: string;
  }[];
};

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const { adminLinks, clientLinks } = NAVLINKS;
  const links: readonly LinkProp[] = isAdmin ? adminLinks : clientLinks;

  return (
    <>
      {links.map((link) => {
        if (!link.sublinks) return <NavLink key={link.name} link={link} />;

        return (
          <NavSubLinks key={link.name} name={link.name} iconName={link.icon}>
            {link.sublinks.map((sublink, index) => (
              <li
                key={sublink.name}
                className="animate-submenu-enter w-full motion-reduce:animate-none"
                style={{
                  animationDelay: `${index * 55}ms`,
                  animationFillMode: "both",
                }}
              >
                <NavLink key={`sub-${sublink.name}`} link={sublink} />
              </li>
            ))}
          </NavSubLinks>
        );
      })}
    </>
  );
}
