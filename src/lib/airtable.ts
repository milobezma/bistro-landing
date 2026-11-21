import "server-only";

/**
 * Cliente mínimo de la API REST de Airtable. Solo servidor: el token nunca llega al navegador.
 * Variables: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_SOLICITUDES_TABLE.
 */

// AIRTABLE_API_URL solo sirve para pruebas locales contra un servidor falso.
const API = process.env.AIRTABLE_API_URL ?? "https://api.airtable.com/v0";

export class AirtableNoConfigurado extends Error {
  constructor() {
    super("Faltan AIRTABLE_TOKEN o AIRTABLE_BASE_ID en las variables de entorno.");
  }
}

function config() {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  if (!token || !base) throw new AirtableNoConfigurado();
  return { token, base };
}

export async function crearRegistro(tabla: string, campos: Record<string, unknown>): Promise<string> {
  const { token, base } = config();
  const res = await fetch(`${API}/${base}/${encodeURIComponent(tabla)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    // typecast: Airtable acepta los nombres de las opciones de los selectores tal cual
    body: JSON.stringify({ records: [{ fields: campos }], typecast: true }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(`Airtable respondió ${res.status}: ${detalle.slice(0, 500)}`);
  }
  const json = (await res.json()) as { records: { id: string }[] };
  return json.records[0].id;
}

export const TABLA_SOLICITUDES = process.env.AIRTABLE_SOLICITUDES_TABLE ?? "Solicitudes";
