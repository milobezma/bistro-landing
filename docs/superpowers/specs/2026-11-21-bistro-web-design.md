# Diseño: web nueva de Bistró (bistrochile.com)

Fecha: 2026-11-21 · Rama: `rediseno-nextjs` · Fuente de verdad de contenido y marca: `CLAUDE.md`. Layout y comportamiento: `docs/wireframes/`.

## Intención

Llegan solicitudes desde la web pero se cierran pocas. La web nueva tiene que (1) precalificar antes de que llegue la solicitud y traer los datos completos (incluido un presupuesto aproximado), y (2) reemplazar el PDF de Canva por una propuesta web que el cliente pueda reservar y pagar, y que le diga a Carolina quién la vio y qué eligió.

- **Objetivo:** más solicitudes que calzan (≥ 20 personas, con anticipación, en zona de cobertura) y más propuestas que terminan en reserva pagada.
- **No objetivos:** e-commerce con precios públicos, blog, panel de administración propio (Carolina trabaja en Airtable), multi-idioma.
- **Anti-objetivos:** que se vea genérico o "hecho con IA"; que el negro + amarillo parezca comida rápida; inventar cifras, reseñas o fotos; cualquier cosa que retrase ver el formulario.

## Enfoques considerados (orden de fases)

| | Qué | Trade-off |
|---|---|---|
| **A (elegido por Milovan)** | Landing + formulario + Airtable → Propuesta + reserva + pago → Seguimiento | Ordenado; la mejora en cierre llega en la fase 2. |
| B | Propuesta + seguimiento primero, landing vieja en línea | Ataca antes el cierre, pero convive con dos sitios. |
| C | Formulario nuevo + propuesta sin pago | Rápido, pero deja a medias las dos cosas. |

## Fases

1. **Fase 1 — Landing + formulario + Airtable** (esta rama). Landing completa según wireframes, formulario de 2 pasos con aviso en vivo, confirmación, guardado en Airtable `Solicitudes`, GA4, WhatsApp, schema.org.
2. **Fase 2 — Propuesta + reserva + pago.** `/propuesta/[id]` generada desde Airtable, elección de opción, reserva con datos de factura, pago del 50% con Flow (Webpay) o transferencia, confirmación por webhook.
3. **Fase 3 — Seguimiento.** Registro de vista/elección/estado, recordatorios automáticos a las 24 h y 48 h, vista "a quién llamar" en Airtable.

## Decisiones (las de Milovan y las mías)

- **Orden de fases:** A (Milovan).
- **Stack:** Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind 4, deploy en Vercel (de `CLAUDE.md`).
- **Repo (mi decisión):** el sitio estático viejo pasa a `legacy/` (no se publica), wireframes a `docs/wireframes/`. Se trabaja en la rama `rediseno-nextjs`; Vercel genera una URL de vista previa por rama. El paso a producción es un merge a `main` que decide Milovan.
- **Airtable (mi decisión):** se usa la base existente "Bistró CRM" (`appf6wFjUh7UgwX4Y`), no una nueva. Tabla nueva `Solicitudes` (creada). La tabla `Cotizaciones` vieja queda tal cual.
- **Pago (mi decisión, fase 2): Flow.** Integración más corta que Webpay Plus directo (no requiere afiliación propia con Transbank), tiene sandbox, cobra con Webpay y confirma por `urlConfirmation` servidor a servidor. Si Bistró ya tiene código de comercio Transbank, se reevalúa.
- **URL de propuesta (mi decisión, fase 2):** `/propuesta/<token>` con un token aleatorio de 22 caracteres (nanoid, ~130 bits) guardado en el registro de Airtable. La web lo genera la primera vez que Carolina marca la propuesta como "Lista para enviar" (automatización de Airtable → webhook de la web) y escribe el link en el registro. Nunca se usa el ID del registro ni un número correlativo. Páginas con `noindex`.
- **Reseñas:** no hay textos reales todavía → la sección no se renderiza (regla de `CLAUDE.md`). Queda el contenido en `src/content/sitio.ts`, listo para llenar.
- **Email de contacto:** `CLAUDE.md` dice "por definir" → no se muestra. El JSON-LD viejo usa `contacto@bistroexpress.cl`; tampoco se incluye hasta unificar con el dominio.
- **Fotos (mi decisión, a confirmar):** reales del sitio viejo. Coffee break → `bistro-coffee-break-4x5.jpg`; cóctel → foto del sitio viejo con garzona sirviendo; desayuno ejecutivo y brunch → fotos de servicio del sitio viejo; "más de 100" → foto de buffet grande (el video sigue pendiente de OK y compresión); Carolina → `Carolina.PNG` recortada (tenía la marca ✦ de un editor con IA en la esquina: confirmar que es una foto real solo retocada). **Almuerzo no tiene foto:** se muestra un panel tipográfico en negro, sin imagen.
- **Texto del paso 2:** el wireframe decía "Ahí te llega la propuesta en PDF"; como la propuesta pasa a ser una página web, queda "Ahí te llega el link a tu propuesta".

