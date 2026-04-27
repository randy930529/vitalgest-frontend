import Image from "next/image";
import { openSans } from "@/app/ui/fonts";

export function VitalGestLogo({ width = 92, height = 92 }) {
  return (
    <div
      className={`${openSans.className} flex flex-row justify-center items-center leading-none text-white`}
    >
      <Image
        src="/images/logo-vital-gest_red.svg"
        width={width}
        height={height}
        className="hidden md:block"
        alt="Logo del sistema de gestión VitalGest, un escudo y una cruz roja sobre fondo transparente"
        priority
      />
    </div>
  );
}

export function CruzRojaLogo({ width = 100, height = 130 }) {
  return (
    <div
      className={`${openSans.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/images/logo-cruz-roja.png"
        width={width}
        height={height}
        className="hidden md:block"
        alt="Logo de la Cruz Roja, cruz roja sobre fondo blanco"
        priority
      />
    </div>
  );
}
