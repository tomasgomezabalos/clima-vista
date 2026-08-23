# Plan técnico — FEAT-005 Alineación visual de «Acerca de»

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/005-alineacion-visual-acerca-de/spec.md`, aprobada el 2026-08-23.
- Criterios cubiertos: AC-01 a AC-04.
- Alcance técnico: ajustar únicamente el ancho y los márgenes horizontales responsive del contenedor visual de «Acerca de», preservando la medida legible del texto y todo comportamiento validado de FEAT-004.
- Fuera de alcance: cambiar JSX, contenido, traducciones, navegación, carga perezosa, componentes compartidos, `Home`, cabecera, funcionalidades meteorológicas o introducir un sistema global de layout.
- La aprobación de la especificación autorizó redactar este plan. La aprobación posterior del plan y la orden expresa de implementarlo autorizan exclusivamente los cambios y comprobaciones aquí enumerados.

## Decisiones y diseño

### Ajuste localizado

- Se modificará únicamente `src/pages/About/styles.scss`; no se crearán ni modificarán componentes React, por lo que `react-ts-feature-pattern` no resulta aplicable a esta implementación.
- `.about-page` separará su espaciado vertical del horizontal para conservar el ritmo vertical vigente y aplicar los mismos márgenes laterales de `Home`: 1 rem por lado en viewports estrechos y 2 rem desde 48 rem.
- `.about-page__content` sustituirá su límite exclusivo de 46 rem por el límite de 72 rem que utiliza `.home__content`.
- La combinación del ancho disponible del contenido y el padding horizontal del contenedor producirá la misma geometría que `Home`:
  - antes de 48 rem: ancho del viewport menos 2 rem, con máximo de 72 rem;
  - desde 48 rem: ancho del viewport menos 4 rem, con máximo de 72 rem.
- Se conservará el límite actual de 40 rem del párrafo informativo. La superficie visual podrá crecer hasta el ancho compartido sin extender la longitud de línea del texto.
- No se modificarán borde, fondo, radio, padding interior, tipografía, jerarquía ni colores.

### Deduplicación proporcional

- `Home`, la cabecera compartida y el estado de carga utilizan actualmente valores de ancho equivalentes, pero no existe un propietario común aprobado para ellos.
- Se descarta introducir variables globales, mixins, una clase contenedora o cambios de markup: ampliaría el alcance a módulos ya validados y contradiría la exclusión de una nueva abstracción de layout.
- El plan replica localmente el contrato visual mínimo existente. Si más páginas necesitan posteriormente este mismo contenedor, se deberá proponer por separado su consolidación en un propietario compartido.

### Alternativas descartadas

- Cambiar el ancho de `Home`: invertiría la referencia aprobada y modificaría una página fuera de alcance.
- Eliminar el límite de ancho de «Acerca de»: permitiría que la tarjeta ocupara todo el viewport en pantallas grandes y dejaría de coincidir con `Home`.
- Ampliar también el párrafo a 72 rem: degradaría la legibilidad prevista por AC-03.
- Crear un componente o layout compartido: requeriría cambios de JSX, pruebas de componentes y una decisión de diseño más amplia que esta corrección visual.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/pages/About/styles.scss` | Igualar ancho máximo y márgenes horizontales responsive con `Home`, preservando la medida del texto. | AC-01 a AC-03 |
| `specs/005-alineacion-visual-acerca-de/spec.md` | Registrar el estado de implementación cuando exista autorización y evidencia suficiente. | Trazabilidad SDD |
| `specs/005-alineacion-visual-acerca-de/plan.md` | Registrar decisiones, comprobaciones y estado final de implementación. | AC-01 a AC-04 |

No se prevén cambios en TypeScript, JSX, pruebas unitarias, traducciones, rutas, dependencias, configuración, mocks ni APIs.

## Dependencias e instalaciones

- Ninguna dependencia nueva.
- No se ejecutará `npm install` ni se modificará el lockfile.
- La validación utilizará Node `22.22.0`, fijado actualmente en `.nvmrc`.

## Estrategia de pruebas

- Unitarias: no se crearán ni modificarán pruebas unitarias; JSDOM no calcula layout y no puede demostrar igualdad geométrica entre contenedores CSS.
- Regresión automatizada: ejecutar `npm run check` para validar lint, las 57 pruebas existentes, TypeScript y build de producción.
- Geometría en navegador: para 320 px, 360 px, 768 px y 1280 px, registrar `left`, `right` y `width` de `.home__content` y `.about-page__content` en el mismo viewport; las diferencias deberán ser como máximo de 1 px por posibles redondeos subpíxel.
- Responsive: confirmar en esos cuatro viewports que no existen solapamientos, recortes ni desplazamiento horizontal y que navegación y selector continúan visibles.
- Zoom: comprobar «Acerca de» al 200 % sin recortes ni pérdida de contenido. Si el navegador automatizado no permite controlar zoom real, registrar el reflow equivalente y dejar la comprobación manual de zoom explícitamente pendiente para la validación.
- Internacionalización: comprobar español, inglés e italiano en «Acerca de» para verificar que el contenido no se recorta y conserva su orden.
- Regresión FEAT-004: navegar entre `/` y `/acerca-de`, comprobar página activa, acceso directo, selector de idioma y ausencia de errores o avisos nuevos en consola.
- Build: confirmar que el cambio de SCSS no altera la separación JavaScript de las rutas lazy; no se exigirán hashes ni tamaños exactos.