## Sistema de diseño (Tailwind 4)

Tokens en `src/app/globals.css` (`:root`) y expuestos a Tailwind con `@theme inline`: `negro`, `carbon`, `crema`, `hueso`, `gris`, `amarillo`, `amarillo-hover`, `linea`; fuentes `display` (Fraunces, ejes `SOFT`, `WONK`, `opsz`) y `body` (Instrument Sans) vía `next/font/google`; radios `s`, `m`, `pill`. No hay hex fuera de los tokens.

Componentes base: `Boton` (primario amarillo / secundario borde, píldora, ≥ 48 px), `Wordmark`, `Eyebrow` (uso escaso), `LinkWhatsApp` (con evento GA4 y ubicación), `CotizarLink` (preselecciona el tipo y sube al formulario), `Foto` (next/image con `--radio-m`).

Fondos: grano de papel (SVG `feTurbulence` en data URI, opacidad ~0,06) sobre crema; alternancia crema → hueso → negro.

Movimiento: entrada del hero con revelado escalonado (`animation-delay`) solo en titular, bajada y requisitos; el formulario aparece sin animación. Todo se desactiva con `prefers-reduced-motion`.

## Pantallas (fase 1)

Orden y contenido exactamente según `CLAUDE.md` § Landing y los wireframes:

1. **Header** negro: wordmark, WhatsApp, menú (mobile) / navegación + "Cotiza tu evento" (escritorio, sticky).
2. **Hero** sobre negro: H1 con "tu empresa" en itálica amarilla, bajada, requisitos, **formulario paso 1** en tarjeta hueso con aviso en vivo, link a WhatsApp, "+500 eventos para +30 empresas desde 2022" y logos (UC, BancoEstado, Entel, Santander) en crema monocromo. Escritorio: texto + requisitos + foto a la izquierda, formulario a la derecha sobre el pliegue.
3. **Servicios** sobre crema, composición editorial (foto alta, foto ancha, dos alturas distintas, fila chica), cada uno con "Cotizar" que preselecciona el tipo. Banda negra "¿Más de 100 personas?". Cierre "¿No sabes qué elegir?" → WhatsApp.
4. **Cómo funciona** sobre hueso: línea de tiempo de 4 pasos + CTA.
5. **Reseñas**: oculta hasta tener datos reales.
6. **Carolina + Preguntas frecuentes** (lado a lado en escritorio). Acordeón nativo `<details name>`, 7 preguntas de `CLAUDE.md`.
7. **Cierre**: banda negra "¿Tienes un evento en mente?" + footer.
8. **Barra fija mobile**: aparece cuando el formulario sale de pantalla (IntersectionObserver), se esconde cuando vuelve.
9. **Paso 2** (en la misma tarjeta): resumen con "Editar", nombre, empresa, WhatsApp con "+56 9" fijo, email, presupuesto opcional (Por persona / Total), comentario tras un link, "Enviar solicitud". Barra de progreso. Validación amable en cliente y servidor.
10. **Confirmación** `/gracias`: "Listo, [nombre]…", resumen, tarjeta de Carolina, 3 pasos, WhatsApp, volver al inicio. Lee el resumen de `sessionStorage` (la página es estática); sin datos muestra la versión genérica.

