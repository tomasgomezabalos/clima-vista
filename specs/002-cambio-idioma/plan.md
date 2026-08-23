# Plan técnico — FEAT-002 Cambio de idioma

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/002-cambio-idioma/spec.md` (`APPROVED`).
- Criterios cubiertos: AC-01 a AC-13 y requisitos transversales de accesibilidad, responsive, internacionalización y actualización de estados visibles.
- Decisiones aplicables: ADR-0001, ADR-0002, ADR-0003 y ADR-0004, todos en estado `APPROVED`.
- Fuera de alcance: detección automática, persistencia, idiomas distintos de español e inglés, traducción automática, nuevas unidades, traducción local de nombres propios y cambios funcionales ajenos a la adaptación lingüística aprobada.
- Este plan no autoriza implementación, instalaciones, commit ni push hasta recibir aprobación expresa y una autorización posterior para implementar.

## Contratos externos verificados

### i18next y react-i18next

- Documentación: [API de i18next](https://www.i18next.com/overview/api) y [hook `useTranslation`](https://react.i18next.com/latest/usetranslation-hook).
- `useTranslation` proporciona la función `t` y la instancia `i18n`; `i18n.changeLanguage(language)` cambia el idioma y devuelve una promesa.
- `i18n.resolvedLanguage` representa el idioma efectivo resuelto y se utilizará frente a valores de idioma más amplios o no normalizados.
- El evento `languageChanged` permite sincronizar el atributo `lang` del documento con cada cambio efectivo.
- Los recursos continuarán importados y empaquetados localmente; no se incorporará carga remota, detector de idioma ni mecanismo de persistencia.

### Open-Meteo Geocoding

- Documentación: [Geocoding API](https://open-meteo.com/en/docs/geocoding-api).
- El parámetro opcional `language`, en minúsculas, determina la localización de `name`, `country` y áreas administrativas cuando existe traducción.
- Open-Meteo puede devolver el nombre inglés o nativo cuando no dispone de la traducción solicitada; la aplicación conservará el texto recibido y no inventará una traducción.
- La consulta mantendrá `name`, `format=json` y `count=10`, y sustituirá el idioma fijo por el idioma activo de la búsqueda.

## Decisiones y diseño

- No se necesita un ADR nuevo: la selección de i18next/react-i18next ya está aprobada por ADR-0001 y la consulta localizada seguirá bajo la API RTK Query aprobada por ADR-0004.
- Durante la implementación se cargará `@react-ts-feature-pattern` en modo `strict` antes de modificar componentes React propios.
- `src/i18n/` será propietario de los idiomas soportados, su tipo estricto y la normalización del idioma efectivo. Solo se admitirán `es` y `en`, con `es` como valor seguro predeterminado.
- La configuración i18next registrará ambos catálogos empaquetados, mantendrá español como idioma inicial y no usará detector, almacenamiento ni fallback cruzado que pueda ocultar una traducción inglesa ausente mediante texto español.
- `index.html` declarará español antes de arrancar JavaScript. La configuración i18n sincronizará `document.documentElement.lang` al inicializarse y ante `languageChanged`.
- Se creará `LanguageSelector` como componente presentacional con dos botones nativos agrupados, nombres visibles constantes «Español» y «English», `type="button"` y `aria-pressed` para comunicar la opción activa. Su etiqueta de grupo sí se traducirá.
- `useHome` será propietario del idioma efectivo y del handler que invoque `changeLanguage`. El cambio no reiniciará estado React ni consultas RTK Query, por lo que conservará término, resultados, localidad elegida y meteorología.
- La validación dejará de almacenar una frase ya traducida. Se conservará únicamente el estado semántico de validación y el mensaje se derivará con `t` en cada render, de modo que un error visible cambie de idioma.
- La consulta de geocodificación recibirá un argumento compuesto por término e idioma. Ambos formarán parte de la clave de caché de RTK Query y el idioma se enviará en el parámetro `language`.
- Cambiar de idioma no activará la consulta de geocodificación. Una petición ya iniciada conservará el idioma con el que fue enviada; una búsqueda posterior utilizará el idioma activo en ese momento.
- Las condiciones meteorológicas continuarán representadas mediante las claves semánticas WMO existentes; cada catálogo resolverá esas mismas claves en su idioma.
- Los formateadores de fecha y mediciones recibirán explícitamente el idioma efectivo. `Intl.DateTimeFormat` e `Intl.NumberFormat` realizarán la localización sin dependencias nuevas y conservarán fecha civil, valor y unidad.
- No se trasladarán datos remotos ni el idioma a un slice nuevo, Context propio o almacenamiento persistente.
- La paridad estructural entre los catálogos español e inglés se protegerá mediante una prueba específica para detectar claves ausentes o adicionales.

## Flujo de datos

1. i18next arranca con los recursos `es` y `en`, selecciona `es` y sincroniza el idioma del documento.
2. `useHome` obtiene `t`, la instancia i18n y el idioma efectivo normalizado.
3. `Home` presenta `LanguageSelector` con el idioma activo y el handler de cambio.
4. Al accionar una opción, `changeLanguage` actualiza i18next; los consumidores de `useTranslation` se renderizan de nuevo y el documento actualiza su atributo `lang`.
5. El estado local de `Home` y los datos actuales de RTK Query permanecen intactos; textos, condiciones, fechas y números se recalculan con el idioma nuevo.
6. Al iniciar una búsqueda posterior, `useHome` entrega `{ term, language }` a la consulta diferida de geocodificación.
7. RTK Query incluye término e idioma en la identidad de la consulta y Open-Meteo recibe `language=es` o `language=en`; la respuesta sustituye los resultados únicamente por la acción normal de buscar.
8. Una recarga crea de nuevo la configuración con `es`, sin leer preferencias previas.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `index.html` | Declarar `lang="es"` como idioma inicial del documento. | AC-01, AC-07, AC-09 |
| `src/i18n/languages.ts` | Definir `SupportedLanguage`, idiomas admitidos y normalización segura del idioma efectivo. | AC-01, AC-02, AC-11, AC-12 |
| `src/i18n/resources.ts`, `src/i18n/config.ts` | Registrar ambos catálogos, mantener español inicial, impedir fallback cruzado y sincronizar el idioma del documento. | AC-01, AC-03, AC-06, AC-07, AC-09, AC-10 |
| `src/locales/es/common.json`, `src/locales/en/common.json` | Añadir textos del selector y completar catálogos equivalentes, incluidas condiciones y estados. | AC-02 a AC-04, AC-06, AC-08, AC-10 |
| `src/pages/Home/LanguageSelector/` | Crear el selector presentacional, sus tipos y estilos locales accesibles y responsive. | AC-02, AC-09, responsive |
| `src/pages/Home/index.tsx`, `useHome.ts`, `styles.scss` | Integrar el selector, gestionar el cambio, derivar la validación traducida y conservar el contexto actual. | AC-02, AC-03, AC-06, AC-08, AC-13 |
| `src/services/openMeteo/geocodingApi.ts` | Incluir término e idioma en el argumento de consulta y enviar el parámetro localizado. | AC-11, AC-13 |
| `src/pages/Home/utils.ts`, `CurrentWeather/`, `Forecast/` | Propagar el idioma efectivo y localizar números y fechas conservando valores, unidades y días. | AC-04, AC-05, AC-12, AC-13 |
| `src/services/openMeteo/utils.ts` | Hacer que el formateo de fecha civil use el idioma recibido sin alterar la validación del contrato meteorológico. | AC-05, AC-13 |
| `mocks/fixtures/openMeteo.ts`, `mocks/handlers/openMeteo.ts` | Representar respuestas de localidad en español e inglés según el parámetro de la petición. | AC-11 |
| `tests/i18n/`, `tests/setup/vitest.setup.ts` | Proteger idioma inicial, paridad de catálogos y restauración del idioma y documento entre pruebas. | AC-01, AC-07, AC-09, AC-10 |
| `tests/pages/Home/LanguageSelector/` | Probar nombres, agrupación, activación por teclado, estado activo y callbacks. | AC-02, AC-09 |
| `tests/pages/Home/`, `tests/services/openMeteo/` | Cubrir cambio dinámico, todos los estados, condiciones, fechas, números, caché localizada y conservación de contexto. | AC-03 a AC-13 |

## Dependencias e instalaciones

- Ninguna dependencia nueva.
- Se reutilizarán `i18next`, `react-i18next`, RTK Query, `Intl`, Vitest, React Testing Library, `user-event` y MSW ya presentes.
- No se ejecutará ningún comando de instalación ni se modificarán `package.json` o `package-lock.json`.

## Estrategia de pruebas

- Unitarias con Vitest: normalización de idiomas; paridad recursiva de claves entre catálogos; fecha civil en español e inglés; separadores numéricos en ambos idiomas; preservación de valores nulos y unidades.
- Componente `LanguageSelector` con React Testing Library y `user-event`: etiqueta accesible, dos botones con endónimos constantes, `aria-pressed`, foco y activación por clic y teclado.
- Componentes meteorológicos: condición conocida/desconocida, etiquetas, fechas, números y texto no disponible en ambos idiomas sin duplicar la integración completa.
- Integración de `Home` con store nuevo y MSW: español inicial; cambio inglés/español; traducción de estado inicial, validación, carga, vacío, error y éxito; `document.lang`; `language=en|es`; ausencia de petición al cambiar idioma; conservación de término, resultados, selección y meteorología; búsqueda nueva localizada tras cambiar.
- Caché: comprobar que el argumento compuesto diferencia el mismo término buscado en español e inglés y que el cambio de idioma por sí solo no sustituye los nombres ya recibidos.
- Aislamiento: restaurar i18next, atributo `lang`, handlers, store y DOM después de cada prueba para evitar contaminación global.
- Manuales con `npm run dev:mocks`: selector y foco por teclado; estados inicial, validación, carga, vacío, error y éxito; cambio con datos visibles; recarga desde inglés; comprobación de nombres localizados; ausencia de desplazamiento horizontal a 320 px y revisión a 360 px, 768 px y 1280 px.
- Validación automática final: `npm run check` con la versión de Node indicada en `.nvmrc`.

## Tareas

1. Cargar `@react-ts-feature-pattern` en modo `strict` y registrar el alcance exacto de componentes a modificar.
2. Definir los idiomas soportados y completar los dos catálogos con paridad estructural.
3. Configurar español inicial, ausencia de persistencia y sincronización del idioma del documento.
4. Crear `LanguageSelector` con sus tipos, estilos y pruebas espejo.
5. Integrar el selector en `Home`, cambiar el idioma mediante i18next y convertir la validación almacenada en estado semántico traducible.
6. Adaptar la consulta de geocodificación para recibir término e idioma y actualizar mocks y pruebas contractuales.
7. Localizar fechas y números mediante el idioma efectivo sin alterar fechas civiles, valores ni unidades.
8. Añadir pruebas focalizadas de componentes y la integración bilingüe completa, incluida conservación del contexto y ausencia de peticiones automáticas.
9. Revisar el alcance tocado y sus módulos hermanos para detectar duplicación semántica sin abstraer similitudes accidentales.
10. Ejecutar `npm run check` y las comprobaciones manuales responsive y accesibles con `npm run dev:mocks`.
11. Si todas las comprobaciones son satisfactorias, actualizar la especificación y el plan a `IMPLEMENTED`; no marcarlos como `VALIDATED` sin aceptación expresa.

## Riesgos, reversión y validación

- Riesgo: el fallback español podría ocultar una clave inglesa ausente y producir mezcla de idiomas. Se mitigará evitando fallback cruzado y comprobando paridad exacta entre catálogos.
- Riesgo: guardar una frase traducida en estado impediría actualizar una validación visible. Se mitigará almacenando únicamente el estado semántico y derivando el texto en cada render.
- Riesgo: una clave de caché basada solo en el término compartiría resultados localizados entre idiomas. Se mitigará incluyendo el idioma en el argumento tipado de RTK Query.
- Riesgo: cambiar el idioma mientras una petición está en curso puede producir nombres propios en el idioma con el que se inició. Se acepta porque la decisión aprobada prohíbe repetir automáticamente la búsqueda; la interfaz propia sí se actualizará al idioma vigente.
- Riesgo: Open-Meteo puede responder con el nombre inglés o nativo si no existe traducción. Se mostrará el dato real recibido, de acuerdo con el contrato documentado.
- Riesgo: el singleton i18next y el atributo global `lang` pueden contaminar pruebas. La configuración compartida de Vitest restaurará ambos después de cada caso.
- Riesgo: la ampliación del encabezado puede desbordar en móvil. El selector tendrá composición flexible y se verificará desde 320 px.
- Reversión: retirar `LanguageSelector` y sus pruebas; restaurar los catálogos y configuración monolingües; devolver geocodificación, fecha y números a español fijo; restaurar `Home`, mocks e `index.html`. No habrá dependencias que desinstalar.
- Comandos de validación: `npm run check` y `npm run dev:mocks` para la comprobación manual.
- Evidencias necesarias para pasar a `IMPLEMENTED`: lint, pruebas y build satisfactorios; matriz AC-01–AC-13 cubierta; solicitudes de geocodificación en ambos idiomas; prueba de ausencia de petición automática; evidencia de contexto conservado; selector operable por teclado; `document.lang` correcto; recarga a español; revisión responsive sin desplazamiento horizontal.
- Evidencias necesarias para pasar a `VALIDATED`: revisión de las evidencias anteriores y aceptación expresa de la persona responsable.

## Evidencias de implementación

- Implementación realizada con `react-ts-feature-pattern` en modo `strict` y revisión final de componentes, tipos, pruebas, duplicación semántica y reglas Sonar-like.
- Validación automática con Node `22.20.0`: `npm run check` satisfactorio el 2026-08-23.
- Lint: sin errores ni advertencias.
- Pruebas: 15 archivos y 42 pruebas superadas.
- Build: TypeScript y Vite completados correctamente; 85 módulos transformados.
- Navegador integrado con `dev:mocks`: cambio español/inglés, búsqueda localizada, tiempo actual, condición WMO, números y siete fechas verificados sin recarga.
- Conservación: término, resultados, localidad y meteorología permanecen al cambiar de idioma; los nombres ya devueltos por Open-Meteo no se sustituyen automáticamente.
- No persistencia: una recarga después de usar inglés restablece español y `lang="es"`.
- Responsive: selector visible y sin desplazamiento horizontal a 320 px, 360 px, 768 px y 1280 px.
- Accesibilidad: grupo con nombre traducido, botones nativos, estado activo mediante `aria-pressed`, foco perceptible y atributo `lang` sincronizado.
- Consola del navegador: sin advertencias ni errores durante el flujo validado.

| Criterio | Evidencia principal |
| --- | --- |
| AC-01 | Pruebas de idioma predeterminado y estado inicial; recarga manual a español. |
| AC-02 | Prueba espejo de `LanguageSelector` y comprobación visual en todos los anchos. |
| AC-03 | Prueba de cambio dinámico a inglés y flujo completo en navegador. |
| AC-04 | Pruebas de `CurrentWeather` y condición conocida/desconocida en inglés. |
| AC-05 | Pruebas de fecha civil en ambos idiomas y siete fechas verificadas en navegador. |
| AC-06 | Cambio de inglés a español con contenido meteorológico visible. |
| AC-07 | Configuración sin detector ni almacenamiento y recarga manual a español. |
| AC-08 | Pruebas de validación, carga, vacío, error y éxito en inglés. |
| AC-09 | Prueba de teclado, `aria-pressed`, grupo accesible y sincronización de `lang`. |
| AC-10 | Prueba de paridad recursiva entre los catálogos español e inglés. |
| AC-11 | Pruebas de `language=es|en`, mocks localizados y ausencia de petición al cambiar. |
| AC-12 | Pruebas de separadores numéricos en ambos idiomas conservando unidades. |
| AC-13 | Prueba de integración y comprobación manual de conservación del contexto. |

El estado queda en `VALIDATED` tras la aceptación expresa de la persona responsable el 2026-08-23.
