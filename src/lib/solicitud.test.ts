import { test } from "node:test";
import assert from "node:assert/strict";
import { validarSolicitud, aCamposAirtable } from "./solicitud.ts";

const hoy = "2026-11-21";
const valida = {
  tipo: "Coffee break",
  personas: "40",
  fecha: "2026-12-12",
  nombre: "  Daniela ",
  empresa: "Entel",
  whatsapp: "1234 5678",
  email: "Daniela@Empresa.cl",
  presupuesto: "8.500",
  tipoPresupuesto: "pp",
  origen: "hero",
  utm_source: "google",
  paginaDeLlegada: "https://bistrochile.com/?utm_source=google",
};

test("una solicitud completa pasa y se normaliza", () => {
  const r = validarSolicitud(valida, hoy);
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.solicitud.nombre, "Daniela");
  assert.equal(r.solicitud.email, "daniela@empresa.cl");
  assert.equal(r.solicitud.whatsapp, "12345678");
  assert.equal(r.solicitud.presupuesto, 8500);
  assert.equal(r.solicitud.tipoPresupuesto, "Por persona");
  assert.equal(r.solicitud.precalificacion, "OK");
});

test("los campos para Airtable usan los nombres exactos de la tabla", () => {
  const r = validarSolicitud(valida, hoy);
  assert.ok(r.ok);
  if (!r.ok) return;
  const c = aCamposAirtable(r.solicitud);
  assert.equal(c.WhatsApp, "+56 9 1234 5678");
  assert.equal(c["Tipo de evento"], "Coffee break");
  assert.equal(c["Fecha del evento"], "2026-12-12");
  assert.equal(c["Precalificación"], "OK");
  assert.equal(c.utm_source, "google");
  assert.equal(c.Estado, "Nueva");
  assert.equal(c["Tipo de presupuesto"], "Por persona");
});

test("acepta el número pegado con +56 9", () => {
  const r = validarSolicitud({ ...valida, whatsapp: "+56 9 1234 5678" }, hoy);
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.solicitud.whatsapp, "12345678");
});

test("sin presupuesto no manda tipo de presupuesto", () => {
  const r = validarSolicitud({ ...valida, presupuesto: "" }, hoy);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.solicitud.presupuesto, null);
    assert.equal(aCamposAirtable(r.solicitud)["Tipo de presupuesto"], undefined);
  }
});

test("presupuesto total", () => {
  const r = validarSolicitud({ ...valida, presupuesto: "1.200.000", tipoPresupuesto: "total" }, hoy);
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.solicitud.tipoPresupuesto, "Total del evento");
});

test("sin fecha con la casilla marcada", () => {
  const r = validarSolicitud({ ...valida, fecha: "", sinFecha: "1" }, hoy);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.solicitud.fecha, null);
    assert.equal(r.solicitud.precalificacion, "Fecha por definir");
    assert.equal(aCamposAirtable(r.solicitud)["Fecha del evento"], undefined);
  }
});

test("errores amables por campo", () => {
  const r = validarSolicitud({ tipo: "Asado", personas: "", fecha: "" }, hoy);
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.deepEqual(Object.keys(r.errores).sort(), ["email", "empresa", "fecha", "nombre", "personas", "tipo", "whatsapp"]);
});

test("fecha pasada no vale", () => {
  const r = validarSolicitud({ ...valida, fecha: "2026-11-20" }, hoy);
  assert.equal(r.ok, false);
});

test("página de llegada que no es URL se descarta", () => {
  const r = validarSolicitud({ ...valida, paginaDeLlegada: "javascript:alert(1)" }, hoy);
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.solicitud.paginaDeLlegada, null);
});
