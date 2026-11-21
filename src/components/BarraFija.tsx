"use client";

import { useEffect, useState } from "react";
import { CotizarLink } from "@/components/CotizarLink";
import { IconoWhatsApp, LinkWhatsApp, botonPrimario } from "@/components/ui";

/**
 * Barra fija mobile: aparece cuando el formulario del hero sale de la pantalla
 * y se esconde cuando vuelve a verse.
 */
export function BarraFija() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const formulario = document.getElementById("cotizar");
    if (!formulario) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(formulario);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-carbon bg-negro px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-3">
        <CotizarLink ubicacion="barra-fija" className={`${botonPrimario} flex-1`}>
          Cotiza tu evento
        </CotizarLink>
        <LinkWhatsApp
          ubicacion="barra-fija"
          aria-label="Escribir por WhatsApp"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-pill border-[1.5px] border-crema text-crema"
        >
          <IconoWhatsApp />
        </LinkWhatsApp>
      </div>
    </div>
  );
}
