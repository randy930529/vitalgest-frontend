"use client";

import { useState } from "react";
import { InboxArrowDownIcon, PrinterIcon } from "@heroicons/react/24/outline";

export function PrintButton({ name = "reporte" }: { name: string }) {
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
          margin: 10,
          filename: `${name}.pdf`,

          image: { type: "jpeg" as const, quality: 0.98 },

          // Opciones específicas para el renderizado de imágenes y HTML
          html2canvas: {
            scale: 2,
            useCORS: false,
            allowTaint: false,
            logging: false,
            imageTimeout: 15000,
          },

          jsPDF: {
            unit: "mm" as const,
            format: "a4" as const,
            orientation: "landscape" as const,
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
