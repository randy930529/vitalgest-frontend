import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | VitalGear - Cruz Roja",
    default: "VitalGear - Cruz Roja",
  },
  description: "Dashboard de gestión de inventario para Cruz Roja",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.className}`}>{children}</body>
    </html>
  );
}
