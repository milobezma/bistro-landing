/** Eventos GA4 (CLAUDE.md § Eventos GA4). Seguro de llamar aunque GA no haya cargado. */

export type EventoGA =
  | "cta_click"
  | "whatsapp_click"
  | "form_start"
  | "form_step_2"
  | "form_submit"
  | "proposal_view"
  | "option_select"
  | "reserve_click"
  | "payment_start"
  | "payment_success";

export type Ubicacion =
  | "header"
  | "menu"
  | "hero"
  | "servicio"
  | "mas-de-100"
  | "como-funciona"
  | "preguntas"
  | "cierre"
  | "footer"
  | "barra-fija"
  | "formulario"
  | "confirmacion";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(evento: EventoGA, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", evento, params);
}
