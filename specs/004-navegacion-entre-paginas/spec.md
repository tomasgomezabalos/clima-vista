# FEAT-004 — Navegación entre páginas

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Problema y resultado esperado

La persona usuaria necesita desplazarse entre la consulta meteorológica y una página informativa de Clima Vista dentro de la misma aplicación, mediante URL identificables y sin recargar el documento completo. La aplicación debe solicitar los recursos exclusivos de cada página solo cuando sean necesarios y comunicar de forma accesible cualquier espera durante su carga.

## Alcance

- Mantener la consulta meteorológica vigente como página principal en la ruta `/`.
- Incorporar una página estática «Acerca de» en la ruta `/acerca-de`, con una explicación breve del propósito y las capacidades actuales de Clima Vista.
- Ofrecer una navegación compartida y visible entre la página principal y «Acerca de».
- Identificar de forma perceptible y accesible qué página de la navegación está activa.
- Cambiar de página dentro de la aplicación sin recargar el documento completo.
- Permitir utilizar los controles Atrás y Adelante del navegador para recorrer las páginas visitadas.
- Permitir acceder directamente a `/` y `/acerca-de` mediante su URL.
- Mostrar una página «No encontrada» ante una ruta desconocida y ofrecer desde ella un enlace de regreso a la página principal.
- Solicitar los recursos exclusivos de cada página solo cuando esa página se necesite por primera vez durante la carga actual de la aplicación.
- Mostrar un estado de carga visible y accesible en la región de contenido mientras la página solicitada todavía no esté disponible, manteniendo operativa la navegación compartida.
- Reutilizar durante la misma carga de la aplicación los recursos de una página ya visitada, sin volver a solicitar innecesariamente los mismos recursos exclusivos al regresar a ella.
- Mantener disponibles el selector de idioma y la navegación en español, inglés e italiano en todas las páginas y estados incluidos.
- Reiniciar la consulta meteorológica al abandonar la página principal y volver posteriormente a ella, sin persistir el término, los resultados, la localidad seleccionada ni los datos meteorológicos anteriores.

## Fuera de alcance

- Rutas dinámicas, rutas anidadas adicionales o parámetros de ruta.
- Autenticación, autorización o rutas protegidas.
- Persistencia del estado de la consulta meteorológica entre páginas o después de recargar.
- Precarga de páginas que todavía no hayan sido solicitadas por la persona usuaria.
- Carga de datos asociada a la navegación, envío de formularios gestionado por rutas o nuevas consultas remotas.
- Renderizado en servidor o generación estática de páginas.
- Incorporación de backend propio o cambios en los contratos con Open-Meteo.
- Recuperación específica ante un fallo de red durante la descarga de los recursos de una página.
- Cambios funcionales en la búsqueda, selección de localidad, tiempo actual, previsión meteorológica o cambio de idioma, salvo su integración en la navegación compartida.

## Flujo principal

1. La persona usuaria accede a `/` y encuentra la consulta meteorológica y la navegación compartida.
2. Selecciona el enlace «Acerca de».
3. Mientras la página todavía no está disponible, la aplicación muestra un estado de carga en la región de contenido y mantiene visible la navegación.
4. La aplicación presenta la página «Acerca de» sin recargar el documento completo y la identifica como página activa.
5. La persona usuaria utiliza la navegación o el botón Atrás del navegador para regresar a `/`.
6. La aplicación presenta de nuevo la consulta meteorológica en su estado inicial.

## Escenarios y criterios de aceptación

### AC-01 — Página principal identificable

- **Dado** que la persona usuaria accede a `/`
- **Cuando** la página termina de cargarse
- **Entonces** encuentra la consulta meteorológica vigente y una navegación con enlaces identificables a la página principal y a «Acerca de»
- **Y** la navegación identifica la página principal como activa sin depender exclusivamente del color

### AC-02 — Navegación a «Acerca de» sin recarga

- **Dado** que la persona usuaria se encuentra en `/`
- **Cuando** activa el enlace «Acerca de»
- **Entonces** la URL pasa a `/acerca-de` y se presenta la página informativa sin recargar el documento completo
- **Y** la navegación identifica «Acerca de» como página activa

### AC-03 — Contenido de «Acerca de»

- **Dado** que la persona usuaria accede a `/acerca-de`
- **Cuando** la página está disponible
- **Entonces** puede identificar la marca Clima Vista y una explicación breve de que la aplicación permite consultar el tiempo actual y la previsión de siete días por localidad
- **Y** no se inicia ninguna consulta nueva a Open-Meteo por mostrar esta página

### AC-04 — Recursos solicitados bajo demanda

- **Dado** que la persona usuaria inicia una carga de la aplicación en una ruta válida
- **Cuando** todavía no ha visitado las demás páginas
- **Entonces** no se solicitan los recursos exclusivos de esas páginas no visitadas
- **Y** los recursos exclusivos de una página se solicitan cuando esa página se necesita por primera vez

### AC-05 — Estado de carga de una página

- **Dado** que la persona usuaria solicita una página cuyos recursos todavía no están disponibles
- **Cuando** la carga continúa pendiente
- **Entonces** la región de contenido muestra un mensaje de carga visible y anunciado de forma no intrusiva por tecnología de asistencia
- **Y** la navegación compartida y el selector de idioma permanecen visibles y operativos
- **Y** la aplicación sustituye el estado de carga por la página solicitada cuando esta queda disponible

