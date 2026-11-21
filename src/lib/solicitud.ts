import { tiposDeEvento, type TipoDeEvento } from "../content/sitio.ts";
import { precalificar, diasEntre, type EtiquetaPrecalificacion } from "./precalificacion.ts";

/** Lo que llega del formulario (todo como string, tal cual FormData). */
export type SolicitudCruda = Record<string, string | undefined>;

export type Solicitud = {
  nombre: string;
  empresa: string;
  /** 8 dígitos después del +56 9 */
  whatsapp: string;
  email: string;
  tipo: TipoDeEvento;
  personas: number;
  fecha: string | null;
  sinFecha: boolean;
  presupuesto: number | null;
  tipoPresupuesto: "Por persona" | "Total del evento" | null;
  comentario: string | null;
  precalificacion: EtiquetaPrecalificacion | null;
  origen: string | null;
  utm: Partial<Record<(typeof CAMPOS_UTM)[number], string>>;
  paginaDeLlegada: string | null;
};

export const CAMPOS_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;

export type ErroresSolicitud = Partial<Record<"nombre" | "empresa" | "whatsapp" | "email" | "tipo" | "personas" | "fecha", string>>;

const limpiar = (v: string | undefined, max = 200) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const soloDigitos = (v: string | undefined) => (v ?? "").replace(/\D/g, "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Valida el paso 1 (se usa también en el cliente antes de pasar al paso 2). */
export function validarPaso1(
  datos: { tipo: string | null; personas: string; fecha: string; sinFecha: boolean },
  hoy: string,
): ErroresSolicitud {
  const errores: ErroresSolicitud = {};
  if (!datos.tipo || !tiposDeEvento.includes(datos.tipo as TipoDeEvento)) {
    errores.tipo = "Elige qué estás organizando.";
  }
  const personas = Number(soloDigitos(datos.personas));
  if (!personas) errores.personas = "Cuéntanos para cuántas personas, aunque sea aproximado.";
  else if (personas > 5000) errores.personas = "Revisa el número de personas.";
  if (!datos.sinFecha) {
    if (!datos.fecha || !FECHA.test(datos.fecha)) {
      errores.fecha = "Elige la fecha o marca «Aún no sé la fecha».";
    } else if (diasEntre(hoy, datos.fecha) < 0) {
      errores.fecha = "Esa fecha ya pasó. Elige una fecha desde hoy.";
    }
  }
  return errores;
}

export function validarSolicitud(
  crudo: SolicitudCruda,
  hoy: string,
): { ok: true; solicitud: Solicitud } | { ok: false; errores: ErroresSolicitud } {
  const sinFecha = crudo.sinFecha === "1" || crudo.sinFecha === "on";
  const errores: ErroresSolicitud = validarPaso1(
    { tipo: crudo.tipo ?? null, personas: crudo.personas ?? "", fecha: crudo.fecha ?? "", sinFecha },
    hoy,
  );

  const nombre = limpiar(crudo.nombre, 80);
  const empresa = limpiar(crudo.empresa, 120);
  let whatsapp = soloDigitos(crudo.whatsapp);
  // Si pegaron el número completo (+56 9 ...), nos quedamos con los últimos 8 dígitos
  if (whatsapp.length > 8 && /^(56)?9/.test(whatsapp)) whatsapp = whatsapp.slice(-8);
  const email = limpiar(crudo.email, 120).toLowerCase();

  if (!nombre) errores.nombre = "¿Cómo te llamas?";
  if (!empresa) errores.empresa = "¿Para qué empresa es el evento?";
  if (whatsapp.length !== 8) errores.whatsapp = "Son 8 dígitos después del +56 9.";
  if (!EMAIL.test(email)) errores.email = "Revisa tu email: ahí te llega la propuesta.";

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const tipo = crudo.tipo as TipoDeEvento;
  const personas = Number(soloDigitos(crudo.personas));
  const fecha = sinFecha ? null : (crudo.fecha as string);
  const presupuestoNum = Number(soloDigitos(crudo.presupuesto));
  const presupuesto = presupuestoNum > 0 ? presupuestoNum : null;
  const tipoPresupuesto = presupuesto
    ? crudo.tipoPresupuesto === "total"
      ? "Total del evento"
      : "Por persona"
    : null;

  const utm: Solicitud["utm"] = {};
  for (const campo of CAMPOS_UTM) {
    const v = limpiar(crudo[campo], 200);
    if (v) utm[campo] = v;
  }
  const pagina = limpiar(crudo.paginaDeLlegada, 500);

  return {
    ok: true,
    solicitud: {
      nombre,
      empresa,
      whatsapp,
      email,
      tipo,
      personas,
      fecha,
      sinFecha,
      presupuesto,
      tipoPresupuesto,
      comentario: (crudo.comentario ?? "").trim().slice(0, 2000) || null,
      precalificacion: precalificar({ tipo, personas, fecha, sinFecha, hoy }).etiqueta,
      origen: limpiar(crudo.origen, 40) || null,
      utm,
      paginaDeLlegada: /^https?:\/\//.test(pagina) ? pagina : null,
    },
  };
}

/** Campos para Airtable, tabla Solicitudes (los nombres tienen que calzar exacto). */
export function aCamposAirtable(s: Solicitud): Record<string, unknown> {
  const campos: Record<string, unknown> = {
    Nombre: s.nombre,
    Empresa: s.empresa,
    WhatsApp: `+56 9 ${s.whatsapp.slice(0, 4)} ${s.whatsapp.slice(4)}`,
    Email: s.email,
    "Tipo de evento": s.tipo,
    Personas: s.personas,
    "Fecha por definir": s.sinFecha,
    Estado: "Nueva",
  };
  if (s.fecha) campos["Fecha del evento"] = s.fecha;
  if (s.presupuesto) campos["Presupuesto"] = s.presupuesto;
  if (s.tipoPresupuesto) campos["Tipo de presupuesto"] = s.tipoPresupuesto;
  if (s.comentario) campos["Comentario"] = s.comentario;
  if (s.precalificacion) campos["Precalificación"] = s.precalificacion;
  if (s.origen) campos["Origen"] = s.origen;
  if (s.paginaDeLlegada) campos["Página de llegada"] = s.paginaDeLlegada;
  for (const [k, v] of Object.entries(s.utm)) if (v) campos[k] = v;
  return campos;
}
