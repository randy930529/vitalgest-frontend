import {
  ArchiveBoxIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  HomeIcon,
  InboxArrowDownIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export const NAV_ICONS = {
  Truck: TruckIcon,
  BuildingOffice: BuildingOfficeIcon,
  ClipboardDocument: ClipboardDocumentListIcon,
  ShieldCheck: ShieldCheckIcon,
  Home: HomeIcon,
  DocumentText: DocumentTextIcon,
  DocumentDuplicate: DocumentDuplicateIcon,
  UserGroup: UserGroupIcon,
  InboxArrowDown: InboxArrowDownIcon,
  ClipboardDocumentCheck: ClipboardDocumentCheckIcon,
  ArchiveBox: ArchiveBoxIcon,
} as const satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type NavIconName = keyof typeof NAV_ICONS;
