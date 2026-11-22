import { sitio } from "@/content/sitio";

export const MENSAJE_WHATSAPP_GENERAL = "Hola Bistró, quiero cotizar un evento para mi empresa.";

export function urlWhatsApp(mensaje: string = MENSAJE_WHATSAPP_GENERAL) {
  return `https://wa.me/${sitio.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}
