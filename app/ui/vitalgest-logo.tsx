import { openSans } from "@/app/ui/fonts";
import Image from "next/image";

export default function VitalGestLogo() {
  return (
    <div
      className={`${openSans.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/images/logo-cruz-roja_red.svg"
        width={185}
        height={261}
        className="hidden md:block"
        alt="Logo de la Cruz Roja, cruz blanca sobre fondo rojo"
      />
    </div>
  );
}
