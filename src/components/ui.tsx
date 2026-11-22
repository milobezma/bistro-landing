import type { ComponentProps } from "react";
import { urlWhatsApp } from "@/lib/whatsapp";
import type { Ubicacion } from "@/lib/ga";

/* Botones (CLAUDE.md § Forma y componentes). Píldora, ≥ 48 px, Instrument Sans 600. */
const baseBoton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-pill px-6 text-[16px] font-semibold leading-tight transition-colors duration-200 select-none";

export const botonPrimario = `${baseBoton} bg-amarillo text-negro hover:bg-amarillo-hover`;
export const botonSecundarioClaro = `${baseBoton} border-[1.5px] border-negro text-negro hover:bg-negro hover:text-crema`;
export const botonSecundarioOscuro = `${baseBoton} border-[1.5px] border-crema text-crema hover:bg-crema hover:text-negro`;

export function IconoWhatsApp({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

type LinkWhatsAppProps = Omit<ComponentProps<"a">, "href"> & { ubicacion: Ubicacion; mensaje?: string };

/** Link a WhatsApp con evento GA4 `whatsapp_click` (lo captura <Analytics />). */
export function LinkWhatsApp({ ubicacion, mensaje, children, ...props }: LinkWhatsAppProps) {
  return (
    <a
      href={urlWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      data-evento="whatsapp_click"
      data-ubicacion={ubicacion}
      {...props}
    >
      {children}
    </a>
  );
}

export function Wordmark({ className = "", conBajada = false }: { className?: string; conBajada?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className="font-display text-[26px] font-extrabold tracking-[-0.035em]"
        style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 0" }}
      >
        Bistró
      </span>
      {conBajada && (
        <span className="mt-1 text-[10px] font-semibold tracking-[0.22em] uppercase opacity-80">Catering corporativo</span>
      )}
    </span>
  );
}

/**
 * Sello / monograma (CLAUDE.md § Logo): círculo con "B" en Fraunces y el texto en anillo.
 * Es texto tipográfico, no un logo dibujado. Versión negro sobre amarillo.
 */
export function Sello({ className = "size-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Bistró, catering corporativo, Santiago">
      <circle cx="60" cy="60" r="60" fill="var(--amarillo)" />
      <circle cx="60" cy="60" r="31" fill="none" stroke="var(--negro)" strokeWidth="1" />
      <defs>
        <path id="anillo-sello" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text
        fill="var(--negro)"
        style={{ fontFamily: "var(--font-instrument)", fontSize: "9.4px", fontWeight: 600, letterSpacing: "0.16em" }}
      >
        <textPath href="#anillo-sello" textLength="272">
          BISTRÓ · CATERING CORPORATIVO · SANTIAGO ·
        </textPath>
      </text>
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--negro)"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "42px",
          fontWeight: 800,
          fontVariationSettings: "'SOFT' 100, 'WONK' 0",
        }}
      >
        B
      </text>
    </svg>
  );
}

export function Check({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Flecha({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
