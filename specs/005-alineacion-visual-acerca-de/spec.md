# FEAT-005 — Alineación visual de «Acerca de»

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Problema y resultado esperado

La página «Acerca de» presenta actualmente un contenedor visual principal más estrecho que el contenido principal de la página meteorológica. Esta diferencia rompe la continuidad visual entre ambas páginas. La persona usuaria necesita que «Acerca de» utilice el mismo ancho y la misma alineación horizontal responsive que la página principal, manteniendo una lectura cómoda de su contenido.

Esta feature amplía de forma incremental FEAT-004 — Navegación entre páginas, actualmente `VALIDATED`, sin modificar sus contratos de navegación, carga perezosa, idioma ni estado.

## Alcance

- Hacer que el contenedor visual principal de «Acerca de» ocupe el mismo ancho disponible y comparta los mismos límites horizontales que el contenedor principal de la página meteorológica para un mismo viewport.
- Mantener en ambas páginas los mismos márgenes laterales responsive.
- Conservar dentro de «Acerca de» una longitud de línea legible aunque su contenedor visual sea más ancho.
- Mantener el aspecto, contenido, jerarquía, espaciado interior y comportamiento existentes de «Acerca de», salvo los ajustes imprescindibles para igualar su ancho y alineación exterior.
- Mantener la adaptación fluida desde 320 px y verificar específicamente 320 px, 360 px, 768 px y 1280 px.

## Fuera de alcance

- Cambiar el contenido, las traducciones o la jerarquía semántica de «Acerca de».
- Rediseñar la página meteorológica, la cabecera compartida, la navegación o el selector de idioma.
- Cambiar colores, tipografía, bordes, sombras, animaciones o estilos de interacción.
- Crear nuevas páginas, rutas o estados de navegación.
- Modificar la carga perezosa, el fallback de carga o la separación de bundles.
- Introducir un sistema general de diseño, una cuadrícula global o una nueva abstracción de layout para otras páginas.
- Cambiar las funcionalidades meteorológicas o los contratos con Open-Meteo.

## Flujo principal

1. La persona usuaria consulta la página principal y percibe sus límites horizontales.
2. Navega a «Acerca de» en el mismo viewport.
3. La página «Acerca de» muestra su contenedor visual principal alineado con los mismos límites horizontales de la página principal.
4. El texto permanece legible y la página continúa funcionando sin desplazamiento horizontal.

## Escenarios y criterios de aceptación

### AC-01 — Ancho coherente entre páginas

- **Dado** que la persona usuaria visualiza la aplicación en un mismo viewport
- **Cuando** compara el contenedor principal de `/` con el contenedor visual principal de `/acerca-de`
- **Entonces** ambos ocupan el mismo ancho disponible
- **Y** sus límites izquierdo y derecho quedan alineados

### AC-02 — Comportamiento responsive

- **Dado** que la persona usuaria accede a «Acerca de» con un viewport de 320 px, 360 px, 768 px o 1280 px
- **Cuando** la página termina de representarse
- **Entonces** conserva los mismos márgenes laterales responsive que la página principal en ese viewport
- **Y** no presenta solapamientos, recortes ni desplazamiento horizontal de la página

### AC-03 — Legibilidad del contenido

- **Dado** que el contenedor visual de «Acerca de» utiliza el ancho compartido
- **Cuando** se muestra su texto informativo en un viewport amplio
- **Entonces** el texto conserva una longitud de línea legible
- **Y** su jerarquía y orden de lectura permanecen sin cambios

### AC-04 — Regresión de FEAT-004

- **Dado** que FEAT-004 continúa siendo la base de navegación
- **Cuando** la persona usuaria navega entre `/` y `/acerca-de`, cambia el idioma o espera la carga de una página
- **Entonces** se conservan los comportamientos validados de navegación, página activa, historial, acceso directo, carga perezosa, estado de carga e idioma

## Requisitos transversales aplicables

- Accesibilidad: se conservarán la estructura semántica, el orden de lectura, la navegación por teclado y los indicadores de foco existentes; el cambio de ancho no debe ocultar ni recortar contenido al ampliar texto o aplicar zoom.
- Responsive: el contenedor visual de «Acerca de» debe compartir los límites horizontales de la página principal y permanecer operativo desde 320 px; se verificará específicamente a 320 px, 360 px, 768 px y 1280 px, además de zoom al 200 %.
- Internacionalización: no se introducen textos ni claves nuevas; el diseño debe admitir sin recortes el contenido existente en español, inglés e italiano.
- Carga, vacío y error: no se crean estados nuevos; la navegación y el estado de carga validados en FEAT-004 deben conservarse sin cambios.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** «Mismo ancho» se refiere a alinear el contenedor visual exterior de «Acerca de» con el contenedor principal de la página meteorológica, no a extender el texto hasta ocupar todo el ancho disponible.
- **Supuesto:** la página meteorológica es la referencia visual vigente para los márgenes laterales y el ancho máximo compartido.
- **Riesgo:** ampliar el contenedor sin limitar la longitud de línea del texto puede reducir su legibilidad en viewports grandes.
- **Riesgo:** duplicar valores de layout en varias páginas puede provocar nuevas divergencias si la referencia cambia posteriormente; el plan técnico deberá valorar la mínima propiedad compartida necesaria sin introducir un sistema de diseño fuera de alcance.
- **Decisión:** FEAT-004 permanece `VALIDATED`; este ajuste incremental no modifica retroactivamente sus artefactos ni sus criterios aprobados.
