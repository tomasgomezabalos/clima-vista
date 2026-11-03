# FEAT-014 — Anuncio de resultados de búsqueda y del tiempo

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-013 y FEAT-014 («crea las dos especificaciones, en draft, pero implementalas. Valídalas»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, sin commit ni push.

## Problema y resultado esperado

La auditoría de accesibilidad del 2026-11-03 confirmó, leyendo el código, que los resultados de búsqueda y el tiempo aparecen sin ningún aviso a las tecnologías de apoyo (WCAG 4.1.3). Hoy solo se anuncian la carga, el estado vacío y los errores. Cuando `Loading` desaparece, la persona no sabe que hay resultados ni cuántos, y al elegir una localidad el tiempo aparece más abajo sin aviso.

Resultado esperado: tras una búsqueda con resultados se anuncia cuántas localidades se han encontrado, y cuando termina la carga del tiempo se anuncia para qué localidad, sin mover el foco y sin cambios visuales.

## Alcance

- Una región viva persistente (`aria-live="polite"` y `aria-atomic="true"`, sin `role="status"` para no duplicar las regiones de estado existentes), presente desde el primer renderizado de Inicio y no visible, que recibe el texto del anuncio.
- Anuncio «N localidades encontradas» al mostrarse una lista con resultados (con singular para una localidad).
- Anuncio «Tiempo cargado para {localidad}» al mostrarse el tiempo actual y la previsión.
- Textos en es, en e it.

## Fuera de alcance

- Cambios visuales y movimiento del foco.
- Los mensajes existentes de carga, vacío y error (`Loading` y `StatusMessage`), que no cambian.
- `aria-busy` y `aria-live` redundantes en esos componentes.
- Título, foco por ruta y `main` (FEAT-013).

## Flujo principal

1. La persona busca una localidad.
2. Mientras se busca, se anuncia «Buscando localidades…», como hasta ahora.
3. Al terminar con resultados, se anuncia «N localidades encontradas».
4. La persona elige una localidad; mientras se consulta el tiempo se anuncia «Consultando la información meteorológica…», como hasta ahora.
5. Al terminar, se anuncia «Tiempo cargado para {localidad}».

## Escenarios y criterios de aceptación

### AC-01 — Región persistente y no visible
- **Dado** el estado inicial de Inicio
- **Entonces** existe una región viva propia del anuncio, vacía y no visible
- **Y** permanece en el DOM durante toda la visita a Inicio.

### AC-02 — Anuncio de resultados de búsqueda
- **Dado** que se completa una búsqueda con N ≥ 1 resultados
- **Entonces** la región anuncia «N localidades encontradas», o «1 localidad encontrada» si N = 1.

### AC-03 — Anuncio del tiempo cargado
- **Dado** que se ha elegido una localidad y termina la consulta con éxito
- **Entonces** la región anuncia «Tiempo cargado para {localidad}», con el mismo nombre que muestra el encabezado del tiempo actual.

### AC-04 — Sin anuncios espurios
- **Dado** una búsqueda en curso, sin resultados, con error, o una consulta del tiempo en curso o con error
- **Entonces** la región está vacía
- **Y** los mensajes existentes de esos estados se mantienen sin cambios.

### AC-05 — Nueva búsqueda
- **Dado** que había un anuncio previo
- **Cuando** la persona inicia otra búsqueda
- **Entonces** la región se vacía mientras se busca, de modo que el siguiente anuncio se emite aunque el texto coincida con el anterior.

### AC-06 — Idiomas
- **Dado** el idioma español, inglés o italiano
- **Entonces** los anuncios se muestran en ese idioma.

### AC-07 — Sin regresión
- **Dado** el flujo actual de búsqueda y consulta
- **Entonces** el aspecto, el foco, la validación y los estados de carga, vacío y error se mantienen, y la región no altera el diseño.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo de la feature (WCAG 4.1.3). La región debe estar montada antes de que cambie su contenido para que se anuncie de forma fiable.
- Responsive: no aplica; la región no es visible y no ocupa espacio.
- Internacionalización: aplica; textos en los tres idiomas, con plural para el recuento.
- Carga, vacío y error: se mantienen los mensajes actuales; el anuncio solo cubre los desenlaces con éxito.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** el servicio de geocodificación devuelve como máximo 10 resultados, por lo que bastan las formas plurales «una» y «otra» en los tres idiomas.
- **Riesgo:** no se verifica con un lector de pantalla real que el anuncio se emita; solo que la región existe, está montada y cambia de contenido.
- **Riesgo:** una región oculta con una técnica incorrecta (`display: none`) no se anuncia; debe ocultarse solo visualmente.
- **Abierta (no incluida):** anunciar también que se ha cambiado de idioma.
