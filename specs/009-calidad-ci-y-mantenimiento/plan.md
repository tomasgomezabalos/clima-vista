# Plan técnico — FEAT-009 Calidad en CI y mantenimiento

**Estado:** VALIDATED

**Fecha:** 2026-10-31

**Aprobación:** 2026-10-31, expresa en el chat; autoriza también la implementación.

## Especificación y alcance autorizado

- Especificación: `specs/009-calidad-ci-y-mantenimiento/spec.md`
- Criterios cubiertos: AC-01 a AC-04
- Fuera de alcance: dependencias nuevas y cambios de comportamiento.

## Decisiones y diseño

- ADR aplicables: 0001, 0002, 0004.
- Componentes propios: no se modifican; no aplica `@react-ts-feature-pattern` (solo utilidades, configuración y documentación).
- `workflow`: se añaden los pasos `npm run lint` y `npm run build` tras las pruebas; se conserva el nombre `Coverage` y su archivo por trazabilidad con FEAT-007.
- Deduplicación (propietario más cercano):
  - `src/i18n/languages.ts`: `createLanguageRecord` crea un registro por idioma y `resolveSupportedLanguage` reutiliza `supportedLanguages`.
  - `src/services/openMeteo/utils.ts` y `src/pages/Home/utils.ts`: construyen sus formateadores con `createLanguageRecord`.
  - `src/services/openMeteo/apiUtils.ts`: `parseQueryResponse` encapsula «error de base query → parseo → error de respuesta inválida»; lo usan `forecastApi` y `geocodingApi`.
- Alternativas descartadas: `eslint-plugin-jsx-a11y` (peer incompatible con ESLint 10).

## Cambios previstos

| Archivo o área | Cambio | Requisito |
| --- | --- | --- |
| `.github/workflows/coverage.yml` | Pasos de lint y build | AC-01 |
| `vite.config.ts` | `coverage.thresholds` al 95 % | AC-02 |
| `package.json`, `package-lock.json` | Nombre `clima-vista` | AC-03 |
| `specs/README.md`, `README.md`, `index.html`, `public/favicon.svg` | Metadatos y documentación | AC-03 |
| `src/i18n/languages.ts`, `src/services/openMeteo/*`, `src/pages/Home/utils.ts` | Deduplicación | AC-04 |
| `tests/i18n/languages.test.ts`, `tests/services/openMeteo/apiUtils.test.ts` | Pruebas de los helpers | AC-04 |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Unitarias de `createLanguageRecord` y `parseQueryResponse`; las pruebas existentes de APIs y formateo protegen la equivalencia.
- Validación: `npm run check` y `npm run test:coverage`.

## Tareas

1. Workflow, umbrales, nombre del paquete, metadatos y documentación.
2. Helpers compartidos y su adopción, con pruebas.
3. `npm run check` y `npm run test:coverage`.

## Riesgos, reversión y validación

- Riesgos: cambio de nombre del paquete sin impacto externo (`private: true`).
- Reversión: revertir el commit.
- Evidencias para `VALIDATED`: workflow verde en GitHub y aceptación expresa.

## Evidencias de implementación

- Fecha: 2026-10-31.
- `npm run check`: lint sin avisos, 26 archivos y 80 pruebas superadas, TypeScript y build correctos.
- `npm run test:coverage`: 100 % de sentencias, ramas, funciones y líneas; umbral del 95 % configurado.
- Deduplicación: las pruebas existentes de APIs, formateo y selector de idioma pasan sin cambios de expectativas.
- Ejecución remota: el push `c69059e` activó `Coverage` en la ejecución `41200897748`; todos los pasos (pruebas con cobertura, lint, build y publicación del informe) terminaron correctamente.
- Aceptación: la persona responsable aceptó expresamente la feature el 2026-10-31.
