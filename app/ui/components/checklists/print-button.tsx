"use client";

import { useState } from "react";
import { InboxArrowDownIcon, PrinterIcon } from "@heroicons/react/24/outline";

export function PrintButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.querySelector(".print-area");
    if (element instanceof HTMLElement) {
      try {
        setIsDownloading(true);
        // Dynamically import to prevent SSR issues
        // @ts-ignore
        const html2pdf = (await import("html2pdf.js")).default;

        const opt = {
          margin: 0.5,
          filename: "reporte_insumos.pdf",
          image: { type: "jpeg" as const, quality: 0.98 },
          html2canvas: { scale: 2 },
          // ensure literal types for jsPDF options to satisfy Html2PdfOptions typings
          jsPDF: {
            unit: "in" as const,
            format: "letter" as const,
            orientation: "portrait" as const,
          },
        };

        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error("Error generating PDF", error);
        alert("Hubo un error al generar el PDF.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => window.print()}
        className="action-btn px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 flex items-center gap-2 cursor-pointer"
      >
        <PrinterIcon className="w-5 h-5" /> Imprimir Archivo (Ctrl+P)
      </button>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`action-btn px-4 py-2 rounded-md bg-blue-500 text-white border-none flex items-center gap-2 ${isDownloading ? "cursor-wait opacity-70" : "cursor-pointer"}`}
      >
        <InboxArrowDownIcon className="w-5 h-5" />{" "}
        {isDownloading ? "Generando..." : "Descargar PDF"}
      </button>
    </div>
  );
}