### AC-06 — Reutilización de una página visitada

- **Dado** que una página ya se ha cargado durante la sesión actual de la aplicación
- **Cuando** la persona usuaria abandona esa página y vuelve posteriormente a ella
- **Entonces** la aplicación reutiliza sus recursos ya obtenidos y no vuelve a solicitar innecesariamente los mismos recursos exclusivos

### AC-07 — Historial del navegador

- **Dado** que la persona usuaria ha navegado entre `/` y `/acerca-de`
- **Cuando** utiliza los controles Atrás o Adelante del navegador
- **Entonces** se muestra la página correspondiente a cada entrada del historial sin recargar el documento completo
- **Y** la indicación de página activa se actualiza de forma coherente

### AC-08 — Acceso directo

- **Dado** que la persona usuaria introduce directamente una URL válida de la aplicación
- **Cuando** accede a `/` o `/acerca-de` en un entorno compatible con la SPA
- **Entonces** se muestra la página correspondiente sin tener que pasar primero por otra ruta

### AC-09 — Ruta desconocida

- **Dado** que la persona usuaria accede a una ruta no reconocida
- **Cuando** la aplicación resuelve la navegación
- **Entonces** muestra una página «No encontrada» comprensible
- **Y** ofrece un enlace accesible que permite regresar a `/` sin recargar el documento completo

### AC-10 — Idioma coherente entre páginas

- **Dado** que la persona usuaria ha seleccionado español, inglés o italiano
- **Cuando** navega entre la página principal, «Acerca de» y «No encontrada»
- **Entonces** la navegación, el estado de carga y los textos propios de cada página se muestran en el idioma activo
- **Y** el selector de idioma permanece disponible y conserva la selección durante la carga actual de la aplicación
- **Y** el idioma declarado por el documento continúa correspondiéndose con la opción activa

### AC-11 — Reinicio de la consulta al regresar

- **Dado** que la persona usuaria ha introducido un término, obtenido resultados o seleccionado una localidad en `/`
- **Cuando** navega a otra página y regresa posteriormente a `/`
- **Entonces** la consulta meteorológica vuelve a su estado inicial
- **Y** no se muestran como vigentes el término, los resultados, la localidad ni los datos meteorológicos anteriores

### AC-12 — Navegación accesible y responsive

- **Dado** que la aplicación muestra cualquiera de las páginas o el estado de carga
- **Cuando** la persona usuaria navega con teclado, tecnología de asistencia o un viewport admitido
- **Entonces** los enlaces tienen nombres comprensibles, el foco es perceptible, el orden de navegación es coherente y la página activa no se comunica únicamente mediante color
- **Y** la navegación, el selector de idioma, el estado de carga y el contenido permanecen operativos y sin desplazamiento horizontal de la página desde 320 px de ancho

### AC-13 — Regresión de las funcionalidades vigentes

- **Dado** que la persona usuaria permanece en la página principal
- **Cuando** busca una localidad, selecciona un resultado, consulta el tiempo o cambia el idioma
- **Entonces** se conservan los comportamientos aprobados y validados de FEAT-001, FEAT-002 y FEAT-003, excepto el reinicio expresamente definido al abandonar y volver a `/`

## Requisitos transversales aplicables

- Accesibilidad: la navegación debe tener propósito identificable; los enlaces deben ser operables con teclado, mostrar foco perceptible e identificar la página activa de forma accesible; el estado de carga debe comunicarse sin bloquear ni retirar la navegación compartida.
- Responsive: la navegación, el selector de idioma, el estado de carga y todas las páginas deben ser operativos desde 320 px, adaptarse de forma fluida y verificarse específicamente a 320 px, 360 px, 768 px y 1280 px, sin solapamientos ni desplazamiento horizontal de la página.
- Internacionalización: todos los textos nuevos deben obtenerse mediante el sistema de internacionalización y estar disponibles en español, inglés e italiano; el idioma activo y el idioma declarado por el documento deben mantenerse al navegar.
- Carga, vacío y error: debe existir un estado de carga de página diferenciado y accesible; no se introduce un estado vacío nuevo; las rutas desconocidas deben mostrar «No encontrada»; la recuperación específica ante fallos de descarga queda fuera del alcance de esta feature.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** el entorno utilizado para servir la aplicación permite resolver las URL válidas de la SPA mediante el documento de entrada; este comportamiento deberá confirmarse antes del plan técnico.
- **Supuesto:** «Acerca de» contiene únicamente información estática sobre el propósito y las capacidades ya existentes de Clima Vista.
- **Riesgo:** una configuración de alojamiento sin resolución de rutas de SPA puede devolver un error al acceder o recargar directamente `/acerca-de`.
- **Riesgo:** el estado de carga puede ser demasiado breve para observarse en una conexión rápida; deberá verificarse de forma determinista sin imponer una demora artificial en producción.
- **Riesgo:** los recursos compartidos entre páginas pueden agruparse de forma distinta según la construcción; la comprobación debe distinguirlos de los recursos exclusivos que esta feature exige cargar bajo demanda.
- **Decisión:** al abandonar y volver a `/`, la consulta meteorológica se reinicia; conservarla entre páginas requerirá una modificación de alcance posterior.
- **Decisión:** la precarga de páginas no visitadas se excluye para que el comportamiento bajo demanda sea verificable.
