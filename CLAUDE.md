# CLAUDE.md

Las reglas del proyecto viven en `AGENTS.md` (fuente única, compartida con otros agentes). Claude las carga desde aquí:

@AGENTS.md

## Contexto rápido

- **Qué es:** Clima Vista, SPA de consulta meteorológica (búsqueda de ubicación, tiempo actual y previsión) sobre la API pública de Open-Meteo, sin clave.
- **Stack:** React 19 + TypeScript estricto, Vite, Redux Toolkit/RTK Query, React Router, i18next (`es`, `en`, `it`), Sass, Vitest + RTL, MSW, ESLint.
- **Node:** versión fijada en `.nvmrc` (`>=22.22`).

## Comandos

- `npm run dev` — desarrollo sin mocks.
- `npm run dev:mocks` — desarrollo con MSW (único modo que arranca el worker).
- `npm run check` — lint + tests + build. Obligatorio antes de dar un cambio por terminado.
- `npm run test:coverage` — cobertura V8 (texto + `coverage/index.html`).

## Flujo SDD con Claude

- Antes de cualquier feature o cambio de alcance, leer `docs/sdd/constitution.md`, `docs/sdd/workflow.md` y la carpeta `specs/<id>-<nombre>/` afectada.
- Las features nuevas se crean como `specs/NNN-<nombre>/spec.md` y `plan.md` desde `docs/sdd/templates/`, numeradas tras la última existente, en estado `DRAFT`.
- Detenerse en cada puerta (spec, ADR, plan, implementación, validación) y pedir aprobación expresa; nunca cambiar el estado a `APPROVED` o `VALIDATED` por iniciativa propia.
- Las decisiones técnicas vigentes están en `docs/architecture/decisions/`; una nueva decisión se registra como ADR.

## Skills

- `@react-ts-feature-pattern` de `AGENTS.md` corresponde a la skill `react-ts-feature-pattern`: invocarla con la herramienta Skill antes de crear o modificar componentes React y declarar el modo usado.
- Para commits, seguir Conventional Commits con el ámbito que usa el historial (`feat(header)`, `test(home)`, `docs(sdd)`, `ci(coverage)`…).

## Notas de entorno

- `node_modules`, `dist` y `coverage` están ignorados por Git; no editarlos.
- Si se trabaja desde un shell con otra plataforma que la del equipo (p. ej. Linux frente a macOS), no reinstalar dependencias sobre el `node_modules` local: validar en una copia aparte.
