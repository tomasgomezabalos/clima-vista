# ADR-0005 — Hosting público en Vercel

**Estado:** APPROVED

**Fecha:** 2026-10-30

**Aprobación:** 2026-10-30

## Contexto

FEAT-008 requiere publicar la SPA en una URL pública HTTPS con despliegue automático desde `main` y soporte de enlaces profundos para `BrowserRouter`. La aplicación es estática y consume Open-Meteo directamente desde el navegador, sin secretos ni backend.

## Decisión

- Publicar en Vercel mediante su integración con el repositorio de GitHub; la rama de producción es `main`.
- Versionar la configuración en `vercel.json` (preset Vite, `npm ci`, `npm run build`, salida `dist`).
- Reescribir toda ruta que no corresponda a un archivo estático a `/index.html`, para que React Router resuelva `/acerca-de` y la página NotFound.
- No usar variables de entorno ni secretos.

## Consecuencias

- La primera conexión del repositorio se hace una vez desde la cuenta de Vercel del propietario.
- Vercel crea también despliegues de previsualización para otras ramas y pull requests; FEAT-008 no los exige ni los valida.
- Vercel elige la versión de Node a partir de `engines.node` (`>=22.22.0`), no de `.nvmrc`; puede usar una versión mayor compatible.

## Alternativas descartadas

- GitHub Pages: obliga a ruta base `/clima-vista/` y a un fallback 404 para enlaces profundos.
- Netlify: equivalente funcional; sin ventaja concreta para este proyecto.
