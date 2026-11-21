"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { enviarSolicitud, type EstadoEnvio } from "@/app/actions";
import { tiposDeEvento, type TipoDeEvento } from "@/content/sitio";
import { precalificar, hoyEnSantiago } from "@/lib/precalificacion";
import { validarPaso1, CAMPOS_UTM, type ErroresSolicitud } from "@/lib/solicitud";
import { track } from "@/lib/ga";
import { EVENTO_COTIZAR, type DetalleCotizar } from "@/components/CotizarLink";
import { leerAtribucion } from "@/components/Analytics";
import { LinkWhatsApp, botonPrimario, Flecha } from "@/components/ui";
import { formatearFechaCorta, CLAVE_RESUMEN, type ResumenSolicitud } from "./resumen";

const inicial: EstadoEnvio = { estado: "inicial" };
const sinSuscripcion = () => () => {};

const claseInput =
  "block h-12 w-full rounded-s border border-linea bg-hueso px-3.5 text-[17px] text-negro placeholder:text-gris/70 transition-colors focus:border-negro focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-negro aria-invalid:border-negro aria-invalid:border-2";
const claseLabel = "mb-1.5 block text-[15px] font-semibold text-negro";

function formatearMiles(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  return d ? Number(d).toLocaleString("es-CL") : "";
}

