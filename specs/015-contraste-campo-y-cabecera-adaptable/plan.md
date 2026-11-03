# Plan técnico — FEAT-015 Contraste del campo de búsqueda y cabecera adaptable

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, expresa en el chat por la persona responsable: plan original («Aprobar plan») y ampliación con los estilos de `AppNavigation` («Aprobar ampliación»); autoriza exclusivamente lo enumerado en este plan, con los colores propuestos. La implementación se autorizó expresamente el 2026-11-03 («Implementar ahora»).

## Especificación y alcance autorizado

- Especificación: `specs/015-contraste-campo-y-cabecera-adaptable/spec.md` (APPROVED el 2026-11-03)
- Criterios cubiertos: AC-01 a AC-04
- Fuera de alcance: otros contrastes, borde del selector de idioma, foco de `main` en carga diferida, cambios de comportamiento o textos.
- Ampliación (2026-11-03): estilos de `src/components/AppNavigation/styles.scss`, necesarios para AC-03 al 200 % de texto en los anchos más estrechos.

## Decisiones y diseño

- ADR aplicables: ADR 0003 (Sass), sin cambios; no se añade dependencia.
- Componentes propios: solo se modifican estilos (`.scss`) de `SearchForm` y `AppLayout`; no cambia el marcado ni la lógica. Si aun así se tocan componentes React, se cargará `@react-ts-feature-pattern` y se declarará el modo (`strict` si cambia comportamiento observable).
- Contraste (propuesta de color, pendiente de aprobación):
  - Borde base de `.search-form__input` de `#3b536c` a `#5d7a96`: 4,03:1 con el relleno `#0a1726` y entre 3,49:1 (fondo claro en el peor caso) y 3,85:1 con la tarjeta.
  - Borde al pasar el ratón de `#607d99` a `#7894b0` (5,73:1 con el relleno), para que siga siendo distinguible del estado base.
  - El borde de error `#ff9d9d` no cambia.
  - Los valores salen de un cálculo con los colores del código, no de una medición del render final; se medirán en el navegador antes de validar.
- Cabecera:
  - `src/layouts/AppLayout/styles.scss`: `.app-layout__bar` pasa de `flex-wrap: nowrap` a `flex-wrap: wrap`, para que el selector baje a una segunda línea cuando no cabe.
  - Se mantiene `justify-content: space-between` para que con texto normal el aspecto no cambie.
  - Hay que comprobar el `min-height` de `.app-layout__content` (`calc(100vh - 5rem)`), que supone una cabecera de una línea.
- Ampliación, navegación:
  - Medido el 2026-11-03 con el cambio 3 aplicado: al 200 % de texto a 320 px, `.app-navigation` (`inline-flex`, sin ajuste) mide 319 px en español (de 32 a 351 en un viewport de 320) y se sale por la derecha; a 375 px ocurre en italiano.
  - Solución propuesta en `src/components/AppNavigation/styles.scss`: `flex-wrap: wrap` y `max-width: 100%` en `.app-navigation`, de modo que los enlaces pasen a una segunda línea dentro de la cápsula cuando no caben. Con el texto normal los enlaces caben en una fila y el aspecto no cambia.
  - Riesgo: la cápsula (`border-radius: 999px`) con dos filas de enlaces cambia de forma; se valorará visualmente y, si no es aceptable, se ajustará el radio solo en ese caso antes de pedir la validación.
- Alternativas descartadas:
  - Reducir el tamaño de los enlaces o del texto con la ampliación: contradice 1.4.4.
  - Quitar `overflow: hidden` de `.app-layout`: permitiría desplazamiento horizontal de toda la página, que es lo que 1.4.10 pretende evitar.
  - Reducir el tamaño de los controles con texto ampliado: contradice 1.4.4.
  - Un menú colapsable: añade comportamiento y componentes sin necesidad concreta.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/pages/Home/SearchForm/styles.scss` | Colores del borde del campo en reposo y al pasar el ratón | AC-01 |
| `src/layouts/AppLayout/styles.scss` | `flex-wrap: wrap` en la cabecera y separación entre líneas | AC-02, AC-03 |
| `src/components/AppNavigation/styles.scss` | Ampliación: `flex-wrap: wrap` y `max-width: 100%` en la cápsula de navegación | AC-03 |
| `specs/README.md` | Fila 015 | trazabilidad |

## Dependencias e instalaciones

Ninguna.

## Estrategia de pruebas

- Automáticas: no hay pruebas unitarias razonables para valores de estilo en jsdom, que no calcula el diseño. Se ejecuta `npm run check` para comprobar que no hay regresiones.
- Manuales, en el navegador integrado con `npm run dev`:
  - Medir el contraste del borde del campo en los tres estados con un cálculo sobre los colores calculados por el navegador.
  - Medir la cabecera a 320 px y a 375 px con el tamaño de fuente raíz al 100 %, 150 % y 200 %, en es, en e it: ningún elemento recortado y sin desplazamiento horizontal.
  - Comprobar visualmente que a 375 px y ancho de escritorio con texto normal el aspecto no cambia, y que el contenido no queda tapado.
  - Flujo completo de búsqueda y consulta sin regresiones.
- Accesibilidad: no se prueba con lector de pantalla real.

## Tareas

1. Color propuesto aprobado con el plan (2026-11-03).
2. Cambios de estilos en `SearchForm` y `AppLayout` (aplicados el 2026-11-03).
2b. Ampliación: estilos de `AppNavigation` (aprobada el 2026-11-03).
3. `npm run check` y `npm run test:coverage`.
4. Mediciones y verificación manual en el navegador integrado.
5. Registrar evidencias y pasar a `IMPLEMENTED`.

## Riesgos, reversión y validación

- Riesgos:
  - El nuevo color del borde cambia el aspecto del campo.
  - La cabecera en dos líneas aumenta su altura y puede desajustar el `min-height` del contenido.
  - Sin verificar con el ajuste real de tamaño de texto de un dispositivo.
- Reversión: revertir el cambio; sin migraciones ni dependencias nuevas.
- Comandos de validación: `npm run check` y `npm run test:coverage`.
- Evidencias necesarias para pasar a `VALIDATED`:
  - `npm run check` verde y cobertura por encima del umbral.
  - Mediciones de contraste y de cabecera de AC-01 a AC-03, con los valores obtenidos.
  - Comprobación visual de que no hay regresiones.
  - Aceptación expresa de la persona responsable.

## Evidencias de implementación

- Fecha: 2026-11-03. Solo se modificaron estilos `.scss`; no se tocó ningún componente React, por lo que no se cargó `@react-ts-feature-pattern` para este cambio.
- Cambios aplicados, los enumerados en el plan:
  - `src/pages/Home/SearchForm/styles.scss`: borde del campo de `#3b536c` a `#5d7a96` y, al pasar el ratón, de `#607d99` a `#7894b0`.
  - `src/layouts/AppLayout/styles.scss`: `flex-wrap: nowrap` pasa a `wrap` en `.app-layout__bar`.
