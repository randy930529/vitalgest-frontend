import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { fetchChecklistAmbulance } from "@/app/lib/data/checklist";
import { PrintButton } from "@/app/ui/components/checklists/print-button";
import { ReportHeader } from "@/app/ui/components/checklists/report-header";
import { ChecklistQuestionsType, StepItemType } from "@/app/lib/definitions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reporte de Inspección de Ambulancia",
};

export default async function ChecklistAmbulanceReportPage({
  params,
}: {
  params: Promise<{ checklistId: string }>;
}) {
  const { checklistId } = await params;

  const checklist = await fetchChecklistAmbulance(checklistId);
  console.log(checklist);

  if (!checklist) {
    notFound();
  }

  const { guard } = checklist.shift;
  const divisionName = `${guard.delegation?.municipality}, ${guard.delegation?.state}`;
  const dateObj = new Date(checklist.updatedAt || Date.now());

  // Agrupar respuestas por categoría
  const categoryItemsInit = new Map<
    string,
    StepItemType & {
      answer: {
        question: string;
        type: ChecklistQuestionsType["type_response"];
        value: string;
      }[];
    }
  >();

  const categoryItemsMap = checklist.answers.reduce((acc, answer) => {
    const categoryKey = `${answer.question.order_category}-${answer.question.name_category}`;
    if (!acc.has(categoryKey)) {
      acc.set(categoryKey, {
        id: Number(answer.question.order_category),
        label: answer.question.name_category,
        answer: [],
      });
    }

    const getValue = () => {
      if (typeof answer.components.value_bool === "boolean")
        return answer.components.value_bool ? "Sí" : "No";
      if (answer.components.value_option) return answer.components.value_option;
      if (answer.components.value_text) return answer.components.value_text;
      return "";
    };
    acc.get(categoryKey)?.answer.push({
      question: answer.question.question,
      type: answer.question.type_response,
      value: getValue(),
    });
    return acc;
  }, categoryItemsInit);

  const categoryItemsArray = Array.from(categoryItemsMap.values()).sort(
    (a, b) => a.id - b.id,
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="no-print max-w-[1100px] mx-auto mb-6 flex justify-between">
        <Link
          href={`/dashboard/guards`}
          className="btn-secondary px-3 py-2 rounded-md bg-white border border-gray-300 flex items-center gap-2 text-gray-700 font-semibold shadow-sm no-underline"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Volver a la Guardia
        </Link>
        <PrintButton />
      </div>

      {/* A4 Sheet - Landscape attempt via wide maxWidth */}
      <div className="print-area print-landscape max-w-[1100px] mx-auto bg-white p-8 shadow-md text-black font-sans">
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @media print {
                        @page { size: landscape; margin: 10mm; }
                        .print-landscape { max-width: 100% !important; padding: 0 !important; box-shadow: none !important; }
                    }
                `,
          }}
        />

        {/* Official Header */}
        <ReportHeader divisionName={divisionName} />

        {/* Content Body */}
        <div className="py-10 px-12">
          {/* Document Title & Meta */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 m-0 mb-2 uppercase tracking-tight">
              Reporte de Inspección de Ambulancia
            </h1>
            <p className="m-0 text-sm text-gray-500 font-medium">
              Documento oficial de control y estado de unidad prehospitalaria.
            </p>
          </div>

          {/* General Information Panel */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-6">
            <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4 border-b border-pink-200 pb-2">
              Información Operativa
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                <div className="text-gray-500 font-semibold">Unidad:</div>
                <div className="font-bold text-gray-900">
                  Ambulancia {checklist.shift.ambulance.number}
                </div>

                <div className="text-gray-500 font-semibold">K.M.:</div>
                <div className="font-semibold text-gray-700">
                  {checklist.km || "---"}
                </div>
              </div>

              <div className="grid grid-cols-[90px_1fr] gap-2 text-sm">
                <div className="text-gray-500 font-semibold">
                  Fecha Control:
                </div>
                <div className="font-semibold text-gray-700">
                  {dateObj.toLocaleDateString("es-MX", {
                    timeZone: "UTC",
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="text-gray-500 font-semibold">Hora Emisión:</div>
                <div className="font-semibold text-gray-700">
                  {dateObj.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <div className="text-gray-500 font-semibold">
                  Jefe de Guardia:
                </div>
                <div className="font-bold text-gray-900">
                  {`${guard.guardChief.name} ${guard.guardChief.lastname}`}
                </div>

                <div className="text-gray-500 font-semibold">Operador:</div>
                <div className="font-semibold text-gray-700">
                  {checklist.shift
                    ? `${checklist.shift.driver.name} ${checklist.shift.driver.lastname}`
                    : "N/A"}
                </div>

                <div className="text-gray-500 font-semibold">
                  Técnico (TUM):
                </div>
                <div className="font-semibold text-gray-700">
                  {checklist.shift
                    ? `${checklist.shift.paramedical.name} ${checklist.shift.paramedical.lastname}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-300 flex items-center gap-2 text-sm">
              <div className="text-gray-500 font-semibold">
                VALE DE GASOLINA (GAS INICIAL):
              </div>
              <div className="font-semibold text-gray-700 pl-2 pr-8 min-w-[150px]">
                {checklist.gas_path || "---"}
              </div>

              <div className="text-gray-500 font-semibold">ESTADO DOC.:</div>
              <div
                className={`font-bold pl-2 uppercase ${checklist.recipient ? "text-green-600" : "text-orange-500"}`}
              >
                {checklist.recipient ? "COMPLETADO" : "PENDIENTE"}
              </div>
            </div>
          </div>

          {/* 3 Columns Layout for Sections */}
          <div className="grid grid-cols-3 gap-6 text-xs">
            {categoryItemsArray.map((item, index) => (
              <div
                key={index + "-" + item.label}
                className="border border-gray-200 rounded-sm overflow-hidden"
              >
                <div className="bg-gray-700 text-white font-bold py-1 px-2 text-center uppercase">
                  {index + 1}. {item.label}
                </div>
                <div className="p-2">
                  {item.answer.map((answer, i) => (
                    <div
                      key={i + "-" + answer.question}
                      className="flex justify-between py-0.5 border-b border-dashed border-gray-200"
                    >
                      <span className="pr-2">{answer.question}</span>
                      <div className="font-bold whitespace-nowrap">
                        {answer.question.toLowerCase().includes("libras") ? (
                          <span className="text-green-500">
                            {answer.value || "0"} lb
                          </span>
                        ) : (
                          <span
                            className={
                              answer.value === "Mal" || answer.value === "Malo"
                                ? "text-red-500"
                                : answer.value === "Regular"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {answer.value || "N/A"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notas y Firmas Block (fills the remaining grid spaces if needed, or spans 3) */}
            <div className="col-span-3 border border-gray-300 rounded flex overflow-hidden">
              <div className="flex-1 p-4 border-r border-gray-300">
                <div className="font-bold mb-2 uppercase">
                  Notas y Anomalías:
                </div>
                <div className="whitespace-pre-wrap italic text-gray-600">
                  {checklist.notes || "Sin notas adicionales capturadas."}
                </div>
              </div>
              <div className="flex-1 p-4 flex justify-around items-center">
                {/* Firma Operador */}
                <div className="flex flex-col items-center relative w-[200px]">
                  {checklist.sign_operator_path ? (
                    <img
                      src={checklist.sign_operator_path}
                      alt="Firma Operador"
                      className="w-[120px] h-[60px] object-contain z-10"
                    />
                  ) : (
                    <div className="h-[60px]"></div>
                  )}
                  <div className="border-t border-black w-full text-center pt-1 font-bold">
                    Nombre y firma del <br /> operador que reporta
                  </div>
                  <div className="text-[0.65rem] text-center mt-1 text-gray-600">
                    {checklist.sign_operator_path
                      ? `${checklist.shift.driver.name} ${checklist.shift.driver.lastname}`
                      : "N/A"}
                  </div>
                </div>

                {/* Firma Jefe Guardia */}
                <div className="flex flex-col items-center relative w-[200px]">
                  {checklist.recipient ? (
                    <img
                      src={checklist.recipient.signature}
                      alt="Firma Jefe Guardia"
                      className="w-[120px] h-[60px] object-contain z-10"
                    />
                  ) : (
                    <div className="h-[60px]"></div>
                  )}
                  <div className="border-t border-black w-full text-center pt-1 font-bold">
                    Nombre y firma de <br /> quien recibe
                  </div>
                  <div className="text-[0.65rem] text-center mt-1 text-gray-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