export function FormularioCotizacion() {
  const router = useRouter();
  const id = useId();
  const [paso, setPaso] = useState<1 | 2>(1);
  const [tipo, setTipo] = useState<TipoDeEvento | null>(null);
  const [personas, setPersonas] = useState("");
  const [fecha, setFecha] = useState("");
  const [sinFecha, setSinFecha] = useState(false);
  const [modoPresupuesto, setModoPresupuesto] = useState<"pp" | "total">("pp");
  const [presupuesto, setPresupuesto] = useState("");
  const [comentarioAbierto, setComentarioAbierto] = useState(false);
  const [erroresPaso1, setErroresPaso1] = useState<ErroresSolicitud>({});
  const [origen, setOrigen] = useState("hero");
  // "Hoy" solo se calcula en el navegador: la página se prerenderiza y no puede fijar una fecha.
  const hoy = useSyncExternalStore(sinSuscripcion, hoyEnSantiago, () => null);
  const inicio = useRef(0);
  const empezado = useRef(false);
  const tarjeta = useRef<HTMLDivElement>(null);
  const tituloPaso2 = useRef<HTMLHeadingElement>(null);
  const primerTipo = useRef<HTMLButtonElement>(null);

  // Antes de enviar: sumar atribución (UTM, gclid, página de llegada) y hora de inicio (anti-spam).
  // Si el servidor rechaza algo del paso 1, volver a mostrarlo.
  const [estado, accion, enviando] = useActionState(async (previo: EstadoEnvio, formData: FormData) => {
    const atribucion = leerAtribucion();
    for (const c of [...CAMPOS_UTM, "paginaDeLlegada"]) if (atribucion[c]) formData.set(c, atribucion[c]);
    if (inicio.current) formData.set("inicio", String(inicio.current));
    const r = await enviarSolicitud(previo, formData);
    if (r.estado === "error" && (r.errores.tipo || r.errores.personas || r.errores.fecha)) setPaso(1);
    return r;
  }, inicial);

  // "Cotizar" desde otras secciones: deja el tipo elegido y vuelve al paso 1
  useEffect(() => {
    const alCotizar = (e: Event) => {
      const { tipo: t, origen: o } = (e as CustomEvent<DetalleCotizar>).detail;
      if (t) setTipo(t);
      setOrigen(o);
      setPaso(1);
      // Mover el foco al formulario después del scroll suave
      window.setTimeout(() => primerTipo.current?.focus({ preventScroll: true }), 450);
    };
    window.addEventListener(EVENTO_COTIZAR, alCotizar);
    return () => window.removeEventListener(EVENTO_COTIZAR, alCotizar);
  }, []);

  const personasNum = personas ? Number(personas.replace(/\D/g, "")) : null;
  const aviso = precalificar({
    tipo,
    personas: personasNum,
    fecha: hoy ? fecha || null : null,
    sinFecha,
    hoy: hoy ?? "",
  });

  const marcarInicio = () => {
    if (empezado.current) return;
    empezado.current = true;
    inicio.current = Date.now();
    track("form_start", { origen });
  };

  const continuar = () => {
    const errores = validarPaso1({ tipo, personas, fecha, sinFecha }, hoy ?? hoyEnSantiago());
    setErroresPaso1(errores);
    if (Object.keys(errores).length > 0) {
      const primero = Object.keys(errores)[0];
      document.getElementById(`${id}-${primero}`)?.focus();
      return;
    }
    setPaso(2);
    track("form_step_2", { tipo: tipo ?? undefined, personas: personasNum ?? undefined });
    requestAnimationFrame(() => {
      tarjeta.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      tituloPaso2.current?.focus({ preventScroll: true });
    });
  };

  // Enviado: guardar el resumen para /gracias y navegar
  const nombreRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (estado.estado !== "enviado") return;
    track("form_submit", { tipo: tipo ?? undefined, personas: personasNum ?? undefined, origen });
    const resumen: ResumenSolicitud = {
      nombre: nombreRef.current?.value.trim().split(" ")[0] ?? "",
      tipo: tipo ?? "Otro",
      personas: personasNum ?? 0,
      fecha: sinFecha ? null : fecha,
    };
    try {
      sessionStorage.setItem(CLAVE_RESUMEN, JSON.stringify(resumen));
    } catch {
      /* sin sessionStorage la confirmación se muestra genérica */
    }
    router.push("/gracias");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const erroresServidor = estado.estado === "error" ? estado.errores : {};
  const errores: ErroresSolicitud = { ...erroresPaso1, ...erroresServidor };

  const error = (campo: keyof ErroresSolicitud) =>
    errores[campo] ? (
      <p id={`${id}-${campo}-error`} className="mt-1.5 text-[14px] font-medium text-negro">
        <span aria-hidden="true">→ </span>
        {errores[campo]}
      </p>
    ) : null;

  const describe = (campo: keyof ErroresSolicitud) => (errores[campo] ? `${id}-${campo}-error` : undefined);

  const resumenPaso1 = `${tipo ?? ""}, ${personasNum ?? ""} personas, ${sinFecha || !fecha ? "fecha por definir" : formatearFechaCorta(fecha)}`;

  return (
    <div
      ref={tarjeta}
      id="cotizar"
      className="sobre-claro scroll-mt-24 rounded-m bg-hueso p-5 text-negro shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)] sm:p-7"
    >
      {/* Progreso */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-pill bg-linea"
          role="progressbar"
          aria-label="Avance de la solicitud"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={paso}
        >
          <div
            className="h-full rounded-pill bg-negro transition-[width] duration-500 ease-out"
            style={{ width: paso === 1 ? "50%" : "100%" }}
          />
        </div>
        <span className="text-[13px] font-semibold whitespace-nowrap text-gris">Paso {paso} de 2</span>
      </div>

      <form
        noValidate
        onFocus={marcarInicio}
        onSubmit={(e) => {
          // Envío manual (no `action={...}`) para que React no limpie los campos si hay que corregir algo
          e.preventDefault();
          const datos = new FormData(e.currentTarget);
          startTransition(() => accion(datos));
        }}
      >
        {/* Datos del paso 1 y atribución viajan siempre */}
        <input type="hidden" name="tipo" value={tipo ?? ""} />
        <input type="hidden" name="origen" value={origen} />
        <input type="hidden" name="tipoPresupuesto" value={modoPresupuesto} />
        {/* Trampa para bots: invisible para personas y lectores de pantalla */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            No llenar
            <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* ---------- PASO 1 ---------- */}
        <div hidden={paso !== 1}>
          <fieldset>
            <legend className="font-display text-[24px] leading-tight font-bold tracking-[-0.02em] sm:text-[26px]">
              ¿Qué estás organizando?
            </legend>
            <div
              id={`${id}-tipo`}
              tabIndex={-1}
              className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
              aria-describedby={describe("tipo")}
            >
              {tiposDeEvento.map((t, i) => {
                const activo = tipo === t;
                return (
                  <button
                    key={t}
                    ref={i === 0 ? primerTipo : undefined}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => {
                      marcarInicio();
                      setTipo(t);
                      setErroresPaso1((e) => ({ ...e, tipo: undefined }));
                    }}
                    className={`min-h-12 rounded-s px-2 text-[15px] transition-colors duration-150 ${
                      activo
                        ? "border-[1.5px] border-negro bg-negro font-semibold text-crema"
                        : "border border-linea bg-crema text-negro hover:border-negro"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {error("tipo")}
          </fieldset>

          <div className="mt-4 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3">
            <div>
              <label htmlFor={`${id}-personas`} className={claseLabel}>
                Personas
              </label>
              <input
                id={`${id}-personas`}
                name="personas"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ej: 40"
                value={personas}
                onChange={(e) => {
                  setPersonas(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setErroresPaso1((er) => ({ ...er, personas: undefined }));
                }}
                aria-invalid={!!errores.personas}
                aria-describedby={describe("personas")}
                className={claseInput}
              />
            </div>
            <div>
              <label htmlFor={`${id}-fecha`} className={claseLabel}>
                Fecha
              </label>
              <input
                id={`${id}-fecha`}
                name="fecha"
                type="date"
                min={hoy ?? undefined}
                value={sinFecha ? "" : fecha}
                disabled={sinFecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setErroresPaso1((er) => ({ ...er, fecha: undefined }));
                }}
                aria-invalid={!!errores.fecha}
                aria-describedby={describe("fecha")}
                className={`${claseInput} disabled:opacity-50`}
              />
            </div>
          </div>
          {error("personas")}
          {error("fecha")}

          <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
            <input
              type="checkbox"
              name="sinFecha"
              value="1"
              checked={sinFecha}
              onChange={(e) => {
                setSinFecha(e.target.checked);
                setErroresPaso1((er) => ({ ...er, fecha: undefined }));
              }}
              className="size-5 accent-negro"
            />
            Aún no sé la fecha
          </label>

          {/* Aviso en vivo: sin precios */}
          <p
            aria-live="polite"
            className={`mt-3 rounded-s px-3.5 py-3 text-[15px] leading-snug ${
              aviso.tono === "alerta"
                ? "border-[1.5px] border-negro bg-crema font-medium"
                : aviso.tono === "ok"
                  ? "border border-linea bg-crema font-medium"
                  : "border border-dashed border-linea text-gris"
            }`}
          >
            {aviso.tono === "ok" && (
              <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-pill bg-amarillo align-middle" />
            )}
            {aviso.mensaje}
          </p>

          <button type="button" onClick={continuar} className={`${botonPrimario} mt-4 w-full`}>
            Continuar <Flecha />
          </button>
        </div>

        {/* ---------- PASO 2 ---------- */}
        <div hidden={paso !== 2}>
          <div className="flex items-start justify-between gap-3 rounded-s bg-crema px-3.5 py-3 text-[15px]">
            <p>
              <span className="sr-only">Tu evento: </span>
              <strong className="font-semibold">{resumenPaso1}</strong>
            </p>
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="-my-2 min-h-11 shrink-0 px-1 font-semibold underline underline-offset-4"
            >
              Editar
            </button>
          </div>

          <h2
            ref={tituloPaso2}
            tabIndex={-1}
            className="mt-5 text-[26px] leading-tight focus:outline-none sm:text-[28px]"
          >
            ¿A quién le enviamos la propuesta?
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-nombre`} className={claseLabel}>
                Nombre
              </label>
              <input
                ref={nombreRef}
                id={`${id}-nombre`}
                name="nombre"
                type="text"
                autoComplete="given-name"
                placeholder="Ej: Daniela"
                aria-invalid={!!errores.nombre}
                aria-describedby={describe("nombre")}
                className={claseInput}
              />
              {error("nombre")}
            </div>
            <div>
              <label htmlFor={`${id}-empresa`} className={claseLabel}>
                Empresa
              </label>
              <input
                id={`${id}-empresa`}
                name="empresa"
                type="text"
                autoComplete="organization"
                placeholder="Nombre de tu empresa"
                aria-invalid={!!errores.empresa}
                aria-describedby={describe("empresa")}
                className={claseInput}
              />
              {error("empresa")}
            </div>
            <div>
              <label htmlFor={`${id}-whatsapp`} className={claseLabel}>
                WhatsApp
              </label>
              <div className="flex">
                <span className="inline-flex h-12 items-center rounded-l-s border border-r-0 border-linea bg-crema px-3 text-[17px] font-medium text-gris">
                  +56 9
                </span>
                <input
                  id={`${id}-whatsapp`}
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  placeholder="1234 5678"
                  maxLength={14}
                  aria-invalid={!!errores.whatsapp}
                  aria-describedby={describe("whatsapp")}
                  className={`${claseInput} rounded-l-none`}
                />
              </div>
              {error("whatsapp")}
            </div>
            <div>
              <label htmlFor={`${id}-email`} className={claseLabel}>
                Email de trabajo
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@empresa.cl"
                aria-invalid={!!errores.email}
                aria-describedby={describe("email") ?? `${id}-email-ayuda`}
                className={claseInput}
              />
              {error("email") ?? (
                <p id={`${id}-email-ayuda`} className="mt-1.5 text-[14px] text-gris">
                  Ahí te llega el link a tu propuesta.
                </p>
              )}
            </div>
          </div>

          <fieldset className="mt-5 rounded-s border border-linea p-4">
            <legend className="px-1 text-[15px] font-semibold">
              Presupuesto aproximado <span className="font-normal text-gris">(opcional)</span>
            </legend>
            <div role="group" aria-label="Tipo de presupuesto" className="inline-flex rounded-pill bg-crema p-1">
              {(
                [
                  ["pp", "Por persona"],
                  ["total", "Total del evento"],
                ] as const
              ).map(([modo, etiqueta]) => (
                <button
                  key={modo}
                  type="button"
                  aria-pressed={modoPresupuesto === modo}
                  onClick={() => setModoPresupuesto(modo)}
                  className={`min-h-11 rounded-pill px-4 text-[14px] transition-colors ${
                    modoPresupuesto === modo ? "bg-negro font-semibold text-crema" : "text-negro"
                  }`}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
            <label htmlFor={`${id}-presupuesto`} className="sr-only">
              {modoPresupuesto === "pp" ? "Monto por persona, en pesos" : "Monto total, en pesos"}
            </label>
            <div className="mt-3 flex">
              <span className="inline-flex h-12 items-center rounded-l-s border border-r-0 border-linea bg-crema px-3.5 text-[17px] font-medium text-gris">
                $
              </span>
              <input
                id={`${id}-presupuesto`}
                name="presupuesto"
                type="text"
                inputMode="numeric"
                placeholder={modoPresupuesto === "pp" ? "Monto por persona" : "Monto total"}
                value={presupuesto}
                onChange={(e) => setPresupuesto(formatearMiles(e.target.value))}
                aria-describedby={`${id}-presupuesto-ayuda`}
                className={`${claseInput} rounded-l-none`}
              />
            </div>
            <p id={`${id}-presupuesto-ayuda`} className="mt-1.5 text-[14px] text-gris">
              Nos ayuda a armar una propuesta que calce con lo que tienes.
            </p>
          </fieldset>

          {comentarioAbierto ? (
            <div className="mt-4">
              <label htmlFor={`${id}-comentario`} className={claseLabel}>
                Comentario <span className="font-normal text-gris">(opcional)</span>
              </label>
              <textarea
                id={`${id}-comentario`}
                name="comentario"
                rows={3}
                placeholder="Dietas especiales, lugar, horario…"
                className={`${claseInput} h-auto py-3`}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setComentarioAbierto(true);
                requestAnimationFrame(() => document.getElementById(`${id}-comentario`)?.focus());
              }}
              className="mt-3 min-h-11 text-[15px] font-semibold underline underline-offset-4"
            >
              + Agregar un comentario (dietas, lugar, horario)
            </button>
          )}

          {estado.estado === "error" && estado.mensaje && (
            <div role="alert" className="mt-4 rounded-s border-[1.5px] border-negro bg-crema p-3.5 text-[15px]">
              {estado.mensaje}{" "}
              <LinkWhatsApp ubicacion="formulario" className="font-semibold underline underline-offset-4">
                Escribir por WhatsApp
              </LinkWhatsApp>
            </div>
          )}

          <button type="submit" disabled={enviando} className={`${botonPrimario} mt-5 w-full disabled:opacity-70`}>
            {enviando ? "Enviando…" : "Enviar solicitud"}
          </button>
          <p className="mt-3 text-center text-[14px] text-gris">
            Te respondemos en menos de 1 hora hábil. Usamos tus datos solo para esta cotización.
          </p>
        </div>
      </form>
    </div>
  );
}
