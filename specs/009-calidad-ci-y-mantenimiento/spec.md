# FEAT-009 — Calidad en CI y mantenimiento del proyecto

**Estado:** VALIDATED

**Fecha:** 2026-10-31

**Aprobación:** 2026-10-31, expresa en el chat por la persona responsable («Haz todo lo que tengas que hacer para que mejores este proyecto»).

## Problema y resultado esperado

La integración continua solo ejecuta las pruebas con cobertura: ni el lint ni la compilación se verifican en cada push o pull request, y la cobertura actual (100 %) no está protegida frente a regresiones. Además quedan restos de la plantilla original (nombre del paquete, `specs/README.md`), el documento HTML carece de metadatos básicos y hay lógica equivalente duplicada.

## Alcance

- Ejecutar lint y compilación de producción en el workflow de GitHub Actions existente, sin repetir la suite de pruebas.
- Fijar umbrales mínimos de cobertura del 95 % en sentencias, ramas, funciones y líneas, a partir de la línea base medida del 100 %.
- Sustituir el nombre de plantilla del paquete por `clima-vista`.
- Actualizar `specs/README.md` para reflejar las features existentes.
- Añadir al documento HTML una descripción, `theme-color` y un favicon.
- Consolidar duplicación semánticamente equivalente: formateadores `Intl` por idioma, tratamiento de respuestas en las dos APIs de Open-Meteo y resolución del idioma soportado.

## Fuera de alcance

- Cambios visibles de comportamiento, textos o diseño.
- Nuevas dependencias.
- Reglas `jsx-a11y`: `eslint-plugin-jsx-a11y@6.10.2` declara como peer `eslint` hasta la versión 9 y el proyecto usa ESLint 10.

## Escenarios y criterios de aceptación

### AC-01 — Lint y build en CI
- **Dado** un push o pull request
- **Cuando** se ejecuta el workflow
- **Entonces** corre `npm run lint` y `npm run build`, y un fallo de cualquiera de ellos falla el job
- **Y** las pruebas se ejecutan una sola vez.

### AC-02 — Umbral de cobertura
- **Dado** la configuración de cobertura
- **Cuando** algún porcentaje baja del 95 %
- **Entonces** `npm run test:coverage` termina con error.

### AC-03 — Metadatos del proyecto
- **Dado** el repositorio
- **Entonces** `package.json` se llama `clima-vista`, `specs/README.md` no afirma que no existan features y `index.html` incluye descripción, `theme-color` y favicon.

### AC-04 — Deduplicación sin cambio de comportamiento
- **Dado** el código consolidado
- **Cuando** se ejecuta la suite existente
- **Entonces** pasa sin modificar sus expectativas
- **Y** los nuevos helpers compartidos tienen pruebas propias.

## Requisitos transversales aplicables

- Accesibilidad, responsive e internacionalización: sin cambios de interfaz; no aplican.
- Carga, vacío y error: sin cambios; los errores de respuesta inválida conservan su forma (`CUSTOM_ERROR`).

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** el umbral del 95 % deja margen razonable sobre el 100 % actual.
- **Riesgo:** un umbral alto puede bloquear PR legítimos; se ajusta con un nuevo cambio documentado.
- **Nota:** esta feature revisa la decisión de FEAT-007 de no ejecutar otros controles ni fijar umbrales, ahora con una línea base aprobada.
