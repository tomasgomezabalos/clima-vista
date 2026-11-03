# Plan técnico — FEAT-016 Verificación automática de accesibilidad

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-016 y su ADR-0006 («redacta el ADR y el spec de feature en draft. Implementalo, valídalo. Llévalo hasta validated»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, incluida la instalación de las dependencias de desarrollo indicadas, y sin commit ni push.

## Especificación y alcance autorizado

- Especificación: `specs/016-verificacion-automatica-accesibilidad/spec.md`
- ADR aplicables: ADR-0006 (nuevo) y ADR-0002.
- Criterios cubiertos: AC-01 a AC-06
- Fuera de alcance: contraste, foco visible, reflujo y lectores de pantalla; cambios en la aplicación salvo correcciones mínimas de una violación real; integración continua.

## Decisiones y diseño

- Componentes propios: no se crea ni modifica ningún componente React. Los cambios son de configuración, dependencias y pruebas, por lo que no aplica `@react-ts-feature-pattern`.
- Dependencias de desarrollo con versión exacta (las del proyecto usan versiones fijas o con caret; estas se fijan por la naturaleza de las reglas):
  - `eslint-plugin-jsx-a11y` `6.10.2`.
  - `axe-core` `4.12.1`: se elige una versión estable con más antigüedad que la 4.14.0, publicada el mismo día de esta decisión. `eslint-plugin-jsx-a11y` depende de `axe-core ^4.10.0`; al fijar la versión directa, npm la compartirá.
  - `overrides` en `package.json`: `"eslint-plugin-jsx-a11y": { "eslint": "$eslint" }`.
- ESLint: en `eslint.config.js`, añadir `jsxA11y.flatConfigs.recommended` a la lista `extends` del bloque de `**/*.{ts,tsx}`.
- Pruebas con axe:
  - `tests/setup/axe.ts`: función `expectNoAccessibilityViolations()` que ejecuta `axe.run` sobre el documento completo con `color-contrast` desactivada y, si hay violaciones, lanza un error legible con la regla, el impacto y los nodos afectados. Está en `tests/setup/` por ser configuración compartida. (Diseño inicial con un contenedor como contexto, corregido tras la revisión de código: ver «Ajustes tras la revisión de código».)
  - `tests/app/App/accessibility.test.tsx` (refleja `src/app/App`): renderiza la aplicación con `MemoryRouter`, el store y MSW existentes, y comprueba AC-02 (tres rutas) y AC-03 (Inicio: inicial, error de validación, resultados, tiempo y previsión, error de búsqueda).
- Documentar los límites (AC-05) en el propio `tests/setup/axe.ts` mediante un comentario breve y en `README.md` o en `AGENTS.md`/`CLAUDE.md` en una línea, sin duplicar este plan.
- Alternativas descartadas: las de ADR-0006.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `package.json` y `package-lock.json` | Dos dependencias de desarrollo y `overrides` | AC-01, AC-02 |
| `eslint.config.js` | Configuración recomendada de `jsx-a11y` | AC-01 |
| `tests/setup/axe.ts` | Ayudante de axe | AC-02 a AC-04 |
| `tests/setup/axe.test.tsx` | Prueba del propio ayudante (añadida tras la revisión) | AC-04 |
| `tests/app/App/accessibility.test.tsx` | Pruebas de rutas y estados | AC-02, AC-03 |
| `CLAUDE.md` | Una línea con qué cubre la verificación automática y qué no | AC-05 |
| `docs/architecture/decisions/0006-verificacion-accesibilidad.md` | ADR nuevo | decisión |
| `specs/README.md` | Fila 016 | trazabilidad |

## Dependencias e instalaciones

- `npm install --save-dev --save-exact eslint-plugin-jsx-a11y@6.10.2 axe-core@4.12.1`, con el `overrides` ya añadido a `package.json` antes de instalar.
- Ninguna otra.

## Estrategia de pruebas

- Pruebas con axe como indica el diseño; deben pasar con el código actual.
- Detección real (AC-04) con mutación manual: quitar el nombre accesible del campo de búsqueda (`aria-label` o `label`) o añadir una imagen sin `alt` debe hacer fallar al menos una prueba, y restaurar el código las devuelve a verde.
- Lint (AC-01) con una violación deliberada temporal, p. ej. `<img src="x" />`, que debe hacer fallar `npm run lint`; se elimina después.
- Comprobar que `npm ci` funciona con el lockfile resultante.
- Comprobar que `npm audit` no empeora respecto al estado previo (comparación de totales antes y después).
- Cobertura: debe mantenerse por encima del 95 %.

## Tareas

1. Añadir `overrides` e instalar las dos dependencias exactas.
2. Configurar `jsx-a11y` en ESLint y comprobar el lint con el código actual.
3. Crear el ayudante `tests/setup/axe.ts`.
4. Crear `tests/app/App/accessibility.test.tsx` con rutas y estados.
5. Mutaciones manuales y violación de lint temporal.
6. `npm ci`, `npm run check`, `npm run test:coverage` y comparación de `npm audit`.
7. Documentar los límites y registrar evidencias; pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - El `overrides` fuerza el peer de un plugin sin soporte declarado para ESLint 10.
  - Si axe detecta una violación real en el código actual, se detiene el trabajo y se pide decisión.
  - Posibles avisos de jsdom (`HTMLCanvasElement.getContext`) en la salida de las pruebas; se silencian solo si es posible sin ocultar errores.
  - `axe-core` no cubre contraste ni foco visible.
- Reversión: revertir los cambios y el lockfile; sin migraciones.
- Comandos de validación: `npm ci`, `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - Lint y pruebas verdes con el código actual.
  - Violación deliberada de lint y mutaciones de marcado que fallan.
  - `npm ci` correcto y `npm audit` sin empeoramiento.
  - Cobertura por encima del umbral.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-03. Desviaciones del diseño aprobado: ninguna en los archivos tocados ni en las versiones (`eslint-plugin-jsx-a11y` 6.10.2 y `axe-core` 4.12.1, exactas). No se creó ni modificó ningún componente React.
- Instalación: `overrides` en `package.json` y `npm install --save-dev --save-exact`. El lockfile pasa de 352 a 464 paquetes (112 añadidos y 0 eliminados; solo cambia la entrada raíz por las dos nuevas dependencias). `npm ci` con ese `package.json` y lockfile funciona en una copia aislada y resuelve una sola copia de `axe-core` (4.12.1).
- AC-01: `npm run lint` pasa con el código actual y 34 reglas `jsx-a11y` activas. Una imagen sin `alt` añadida a `About` produce `jsx-a11y/alt-text` y se retiró después.
- AC-02 y AC-03: `tests/app/App/accessibility.test.tsx` con 7 pruebas pasa con el código actual: tres rutas (Inicio, Acerca de y ruta desconocida) y cuatro estados de Inicio (error de validación, resultados, tiempo y previsión, error de búsqueda). El ayudante `tests/setup/axe.ts` desactiva `color-contrast`.
- AC-04, mutaciones manuales, con el código restaurado después de cada una (213 pruebas superadas):
  - Una imagen sin `alt` en `About` hace fallar la prueba de esa ruta (`image-alt`, crítico) y también el lint.
  - Un botón de resultados sin nombre accesible hace fallar dos pruebas de Inicio con axe y **no** lo detecta el lint: las dos comprobaciones se complementan.
- AC-05: documentado en un comentario de `tests/setup/axe.ts`, en `CLAUDE.md` y en el ADR-0006.
- AC-06: `npm run check` pasa (lint sin avisos, 33 archivos y 213 pruebas, antes de los ajustes posteriores a la revisión, TypeScript y build correctos) y `npm run test:coverage` da 100 % de sentencias (340/340), ramas (178/178), funciones (93/93) y líneas (334/334).
- **`npm audit`: empeora en una entrada.** Pasa de 20 a 21 entradas (de 15 a 16 moderadas, 5 altas sin cambio): `eslint-plugin-jsx-a11y` aparece afectado por el aviso de `minimatch` que ya afectaba a `@eslint/config-array` y `@typescript-eslint/typescript-estree`, más la vía de `eslint` por el peer forzado. No hay ningún aviso distinto y es una dependencia de desarrollo que no llega a producción. El criterio del plan («`npm audit` sin empeoramiento») no se cumple estrictamente; la persona responsable aceptó expresamente esta excepción el 2026-11-03 («Aceptar excepción»).
- Comprobado en una copia aislada, antes de aprobar el ADR: en un `package.json` mínimo, el mismo `overrides` hizo fallar a npm 10.9.8 con un error interno; con el `package.json` y el lockfile reales funciona.
- No verificado: la compatibilidad de las 34 reglas de `eslint-plugin-jsx-a11y` con ESLint 10 más allá de las ejercitadas (alt-text, anchor-is-valid, click-events-have-key-events, no-static-element-interactions) y del código actual limpio; el contraste y las comprobaciones en inglés e italiano (cuestión abierta del spec).
- Publicación: ninguna; los cambios no están en un commit ni subidos.
- Aceptación: la persona responsable ordenó expresamente llevar la feature hasta `VALIDATED` el 2026-11-03 («Llévalo hasta validated»), sin revisar todavía el texto ni estas evidencias y con la excepción de `npm audit` señalada arriba.

## Ajustes tras la revisión de código

Revisión del agente `react-ts-code-reviewer` (2026-11-03), sin hallazgos críticos ni importantes. A petición de la persona responsable se aplicaron las sugerencias 1, 2 y 4:

- Sugerencia 1, contexto de axe: comprobado en una copia aislada que, con un contenedor como contexto, axe no evalúa `document-title`, `html-has-lang` ni `region`; sobre `document` sí. El ayudante pasa a analizar el documento completo y no recibe argumentos. Las 7 pruebas de `tests/app/App/accessibility.test.tsx` siguen en verde, sin violaciones reales. Mutaciones, con el código restaurado después: sin sincronizar `lang` del documento, las 7 pruebas fallan con `html-has-lang`; sustituir el `<main>` del layout por un `div` hace fallar las pruebas de rutas y estados.
- Sugerencia 2, prueba del ayudante: `tests/setup/axe.test.tsx` con 3 pruebas (documento accesible, imagen sin `alt` y título de documento vacío). Al escribirla apareció un defecto: `expect(...).toEqual([])` no incluye los nombres de las reglas en el mensaje del error, solo en un diff aparte. El ayudante pasa a lanzar un `Error` con el listado de violaciones. Mutaciones: que el ayudante nunca lance hace fallar 2 pruebas; que analice un contenedor en lugar del documento hace fallar la de reglas de página. La imagen sin `alt` de la prueba lleva un `eslint-disable-next-line` justificado.
- Sugerencia 4: corregida la frase sobre el lockfile en este plan y en el ADR-0006.
- Resultado: `npm run check` con 34 archivos y 216 pruebas superadas, lint sin avisos, TypeScript y build correctos; cobertura del 100 % (340/340, 178/178, 93/93 y 334/334).
- Sugerencias 1 y 2 de la segunda revisión (2026-11-03): `tests/setup/axe.test.tsx` fija y restaura el idioma del documento para no depender del setup, y se aclaró en las evidencias iniciales que 33 archivos y 213 pruebas son anteriores a los ajustes.
- Sugerencia 3, excepción de `npm audit`: la persona responsable la aceptó expresamente el 2026-11-03 («Aceptar excepción»). Spec y plan se mantienen en `VALIDATED`.
