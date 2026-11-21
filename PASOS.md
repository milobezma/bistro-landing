# Cómo usar este paquete en Claude Code

## 1. Copia los archivos al repo de bistrochile.com

| Del paquete | Al repo |
| --- | --- |
| `CLAUDE.md` | raíz del repo (si ya existe uno, reemplázalo) |
| `docs/wireframes/` | `docs/wireframes/` |
| `public/images/` | `public/images/` |
| `PROMPT-BRAINSTORM.md` | no hace falta copiarlo: es para pegarlo en el paso 4 |

Haz un commit con eso antes de empezar, así el plan parte desde una base limpia.

## 2. Abre Claude Code en la carpeta del repo

```bash
cd ruta/a/bistrochile
claude
```

## 3. Instala los plugins (una sola vez)

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
/plugin install frontend-design@claude-plugins-official
```

Reinicia Claude Code después de instalar.

## 4. Brainstorm → plan de diseño

```
/superpowers:brainstorm
```

Pega el contenido de `PROMPT-BRAINSTORM.md` (desde la línea horizontal hacia abajo). Responde sus preguntas. Al final te va a mostrar el plan; revísalo antes de aprobarlo. Queda guardado como archivo en el repo.

## 5. Construir

```
/frontend-design:frontend-design
```

Pásale el plan del paso 4 y dile que use `docs/wireframes/` y `CLAUDE.md`. Pídele que parta por la fase 1 (landing + formulario + Airtable) y que te muestre la web corriendo con `npm run dev` antes de seguir.

## Antes del paso 5, ten a mano

- Acceso a la base de Airtable (token y el ID de la base) para tu `.env.local`.
- Cuenta de Flow o Transbank para el pago con Webpay (sirve el ambiente de prueba para empezar).
- Las fotos y datos pendientes (lista en `CLAUDE.md`, sección "Pendientes"). Se pueden ir sumando después: la web deja `TODO:` visibles donde falten.
