import Image from "next/image";
import { LinkWhatsApp } from "@/components/ui";
import { preguntas, presentacionCarolina, sitio } from "@/content/sitio";

export function CarolinaPreguntas() {
  return (
    <section className="fondo-crema">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-12">
        {/* Carolina */}
        <div aria-labelledby="titulo-carolina" role="region" className="lg:col-span-5">
          <div className="relative max-w-[440px]">
            <Image
              src="/images/carolina.jpg"
              alt="Carolina Hurtado, directora de Bistró."
              width={924}
              height={1820}
              sizes="(min-width: 1024px) 440px, 100vw"
              className="aspect-[4/5] w-full rounded-m object-cover object-[50%_20%]"
            />
          </div>
          <h2 id="titulo-carolina" className="mt-8 text-[clamp(1.9rem,2.6vw+1rem,2.6rem)]">
            Detrás de cada evento está Carolina
          </h2>
          <p className="mt-4 max-w-[46ch] text-gris">{presentacionCarolina}</p>
          <p className="mt-5 text-[15px]">
            <span className="font-semibold">{sitio.directora.nombre}</span>
            <span className="text-gris"> · {sitio.directora.cargo}</span>
          </p>
        </div>

        {/* Preguntas frecuentes: acordeón nativo, una abierta a la vez */}
        <div id="preguntas" aria-labelledby="titulo-preguntas" role="region" className="scroll-mt-20 lg:col-span-7 lg:col-start-6 lg:pl-8">
          <h2 id="titulo-preguntas" className="text-[clamp(2.1rem,3.4vw+1rem,3rem)]">
            Preguntas frecuentes
          </h2>
          <div className="mt-8 border-t border-linea">
            {preguntas.map((p, i) => (
              <details key={p.q} name="preguntas" open={i === 0} className="group border-b border-linea">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-[18px] font-semibold md:text-[19px]">
                  {p.q}
                  <span
                    aria-hidden="true"
                    className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-pill border border-negro transition-colors group-open:bg-negro group-open:text-crema"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-[56ch] pr-12 pb-6 text-gris">{p.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8">
            ¿Otra pregunta?{" "}
            <LinkWhatsApp ubicacion="preguntas" className="font-semibold underline underline-offset-4">
              Escríbenos por WhatsApp
            </LinkWhatsApp>
          </p>
        </div>
      </div>
    </section>
  );
}
