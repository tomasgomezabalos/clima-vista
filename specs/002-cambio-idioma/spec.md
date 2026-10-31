# FEAT-002 — Cambio de idioma

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

> **Revisión 2026-10-31:** FEAT-010 (`specs/010-idioma-inicial/`) sustituye la exclusión de persistencia y detección automática del idioma, y el español fijo en cada carga. El resto de esta especificación sigue vigente.

## Problema y resultado esperado

La persona usuaria necesita consultar Clima Vista en español o en inglés y cambiar entre ambos idiomas desde la propia interfaz, sin recargar la página. El idioma elegido debe aplicarse de forma coherente a todos los textos propios de la aplicación, las condiciones meteorológicas y las fechas visibles.

## Alcance

- Incorporar un catálogo completo en inglés equivalente al catálogo español vigente.
- Mostrar un selector de idioma visible con dos opciones identificables: español e inglés.
- Permitir cambiar dinámicamente entre español e inglés sin recargar la página.
- Traducir los controles, encabezados, etiquetas, mensajes de validación, estados de carga, vacío y error, textos de disponibilidad y nombres de condiciones meteorológicas.
- Formatear las fechas de la previsión según el idioma seleccionado.
- Formatear los valores numéricos según el idioma seleccionado, manteniendo sus valores y unidades.
- Solicitar en el idioma activo los datos de localidad de las búsquedas nuevas, sin repetir automáticamente búsquedas ya resueltas al cambiar de idioma.
- Conservar el término escrito, los resultados, la localidad seleccionada y los datos meteorológicos al cambiar de idioma.
- Mantener el español como idioma predeterminado en cada nueva carga de la aplicación.
- Mantener la selección únicamente durante la carga actual de la aplicación, sin persistirla al recargar.
- Exponer de forma accesible el idioma seleccionado y mantener actualizado el idioma declarado por el documento.

## Fuera de alcance

- Idiomas distintos de español e inglés.
- Detección automática del idioma del navegador, sistema operativo o ubicación.
- Persistencia del idioma en almacenamiento local, cookies, cuenta de usuario, URL o backend.
- Traducción automática mediante servicios externos.
- Modificación de las unidades meteorológicas aprobadas para FEAT-001.
- Traducción local del texto introducido por la persona usuaria, nombres propios o la marca «Clima Vista»; los nombres de localidad pueden variar únicamente según los datos que Open-Meteo devuelva en el idioma solicitado.
- Cambios funcionales en la búsqueda, selección de localidad, consulta meteorológica o previsión de siete días, salvo la adaptación lingüística que se apruebe expresamente en esta especificación.

## Flujo principal

1. La persona usuaria abre la aplicación y la interfaz se presenta en español.
2. Identifica el selector de idioma y la opción española como activa.
3. Selecciona inglés.
4. La interfaz visible, las condiciones meteorológicas y las fechas pasan a inglés sin recargar la página.
5. Selecciona español y el contenido vuelve a presentarse en español.
6. Si recarga la aplicación después de haber elegido inglés, la interfaz vuelve a iniciarse en español.

## Escenarios y criterios de aceptación

### AC-01 — Español predeterminado

- **Dado** que la persona usuaria inicia una nueva carga de la aplicación
- **Cuando** se presenta cualquier estado inicial de la interfaz
- **Entonces** los textos propios de la aplicación, las condiciones meteorológicas y las fechas visibles se muestran en español
- **Y** el selector identifica español como idioma activo

### AC-02 — Selector visible y comprensible

- **Dado** que la persona usuaria se encuentra en cualquier estado de la aplicación
- **Cuando** consulta la interfaz
- **Entonces** puede localizar un control de idioma con dos opciones identificables para español e inglés
- **Y** las opciones se muestran siempre mediante los endónimos «Español» y «English»
- **Y** puede reconocer cuál de las dos opciones está activa

### AC-03 — Cambio dinámico a inglés

- **Dado** que la interfaz se muestra en español
- **Cuando** la persona usuaria selecciona inglés
- **Entonces** todos los textos propios visibles de la aplicación pasan a inglés sin recargar la página
- **Y** no se muestran claves internas de traducción ni textos propios en español mezclados con la interfaz inglesa

### AC-04 — Condiciones meteorológicas en inglés

- **Dado** que hay información meteorológica visible y el idioma activo es inglés
- **Cuando** se presenta el estado meteorológico actual
- **Entonces** el nombre de la condición correspondiente al código WMO se muestra en inglés
- **Y** una condición desconocida o no disponible también se comunica en inglés

### AC-05 — Fechas en el idioma activo

- **Dado** que se muestra la previsión de siete días
- **Cuando** la persona usuaria cambia el idioma
- **Entonces** todas las fechas visibles se reformatean inmediatamente según el idioma activo
- **Y** las fechas siguen representando los mismos días recibidos para la localidad seleccionada

### AC-06 — Cambio dinámico a español

