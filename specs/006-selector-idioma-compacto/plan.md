# Plan técnico — FEAT-006 Selector de idioma compacto en la cabecera

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/006-selector-idioma-compacto/spec.md`, aprobada el 2026-08-23.
- Criterios cubiertos: AC-01 a AC-09.
- Alcance técnico: sustituir el grupo de tres botones de `LanguageSelector` por un selector nativo controlado con una presentación cerrada compacta; mantener navegación y selector en una única fila; adaptar las pruebas que dependen de la semántica anterior; preservar los contratos de idioma, navegación y contenido existentes.
- Fuera de alcance: idiomas, catálogos, persistencia, detección automática, formatos localizados, APIs, rutas, contenido, navegación, estados de página, dependencias, configuración, mocks y cualquier rediseño ajeno a la cabecera compartida.
- La aprobación de la especificación autoriza redactar este plan. La implementación requerirá la aprobación expresa posterior del plan y una orden expresa de implementar.

## Decisiones y diseño

### Patrón de componente

- Antes de implementar se cargará `@react-ts-feature-pattern` en modo `strict`, porque se modificará un componente React propio de TypeScript.
- `LanguageSelector` conservará su export nombrado, su carpeta y el contrato público definido en `types.ts`: recibirá el idioma efectivo y notificará un `SupportedLanguage` mediante `onLanguageChange`.
- No se añadirá un hook ni un componente auxiliar: el estado sigue perteneciendo a i18next a través de `AppLayout` y el selector solo adapta valor e interacción.
- Las tres opciones se mantendrán en una colección constante y tipada. Cada entrada incorporará el idioma, la clave del endónimo existente y el código visual `ES`, `EN` o `IT`.
- El cambio de valor validará el valor recibido contra las opciones soportadas antes de notificarlo. No se ampliará el dominio ni se aceptarán valores arbitrarios mediante una aserción no comprobada.

### Selector nativo con presentación compacta

- El elemento interactivo y accesible será un único `select` controlado por la propiedad `language`; sus `option` mostrarán los endónimos completos existentes: «Español», «English» e «Italiano».
- El `select` ocupará toda la superficie del control y conservará la interacción nativa del navegador o sistema operativo. Su nombre accesible procederá de `language.label`, igual que el selector vigente.
- La presentación cerrada visible se compondrá dentro del mismo control con un icono de globo decorativo, el código del idioma activo y un indicador de despliegue. Estos elementos no duplicarán el nombre anunciado por tecnología de asistencia.
- Para separar el código compacto de los textos completos de las opciones, la capa visual será independiente del texto que representa el `select`; el elemento nativo seguirá cubriendo la superficie completa y recibiendo puntero, teclado y foco.
- El contenedor reflejará `hover`, foco visible y estados de contraste sin retirar la semántica ni la operabilidad nativas. El foco se representará mediante `:focus-within` para que siga siendo visible aunque el elemento nativo transparente sea quien lo reciba.
- Se utilizarán gráficos locales en el propio markup o CSS, sin emoji dependiente de plataforma, banderas, librería de iconos ni recurso remoto.

### Geometría de la cabecera

- La medición de referencia en el navegador interno a 320 px muestra 288 px disponibles en `.app-layout__bar`, 201,8 px ocupados por la navegación española y 245,2 px por el selector vigente; la suma obliga actualmente al salto de línea.
- El selector compacto tendrá un ancho exterior de 4,5 rem (72 px). La separación horizontal de la cabecera será de 0,5 rem (8 px) en viewports estrechos. Con la navegación más ancha observada, la ocupación prevista es de 281,8 px dentro de los 288 px disponibles.
- `.app-layout__bar` dejará de permitir el salto de línea y conservará `justify-content: space-between`, de modo que navegación y selector permanezcan en extremos opuestos.
- No se modificarán `AppNavigation`, sus etiquetas ni sus áreas de interacción. La comprobación responsive determinará si la geometría aprobada se cumple; cualquier ajuste adicional de la navegación requerirá actualizar y volver a aprobar este plan.
- Desde 48 rem se conservarán los márgenes laterales vigentes. El selector mantendrá el mismo ancho y patrón visual en todos los viewports.

### Contratos preservados

- `useAppLayout` continuará siendo responsable de ejecutar `i18n.changeLanguage`; no cambia el flujo de datos.
- Los recursos de traducción existentes ya proporcionan el nombre accesible y los tres endónimos; no se modificarán los catálogos.
- Se mantienen el idioma inicial, la selección no persistente, `document.lang`, la conservación del contexto meteorológico, la ausencia de búsqueda automática y el idioma de búsquedas posteriores.
- El selector seguirá montado durante la carga de páginas y en todas las rutas porque no cambia su posición dentro de `AppLayout`.

### Deduplicación proporcional

- La colección de opciones continuará teniendo un único propietario en `LanguageSelector`; no se duplicarán correspondencias de idioma, endónimo o código entre JSX, estilos y pruebas.
- Los códigos visuales pertenecen al selector y no son locales de formato ni identificadores de proveedor; no se incorporarán a `src/i18n/languages.ts` para evitar mezclar responsabilidades.
- No se creará un componente genérico de select ni una abstracción global de iconos: no existe un segundo consumidor semánticamente equivalente que lo justifique.

### Alternativas descartadas

- Utilizar como texto visible cerrado el endónimo completo: incumpliría el ancho compacto acordado y volvería a competir con la navegación a 320 px.
- Crear un menú personalizado: duplicaría comportamiento nativo de selección, foco y teclado y contradiría la especificación aprobada.
- Mantener botones en escritorio mediante un breakpoint: introduciría dos patrones y contradiría el diseño uniforme aprobado.
- Reducir o abreviar las etiquetas de navegación: alteraría contenido y navegación fuera del alcance.
- Representar idiomas mediante banderas: asociaría idiomas a países y está expresamente excluido.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/components/LanguageSelector/index.tsx` | Sustituir los botones por el selector nativo controlado, opciones con endónimos, capa compacta con globo/código/indicador y validación del valor emitido. | AC-02 a AC-07 |
| `src/components/LanguageSelector/styles.scss` | Definir el control de 4,5 rem, superposición interactiva nativa, estados visuales, foco perceptible y gráficos compactos. | AC-01 a AC-03, AC-07, AC-08 |
| `src/layouts/AppLayout/styles.scss` | Impedir el salto de línea y ajustar la separación horizontal estrecha a 0,5 rem, preservando ancho y márgenes existentes. | AC-01, AC-06, AC-08 |
| `tests/components/LanguageSelector/index.test.tsx` | Sustituir expectativas de grupo/botones por semántica de combobox, opciones, valor activo, selección nativa, callback y foco. | AC-02 a AC-04, AC-07 |
| `tests/layouts/AppLayout/index.test.tsx` | Adaptar la interacción durante carga al selector nativo y verificar que continúa disponible y actualiza idioma y `document.lang`. | AC-04, AC-06, AC-09 |
| `tests/app/App/index.test.tsx` | Adaptar los cambios de idioma integrados a la semántica del selector nativo y conservar navegación, ruta activa e idioma. | AC-04, AC-06, AC-09 |
| `tests/pages/Home/index.test.tsx` | Adaptar las interacciones de idioma existentes sin alterar su matriz de estado, conservación de contexto ni contratos de consulta. | AC-04, AC-05, AC-09 |
| `specs/006-selector-idioma-compacto/spec.md` | Registrar estado de implementación únicamente cuando exista autorización y evidencia suficiente. | Trazabilidad SDD |
| `specs/006-selector-idioma-compacto/plan.md` | Registrar decisiones, comprobaciones y estado final de implementación. | AC-01 a AC-09 |

