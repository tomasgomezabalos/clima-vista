# Plan técnico — FEAT-003 Incorporación del idioma italiano

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/003-idioma-italiano/spec.md` (`VALIDATED`).
- Relación: ampliación incremental de FEAT-002 — Cambio de idioma (`VALIDATED`), sin modificar sus artefactos ni degradar los contratos ya validados para español e inglés.
- Criterios cubiertos: AC-01 a AC-15 y los requisitos transversales de accesibilidad, responsive, internacionalización y actualización de todos los estados visibles.
- Alcance técnico: registrar italiano como tercer idioma, añadir su catálogo estático, ampliar el selector, localizar fechas y números, representar geocodificación italiana en mocks, corregir el ancho mínimo global que impide AC-15 y extender las pruebas existentes.
- Fuera de alcance: detección automática, persistencia, traducción en tiempo de ejecución, idiomas adicionales, nuevas unidades o funciones meteorológicas, backend, dependencias nuevas y cambios retroactivos en FEAT-002.
- La ampliación fue aprobada expresamente el 2026-08-23. La implementación continúa limitada al alcance enumerado y no autoriza instalaciones, commit, push ni merge.

## Contratos externos verificados

### Idioma interno, i18next y documento HTML

- El [Language Subtag Registry de IANA](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) registra `it` como subtag de idioma para italiano, por lo que es un identificador BCP 47 válido.
- La [configuración oficial de i18next](https://www.i18next.com/overview/configuration-options) admite una lista explícita `supportedLngs`, recursos proporcionados en la inicialización y `fallbackLng: false`; la [API oficial](https://www.i18next.com/overview/api) recomienda `resolvedLanguage` para identificar el idioma efectivo.
- Se comprobó de forma aislada con las versiones instaladas `i18next@26.4.0` y `react-i18next@17.0.12` que una instancia con recursos `es`, `en` e `it`, `supportedLngs: ['es', 'en', 'it']` y `lng: 'it'` resuelve `resolvedLanguage` como `it` y obtiene el recurso italiano.
- `it` se utilizará como identificador interno, valor del idioma efectivo, atributo `lang` del documento y valor enviado a Open-Meteo. Español continuará siendo `es`, el idioma predeterminado y el valor seguro para entradas no soportadas.

### Formato de fechas y números

- `Intl.DateTimeFormat` e `Intl.NumberFormat` aceptan identificadores de locale BCP 47 y permiten comprobar el soporte sin recurrir al locale predeterminado mediante `supportedLocalesOf`, conforme a la [especificación ECMA-402](https://tc39.es/ecma402/) y la [referencia de `supportedLocalesOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/supportedLocalesOf).
- Se comprobó con Node `22.20.0`, fijado por `.nvmrc`, que `Intl.DateTimeFormat.supportedLocalesOf(['it-IT'])` e `Intl.NumberFormat.supportedLocalesOf(['it-IT'])` devuelven `it-IT` y que ambos formateadores resuelven ese locale sin fallback al locale del entorno.
- Se utilizará `it-IT` exclusivamente para el formato italiano de fechas y números. Los locales actuales `es` y `en` conservarán su comportamiento para evitar regresiones observables.

### Open-Meteo Geocoding

