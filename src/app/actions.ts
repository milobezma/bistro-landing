"use server";

import { crearRegistro, TABLA_SOLICITUDES } from "@/lib/airtable";
import { hoyEnSantiago } from "@/lib/precalificacion";
import { validarSolicitud, aCamposAirtable, type ErroresSolicitud } from "@/lib/solicitud";

export type EstadoEnvio =
  | { estado: "inicial" }
  | { estado: "error"; errores: ErroresSolicitud; mensaje?: string }
  | { estado: "enviado" };

const MIN_MS_LLENADO = 2000;

export async function enviarSolicitud(_previo: EstadoEnvio, formData: FormData): Promise<EstadoEnvio> {
  const crudo: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string") crudo[k] = v;

  // Anti-spam: campo trampa (los humanos no lo ven). A un bot le decimos que salió bien, pero no guardamos nada.
  if (crudo.sitio_web) return { estado: "enviado" };

  const r = validarSolicitud(crudo, hoyEnSantiago());
  if (!r.ok) return { estado: "error", errores: r.errores };

  // Anti-spam: un formulario válido llenado en menos de 2 s no lo escribió una persona.
  const inicio = Number(crudo.inicio);
  if (inicio && Date.now() - inicio < MIN_MS_LLENADO) return { estado: "enviado" };

  try {
    await crearRegistro(TABLA_SOLICITUDES, aCamposAirtable(r.solicitud));
    return { estado: "enviado" };
  } catch (e) {
    console.error("[solicitud] No se pudo guardar en Airtable:", e);
    return {
      estado: "error",
      errores: {},
      mensaje: "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp y la tomamos por ahí.",
    };
  }
}
