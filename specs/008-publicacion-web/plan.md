# Plan técnico — FEAT-008 Publicación web pública

**Estado:** IMPLEMENTED

**Fecha:** 2026-10-30

**Aprobación:** 2026-10-30, junto con la orden expresa de implementar

**Implementación:** 2026-10-30; pendiente de validación sobre la URL pública

## Especificación y alcance autorizado

- Especificación: `specs/008-publicacion-web/spec.md`.
- Criterios cubiertos: AC-01 a AC-05.
- Fuera de alcance: dominio propio, analítica, previews por PR como requisito, cambios funcionales o visuales distintos del título, acoplar el despliegue al workflow `Coverage`.

## Decisiones y diseño

- ADR aplicables: ADR-0001, ADR-0005.
- Componentes propios: no se tocan componentes React; no aplica `@react-ts-feature-pattern`.
- MSW: la build de producción ya usa `src/main.tsx` y `public/` (inexistente), por lo que el worker no se incluye; no requiere cambios.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `vercel.json` | Preset Vite, comandos de build y reescritura SPA a `/index.html` | AC-01, AC-02, AC-04 |
| `index.html` | Título «Clima Vista» | AC-05 |
| `docs/architecture/decisions/0005-vercel.md` | ADR de hosting | AC-04 |
| `README.md` | Sección de despliegue y URL pública | Alcance |
| `CLAUDE.md` | Adaptación del repositorio a Claude (importa `AGENTS.md`) | Herramientas |

## Dependencias e instalaciones

- Ninguna.

## Estrategia de pruebas

- Automáticas: `npm run check` sin regresiones.
- Manuales sobre la URL pública: carga de `/` (AC-01); abrir y recargar `/acerca-de` y una ruta inexistente (AC-02); búsqueda real sin `mockServiceWorker.js` en red (AC-03); push a `main` actualiza la URL (AC-04); título de la pestaña (AC-05); revisión en móvil y en `es`/`en`/`it`.

## Tareas

1. Añadir `vercel.json` y el título.
2. Registrar ADR-0005 y actualizar README.
3. Ejecutar `npm run check`.
4. Commit y push a `main`.
5. Importar el repositorio en Vercel y obtener la URL pública.
6. Ejecutar las comprobaciones manuales y anotar la URL en el README.

## Riesgos, reversión y validación

- Riesgos: versión de Node elegida por Vercel distinta de `.nvmrc`; límites de uso de Open-Meteo.
- Reversión: borrar `vercel.json` y desconectar el proyecto en Vercel; el código de la aplicación no cambia.
- Comandos de validación: `npm run check`.
- Evidencias para `VALIDATED`: URL pública y resultado de las comprobaciones manuales.
