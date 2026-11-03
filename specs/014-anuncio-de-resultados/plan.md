# Plan técnico — FEAT-014 Anuncio de resultados de búsqueda y del tiempo

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-013 y FEAT-014 («crea las dos especificaciones, en draft, pero implementalas. Valídalas»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, sin commit ni push.

## Especificación y alcance autorizado

- Especificación: `specs/014-anuncio-de-resultados/spec.md`
- Criterios cubiertos: AC-01 a AC-07
- Fuera de alcance: cambios visuales, movimiento del foco, mensajes existentes de carga, vacío y error, `aria-busy` y `aria-live` redundantes de esos componentes, FEAT-013.

## Decisiones y diseño

- ADR aplicables: ninguno nuevo; no se añade dependencia.
- Componentes propios: se modifica `Home`. Antes de modificarlo se carga `@react-ts-feature-pattern` y se declara el modo **`strict`**.
- Diseño:
  - `useHome` calcula `announcement` (cadena) a partir del estado ya existente:
    - Si hay `weatherResult`: `announcements.weatherLoaded` con el nombre de `formatLocationName(weatherResult.location)`, el mismo que usa el encabezado del tiempo actual.
    - Si no hay localidad seleccionada y `showLocationResults`: `announcements.locationsFound` con `count`.
    - En cualquier otro caso: cadena vacía. Así se vacía durante una búsqueda nueva, durante la consulta del tiempo, en vacío y en error (AC-04, AC-05).
  - `Home/index.tsx` renderiza siempre `<div className="home__announcement" aria-live="polite" aria-atomic="true">{announcement}</div>` dentro de `home__content`, antes del buscador.
  - `Home/styles.scss`: `.home__announcement` oculto solo visualmente (posición absoluta, 1 px, `clip`, `overflow: hidden`, sin `display: none`).
  - Claves nuevas `announcements.locationsFound_one`, `announcements.locationsFound_other` y `announcements.weatherLoaded` en los tres catálogos.
- Por qué `aria-live` sin `role="status"`: `Loading` y `StatusMessage` ya usan `role="status"`/`role="alert"`; una segunda región `status` rompería las consultas de pruebas existentes y no aporta semántica adicional. Tradeoff: algunos lectores históricamente tratan mejor `role="status"`; queda como riesgo sin verificar.
- Alternativas descartadas:
  - Mover el foco al encabezado de resultados: cambia el comportamiento del foco, que FEAT-012 acaba de estabilizar.
  - Componente `LiveAnnouncement` separado: una sola instancia, sin necesidad concreta.
  - Montar la región solo cuando hay resultados: las regiones insertadas con contenido se anuncian de forma poco fiable.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/pages/Home/useHome.ts` | Calcula `announcement` | AC-02 a AC-05 |
| `src/pages/Home/index.tsx` | Región viva persistente | AC-01 |
| `src/pages/Home/styles.scss` | Ocultación solo visual | AC-01, AC-07 |
| `src/locales/{es,en,it}/common.json` | Claves `announcements.*` | AC-02, AC-03, AC-06 |
| `tests/pages/Home/index.test.tsx` | Anuncios en el flujo completo, vacío, error y nueva búsqueda | AC-01 a AC-06 |
| `tests/i18n/resources.test.ts` | Número de claves de los catálogos | AC-06 |
| `specs/README.md` | Fila 014 | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Componentes con RTL, Vitest y MSW (`Home` con el layout):
  - La región existe vacía y con `aria-live="polite"` desde el estado inicial.
  - Con la respuesta de geocodificación de éxito: anuncia el recuento; con una sola localidad, la forma singular.
  - Tras elegir una localidad y completar la previsión: anuncia el nombre mostrado en el encabezado; durante la consulta está vacía.
  - Vacío y error de búsqueda, y error del tiempo: región vacía y mensajes existentes intactos.
  - Segunda búsqueda: la región se vacía mientras carga.
  - Textos en es, en e it.
- Mutación manual: devolver siempre un texto, o quitar la rama del tiempo, debe hacer fallar pruebas.
- Manuales, en el navegador integrado con `npm run dev:mocks`: región presente, oculta y sin cambio de diseño; contenido del anuncio tras buscar y elegir localidad; flujo completo en los tres idiomas.
- Accesibilidad: no se prueba con lector de pantalla real; solo que la región existe, está montada y cambia de contenido.

## Tareas

1. Cargar `@react-ts-feature-pattern` y declarar el modo `strict` (se reutiliza la carga hecha para FEAT-013 en esta sesión).
2. Pruebas de `Home` que fallan con el comportamiento actual.
3. Claves de i18n, `announcement` en `useHome`, región y estilos.
4. `npm run check` y `npm run test:coverage`; mutación manual.
5. Verificación manual en el navegador integrado.
6. Registrar evidencias y pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - El anuncio no se verifica con un lector de pantalla real.
  - Una ocultación incorrecta de la región impediría el anuncio.
  - Un recuento mayor que 10 requeriría revisar las formas plurales.
  - Cobertura: debe mantenerse por encima del 95 %.
- Reversión: revertir el cambio; sin migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Pruebas de mutación que demuestran la detección de regresiones.
  - Verificación manual en el navegador integrado de AC-01 a AC-07.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-03. Modo de la skill `react-ts-feature-pattern`: `strict` (carga única de la skill para FEAT-013 y FEAT-014).
- Desviaciones del diseño aprobado: ninguna.
- `npm run check`: lint sin avisos, 32 archivos y 206 pruebas superadas, TypeScript y build correctos.
- `npm run test:coverage`: 100 % de sentencias (340/340), ramas (178/178), funciones (93/93) y líneas (334/334); umbral del 95 % configurado.
- Pruebas de mutación manual, con el código restaurado después de cada una (206 pruebas superadas):
  - Anunciar también con una localidad ya seleccionada hace fallar dos pruebas (vaciado durante la consulta del tiempo y error del tiempo).
  - Quitar la rama del tiempo hace fallar tres (flujo completo, en y it).
  - Renderizar la región solo con texto hace fallar cinco.
  - Quitar la condición de resultados visibles hace fallar tres (región persistente, vacío y nueva búsqueda).
- Verificación manual el 2026-11-03 en el navegador integrado, con `npm run dev` y peticiones reales a Open-Meteo:
  - AC-01: la región existe desde el primer renderizado, vacía, con `aria-live="polite"` y `aria-atomic="true"`, de 1 × 1 px.
  - AC-02: buscar «Madrid» muestra «Buscando localidades…» con la región vacía y, al terminar, «10 localidades encontradas»; el foco permanece en el campo.
  - AC-03 y AC-04: al elegir una localidad, la región queda vacía mientras se muestra «Consultando la información meteorológica…» y después anuncia «Tiempo cargado para Madrid, Comunidad Autónoma de Madrid, España», con el tiempo actual y la previsión de 7 días.
  - AC-07: diseño de escritorio y de 375 px sin cambios visibles; sin errores nuevos de consola.
  - AC-05, AC-06, el singular, el vacío y los errores solo se comprobaron con pruebas automáticas (incluidos inglés e italiano); no se repitieron en el navegador.
- No verificado: lector de pantalla real; `npm run dev:mocks` en el navegador integrado (no registra el Service Worker de MSW); el anuncio con `aria-live` sin `role="status"` frente a `role="status"` en distintos lectores.
- Publicación: ninguna; los cambios no están en un commit ni subidos.
- Aceptación: la persona responsable ordenó expresamente implementar y validar el ciclo completo el 2026-11-03 («implementalas. Valídalas»), sin commit ni push. No ha revisado todavía el texto de la especificación ni estas evidencias; las verificaciones no realizadas figuran arriba.
