import { notaGoogle, resenas, sitio } from "@/content/sitio";

/**
 * Reseñas reales de Google, apiladas con distinto ancho (no carrusel).
 * Si no hay reseñas cargadas en src/content/sitio.ts, la sección no se renderiza.
 */
export function Resenas() {
  if (resenas.length === 0) return null;

  const anchos = ["lg:w-[78%]", "lg:ml-auto lg:w-[66%]", "lg:ml-[10%] lg:w-[72%]"];

  return (
    <section aria-labelledby="titulo-resenas" className="fondo-crema">
      <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="titulo-resenas" className="max-w-[20ch] text-[clamp(2.1rem,3.4vw+1rem,3rem)]">
          Lo que dicen quienes ya nos contrataron
        </h2>
        {notaGoogle && (
          <p className="mt-3 text-gris">
            <strong className="font-semibold text-negro">{notaGoogle.nota.toLocaleString("es-CL")}</strong> de 5 en
            Google, {notaGoogle.cantidad} reseñas
          </p>
        )}
        <div className="mt-10 space-y-5">
          {resenas.slice(0, 3).map((r, i) => (
            <figure key={r.nombre} className={`rounded-m border border-linea bg-hueso p-6 md:p-8 ${anchos[i]}`}>
              <blockquote className="font-display text-[22px] leading-snug font-medium tracking-[-0.01em] md:text-[24px]">
                “{r.texto}”
              </blockquote>
              <figcaption className="mt-4 text-[15px]">
                <span className="font-semibold">
                  {r.nombre}
                  {r.empresa ? `, ${r.empresa}` : ""}
                </span>
                <span className="text-gris"> · Reseña en Google</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <a
          href={sitio.resenasGoogleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
        >
          Ver todas las reseñas en Google
        </a>
      </div>
    </section>
  );
}
