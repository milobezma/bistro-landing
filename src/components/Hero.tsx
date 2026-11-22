import Image from "next/image";
import { FormularioCotizacion } from "@/components/formulario/FormularioCotizacion";
import { Check, LinkWhatsApp } from "@/components/ui";
import { clientesConLogo, sitio } from "@/content/sitio";
import type { CSSProperties } from "react";

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

const requisitos = [`Desde ${sitio.minimoPersonas} personas`, sitio.cobertura.corta, "Factura a empresas"];

function PruebaSocial() {
  const { eventos, empresas, desde } = sitio.cifras;
  return (
    <div>
      {eventos && empresas ? (
        <p className="text-[15px] text-crema/85">
          <strong className="font-semibold text-crema">+{eventos} eventos</strong> para{" "}
          <strong className="font-semibold text-crema">+{empresas} empresas</strong> desde {desde}
        </p>
      ) : null}
      <ul className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4" aria-label="Algunas empresas que nos contratan">
        {clientesConLogo.map((c) => (
          <li key={c.nombre}>
            <Image
              src={c.src}
              alt={c.nombre}
              width={c.ancho}
              height={c.alto}
              sizes="160px"
              className={`${c.clase} w-auto opacity-80 [filter:brightness(0)_invert(1)]`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-negro text-crema" aria-labelledby="titulo-hero">
      <div className="mx-auto grid max-w-[1320px] gap-x-14 px-5 pt-8 pb-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,460px)] lg:pt-14 lg:pb-20">
        {/* Columna de texto */}
        <div className="lg:pt-4">
          <h1
            id="titulo-hero"
            className="text-[clamp(2.05rem,3.6vw+1rem,3.9rem)] tracking-[-0.035em] text-balance text-crema"
          >
            <span className="revelar block" style={retraso(40)}>
              Coffee breaks, almuerzos
            </span>
            <span className="revelar block" style={retraso(140)}>
              y cócteles para{" "}
              <em className="font-medium text-amarillo italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 0" }}>
                tu empresa
              </em>
              .
            </span>
          </h1>
          {/* TODO: copy final del titular (CLAUDE.md § Pendientes). Este es el borrador del wireframe. */}

          <p
            className="revelar mt-5 max-w-[34ch] text-[18px] leading-relaxed text-crema/85 md:text-[20px]"
            style={retraso(260)}
          >
            Te respondemos en menos de 1 hora hábil y te enviamos la propuesta con precios en menos de 24.
          </p>

          <ul
            className="revelar mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-[15px] font-medium"
            style={retraso(360)}
            aria-label="Requisitos"
          >
            {requisitos.map((r) => (
              <li key={r} className="inline-flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-pill bg-amarillo text-negro">
                  <Check className="size-3" />
                </span>
                {r}
              </li>
            ))}
          </ul>

          {/* Escritorio: cifras y logos antes del pliegue, después la foto */}
          <div className="mt-9 hidden lg:block">
            <PruebaSocial />
          </div>

          {/* Foto solo en escritorio: en mobile el formulario va primero */}
          <div className="relative mt-10 hidden lg:block">
            <Image
              src="/images/coctel-servicio.jpg"
              alt="Garzona de Bistró sirviendo bocados en un cóctel de empresa, en una oficina."
              width={1988}
              height={2000}
              sizes="(min-width: 1320px) 720px, 55vw"
              className="aspect-[16/9] w-full rounded-m object-cover object-[50%_42%]"
            />
          </div>

        </div>

        {/* Formulario: sin animación de entrada, siempre sobre el pliegue en escritorio */}
        <div className="mt-8 lg:sticky lg:top-24 lg:mt-0 lg:self-start">
          <FormularioCotizacion />
          <p className="mt-4 text-center text-[15px] text-crema/80">
            ¿Prefieres conversarlo?{" "}
            <LinkWhatsApp ubicacion="hero" className="font-semibold text-crema underline underline-offset-4">
              Escríbenos por WhatsApp
            </LinkWhatsApp>
          </p>
        </div>

        <div className="mt-10 lg:hidden">
          <PruebaSocial />
        </div>
      </div>
    </section>
  );
}
