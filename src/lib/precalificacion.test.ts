import { test } from "node:test";
import assert from "node:assert/strict";
import { precalificar, diasEntre, hoyEnSantiago, MENSAJES } from "./precalificacion.ts";

const hoy = "2026-11-21";
const base = { tipo: null, personas: null, fecha: null, sinFecha: false, hoy };

test("sin datos muestra el mensaje neutro", () => {
  const r = precalificar(base);
  assert.equal(r.mensaje, MENSAJES.neutro);
  assert.equal(r.tono, "info");
  assert.equal(r.etiqueta, null);
});

test("menos de 20 personas avisa caso a caso, aunque falte el tipo", () => {
  const r = precalificar({ ...base, personas: 12 });
  assert.equal(r.mensaje, MENSAJES.menosDe20);
  assert.equal(r.etiqueta, "Menos de 20 personas");
});

test("menos de 20 personas tiene prioridad sobre la fecha cercana", () => {
  const r = precalificar({ ...base, personas: 10, fecha: "2026-11-23" });
  assert.equal(r.etiqueta, "Menos de 20 personas");
});

test("fecha a menos de 7 días avisa disponibilidad", () => {
  assert.equal(precalificar({ ...base, personas: 40, fecha: "2026-11-27" }).etiqueta, "Menos de 7 días");
  assert.equal(precalificar({ ...base, personas: 40, fecha: hoy }).etiqueta, "Menos de 7 días");
});

test("a 7 días exactos ya no avisa", () => {
  const r = precalificar({ ...base, tipo: "Coffee break", personas: 40, fecha: "2026-11-28" });
  assert.equal(r.etiqueta, "OK");
});

test("más de 100 personas con menos de 14 días recomienda 2 semanas", () => {
  const r = precalificar({ ...base, tipo: "Cóctel", personas: 150, fecha: "2026-12-04" });
  assert.equal(r.mensaje, MENSAJES.masDe100);
  assert.equal(r.etiqueta, "+100 personas con menos de 2 semanas");
});

test("más de 100 personas con 14 días o más está OK", () => {
  const r = precalificar({ ...base, tipo: "Cóctel", personas: 150, fecha: "2026-12-05" });
  assert.equal(r.etiqueta, "OK");
});

test("100 personas exactas no gatilla la regla de 2 semanas", () => {
  const r = precalificar({ ...base, tipo: "Cóctel", personas: 100, fecha: "2026-12-05" });
  assert.equal(r.etiqueta, "OK");
});

test("tipo y 20 o más personas: perfecto", () => {
  const r = precalificar({ ...base, tipo: "Almuerzo", personas: 20 });
  assert.equal(r.mensaje, MENSAJES.ok);
  assert.equal(r.tono, "ok");
});

test("sin fecha marca 'Fecha por definir' e ignora la fecha escrita", () => {
  const r = precalificar({ ...base, tipo: "Almuerzo", personas: 150, fecha: "2026-11-22", sinFecha: true });
  assert.equal(r.etiqueta, "Fecha por definir");
});

test("personas sin tipo queda neutro", () => {
  assert.equal(precalificar({ ...base, personas: 40 }).tono, "info");
});

test("diasEntre cuenta días calendario", () => {
  assert.equal(diasEntre("2026-11-21", "2026-12-12"), 21);
  assert.equal(diasEntre("2026-12-31", "2027-01-01"), 1);
});

test("hoyEnSantiago usa la zona horaria de Chile", () => {
  // 02:00 UTC del 22 = 23:00 del 21 en Santiago (UTC-3 en verano)
  assert.equal(hoyEnSantiago(new Date("2026-11-22T02:00:00Z")), "2026-11-21");
});
