import Image from "next/image";
import { UserType } from "@/app/lib/definitions";
import { createSignatureURL } from "@/app/lib/utils";

type ReportSignatureProps = {
  sign: UserType | undefined;
  path: string | undefined;
  title?: string;
  width?: number;
  height?: number;
};

export function ReportSignature({
  sign,
  path,
  title,
  width = 120,
  height = 60,
}: ReportSignatureProps) {
  if (!sign || !path) return <div className="h-20"></div>;

  return (
    <Image
      src={createSignatureURL(path) || ""}
      alt={title || ""}
      width={width}
      height={height}
      className={`w-[${width}px] h-[${height}px] object-contain z-10`}
    />
  );
}
