# Plan técnico — FEAT-011 Recuperación ante un fallo de carga de página

**Estado:** VALIDATED

**Fecha:** 2026-11-02

**Aprobación:** 2026-11-02, expresa en el chat por la persona responsable («Aprobar plan»); autoriza exclusivamente lo enumerado en este plan. La implementación se autorizó expresamente el 2026-11-02 («Implementar ahora»).

## Especificación y alcance autorizado

- Especificación: `specs/011-recuperacion-fallo-carga/spec.md` (APPROVED el 2026-11-02)
- Criterios cubiertos: AC-01 a AC-05
- Fuera de alcance: errores de renderizado distintos del fallo de descarga, registro externo de errores, detección de versiones nuevas, reintento automático, y cualquier cambio en las páginas, en el selector de idioma o en el estado de carga actual.

## Decisiones y diseño

- ADR aplicables: ninguno nuevo; no se añade dependencia ni se sustituye ninguna decisión vigente.
- Componentes propios: nuevos (`PageLoadBoundary`, `PageLoadFallback`) y modificado (`AppLayout`). Antes de crear o modificar componentes se carga `@react-ts-feature-pattern` y se declara el modo **`strict`**: son componentes nuevos y su comportamiento debe quedar cubierto funcionalmente.
- Responsabilidades y flujo:
  - `src/app/lazyPage.ts`: función `lazyPage(load)` que envuelve `lazy` y convierte el rechazo de la importación dinámica en un `PageLoadError`; exporta también `PageLoadError`. `src/app/App/index.tsx` usa `lazyPage` en las tres páginas, sin cambiar sus rutas.
  - `src/components/PageLoadBoundary/`: límite de error que **solo** captura `PageLoadError` y muestra el `fallback` recibido por props. Cualquier otro error se relanza para que lo gestione el límite superior o React, de modo que queda fuera de alcance como pide la especificación.
  - `src/components/PageLoadFallback/`: componente presentacional con el mensaje, el detalle y el botón «Recargar» (textos con react-i18next). El botón llama a `window.location.reload()`.
  - `src/layouts/AppLayout/index.tsx`: envuelve `Suspense` y `Outlet` con `PageLoadBoundary`, fuera de `Suspense` para que capture el rechazo, y con `key` igual a la ruta actual, de modo que navegar a otra página reinicia el límite (AC-03). La cabecera queda fuera del límite y sigue operativa (AC-01). `useAppLayout` expone la ruta actual.
- Justificación de las clases (`AGENTS.md` pide una necesidad concreta documentada):
  - React solo permite capturar errores de renderizado con un componente de clase; no existe equivalente con hooks.
  - `PageLoadError` extiende `Error` para distinguir de forma fiable un fallo de descarga con `instanceof`, sin depender del texto del mensaje, que varía entre navegadores.
- Alternativas descartadas:
  - `react-error-boundary`: añadiría una dependencia que `AGENTS.md` no permite sin autorización, y el límite necesario es pequeño.
  - `errorElement` del router: la aplicación usa `<Routes>` declarativo. No se verificó la API de la versión 8.3 instalada.
  - Detectar el fallo por el texto del mensaje (`Failed to fetch dynamically imported module`): varía entre navegadores y versiones.
