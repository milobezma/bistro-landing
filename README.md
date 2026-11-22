# bistrochile.com

Web de Bistró, catering corporativo en Santiago. Next.js 16 (App Router) + TypeScript + Tailwind 4, deploy en Vercel.

- Contenido, marca y reglas: [`CLAUDE.md`](CLAUDE.md)
- Diseño y plan por fases: [`docs/superpowers/specs/2026-11-21-bistro-web-design.md`](docs/superpowers/specs/2026-11-21-bistro-web-design.md)
- Wireframes: [`docs/wireframes/`](docs/wireframes/)
- Sitio anterior (HTML estático, ya no se publica): [`legacy/`](legacy/)

## Correr en local

```bash
npm install
cp .env.example .env.local   # y completar AIRTABLE_TOKEN
npm run dev                  # http://localhost:3000
```

```bash
npm test          # reglas del aviso en vivo y validación del formulario
npm run lint
npm run build
```

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Textos, cifras, servicios, preguntas, reseñas | `src/content/sitio.ts` |
| Reglas del aviso en vivo del formulario | `src/lib/precalificacion.ts` |
| Colores, tipografía, grano, animación del hero | `src/app/globals.css` |
| Fotos | `public/images/` |

Las reseñas de Google se muestran solo cuando se cargan en `src/content/sitio.ts` (`resenas`).

## Formulario → Airtable

El formulario guarda cada solicitud en la base **Bistró CRM**, tabla **Solicitudes** (con tipo, personas, fecha, presupuesto, precalificación, origen y UTM). El token de Airtable vive solo en el servidor (`AIRTABLE_TOKEN`). Si falta, el formulario muestra un error amable con el link a WhatsApp y el error queda en los logs.
