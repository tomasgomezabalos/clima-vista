# FEAT-003 — Incorporación del idioma italiano

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Problema y resultado esperado

La persona usuaria necesita consultar Clima Vista en italiano con el mismo alcance funcional y el mismo nivel de cobertura lingüística ya validados para español e inglés. La aplicación debe incorporar italiano como tercer idioma, permitir cambiar entre los tres idiomas sin recargar la página y conservar íntegramente el contexto meteorológico visible.

Esta feature es una ampliación incremental de FEAT-002 — Cambio de idioma, actualmente `VALIDATED`. Añade italiano al comportamiento aprobado, sin modificar retroactivamente la especificación ni el plan de FEAT-002 y sin cambiar los contratos ya validados para español e inglés.

## Alcance

- Incorporar únicamente italiano como tercer idioma disponible, además de español e inglés.
- Mostrar un selector de idioma con tres opciones identificables mediante los endónimos constantes «Español», «English» e «Italiano».
- Permitir cambiar dinámicamente entre español, inglés e italiano sin recargar la página.
- Traducir al italiano todos los textos propios de la interfaz, incluidos controles, encabezados, etiquetas, mensajes de validación, estados inicial, carga, vacío, error y éxito, textos de disponibilidad y nombres de condiciones meteorológicas.
- Formatear en italiano las fechas y los valores numéricos visibles, sin modificar los días representados, los valores meteorológicos ni sus unidades.
- Solicitar en italiano los datos de localidad de las búsquedas nuevas cuando Open-Meteo admita ese idioma, sujeto a la verificación pendiente de su contrato oficial.
- Mostrar sin alteración el nombre real devuelto por Open-Meteo cuando el proveedor no disponga de una traducción al italiano, sin inventar ni completar traducciones localmente.
- Conservar el término escrito, los resultados de localidades, la localidad seleccionada y los datos meteorológicos visibles al cambiar de idioma.
- No repetir automáticamente una búsqueda ya resuelta ni sustituir los nombres de localidad ya recibidos al cambiar de idioma.
- Mantener español como idioma predeterminado en cada inicio o recarga y mantener la selección solo durante la carga actual, sin persistencia.
- Mantener paridad estructural completa entre los catálogos español, inglés e italiano.
- Mantener actualizado el idioma declarado por el documento y exponer de forma accesible el idioma activo.
- Preservar el comportamiento funcional validado de FEAT-002 para español e inglés.

## Fuera de alcance

- Modificar retroactivamente la especificación, el plan, las evidencias o el estado de FEAT-002.
- Incorporar idiomas distintos de español, inglés e italiano.
- Detectar automáticamente el idioma del navegador, sistema operativo, ubicación o cualquier otra fuente.
- Persistir la selección de idioma en almacenamiento local, cookies, cuenta de usuario, URL, backend o cualquier otro mecanismo.
- Traducir automáticamente en tiempo de ejecución o utilizar servicios externos de traducción.
- Traducir localmente el término introducido, nombres propios, nombres de localidad o la marca «Clima Vista»; los datos geográficos pueden variar únicamente según la respuesta real de Open-Meteo.
- Modificar las unidades meteorológicas, los valores recibidos, la búsqueda, la selección de localidad, la consulta meteorológica o la previsión de siete días, salvo su presentación lingüística y localizada.
- Añadir backend, dependencias o nuevas funcionalidades meteorológicas.
- Preparar el plan técnico, crear o modificar ADR, implementar, instalar dependencias o modificar código, configuración, catálogos, mocks o pruebas durante esta etapa.

## Flujo principal

1. La persona usuaria abre o recarga la aplicación y la interfaz se presenta en español, con «Español» como opción activa.
2. Identifica un selector con las opciones «Español», «English» e «Italiano».
3. Selecciona «Italiano».
4. Sin recargar la página, los textos propios visibles, las condiciones meteorológicas, las fechas y los números pasan a presentarse en italiano.
5. El término escrito, los resultados, la localidad seleccionada y la información meteorológica visible permanecen disponibles, y el cambio no repite automáticamente una búsqueda ya resuelta.
6. Si inicia una búsqueda nueva con italiano activo, la aplicación solicita al proveedor los datos de localidad en italiano cuando el contrato de Open-Meteo verificado lo permita.
7. La aplicación muestra los nombres de localidad exactamente como los devuelve el proveedor cuando no existe una traducción disponible.
8. La persona usuaria puede cambiar después a «Español» o «English» con el mismo comportamiento dinámico y sin perder el contexto.
9. Si recarga la aplicación después de elegir italiano o inglés, el idioma activo vuelve a ser español.

## Escenarios y criterios de aceptación

### AC-01 — Español predeterminado con tres idiomas disponibles

