# CLAUDE.md — Web Bistró (bistrochile.com)

## Qué es este proyecto

Web de **Bistró**, catering corporativo en Santiago (coffee breaks, almuerzos, cócteles y eventos de empresa). Fundadora y directora: Carolina Hurtado Vielmas. Razón social: Bistró Express SpA.

Tiene dos partes:

1. **Landing** (`/`): que la persona correcta (asistente de gerencia, RR.HH., office manager) pida una cotización con los datos completos.
2. **Propuesta** (`/propuesta/[id]`): la cotización que recibe el cliente, hecha para que reserve y pague el anticipo. Reemplaza el PDF que hoy se arma a mano en Canva.

**Problema actual (nov 2026):** llegan varias solicitudes desde la web, pero se cierran pocas. Por eso:
- la landing tiene que **precalificar** (mínimo de personas, anticipación, cobertura), no solo juntar formularios;
- la página de propuesta y el seguimiento pesan tanto como la landing.

Cada decisión de diseño se evalúa contra esos dos objetivos. Si algo se ve bonito pero distrae del CTA, no va.

## Wireframes

- Lienzo interactivo (fuente de verdad del layout): https://claude.ai/artifact/BVgQpaMK1P5fNDU3geRPat
- Copia de los archivos en `docs/wireframes/` (HTML de baja fidelidad, en grises). Definen **estructura, contenido y comportamiento**, no el estilo: el estilo sale de la sección Marca de este archivo.
- Lo que dice "[TODO]", "[NOTA]", "[fecha]", etc. es un dato pendiente: no inventarlo.

## Stack y reglas técnicas

- Next.js (App Router) + TypeScript + Tailwind. Deploy en Vercel.
- Mantener las integraciones existentes: GA4, botón de WhatsApp y schema.org (`LocalBusiness` / `FoodEstablishment` + `FAQPage`).
- Datos en **Airtable** vía API routes / server actions. Nunca exponer API keys en el cliente; todo secreto va en `.env.local` (y en Vercel).
- Pago online del anticipo con **Webpay**: vía Flow o Webpay Plus directo (decidir en el plan). Confirmación del pago por webhook del lado del servidor, no por la redirección del navegador.
- Mobile first: la mayoría llega desde el celular o WhatsApp. Diseñar a 375 px primero.
- Rendimiento: LCP < 2,5 s en 4G. Imágenes con `next/image` en AVIF/WebP. Video con `poster`, sin autoplay en conexiones lentas.
- Accesibilidad: contraste AA, foco visible, labels reales en los formularios, áreas táctiles de 44 px o más, `prefers-reduced-motion` respetado.

## Marca — Negro, amarillo y crema

Se mantienen los colores históricos de Bistró: **negro y amarillo**. Se suma **crema** como tercer color, de fondo, para que la marca se sienta cálida y premium y no agresiva (negro + amarillo solos recuerdan a señalética o comida rápida). Se siente confiable, cuidada y cercana.

### Tokens

```css
:root {
  /* Color */
  --negro: #161512;           /* dominante: header, footer, bandas de contraste, titulares y texto */
  --carbon: #2A2824;          /* tarjetas y hover sobre negro */
  --crema: #F5EFE3;           /* fondo principal */
  --hueso: #FBF8F2;           /* fondo alterno de secciones y tarjetas */
  --gris: #5C574E;            /* texto secundario sobre crema/hueso */
  --amarillo: #F2B90F;        /* acento: CTA, detalles, una palabra del titular sobre negro */
  --amarillo-hover: #D9A406;
  --linea: #DED5C4;           /* bordes y divisores sobre crema */

  /* Tipografía */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Instrument Sans', system-ui, sans-serif;

  /* Forma */
  --radio-s: 8px;
  --radio-m: 16px;
  --radio-pill: 999px;
}
```

El amarillo es provisorio: si Bistró tiene el hex exacto de su amarillo (del logo o de su material), se reemplaza `--amarillo` y se ajusta el hover. Tiene que ser un amarillo cálido tirado a dorado, no amarillo limón.

Google Fonts: `Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1` e `Instrument+Sans:wght@400;500;600;700`. Cargar con `next/font/google`.

### Reglas de color