## Tareas

1. Confirmar que la especificación y este plan están aprobados y que existe autorización expresa para implementar.
2. Activar Node `22.22.0` y comprobar que el árbol de trabajo contiene únicamente los artefactos SDD esperados.
3. Ajustar en `src/pages/About/styles.scss` el padding horizontal responsive de `.about-page` sin cambiar el padding vertical.
4. Cambiar el ancho máximo de `.about-page__content` para que coincida con `.home__content`, conservando el límite del párrafo.
5. Revisar el diff para confirmar que no se han modificado markup, comportamiento, textos ni estilos fuera del ancho y los márgenes autorizados.
6. Ejecutar `npm run check` con Node `22.22.0`.
7. Validar en navegador la geometría comparada, responsive, idiomas, zoom y regresión de navegación descritos.
8. Revisar la deduplicación segura y confirmar que una abstracción compartida continúa fuera de alcance.
9. Si todas las comprobaciones son satisfactorias, registrar evidencias y pasar especificación y plan a `IMPLEMENTED`; no pasar a `VALIDATED` sin aceptación expresa.

## Evidencias de implementación

- Aceptación: la persona responsable aprobó expresamente el resultado visual y autorizó publicar todos los cambios el 2026-08-23.
- Alcance: el único archivo de aplicación modificado es `src/pages/About/styles.scss`; no se han cambiado JSX, TypeScript, traducciones, rutas, dependencias, configuración, mocks ni APIs.
- Estilos: el padding vertical conserva su valor; el margen horizontal es de 1 rem antes de 48 rem y 2 rem desde ese breakpoint; el contenedor visual utiliza un máximo de 72 rem y el párrafo mantiene su máximo de 40 rem.
- Calidad automatizada: `npm run check` con Node `22.22.0` finaliza correctamente con lint sin incidencias, 22 archivos y 57 pruebas superadas, TypeScript y build de producción satisfactorios.
- Bundles: Vite transforma 157 módulos y conserva artefactos JavaScript independientes para `Home`, `About` y `NotFound`; el cambio se limita al artefacto CSS de `About`.

| Viewport | `Home` (`left`, `right`, `width`) | `About` (`left`, `right`, `width`) | Diferencia |
| --- | --- | --- | --- |
| 320 px | 16 px, 289 px, 273 px | 16 px, 289 px, 273 px | 0 px |
| 360 px | 16 px, 329 px, 313 px | 16 px, 329 px, 313 px | 0 px |
| 768 px | 32 px, 736 px, 704 px | 32 px, 736 px, 704 px | 0 px |
| 1280 px | 64 px, 1216 px, 1152 px | 64 px, 1216 px, 1152 px | 0 px |

- Legibilidad: el párrafo conserva `max-width: 640px`; alcanza 640 px como máximo en el viewport amplio y no se extiende con la tarjeta.
- Responsive e idiomas: no existe desplazamiento horizontal; navegación, selector y contenido permanecen visibles. Español, inglés e italiano conservan su encabezado, idioma de documento y selección activa sin recortes a 320 px.
- Regresión FEAT-004: navegación SPA, enlace activo, Atrás, Adelante y conservación del idioma italiano funcionan en `/` y `/acerca-de`; no aparecen errores ni avisos de consola.
- Reflow: a 640 px, equivalente de layout a 1280 px con zoom al 200 %, no existen recortes ni overflow. El navegador automatizado no expone control de zoom real; la evidencia equivalente fue aceptada expresamente durante la validación.
- Deduplicación: no se introduce una abstracción global; se mantiene la decisión aprobada de limitar el cambio a «Acerca de» y dejar una posible consolidación de contenedores para un alcance posterior.

## Riesgos, reversión y validación

- Riesgo de geometría: modificar solo el máximo de 46 rem a 72 rem dejaría «Acerca de» 2 rem más ancha que `Home` entre 48 rem y el ancho máximo; por eso el padding horizontal debe cambiar también en ese breakpoint.
- Riesgo de legibilidad: la tarjeta más ancha puede generar una línea excesiva si se elimina accidentalmente el máximo del párrafo; ese límite se preservará y comprobará.
- Riesgo de abstracción: consolidar todos los contenedores compartidos podría parecer una deduplicación conveniente, pero ampliaría la superficie y el riesgo de regresión. No se realizará dentro de FEAT-005.
- Riesgo de validación visual: una captura aislada puede ocultar diferencias pequeñas. La comparación combinará inspección visual y medidas geométricas del navegador.
- Reversión: restaurar las declaraciones originales de padding de `.about-page` y el límite de 46 rem de `.about-page__content`.
- Comandos de validación previstos: `nvm use 22.22.0`, `npm run check` y `npm run dev:mocks -- --host 127.0.0.1`.
- Evidencias necesarias para pasar a `IMPLEMENTED`: diff limitado al alcance; `npm run check` satisfactorio; igualdad geométrica en los cuatro viewports; texto legible; ausencia de overflow; idiomas y navegación sin regresiones; revisión de consola y bundles.
- Evidencias necesarias para pasar a `VALIDATED`: revisión de las evidencias anteriores, comprobación visual del ancho compartido y aceptación expresa de la persona responsable.
