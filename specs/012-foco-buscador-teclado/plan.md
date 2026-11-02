# Plan técnico — FEAT-012 Foco del buscador al usar el teclado

**Estado:** IMPLEMENTED

**Fecha:** 2026-11-02

**Aprobación:** 2026-11-02, expresa en el chat por la persona responsable («Aprobar plan»); autoriza exclusivamente lo enumerado en este plan. La implementación se autorizó expresamente el 2026-11-02 («Implementar ahora»).

## Especificación y alcance autorizado

- Especificación: `specs/012-foco-buscador-teclado/spec.md` (APPROVED el 2026-11-02)
- Criterios cubiertos: AC-01 a AC-05
- Fuera de alcance: título por ruta, `<main>` común, ids fijos, `aria-live` y `aria-busy` redundantes (cuestiones abiertas del spec, no incluidas), cambios visuales, de validación, de textos y de idiomas.

## Decisiones y diseño

- ADR aplicables: ninguno nuevo; no se añade dependencia.
- Componentes propios: se modifica `SearchForm`. Antes de modificarlo se carga `@react-ts-feature-pattern` y se declara el modo **`strict`**: cambia comportamiento observable y debe quedar cubierto funcionalmente.
- Causa: el botón usa `disabled={isLoading}`. Un elemento que pasa a estar deshabilitado mientras tiene el foco lo pierde, y el navegador no lo devuelve al rehabilitarlo.
- Solución:
  - `SearchForm/index.tsx`: el botón deja de usar `disabled` y usa `aria-disabled={isLoading}`, de modo que sigue siendo focalizable y las tecnologías de apoyo lo presentan como no disponible (AC-01, AC-03).
  - `SearchForm/useSearchForm.ts`: recibe `isLoading` y, en `handleSubmit`, sigue llamando a `preventDefault()` pero no invoca `onSubmit` mientras hay una búsqueda en curso (AC-02). Esta guarda cubre también Enter desde el campo, que hoy queda bloqueado por el botón deshabilitado (AC-04, AC-05).
  - `SearchForm/types.ts`: `UseSearchFormParams` incorpora `isLoading`.
  - `SearchForm/styles.scss`: los estilos de `:disabled` y de `:hover:not(:disabled)` pasan a `[aria-disabled="true"]` y `:hover:not([aria-disabled="true"])`, sin cambiar sus valores.
- Alternativas descartadas:
  - Devolver el foco al botón con una referencia y un efecto al terminar la búsqueda: el foco ya se habría perdido al deshabilitarse, añade estado y un salto de foco, y no resuelve el estado intermedio.
  - Mantener `disabled` y mover el foco a otro elemento: contradice el spec, que pide que el foco permanezca en el botón.
