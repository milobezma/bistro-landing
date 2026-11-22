import { CotizarLink } from "@/components/CotizarLink";
import { Flecha, IconoWhatsApp, LinkWhatsApp, Wordmark, botonPrimario } from "@/components/ui";
import { sitio } from "@/content/sitio";

export function Cierre() {
  return (
    <section aria-labelledby="titulo-cierre" className="bg-negro text-crema">
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="titulo-cierre" className="max-w-[16ch] text-[clamp(2.4rem,4.4vw+1rem,4rem)] text-crema">
          ¿Tienes un evento en mente?
        </h2>
        <p className="mt-5 max-w-[40ch] text-[18px] text-crema/85 md:text-[20px]">
          Cuéntanos en un par de minutos y te respondemos en menos de 1 hora hábil.
        </p>
        <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <CotizarLink ubicacion="cierre" className={botonPrimario}>
            Cotiza tu evento <Flecha />
          </CotizarLink>
          <LinkWhatsApp
            ubicacion="cierre"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-crema underline underline-offset-4"
          >
            <IconoWhatsApp className="size-[18px]" /> O escríbenos por WhatsApp
          </LinkWhatsApp>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const anio = 2026; // estático: la página se prerenderiza
  return (
    <footer className="border-t border-carbon bg-negro pb-28 text-crema md:pb-0">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Wordmark conBajada />
          <p className="mt-4 max-w-[32ch] text-[15px] text-crema/75">Llegamos a {sitio.cobertura.completa}</p>
        </div>
        <nav aria-label="Secciones" className="md:col-span-3">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-crema/60 uppercase">Secciones</p>
          <ul className="mt-3 text-[15px]">
            {[
              ["#servicios", "Servicios"],
              ["#como-funciona", "Cómo funciona"],
              ["#preguntas", "Preguntas"],
            ].map(([href, texto]) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center text-crema/85 hover:text-crema">
                  {texto}
                </a>
              </li>
            ))}
            <li>
              <CotizarLink ubicacion="footer" className="inline-flex min-h-11 items-center text-crema/85 hover:text-crema">
                Cotizar
              </CotizarLink>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-crema/60 uppercase">Contacto</p>
          <ul className="mt-3 text-[15px]">
            <li>
              <LinkWhatsApp ubicacion="footer" className="inline-flex min-h-11 items-center text-crema/85 hover:text-crema">
                {sitio.whatsapp.visible}
              </LinkWhatsApp>
            </li>
            <li>
              <a
                href={sitio.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-crema/85 hover:text-crema"
              >
                {sitio.instagram.usuario}
              </a>
            </li>
            {sitio.email && (
              <li>
                <a href={`mailto:${sitio.email}`} className="inline-flex min-h-11 items-center text-crema/85 hover:text-crema">
                  {sitio.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] border-t border-carbon px-5 py-6 text-[14px] text-crema/60 md:px-8">
        © {anio} {sitio.razonSocial}
      </div>
    </footer>
  );
}
