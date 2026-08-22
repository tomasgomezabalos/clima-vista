# FEAT-001 — Consulta meteorológica por localidad

**Estado:** DRAFT

**Fecha:** 2026-08-22

**Aprobación:** Pendiente

## Problema y resultado esperado

La persona usuaria necesita consultar desde una única página el tiempo actual y la previsión de los próximos siete días para una localidad buscada, con información comprensible en español y estados de la interfaz claros.

## Alcance

- Ofrecer una aplicación de página única sin backend propio.
- Permitir buscar localidades mediante el servicio de geocodificación de Open-Meteo y elegir una de las coincidencias obtenidas.
- Mostrar para la localidad elegida la temperatura, la sensación térmica, la humedad, el viento y el estado meteorológico actuales.
- Mostrar una previsión de siete días con la temperatura máxima, la temperatura mínima y la probabilidad de precipitación de cada día.
- Representar de forma observable los estados inicial, carga, sin resultados, error y éxito.
- Presentar la interfaz en español mediante internacionalización.
- Ofrecer una visualización accesible construida con React y recursos SVG, CSS o Sass, sin incorporar dependencias nuevas.

## Fuera de alcance

- Autenticación.
- Mapas.
- Localidades favoritas.
- Geolocalización de la persona usuaria.
- Persistencia de búsquedas, preferencias o resultados.
- Backend propio.

## Flujo principal

1. La persona usuaria accede a la aplicación y observa el estado inicial, sin datos meteorológicos de una localidad.
2. Introduce el nombre de una localidad e inicia la búsqueda.
3. La aplicación muestra un estado de carga mientras consulta las localidades en Open-Meteo Geocoding.
4. La aplicación muestra las coincidencias disponibles y la persona usuaria elige una localidad.
5. La aplicación muestra un estado de carga mientras obtiene la información meteorológica.
6. La aplicación presenta el tiempo actual y la previsión de siete días de la localidad elegida.
7. La persona usuaria puede realizar otra búsqueda para consultar una localidad diferente.

## Escenarios y criterios de aceptación

### AC-01 — Estado inicial

- **Dado** que la persona usuaria abre la aplicación sin haber elegido una localidad
- **Cuando** se muestra la vista inicial
- **Entonces** puede identificar el buscador y no se presentan datos meteorológicos como si pertenecieran a una localidad seleccionada

### AC-02 — Búsqueda con coincidencias

- **Dado** que la persona usuaria ha introducido un término de búsqueda válido
- **Cuando** inicia la búsqueda y Open-Meteo Geocoding devuelve una o más coincidencias
- **Entonces** puede identificar y elegir una localidad entre los resultados recibidos

### AC-03 — Búsqueda sin resultados

- **Dado** que la persona usuaria ha introducido un término de búsqueda
- **Cuando** Open-Meteo Geocoding no devuelve coincidencias
- **Entonces** la aplicación muestra un estado sin resultados en español y permite realizar otra búsqueda

### AC-04 — Carga observable

- **Dado** que hay una consulta de localidades o de información meteorológica en curso
- **Cuando** la respuesta todavía no está disponible
- **Entonces** la aplicación comunica de forma accesible que la operación correspondiente está cargando

### AC-05 — Error recuperable

- **Dado** que se produce un error al consultar localidades o información meteorológica
- **Cuando** la operación no puede completarse
- **Entonces** la aplicación muestra un mensaje de error en español, no presenta la operación como exitosa y permite iniciar una nueva búsqueda

### AC-06 — Tiempo actual

- **Dado** que la persona usuaria ha elegido una localidad y la consulta meteorológica finaliza correctamente
- **Cuando** se muestra el estado de éxito
- **Entonces** puede identificar la localidad consultada, la temperatura, la sensación térmica, la humedad, el viento y el estado meteorológico actuales

### AC-07 — Previsión de siete días

- **Dado** que la persona usuaria ha elegido una localidad y la consulta meteorológica finaliza correctamente
- **Cuando** se muestra la previsión
- **Entonces** se presentan exactamente siete días y cada uno muestra su temperatura máxima, temperatura mínima y probabilidad de precipitación

### AC-08 — Nueva búsqueda

- **Dado** que la aplicación muestra un estado sin resultados, error o éxito
- **Cuando** la persona usuaria inicia una nueva búsqueda
- **Entonces** puede completar el flujo para otra localidad sin recargar la aplicación

### AC-09 — Información meteorológica accesible

- **Dado** que se muestran resultados de localidades o información meteorológica
- **Cuando** la persona usuaria navega y consulta el contenido con teclado o tecnología de asistencia
- **Entonces** los controles tienen nombre accesible, el foco es perceptible, el orden de navegación es coherente y la información no depende exclusivamente del color ni de elementos visuales sin alternativa textual

### AC-10 — Interfaz en español

- **Dado** que la persona usuaria accede a cualquier estado de la aplicación
- **Cuando** se muestran controles, mensajes o datos con etiquetas propias de la interfaz
- **Entonces** esos textos se presentan en español mediante el sistema de internacionalización

## Requisitos transversales aplicables

- Accesibilidad: el buscador, las coincidencias, los estados y la información meteorológica deben ser utilizables con teclado y comprensibles mediante tecnología de asistencia; el foco debe ser visible y los recursos visuales no deben ser la única forma de comunicar información.
- Responsive: la búsqueda, el tiempo actual y los siete días deben conservar contenido y operatividad sin solapamientos ni desplazamiento horizontal de la página en los tamaños de pantalla soportados, pendientes de concretar.
- Internacionalización: todos los textos propios de la interfaz deben estar en español y obtenerse mediante i18next; no se incluye cambio de idioma.
- Carga, vacío y error: se deben distinguir el estado inicial, la carga de localidades, la carga meteorológica, la búsqueda sin resultados, el error de consulta y el éxito.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** Open-Meteo Geocoding y el servicio meteorológico proporcionan los datos necesarios para las localidades seleccionadas, pendiente de validar contra sus contratos antes del plan técnico.
- **Riesgo:** localidades con el mismo nombre pueden resultar ambiguas si los datos mostrados en cada coincidencia no permiten diferenciarlas.
- **Riesgo:** una respuesta parcial o la ausencia de algún dato meteorológico puede impedir presentar todos los campos exigidos sin un criterio aprobado para valores no disponibles.
- **Abierta:** definir qué datos de contexto deben identificar y diferenciar cada coincidencia de localidad.
- **Abierta:** definir cómo se inicia la búsqueda y si existe una longitud mínima del término.
- **Abierta:** definir las unidades visibles de temperatura y viento.
- **Abierta:** concretar qué valor diario representa la probabilidad de precipitación.
- **Abierta:** definir cómo se representan los estados meteorológicos actuales de forma visual y textual.
- **Abierta:** concretar los tamaños de pantalla que se usarán para validar el comportamiento responsive.
- **Abierta:** definir el tratamiento observable de datos meteorológicos parciales o no disponibles.