- **Dado** que la persona usuaria inicia o recarga la aplicación
- **Cuando** se presenta cualquier estado inicial de la interfaz
- **Entonces** el idioma activo es español y los textos propios se muestran en español
- **Y** el selector identifica «Español» como opción activa
- **Y** no se recupera una selección anterior de italiano o inglés

### AC-02 — Selector visible con tres endónimos

- **Dado** que la persona usuaria se encuentra en cualquier estado de la aplicación
- **Cuando** consulta el selector de idioma
- **Entonces** encuentra exactamente tres opciones: «Español», «English» e «Italiano»
- **Y** los tres endónimos permanecen constantes con independencia del idioma activo
- **Y** puede reconocer visual y programáticamente cuál es la única opción activa

### AC-03 — Cambio dinámico a italiano

- **Dado** que el idioma activo es español o inglés
- **Cuando** la persona usuaria selecciona «Italiano»
- **Entonces** la interfaz pasa a italiano sin recargar la página
- **Y** todos los textos propios visibles se actualizan inmediatamente al italiano
- **Y** no se muestran claves internas ni textos propios en español o inglés mezclados con la interfaz italiana

### AC-04 — Textos propios y condiciones meteorológicas en italiano

- **Dado** que italiano es el idioma activo
- **Cuando** la aplicación presenta controles, encabezados, etiquetas, ayudas, resultados o información meteorológica
- **Entonces** todos los textos propios se muestran en italiano
- **Y** el nombre correspondiente a cada condición meteorológica conocida se muestra en italiano
- **Y** las condiciones desconocidas y los valores no disponibles también se comunican en italiano

### AC-05 — Estados completos en italiano

- **Dado** que la aplicación muestra un estado inicial, de validación, de carga, vacío, de error o de éxito
- **Cuando** italiano pasa a ser el idioma activo o el estado aparece mientras italiano ya está activo
- **Entonces** todos los textos propios de ese estado se presentan en italiano
- **Y** el cambio de idioma no altera el tipo de estado ni inicia por sí mismo una nueva carga

### AC-06 — Fechas localizadas en italiano

- **Dado** que hay fechas de previsión visibles
- **Cuando** italiano pasa a ser el idioma activo
- **Entonces** todas las fechas visibles se reformatean inmediatamente conforme al formato italiano previsto
- **Y** siguen representando exactamente los mismos días recibidos para la localidad seleccionada

### AC-07 — Números localizados en italiano

- **Dado** que hay valores meteorológicos numéricos visibles
- **Cuando** italiano pasa a ser el idioma activo
- **Entonces** los separadores y la representación numérica se actualizan conforme al formato italiano previsto
- **Y** se conservan sin cambios el valor meteorológico y su unidad aprobada

### AC-08 — Búsquedas nuevas localizadas en italiano

- **Dado** que italiano es el idioma activo y el contrato verificado de Open-Meteo admite solicitar datos de localidad en italiano
- **Cuando** la persona usuaria inicia una búsqueda nueva
- **Entonces** la solicitud utiliza el identificador de idioma italiano admitido por el proveedor
- **Y** los resultados muestran los nombres, el país y las divisiones administrativas tal como los devuelve Open-Meteo
- **Y** si un dato no está traducido al italiano, se muestra el valor real recibido sin inventar una traducción

### AC-09 — Ausencia de búsqueda automática al cambiar de idioma

- **Dado** que existe una búsqueda de localidades ya resuelta
- **Cuando** la persona usuaria cambia a italiano, español o inglés
- **Entonces** no se repite automáticamente esa búsqueda
- **Y** no se sustituyen los nombres propios ya recibidos
- **Y** una búsqueda iniciada posteriormente utiliza el idioma que esté activo en ese momento

### AC-10 — Conservación completa del contexto

- **Dado** que la persona usuaria ha escrito un término, obtenido resultados, seleccionado una localidad o mostrado datos meteorológicos
- **Cuando** cambia entre español, inglés e italiano
- **Entonces** se conservan el término escrito, los resultados disponibles, la localidad seleccionada y los datos meteorológicos visibles
- **Y** cambia únicamente la presentación lingüística y localizada del contenido propio

### AC-11 — Regreso a español o inglés sin regresiones

- **Dado** que la interfaz se muestra en italiano
- **Cuando** la persona usuaria selecciona «Español» o «English»
- **Entonces** la interfaz vuelve al idioma elegido sin recargar la página
- **Y** se mantienen los comportamientos, textos, formatos y garantías de conservación validados para ese idioma en FEAT-002

### AC-12 — Selección no persistente

- **Dado** que la persona usuaria ha seleccionado italiano o inglés
- **Cuando** recarga o abre de nuevo la aplicación
- **Entonces** el idioma activo vuelve a ser español
- **Y** no se recupera la selección anterior desde ningún mecanismo de persistencia

