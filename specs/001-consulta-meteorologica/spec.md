# FEAT-001 — Consulta meteorológica por localidad

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-22

**Aprobación:** 2026-08-22

**Implementación:** 2026-08-23

## Problema y resultado esperado

La persona usuaria necesita consultar desde una única página el tiempo actual y la previsión de los próximos siete días para una localidad buscada, con información comprensible en español y estados de la interfaz claros.

## Alcance

- Ofrecer una aplicación de página única sin backend propio.
- Permitir buscar localidades mediante el servicio de geocodificación de Open-Meteo y elegir una de las coincidencias obtenidas.
- Mostrar para la localidad elegida la temperatura, la sensación térmica, la humedad, el viento y el estado meteorológico actuales.
- Mostrar una previsión de siete días con la temperatura máxima, la temperatura mínima y la probabilidad de precipitación de cada día.
- Representar de forma observable los estados inicial, carga, sin resultados, error y éxito.
- Presentar la interfaz en español mediante internacionalización.
- Gestionar mediante Redux Toolkit Query las consultas a Open-Meteo y el estado remoto asociado de datos, carga, error y caché.
- Ofrecer una visualización accesible construida con React y recursos SVG, CSS o Sass, sin incorporar otras dependencias nuevas fuera de Redux Toolkit y React-Redux.

## Fuera de alcance

- Autenticación.
- Mapas.
- Localidades favoritas.
- Geolocalización de la persona usuaria.
- Persistencia de búsquedas, preferencias o resultados.
- Backend propio.
- Integración con ChatGPT, OpenAI u otros servicios de inteligencia artificial.

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

- **Dado** que la persona usuaria ha introducido un término de búsqueda que, tras eliminar los espacios exteriores, contiene al menos dos caracteres
- **Cuando** envía el formulario mediante el botón de búsqueda o la tecla Enter y Open-Meteo Geocoding devuelve una o más coincidencias
- **Entonces** puede identificar y elegir una localidad entre los resultados recibidos mediante su nombre, su primera división administrativa cuando esté disponible y su país, sin separadores vacíos cuando falte alguno de esos datos

### AC-03 — Búsqueda sin resultados

- **Dado** que la persona usuaria ha introducido un término de búsqueda
- **Cuando** Open-Meteo Geocoding no devuelve coincidencias
- **Entonces** la aplicación muestra un estado sin resultados en español y permite realizar otra búsqueda

### AC-04 — Carga observable

- **Dado** que hay una consulta de localidades o de información meteorológica en curso
- **Cuando** la respuesta todavía no está disponible
- **Entonces** la aplicación comunica de forma accesible que la operación correspondiente está cargando

### AC-05 — Error recuperable

- **Dado** que se produce un error al consultar localidades o información meteorológica, o que la respuesta meteorológica no contiene las condiciones actuales, la previsión diaria o siete fechas con sus datos requeridos correctamente alineados
- **Cuando** la operación no puede completarse
- **Entonces** la aplicación muestra un mensaje de error en español, no presenta la operación como exitosa y permite iniciar una nueva búsqueda

### AC-06 — Tiempo actual

- **Dado** que la persona usuaria ha elegido una localidad y la consulta meteorológica finaliza correctamente
- **Cuando** se muestra el estado de éxito
- **Entonces** puede identificar la localidad consultada, la temperatura y la sensación térmica en grados Celsius, la humedad en porcentaje, el viento en kilómetros por hora y el estado meteorológico actual expresado mediante texto en español
- **Y** el estado meteorológico se obtiene del código WMO recibido, se acompaña de un recurso SVG complementario y muestra «Estado no disponible» si el código no es reconocido
- **Y** cualquier otro valor meteorológico aislado que no esté disponible se identifica como «No disponible» sin ocultar los demás valores válidos

### AC-07 — Previsión de siete días

- **Dado** que la persona usuaria ha elegido una localidad y la consulta meteorológica finaliza correctamente
- **Cuando** se muestra la previsión
- **Entonces** se presentan exactamente siete días y cada uno muestra su temperatura máxima y mínima en grados Celsius y la probabilidad máxima de precipitación diaria en porcentaje, o «No disponible» para cualquier valor aislado ausente

### AC-08 — Nueva búsqueda

- **Dado** que la aplicación muestra un estado sin resultados, error o éxito
- **Cuando** la persona usuaria inicia una nueva búsqueda
- **Entonces** puede completar el flujo para otra localidad sin recargar la aplicación

