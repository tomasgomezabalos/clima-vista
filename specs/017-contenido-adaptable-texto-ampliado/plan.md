# Plan técnico — FEAT-017 Contenido adaptable al texto ampliado

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-017 («abre la spec, implementala y llévala hasta Validate… Implementalo todo»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento y sin commit ni push.

## Especificación y alcance autorizado

- Especificación: `specs/017-contenido-adaptable-texto-ampliado/spec.md`
- Criterios cubiertos: AC-01 a AC-06
- Fuera de alcance: cabecera, textos, colores, comportamiento, marcado y cualquier cambio con el texto en tamaño normal.

## Decisiones y diseño

- ADR aplicables: ADR-0003 (Sass), sin cambios; no se añade dependencia.
- Componentes propios: solo se modifican estilos `.scss`; no cambian el marcado ni la lógica de ningún componente React, por lo que no aplica `@react-ts-feature-pattern`.
- Causa (medida con prototipos CSS aplicados en vivo en el navegador, sin tocar el código):
  1. `.home__search` y `.home__weather` son rejillas con una columna implícita `auto`: los hijos tienen `min-width: auto` y la columna crece hasta el contenido más ancho (desbordamiento de rejilla), arrastrando a los demás paneles.
  2. `.location-results__list` tiene la misma carencia, y la columna central del botón es `1fr` (mínimo `auto`).
  3. `.current-weather__summary` es un `flex` sin ajuste; con la columna limitada, el icono (`flex-shrink: 1`) se comprime hasta unos 11 px.
  4. `.about-page` y `.not-found-page` son rejillas con la misma carencia.
  5. Palabras largas con la fuente ampliada superan el ancho interior de los paneles.
- Solución, en estilos:
  - `src/pages/Home/styles.scss`: `.home__search` y `.home__weather` pasan a `grid-template-columns: minmax(0, 1fr)` y `overflow-wrap: anywhere` (se hereda en todo el contenido de Inicio).
  - `src/pages/Home/LocationResults/styles.scss`: `&__list` con `grid-template-columns: minmax(0, 1fr)` y `&__button` con `grid-template-columns: auto minmax(0, 1fr) auto`.
  - `src/pages/Home/CurrentWeather/styles.scss`: el panel pasa a ser contenedor de tamaño en línea (`container-type: inline-size`) y, con una consulta `@container (max-width: 15.3rem)`, `&__summary` pasa a `flex-wrap: wrap`, de modo que la temperatura baja a una segunda línea cuando el área de contenido del panel es más estrecha que hoy a 320 px con el texto normal (246 px = 15,4 rem; la consulta de contenedor mide el área de contenido, sin relleno ni borde). Una consulta de medios en `rem` no sirve para este caso: no escala con el tamaño de fuente asignado a la raíz (que es como se emuló el texto ampliado) y un `flex-wrap` incondicional cambiaba la disposición actual a 320 px con el texto normal, apilando el icono y la temperatura que hoy van en fila.
  - `src/pages/Home/WeatherIcon/styles.scss`: `max-width: 100%`, para que el icono no supere su contenedor y conserve su proporción.
  - `src/pages/About/styles.scss` y `src/pages/NotFound/styles.scss`: `.about-page` y `.not-found-page` con `grid-template-columns: minmax(0, 1fr)`, y `overflow-wrap: anywhere` en su contenido.
- Con el texto en tamaño normal las reglas no se activan (la consulta de contenedor solo actúa por debajo de 15,3 rem de ancho de contenido del panel): las columnas `minmax(0, 1fr)` equivalen a la anchura actual cuando el contenido cabe y `overflow-wrap: anywhere` solo parte palabras que no caben.
- Alternativas descartadas:
  - Quitar `overflow: hidden` de `.app-layout`: permitiría desplazamiento horizontal de toda la página.
  - Reducir tamaños de fuente en pantallas estrechas: contradice 1.4.4.
  - Un contenedor con desplazamiento horizontal por panel: peor experiencia y no resuelve el icono.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/pages/Home/styles.scss` | Columnas `minmax(0, 1fr)` y `overflow-wrap` en búsqueda y tiempo | AC-01, AC-04 |
| `src/pages/Home/LocationResults/styles.scss` | Columnas de la lista y del botón | AC-01 |
| `src/pages/Home/CurrentWeather/styles.scss` | Contenedor de tamaño en línea y `flex-wrap` por consulta de contenedor | AC-01, AC-04, AC-05 |
| `src/pages/Home/WeatherIcon/styles.scss` | `max-width: 100%` | AC-01, AC-04 |
| `src/pages/About/styles.scss` | Columna y `overflow-wrap` | AC-02 |
| `src/pages/NotFound/styles.scss` | Columna y `overflow-wrap` | AC-02 |
| `specs/README.md` | Fila 017 | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Automáticas: no hay pruebas unitarias razonables para valores de diseño en jsdom, que no calcula el diseño. Se ejecuta `npm run check` como red de seguridad.
- Referencia previa al cambio (ya capturada el 2026-11-03 con el código actual): posición y tamaño de los bloques de Inicio con el tiempo cargado a 320, 768 y 1280 px con el texto al 100 %, guardados en el almacenamiento local del navegador de pruebas.
- Manuales, en el navegador integrado con `npm run dev` y la API real:
  - Detector de desbordamiento: para cada elemento de la página principal, comprobar que su borde derecho no supera el del panel que lo contiene ni el ancho del viewport. Con el código actual da 134 elementos al 150 % y 154 al 200 % en Inicio con el tiempo cargado.
  - Estados: Inicio con resultados y con el tiempo cargado, Acerca de y la 404, a 320 y 375 px, con el texto al 100 %, 150 % y 200 %, en español, inglés e italiano.
  - AC-04: anchura del icono al 200 % y comprobación visual de que el texto no se pierde.
  - AC-05: comparación de rectángulos con la referencia previa.
  - Flujo completo sin regresiones y comprobación de que la cabecera de FEAT-015 no cambia.

## Tareas

1. Aplicar los cambios de estilos de la tabla.
2. `npm run check`.
3. Mediciones y comparaciones de AC-01 a AC-05 en el navegador.
4. Revisión de código por el agente y registro de evidencias.
5. Pasar a `IMPLEMENTED` y, con la aceptación, a `VALIDATED`.

## Riesgos, reversión y validación

- Riesgos:
  - `overflow-wrap: anywhere` puede partir una palabra larga en cualquier punto, solo cuando no cabe.
  - Si el resumen del tiempo se envuelve, el panel crece en altura con el texto ampliado.
  - Los datos reales cambian entre la referencia y la verificación.
  - Sin verificar con el ajuste real de un dispositivo ni con lector de pantalla.
- Reversión: revertir los cambios; sin migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Mediciones de AC-01 a AC-04 con ningún elemento desbordado.
  - Comparación de AC-05 sin diferencias salvo datos meteorológicos.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-03. Solo se modificaron estilos `.scss`; no se tocó ningún componente React ni su marcado, por lo que no se cargó `@react-ts-feature-pattern` para este cambio.
- Cambios aplicados: `Home/styles.scss`, `LocationResults/styles.scss`, `CurrentWeather/styles.scss`, `WeatherIcon/styles.scss`, `About/styles.scss` y `NotFound/styles.scss`, como en la tabla del plan. Desviación del diseño aprobado en el resumen del tiempo: el plan inicial era un `flex-wrap` incondicional; se sustituyó por una consulta de contenedor (ver más abajo) y el plan se actualizó antes de validar.
- `npm run check`: lint sin avisos, 34 archivos y 216 pruebas superadas, TypeScript y build correctos; la consulta `@container` y `container-type` aparecen en el CSS de producción. No se ejecutó `npm run test:coverage` porque no cambia código TypeScript.
- Referencia previa (código antes del cambio, capturada con el tiempo de Madrid cargado): 12 bloques de Inicio a 320, 768 y 1280 px con el texto al 100 %.
- Medición del problema con el código original (detector que compara el borde de cada elemento con su panel y con el viewport, a 320 px): Inicio con resultados y el tiempo cargado, 0 elementos desbordados al 100 %, 134 al 150 % y 154 al 200 %; Acerca de, 1 elemento (+42 px) al 200 %; página 404, 4 elementos (+63 px) al 150 % y 5 (+187 px) al 200 %. Inicio sin resultados y en estado inicial no se desbordaban.
- Iteraciones durante la implementación:
  - Un `flex-wrap` incondicional en el resumen del tiempo cambiaba la disposición actual a 320 px con el texto normal (icono y temperatura apilados donde hoy van en fila), incumpliendo AC-05; se descartó.
  - Una consulta de medios en `rem` se descartó porque no escala con el tamaño de fuente asignado a la raíz, que es como se emuló el texto ampliado.
  - La consulta de contenedor con umbral de 17,9 rem seguía apilando a 320 px porque mide el área de contenido del panel (246 px = 15,4 rem) y no el panel entero; se corrigió a 15,3 rem.
- AC-05, texto al 100 % frente a la referencia: a 768 y 1280 px, con la misma temperatura («11,6 °C»), los 12 bloques coinciden sin diferencias. A 320 px, 10 de 12 coinciden y el icono (118 frente a 117,3 px) y el bloque de la temperatura (112 frente a 112,7 px) difieren menos de 1 px. Sin forzar la temperatura, a 768 y 1280 px el bloque de la temperatura difería 3 px por el cambio de datos (11,2 frente a 11,6).
- AC-01, AC-03 y AC-04, tras el cambio, con 0 elementos desbordados en todos los casos:
  - Inicio con resultados y tiempo cargado: 320 px en español, inglés e italiano, y 375 px en español, inglés e italiano, al 100 %, 150 % y 200 %.
  - Anchura del icono del tiempo: 118, 192 y 174 px a 320 px; 128, 192 y 229 px a 375 px (todas por encima de los 100 px exigidos).
  - Inicio en estado inicial, sin resultados y con error de red (503 simulado): 320 px al 100 %, 150 % y 200 %, en inglés.
- AC-02 y AC-03: Acerca de y la página 404 a 320 px, en español, inglés e italiano, al 100 %, 150 % y 200 %: 0 elementos desbordados.
- Observación visual a 320 px al 200 % (Inicio con el tiempo cargado): el panel queda dentro de sus bordes, el icono (174 px) y la temperatura se apilan, y las palabras más largas que la línea (por ejemplo «Comunidad» en el encabezado o «Principalmente» en la etiqueta del estado) se parten en cualquier punto («Comunid/ad»). Es el efecto previsto de `overflow-wrap: anywhere` y solo ocurre cuando la palabra no cabe en la línea.
- AC-06: el resto de la suite pasa y el aspecto con el texto normal se conserva. La cabecera de FEAT-015 no se volvió a medir (sus archivos no se tocaron).
- Revisión de código (agente `react-ts-code-reviewer`, 2026-11-03): sin hallazgos críticos ni importantes. A petición de la persona responsable se aplicó su sugerencia 1, un comentario en `CurrentWeather/styles.scss` que enlaza el umbral de 15,3 rem con su derivación (320 px − 2 rem − 2 px − 2 × 1,25 rem = 246 px = 15,375 rem), y se midió el punto que el revisor dejó por verificar: la anchura del icono en tamaños de texto intermedios. Con el texto del sistema entre el 100 % y el 200 % (11 tamaños), con la temperatura real («11,2 °C») y con «−42,3 °C» forzada en el DOM, a 320, 360, 400 y 480 px: 0 elementos desbordados en las 88 combinaciones y el icono nunca por debajo de 100 px (mínimos: 105 px a 320 px al 100 % con la temperatura larga, 119 px a 360 px al 110 %, 128 px a 400 px y 130 px a 480 px). La estimación del revisor (hasta unos 85 px) era más pesimista que la medición. Queda sin aplicar su sugerencia 2 (quitar un `overflow-wrap` redundante de dos `dd`), por ser opcional.
- No verificado: el ajuste real de tamaño de texto de un dispositivo; lector de pantalla; otros navegadores (las consultas de contenedor requieren un navegador reciente, lo que no he comprobado contra la documentación de compatibilidad); el aspecto visual del build de producción; la cabecera.
- Publicación: ninguna; los cambios no están en un commit ni subidos.
- Aceptación: la persona responsable ordenó expresamente llevar la feature hasta `VALIDATED` el 2026-11-03 («llévala hasta Validate… Implementalo todo»), sin revisar todavía el texto de la especificación ni estas evidencias y con las verificaciones no realizadas enumeradas arriba.
