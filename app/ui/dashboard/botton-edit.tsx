import Link from "next/link";
import clsx from "clsx";
import { PencilIcon } from "@heroicons/react/24/outline";
import { STYLES } from "@/app/lib/config/constants";

export type TableActionProps = {
  editLink: string;
  title?: string;
  customStyle?: string;
  icon?: React.ElementType;
};

const buttonStyle =
  "border-slate-300 bg-white text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700";

export default function TableActionEdit({
  editLink,
  title,
  customStyle,
  icon: Icon,
}: TableActionProps) {
  return (
    <Link
      href={editLink}
      className={clsx(STYLES.buttonTableAction, customStyle || buttonStyle)}
      aria-label={title || "Editar registro"}
    >
      {Icon ? <Icon className="w-4" /> : <PencilIcon className="w-4" />}
    </Link>
  );
}