- **Dado** que la interfaz se muestra en inglés
- **Cuando** la persona usuaria selecciona español
- **Entonces** los textos propios, las condiciones meteorológicas y las fechas vuelven a mostrarse en español sin recargar la página

### AC-07 — Selección no persistente

- **Dado** que la persona usuaria ha seleccionado inglés
- **Cuando** recarga o abre de nuevo la aplicación
- **Entonces** el idioma activo vuelve a ser español
- **Y** no se recupera la selección anterior desde ningún mecanismo de persistencia

### AC-08 — Traducción de todos los estados

- **Dado** que la aplicación muestra el estado inicial, validación, carga, búsqueda sin resultados, error, resultados de localidades o información meteorológica
- **Cuando** la persona usuaria cambia el idioma
- **Entonces** los textos propios del estado que permanezca visible se presentan inmediatamente en el idioma elegido

### AC-09 — Uso accesible del selector

- **Dado** que la persona usuaria utiliza teclado o tecnología de asistencia
- **Cuando** localiza y acciona el selector de idioma
- **Entonces** cada opción tiene un nombre accesible, el idioma activo es perceptible programáticamente, el foco es visible y el control sigue un orden de navegación coherente
- **Y** el idioma declarado por el documento coincide con el idioma activo después de cada cambio

### AC-10 — Catálogos completos y equivalentes

- **Dado** cualquier texto propio disponible en español dentro del alcance de FEAT-001
- **Cuando** la interfaz se presenta en inglés
- **Entonces** existe y se muestra una traducción inglesa equivalente para ese mismo significado y estado
- **Y** la ausencia de una traducción no se oculta mediante una mezcla silenciosa de idiomas

### AC-11 — Idioma de las búsquedas de localidades

- **Dado** que español o inglés es el idioma activo
- **Cuando** la persona usuaria inicia una nueva búsqueda de localidades
- **Entonces** la búsqueda solicita a Open-Meteo los datos de localidad en ese idioma
- **Y** cambiar de idioma no repite automáticamente una búsqueda ya resuelta ni sustituye los nombres propios ya recibidos

### AC-12 — Formato numérico localizado

- **Dado** que hay valores meteorológicos numéricos visibles
- **Cuando** la persona usuaria cambia el idioma
- **Entonces** los separadores numéricos se actualizan según el idioma activo
- **Y** se conservan sin cambios el valor meteorológico y su unidad aprobada

### AC-13 — Conservación del contexto

- **Dado** que la persona usuaria ha escrito un término, obtenido resultados, elegido una localidad o mostrado información meteorológica
- **Cuando** cambia el idioma
- **Entonces** se conservan el término escrito, los resultados disponibles, la localidad seleccionada y los datos meteorológicos
- **Y** cambia únicamente su presentación lingüística y localizada

## Requisitos transversales aplicables

- Accesibilidad: el selector debe ser operable con teclado, comunicar programáticamente el idioma activo, conservar un foco perceptible y actualizar el idioma del documento; el cambio no debe impedir que las regiones vivas comuniquen en el idioma activo los estados de la aplicación.
- Responsive: el selector y sus dos opciones deben ser visibles y operables desde 320 px de ancho, sin solapamientos ni desplazamiento horizontal, y conservar el comportamiento responsive aprobado para FEAT-001.
- Internacionalización: español e inglés deben disponer de catálogos completos y equivalentes; los textos propios, condiciones meteorológicas, fechas y números deben responder al idioma activo sin recargar la aplicación.
- Carga, vacío y error: el cambio de idioma no introduce por sí mismo estados de carga o error; los estados ya visibles deben actualizar su texto de forma inmediata.

## Supuestos, riesgos y decisiones cerradas

- **Supuesto:** el alcance textual actual de la aplicación es el definido e implementado por FEAT-001; cualquier texto funcional nuevo requerirá mantener ambos catálogos equivalentes.
- **Riesgo:** una traducción ausente o una ruta de formateo fijada a un locale puede producir una interfaz parcialmente mezclada o una fecha en el idioma incorrecto.
- **Riesgo:** los nombres y divisiones administrativas devueltos por Open-Meteo pueden no tener traducción disponible o variar según el idioma solicitado al proveedor.
- **Decisión:** las búsquedas nuevas solicitan a Open-Meteo los nombres de localidad, división administrativa y país en el idioma activo; el cambio de idioma no repite automáticamente una búsqueda ya resuelta y conserva los nombres propios ya recibidos.
- **Decisión:** los valores numéricos usan los separadores del idioma activo y mantienen las mismas unidades y valores meteorológicos.
- **Decisión:** el cambio de idioma conserva el término escrito, los resultados de localidades, la localidad seleccionada y los datos meteorológicos visibles; únicamente cambia su presentación lingüística y localizada.
- **Decisión:** el selector mantiene siempre los endónimos «Español» y «English» para que cada opción sea reconocible por sus hablantes.
