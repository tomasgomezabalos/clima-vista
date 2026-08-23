# FEAT-006 — Selector de idioma compacto en la cabecera

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Problema y resultado esperado

En viewports móviles, la navegación y el selector de idioma ocupan más ancho del disponible y el selector pasa a una segunda línea de la cabecera. Esta distribución rompe la alineación visual y dedica demasiado espacio vertical a controles globales.

La persona usuaria necesita una cabecera compacta, equilibrada y consistente en la que la navegación permanezca a la izquierda y el idioma se pueda consultar y cambiar desde un selector situado al extremo derecho de la misma fila, tanto en móvil como en escritorio.

Esta feature propone actualizar únicamente la presentación del selector validado en FEAT-002, FEAT-003 y FEAT-004. Los idiomas disponibles y su comportamiento se mantienen; una vez validada FEAT-006, su presentación compacta sustituirá al grupo de opciones visibles simultáneamente definido anteriormente, sin modificar retroactivamente los artefactos históricos.

## Alcance

- Mantener la navegación y el selector de idioma como dos controles separados dentro de una única fila de la cabecera compartida.
- Alinear la navegación al inicio de la fila y el selector de idioma al extremo derecho.
- Sustituir los tres botones de idioma visibles simultáneamente por un único selector compacto.
- Mostrar en el estado cerrado un icono de globo, el código del idioma activo —`ES`, `EN` o `IT`— y una indicación visual de que el control se puede desplegar.
- Presentar al abrir el control la interfaz de selección nativa ofrecida por el navegador o el sistema operativo.
- Mostrar en la lista exactamente las opciones «Español», «English» e «Italiano», conservando sus endónimos con independencia del idioma activo.
- Identificar visual y programáticamente el idioma seleccionado.
- Mantener el mismo patrón de selector compacto en móvil y escritorio.
- Mantener la cabecera operativa, sin solapamientos ni desplazamiento horizontal, desde 320 px y verificar específicamente 320 px, 360 px, 768 px y 1280 px.
- Conservar los comportamientos lingüísticos, de navegación y de estado ya validados.

## Fuera de alcance

- Incorporar, retirar o renombrar idiomas.
- Cambiar el idioma predeterminado, detectar automáticamente el idioma o persistir la selección.
- Modificar traducciones, formatos de fechas o números, condiciones meteorológicas o parámetros de las consultas a Open-Meteo.
- Repetir búsquedas, descartar resultados o alterar el contexto visible como consecuencia del cambio de idioma.
- Sustituir el selector nativo por un menú personalizado, modal, panel inferior o conjunto de botones adaptativo.
- Utilizar banderas para representar idiomas.
- Unificar la navegación y el selector de idioma en un único control segmentado.
- Cambiar rutas, contenido de páginas, estados de carga o el comportamiento de la navegación.
- Rediseñar la cabecera fuera de los ajustes necesarios para mantener ambos controles en una sola fila.
- Cambiar colores, tipografía o identidad visual general de la aplicación.

## Flujo principal

1. La persona usuaria accede a cualquier página de Clima Vista.
2. Encuentra la navegación al inicio de la cabecera y el selector compacto en el extremo derecho de la misma fila.
3. El selector cerrado muestra el código correspondiente al idioma activo.
4. La persona usuaria abre el selector y el navegador o sistema operativo presenta las opciones nativas «Español», «English» e «Italiano».
5. Selecciona otro idioma.
6. La interfaz se actualiza al idioma elegido sin recargar la página y el selector cerrado muestra el nuevo código activo.

## Escenarios y criterios de aceptación

### AC-01 — Cabecera en una única fila

- **Dado** que la aplicación muestra cualquier página o estado de carga compartido
- **Cuando** se presenta la cabecera
- **Entonces** la navegación y el selector de idioma aparecen como dos controles separados en una única fila
- **Y** la navegación queda alineada al inicio y el selector al extremo derecho
- **Y** el selector no pasa a una segunda línea

### AC-02 — Estado compacto e idioma activo

- **Dado** que español, inglés o italiano es el idioma activo
- **Cuando** el selector permanece cerrado
- **Entonces** muestra un icono de globo, una indicación de despliegue y, respectivamente, el código `ES`, `EN` o `IT`
- **Y** el código visible coincide con la única opción seleccionada programáticamente

### AC-03 — Selección nativa con endónimos

- **Dado** que la persona usuaria localiza el selector compacto
- **Cuando** lo abre mediante una interacción admitida por su dispositivo
- **Entonces** el navegador o sistema operativo presenta su interfaz nativa de selección
- **Y** ofrece exactamente «Español», «English» e «Italiano»
- **Y** identifica cuál de las tres opciones está seleccionada

### AC-04 — Cambio de idioma sin recarga

