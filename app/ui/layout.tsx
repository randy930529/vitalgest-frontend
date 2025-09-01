import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";

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
