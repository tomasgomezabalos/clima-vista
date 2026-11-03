# FEAT-017 — Contenido adaptable al texto ampliado en pantallas estrechas

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-017 («abre la spec, implementala y llévala hasta Validate… Implementalo todo»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento y sin commit ni push.

## Problema y resultado esperado

Una auditoría de accesibilidad del 2026-11-03 señaló un posible recorte del resumen del tiempo en 320 px. La medición posterior en el navegador integrado, con el tamaño de fuente raíz ampliado para emular el ajuste de tamaño de texto del sistema o del navegador, mostró que el problema es más amplio y que **no depende de la longitud de la temperatura**:

- A 320 px y con el texto al 100 % todo cabe, incluso una temperatura como «−42,3 °C».
- Con el texto al 150 % y al 200 %, en Inicio, los paneles del buscador, de los resultados, del tiempo actual y de la previsión se ensanchan más que la pantalla (hasta 469 px de ancho al 200 %) y sobresalen del panel o del viewport; como el contenedor de la aplicación oculta el desbordamiento, el contenido que queda fuera no se puede alcanzar con el desplazamiento.
- En Acerca de el contenido se sale 42 px al 200 %, y en la página 404 se sale 63 px al 150 % y 187 px al 200 %.
- Si el panel del tiempo se limitara al ancho disponible sin más cambios, el icono se comprimiría hasta unos 11 px.

Esto incumple WCAG 1.4.4 (cambio de tamaño del texto) y, en la combinación de pantalla estrecha y texto ampliado, 1.4.10. FEAT-015 corrigió la cabecera; esta feature cubre el contenido.

Resultado esperado: con el texto ampliado hasta el 200 % en pantallas desde 320 px de ancho, ningún contenido de Inicio, Acerca de ni la 404 sobresale de su bloque ni de la pantalla, sin ocultar información, y con el texto en tamaño normal la interfaz se ve igual que ahora.

## Alcance

- Inicio: buscador, resultados de búsqueda, mensajes de estado, tiempo actual (incluido su icono) y previsión.
- Acerca de y la página 404.
- Pantallas desde 320 px de ancho, texto al 150 % y al 200 %, en español, inglés e italiano.

## Fuera de alcance

- La cabecera (FEAT-015) y cualquier cambio de diseño con el texto en tamaño normal.
- Textos, colores, tipografías, comportamiento y marcado.
- Una verificación con el ajuste real de tamaño de texto de un dispositivo.

## Flujo principal

1. La persona abre la aplicación en una pantalla estrecha con el tamaño de texto ampliado.
2. Busca una localidad, elige una y ve el tiempo y la previsión.
3. Todo el contenido cabe en el ancho de la pantalla, con el texto envuelto en varias líneas cuando hace falta.

## Escenarios y criterios de aceptación

### AC-01 — Inicio con texto ampliado
- **Dado** un ancho de 320 px y de 375 px, con el texto al 150 % y al 200 %
- **Y** Inicio con resultados de búsqueda y con el tiempo y la previsión mostrados
- **Entonces** ningún elemento sobresale del viewport ni del panel que lo contiene.

### AC-02 — Acerca de y página 404 con texto ampliado
- **Dado** las mismas condiciones
- **Entonces** el contenido de Acerca de y de la página 404 no sobresale del viewport ni de su bloque.

### AC-03 — Idiomas
- **Dado** español, inglés e italiano
- **Entonces** se cumplen AC-01 y AC-02 en los tres idiomas.

### AC-04 — Sin ocultar información
- **Dado** el texto ampliado
- **Entonces** todo el texto sigue presente y legible, envuelto si es necesario, y el icono del tiempo conserva una anchura de al menos 100 px.

### AC-05 — Sin cambios con texto normal
- **Dado** el texto al 100 % y anchos de 320, 768 y 1280 px
- **Entonces** la posición y el tamaño de los bloques de Inicio coinciden con los previos al cambio, con una tolerancia de 1 px, salvo los que dependen de los datos meteorológicos.

### AC-06 — Sin regresión
- **Dado** el comportamiento actual
- **Entonces** la cabecera de FEAT-015, la búsqueda, el tiempo, la previsión, la navegación y `npm run check` se mantienen.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo (WCAG 1.4.4 y 1.4.10).
- Responsive: aplica; desde 320 px y sin cambios visibles en anchos mayores.
- Internacionalización: aplica a la comprobación en los tres idiomas; no cambian textos.
- Carga, vacío y error: los mensajes de estado y los paneles de error deben cumplir también AC-01.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** el texto ampliado se emuló cambiando el tamaño de fuente raíz, que es el comportamiento de `rem` ante el ajuste del navegador; no se probó con el ajuste real de un dispositivo.
- **Supuesto:** los desbordamientos se detectaron comparando los rectángulos de los elementos con el viewport y con su panel; no se inspeccionó visualmente cada caso.
- **Riesgo:** permitir que palabras largas se partan en cualquier punto puede dar saltos de línea poco elegantes, pero solo cuando no caben.
- **Riesgo:** los datos meteorológicos cambian entre mediciones y alteran algunas anchuras.
- **Abierta:** si el icono del tiempo debe tener un tamaño máximo menor en pantallas estrechas.
