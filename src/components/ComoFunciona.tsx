import { CotizarLink } from "@/components/CotizarLink";
import { Flecha, botonPrimario } from "@/components/ui";
import { pasos } from "@/content/sitio";

export function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="fondo-hueso scroll-mt-16 border-y border-linea">
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="titulo-como" className="max-w-[18ch] text-[clamp(2.1rem,3.4vw+1rem,3rem)]">
          De tu solicitud a tu evento, en 4 pasos
        </h2>

        <ol className="relative mt-10 grid gap-0 md:mt-14 lg:grid-cols-4 lg:gap-8">
          {/* Línea de tiempo: vertical en mobile, horizontal en escritorio */}
          <span aria-hidden="true" className="absolute top-2 bottom-8 left-[19px] w-px bg-linea lg:top-[19px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
          {pasos.map((p, i) => (
            <li key={p.titulo} className="relative grid grid-cols-[40px_1fr] gap-x-5 pb-9 last:pb-0 lg:block lg:pb-0">
              <span
                className={`font-display relative z-10 inline-flex size-10 items-center justify-center rounded-pill text-[18px] font-bold ${
                  i === pasos.length - 1 ? "bg-amarillo text-negro" : "border border-negro bg-hueso text-negro"
                }`}
              >
                {i + 1}
              </span>
              <div className="lg:mt-6">
                <h3 className="text-[22px] md:text-[24px]">{p.titulo}</h3>
                <p className="mt-2 max-w-[34ch] text-[16px] text-gris md:text-[17px]">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <CotizarLink ubicacion="como-funciona" className={`${botonPrimario} mt-12`}>
          Cotiza tu evento <Flecha />
        </CotizarLink>
      </div>
    </section>
  );
}
