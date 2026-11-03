# FEAT-016 — Verificación automática de accesibilidad

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-016 y su ADR-0006 («redacta el ADR y el spec de feature en draft. Implementalo, valídalo. Llévalo hasta validated»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, incluida la instalación de las dependencias de desarrollo indicadas, y sin commit ni push.

## Problema y resultado esperado

La auditoría de accesibilidad del 2026-11-03 posterior a FEAT-015 no encontró bloqueantes ni importantes, pero señaló que el proyecto carece de comprobaciones automáticas de accesibilidad: `npm run check` no detectaría un botón sin nombre, un `alt` ausente o un elemento no interactivo con manejador de clic. Las regresiones solo se descubrirían en una auditoría manual.

Resultado esperado: `npm run check` falla cuando el código introduce regresiones de accesibilidad detectables de forma estática o con axe en las rutas y estados principales, sin cambiar el comportamiento ni el aspecto de la aplicación.

## Alcance

- Reglas de accesibilidad para JSX en el análisis estático (lint).
- Pruebas automáticas con axe sobre la aplicación en sus rutas (Inicio, Acerca de y ruta desconocida) y en los estados principales de Inicio: inicial, con error de validación, con resultados de búsqueda, con el tiempo y la previsión mostrados, y con un error de búsqueda.
- Documentar qué cubre y qué no cubre la verificación automática.
- Decisión y dependencias según ADR-0006.

## Fuera de alcance

- El contraste de color, el foco visible, el reflujo y el comportamiento con lector de pantalla o control por voz, que siguen siendo manuales.
- Cambios en el comportamiento, los textos, los estilos o el marcado de la aplicación, salvo las correcciones mínimas que exija una violación real que las nuevas comprobaciones detecten; si apareciera una, se detiene el trabajo y se pide decisión.
- Integración continua, informes de accesibilidad y reglas personalizadas.

## Flujo principal

1. Una persona modifica la interfaz y ejecuta `npm run check`.
2. El lint señala los problemas estáticos de accesibilidad en JSX.
3. Las pruebas con axe señalan las violaciones en el DOM renderizado de las rutas y estados cubiertos.
4. Con la interfaz actual, ambas comprobaciones pasan.

## Escenarios y criterios de aceptación

### AC-01 — Lint estático
- **Dado** el código actual
- **Entonces** `npm run lint` pasa con las reglas de accesibilidad activas
- **Y** una violación deliberada en JSX (por ejemplo una imagen sin `alt`) hace fallar `npm run lint`.

### AC-02 — Rutas
- **Dado** la aplicación renderizada en cada una de sus rutas, en español
- **Entonces** axe no informa violaciones.

### AC-03 — Estados de Inicio
- **Dado** Inicio en sus estados inicial, con error de validación, con resultados, con el tiempo y la previsión y con un error de búsqueda
- **Entonces** axe no informa violaciones en ninguno.

### AC-04 — Detección real
- **Dado** que se introduce una violación en el marcado
- **Entonces** al menos una de las pruebas con axe falla.

### AC-05 — Límites documentados
- **Dado** la verificación automática
- **Entonces** queda documentado qué cubre y qué no, incluido que el contraste no se evalúa en este entorno.

### AC-06 — Sin regresión
- **Dado** el comportamiento actual
- **Entonces** el aspecto y el comportamiento de la aplicación no cambian, `npm run check` pasa y la cobertura se mantiene por encima del umbral.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo de la feature.
- Responsive: no aplica; no cambia el diseño.
- Internacionalización: las comprobaciones de rutas y estados se ejecutan en español; los textos de la aplicación no cambian.
- Carga, vacío y error: el estado de error de búsqueda se cubre en AC-03; el vacío y la carga no se incluyen salvo que aporten cobertura distinta.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** axe en jsdom no evalúa el contraste (marca `color-contrast` como incompleto); comprobado el 2026-11-03.
- **Supuesto:** el código actual no produce violaciones con las reglas elegidas; comprobado en una copia aislada el 2026-11-03.
- **Riesgo:** `eslint-plugin-jsx-a11y` no declara compatibilidad con ESLint 10; se fuerza con un `overrides` (ADR-0006).
- **Riesgo:** una versión nueva de `axe-core` puede añadir reglas que hagan fallar pruebas; se fija la versión exacta.
- **Riesgo:** axe no detecta todo; pasar las pruebas no equivale a ser accesible.
- **Abierta:** ejecutar también las comprobaciones en inglés e italiano.
