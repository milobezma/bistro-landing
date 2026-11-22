/**
 * Contenido real de Bistró (CLAUDE.md § Contenido base).
 * Todo lo que muestra la web y el schema.org sale de aquí, para que no se desalineen.
 * Regla: nunca inventar datos. Lo que falta queda como TODO y no se renderiza.
 */

export const sitio = {
  nombre: "Bistró",
  razonSocial: "Bistró Express SpA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bistrochile.com",
  descripcion:
    "Catering corporativo en Santiago: coffee breaks, almuerzos, cócteles, desayunos ejecutivos y brunch para empresas. Propuesta con precios en menos de 24 horas.",
  whatsapp: {
    numero: "56977797388",
    visible: "+56 9 7779 7388",
  },
  instagram: {
    usuario: "@bistro.caterings",
    url: "https://www.instagram.com/bistro.caterings/",
  },
  // TODO: email con dominio bistrochile.com (CLAUDE.md § Pendientes). Mientras tanto no se muestra.
  email: null as string | null,
  directora: {
    nombre: "Carolina Hurtado",
    nombreCompleto: "Carolina Hurtado Vielmas",
    cargo: "Directora de Bistró",
  },
  cifras: {
    // Datos reales confirmados en CLAUDE.md. Si alguno se vuelve null, la línea no se muestra.
    eventos: 500 as number | null,
    empresas: 30 as number | null,
    desde: 2022,
  },
  tiempos: {
    respuesta: "menos de 1 hora hábil",
    propuesta: "menos de 24 horas",
  },
  minimoPersonas: 20,
  cobertura: {
    corta: "Gran Santiago y Chicureo",
    completa: "Gran Santiago, Chicureo, Colina y Valle Grande. Otras zonas, a consultar.",
    zonas: ["Gran Santiago", "Chicureo", "Colina", "Valle Grande"],
  },
  resenasGoogleUrl:
    "https://www.google.com/maps/place//@-33.4727879,-70.6293979,11z/data=!3m1!4b1!4m3!3m2!1s0x840c83c186bb05cf:0xcc97e20d2ea50b1d!12e1",
} as const;

export const clientesConLogo = [
  { nombre: "Universidad Católica", src: "/images/clientes/uc.png", ancho: 960, alto: 554, clase: "h-10" },
  { nombre: "BancoEstado", src: "/images/clientes/bancoestado.svg", ancho: 160, alto: 31, clase: "h-5" },
  { nombre: "Entel", src: "/images/clientes/entel.svg", ancho: 619, alto: 151, clase: "h-6" },
  { nombre: "Santander", src: "/images/clientes/santander.svg", ancho: 238, alto: 42, clase: "h-6" },
] as const;

export const tiposDeEvento = ["Coffee break", "Almuerzo", "Cóctel", "Desayuno", "Brunch", "Otro"] as const;
export type TipoDeEvento = (typeof tiposDeEvento)[number];

export type Servicio = {
  id: string;
  titulo: string;
  paraQue: string;
  /** Tipo que se preselecciona en el formulario al tocar "Cotizar". */
  tipo: TipoDeEvento;
  cta: string;
  foto: { src: string; alt: string; ancho: number; alto: number; posicion?: string } | null;
  tags?: readonly string[];
  // TODO: "qué incluye cada servicio, en una línea" (CLAUDE.md § Pendientes). Cuando exista, agregar `incluye`.
};

