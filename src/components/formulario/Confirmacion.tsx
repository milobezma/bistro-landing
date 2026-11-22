"use client";

import { useEffect, useState } from "react";
import { CLAVE_RESUMEN, fraseResumen, type ResumenSolicitud } from "./resumen";

/** Título y resumen de la confirmación. Lee lo que dejó el formulario en sessionStorage. */
export function Confirmacion() {
  const [resumen, setResumen] = useState<ResumenSolicitud | null>(null);

  useEffect(() => {
    try {
      const crudo = sessionStorage.getItem(CLAVE_RESUMEN);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage solo existe en el cliente
      if (crudo) setResumen(JSON.parse(crudo));
    } catch {
      /* sin datos: versión genérica */
    }
  }, []);

  return (
    <>
      <h1 className="text-[clamp(2.2rem,4vw+1rem,3.5rem)]">
        {resumen?.nombre ? `Listo, ${resumen.nombre}.` : "Listo."} Recibimos tu solicitud.
      </h1>
      {resumen && resumen.personas > 0 && <p className="mt-4 text-[19px] text-gris">{fraseResumen(resumen)}</p>}
    </>
  );
}