### Reglas del aviso en vivo (`src/lib/precalificacion.ts`, con tests)

En este orden: < 20 personas → aviso de caso a caso; fecha a < 7 días → aviso de disponibilidad; > 100 personas y < 14 días → recomendación de al menos 2 semanas; tipo elegido y ≥ 20 → "Perfecto…"; si no → mensaje neutro. El resultado también se guarda en Airtable (`Precalificación`) para que Carolina priorice.

## Datos

**Airtable `Solicitudes`** (`tblOoILiAJXG25yBQ`): Nombre, Empresa, WhatsApp, Email, Tipo de evento, Personas, Fecha del evento, Fecha por definir, Presupuesto, Tipo de presupuesto, Comentario, Precalificación, Estado (Nueva → Contactada → Propuesta enviada → Ganada/Perdida), Origen, utm_source/medium/campaign/term/content, gclid, Página de llegada, Recibida.

Escritura con un server action (`src/app/actions.ts`) que llama a la API REST de Airtable con `AIRTABLE_TOKEN` (solo servidor). Anti-spam: campo trampa oculto + tiempo mínimo de llenado. Los UTM se capturan en la primera visita (`sessionStorage`) y viajan como campos ocultos.

**Fase 2 (propuesto):** tablas `Propuestas` (vínculo a Solicitud, token, N°, cliente, empresa, servicio, personas, fecha y hora, lugar, válida hasta, nota de Carolina, estado, vista por primera vez, opción elegida, datos de factura, OC requerida, método de pago, anticipo, pagada el), `Opciones` (vínculo a Propuesta, nombre, ítems (uno por línea), precio por persona neto, recomendada, orden) y `Extras` (vínculo a Propuesta, nombre, precio, unidad). Los totales se calculan con fórmulas en Airtable y se vuelven a calcular en el servidor antes de cobrar.

## Integraciones

- **GA4** `G-VM7ME41KBZ` (del sitio actual) con `next/script`. Eventos: `cta_click` y `whatsapp_click` (con `ubicacion`), `form_start`, `form_step_2`, `form_submit`. Fase 2: `proposal_view`, `option_select`, `reserve_click`, `payment_start`, `payment_success`.
- **WhatsApp** `wa.me/56977797388` con mensaje prellenado.
- **schema.org**: `FoodEstablishment` + `LocalBusiness` (`Caterer`) y `FAQPage`, generados desde `src/content/sitio.ts` para que no se desalineen con la página.

## Variables de entorno

`AIRTABLE_TOKEN` (token personal con `data.records:write` sobre la base), `AIRTABLE_BASE_ID=appf6wFjUh7UgwX4Y`, `AIRTABLE_SOLICITUDES_TABLE=tblOoILiAJXG25yBQ`, `NEXT_PUBLIC_GA_ID=G-VM7ME41KBZ`, `NEXT_PUBLIC_SITE_URL`. Fase 2: `FLOW_API_KEY`, `FLOW_SECRET`, `FLOW_API_URL`.

## Pendientes que siguen siendo de Bistró

Ver `CLAUDE.md` § Pendientes. Los que afectan la fase 1: copy final del H1, qué incluye cada servicio, foto de almuerzo, reseñas reales, confirmar la frase de Carolina, OK y compresión del video, email con dominio.

## Lo que queda a criterio del constructor

Detalles de espaciado y composición dentro de las reglas de `CLAUDE.md`, el tratamiento exacto del grano, y los microtextos de error del formulario (tono amable, tuteo).
