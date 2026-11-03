# FEAT-015 — Contraste del campo de búsqueda y cabecera adaptable al texto ampliado

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, expresa en el chat por la persona responsable («Aprobar spec»); autoriza preparar el plan técnico, no la implementación.

## Problema y resultado esperado

Una auditoría de accesibilidad (WCAG 2.2 AA) del 2026-11-03 dejó dos dudas que se midieron después y se confirmaron:

1. **Contraste del campo de búsqueda.** El borde del campo (`#3b536c`) tiene un contraste de aproximadamente 2,2:1 con el relleno del propio campo y entre 2,0:1 y 2,2:1 con la tarjeta que lo contiene. Como el relleno del campo y la tarjeta son casi iguales, el borde es la única señal visual del límite del campo. WCAG 1.4.11 exige al menos 3:1.
2. **Cabecera con texto ampliado.** Con el tamaño de texto del sistema o del navegador ampliado (medido al 150 % a 375 px y al 200 % por debajo de unos 500 px), el segundo enlace de navegación y el selector de idioma quedan fuera de la pantalla y no se pueden alcanzar con el desplazamiento, porque la cabecera no se reorganiza y el contenedor oculta el desbordamiento (WCAG 1.4.4 y 1.4.10). A 320 px con el texto normal sí cabe en es, en e it.

Estas dudas figuraban como «por verificar» en las auditorías; esta feature recoge solo lo confirmado.

Resultado esperado: el campo de búsqueda se distingue de su entorno con un contraste mínimo de 3:1 en todos sus estados, y la cabecera mantiene visibles y operables la navegación y el selector de idioma con el texto ampliado hasta el 200 %.

## Alcance

- Contraste mínimo de 3:1 del borde del campo de búsqueda con los colores adyacentes, en reposo, al pasar el ratón y en el estado de error.
- Cabecera que no recorta ni oculta la navegación ni el selector de idioma con el texto ampliado hasta el 200 %, en viewports desde 320 px de ancho y en los tres idiomas.

## Fuera de alcance

- Los textos pequeños de previsión y de tiempo actual, el placeholder y el resto de contrastes, que pasaron la medición.
- El borde del selector de idioma, porque el texto y el icono ya identifican el control.
- Cambios de diseño de la cabecera con el texto en tamaño normal.
- El foco en `main` durante la carga diferida de una página y el contorno de foco de `main` (cuestiones abiertas de FEAT-013).
- Otros cambios visuales, de textos o de comportamiento.

## Flujo principal

1. La persona abre la aplicación con un tamaño de texto ampliado en un dispositivo estrecho.
2. La cabecera muestra la navegación y el selector de idioma completos, reorganizándose si hace falta.
3. En Inicio, distingue el campo de búsqueda de la tarjeta por su borde.

## Escenarios y criterios de aceptación

### AC-01 — Contraste del borde del campo
- **Dado** el campo de búsqueda
- **Entonces** el contraste de su borde con el color adyacente es al menos 3:1 en reposo, al pasar el ratón y con el estado de error
- **Y** el estado con el foco mantiene un indicador perceptible.

### AC-02 — Cabecera con texto normal
- **Dado** un ancho de 320 px y el texto en tamaño normal, en es, en e it
- **Entonces** la navegación y el selector de idioma son visibles y operables sin desplazamiento horizontal
- **Y** el aspecto en anchos mayores no cambia.

### AC-03 — Cabecera con texto ampliado
- **Dado** el texto ampliado al 150 % y al 200 % con anchos desde 320 px, en es, en e it
- **Entonces** ambos enlaces y el selector de idioma son visibles y alcanzables sin recorte ni desplazamiento horizontal de la página.

### AC-04 — Sin regresión
- **Dado** el comportamiento actual
- **Entonces** la navegación, la página activa, el cambio de idioma, el foco del buscador (FEAT-012), los anuncios (FEAT-014), el título y el foco por ruta (FEAT-013) y el diseño del resto de la interfaz se mantienen.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo de la feature (WCAG 1.4.11, 1.4.4 y 1.4.10).
- Responsive: aplica; la cabecera debe adaptarse desde 320 px.
- Internacionalización: aplica a la comprobación de la cabecera en los tres idiomas; no se añaden ni cambian textos.
- Carga, vacío y error: no aplica; el estado de error del campo debe conservar su contraste.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** los contrastes proceden de un cálculo con los valores del código; el borde frente al relleno del campo no depende del fondo, pero el de la tarjeta se calculó con un fondo en el peor caso.
- **Supuesto:** el texto ampliado se emuló cambiando el tamaño de fuente raíz, que es el comportamiento de rem ante el ajuste de tamaño de texto del navegador; no se probó con el ajuste real de un dispositivo.
- **Riesgo:** subir el contraste del borde cambia el aspecto del campo; requiere aprobación del color.
- **Riesgo:** una cabecera que se reorganiza puede ocupar más altura y afectar al espaciado del contenido.
- **Abierta:** si el selector de idioma debe seguir siempre a la derecha o puede pasar a una segunda línea.
