import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | VitalGest - Cruz Roja",
    default: "VitalGest - Cruz Roja",
  },
  description: "Dashboard de gestión de inventario para Cruz Roja",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.className}`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