- Proporción aproximada: 60% crema/hueso, 30% negro, 10% amarillo. El amarillo es escaso a propósito, para que el CTA salte.
- Combinaciones que pasan contraste AA:
  - Texto negro o gris sobre crema/hueso.
  - Texto crema o amarillo sobre negro.
  - Texto negro sobre amarillo (botones).
- **Nunca texto amarillo sobre crema, hueso o blanco**: no se lee (no pasa contraste ni en tamaños grandes). Sobre fondos claros, el amarillo va solo como relleno de botones (con texto negro) o en detalles gráficos.
- Nada de colores fuera de esta lista. Nada de hex sueltos en componentes: todo sale de las variables.
- En los wireframes, el gris oscuro de las bandas = negro, el fondo gris claro = hueso y los botones negros = amarillo con texto negro.

### Tipografía

- **Fraunces** para titulares y wordmark: peso 700–800, `font-variation-settings: 'SOFT' 100, 'WONK' 0`, `letter-spacing: -0.02em` a `-0.035em` en tamaños grandes.
- Una palabra clave del titular puede ir en itálica de Fraunces y en amarillo, solo cuando el titular está sobre negro. Máximo una por pantalla.
- **Instrument Sans** para cuerpo, botones, formularios y navegación: 400 cuerpo, 600 botones y etiquetas.
- Etiquetas pequeñas (eyebrows) en Instrument Sans 600, mayúsculas, `letter-spacing: 0.2em`, 12–13 px. Usarlas con moderación, no encima de cada sección.
- Escala: H1 56–80 px en escritorio (clamp; ~32 px en mobile), H2 40–48, H3 24–28, cuerpo 17–18, chico 14.

### Logo

- **Wordmark:** "Bistró" en Fraunces 800, SOFT 100, interletrado apretado. Bajo él, opcional, "CATERING CORPORATIVO" en Instrument Sans 600 espaciado.
- **Sello / monograma:** círculo con "B" en Fraunces al centro y el texto "BISTRÓ · CATERING CORPORATIVO · SANTIAGO" en anillo. Se usa en favicon, avatar de Instagram y como acento gráfico montado sobre el borde de una foto.
- Versiones: negro sobre crema (principal), crema o amarillo sobre negro, y negro sobre amarillo. Nunca sobre fotos sin un velo oscuro.
- Mientras no exista el archivo final del logo, el wordmark se arma en texto con Fraunces. No dibujar logos inventados en SVG.
- Lo que no se usa más: Comfortaa, Jost, el logo tipo ícono de app y la paleta ladrillo/mostaza. Los colores negro y amarillo sí se mantienen.

### Forma y componentes

- Bordes redondeados suaves: tarjetas `--radio-m`, inputs `--radio-s`, botones en píldora.
- **Botón primario:** fondo amarillo, texto negro, Instrument Sans 600 y altura mínima de 48 px. Hover: `--amarillo-hover`.
- **Botón secundario:** borde negro 1.5 px con fondo transparente (sobre negro: borde crema).
- Bordes de 1 px en `--linea`. Sin sombras duras: como mucho una sombra muy difusa en tarjetas flotantes.
- Fotos con esquinas `--radio-m`.

## Dirección estética

Premium y artesanal, pensada para un comprador corporativo: tiene que verse confiable y cuidada, no juguetona. La personalidad va en la tipografía del titular, la fotografía y los detalles, no en efectos.

- **Tipografía:** solo Fraunces e Instrument Sans. Prohibidas: Inter, Roboto, Arial, fuentes del sistema, Space Grotesk, Poppins, Montserrat, Comfortaa y Jost.
- **Fotografía:** la comida y los montajes reales son el protagonista. Fotos grandes y bien recortadas. Nada de stock genérico ni imágenes hechas con IA.
- **Fondos:** textura sutil (grano de papel muy suave sobre crema) y alternancia crema → hueso → negro entre secciones. Nada de gradientes morados, glassmorphism ni brillos tipo SaaS.
- **Movimiento:** un solo momento fuerte, la entrada del hero con revelado escalonado (`animation-delay`). El resto, micro-interacciones discretas en hover y foco. CSS primero; Motion solo si hace falta. Nunca animar algo que retrase ver el formulario.
- **Layout:** evitar la plantilla genérica (hero centrado → 3 tarjetas con ícono → carrusel de testimonios). Composición editorial: asimetría, fotos de distinto tamaño, titulares grandes. En 3 segundos se tiene que entender qué hace Bistró, para quién y cómo cotizar.
- **Ojo con el negro + amarillo:** mal usado parece señalética de construcción o comida rápida. Para que se vea premium: amarillo cálido y escaso, mucho crema, negro profundo (no gris), fotos reales grandes y la elegancia de Fraunces en los titulares. Evitar también los clichés de webs hechas con IA: eyebrows en mayúsculas sobre cada sección, tarjetas con borde de color a la izquierda, emojis como íconos.