- `npm run check`: lint sin avisos, 32 archivos y 206 pruebas superadas, TypeScript y build correctos. No se ejecutó `npm run test:coverage` porque no cambia código TypeScript.
- AC-01, medido en el navegador integrado con `npm run dev` (colores calculados por el navegador, contraste con el relleno del campo):
  - Reposo `rgb(93, 122, 150)`: 4,03:1. Con el ratón encima, una vez terminada la transición, `rgb(120, 148, 176)`: 5,73:1. Con error, `rgb(255, 157, 157)`: 9,08:1. El indicador de foco sigue siendo un contorno de 3 px `rgb(128, 221, 255)`.
  - Frente a la tarjeta el contraste es 3,49 a 3,85:1 según el cálculo previo con el fondo en su peor caso; no se midió sobre el render final.
- AC-02: con el texto al 100 % la cabecera no recorta nada ni produce desplazamiento horizontal a 320 px y 375 px (es, en e it) y a 480 px y 1024 px (es); la barra mide 80 px (una línea), como antes.
- AC-03, con el tamaño de fuente raíz emulado:
  - Al 150 %: sin recortes a 320 px (es, en e it), 375 px (es e it), 480 px y 1024 px (es).
  - Al 200 %: sin recortes a 375 px (es), 480 px y 1024 px (es). **Con recorte** a 320 px en es, en e it (el segundo enlace) y a 375 px en it («Informazioni»).
  - Causa: `.app-navigation` es `inline-flex` sin ajuste y a 200 % mide 319 px en es (de 32 a 351 en un viewport de 320), así que se sale aunque el selector de idioma ya baja a una segunda línea.
- Resultado inicial: AC-03 no se cumplía al 200 % en los anchos más estrechos con solo los cambios 1 a 3; se resolvió con la ampliación aprobada (ver más abajo).
- No verificado: ajuste real de tamaño de texto de un dispositivo, lector de pantalla y contraste sobre el render final de la tarjeta.
- Ampliación (2026-11-03, aprobada el mismo día): `src/components/AppNavigation/styles.scss`, `.app-navigation` con `flex-wrap: wrap` y `max-width: 100%`. Desviaciones del diseño aprobado: ninguna.
- `npm run check` tras la ampliación: lint sin avisos, 32 archivos y 206 pruebas superadas, TypeScript y build correctos.
- Mediciones tras la ampliación en el navegador integrado con `npm run dev` (rectángulos de la navegación, de los enlaces y del selector frente al ancho del viewport; barra de una sola línea de 80 px con el texto al 100 %):
  - 320 px, en es, en e it: sin recortes ni desplazamiento horizontal al 100 %, 150 % y 200 % (la navegación mide 256 px al 200 % en los tres idiomas).
  - 375 px, en es e it: sin recortes al 100 %, 150 % y 200 %.
  - 480 px y 1024 px, en es: sin recortes al 100 %, 150 % y 200 %.
  - AC-02 se mantiene: con el texto al 100 % la barra mide 80 px en todos los anchos probados, igual que antes de los cambios.
  - Visual al 200 % a 320 px (es): la cápsula pasa a dos filas con ambos enlaces visibles y el selector de idioma debajo, alineado a la izquierda; la forma de la cápsula cambia pero resulta legible. La alineación del selector es la cuestión abierta del spec.
- Sin pruebas automáticas nuevas: jsdom no calcula el diseño. Las mediciones son las del navegador.
- Revisión de código (agente `react-ts-code-reviewer`, 2026-11-03): sin hallazgos críticos ni importantes sobre los estilos de FEAT-015, incluida la ampliación. Sugerencia opcional no aplicada: un radio de borde menor para la cápsula con dos filas.
- Publicación: ninguna; los cambios no están en un commit ni subidos.
- Aceptación: la persona responsable aceptó expresamente la feature el 2026-11-03 («Pasar a VALIDATED»), con las verificaciones no realizadas enumeradas arriba y las cuestiones abiertas del spec (alineación del selector de idioma y forma de la cápsula) sin resolver.
