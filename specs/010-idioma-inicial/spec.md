# FEAT-010 — Idioma inicial: recuerdo y detección

**Estado:** IMPLEMENTED

**Fecha:** 2026-10-31

**Aprobación:** 2026-10-31, expresa en el chat por la persona responsable («Haz todo lo que tengas que hacer para que mejores este proyecto»).

## Problema y resultado esperado

La aplicación siempre arranca en español y olvida la elección al recargar, incluso si la persona usa un navegador en inglés o italiano o ya eligió otro idioma. Debe iniciarse en el idioma que le corresponde.

## Revisión de decisiones previas

Esta feature **sustituye** estas decisiones de FEAT-002 (VALIDATED): «Mantener el español como idioma predeterminado en cada nueva carga», «Mantener la selección únicamente durante la carga actual» y la exclusión de detección automática y de persistencia en almacenamiento local. El resto de FEAT-002 y FEAT-003 sigue vigente; el español continúa siendo el idioma de reserva.

## Alcance

- Al elegir un idioma en el selector, guardarlo en `localStorage` (clave `clima-vista.language`).
- Al iniciar, elegir el idioma por este orden: el guardado válido; el primero soportado de `navigator.languages`; español.
- Ignorar sin error valores guardados no soportados y tolerar la ausencia o el fallo de `localStorage`.
- Mantener sincronizado el atributo `lang` del documento (ya existente).

## Fuera de alcance

- Persistencia en cookies, URL, cuenta o backend.
- Idiomas nuevos.
- Cambios en el selector de idioma.

## Escenarios y criterios de aceptación

### AC-01 — Idioma guardado
- **Dado** que se eligió inglés en una visita anterior
- **Cuando** se carga la aplicación
- **Entonces** se muestra en inglés.

### AC-02 — Idioma del navegador
- **Dado** que no hay idioma guardado y el navegador prefiere italiano
- **Cuando** se carga la aplicación
- **Entonces** se muestra en italiano.
- **Y** si ningún idioma preferido está soportado, se muestra en español.

### AC-03 — Persistencia al cambiar
- **Cuando** la persona elige un idioma en el selector
- **Entonces** queda guardado para la siguiente carga.

### AC-04 — Tolerancia a fallos
- **Dado** un valor guardado no soportado, o un `localStorage` no disponible
- **Entonces** la aplicación arranca por el criterio siguiente sin lanzar errores.

## Requisitos transversales aplicables

- Accesibilidad: sin cambios; `lang` del documento sigue reflejando el idioma activo.
- Responsive: no aplica.
- Internacionalización: aplica a los tres idiomas.
- Carga, vacío y error: no aplica.

## Supuestos, riesgos y cuestiones abiertas

- **Riesgo:** quien prefiera español ve la primera carga en el idioma de su navegador si este es en/it; puede cambiarlo en el selector.
- **Supuesto:** se compara solo el idioma base (`en-US` → `en`), como hace `resolveSupportedLanguage`.
