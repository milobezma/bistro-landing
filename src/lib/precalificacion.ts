/**
 * Aviso en vivo del paso 1 (CLAUDE.md § Landing, Hero que precalifica).
 * Función pura: la usan el formulario (cliente) y el server action (para guardar la etiqueta en Airtable).
 */

export type Tono = "info" | "alerta" | "ok";

/** Valores exactos del campo "Precalificación" en Airtable. */
export type EtiquetaPrecalificacion =
  | "OK"
  | "Menos de 20 personas"
  | "Menos de 7 días"
  | "+100 personas con menos de 2 semanas"
  | "Fecha por definir";

export type EntradaPrecalificacion = {
  tipo: string | null;
  personas: number | null;
  /** Fecha del evento en formato YYYY-MM-DD, o null si no la eligió. */
  fecha: string | null;
  sinFecha: boolean;
  /** Hoy en formato YYYY-MM-DD (en la zona horaria de Santiago). */
  hoy: string;
};

export type Precalificacion = {
  tono: Tono;
  mensaje: string;
  /** null mientras faltan datos para clasificar. */
  etiqueta: EtiquetaPrecalificacion | null;
};

export const MENSAJES = {
  neutro: "La propuesta se arma según tu número de personas, tu fecha y tu presupuesto.",
  menosDe20:
    "Para menos de 20 personas lo evaluamos caso a caso. Igual envía tu solicitud o escríbenos por WhatsApp.",
  menosDe7Dias: "Tu evento es en menos de 7 días: te confirmamos disponibilidad apenas recibamos tu solicitud.",
  masDe100: "Para más de 100 personas recomendamos al menos 2 semanas de anticipación, así todo sale con la calidad que nos representa. Escríbenos y vemos si alcanzamos.",
  ok: "Perfecto, con esto ya podemos armar tu propuesta.",
} as const;

/** Días enteros entre dos fechas YYYY-MM-DD (b - a). */
export function diasEntre(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Hoy como YYYY-MM-DD en America/Santiago, sin importar dónde corra el código. */
export function hoyEnSantiago(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

export function precalificar({ tipo, personas, fecha, sinFecha, hoy }: EntradaPrecalificacion): Precalificacion {
  const hayPersonas = personas !== null && Number.isFinite(personas) && personas > 0;
  const dias = fecha && !sinFecha ? diasEntre(hoy, fecha) : null;

  if (hayPersonas && personas < 20) {
    return { tono: "alerta", mensaje: MENSAJES.menosDe20, etiqueta: "Menos de 20 personas" };
  }
  if (dias !== null && dias >= 0 && dias < 7) {
    return { tono: "alerta", mensaje: MENSAJES.menosDe7Dias, etiqueta: "Menos de 7 días" };
  }
  if (hayPersonas && personas > 100 && dias !== null && dias < 14) {
    return { tono: "alerta", mensaje: MENSAJES.masDe100, etiqueta: "+100 personas con menos de 2 semanas" };
  }
  if (tipo && hayPersonas && personas >= 20) {
    return { tono: "ok", mensaje: MENSAJES.ok, etiqueta: sinFecha || !fecha ? "Fecha por definir" : "OK" };
  }
  return { tono: "info", mensaje: MENSAJES.neutro, etiqueta: null };
}
