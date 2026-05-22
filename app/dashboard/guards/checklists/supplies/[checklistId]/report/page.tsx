import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { StepItemType } from "@/app/lib/definitions";
import { fetchChecklistSuppliesCompleted } from "@/app/lib/data/checklist";
import { PrintButton } from "@/app/ui/components/checklists/print-button";
import { ReportHeader } from "@/app/ui/components/checklists/report-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reporte de Inspección de Insumos",
};

export default async function ChecklistSuppliesReportPage({
  params,
}: {
  params: Promise<{ checklistId: string }>;
}) {
  const { checklistId } = await params;
  const checklist = await fetchChecklistSuppliesCompleted(checklistId);

  if (!checklist) {
    notFound();
  }

  const divisionName = `${"Ameca"}, ${"Jalisco"}`;

  const areasItemsInit = new Map<
    string,
    StepItemType & {
      answer: {
        category: string;
        specification: string;
        avaibleQuantity: number;
        minQuantity: number;
        deficitCalculado: number;
      }[];
    }
  >();

  const areasItemsMap = checklist.answers.reduce((acc, answer) => {
    const categoryKey = `${answer.area.order}-${answer.area.name}`;
    if (!acc.has(categoryKey)) {
      acc.set(categoryKey, {
        id: Number(answer.area.order),
        label: answer.area.name,
        answer: [],
      });
    }

    acc.get(categoryKey)?.answer.push({
      category: answer.category,
      specification: answer.specification,
      avaibleQuantity: answer.avaible_quantity,
      minQuantity: answer.min_quantity,
      deficitCalculado: answer.min_quantity - answer.avaible_quantity,
    });
    return acc;
  }, areasItemsInit);

  const areasItemsArray = Array.from(areasItemsMap.values()).sort(
    (a, b) => a.id - b.id,
  );

  return (
    <div className="bg-gray-200 min-h-screen py-8 px-4">
      {/* Toolbar No Print */}
      <div className="no-print max-w-[900px] mx-auto mb-6 flex justify-between items-center">
        <Link
          href={`/dashboard/guards`}
          className="px-3 py-2 rounded-lg bg-white border border-gray-300 flex items-center gap-2 text-gray-700 font-semibold shadow-sm transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Volver a la Guardia
        </Link>
        <PrintButton />
      </div>

      {/* A4 Sheet */}
      <div className="print-area max-w-[850px] mx-auto bg-white p-0 shadow-lg text-gray-800 font-sans">
        {/* Official Header */}
        <ReportHeader divisionName={divisionName} />

        {/* Content Body */}
        <div className="py-10 px-12">
          {/* Document Title & Meta */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 m-0 mb-2 uppercase tracking-tight">
              Reporte de Inspección de Insumos
            </h1>
            <p className="m-0 text-sm text-gray-500 font-medium">
              Documento oficial de control de inventario farmacéutico
              prehospitalario.
            </p>
          </div>

          {/* General Information Panel */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
            <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4 border-b border-pink-200 pb-2">
              Información Operativa
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <div className="text-gray-500 font-semibold">
                  Unidad Médica:
                </div>
                <div className="font-bold text-gray-900">
                  Ambulancia {checklist.ambulance_id}
                </div>

                <div className="text-gray-500 font-semibold">
                  Fecha Control:
                </div>
                <div className="font-semibold text-gray-700">
                  {new Date().toLocaleDateString(
                    //Fecha de la guardia
                    "es-MX",
                    {
                      timeZone: "UTC",
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>

                <div className="text-gray-500 font-semibold">Hora Emisión:</div>
                <div className="font-semibold text-gray-700">
                  {checklist.recipient_id
                    ? new Date(checklist.updatedAt).toLocaleTimeString(
                        "es-MX",
                        { hour: "2-digit", minute: "2-digit", timeZone: "UTC" },
                      )
                    : "--:--"}{" "}
                  hrs
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <div className="text-gray-500 font-semibold">
                  Jefe de Guardia:
                </div>
                <div className="font-bold text-gray-900">
                  {checklist.id} // Nombre del jefe de guardia
                  {checklist.id} // Apellido del jefe de guardia
                </div>

                <div className="text-gray-500 font-semibold">
                  Técnico (TUM):
                </div>
                <div className="font-semibold text-gray-700">
                  {checklist.id} {checklist.id} // Nombre y apellido del
                  paramédico
                </div>

                <div className="text-gray-500 font-semibold">Estado Doc.:</div>
                <div
                  className={`font-bold uppercase ${checklist.recipient_id ? "text-green-600" : "text-orange-500"}`}
                >
                  {checklist.recipient_id ? "COMPLETADO" : "PENDIENTE"}
                </div>
              </div>
            </div>
          </div>

          {/* Tables per Cabinet (Gabinete) */}
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Detalle de Inventario por Gabinete
            </h3>

            {areasItemsArray.map((area, index) => {
              return (
                <div
                  key={index + "-" + area.label}
                  className="mb-8 page-break-inside-avoid"
                >
                  <div className="bg-gray-900 text-white px-4 py-2 text-sm font-bold rounded-t-md">
                    {area.label}
                  </div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left border-b-2 border-gray-200">
                        <th className="px-4 py-3 font-bold w-1/3">Insumo</th>
                        <th className="px-4 py-3 font-bold w-1/4">
                          Especificación
                        </th>
                        <th className="px-4 py-3 font-bold w-1/12 text-center">
                          Cant.
                        </th>
                        <th className="px-4 py-3 font-bold w-1/3">
                          Observaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {area.answer.map((item, i) => {
                        let obs = "";
                        const hasDeficit = item.deficitCalculado > 0;

                        if (hasDeficit) {
                          const deficitText =
                            item.deficitCalculado === 1
                              ? "Falta 1 insumo"
                              : `Faltan ${item.deficitCalculado} insumos`;
                          obs = `${deficitText}. ${obs}`;
                        }

                        return (
                          <tr
                            key={
                              i + "-" + item.category + "-" + item.specification
                            }
                            className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                          >
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              {item.category}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {item.specification || "-"}
                            </td>
                            <td
                              className={`px-4 py-3 text-center font-bold ${hasDeficit ? "text-red-500" : "text-gray-900"}`}
                            >
                              {item.avaibleQuantity}
                            </td>
                            <td
                              className={`px-4 py-3 ${hasDeficit ? "text-red-500 italic" : "text-gray-600"} text-sm`}
                            >
                              {obs || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Observaciones Generales */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
            <h4 className="m-0 mb-2 text-yellow-800 text-sm font-bold uppercase">
              Notas Generales del Turno:
            </h4>
            <p className="m-0 text-yellow-900 text-sm leading-6">
              {checklist.notes
                ? checklist.notes
                : "No se registraron observaciones adicionales para este turno."}
            </p>
          </div>

          {/* Signatures block */}
          <div className="grid grid-cols-2 gap-12 mx-8 page-break-inside-avoid">
            {/* TUM (Entrega) */}
            <div className="text-center flex flex-col items-center">
              <div className="h-24 flex items-end justify-center mb-2 w-full">
                {checklist.sign_paramedical_path && (
                  <img
                    src={checklist.sign_paramedical_path}
                    alt="Firma TUM"
                    className="max-h-20 object-contain"
                  />
                )}
              </div>
              <div className="border-t border-gray-400 w-full pt-2 text-center font-bold">
                {checklist.id} {checklist.id} // Nombre y apellido del
                paramédico
              </div>
              <div className="text-xs text-gray-500 font-semibold mt-1">
                PARAMÉDICO (ENTREGA)
              </div>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="h-24 flex items-end justify-center mb-2 w-full">
                {checklist.recipient_id && (
                  <img
                    src={checklist.sign_recipient_path}
                    alt="Firma Jefe"
                    className="max-h-20 object-contain"
                  />
                )}
              </div>
              <div className="border-t border-gray-400 w-full pt-2 text-center font-bold">
                {checklist.id} {checklist.id} // Nombre y apellido del jefe de
                guardia
              </div>
              <div className="text-xs text-gray-500 font-semibold mt-1">
                {checklist.recipient_id ? checklist.id : "JEFE DE GUARDIA"}{" "}
                (RECIBE)
              </div>
            </div>
          </div>
        </div>

        {/* Footer Document Stamp */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-200 text-[0.7rem] text-gray-400">
          Documento generado electrónicamente por VitalGest. ID Control:{" "}
          {checklist.id.toString().padStart(6, "0")} | Fecha de impresión:{" "}
          {new Date().toLocaleDateString("es-MX")}
        </div>

        {/* Specific Print Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-area, .print-area * {
                            visibility: visible;
                        }
                        .print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                        @page { margin: 1cm; size: A4; }
                    }
                `,
          }}
        />
      </div>
    </div>
  );
}
