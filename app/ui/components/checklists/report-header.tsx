import Image from "next/image";

export function ReportHeader({ divisionName }: { divisionName: string }) {
  return (
    <div className="py-10 px-12 pb-6 flex justify-between items-center border-b-4 border-red-700">
      <div className="flex items-center gap-4">
        <div className="text-red-600 font-black text-4xl leading-none">+</div>
        <div className="flex flex-col">
          <div className="text-red-600 font-extrabold text-xl leading-tight tracking-tight">
            CRUZ ROJA
            <br />
            <span className="text-gray-900">MEXICANA</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {divisionName}
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <Image
          src="/images/logo-vital-gest_red.svg"
          alt="VitalGest Logo"
          width={60}
          height={40}
          className="object-contain"
        />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          VitalGest
        </span>
      </div>
    </div>
  );
}
