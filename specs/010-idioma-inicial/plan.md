# Plan técnico — FEAT-010 Idioma inicial

**Estado:** VALIDATED

**Fecha:** 2026-10-31

**Aprobación:** 2026-10-31, expresa en el chat; autoriza también la implementación.

## Especificación y alcance autorizado

- Especificación: `specs/010-idioma-inicial/spec.md`
- Criterios cubiertos: AC-01 a AC-04
- Fuera de alcance: componentes de interfaz; solo se toca `src/i18n/`.

## Decisiones y diseño

- ADR aplicables: 0001.
- Componentes propios: ninguno modificado; no aplica `@react-ts-feature-pattern` (modo `strict` declarado solo por si se tocara un componente).
- `src/i18n/initialLanguage.ts`: `readStoredLanguage`, `storeLanguage` y `detectInitialLanguage(storage, preferred)`; funciones puras con el almacenamiento inyectado y `try/catch` alrededor de `localStorage`.
- `src/i18n/config.ts`: usa `detectInitialLanguage` para `lng` y guarda el idioma en el manejador `languageChanged`.
- `tests/setup/vitest.setup.ts`: fija `navigator.languages` a español antes de importar la configuración y limpia `localStorage` entre pruebas, para que la suite siga siendo determinista.

## Cambios previstos

| Archivo | Cambio | Requisito |
| --- | --- | --- |
| `src/i18n/initialLanguage.ts` | Nuevo | AC-01 a AC-04 |
| `src/i18n/config.ts` | Usar detección y guardado | AC-01 a AC-03 |
| `tests/i18n/initialLanguage.test.ts`, `tests/i18n/config.test.ts` | Pruebas | AC-01 a AC-04 |
| `tests/setup/vitest.setup.ts` | Entorno determinista | todos |
| `specs/002-cambio-idioma/spec.md` | Nota de revisión | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

Unitarias del módulo con almacenamiento falso (guardado válido, inválido, ausente, que lanza error, preferencias del navegador) y de `config` (el cambio de idioma se guarda). No usan React Testing Library: es código ajeno a React.

## Tareas

1. Módulo y pruebas. 2. Integración en `config.ts`. 3. Ajuste del setup. 4. Nota en FEAT-002. 5. `npm run check`.

## Riesgos, reversión y validación

- Riesgos: acceso a `localStorage` bloqueado (cubierto con `try/catch`).
- Reversión: revertir el commit.
- Evidencias para `VALIDATED`: `npm run check` verde y aceptación expresa.

## Evidencias de implementación

- Fecha: 2026-10-31.
- `npm run check`: lint sin avisos, 26 archivos y 80 pruebas superadas, TypeScript y build correctos.
- `npm run test:coverage`: 100 % de sentencias, ramas, funciones y líneas; umbral del 95 % configurado.
- Pruebas nuevas: módulo `initialLanguage`, guardado en `config` y entorno de pruebas determinista (`navigator.languages` fijado a español).
- Verificación manual el 2026-10-31 en el navegador integrado: guardado y recarga, detección por `navigator.languages` (simulada en un iframe), valores guardados inválidos, `localStorage` bloqueado y búsqueda real contra Open-Meteo, sin errores de consola.
- Ejecución remota: el push `c69059e` activó `Coverage` en la ejecución `41200897748`; todos los pasos (pruebas con cobertura, lint, build y publicación del informe) terminaron correctamente.
- Aceptación: la persona responsable aceptó expresamente la feature el 2026-10-31.
