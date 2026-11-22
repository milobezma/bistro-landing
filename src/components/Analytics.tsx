"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track, type EventoGA } from "@/lib/ga";
import { CAMPOS_UTM } from "@/lib/solicitud";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const CLAVE_ATRIBUCION = "bistro_atribucion";

/**
 * - Carga GA4.
 * - Rastrea clics en cualquier elemento con data-evento / data-ubicacion (así los
 *   componentes de servidor no necesitan JS propio para medir).
 * - Guarda UTM, gclid y página de llegada de la primera visita de la sesión.
 */
export function Analytics() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(CLAVE_ATRIBUCION)) {
        const params = new URLSearchParams(window.location.search);
        const atribucion: Record<string, string> = { paginaDeLlegada: window.location.href };
        for (const c of CAMPOS_UTM) {
          const v = params.get(c);
          if (v) atribucion[c] = v;
        }
        sessionStorage.setItem(CLAVE_ATRIBUCION, JSON.stringify(atribucion));
      }
    } catch {
      /* sessionStorage bloqueado: seguimos sin atribución */
    }

    const alClic = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-evento]");
      if (!el) return;
      track(el.dataset.evento as EventoGA, { ubicacion: el.dataset.ubicacion });
    };
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}

export function leerAtribucion(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_ATRIBUCION) ?? "{}");
  } catch {
    return {};
  }
}