export const servicios: Servicio[] = [
  {
    id: "coffee",
    titulo: "Coffee breaks y desayunos",
    paraQue: "Para reuniones, capacitaciones y jornadas de trabajo.",
    tipo: "Coffee break",
    cta: "Cotizar coffee break",
    foto: {
      src: "/images/bistro-coffee-break-4x5.jpg",
      alt: "Coffee break de Bistró servido en una oficina: croissants, palmeritas, alfajores y jugos naturales.",
      ancho: 1200,
      alto: 1500,
    },
  },
  {
    id: "almuerzo",
    titulo: "Almuerzos corporativos",
    paraQue: "Para directorios, equipos y jornadas largas. Servido a la mesa o en formato box lunch.",
    tipo: "Almuerzo",
    cta: "Cotizar almuerzo",
    // TODO: foto real de un almuerzo servido en oficina (CLAUDE.md § Pendientes). Sin foto se muestra un panel tipográfico.
    foto: null,
    tags: ["Vegetariano", "Vegano", "Sin gluten"],
  },
  {
    id: "coctel",
    titulo: "Cócteles y eventos",
    paraQue: "Lanzamientos, aniversarios y fin de año.",
    tipo: "Cóctel",
    cta: "Cotizar cóctel",
    foto: {
      src: "/images/coctel-mesa.jpg",
      alt: "Mesa de cóctel de Bistró con canapés en bandeja dorada, copas de espumante y calas blancas.",
      ancho: 1400,
      alto: 1400,
    },
  },
  {
    id: "desayuno",
    titulo: "Desayunos ejecutivos",
    paraQue: "Reuniones de directorio a primera hora.",
    tipo: "Desayuno",
    cta: "Cotizar desayuno",
    foto: {
      src: "/images/desayuno-ejecutivo.jpg",
      alt: "Puesto de desayuno ejecutivo: taza de café, pastelitos, fruta y jugo de naranja en una sala de reuniones.",
      ancho: 1395,
      alto: 1700,
      posicion: "50% 75%",
    },
  },
  {
    id: "brunch",
    titulo: "Brunch corporativo",
    paraQue: "Bienvenidas y celebraciones de equipo.",
    tipo: "Brunch",
    cta: "Cotizar brunch",
    foto: {
      src: "/images/brunch.jpg",
      alt: "Mesa de brunch con mini hamburguesas, brochetas de fruta y jugo de naranja.",
      ancho: 1525,
      alto: 1600,
    },
  },
];

export const pasos = [
  {
    titulo: "Nos cuentas tu evento",
    texto: "Tipo, personas y fecha. Toma un par de minutos.",
  },
  {
    titulo: "Te respondemos en menos de 1 hora hábil",
    texto: "Por WhatsApp o email, para afinar detalles y dietas.",
  },
  {
    titulo: "Recibes la propuesta en menos de 24 horas",
    texto: "Con menú, precios y condiciones claras.",
  },
  {
    titulo: "Reservas con el 50% y nos encargamos",
    texto:
      "Pagas online o por transferencia. Llegamos y montamos todo; el saldo se paga antes del evento, con factura a tu empresa.",
  },
] as const;

export const preguntas = [
  {
    q: "¿Cuál es el mínimo de personas?",
    a: "Trabajamos desde 20 personas. Para grupos más chicos lo evaluamos caso a caso.",
  },
  {
    q: "¿A qué zonas llegan?",
    a: "Gran Santiago, Chicureo, Colina y Valle Grande. Otras zonas, a consultar.",
  },
  {
    q: "¿Con cuánta anticipación tengo que pedir?",
    a: "Para coffee breaks, 7 días. Para eventos de más de 100 personas, recomendamos al menos 2 semanas, para que todo salga con la calidad de siempre.",
  },
  {
    q: "¿Tienen opciones vegetarianas, veganas o sin gluten?",
    a: "Sí. Cuéntanos en la solicitud cuántas personas las necesitan y las incluimos en la propuesta.",
  },
  {
    q: "¿Cómo se paga?",
    a: "Reservas la fecha con el 50% y el saldo se paga antes del evento, en la fecha acordada.",
  },
  {
    q: "¿Emiten factura a empresas?",
    a: "Sí, facturamos a nombre de tu empresa.",
  },
  {
    q: "¿Y si tengo que cancelar?",
    a: "Te devolvemos el anticipo completo hasta 7 días antes, el 50% entre 7 y 3 días antes, y sin reembolso con menos de 72 horas.",
  },
] as const;

export type Resena = { texto: string; nombre: string; empresa?: string };

/**
 * TODO: 3 reseñas reales de Google (texto, nombre y empresa si aparece) — CLAUDE.md § Pendientes.
 * Mientras esté vacío, la sección de reseñas no se renderiza.
 */
export const resenas: Resena[] = [];

/** TODO: nota y cantidad reales de Google. Solo se muestran si ambos existen. */
export const notaGoogle: { nota: number; cantidad: number } | null = null;

/**
 * Presentación de Carolina (borrador del wireframe `Cierre`).
 * TODO: confirmar con Carolina la frase "sigo revisando cada propuesta antes de que salga".
 */
export const presentacionCarolina =
  "Soy Carolina Hurtado, directora de Bistró. Desde 2022 hemos hecho más de 500 eventos para más de 30 empresas, y sigo revisando cada propuesta antes de que salga.";