- Efecto conocido: con un botón `aria-disabled` y un clic durante la búsqueda, el navegador sí dispara el envío; la guarda del hook lo ignora.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/pages/Home/SearchForm/index.tsx` | `aria-disabled` en lugar de `disabled`; pasar `isLoading` al hook | AC-01, AC-03 |
| `src/pages/Home/SearchForm/useSearchForm.ts` | Guarda contra envíos durante la búsqueda | AC-02, AC-04 |
| `src/pages/Home/SearchForm/types.ts` | `isLoading` en `UseSearchFormParams` | AC-02 |
| `src/pages/Home/SearchForm/styles.scss` | Selectores de estado no disponible | AC-03 |
| `tests/pages/Home/SearchForm/index.test.tsx` | Sustituir la prueba de `disabled`; añadir foco, guarda y Enter durante la búsqueda | AC-01 a AC-04 |
| `tests/pages/Home/index.test.tsx` | Foco en el botón tras buscar con resultados, sin resultados y con error | AC-01, AC-05 |
| `specs/README.md` | Fila 012 ya añadida | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Componentes: React Testing Library y Vitest.
  - `SearchForm`: durante la carga el botón tiene `aria-disabled="true"` y sigue focalizable; con el foco en el botón y `isLoading` activado, el foco permanece; activar el botón con Enter o espacio durante la carga, o pulsar Enter en el campo, no llama a `onSubmit`; sin carga, el botón y Enter siguen llamando a `onSubmit` una vez (AC-04).
  - `Home` con MSW: con el foco en el botón y una respuesta con demora, tras activar con el teclado el foco permanece en el botón mientras dura la búsqueda y al terminar con resultados, vacío y error (AC-01). Se mantienen las pruebas existentes de validación y de estados (AC-05).
- Mutación manual: devolver `disabled` al botón o quitar la guarda debe hacer fallar las pruebas nuevas.
- Manuales, en el navegador integrado con `npm run dev`:
  - Antes del cambio quedó comprobado el defecto (foco en `BODY`, el 2026-11-02).
  - Después: con el foco en el botón, activarlo con Enter y con espacio, y comprobar que `document.activeElement` sigue siendo el botón durante y después de la búsqueda.
  - Para tener una demora determinista se envuelve `window.fetch` desde la consola del navegador con un retraso y un contador de peticiones, y se comprueba que activar de nuevo el botón durante la espera no lanza una segunda petición.
  - Comprobar el flujo normal: validación, resultados, selección y previsión.
- Accesibilidad: el estado no disponible se comunica con `aria-disabled`; no se probó con un lector de pantalla real.

## Tareas

1. Cargar `@react-ts-feature-pattern` y declarar el modo `strict`.
2. Pruebas del `SearchForm` que fallan con el comportamiento actual (foco y guarda).
3. Cambios en `useSearchForm`, `types`, `index` y `styles` hasta que pasen.
4. Pruebas de `Home` del foco en los tres desenlaces.
5. `npm run check` y `npm run test:coverage`; prueba de mutación manual.
6. Verificación manual en el navegador integrado.
7. Registrar las evidencias en este plan y pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - `aria-disabled` no impide la activación por sí mismo: la guarda del hook es imprescindible.
  - Con la guarda, Enter durante la búsqueda no muestra ninguna validación, a diferencia de un envío normal; es coherente con el bloqueo actual.
  - Cambios en el anuncio de un lector de pantalla no verificados.
  - Cobertura: debe mantenerse por encima del umbral del 95 %.
- Reversión: revertir el commit; no hay migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Prueba de mutación que demuestra que los tests detectan la regresión.
  - Verificación manual del foco y de la ausencia de envíos duplicados en el navegador integrado.
  - Comprobación del flujo normal sin regresiones.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-02. Modo de la skill `react-ts-feature-pattern`: `strict`.
- Desviaciones del diseño aprobado: ninguna.
- `npm run check`: lint sin avisos, 31 archivos y 181 pruebas superadas, TypeScript y build correctos.
- `npm run test:coverage`: 100 % de sentencias (323/323), ramas (170/170), funciones (90/90) y líneas (317/317); umbral del 95 % configurado.
- Limitación de las pruebas unitarias: jsdom no pierde el foco cuando un botón pasa a `disabled`, por lo que la prueba de foco de `SearchForm` y las de `Home` no distinguirían por sí solas el defecto original; su detección real se comprobó en el navegador. Sí detectan la guarda y el atributo.
- Pruebas de mutación manual: quitar la guarda hace fallar «does not submit again while a search is in progress»; devolver `disabled` al botón hace fallar «presents the button as unavailable while loading and available otherwise». Restaurado el código, las 181 pruebas pasan.
- Verificación manual el 2026-11-02 en el navegador integrado, con `npm run dev` y peticiones reales a Open-Meteo (con `window.fetch` envuelto desde la consola para retrasar la geocodificación y contar peticiones):
  - Antes del cambio: el foco pasaba a `BODY` al activar el botón con Enter y no volvía.
  - Después, con Enter: el foco permanece en el botón durante la búsqueda, con `aria-disabled="true"` y el mensaje «Buscando localidades…», y sigue en el botón al terminar con 10 resultados.
  - Con retardo de 20 s y Enter, Enter y espacio en la misma ráfaga: una sola petición.
  - Sin coincidencias y con error 503 simulado (activando con espacio): el foco sigue en el botón durante y después.
  - Enter desde el campo: se lanza la búsqueda y el foco permanece en el campo.
  - Flujo normal: validación, 10 localidades, selección y previsión de 7 días con temperatura.
  - Una primera lectura con retardo de 4 s mostró dos peticiones porque mi segundo Enter llegó tras vencer el retardo; la repetición con 20 s lo aclaró.
- No verificado: anuncio del estado `aria-disabled` con un lector de pantalla real, efecto con ratón, y la ejecución de CI en GitHub (`gh` no se ejecuta en esta máquina).
- Pendiente: aceptación expresa de la persona responsable para pasar a `VALIDATED`; el spec sigue en `APPROVED`.