## Landing: estructura (wireframes mobile y escritorio)

Orden de arriba hacia abajo:

1. **Hero que precalifica** (wireframe `Hero-B`):
   - Header: wordmark, ícono de WhatsApp y menú (en escritorio: navegación + botón "Cotiza tu evento" siempre visible).
   - H1 concreto: "Coffee breaks, almuerzos y cócteles para tu empresa." (borrador).
   - Bajada: "Te respondemos en menos de 1 hora hábil y te enviamos la propuesta con precios en menos de 24."
   - Requisitos a la vista: desde 20 personas, Gran Santiago y Chicureo, factura a empresas.
   - **Paso 1 del formulario dentro del hero**: "¿Qué estás organizando?" con botones (Coffee break, Almuerzo, Cóctel, Desayuno, Brunch, Otro), personas, fecha y "Aún no sé la fecha". Botón "Continuar".
   - **Aviso en vivo** bajo el paso 1 (sin precios). Reglas:
     - Menos de 20 personas → "Para menos de 20 personas lo evaluamos caso a caso. Igual envía tu solicitud o escríbenos por WhatsApp."
     - Fecha a menos de 7 días → "Tu evento es en menos de 7 días: te confirmamos disponibilidad apenas recibamos tu solicitud."
     - Más de 100 personas y menos de 14 días → "Para más de 100 personas recomendamos al menos 2 semanas de anticipación, así todo sale con la calidad que nos representa. Escríbenos y vemos si alcanzamos."
     - Tipo elegido y 20 o más personas → "Perfecto, con esto ya podemos armar tu propuesta."
     - Sin datos → "La propuesta se arma según tu número de personas, tu fecha y tu presupuesto."
   - Link secundario a WhatsApp.
   - "+500 eventos para +30 empresas desde 2022" + logos (UC, BancoEstado, Entel, Santander), antes del pliegue.
   - En escritorio: texto, requisitos y foto a la izquierda; formulario a la derecha, siempre sobre el pliegue.
2. **Servicios** (`Servicios`): abre con la foto real del coffee break. Sin precios. Cada servicio dice para qué tipo de reunión sirve y tiene su "Cotizar", que sube al formulario del hero con ese tipo ya elegido. Composición editorial (foto grande, foto ancha, dos fotos de alto distinto, fila chica). Almuerzos con tags Vegetariano / Vegano / Sin gluten y "a la mesa o box lunch". Banda negra "¿Más de 100 personas?" con el video y la recomendación de 2 semanas. Cierre: "¿No sabes qué elegir?" → WhatsApp.
3. **Cómo funciona** (`Como-funciona`): 4 pasos reales en línea de tiempo + CTA.
4. **Reseñas** (`Resenas`): 3 reseñas reales de Google apiladas con distinto ancho (no carrusel), nota y cantidad solo si son reales, link a Google.
5. **Preguntas frecuentes** (`Preguntas`): acordeón con 7 preguntas (respuestas en "Contenido base"). También como `FAQPage` en schema.org. En escritorio va al lado de la sección de Carolina.
6. **Cierre** (`Cierre`): Carolina con foto y presentación, banda negra "¿Tienes un evento en mente?" con CTA, footer con secciones, contacto, cobertura y "© Bistró Express SpA".
7. **Barra fija mobile** (`Barra-fija`): "Cotiza tu evento" + WhatsApp. Aparece cuando el formulario del hero sale de la pantalla y se esconde cuando vuelve a verse.

## Formulario y confirmación

