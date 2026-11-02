# FEAT-011 — Recuperación ante un fallo de carga de página

**Estado:** APPROVED

**Fecha:** 2026-11-02

**Aprobación:** 2026-11-02, expresa en el chat por la persona responsable («Aprobar spec 011»); autoriza preparar el plan técnico, no la implementación.

## Problema y resultado esperado

Las páginas de la aplicación se descargan bajo demanda. Si la descarga de una página falla, por ejemplo porque se publicó una versión nueva con la pestaña abierta en la anterior o porque se perdió la conexión, la persona ve una pantalla en blanco: no hay mensaje, no hay navegación y no hay forma evidente de recuperarse salvo recargar a mano.

Comprobado el 2026-11-02 sobre un build de producción local (`vite preview`) con el archivo de la página «Acerca de» ausente del servidor: al pulsar «Acerca de» la URL cambia, el contenedor raíz queda vacío y la consola muestra `Failed to fetch dynamically imported module`. No se reprodujo con un despliegue real en Vercel.

Resultado esperado: cuando una página no puede cargarse, la persona ve un mensaje comprensible en su idioma, conserva la cabecera y puede recuperarse sin salir de la aplicación.

## Alcance

- Detectar el fallo de carga de cualquiera de las tres páginas (Inicio, Acerca de, No encontrada).
- Mostrar en la zona de contenido un mensaje de error y una acción para recargar la página actual, en lugar de la pantalla en blanco.
- Mantener visibles y operativas la navegación y el selector de idioma de la cabecera.
- Textos del mensaje y de la acción en español, inglés e italiano.
- Al navegar a otra página que sí carga, dejar de mostrar el mensaje.

## Fuera de alcance

- Registro o notificación de errores a servicios externos.
- Detección de versiones nuevas o recarga automática al desplegar.
- Reintentos automáticos de la descarga.
- Cambios en el estado de carga actual, en las páginas o en el selector de idioma.
- Errores de la API de Open-Meteo, que ya tienen tratamiento propio en la página de inicio.

## Flujo principal

1. La persona navega a una página cuyo código no puede descargarse.
2. En la zona de contenido aparece un mensaje de error con una acción para recargar; la cabecera sigue visible.
3. La persona pulsa la acción y la aplicación recarga la página actual.
4. Si el servidor ya sirve la versión vigente, la página se muestra con normalidad.

## Escenarios y criterios de aceptación

### AC-01 — Fallo al navegar a una página
- **Dado** que el código de una página no puede descargarse
- **Cuando** la persona navega a ella desde la cabecera
- **Entonces** se muestra un mensaje de error en lugar de una pantalla en blanco
- **Y** la navegación y el selector de idioma siguen visibles.

### AC-02 — Recuperación por recarga
- **Dado** que se muestra el mensaje de error
- **Cuando** la persona pulsa la acción de recargar
- **Entonces** se recarga la página actual y, si la descarga ya es posible, se muestra la página.

### AC-03 — Navegación posterior
- **Dado** que se muestra el mensaje de error
- **Cuando** la persona navega a otra página que sí puede cargarse
- **Entonces** el mensaje desaparece y se muestra esa página.

### AC-04 — Idioma
- **Dado** que se muestra el mensaje de error
- **Entonces** el mensaje y la acción aparecen en el idioma activo
- **Y** al cambiar el idioma con el selector, se actualizan sin perder el mensaje.

### AC-05 — Sin regresión
- **Dado** que todas las páginas cargan con normalidad
- **Entonces** el estado de carga actual y las páginas se comportan como hasta ahora.

## Requisitos transversales aplicables

- Accesibilidad: el mensaje debe ser perceptible para tecnologías de apoyo y la acción de recarga debe ser operable con teclado y tener nombre accesible.
- Responsive: el mensaje se adapta al ancho de la pantalla como el resto del contenido.
- Internacionalización: aplica a los tres idiomas (`es`, `en`, `it`).
- Carga, vacío y error: esta feature define el escenario de error de carga de página; el estado de carga actual no cambia.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** un fallo de carga de página es persistente para esa pestaña hasta recargar; recargar obtiene la versión vigente.
- **Riesgo:** si el navegador o la red sirven en caché un `index.html` antiguo, la recarga podría repetir el fallo. No comprobado.
- **Riesgo:** no se verificó el fallo con un despliegue real en Vercel, solo con un build local que simula la ausencia del archivo.
- **Decidido (2026-11-02):** el mensaje cubre solo fallos de descarga de páginas; los errores de renderizado quedan fuera de esta feature.
- **Decidido (2026-11-02):** la única acción es la recarga manual de la página actual; no hay reintento de la descarga sin recargar.
- **Decidido (2026-11-02):** textos propuestos, retocables en el plan técnico:

| Idioma | Mensaje | Detalle | Acción |
| --- | --- | --- | --- |
| `es` | No se pudo cargar esta página | Puede haber una versión nueva de la aplicación o haberse perdido la conexión. | Recargar |
| `en` | This page could not be loaded | A new version of the app may be available, or the connection may have been lost. | Reload |
| `it` | Impossibile caricare questa pagina | Potrebbe esserci una nuova versione dell'app o la connessione potrebbe essersi interrotta. | Ricarica |