- Efecto conocido: `lazy` conserva el rechazo del módulo fallido. Volver a esa página sin recargar mostrará de nuevo el mensaje hasta recargar; es coherente con el supuesto de la especificación.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/app/lazyPage.ts` | Nuevo: `lazyPage` y `PageLoadError` | AC-01 |
| `src/app/App/index.tsx` | Usar `lazyPage` en las tres páginas | AC-01, AC-05 |
| `src/components/PageLoadBoundary/{index.tsx,types.ts}` | Nuevo: límite de error de clase | AC-01, AC-03 |
| `src/components/PageLoadFallback/{index.tsx,styles.scss}` | Nuevo: mensaje y botón de recarga | AC-01, AC-02, AC-04 |
| `src/layouts/AppLayout/{index.tsx,useAppLayout.ts}` | Envolver el contenido con el límite y reiniciarlo por ruta | AC-01, AC-03, AC-05 |
| `src/locales/{es,en,it}/common.json` | Claves `routing.loadError.title`, `routing.loadError.description` y `routing.loadError.reload` con los textos del spec | AC-04 |
| `tests/app/lazyPage.test.ts` | Nuevo | AC-01 |
| `tests/components/PageLoadBoundary/index.test.tsx` | Nuevo | AC-01, AC-03 |
| `tests/components/PageLoadFallback/index.test.tsx` | Nuevo | AC-02, AC-04 |
| `tests/app/App/page-load-error.test.tsx` | Nuevo: integración de la página que falla | AC-01, AC-03 |
| `tests/layouts/AppLayout/index.test.tsx`, `tests/app/App/lazy-loading.test.tsx` | Comprobar que siguen pasando; ajustar solo si el cambio lo exige | AC-05 |
| `tests/i18n/resources.test.ts` | El recuento de hojas del catálogo pasa de 60 a 63 (tres claves nuevas) | AC-04 |
| `specs/README.md` | Fila 011 ya añadida | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Unitarias: `lazyPage` convierte un rechazo en `PageLoadError`, conserva la causa y deja pasar una importación correcta (Vitest, sin React Testing Library: código ajeno a React).
- Componentes: React Testing Library y Vitest.
  - `PageLoadBoundary`: muestra el `fallback` ante un `PageLoadError`, relanza cualquier otro error y vuelve a mostrar a los hijos al cambiar su `key`. Sus hijos se sustituyen por componentes de prueba.
  - `PageLoadFallback`: mensaje, detalle y botón en `es`, `en` e `it`, cambio de idioma con el mensaje visible, y llamada a `window.location.reload` al pulsar, con la recarga sustituida por un doble.
  - Integración en `tests/app/App/page-load-error.test.tsx`: con la importación de «Acerca de» rechazada, aparece el mensaje, la cabecera sigue visible y navegar a Inicio lo reemplaza (AC-01 y AC-03).
- Regresión: pasan sin cambios las pruebas existentes de `App`, `AppLayout` y de carga perezosa (AC-05).
- HTTP/MSW: no aplica.
- Manuales, en el navegador integrado y con un build de producción servido con `vite preview` desde una carpeta temporal: quitar del servidor el archivo de «Acerca de», navegar a esa página, comprobar el mensaje y la cabecera en los tres idiomas, restaurar el archivo, pulsar «Recargar» y comprobar que la página carga, y navegar a Inicio desde el mensaje. Comprobar también el flujo normal sin fallos.
- Accesibilidad: el contenedor del mensaje usa `role="alert"` y el botón es un `<button>` nativo con nombre accesible; no se probó con un lector de pantalla real.

## Tareas

1. Cargar `@react-ts-feature-pattern` y declarar el modo `strict`.
2. `lazyPage` y `PageLoadError` con sus pruebas; usar `lazyPage` en `App`.
3. Claves de traducción en los tres catálogos y ajuste del recuento en `tests/i18n/resources.test.ts`.
4. `PageLoadFallback` con sus pruebas.
5. `PageLoadBoundary` con sus pruebas.
6. Integrar el límite en `AppLayout`, con `key` por ruta, y la prueba de integración.
7. `npm run check` y `npm run test:coverage`.
8. Verificación manual en el navegador integrado.
9. Registrar las evidencias en este plan y pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - Un `index.html` antiguo servido desde caché haría que la recarga repita el fallo. No comprobado.
  - El fallo no se reprodujo con un despliegue real en Vercel, solo con un build local que simula la ausencia del archivo.
  - Envolver el contenido con un límite con `key` por ruta vuelve a montar el contenido en cada navegación; las páginas ya se montan de nuevo al cambiar de ruta, pero se comprobará que no cambia el comportamiento observable de Inicio.
  - Cobertura: el umbral del 95 % debe mantenerse con los archivos nuevos.
- Reversión: revertir el commit; no hay migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Reproducción manual del fallo antes y después del cambio en el navegador integrado, en los tres idiomas.
  - Comprobación del flujo normal sin regresiones.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-02. Modo de la skill `react-ts-feature-pattern`: `strict`.
- Corrección del plan: el recuento de hojas del catálogo pasa de 60 a **63** (tres claves nuevas), no a 66 como figuraba al aprobar el plan.
- Desviaciones del diseño aprobado: ninguna. `useAppLayout` expone además `pathname`, como preveía el plan.
- `npm run check`: lint sin avisos, 30 archivos y 100 pruebas superadas (13 nuevas), TypeScript y build correctos.
- `npm run test:coverage`: 100 % de sentencias (321/321), ramas (168/168), funciones (90/90) y líneas (315/315); umbral del 95 % configurado.
- Prueba de mutación manual: quitando `PageLoadBoundary` de `AppLayout`, la prueba `tests/app/App/page-load-error.test.tsx` falla; restaurado el archivo, pasa.
- Verificación manual el 2026-11-02 en el navegador integrado, con un build de producción servido con `vite preview` desde una carpeta temporal y el archivo de «Acerca de» ausente del servidor:
  - Antes del cambio (HEAD `622ee97`): pantalla en blanco, `#root` vacío y `Failed to fetch dynamically imported module` en consola.
  - Después: mensaje «No se pudo cargar esta página» con el botón «Recargar», cabecera y selector de idioma visibles.
  - El mensaje y el botón se actualizan a inglés e italiano al cambiar el idioma con el mensaje visible.
  - Navegar a Inicio desde el mensaje lo hace desaparecer y la página funciona.
  - Volver a «Acerca de» sin recargar muestra de nuevo el mensaje (efecto conocido de `lazy`).
  - Con el archivo restaurado, «Recargar» hace una recarga real (`navigationType: reload`) y «Acerca de» carga.
  - Flujo normal sin fallos: Inicio, Acerca de y la página no encontrada cargan sin mensaje de error.
  - La consola solo muestra los errores asociados al fallo simulado (`PageLoadError` y el 404 del archivo).
- No verificado: despliegue real en Vercel, comportamiento con un `index.html` en caché, lectura con un lector de pantalla real, búsqueda de localidades en Inicio (no se tocó) y el cambio de idioma con el selector nativo mediante interacción real (se usó un script que lanza `change`).
- Publicación: commits `13ec499` y `e54b68b` subidos a `origin/main`. No se comprobó la ejecución de CI en GitHub (`gh` no se puede ejecutar en esta máquina).
- Aceptación: la persona responsable aceptó expresamente la feature el 2026-11-02 («si ya la probaste la pasamos a VALIDATED»), con las verificaciones no realizadas enumeradas arriba.
