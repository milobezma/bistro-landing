import Image from "next/image";
import type { ReactNode } from "react";
import { CotizarLink } from "@/components/CotizarLink";
import { Flecha, IconoWhatsApp, LinkWhatsApp, Sello, botonPrimario, botonSecundarioClaro } from "@/components/ui";
import { servicios, type Servicio } from "@/content/sitio";

const porId = Object.fromEntries(servicios.map((s) => [s.id, s])) as Record<string, Servicio>;

function Foto({ s, aspecto, sizes, children }: { s: Servicio; aspecto: string; sizes: string; children?: ReactNode }) {
  if (!s.foto) {
    // Sin foto real todavía: panel tipográfico, nunca stock ni imagen generada.
    return (
      <div className={`relative flex ${aspecto} flex-col justify-end overflow-hidden rounded-m bg-negro p-6 text-crema sm:p-8`}>
        <p className="font-display max-w-[14ch] text-[clamp(1.75rem,3vw+0.6rem,2.75rem)] leading-[1.05] font-bold tracking-[-0.03em]">
          A la mesa o en <em className="font-medium text-amarillo italic">box lunch</em>.
        </p>
        {children}
      </div>
    );
  }
  return (
    <div className="relative">
      <Image
        src={s.foto.src}
        alt={s.foto.alt}
        width={s.foto.ancho}
        height={s.foto.alto}
        sizes={sizes}
        className={`${aspecto} w-full rounded-m object-cover`}
        style={s.foto.posicion ? { objectPosition: s.foto.posicion } : undefined}
      />
      {children}
    </div>
  );
}

function Texto({ s, grande = false }: { s: Servicio; grande?: boolean }) {
  return (
    <div className="mt-5">
      <h3 className={grande ? "text-[26px] md:text-[30px]" : "text-[24px] md:text-[26px]"}>{s.titulo}</h3>
      <p className="mt-2 max-w-[44ch] text-gris">{s.paraQue}</p>
      {s.tags && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Opciones de dieta">
          {s.tags.map((t) => (
            <li key={t} className="rounded-pill border border-linea bg-hueso px-3 py-1 text-[14px] font-medium">
              {t}
            </li>
          ))}
        </ul>
      )}
      <CotizarLink ubicacion="servicio" tipo={s.tipo} className={`${botonSecundarioClaro} mt-4 min-h-11 px-5 text-[15px]`}>
        {s.cta} <Flecha />
      </CotizarLink>
    </div>
  );
}

export function Servicios() {
  const coffee = porId.coffee;
  const almuerzo = porId.almuerzo;
  const coctel = porId.coctel;
  const desayuno = porId.desayuno;
  const brunch = porId.brunch;

  return (
    <section id="servicios" aria-labelledby="titulo-servicios" className="fondo-crema scroll-mt-16">
      <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-16 md:px-8 md:pt-24 md:pb-24">
        {/* Mobile: la foto del coffee break abre la sección, asomando desde el hero */}
        <div className="grid gap-x-10 lg:grid-cols-12 lg:items-end">
          <h2 id="titulo-servicios" className="text-[clamp(2.1rem,3.4vw+1rem,3rem)] lg:col-span-7">
            Lo que preparamos para tu empresa
          </h2>
          <p className="mt-4 max-w-[40ch] text-gris lg:col-span-5 lg:mt-0 lg:pb-2">
            Cada propuesta se arma según tu evento, tu número de personas y tu presupuesto.
          </p>
        </div>

        {/* Fila 1: foto grande (coffee) + foto ancha (almuerzo) */}
        <div className="mt-10 grid gap-x-10 gap-y-14 md:mt-14 lg:grid-cols-12">
          <article className="lg:col-span-6">
            <Foto s={coffee} aspecto="aspect-[4/5]" sizes="(min-width: 1024px) 600px, 100vw">
              <Sello className="absolute -top-9 right-5 size-24 drop-shadow-[0_10px_30px_rgb(0_0_0/0.18)] sm:size-28" />
            </Foto>
            <Texto s={coffee} grande />
          </article>

          <article className="lg:col-span-6 lg:pt-28">
            <Foto s={almuerzo} aspecto="aspect-[16/11]" sizes="(min-width: 1024px) 600px, 100vw" />
            <Texto s={almuerzo} grande />
          </article>
        </div>

        {/* Fila 2: dos fotos de alto distinto */}
        <div className="mt-16 grid gap-x-10 gap-y-14 md:mt-20 sm:grid-cols-2 lg:grid-cols-12">
          <article className="lg:col-span-5">
            <Foto s={coctel} aspecto="aspect-[4/5]" sizes="(min-width: 1024px) 500px, (min-width: 640px) 50vw, 100vw" />
            <Texto s={coctel} />
          </article>
          <article className="sm:pt-16 lg:col-span-6 lg:col-start-7 lg:pt-32">
            <Foto s={desayuno} aspecto="aspect-[4/3]" sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw" />
            <Texto s={desayuno} />
          </article>
        </div>

        {/* Fila chica: brunch */}
        <article className="mt-16 grid items-center gap-6 border-t border-linea pt-10 sm:grid-cols-[220px_1fr] md:mt-20 lg:grid-cols-[280px_1fr_auto] lg:gap-10">
          <Foto s={brunch} aspecto="aspect-square" sizes="(min-width: 1024px) 280px, (min-width: 640px) 220px, 100vw" />
          <div className="[&>div]:mt-0">
            <Texto s={brunch} />
          </div>
        </article>
      </div>

      <MasDeCien />

      {/* Cierre de servicios */}
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-5 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8 md:py-16">
        <p className="font-display max-w-[24ch] text-[26px] leading-tight font-bold tracking-[-0.02em] md:text-[30px]">
          ¿No sabes qué elegir? Cuéntanos qué necesitas y te recomendamos.
        </p>
        <LinkWhatsApp
          ubicacion="servicio"
          mensaje="Hola Bistró, quiero organizar un evento y no sé qué servicio elegir."
          className={botonSecundarioClaro}
        >
          <IconoWhatsApp /> Escríbenos por WhatsApp
        </LinkWhatsApp>
      </div>
    </section>
  );
}

function MasDeCien() {
  return (
    <div className="bg-negro text-crema">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="text-[clamp(2.1rem,3.4vw+1rem,3rem)] text-crema">¿Más de 100 personas?</h2>
          <p className="mt-4 max-w-[38ch] text-crema/85">
            También hacemos eventos grandes. Para estos recomendamos <strong className="font-semibold text-crema">al menos 2 semanas de anticipación</strong>, para que todo salga con la calidad que nos representa.
          </p>
          <CotizarLink ubicacion="mas-de-100" className={`${botonPrimario} mt-8`}>
            Cotizar un evento grande <Flecha />
          </CotizarLink>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          {/*
            TODO: reemplazar por el video de 8 s del evento grande (MP4 H.264 + WebM < 3 MB, 4:5, sin audio,
            con `poster` y sin autoplay en conexiones lentas) cuando haya OK por las caras (CLAUDE.md § Pendientes).
          */}
          <Image
            src="/images/evento-grande.jpg"
            alt="Mesa de un evento grande de Bistró: bandejas con sándwiches, brochetas y postres en vasitos."
            width={1554}
            height={2000}
            sizes="(min-width: 1024px) 480px, 100vw"
            className="aspect-[4/5] w-full rounded-m object-cover"
          />
        </div>
      </div>
    </div>
  );
}
