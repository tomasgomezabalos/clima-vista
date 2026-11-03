# FEAT-013 — Título, foco y región principal por ruta

**Estado:** VALIDATED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-013 y FEAT-014 («crea las dos especificaciones, en draft, pero implementalas. Valídalas»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, sin commit ni push.

## Problema y resultado esperado

Una auditoría de accesibilidad (WCAG 2.2 AA) del 2026-11-03 y su verificación en el código detectaron tres carencias al navegar entre páginas:

1. El título del documento (`<title>`) es siempre «Clima Vista» en Inicio, Acerca de y la página 404, y no se traduce al cambiar de idioma. Quien usa tecnología de apoyo, el historial o las pestañas no puede distinguir la página (WCAG 2.4.2).
2. Al activar un enlace de navegación el foco permanece en ese enlace y el contenido cambia sin aviso (WCAG 2.4.3 y 4.1.3, como refuerzo).
3. Cada página declara su propio `<main>` y el layout no tiene ninguno: mientras se carga una página o si falla la carga, el indicador y el mensaje de error quedan fuera de cualquier región principal (WCAG 1.3.1).

Estas tres cuestiones figuraban como cuestiones abiertas, no incluidas, en FEAT-012.

Resultado esperado: cada página muestra un título propio y traducido; tras navegar entre rutas el foco se coloca al inicio del contenido de la nueva página; y el layout aporta una única región principal que contiene siempre el contenido, también durante la carga y ante un fallo de carga.

## Alcance

- Título del documento específico de cada página (Inicio, Acerca de, 404), traducido a es, en e it y actualizado al cambiar de idioma.
- Foco en la región principal tras cada cambio de ruta, sin moverlo en la carga inicial ni al cambiar de idioma.
- Una única región `<main>` en `AppLayout`; las páginas dejan de declararla.

## Fuera de alcance

- Cambios visuales; los estilos de las páginas se conservan.
- La `meta description` y el `<title>` estático de `index.html`, que siguen en español hasta que arranca la aplicación.
- Enlace «saltar al contenido», identificadores fijos, `aria-live` redundante, `aria-busy` y contrastes.
- Anuncio de resultados de búsqueda y del tiempo (FEAT-014).
- Cambios en rutas, en la navegación o en el selector de idioma.

## Flujo principal

1. La persona abre la aplicación o navega a otra página.
2. El título del documento pasa a describir la página mostrada, en el idioma activo.
3. Si la persona navegó desde dentro de la aplicación, el foco se sitúa en el contenido principal de la nueva página.
4. Si cambia de idioma, el título se actualiza y el foco no se mueve.

## Escenarios y criterios de aceptación

### AC-01 — Título por página
- **Dado** el idioma español
- **Cuando** se muestra Inicio, Acerca de o una ruta desconocida
- **Entonces** el título del documento es «El tiempo · Clima Vista», «Acerca de · Clima Vista» o «Página no encontrada · Clima Vista», respectivamente.

### AC-02 — Título traducido y reactivo al idioma
- **Dado** que se muestra una página
- **Cuando** la persona cambia el idioma a inglés o italiano
- **Entonces** el título pasa a la traducción de esa página en ese idioma
- **Y** el foco no se mueve.

### AC-03 — Foco tras navegar
- **Dado** que la persona está en una página de la aplicación
- **Cuando** activa un enlace a otra ruta o usa atrás/adelante del historial
- **Entonces** el foco queda en la región principal una vez cargado el layout, sin esperar a la página
- **Y** en la carga inicial de la aplicación el foco no se mueve.

### AC-04 — Región principal única y siempre presente
- **Dado** cualquier página, el indicador de carga de página o el fallback de fallo de carga
- **Entonces** hay exactamente una región `main` y contiene ese contenido
- **Y** ninguna página declara otra región `main`.

### AC-05 — Sin regresión
- **Dado** el comportamiento actual
- **Entonces** la navegación, la página activa, el selector de idioma, el estado de carga de página, la recuperación ante fallo de carga (FEAT-011), el foco del buscador (FEAT-012) y el aspecto visual de las páginas se mantienen.

## Requisitos transversales aplicables

- Accesibilidad: es el objetivo de la feature (WCAG 2.4.2, 2.4.3, 4.1.3 y 1.3.1). El foco programático en `main` no debe añadir una parada de tabulación.
- Responsive: no aplica; no cambia el diseño. La región `main` conserva el área y los estilos actuales.
- Internacionalización: aplica; los títulos se añaden a los tres idiomas.
- Carga, vacío y error: el `main` del layout debe contener el indicador de carga de página y el fallback de fallo de carga.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** el título cambia cuando se monta la página, es decir, después de cargar su fragmento; mientras tanto se mantiene el título de la página anterior.
- **Supuesto:** mover el foco a `main` (en lugar de al `h1`) es suficiente para situar al usuario al inicio del contenido.
- **Riesgo:** el foco programático puede mostrar el anillo de foco del navegador sobre toda la región principal; debe valorarse visualmente.
- **Riesgo:** no se verifica con un lector de pantalla real cómo se anuncia el cambio.
- **Abierta (no incluida):** título y foco durante la carga del fragmento de página.