No se prevén cambios en `LanguageSelector/types.ts`, `AppLayout/index.tsx`, `useAppLayout.ts`, `AppNavigation`, catálogos, servicios, mocks, rutas, dependencias ni configuración.

## Dependencias e instalaciones

- Ninguna dependencia nueva.
- No se ejecutará `npm install` ni se modificará `package.json` o `package-lock.json`.
- La validación utilizará Node `22.22.0`, fijado en `.nvmrc` y admitido por `package.json`.

## Estrategia de pruebas

- Componente: con Vitest, React Testing Library y `user-event`, localizar el control por rol `combobox` y nombre accesible; comprobar exactamente tres opciones con endónimos, valor inicial, selección de inglés e italiano, callback tipado, actualización al rerenderizar y foco estable.
- Integración de layout: durante una carga diferida, comprobar que navegación y combobox permanecen montados; cambiar a inglés mediante selección nativa y verificar navegación traducida, estado de carga y `document.lang`.
- Regresión de aplicación y Home: conservar las expectativas existentes sobre navegación, cambio dinámico, idioma del documento, formatos, búsquedas posteriores y ausencia de repetición automática, sustituyendo únicamente la interacción antigua con botones.
- Estilos: no se afirmará geometría desde JSDOM. Se verificará en navegador real mediante rectángulos y anchos calculados.
- Responsive: en 320 px, 360 px, 768 px y 1280 px, y para español, inglés e italiano, medir `.app-layout__bar`, `.app-navigation` y `.language-selector`; navegación y selector deben compartir coordenadas verticales, permanecer dentro de la cabecera y no producir `scrollWidth` superior a `clientWidth` en la página.
- Selector nativo: comprobar que la superficie completa abre el selector, que se muestran los tres endónimos, que la opción actual aparece seleccionada y que el control puede accionarse con puntero y teclado estándar. La apariencia de la lista abierta puede variar por plataforma.
- Foco y contraste: comprobar foco visible antes y después de cambiar el idioma, estados hover/focus y legibilidad del icono, código e indicador sobre el fondo vigente; revisar también `forced-colors` cuando el navegador lo permita.
- Zoom: comprobar reflow equivalente al 200 % sin recortes ni desplazamiento horizontal. Si no es posible controlar zoom real, registrar la equivalencia utilizada y dejar la comprobación manual explícitamente pendiente.
- Rutas y estados: verificar `/`, `/acerca-de`, una ruta desconocida y el fallback de carga; el selector debe permanecer disponible y el header debe conservar una sola fila.
- Calidad completa: ejecutar `npm run check` para lint, pruebas, TypeScript y build; revisar que no aparezcan errores ni avisos nuevos en consola.

