# Plan técnico — FEAT-001 Consulta meteorológica por localidad

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-22

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/001-consulta-meteorologica/spec.md` (`APPROVED`).
- Decisión aplicable: `docs/architecture/decisions/0004-rtk-query.md` (`APPROVED`).
- Criterios cubiertos: AC-01 a AC-11 y requisitos transversales de accesibilidad, responsive, internacionalización, estados y acceso a datos.
- Fuera de alcance: autenticación, mapas, favoritos, geolocalización, persistencia, backend propio, integración con ChatGPT/OpenAI, cambio de idioma y cualquier dependencia adicional a Redux Toolkit y React-Redux.
- Este plan no incluye trasladar Redux Toolkit a la plantilla base; esa posible reutilización se evaluará después de validar esta implementación.

## Contratos externos verificados

### Open-Meteo Geocoding

- Documentación: [Geocoding API](https://open-meteo.com/en/docs/geocoding-api).
- URL base: `https://geocoding-api.open-meteo.com/v1/`.
- Endpoint: `GET search`.
- Parámetros: `name=<término recortado>`, `language=es`, `format=json` y `count=10`.
- Contrato consumido por coincidencia: `id`, `name`, `latitude`, `longitude`, y opcionalmente `admin1` y `country`.
- La ausencia de `results` se normaliza como una lista vacía; una colección presente con elementos sin identificador, nombre o coordenadas válidas se considera respuesta inválida.

### Open-Meteo Weather Forecast

