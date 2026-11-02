# FEAT-012 — Foco del buscador al usar el teclado

**Estado:** VALIDATED

**Fecha:** 2026-11-02

**Aprobación:** 2026-11-02, expresa en el chat por la persona responsable («Aprobar spec 012»); autoriza preparar el plan técnico, no la implementación.

## Problema y resultado esperado

Al activar el botón «Buscar» con el teclado, el botón se deshabilita mientras dura la búsqueda y el foco pasa al documento (`body`). El foco no vuelve al botón cuando la búsqueda termina. Una persona que navega solo con teclado o con tecnología de apoyo pierde su posición en la página y debe volver a recorrerla desde el principio para continuar.

Comprobado el 2026-11-02 en el navegador integrado, con el servidor de desarrollo y una petición real a Open-Meteo: con el foco en el botón y el término `carga lenta`, al pulsar Enter el botón quedó deshabilitado, el elemento activo pasó a ser `BODY` y seguía siéndolo tras terminar la búsqueda y rehabilitarse el botón. No se probó con un lector de pantalla real.

Esto contradice el requisito de FEAT-001 (VALIDATED) de que el buscador sea utilizable con teclado y con un orden de foco coherente (AC-09).

Resultado esperado: tras activar «Buscar» con el teclado, el foco permanece en el botón durante y después de la búsqueda, sin permitir envíos duplicados.

## Alcance

- Mantener el foco en el botón «Buscar» cuando se activa con Enter o con la barra espaciadora.
- Impedir que, mientras hay una búsqueda en curso, una nueva activación lance otra petición.
- Seguir comunicando a las tecnologías de apoyo y visualmente que el botón no está disponible mientras dura la búsqueda.

## Fuera de alcance

- Cambios en el diseño visual del buscador, de los resultados o de la información meteorológica.
- Cambios en la validación, en los textos o en los idiomas.
- El resto de mejoras de accesibilidad propuestas por la revisión de código; quedan como cuestiones abiertas y no forman parte de esta feature salvo decisión expresa.

## Flujo principal

1. La persona escribe un término válido y llega al botón «Buscar» con el teclado.
2. Activa el botón con Enter o con la barra espaciadora.
3. Mientras se busca, el botón indica que no está disponible y el foco sigue en él.
4. Al terminar la búsqueda, el foco sigue en el botón y la persona puede continuar con el teclado.

## Escenarios y criterios de aceptación

### AC-01 — Foco tras activar el botón
- **Dado** que el foco está en el botón «Buscar» y el término es válido
- **Cuando** la persona lo activa con Enter o con la barra espaciadora
- **Entonces** el foco permanece en el botón durante la búsqueda
- **Y** sigue en el botón cuando la búsqueda termina, con resultados, sin ellos o con error.

### AC-02 — Sin envíos duplicados
- **Dado** que hay una búsqueda en curso
- **Cuando** la persona vuelve a activar el botón, con teclado o con ratón
- **Entonces** no se lanza otra petición de búsqueda.

### AC-03 — Estado no disponible
- **Dado** que hay una búsqueda en curso
- **Entonces** el botón se presenta como no disponible, visualmente y para las tecnologías de apoyo
- **Y** vuelve a presentarse como disponible cuando la búsqueda termina.

### AC-04 — Envío con Enter desde el campo
- **Dado** que el foco está en el campo de búsqueda
- **Cuando** la persona pulsa Enter con un término válido
- **Entonces** se lanza la búsqueda y el foco permanece en el campo, como hasta ahora.

### AC-05 — Sin regresión
- **Dado** el flujo actual de búsqueda
- **Entonces** la validación de dos caracteres como mínimo, los estados de carga, vacío y error, y la selección de resultados se comportan como hasta ahora.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo de la feature; el foco debe ser perceptible y el orden de navegación coherente.
- Responsive: no aplica; no cambia el diseño.
- Internacionalización: no aplica; no se añaden ni cambian textos.
- Carga, vacío y error: el foco debe permanecer en el botón en los tres desenlaces de la búsqueda.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** solo se exige el comportamiento con teclado; el efecto con ratón no se evaluó.
- **Riesgo:** no se verificó con un lector de pantalla real cómo se anuncia el estado no disponible.
- **Riesgo:** el cambio afecta al botón de envío y a la guarda contra envíos duplicados; hay que comprobar que no cambia el comportamiento de los estados de carga y error de FEAT-001.
- **Abierta (no incluida por defecto):** título de la página por ruta. Hoy `<title>` es siempre «Clima Vista» y no cambia al navegar ni al cambiar de idioma.
- **Abierta (no incluida por defecto):** región `<main>` común. Cada página declara su propio `<main>` y el layout no tiene ninguno, de modo que mientras carga una página el indicador de carga queda fuera de cualquier `<main>`.
- **Abierta (no incluida por defecto):** identificadores fijos como `forecast-title` y `current-weather-title`. Solo hay una instancia de cada uno, así que no colisionan hoy.
- **Abierta (no incluida por defecto):** `aria-live` redundante junto a `role` en el mensaje de estado, y `aria-busy` junto a `role="status"` en el indicador de carga. No se verificó su efecto real en lectores de pantalla.
