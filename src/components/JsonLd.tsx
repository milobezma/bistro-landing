import { preguntas, servicios, sitio } from "@/content/sitio";

/** schema.org: FoodEstablishment/LocalBusiness (Caterer) + FAQPage, generados desde el mismo contenido de la página. */
export function JsonLd() {
  const negocio = {
    "@context": "https://schema.org",
    "@type": ["FoodEstablishment", "LocalBusiness"],
    additionalType: "https://schema.org/Caterer",
    name: "Bistró",
    legalName: sitio.razonSocial,
    description: sitio.descripcion,
    url: sitio.url,
    image: `${sitio.url}/images/bistro-coffee-break-4x5.jpg`,
    telephone: `+${sitio.whatsapp.numero}`,
    ...(sitio.email ? { email: sitio.email } : {}),
    servesCuisine: "Catering corporativo",
    areaServed: sitio.cobertura.zonas.map((name) => ({ "@type": "Place", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    founder: { "@type": "Person", name: sitio.directora.nombreCompleto },
    foundingDate: String(sitio.cifras.desde),
    sameAs: [sitio.instagram.url],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de catering corporativo",
      itemListElement: servicios.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.titulo, description: s.paraQue },
      })),
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(negocio).replace(/</g, "\\u003c") }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, "\\u003c") }} />
    </>
  );
}