- **Paso 2** (`Form-paso-2`): resumen del paso 1 con "Editar"; nombre, empresa, WhatsApp (con +56 9 fijo) y email de trabajo; **presupuesto aproximado opcional** con selector "Por persona" / "Total del evento"; comentario opcional (dietas, lugar, horario) escondido tras un link; botón "Enviar solicitud"; "Te respondemos en menos de 1 hora hábil. Usamos tus datos solo para esta cotización."
- Barra de progreso, sin campos de más, validación amable.
- Se guarda en Airtable, tabla **Solicitudes** (con UTM y origen si existen).
- **Confirmación** (`Confirmacion`): "Listo, [nombre]. Recibimos tu solicitud." + resumen, tarjeta de Carolina con foto ("Te escribo en menos de 1 hora hábil…"), "Qué pasa ahora" en 3 pasos, botón a WhatsApp y "Volver al inicio".

## Propuesta (`/propuesta/[id]`)

Se genera desde Airtable: Carolina llena un registro (cliente, evento, opciones, extras, fechas) y la página se arma sola con el diseño de la web. Debe ser fácil de llenar para ella: sin código ni Canva.

- **Encabezado:** N° de propuesta, "Para [nombre], de [empresa]", título con el servicio y la fecha, resumen (servicio, personas, fecha y hora, lugar).
- **Validez:** "Propuesta válida hasta el [fecha]". Por defecto, 2 semanas antes del evento; ajustable según el tamaño del evento.
- **Nota corta de Carolina** con su foto.
- **Opciones:** normalmente 3, una marcada "Recomendada por Carolina". Cada una con ítems del menú, precio por persona + IVA y total. Al elegir, una barra fija abajo muestra la opción, el total y "Reservar".
- **Extras opcionales** (garzones, loza, etc.): solo aparecen si la propuesta los trae.
- **Siempre incluido:** traslado en Gran Santiago, montaje, factura a la empresa.
- **Prueba social:** cifras, logos y una reseña.
- **Condiciones:** reserva con el 50% (online con Webpay o por transferencia); saldo antes del evento, en la fecha acordada; política de cancelación; precios en CLP + IVA.
- **CTA:** "Reservar esta fecha" + "Pedir un cambio" + "Hablar con Carolina" (WhatsApp).
- **Firma:** Carolina Hurtado Vielmas, Directora, Bistró Express SpA.

### Reservar (`Reservar`)

1. Datos para la factura: razón social, RUT, giro, email para la factura y "Necesito orden de compra antes de pagar".
2. Paga el anticipo (50%), con selector:
   - **Online (Webpay):** botón "Pagar $[anticipo] con Webpay"; la reserva queda confirmada al instante.
   - **Transferencia:** BCI, Bistró Express SpA, RUT y cuenta (datos reales pendientes), botón para copiar los datos y "Enviar comprobante por WhatsApp". La fecha queda reservada al recibir el anticipo.

### Seguimiento (lo que más ayuda a cerrar)

- Registrar en Airtable cuándo se abre la propuesta (visto), qué opción se elige y el estado (enviada → vista → opción elegida → reservada → pagada).
- Automatización: si no la abre en 24 h, o la abre y no reserva en 48 h, recordatorio por WhatsApp o email.
- Una vista simple en Airtable para que Carolina vea quién vio, quién eligió y a quién llamar.

## Eventos GA4

`cta_click` (con ubicación: header, hero, servicio, como-funciona, cierre, barra-fija), `form_start`, `form_step_2`, `form_submit`, `whatsapp_click` (con ubicación), `proposal_view`, `option_select`, `reserve_click`, `payment_start`, `payment_success`.

## Honestidad del contenido

- **Nunca** inventar cifras, reseñas, clientes, precios ni testimonios. Si falta un dato, dejar un `TODO:` visible en el código y avisar.
- Los contadores solo se muestran con datos reales. Si no hay dato, la sección no se renderiza: nunca mostrar "0+".
- Las reseñas salen de Google (nombre, empresa si existe y texto), con link a la fuente.
- No publicar precios "desde" en la web: dependen de cada evento.

## Contenido base (datos reales)

