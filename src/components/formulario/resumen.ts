export const CLAVE_RESUMEN = "bistro_solicitud_enviada";

export type ResumenSolicitud = {
  nombre: string;
  tipo: string;
  personas: number;
  fecha: string | null;
};

/** "2026-12-12" → "12 de diciembre" */
export function formatearFechaCorta(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(a, m - 1, d)),
  );
}

/** "Coffee break para 40 personas, 12 de diciembre." */
export function fraseResumen(r: ResumenSolicitud) {
  const fecha = r.fecha ? formatearFechaCorta(r.fecha) : "fecha por definir";
  return `${r.tipo} para ${r.personas} personas, ${fecha}.`;
}