### AC-13 — Paridad estructural de los tres catálogos

- **Dado** cualquier clave de texto propio incluida en los catálogos de la aplicación
- **Cuando** se comparan los catálogos español, inglés e italiano
- **Entonces** los tres contienen exactamente la misma estructura y las mismas claves terminales
- **Y** cada clave dispone de contenido en los tres idiomas
- **Y** la ausencia de una traducción no se oculta mediante fallback cruzado o mezcla silenciosa de idiomas

### AC-14 — Uso accesible, teclado, idioma del documento y foco

- **Dado** que la persona usuaria utiliza teclado o tecnología de asistencia
- **Cuando** localiza y acciona cualquiera de las tres opciones del selector
- **Entonces** el control tiene un nombre accesible, cada opción es identificable y el idioma activo es perceptible programáticamente
- **Y** las tres opciones se pueden recorrer y accionar mediante interacciones estándar de teclado
- **Y** el foco es visible y permanece en la opción accionada después del cambio, salvo que la persona usuaria lo mueva
- **Y** el selector mantiene un orden de navegación coherente
- **Y** el idioma declarado por el documento identifica el idioma activo después de cada cambio, incluido italiano
- **Y** los estados comunicados por regiones vivas utilizan el idioma activo

### AC-15 — Selector responsive desde 320 px

- **Dado** un viewport de 320 px de ancho o superior
- **Cuando** se muestran las tres opciones del selector en cualquiera de los idiomas activos
- **Entonces** «Español», «English» e «Italiano» permanecen visibles, legibles y operables
- **Y** el selector no se solapa con otros controles, no recorta sus etiquetas y no provoca desplazamiento horizontal de la página
- **Y** se conserva el comportamiento responsive validado para el resto de la interfaz

## Requisitos transversales aplicables

- Accesibilidad: el selector debe ser operable con teclado, comunicar programáticamente una única opción activa, conservar foco visible y estable tras el cambio y actualizar el idioma del documento; los estados dinámicos deben comunicarse en el idioma activo.
- Responsive: las tres opciones deben permanecer visibles, legibles y operables desde 320 px, sin solapamientos, recortes ni desplazamiento horizontal.
- Internacionalización: español, inglés e italiano deben mantener catálogos completos y estructuralmente equivalentes; los textos propios, condiciones meteorológicas, fechas y números deben responder al idioma activo sin recarga, sin traducción automática en tiempo de ejecución y sin fallback cruzado que oculte ausencias.
- Carga, vacío y error: el cambio de idioma no crea por sí mismo una carga ni repite una búsqueda; los estados inicial, validación, carga, vacío, error y éxito ya visibles deben conservarse y actualizar inmediatamente sus textos propios.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** FEAT-002 permanece `VALIDATED` y sus contratos observables para español e inglés constituyen la base que esta feature amplía, no sustituye.
- **Supuesto:** el alcance textual que debe mantener paridad es el catálogo completo vigente al implementar FEAT-003; cualquier texto propio añadido dentro del alcance aprobado deberá existir también en los tres catálogos.
- **Supuesto técnico pendiente de validar:** se prevé utilizar `it` como identificador interno del italiano, pero su encaje con la normalización y el conjunto de idiomas soportados debe confirmarse durante el plan técnico.
- **Supuesto técnico pendiente de validar:** se prevé utilizar `it-IT` para el formato localizado de fechas y números, pero debe confirmarse frente al contrato actual de los formateadores y las capacidades del entorno objetivo durante el plan técnico.
- **Riesgo:** una clave ausente, un fallback cruzado o una ruta de formateo fijada a español o inglés puede producir una interfaz mezclada o un formato incorrecto; la paridad exacta entre los tres catálogos debe ser verificable.
- **Riesgo:** la traducción italiana puede ser formalmente completa pero resultar ambigua o inadecuada en contexto meteorológico; su corrección lingüística y contextual deberá formar parte de la validación.
- **Riesgo:** añadir una tercera opción puede desbordar o reducir la operabilidad del selector en viewports estrechos, especialmente a 320 px.
- **Riesgo:** los nombres y divisiones administrativas devueltos por Open-Meteo pueden no disponer de traducción italiana; la aplicación debe conservar el valor real recibido.
- **Abierta — contrato externo:** no está confirmado que Open-Meteo admita `language=it`. Antes de cerrar el plan técnico se debe verificar la documentación oficial vigente y, si fuera necesario, realizar una comprobación real controlada. La especificación no da por válida esa compatibilidad ni fija silenciosamente un valor alternativo.
- **Abierta — contrato de locale:** la correspondencia técnica entre idioma interno `it`, idioma del documento y locale de formato `it-IT` debe quedar verificada y documentada en el plan técnico sin alterar el resultado funcional aquí definido.