### AC-09 — Información meteorológica accesible

- **Dado** que se muestran resultados de localidades o información meteorológica
- **Cuando** la persona usuaria navega y consulta el contenido con teclado o tecnología de asistencia
- **Entonces** los controles tienen nombre accesible, el foco es perceptible, el orden de navegación es coherente y la información no depende exclusivamente del color ni de elementos visuales sin alternativa textual
- **Y** el texto del estado meteorológico aporta el significado, mientras que el recurso SVG es complementario y no sustituye esa información

### AC-10 — Interfaz en español

- **Dado** que la persona usuaria accede a cualquier estado de la aplicación
- **Cuando** se muestran controles, mensajes o datos con etiquetas propias de la interfaz
- **Entonces** esos textos se presentan en español mediante el sistema de internacionalización

### AC-11 — Validación del término de búsqueda

- **Dado** que el término de búsqueda, tras eliminar los espacios exteriores, contiene menos de dos caracteres
- **Cuando** la persona usuaria intenta enviar el formulario mediante el botón de búsqueda o la tecla Enter
- **Entonces** la aplicación muestra un mensaje de validación en español, no consulta Open-Meteo Geocoding y permite corregir el término

## Requisitos transversales aplicables

- Accesibilidad: el buscador, las coincidencias, los estados y la información meteorológica deben ser utilizables con teclado y comprensibles mediante tecnología de asistencia; el foco debe ser visible y los recursos visuales no deben ser la única forma de comunicar información.
- Responsive: la interfaz debe ser operativa desde 320 px de ancho, adaptarse de forma fluida y verificarse específicamente a 360 px, 768 px y 1280 px; la búsqueda, el tiempo actual y los siete días deben conservar su contenido sin solapamientos ni desplazamiento horizontal de la página, y el contenido debe permanecer centrado en pantallas grandes.
- Internacionalización: todos los textos propios de la interfaz deben estar en español y obtenerse mediante i18next; no se incluye cambio de idioma.
- Carga, vacío y error: se deben distinguir el estado inicial, la carga de localidades, la carga meteorológica, la búsqueda sin resultados, el error de consulta y el éxito.
- Acceso a datos: Redux Toolkit Query debe gestionar las consultas a Open-Meteo y su estado remoto; el estado propio del formulario y de la interacción visual permanece local en React mientras no exista una necesidad aprobada para compartirlo globalmente.

## Supuestos, riesgos y decisiones cerradas

- **Supuesto:** Open-Meteo Geocoding y el servicio meteorológico proporcionan los datos necesarios para las localidades seleccionadas, pendiente de validar contra sus contratos antes del plan técnico.
- **Riesgo:** localidades con el mismo nombre, primera división administrativa y país pueden seguir resultando ambiguas; no se mostrarán coordenadas ni se añadirá otro mecanismo de desambiguación dentro de esta feature.
- **Riesgo:** una respuesta estructuralmente incompleta impide presentar el resultado como exitoso y debe tratarse como error recuperable.
- **Decisión:** las coincidencias se identifican mediante nombre, primera división administrativa cuando exista y país; el identificador de Open-Meteo se usa solo de forma interna.
- **Decisión:** la búsqueda se envía mediante botón o tecla Enter y requiere al menos dos caracteres después de eliminar espacios exteriores.
- **Decisión:** se muestran grados Celsius, porcentaje de humedad y kilómetros por hora, solicitando explícitamente esas unidades al servicio meteorológico.
- **Decisión:** la probabilidad diaria mostrada es la probabilidad máxima de precipitación del día.
- **Decisión:** el estado meteorológico se representa mediante texto en español obtenido del código WMO y un recurso SVG complementario; la distinción visual entre día y noche puede utilizar el indicador correspondiente del servicio.
- **Decisión:** la interfaz admite anchos desde 320 px y se valida específicamente a 360 px, 768 px y 1280 px.
- **Decisión:** los datos opcionales de localidad ausentes se omiten, los valores meteorológicos aislados ausentes se muestran como «No disponible» y la ausencia de estructuras esenciales produce un error recuperable.
- **Decisión:** Redux Toolkit Query gestiona exclusivamente las consultas a Open-Meteo y su estado remoto; esta feature no incorpora integración con ChatGPT ni OpenAI.