## Tareas

1. Confirmar que este plan está aprobado y que existe autorización expresa para implementar.
2. Cargar `@react-ts-feature-pattern` en modo `strict` y revisar sus restricciones vigentes antes de modificar el componente.
3. Activar Node `22.22.0` y confirmar que el árbol de trabajo contiene únicamente los artefactos SDD esperados.
4. Refactorizar `LanguageSelector` para usar un `select` controlado, conservar los endónimos completos y emitir únicamente idiomas soportados.
5. Incorporar la presentación decorativa compacta con globo, código e indicador sin duplicar la semántica accesible.
6. Ajustar los estilos del selector para conservar interacción nativa, foco, contraste, superficie completa y ancho de 4,5 rem.
7. Ajustar el layout de cabecera para una sola fila y una separación horizontal estrecha de 0,5 rem.
8. Actualizar las cuatro áreas de pruebas afectadas por el cambio de botones a combobox.
9. Revisar el alcance tocado y sus módulos hermanos para confirmar que no existe duplicación semántica que deba consolidarse dentro del propietario común más cercano.
10. Ejecutar `npm run check` con Node `22.22.0`.
11. Validar en el navegador interno la matriz responsive, los tres idiomas, rutas, carga, selector nativo, teclado, foco, zoom, consola y ausencia de overflow.
12. Revisar el diff final y confirmar que no existen cambios en catálogos, navegación, servicios, mocks, rutas, dependencias ni configuración.
13. Si todas las comprobaciones son satisfactorias, registrar evidencias y pasar especificación y plan a `IMPLEMENTED`; no pasar a `VALIDATED` sin aceptación expresa.

## Evidencias de implementación

- Autorización: la persona responsable aprobó expresamente el plan y autorizó la implementación el 2026-08-23.
- Alcance: se modificaron `LanguageSelector`, los estilos de `AppLayout` y las cuatro áreas de pruebas enumeradas; no cambiaron el contrato público de props, navegación, catálogos, servicios, mocks, rutas, dependencias ni configuración.
- Patrón React: `react-ts-feature-pattern` se aplicó en modo `strict`; `LanguageSelector` conserva export nombrado, tipos dedicados y una única responsabilidad visual, sin hook o abstracción auxiliar innecesarios.
- Selector: el elemento interactivo es un `select` controlado con exactamente tres opciones nativas y endónimos; la capa visible muestra globo, `ES`, `EN` o `IT` e indicador de despliegue; el valor emitido se normaliza mediante el contrato de idiomas soportados existente.
- Pruebas enfocadas: 4 archivos y 16 pruebas afectadas superadas.
- Calidad completa: `npm run check` con Node `22.22.0` finaliza correctamente con lint sin incidencias, 22 archivos y 57 pruebas superadas, TypeScript y build de producción satisfactorios.
- Build: Vite transforma 157 módulos y conserva artefactos JavaScript separados para `Home`, `About` y `NotFound`.