- **Dado** que la persona usuaria abre el selector
- **Cuando** selecciona un idioma distinto del activo
- **Entonces** la interfaz cambia al idioma elegido sin recargar el documento
- **Y** el selector cerrado actualiza inmediatamente el código visible
- **Y** el idioma declarado por el documento coincide con la nueva selección

### AC-05 — Conservación del contexto y las consultas

- **Dado** que existe un término escrito, resultados, una localidad seleccionada o información meteorológica visible
- **Cuando** la persona usuaria cambia el idioma desde el selector compacto
- **Entonces** se conservan el término, los resultados, la localidad y los datos meteorológicos
- **Y** el cambio no repite automáticamente una búsqueda ya resuelta
- **Y** una búsqueda posterior utiliza el idioma activo conforme a los contratos validados

### AC-06 — Disponibilidad global

- **Dado** que la persona usuaria se encuentra en `/`, `/acerca-de`, una ruta no encontrada o un estado de carga de página
- **Cuando** consulta la cabecera compartida
- **Entonces** el selector compacto permanece visible y operativo
- **Y** conserva el idioma activo al navegar durante la carga actual de la aplicación

### AC-07 — Uso accesible

- **Dado** que la persona usuaria utiliza teclado o tecnología de asistencia
- **Cuando** localiza, abre y acciona el selector
- **Entonces** el control comunica de forma comprensible que permite seleccionar el idioma
- **Y** cada opción dispone de su endónimo completo y la opción activa es perceptible programáticamente
- **Y** las interacciones estándar, el orden de navegación y el comportamiento nativo del dispositivo permanecen disponibles
- **Y** el foco es visible antes y después del cambio mientras la persona usuaria no lo mueva

### AC-08 — Comportamiento responsive en los tres idiomas

- **Dado** un viewport de 320 px, 360 px, 768 px o 1280 px y cualquiera de los tres idiomas activos
- **Cuando** se presentan la navegación y el selector compacto
- **Entonces** ambos permanecen en una única fila y conservan etiquetas y áreas de interacción operables
- **Y** no se solapan, recortan ni provocan desplazamiento horizontal de la página
- **Y** la cabecera y el contenido conservan su orden y alineación visual

### AC-09 — Regresión de navegación e internacionalización

- **Dado** que FEAT-002, FEAT-003, FEAT-004 y FEAT-005 permanecen validadas
- **Cuando** la persona usuaria cambia de idioma, navega entre páginas o utiliza Atrás y Adelante
- **Entonces** se conservan sus comportamientos validados de traducción, formato, navegación, página activa, carga, acceso directo y alineación de contenido
- **Y** el único cambio funcional observable es la forma de presentar y accionar el selector de idioma

## Requisitos transversales aplicables

- Accesibilidad: el selector debe conservar semántica nativa, nombre comprensible, opción activa programática, operación estándar mediante teclado y dispositivo, foco perceptible y actualización coherente del idioma del documento. El icono de globo y el código visible no sustituyen los endónimos completos accesibles.
- Responsive: la navegación y el selector deben permanecer separados y en una única fila desde 320 px, en español, inglés e italiano, sin reducir su operabilidad ni producir solapamientos, recortes o desplazamiento horizontal; se verificará a 320 px, 360 px, 768 px y 1280 px, además del reflow equivalente con zoom al 200 %.
- Internacionalización: no se añaden idiomas ni traducciones funcionales. Los endónimos permanecen constantes y los códigos visibles se corresponden con el idioma activo; se conservan los contratos lingüísticos validados.
- Carga, vacío y error: el cambio de presentación no crea nuevos estados. El selector debe permanecer visible y operativo durante la carga de páginas y mantener el comportamiento vigente en los estados inicial, validación, carga, vacío, error y éxito.

## Supuestos, riesgos y cuestiones abiertas

- **Decisión:** los códigos visibles son `ES` para español, `EN` para inglés e `IT` para italiano.
- **Decisión:** el estado cerrado incluye un icono de globo y una indicación de despliegue; su representación gráfica exacta se resolverá sin utilizar banderas y deberá conservar el significado, la coherencia visual y la accesibilidad acordados.
- **Riesgo:** la interfaz nativa abierta puede variar visualmente entre navegadores y sistemas operativos; esta variación es deliberada y no debe sustituirse por una recreación personalizada.
- **Riesgo:** las etiquetas traducidas de navegación tienen longitudes distintas y podrían competir por el espacio disponible a 320 px; el plan técnico deberá verificar los tres idiomas sin ocultar contenido ni reducir la operabilidad de los controles.
- **Riesgo:** los códigos de dos letras son menos descriptivos que los endónimos completos; el nombre accesible del control y las opciones abiertas deben comunicar siempre los idiomas completos.
- **Decisión:** se utilizará el mismo selector compacto en todos los viewports, sin mantener los botones actuales en escritorio.
- **Decisión:** navegación y selector seguirán siendo controles separados y permanecerán en una única fila, con el selector alineado al extremo derecho.
