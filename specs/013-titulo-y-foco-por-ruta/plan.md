# Plan técnico — FEAT-013 Título, foco y región principal por ruta

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-013 y FEAT-014 («crea las dos especificaciones, en draft, pero implementalas. Valídalas»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, sin commit ni push.

## Especificación y alcance autorizado

- Especificación: `specs/013-titulo-y-foco-por-ruta/spec.md`
- Criterios cubiertos: AC-01 a AC-05
- Fuera de alcance: `meta description` y `<title>` de `index.html`, cambios visuales, enlace «saltar al contenido», anuncio de resultados (FEAT-014), cambios en rutas, navegación o selector de idioma.

## Decisiones y diseño

- ADR aplicables: ninguno nuevo; no se añade dependencia.
- Componentes propios: se modifican `AppLayout`, `Home`, `About` y `NotFound`. Antes de modificarlos se carga `@react-ts-feature-pattern` y se declara el modo **`strict`**: cambian comportamiento observable y deben quedar cubiertos funcionalmente.
- Título:
  - Nuevo hook `src/app/useDocumentTitle.ts`: `useEffect` que asigna `document.title`. Se justifica por tener tres consumidores (Inicio, Acerca de y 404) y por seguir la verdad del enrutador: el título lo fija la página que se muestra, sin duplicar la correspondencia ruta-título en el layout (que fallaría con barras finales).
  - Claves nuevas `documentTitle.home|about|notFound` en los tres catálogos, con el formato «<página> · Clima Vista».
  - `Home` lo llama desde `useHome`, que ya posee `t`; `About` y `NotFound` lo llaman directamente en `index.tsx`, porque solo consumen hooks ya existentes.
  - Al cambiar el idioma, las páginas se vuelven a renderizar y el efecto actualiza el título.
- Foco:
  - `useAppLayout` incorpora `mainRef` y un efecto sobre `pathname` que, solo cuando `pathname` difiere del anterior (referencia al valor previo), llama a `focus()`. En la carga inicial y al cambiar de idioma no hay cambio de `pathname`, así que el foco no se mueve; en StrictMode los efectos duplicados no mueven el foco por la misma razón.
  - `main` lleva `tabIndex={-1}`: foco programático sin parada de tabulación; el propietario del foco es `useAppLayout` mediante la referencia.
- Región principal:
  - `AppLayout` sustituye el `div.app-layout__content` por `<main className="app-layout__content" ref tabIndex={-1}>`, que envuelve `PageLoadBoundary` y `Suspense`.
  - `Home`, `About` y `NotFound` sustituyen `<main>` por `<div>` conservando la clase, de modo que los estilos no cambian. No hay selectores `main` en los `.scss`.
- Alternativas descartadas:
  - Un componente o contexto de «gestor de rutas»: más capas que el problema.
  - Mapear `pathname` a título en el layout: duplica el enrutamiento y falla con barras finales.
  - Renderizar `<title>` en las páginas (metadatos de React 19): `index.html` ya tiene un `<title>` estático; el comportamiento con dos títulos no se ha verificado.
  - Mover el foco al `h1`: no existe aún mientras carga el fragmento de la página.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/app/useDocumentTitle.ts` | Hook nuevo que asigna `document.title` | AC-01, AC-02 |
| `src/locales/{es,en,it}/common.json` | Claves `documentTitle.*` | AC-01, AC-02 |
| `src/layouts/AppLayout/index.tsx` | `<main>` con `ref` y `tabIndex={-1}` | AC-03, AC-04 |
| `src/layouts/AppLayout/useAppLayout.ts` | `mainRef` y efecto de foco por cambio de `pathname` | AC-03 |
| `src/pages/Home/index.tsx`, `useHome.ts` | `<div>` en lugar de `<main>`; título | AC-01, AC-04 |
| `src/pages/About/index.tsx` | `<div>` en lugar de `<main>`; título | AC-01, AC-04 |
| `src/pages/NotFound/index.tsx` | `<div>` en lugar de `<main>`; título | AC-01, AC-04 |
| `tests/app/useDocumentTitle.test.ts` | Nuevo | AC-01, AC-02 |
| `tests/layouts/AppLayout/index.test.tsx` | `main` único con la carga dentro; foco tras navegar | AC-03, AC-04 |
| `tests/app/App/index.test.tsx`, `lazy-loading.test.tsx`, `page-load-error.test.tsx` | Títulos por ruta e idioma; sin `main` anidado; `main` único en carga y fallo | AC-01 a AC-05 |
| `tests/pages/{Home,About,NotFound}/index.test.tsx` | Título de cada página | AC-01, AC-02 |
| `tests/i18n/resources.test.ts` | Número de claves de los catálogos | AC-02 |
| `specs/README.md` | Fila 013 | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Hook: `useDocumentTitle` asigna el título y lo actualiza al cambiar el valor.
- Componentes con RTL y Vitest:
  - Cada página fija su título en español, inglés e italiano; al cambiar de idioma con la página montada, el título cambia.
  - `AppLayout`: hay un único `main` que contiene la carga de página; al navegar con un enlace, el `main` recibe el foco; en el primer renderizado y al cambiar de idioma no lo recibe.
  - `App`: el fallo de carga se muestra dentro del `main`; navegación completa con atrás y adelante.
  - Los tests que usan `<main>` en el contenido simulado pasan a `<div>` para no anidar regiones.
- Mutación manual: quitar el efecto de foco, o la comparación con el `pathname` previo, o devolver `<main>` a una página debe hacer fallar pruebas.
- Manuales, en el navegador integrado con `npm run dev:mocks`: título en las tres páginas e idiomas; foco tras navegar con ratón y teclado; ausencia de movimiento del foco al cambiar de idioma; aspecto del foco en `main`; flujo completo de búsqueda y consulta; página 404; recarga directa de `/acerca-de`.
- Accesibilidad: no se prueba con lector de pantalla real.

## Tareas

1. Cargar `@react-ts-feature-pattern` y declarar el modo `strict`.
2. Pruebas nuevas que fallan con el comportamiento actual.
3. Claves de i18n, `useDocumentTitle` y títulos en las páginas.
4. `main` en `AppLayout` con foco por cambio de ruta y `<div>` en las páginas.
5. Adaptar pruebas existentes (`main` anidado, recuento de claves).
6. `npm run check` y `npm run test:coverage`; mutación manual.
7. Verificación manual en el navegador integrado.
8. Registrar evidencias y pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - El anillo de foco del navegador sobre `main` puede ser visible tras navegar; se valorará en el navegador.
  - `main` ocupa el `min-height` del contenedor anterior; no debe cambiar el diseño.
  - El título se asigna al montar la página, no durante la carga de su fragmento.
  - Sin verificar con lector de pantalla real.
  - Cobertura: debe mantenerse por encima del umbral del 95 %.
- Reversión: revertir el cambio; sin migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Pruebas de mutación que demuestran la detección de regresiones.
  - Verificación manual en el navegador integrado de AC-01 a AC-05.
  - Comprobación del flujo completo sin regresiones.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-03. Modo de la skill `react-ts-feature-pattern`: `strict`.
- Desviaciones del diseño aprobado: ninguna.
- `npm run check` (con FEAT-013 y FEAT-014 aplicadas): lint sin avisos, 32 archivos y 206 pruebas superadas, TypeScript y build correctos. Solo con FEAT-013, antes de iniciar FEAT-014: 198 pruebas superadas.
- `npm run test:coverage`: 100 % de sentencias (340/340), ramas (178/178), funciones (93/93) y líneas (334/334); umbral del 95 % configurado.
- Pruebas de mutación manual, con el código restaurado después de cada una (198 pruebas superadas):
  - Quitar `focus()` hace fallar «moves focus to the main region after navigating…» y «titles a direct unknown route and moves focus only when navigating».
  - Mover el foco sin comparar con el `pathname` previo hace fallar esas mismas dos pruebas.
  - Devolver `<main>` a `About` hace fallar «does not declare its own main region» y la prueba de títulos de `App`.
  - Quitar el título de `Home` hace fallar tres pruebas (títulos de `App` y de `Home`).
  - Quitar la dependencia del efecto de `useDocumentTitle` hace fallar tres pruebas, entre ellas la del propio hook.
- Verificación manual el 2026-11-03 en el navegador integrado, con `npm run dev` y peticiones reales a Open-Meteo:
  - AC-01 y AC-02: título «El tiempo · Clima Vista», «Acerca de · Clima Vista» y «Página no encontrada · Clima Vista»; al cambiar de idioma pasa a «Weather · Clima Vista» y «Meteo · Clima Vista», «Informazioni · Clima Vista» y de vuelta a español. En el selector de idioma el foco permanece en el `select`.
  - AC-03: al navegar con ratón (Inicio a Acerca de), con teclado (Enter sobre el enlace) y con el botón atrás del historial, el foco queda en `main`. En la carga directa de `/`, `/acerca-de` y de una ruta desconocida el foco queda en `body`. Tras `Tab` desde `main` el foco pasa al campo de búsqueda: `main` no añade una parada de tabulación.
  - AC-04: exactamente un `main` en cada ruta, con `tabindex="-1"`.
  - AC-05: búsqueda de «Madrid», 10 localidades, selección, tiempo actual (13,5 °C) y previsión de 7 días sin regresiones; el foco del buscador (FEAT-012) sigue en el campo; diseño de escritorio y de 375 px sin cambios visibles; sin errores nuevos de consola.
  - Observación sobre el riesgo del spec: tras navegar con el teclado `main` coincide con `:focus-visible` y muestra el contorno automático de 1 px del navegador; con el ratón no se muestra. No se ha modificado.
- No verificado: lector de pantalla real; `npm run dev:mocks` en el navegador integrado (no registra el Service Worker de MSW y la aplicación queda en blanco, ajeno a estos cambios); el fallo de carga de página (FEAT-011) dentro de `main` solo con pruebas unitarias; título durante la carga del fragmento de página.
- Revisión de código (agente `react-ts-code-reviewer`, 2026-11-03): sin hallazgos críticos ni importantes. Se aplicaron tres ajustes de pruebas a petición de la persona responsable: el orden de tabulación se comprueba con varias pulsaciones de `Tab` y `Shift+Tab` (con `tabIndex={0}` la prueba falla); el foco en `main` tras atrás y adelante del historial queda cubierto por una prueba automática (sin el foco, falla); y `useDocumentTitle` restaura `document.title` entre pruebas. `npm run check` sigue en verde con 206 pruebas.
- Publicación: ninguna; los cambios no están en un commit ni subidos.
- Aceptación: la persona responsable ordenó expresamente implementar y validar el ciclo completo el 2026-11-03 («implementalas. Valídalas»), sin commit ni push. No ha revisado todavía el texto de la especificación ni estas evidencias; las verificaciones no realizadas figuran arriba.