- **Servicios:** coffee breaks y desayunos, almuerzos corporativos (vegetariano, vegano y sin gluten; a la mesa o box lunch), cócteles y eventos de empresa, desayunos ejecutivos, brunch corporativo.
- **Cifras:** +500 eventos realizados y +30 empresas atendidas, desde 2022.
- **Clientes:** Universidad Católica, BancoEstado, Entel, Santander, Endress+Hauser, WorkMed, Just Logistic. Logos en la web: UC, BancoEstado, Entel y Santander (archivos en `public/images/clientes/`).
- **Tiempos:** respuesta en menos de 1 hora hábil; propuesta con precios en menos de 24 horas.
- **Reseñas de Google:** https://www.google.com/maps/place//@-33.4727879,-70.6293979,11z/data=!3m1!4b1!4m3!3m2!1s0x840c83c186bb05cf:0xcc97e20d2ea50b1d!12e1
- **Mínimo:** 20 personas (grupos más chicos se evalúan caso a caso).
- **Cobertura:** Gran Santiago, Chicureo, Colina y Valle Grande. Otras zonas, a consultar.
- **Anticipación:** 7 días para coffee breaks y al menos 2 semanas (recomendado) para eventos de más de 100 personas.
- **Pago:** 50% para reservar la fecha (Webpay o transferencia a BCI, Bistró Express SpA); saldo antes del evento, en la fecha acordada. Factura a empresas.
- **Cancelación:** reembolso total del anticipo hasta 7 días antes, 50% entre 7 y 3 días antes, sin reembolso con menos de 72 horas.
- **Montaje:** siempre incluido. Extras (garzones, loza) solo si el evento los requiere.
- **Contacto:** WhatsApp +56 9 7779 7388 · Instagram @bistro.caterings · email por definir (unificar con el dominio bistrochile.com).

### Preguntas frecuentes (texto)

1. ¿Cuál es el mínimo de personas? → Trabajamos desde 20 personas. Para grupos más chicos lo evaluamos caso a caso.
2. ¿A qué zonas llegan? → Gran Santiago, Chicureo, Colina y Valle Grande. Otras zonas, a consultar.
3. ¿Con cuánta anticipación tengo que pedir? → Para coffee breaks, 7 días. Para eventos de más de 100 personas, recomendamos al menos 2 semanas, para que todo salga con la calidad de siempre.
4. ¿Tienen opciones vegetarianas, veganas o sin gluten? → Sí. Cuéntanos en la solicitud cuántas personas las necesitan y las incluimos en la propuesta.
5. ¿Cómo se paga? → Reservas la fecha con el 50% y el saldo se paga antes del evento, en la fecha acordada.
6. ¿Emiten factura a empresas? → Sí, facturamos a nombre de tu empresa.
7. ¿Y si tengo que cancelar? → Te devolvemos el anticipo completo hasta 7 días antes, el 50% entre 7 y 3 días antes, y sin reembolso con menos de 72 horas.

## Pendientes (TODO)

- Copy final del titular del hero.
- Qué incluye cada servicio, en una línea.
- Fotos reales: almuerzo, cóctel, desayuno ejecutivo, brunch y Carolina.
- Reseñas reales de Google (texto, nombre y empresa) y la nota/cantidad.
- Confirmar con Carolina: "sigo revisando cada propuesta antes de que salga".
- OK para usar el video del evento grande (se ven caras de asistentes).
- RUT y número de cuenta para la transferencia.
- Email con dominio bistrochile.com.
- Elegir entre Flow y Webpay Plus directo.

## Fotos y video disponibles

- `public/images/bistro-coffee-break-4x5.jpg`: coffee break real (croissants, palmeritas, alfajores, jugos), recorte vertical sin termos ni marcas a la vista. Para el bloque bajo el hero / apertura de Servicios. Para escritorio hace falta un recorte horizontal del original.
- Video de 8 s de un evento grande (lo tiene Milovan; vertical, HEVC, ~14 MB): solo para la banda "¿Más de 100 personas?". Recortar a 4:5, quitar el audio, comprimir a menos de 3 MB (MP4 H.264 + WebM) y sacar un cuadro para el `poster`.

## Tono de los textos

- Español de Chile, cercano pero profesional. Tutear al cliente.
- Frases cortas y concretas: "Te enviamos la propuesta en menos de 24 horas", no "Nos comprometemos a brindar una experiencia gastronómica inolvidable".
- Hablar del resultado para quien contrata: queda bien con su equipo y con su jefatura, sin preocuparse de nada.

## Antes de dar algo por terminado

- Revisar en 375 px y 1440 px.
- Pasar Lighthouse (Performance y Accesibilidad > 90).
- Enviar el formulario de prueba y confirmar que llega a Airtable.
- Probar una propuesta de punta a punta: abrir, elegir opción, reservar, pagar en el ambiente de prueba de Webpay y ver el estado en Airtable.
- Comprobar que no quede ningún "0+", "Lorem", "[TODO]" visible ni imagen rota.