- Documentación: [Weather Forecast API](https://open-meteo.com/en/docs).
- URL base: `https://api.open-meteo.com/v1/`.
- Endpoint: `GET forecast`.
- Parámetros de localización: `latitude` y `longitude` de la coincidencia elegida.
- Parámetros actuales: `current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day`.
- Parámetros diarios: `daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max`.
- Configuración explícita: `temperature_unit=celsius`, `wind_speed_unit=kmh`, `timezone=auto`, `forecast_days=7` y `timeformat=iso8601`.
- `timezone=auto` garantiza fechas diarias en la zona local de las coordenadas; las siete fechas y los tres arrays diarios deben existir y estar alineados.
- La ausencia de los objetos `current` o `daily`, de siete fechas válidas o de arrays diarios alineados se considera error estructural. Los valores meteorológicos escalares aislados ausentes o nulos se normalizan como no disponibles.
- `weather_code` se transforma desde los códigos WMO documentados a una condición conocida; cualquier código no reconocido se conserva como condición desconocida.

## Decisiones y diseño

- ADR aplicables: ADR-0001, ADR-0002, ADR-0003 y ADR-0004.
- Componentes propios: durante la implementación se debe cargar `@react-ts-feature-pattern` en modo `strict` y aplicar un componente por archivo, presentación separada de orquestación y cobertura funcional de cada componente nuevo.
- Se crearán dos APIs RTK Query porque Open-Meteo utiliza dos URL base diferentes. Cada API tendrá un único endpoint de consulta y utilizará `fetchBaseQuery`.
- Un único store registrará los reducers y middleware generados por ambas APIs. No se crearán slices, thunks, listeners, persistencia ni estado global adicional.
- `src/main.tsx` envolverá la página con el `Provider` de React-Redux. No se activará `setupListeners`, porque la feature no requiere recarga automática por foco o reconexión.
- El endpoint de geocodificación se activará de forma diferida al enviar un término válido. El endpoint meteorológico se activará al elegir una localidad.
- RTK Query será propietario de datos, carga, error, caché y cancelación de suscripción. El término escrito, la validación del formulario y la localidad elegida permanecerán como estado local del hook de la página.
- Una nueva búsqueda limpiará la localidad y el resultado meteorológico visibles antes de iniciar la consulta, para no atribuir datos anteriores al nuevo término.
- Los adaptadores de respuesta serán funciones puras y validarán en tiempo de ejecución únicamente las estructuras necesarias. No se añadirá una librería de esquemas.
- Los componentes consumirán modelos normalizados y no conocerán la estructura JSON de Open-Meteo.
- Los estados inicial, búsqueda en carga, sin coincidencias, error de búsqueda, meteorología en carga, error meteorológico y éxito serán mutuamente distinguibles en la interfaz.
- Los errores tendrán `role="alert"`; los estados de carga y vacío usarán una región viva no intrusiva. Los resultados se elegirán mediante botones nativos, con foco visible y orden DOM coherente.
- La condición meteorológica tendrá texto traducido como fuente semántica y un SVG complementario con `aria-hidden="true"`. La variante día/noche solo afectará a la representación visual.
- La fecha diaria se formateará en español desde el valor ISO recibido, evitando reinterpretarla como UTC.
- Los estilos serán SCSS locales por componente cuando sean necesarios, con una composición fluida desde 320 px, verificación a 360 px, 768 px y 1280 px, cuadrícula adaptable para los siete días y anchura máxima centrada.

## Flujo de datos

1. `Home` muestra el estado inicial y mantiene el término local.
2. Al enviar, `useHome` recorta y valida el término. Con menos de dos caracteres expone la validación y no activa RTK Query.
3. Un término válido activa la consulta diferida de geocodificación y muestra su estado de carga.
4. La respuesta se transforma en coincidencias normalizadas; la lista vacía muestra el estado sin resultados.
5. Al elegir una coincidencia, `useHome` la conserva localmente y activa la consulta meteorológica con sus coordenadas.
6. El adaptador meteorológico valida la estructura, alinea exactamente siete días y normaliza valores aislados ausentes.
7. `CurrentWeather` y `Forecast` reciben exclusivamente el modelo normalizado. Una nueva búsqueda reinicia la selección y repite el flujo.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `package.json`, `package-lock.json` | Añadir las dos dependencias aprobadas con versiones fijadas. | ADR-0004, acceso a datos |
| `src/app/store.ts` | Crear el único store con reducers y middleware de las dos APIs; exportar una factoría para aislar las pruebas. | ADR-0004, AC-04, AC-05 |
| `src/main.tsx` | Proporcionar el store mediante React-Redux. | ADR-0004 |
| `src/services/openMeteo/types.ts` | Definir contratos externos mínimos y modelos normalizados con nulabilidad explícita. | AC-02, AC-05, AC-06, AC-07 |
| `src/services/openMeteo/utils.ts` | Validar y transformar geocodificación, previsión, fechas, valores parciales y códigos WMO. | AC-02, AC-05, AC-06, AC-07 |
| `src/services/openMeteo/apiUtils.ts` | Construir de forma común los errores RTK Query de respuesta estructural inválida, conservando el mensaje específico y los datos recibidos. | AC-05 |
| `src/services/openMeteo/geocodingApi.ts` | Definir la API y consulta de localidades con parámetros en español. | AC-02 a AC-05, AC-08, AC-11 |
| `src/services/openMeteo/forecastApi.ts` | Definir la API meteorológica con variables, unidades, zona horaria y siete días. | AC-04 a AC-08 |
| `src/pages/Home/index.tsx`, `useHome.ts`, `styles.scss` | Componer la página, mantener estado local y orquestar las dos consultas diferidas. | AC-01 a AC-11 |
| `src/pages/Home/SearchForm/` | Crear formulario semántico, validación, botón y envío con Enter. | AC-01, AC-02, AC-08, AC-09, AC-11 |
| `src/pages/Home/LocationResults/` | Crear lista accesible de coincidencias con contexto opcional y claves estables. | AC-02, AC-03, AC-09 |
| `src/pages/Home/StatusMessage/` | Representar carga, vacío y error con semántica accesible. | AC-03 a AC-05, AC-09 |
| `src/pages/Home/CurrentWeather/` | Mostrar localidad, valores actuales, unidades, ausencias y condición textual. | AC-05, AC-06, AC-09, AC-10 |
| `src/pages/Home/WeatherIcon/` | Representar mediante SVG la condición conocida o desconocida y la variante día/noche. | AC-06, AC-09 |
| `src/pages/Home/Forecast/` | Mostrar una lista semántica de exactamente siete días con valores diarios. | AC-07, AC-09, AC-10 |
| `src/i18n/resources.ts`, `src/locales/es/common.json` | Establecer español como idioma inicial y añadir todos los textos y condiciones WMO. | AC-03 a AC-11 |
| `src/index.scss` y estilos locales | Aplicar baseline visual, foco, espaciado y comportamiento responsive. | AC-09, responsive |
| `mocks/fixtures/openMeteo.ts` | Añadir respuestas contractuales de éxito, vacío, parciales e inválidas. | AC-02 a AC-07 |
| `mocks/handlers/openMeteo.ts`, `mocks/browser.ts`, `mocks/server.ts` | Simular ambas APIs en pruebas y en `dev:mocks`. | AC-02 a AC-08 |
| `tests/services/openMeteo/` | Probar transformaciones, alineación, valores ausentes y códigos WMO. | AC-02, AC-05, AC-06, AC-07 |
| `tests/pages/Home/` | Sustituir la prueba vacía y añadir pruebas espejo de la página y cada componente nuevo. | AC-01 a AC-11 |

## Dependencias e instalaciones

- Ejecutar únicamente después de aprobar este plan: `npm install @reduxjs/toolkit@2.12.0 react-redux@9.3.0`.
- Versiones verificadas en el registro npm el 2026-08-22 y compatibles con React 19.
- No instalar Redux por separado, librerías de esquemas, iconos, fechas, CSS, peticiones HTTP ni persistencia.

## Estrategia de pruebas

- Modo de implementación: `strict` de `@react-ts-feature-pattern`.
- Unitarias con Vitest para los adaptadores: respuesta geográfica vacía, campos contextuales opcionales, elementos inválidos, siete fechas alineadas, estructura esencial ausente, valores nulos aislados, código WMO conocido/desconocido y formato de fecha local.
- Componentes con React Testing Library y `user-event`: contrato visual y accesible de `SearchForm`, `LocationResults`, `StatusMessage`, `CurrentWeather`, `WeatherIcon` y `Forecast`, sin repetir comportamiento que pertenezca a otro componente.
- Integración de `Home` con un store nuevo por prueba y MSW: estado inicial; validación sin petición; envío mediante botón y Enter; carga; coincidencias; vacío; error geográfico; selección; carga meteorológica; éxito con siete días; valores no disponibles; respuesta estructural inválida; nueva búsqueda desde vacío, error y éxito.
- Los handlers comprobarán los parámetros relevantes de ambas solicitudes para detectar desviaciones del contrato aprobado.
- Se comprobará que una respuesta anterior no reaparezca atribuida a un término nuevo y que la caché de una prueba no contamine otra.
- Las consultas de prueba priorizarán roles, nombres accesibles y texto observable; no se probarán detalles internos de Redux ni declaraciones CSS.
- Manuales: teclado completo, foco visible, lector semántico básico, ausencia de desplazamiento horizontal y composición a 360 px, 768 px y 1280 px.
- Validación final: `npm run check` y una comprobación manual con `npm run dev:mocks`.

## Tareas

1. Instalar exclusivamente las dependencias fijadas y registrar el lockfile.
2. Crear modelos, validadores y transformaciones puras para los dos contratos de Open-Meteo.
3. Crear las dos APIs RTK Query y configurar el store único y su Provider.
4. Añadir fixtures y handlers MSW reutilizables para los escenarios aprobados.
5. Cambiar el idioma inicial a español y completar los recursos de traducción.
6. Implementar `Home` y sus componentes aplicando `@react-ts-feature-pattern` en modo `strict`.
7. Implementar la orquestación local de búsqueda, selección, reinicio y estados remotos.
8. Añadir los estilos accesibles y responsive sin dependencias visuales.
9. Crear las pruebas unitarias, de componentes e integración trazadas a AC-01–AC-11.
10. Ejecutar `npm run check`, validar manualmente con mocks y registrar evidencias y limitaciones.
11. Si todas las comprobaciones son satisfactorias, actualizar la feature y este plan a `IMPLEMENTED`; no marcarlos como `VALIDATED` sin aceptación expresa.

## Riesgos, reversión y validación

- Riesgo: dos APIs RTK Query añaden dos reducers y middleware. Se acepta porque las URL base son distintas y se limita cada API a un endpoint.
- Riesgo: respuestas opcionales o parcialmente nulas de Open-Meteo. Se mitiga con validación estructural mínima y modelos normalizados sin inventar datos.
- Riesgo: una respuesta lenta anterior puede competir con una búsqueda posterior. La página limpiará la selección al buscar y mostrará únicamente el resultado asociado a la activación vigente; este comportamiento tendrá una prueba específica.
- Riesgo: la caché puede ocultar transiciones de carga o contaminar pruebas. La interfaz distinguirá `isLoading` de `isFetching` según el flujo y cada prueba creará un store nuevo.
- Riesgo: convertir fechas ISO con semántica UTC puede desplazar el día. Se formatearán como fechas civiles en la zona ya resuelta por Open-Meteo, sin conversión UTC implícita.
- Riesgo: el patrón Redux podría promoverse prematuramente a la plantilla. Este plan lo mantiene circunscrito a `clima-vista` hasta validar el resultado.
- Reversión: retirar el Provider, store, APIs, componentes y pruebas de FEAT-001; restaurar la página inicial, recursos y mocks; eliminar las dos dependencias mediante npm para que `package.json` y `package-lock.json` queden sincronizados.
- Comandos de validación: `npm run check` y `npm run dev:mocks` para comprobación manual.
- Evidencias para pasar a `IMPLEMENTED`: salida satisfactoria de lint, pruebas y build; matriz AC-01–AC-11 cubierta; capturas o registro de las tres anchuras; resultado de navegación por teclado; limitaciones documentadas.
- Evidencias para pasar a `VALIDATED`: revisión de las evidencias anteriores y aceptación expresa de la persona responsable.

## Evidencias de implementación

- Validación automática ejecutada con Node `22.20.0`: `npm run check` satisfactorio el 2026-08-23.
- Lint: sin errores ni advertencias.
- Pruebas: 11 archivos y 32 pruebas superadas.
- Build: TypeScript y Vite completados correctamente; 81 módulos transformados.
- Navegador con `dev:mocks`: flujo desde búsqueda hasta tiempo actual y previsión completado; 7 días visibles y ninguna advertencia o error de consola.
- Responsive: sin desplazamiento horizontal a 320 px y 360 px; composición revisada a 360 px, 768 px y 1280 px. La cuadrícula pasa de una composición móvil a 4 columnas a 768 px y 7 columnas a 1280 px.
- Accesibilidad: controles nativos y regiones vivas observables, error con `role="alert"`, SVG complementario oculto a tecnología de asistencia y foco visible comprobado. El envío mediante Enter y la elección por teclado están cubiertos mediante `user-event`.

| Criterio | Evidencia principal |
| --- | --- |
| AC-01 | Prueba de integración de estado inicial de `Home`. |
| AC-02 | Pruebas de `SearchForm`, `LocationResults` y flujo de integración con parámetros de geocodificación. |
| AC-03 | Prueba de integración de respuesta vacía y nueva búsqueda. |
| AC-04 | Transiciones de carga observadas en integración con respuestas demoradas. |
| AC-05 | Pruebas de errores HTTP, respuesta meteorológica inválida y validadores puros. |
| AC-06 | Pruebas de `CurrentWeather`, `WeatherIcon` y códigos WMO conocidos y desconocidos. |
| AC-07 | Pruebas de `Forecast`, alineación estructural y exactamente siete días. |
| AC-08 | Pruebas de recuperación y retirada inmediata del tiempo anterior al buscar de nuevo. |
| AC-09 | Pruebas semánticas por rol y nombre accesible, más comprobación visual del foco. |
| AC-10 | Recursos i18next en español consumidos por todos los componentes. |
| AC-11 | Pruebas de validación con botón y Enter sin petición de red para términos inválidos. |

El estado queda en `IMPLEMENTED`. El paso a `VALIDATED` permanece pendiente de aceptación expresa.

### Refactorización estructural del 2026-08-23

- `src/pages/Home/` se revisó recursivamente con `react-ts-feature-pattern` en modo `strict`.
- Los handlers con comportamiento, la orquestación y los datos derivados se trasladaron a hooks o utilidades según su propietario.
- Cada componente con tipos propios los centraliza en su `types.ts`; `index.tsx`, hooks y utilidades los importan desde ese propietario.
- Cada `index.tsx` queda centrado en renderizado y conexión de callbacks, sin declarar tipos propios.
- No se crearon hooks para componentes puramente visuales y se mantuvo un único componente React por archivo.
- El flujo completo y la composición móvil se comprobaron de nuevo en el navegador integrado sin errores de consola.

### Deduplicación segura del 2026-08-23

- La construcción repetida del error `CUSTOM_ERROR` de RTK Query se consolidó en `src/services/openMeteo/apiUtils.ts`.
- Las APIs de geocodificación y previsión conservan sus mensajes específicos y entregan sin transformar los datos de la respuesta inválida.
- Una prueba unitaria protege la forma exacta del error común y la identidad de sus datos.
