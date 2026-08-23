# ADR-0004 — Acceso a datos remotos con Redux Toolkit Query

**Estado:** APPROVED

**Fecha:** 2026-08-22

**Aprobación:** 2026-08-22

## Contexto

FEAT-001 necesita consultar los servicios de geocodificación y previsión meteorológica de Open-Meteo, representar sus estados de carga y error, y evitar que los componentes implementen manualmente el ciclo de vida de las peticiones y su caché.

La aplicación no utiliza actualmente Redux Toolkit ni React-Redux. Esta decisión introduce dependencias y configuración globales, por lo que debe aprobarse antes de incluirlas en el plan técnico o instalarlas.

## Decisión

- Incorporar `@reduxjs/toolkit` y `react-redux` como dependencias de producción; sus versiones exactas se fijarán en el plan técnico y en `package-lock.json`.
- Utilizar la integración React de RTK Query para todas las consultas de FEAT-001 a Open-Meteo.
- Definir una API de RTK Query por cada URL base de Open-Meteo y configurar sus reducers y middleware en un único store de Redux.
- Utilizar `fetchBaseQuery` como base de las peticiones HTTP, salvo que la validación del contrato durante el plan técnico demuestre una limitación concreta.
- Mantener en RTK Query los datos remotos y sus estados de carga, error y caché.
- Mantener local en React el estado del formulario, el término escrito y la interacción visual, salvo que una necesidad posterior aprobada justifique compartirlo globalmente.
- No crear slices, reducers, thunks ni middleware propios sin una necesidad documentada.
- No persistir el store ni incorporar Redux Persist.

## Consecuencias

- La entrada React debe proporcionar el store a la aplicación y las pruebas de los consumidores deben disponer de un wrapper equivalente.
- Los componentes no realizarán llamadas directas a Open-Meteo mediante `fetch` ni gestionarán manualmente el estado remoto.
- MSW seguirá simulando los contratos HTTP en pruebas y en el modo de desarrollo con mocks.
- RTK Query aporta caché y deduplicación de peticiones, a cambio de configuración global y un incremento del bundle.
- Esta decisión no introduce una integración con ChatGPT, OpenAI ni otros servicios de inteligencia artificial.

## Alternativas descartadas

- `fetch` gestionado manualmente desde componentes o hooks: obliga a implementar estados remotos, caché y coordinación de peticiones que RTK Query ya proporciona.
- `createAsyncThunk`: es válido para lógica asíncrona, pero no es la opción elegida para el acceso y la caché de datos remotos de esta feature.
