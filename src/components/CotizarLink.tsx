"use client";

import type { ComponentProps } from "react";
import type { TipoDeEvento } from "@/content/sitio";
import { track, type Ubicacion } from "@/lib/ga";

export const EVENTO_COTIZAR = "bistro:cotizar";
export type DetalleCotizar = { tipo?: TipoDeEvento; origen: Ubicacion };

type Props = Omit<ComponentProps<"a">, "href"> & { ubicacion: Ubicacion; tipo?: TipoDeEvento };

/**
 * Sube al formulario del hero (#cotizar). Si trae `tipo`, lo deja elegido.
 * Sin JS sigue funcionando como ancla normal.
 */
export function CotizarLink({ ubicacion, tipo, onClick, children, ...props }: Props) {
  return (
    <a
      href="#cotizar"
      onClick={(e) => {
        track("cta_click", { ubicacion, tipo });
        window.dispatchEvent(new CustomEvent<DetalleCotizar>(EVENTO_COTIZAR, { detail: { tipo, origen: ubicacion } }));
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
