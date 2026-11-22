import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Confirmacion } from "@/components/formulario/Confirmacion";
import { IconoWhatsApp, LinkWhatsApp, Wordmark, botonPrimario } from "@/components/ui";
import { sitio } from "@/content/sitio";

export const metadata: Metadata = {
  title: "Recibimos tu solicitud | Bistró",
  robots: { index: false, follow: false },
};

const queSigue = [
  "Te contactamos en menos de 1 hora hábil.",
  "Recibes la propuesta con precios en menos de 24 horas.",
  "Reservas la fecha con el 50% y nosotros nos encargamos del resto.",
];

export default function Gracias() {
  return (
    <>
      <header className="border-b border-carbon bg-negro text-crema">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center px-5 md:h-[72px] md:px-8">
          <Link href="/" aria-label="Bistró, volver al inicio" className="rounded-s py-1">
            <Wordmark />
          </Link>
        </div>
      </header>

      <main className="fondo-crema">
        <div className="mx-auto max-w-[720px] px-5 pt-12 pb-20 md:pt-20">
          <Confirmacion />

          {/* Tarjeta de Carolina */}
          <figure className="mt-10 flex gap-5 rounded-m border border-linea bg-hueso p-5 sm:items-center sm:p-6">
            <Image
              src="/images/carolina.jpg"
              alt=""
              width={924}
              height={1820}
              sizes="96px"
              className="size-20 shrink-0 rounded-pill object-cover object-[50%_18%] sm:size-24"
            />
            <div>
              <blockquote className="font-display text-[20px] leading-snug font-medium tracking-[-0.01em] sm:text-[22px]">
                “Te escribo en menos de 1 hora hábil para afinar los detalles de tu evento.”
              </blockquote>
              <figcaption className="mt-2 text-[15px]">
                <span className="font-semibold">{sitio.directora.nombre}</span>
                <span className="text-gris"> · {sitio.directora.cargo}</span>
              </figcaption>
            </div>
          </figure>

          <h2 className="mt-14 text-[30px] md:text-[34px]">Qué pasa ahora</h2>
          <ol className="mt-6 space-y-5">
            {queSigue.map((t, i) => (
              <li key={t} className="grid grid-cols-[40px_1fr] items-start gap-4">
                <span className="font-display inline-flex size-10 items-center justify-center rounded-pill border border-negro text-[18px] font-bold">
                  {i + 1}
                </span>
                <p className="pt-1.5">{t}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-start gap-3">
            <LinkWhatsApp
              ubicacion="confirmacion"
              mensaje="Hola Carolina, acabo de enviar una solicitud de cotización desde la web."
              className={botonPrimario}
            >
              <IconoWhatsApp /> Escribir por WhatsApp ahora
            </LinkWhatsApp>
            <p className="text-[15px] text-gris">Si es urgente o quieres adelantar detalles.</p>
          </div>

          <Link href="/" className="mt-10 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            Volver al inicio
          </Link>
        </div>
      </main>
    </>
  );
}
