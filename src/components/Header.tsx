"use client";

import { useEffect, useState } from "react";
import { CotizarLink } from "@/components/CotizarLink";
import { IconoWhatsApp, LinkWhatsApp, Wordmark, botonPrimario } from "@/components/ui";

const enlaces = [
  { href: "#servicios", texto: "Servicios" },
  { href: "#como-funciona", texto: "Cómo funciona" },
  { href: "#preguntas", texto: "Preguntas" },
];

export function Header() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const alEscape = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alEscape);
    return () => window.removeEventListener("keydown", alEscape);
  }, [abierto]);

  return (
    <header className="sticky top-0 z-40 border-b border-carbon bg-negro text-crema">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 pr-3 pl-5 md:h-[72px] md:px-8">
        <a href="#inicio" className="rounded-s py-1" aria-label="Bistró, ir al inicio">
          <Wordmark />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="text-[15px] font-medium text-crema/85 transition-colors hover:text-crema"
            >
              {e.texto}
            </a>
          ))}
          <LinkWhatsApp
            ubicacion="header"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-crema/85 hover:text-crema"
          >
            <IconoWhatsApp className="size-[18px]" /> WhatsApp
          </LinkWhatsApp>
          <CotizarLink ubicacion="header" className={`${botonPrimario} min-h-11 px-5 text-[15px]`}>
            Cotiza tu evento
          </CotizarLink>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LinkWhatsApp
            ubicacion="header"
            aria-label="Escribir por WhatsApp"
            className="inline-flex size-11 items-center justify-center rounded-pill border border-carbon text-crema"
          >
            <IconoWhatsApp />
          </LinkWhatsApp>
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-s border border-carbon"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {abierto ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Menú" className="border-t border-carbon px-5 pt-2 pb-6 md:hidden">
          <ul>
            {enlaces.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  className="font-display flex min-h-14 items-center border-b border-carbon text-[24px] font-bold tracking-[-0.02em]"
                >
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
          <CotizarLink ubicacion="menu" onClick={() => setAbierto(false)} className={`${botonPrimario} mt-6 w-full`}>
            Cotiza tu evento
          </CotizarLink>
        </nav>
      )}
    </header>
  );
}
