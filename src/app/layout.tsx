import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { sitio } from "@/content/sitio";
import "./globals.css";

// Fraunces: solo el eje SOFT (WONK siempre va en 0 y el opsz por defecto sirve para titulares),
// así el archivo pesa menos y el titular pinta antes (LCP).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT"],
  display: "swap",
});

// La itálica solo se usa en una palabra del titular: se carga aparte y sin precarga.
const frauncesItalica = Fraunces({
  variable: "--font-fraunces-italica",
  subsets: ["latin"],
  style: "italic",
  axes: ["SOFT"],
  display: "swap",
  preload: false,
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: "Catering corporativo en Santiago | Bistró",
  description: sitio.descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Bistró",
    title: "Catering corporativo en Santiago | Bistró",
    description: sitio.descripcion,
    images: [{ url: "/images/bistro-coffee-break-4x5.jpg", width: 1200, height: 1500, alt: "Coffee break de Bistró" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#161512", // = --negro (los metadatos no aceptan variables CSS)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CL" className={`${fraunces.variable} ${frauncesItalica.variable} ${instrument.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#cotizar"
          className="sr-only z-50 rounded-pill bg-amarillo px-5 py-3 font-semibold text-negro focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Ir al formulario de cotización
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