| Viewport | Ancho de cabecera | Navegación ES / EN / IT | Selector | Resultado |
| --- | ---: | ---: | ---: | --- |
| 320 px | 288 px | 201,8 / 168,8 / 198,7 px | 72 px | Misma fila, dentro de la cabecera y sin overflow |
| 360 px | 328 px | 201,8 / 168,8 / 198,7 px | 72 px | Misma fila, dentro de la cabecera y sin overflow |
| 768 px | 704 px | 201,8 / 168,8 / 198,7 px | 72 px | Misma fila, dentro de la cabecera y sin overflow |
| 1280 px | 1152 px | 201,8 / 168,8 / 198,7 px | 72 px | Misma fila, dentro de la cabecera y sin overflow |

- Internacionalización: en los doce casos de la matriz responsive coinciden valor seleccionado, código visible, nombre accesible y `document.lang` para español, inglés e italiano.
- Accesibilidad: el DOM expone un `combobox` «Idioma», «Language» o «Lingua» con las tres opciones completas; el control conserva el foco tras el cambio y el navegador calculó un contorno visible sólido de 3 px.
- Rutas y estados: `/`, `/acerca-de`, la ruta no encontrada y el estado de carga conservan selector y navegación; a 320 px la cabecera mide 80 px, permanece en una fila y no genera overflow.
- Reflow: a 640 px, equivalente de layout a 1280 px con zoom al 200 %, la cabecera permanece en una fila y el ancho del documento coincide con el viewport.
- Consola: la validación local no registró errores ni avisos nuevos.
- Entrega manual: el build validado se sirvió mediante un túnel HTTPS temporal en viewport móvil de 390 × 844 px; la persona responsable confirmó la prueba manual y aceptó el resultado el 2026-08-23.
- Deduplicación: las opciones visuales pertenecen únicamente a `LanguageSelector`; se reutilizan `supportedLanguages` y `resolveSupportedLanguage`, y no se introduce un selector genérico ni una abstracción global de iconos.

## Riesgos, reversión y validación

- Riesgo de interacción: una capa visual podría impedir que el `select` reciba puntero o teclado. La superficie nativa deberá cubrir el control completo y las pruebas manuales verificarán su apertura y foco.
- Riesgo de accesibilidad: ocultar visualmente el elemento nativo de forma incorrecta podría retirarlo del árbol accesible o hacer invisible el foco. No se utilizarán `display: none`, `visibility: hidden` ni `pointer-events: none` sobre el control.
- Riesgo de geometría: variaciones tipográficas pueden consumir el margen restante a 320 px. Se medirán los tres idiomas; no se abrevia ni modifica la navegación sin una nueva aprobación.
- Riesgo de plataforma: el selector abierto tendrá apariencia distinta según navegador y sistema operativo. Esta variación es parte de la decisión nativa aprobada.
- Riesgo de regresión: las pruebas actuales consultan un grupo de botones y deben migrarse sin perder sus aserciones funcionales sobre idioma, estado y consultas.
- Reversión: restaurar el grupo de botones y sus estilos, devolver `flex-wrap` y separación vigentes a `AppLayout`, y recuperar las consultas de pruebas anteriores; no habrá datos, dependencias ni migraciones que revertir.
- Comandos de validación previstos: `nvm use 22.22.0`, `npm run check` y `npm run dev:mocks -- --host 127.0.0.1`.
- Evidencias necesarias para pasar a `IMPLEMENTED`: diff limitado al alcance; revisión `react-ts-feature-pattern` strict; lint, pruebas, TypeScript y build satisfactorios; selector nativo con tres endónimos; códigos correctos; callback e idioma del documento coherentes; foco y teclado correctos; una sola fila y ausencia de overflow en los cuatro viewports y tres idiomas; rutas, carga y contratos meteorológicos sin regresiones; consola limpia.
- Evidencias necesarias para pasar a `VALIDATED`: revisión de las evidencias anteriores, comprobación visual del header y del selector en móvil y escritorio, comprobación del selector nativo en el dispositivo objetivo y aceptación expresa de la persona responsable.