- La [documentación oficial de Geocoding API](https://open-meteo.com/en/docs/geocoding-api) define `language` como parámetro opcional en minúsculas, localiza `name`, `country` y las áreas administrativas cuando es posible y, si no existe traducción, devuelve el nombre inglés o nativo.
- El 2026-08-23 se realizó una comprobación pública controlada con `name=Munich`, `count=1`, `format=json` y `language=it`. Open-Meteo aceptó la solicitud y devolvió, entre otros valores, «Monaco di Baviera», «Germania» y «Baviera»; la consulta equivalente con `language=en` devolvió «Munich», «Germany» y «Bavaria».
- Queda validado `language=it` para las búsquedas nuevas. La aplicación conservará literalmente los campos recibidos y no intentará detectar ni completar traducciones ausentes.

## Decisiones y diseño

- ADR aplicables: ADR-0001 para React, TypeScript, pruebas e i18next; ADR-0002 para análisis estático; ADR-0003 para los estilos SCSS; ADR-0004 para consultas y caché con RTK Query. Todos permanecen `APPROVED`.
- No se necesita un ADR nuevo: se amplían recursos y valores dentro de las decisiones existentes, sin introducir tecnología, dependencia, almacenamiento ni patrón arquitectónico adicional.
- Antes de modificar `LanguageSelector` durante una implementación autorizada se cargará `@react-ts-feature-pattern` y se declarará modo `strict`.
- `src/i18n/languages.ts` continuará siendo el propietario común del conjunto de idiomas, el tipo `SupportedLanguage`, el idioma predeterminado y la normalización. Se ampliará el conjunto a `['es', 'en', 'it']`; `it` e identificadores regionales cuya base sea `it` se resolverán como italiano, y cualquier idioma no soportado seguirá resolviéndose como español.
- El mismo módulo será propietario de la correspondencia de formato: `es` conservará locale `es`, `en` conservará locale `en` e `it` utilizará `it-IT`. Esta tabla tipada evitará duplicar o divergir el contrato de locale entre fechas y números.
- `src/i18n/resources.ts` importará y registrará el catálogo italiano empaquetado. La configuración mantendrá `lng: 'es'`, `fallbackLng: false`, ausencia de detector y ausencia de backend de traducciones.
- `src/locales/it/common.json` reproducirá exactamente la estructura completa de los catálogos existentes con traducciones italianas estáticas. Los catálogos español e inglés añadirán únicamente la clave necesaria para el endónimo «Italiano»; los tres mostrarán siempre «Español», «English» e «Italiano» para las opciones.
- `LanguageSelector` representará las tres opciones en el orden aprobado mediante una colección local tipada y botones nativos estables con `type="button"` y `aria-pressed`. La etiqueta del grupo seguirá traducida; los endónimos permanecerán constantes. Las claves estables preservarán el nodo y el foco de la opción accionada durante el render posterior al cambio.
- La comprobación real a 320 px confirmó que las tres opciones caben dentro del selector: el grupo ocupa aproximadamente 245 px y sus botones no se recortan ni solapan.
- La misma comprobación detectó un desbordamiento horizontal global de 15 px causado por `min-width: 320px` en `html` y `body` cuando el navegador reserva espacio para la barra vertical y deja 305 px de ancho útil. El propietario correcto es `src/index.scss`; se eliminarán únicamente esas dos restricciones de ancho mínimo, conservando las alturas mínimas, fondos y reglas de foco. No se ocultará el desbordamiento con `overflow-x`, porque eso enmascararía el contrato responsive en lugar de corregirlo.
- `useHome`, `Home` y `geocodingApi` no necesitan cambios funcionales: el idioma efectivo ya forma parte del argumento de cada búsqueda, y RTK Query ya incluye el argumento completo en la identidad de caché. Cambiar i18next no ejecuta el trigger de búsqueda ni reinicia estado local o datos remotos.
- Una búsqueda ya iniciada conservará el idioma de su argumento. El cambio de idioma actualizará únicamente la presentación propia; una búsqueda posterior enviará `language=it`, `language=es` o `language=en` según el idioma activo en ese momento.
- Los formateadores de fecha y número consumirán la correspondencia de locale tipada. Se añadirá `it-IT` sin alterar la validación de fecha civil, los valores, el redondeo máximo vigente ni las unidades.
- Las condiciones meteorológicas seguirán siendo claves semánticas WMO independientes del idioma; el catálogo italiano resolverá esas mismas claves.
- Los mocks incorporarán una respuesta italiana distinguible y seleccionarán la respuesta por el parámetro `language`, sin cambiar los escenarios especiales de carga, vacío y error.
- No se traducirán el término introducido, la marca ni los datos propios recibidos del proveedor. No se añadirá fallback cruzado, traducción automática, detector, persistencia, slice, Context ni estado global nuevo.

## Flujo de datos

1. i18next arranca con recursos `es`, `en` e `it`, mantiene `es` como idioma inicial y sincroniza `document.documentElement.lang` con el idioma efectivo.
2. `useHome`, `CurrentWeather` y `Forecast` normalizan `i18n.resolvedLanguage` a `es`, `en` o `it`.
3. `LanguageSelector` presenta los tres endónimos y comunica una única opción activa.
4. Al seleccionar italiano, `changeLanguage('it')` actualiza los consumidores y el documento sin desmontar `Home`, reiniciar el store ni ejecutar una consulta.
5. Los textos y condiciones se resuelven desde el catálogo italiano; fechas y números utilizan el locale asociado `it-IT` sobre los mismos valores existentes.
6. El término, los resultados, la localidad y la meteorología permanecen en el estado actual. Los nombres remotos ya recibidos no se sustituyen.
7. Una búsqueda posterior entrega `{ term, language: 'it' }` al endpoint existente. RTK Query diferencia esa consulta por su argumento y Open-Meteo recibe `language=it`.
8. El adaptador conserva los valores textuales reales de la respuesta, estén o no traducidos por el proveedor.
9. Una recarga vuelve a crear la configuración con `es`, sin leer preferencias anteriores.

## Alternativas descartadas

- Utilizar `it-IT` como identificador único en i18next y en Open-Meteo: mezclaría idioma de interfaz y locale regional, exigiría adaptar el contrato del proveedor y no aporta valor frente a separar `it` de `it-IT`.
- Duplicar literales de locale en cada formateador: aumenta el riesgo de que fechas y números utilicen contratos diferentes; la correspondencia tipada tendrá un único propietario.
- Añadir un detector, almacenamiento, backend de traducciones o servicio de traducción: contradice explícitamente la especificación aprobada.
- Modificar la lógica de estado o crear una nueva capa para conservar el contexto: el diseño actual ya conserva el estado al cambiar i18next y las pruebas pueden proteger ese contrato sin una abstracción nueva.
- Crear un ADR específico para italiano: no existe una decisión arquitectónica nueva ni una dependencia que lo justifique.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `src/i18n/languages.ts` | Añadir `it`, resolver variantes italianas, preservar español como fallback seguro y centralizar el locale de formato `it-IT`. | AC-01, AC-06, AC-07, AC-12, AC-14 |
| `src/i18n/resources.ts` | Registrar el catálogo italiano empaquetado manteniendo español inicial y sin carga remota. | AC-01, AC-03, AC-13 |
| `src/locales/es/common.json`, `src/locales/en/common.json` | Añadir la clave del endónimo «Italiano» sin cambiar los textos validados existentes. | AC-02, AC-11, AC-13 |
| `src/locales/it/common.json` | Crear el catálogo italiano completo y estático, incluidos todos los estados, condiciones y textos de disponibilidad. | AC-02 a AC-05, AC-13, AC-14 |
| `src/pages/Home/LanguageSelector/index.tsx` | Representar tres opciones tipadas, estables, accesibles y en el orden aprobado. | AC-02, AC-03, AC-11, AC-14 |
| `src/index.scss` | Eliminar únicamente `min-width: 320px` de `html` y `body` para que el documento use el ancho útil real sin desplazamiento horizontal. | AC-15 |
| `src/pages/Home/utils.ts` | Añadir el formateador numérico italiano mediante el locale centralizado, preservando valores y unidades. | AC-07, AC-10, AC-11 |
| `src/services/openMeteo/utils.ts` | Añadir el formateador de fechas italiano mediante el locale centralizado, sin alterar fechas civiles ni adaptadores. | AC-06, AC-10, AC-11 |
| `mocks/fixtures/openMeteo.ts`, `mocks/handlers/openMeteo.ts` | Incorporar datos de localidad italianos y responder a `language=it`, manteniendo el valor recibido sin traducción local. | AC-08, AC-09 |
| `tests/i18n/config.test.ts`, `tests/i18n/languages.test.ts`, `tests/i18n/resources.test.ts` | Proteger `it`, `it-IT`, español predeterminado, `lang="it"`, recursos registrados y paridad exacta de tres catálogos. | AC-01, AC-12 a AC-14 |
| `tests/pages/Home/LanguageSelector/index.test.tsx` | Cubrir tres endónimos, única opción activa, activación por teclado, callback italiano y conservación del foco tras rerender. | AC-02, AC-14 |
| `tests/pages/Home/utils.test.ts` | Verificar formato numérico italiano y conservación de valor, unidad y texto no disponible. | AC-07 |
| `tests/pages/Home/CurrentWeather/index.test.tsx`, `tests/pages/Home/Forecast/index.test.tsx` | Cubrir etiquetas, condiciones, disponibilidad, números y fechas italianas sin regresiones bilingües. | AC-04, AC-06, AC-07, AC-11 |
| `tests/services/openMeteo/utils.test.ts` | Verificar una fecha italiana inequívoca y conservar validación de fecha civil. | AC-06 |
| `tests/pages/Home/index.test.tsx` | Cubrir los seis estados en italiano, contexto conservado, ausencia de petición automática, búsqueda posterior con `language=it`, datos remotos sin alterar, documento y regreso a español/inglés. | AC-01, AC-03 a AC-12, AC-14 |

No se prevén cambios en `index.html`, `src/i18n/config.ts`, `src/pages/Home/useHome.ts`, `src/pages/Home/index.tsx`, `src/services/openMeteo/geocodingApi.ts`, el store, la consulta meteorológica ni los tipos de dominio, porque sus contratos actuales ya admiten la ampliación mediante `SupportedLanguage` y recursos registrados.

## Dependencias e instalaciones

- Ninguna dependencia nueva.
- Se reutilizarán i18next, react-i18next, `Intl`, RTK Query, Vitest, React Testing Library, `user-event` y MSW ya instalados.
- No se ejecutará ningún comando de instalación ni se modificarán `package.json` o `package-lock.json`.

## Estrategia de pruebas

- Unitarias de idioma: comprobar `supportedLanguages === ['es', 'en', 'it']`, español predeterminado, resolución de `it` y `it-IT`, fallback seguro para valores desconocidos y correspondencia `it` → `it-IT`.
- Unitarias de recursos: registrar los tres catálogos, comparar recursivamente sus claves terminales, exigir valores no vacíos y confirmar la nueva clave de endónimo en todos ellos. Tras añadirla, cada catálogo tendrá 49 claves terminales.
- Unitarias de formato: verificar `it-IT` en medidas y una fecha cuyo resultado italiano sea inequívocamente distinto del español y del inglés; conservar valor, unidad, fecha civil y comportamiento ante datos ausentes o inválidos.
- Componente `LanguageSelector` con React Testing Library y `user-event`: grupo accesible, tres botones nativos, endónimos constantes, `aria-pressed`, orden, activación mediante teclado, callback `it` y foco conservado tras actualizar la opción activa.
- Componentes meteorológicos: condición conocida y desconocida, texto no disponible, etiquetas, número decimal y fecha italiana; mantener las aserciones existentes para español e inglés.
- Integración de `Home` con store aislado y MSW: español inicial; cambio a italiano; textos de estado inicial, validación, carga de búsqueda, vacío, error de búsqueda, carga meteorológica, error meteorológico y éxito; `document.lang`; conservación de término, resultados, selección y meteorología; ausencia de solicitud al cambiar; búsqueda posterior con `language=it`; regreso a español e inglés.
- HTTP/MSW: comprobar `name`, `count=10`, `format=json` y `language=it`; devolver una fixture italiana distinguible y asegurar que los nombres remotos ya recibidos no cambian al cambiar de idioma.
- Aislamiento: mantener la restauración de i18next a español, handlers, store y DOM después de cada prueba para evitar contaminación global.
- Manuales con `npm run dev:mocks`: recorrer los seis estados en italiano; activar cada opción con teclado; verificar foco, única opción activa y `lang`; cambiar con término, resultados y meteorología visibles; confirmar que no aparece una solicitud nueva; realizar después una búsqueda italiana; recargar y comprobar español.
- Responsive manual: validar selector y página sin solapamientos, recortes ni desplazamiento horizontal a 320 px, 360 px, 768 px y 1280 px, con zoom del navegador al 200 % como comprobación adicional de accesibilidad.
- Regresión: repetir el flujo principal en español e inglés para confirmar que sus textos, formatos, solicitudes y conservación de contexto no cambian.

## Tareas

1. Cargar `@react-ts-feature-pattern` en modo `strict` antes de modificar el componente React y registrar el alcance exacto.
2. Ampliar el tipo de idiomas y definir la correspondencia centralizada de locales sin cambiar el valor predeterminado.
3. Crear el catálogo italiano estático y añadir el endónimo italiano a los catálogos existentes con paridad exacta.
4. Registrar el recurso italiano y ampliar el selector a tres opciones accesibles y estables.
5. Eliminar las dos restricciones globales `min-width: 320px` que causan el desbordamiento documentado, sin modificar otras reglas globales.
6. Añadir `it-IT` a los formateadores de fechas y números preservando días, valores, redondeo y unidades.
7. Añadir la fixture italiana y adaptar el handler de geocodificación para `language=it`.
8. Extender pruebas unitarias de idiomas, recursos, formatos y adaptadores.
9. Extender pruebas de selector, componentes meteorológicos e integración de todos los estados y conservación del contexto.
10. Revisar el alcance tocado y sus módulos hermanos para eliminar solo duplicación semánticamente equivalente en el propietario común más cercano.
11. Activar Node `22.20.0`, ejecutar `npm run check` y corregir únicamente fallos causados por el alcance autorizado.
12. Ejecutar las comprobaciones manuales accesibles, responsive y de ausencia de solicitud automática con `npm run dev:mocks`.
13. Si todas las comprobaciones son satisfactorias, registrar evidencias y pasar especificación y plan a `IMPLEMENTED`; no pasar a `VALIDATED` sin aceptación expresa.

## Evidencias de implementación

- Se aplicó `@react-ts-feature-pattern` en modo `strict` antes de modificar `LanguageSelector`; el componente continúa siendo presentacional, tipado y basado en botones nativos.
- Se ejecutó `npm run check` con Node `22.20.0`: lint sin incidencias, 15 archivos de prueba y 47 pruebas satisfactorias, y build de producción correcto con 86 módulos transformados.
- Los catálogos `es`, `en` e `it` contienen las mismas 49 claves terminales, todas con valores no vacíos. No se añadió fallback cruzado, traducción en ejecución, detector, backend ni dependencia.
- Las pruebas de integración con MSW verifican español inicial, los seis estados visibles en italiano, conservación de término, resultados, selección y meteorología, ausencia de búsqueda automática al cambiar de idioma, y una búsqueda posterior con `language=it`.
- La comprobación manual con `npm run dev:mocks` confirmó los textos italianos de estado inicial, validación, carga, vacío, error y éxito; condiciones WMO, disponibilidad, números y fechas localizados; `document.lang="it"`; nombres remotos conservados al cambiar; y regreso a español tras recargar.
- La accesibilidad queda cubierta por grupo etiquetado, botones nativos, una sola opción con `aria-pressed="true"`, activación por teclado mediante `user-event` y conservación del foco comprobada tras el cambio de idioma.
- La revisión responsive confirmó las tres opciones completas y ausencia de desplazamiento horizontal a 320, 360, 768 y 1280 px. Con contenido meteorológico completo a 320 px, el ancho útil y el ancho desplazable coincidieron en 305 px; el selector ocupó aproximadamente 245 px sin recorte ni solapamiento.
- La revisión final del alcance y módulos hermanos consolidó únicamente la correspondencia semánticamente común entre idioma y locale en `src/i18n/languages.ts`; no se identificó otra duplicación segura que justificase ampliar el cambio.

| Criterio | Evidencia principal | Resultado |
| --- | --- | --- |
| AC-01 | Configuración i18n, pruebas de integración y recarga manual | Satisfactorio |
| AC-02 | Pruebas del selector y revisión manual de tres endónimos | Satisfactorio |
| AC-03 | Pruebas de cambio dinámico y revisión manual | Satisfactorio |
| AC-04 | Catálogo italiano, pruebas de componentes e integración | Satisfactorio |
| AC-05 | Matriz manual y automatizada de los seis estados | Satisfactorio |
| AC-06 | Formateador `it-IT`, pruebas unitarias y previsión manual | Satisfactorio |
| AC-07 | Formateador `it-IT`, pruebas unitarias y valores visibles | Satisfactorio |
| AC-08 | Argumento de consulta, MSW y comprobación oficial de Open-Meteo | Satisfactorio |
| AC-09 | Fixture italiana y conservación literal de nombres remotos | Satisfactorio |
| AC-10 | Prueba de ausencia de nueva consulta y conservación integral | Satisfactorio |
| AC-11 | Regresión automatizada español/inglés y cambio manual | Satisfactorio |
| AC-12 | Configuración sin persistencia y recarga manual en español | Satisfactorio |
| AC-13 | Comparación recursiva de 49 claves y contenido no vacío | Satisfactorio |
| AC-14 | `lang`, etiqueta, `aria-pressed`, teclado y foco | Satisfactorio |
| AC-15 | Medición manual a 320, 360, 768 y 1280 px | Satisfactorio |

La feature queda en `VALIDATED` tras la revisión de estas evidencias y la aceptación expresa de la persona responsable el 2026-08-23.

## Riesgos, reversión y validación

- Riesgo: la normalización podría tratar `it-IT` como español si no se amplía de forma exhaustiva. Se mitigará con tipo cerrado y pruebas de `it`, `it-IT`, idiomas existentes y valores desconocidos.
- Riesgo: un fallback o una clave ausente puede ocultar una interfaz mezclada. Se mantendrá `fallbackLng: false` y se verificará paridad exacta y contenido no vacío en los tres catálogos.
- Riesgo: una traducción formalmente presente puede ser incorrecta o ambigua en contexto meteorológico. La revisión manual del flujo italiano cubrirá textos, condiciones WMO y disponibilidad sin utilizar traducción automática en ejecución.
- Riesgo: fechas italianas y españolas pueden compartir abreviaturas en algunos días y meses. Las pruebas utilizarán una fecha que distinga inequívocamente ambos locales y protegerán explícitamente `it-IT`.
- Riesgo: cambiar el idioma durante una petición puede dejar nombres en el idioma con el que se inició. Es el comportamiento aprobado: no se repetirá la búsqueda y se conservará la respuesta real; una búsqueda posterior utilizará el idioma vigente.
- Riesgo: retirar el ancho mínimo global permite que la interfaz responda también por debajo de 320 px. No se promete soporte funcional por debajo de ese umbral, pero el cambio evita imponer un ancho superior al espacio útil y se validará que no degrade los tamaños aprobados.
- Riesgo externo: Open-Meteo puede carecer de una traducción concreta o modificar sus datos. La aplicación mostrará literalmente su respuesta y las pruebas no exigirán que todo nombre remoto esté traducido.
- Riesgo de entorno: el soporte de locale depende del runtime. Node `22.20.0` ya quedó verificado y la validación manual confirmará el navegador objetivo antes de cerrar la implementación.
- Reversión: retirar el recurso y catálogo italiano, restaurar el conjunto de idiomas, la correspondencia de locales, las dos opciones del selector, los formateadores, mocks y pruebas previos, y restaurar las dos declaraciones `min-width: 320px` si fuera necesario. No habrá dependencias ni migraciones que revertir.
- Comandos de validación: `nvm use 22.20.0`, `npm run check` y `npm run dev:mocks` para las comprobaciones manuales.
- Evidencias para pasar a `IMPLEMENTED`: lint, pruebas y build satisfactorios; matriz AC-01–AC-15 cubierta; tres catálogos con paridad; `document.lang` correcto; solicitud `language=it`; ausencia de solicitud al cambiar; contexto conservado; traducciones y formatos italianos visibles; foco y teclado verificados; revisión responsive desde 320 px; regresión español/inglés satisfactoria.
- Evidencias para pasar a `VALIDATED`: revisión de las evidencias de implementación, comprobación funcional del flujo italiano y aceptación expresa de la persona responsable.
