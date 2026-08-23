# Plan técnico — FEAT-004 Navegación entre páginas

**Estado:** VALIDATED

**Fecha:** 2026-08-23

**Aprobación:** 2026-08-23

**Implementación:** 2026-08-23

**Validación:** 2026-08-23

## Especificación y alcance autorizado

- Especificación: `specs/004-navegacion-entre-paginas/spec.md`, aprobada el 2026-08-23.
- Criterios cubiertos: AC-01 a AC-13.
- Alcance técnico: navegación declarativa entre `/`, `/acerca-de` y una ruta no encontrada; historial y acceso directo; páginas cargadas bajo demanda; estado de carga compartido; navegación y selector de idioma globales; traducciones en español, inglés e italiano; reinicio de `Home` al desmontarlo y volver a montarlo.
- Fuera de alcance: rutas dinámicas, rutas protegidas, loaders, actions, precarga, persistencia, SSR, generación estática, nuevas consultas remotas y recuperación específica ante fallos de descarga de módulos.
- La aprobación de la especificación autorizó redactar este plan. La aprobación posterior del plan y la orden expresa «Impleméntalo» autorizaron la instalación y los cambios aquí registrados.

## Decisiones y diseño

### Decisiones aplicables

- ADR-0001 continúa vigente para React funcional, Vite, TypeScript estricto, Vitest, React Testing Library, i18next, organización de `src/` y pruebas espejo en `tests/`.
- ADR-0004 continúa vigente para las consultas meteorológicas con RTK Query; la navegación no gestionará datos remotos ni sustituirá sus estados de carga.
- No se propone un ADR nuevo: el enrutamiento declarativo amplía de forma acotada y reversible la SPA aprobada. Si aparecen loaders, actions, rutas protegidas, SSR o una política de estado entre rutas, deberá reconsiderarse esta decisión antes de ampliar el alcance.
- Antes de crear o modificar componentes durante una implementación autorizada se cargará `react-ts-feature-pattern` y se declarará modo `strict`, porque se crean componentes y comportamientos nuevos que deben quedar funcionalmente cubiertos.

### Versión y compatibilidad de React Router

- Se instalará `react-router@8.3.0`, versión estable actual, como dependencia de producción. React Router 8 ya no requiere `react-router-dom`; las APIs de navegador se importan desde `react-router`.
- React Router 8 exige como mínimo Node `22.22.0`. El proyecto fija actualmente Node `22.20.0`, por lo que se actualizarán `.nvmrc` a `22.22.0` y `package.json#engines.node` a `>=22.22.0` antes de instalar la dependencia.
- React `19.2.8` y Vite `8.2.0` ya satisfacen la línea base de React Router 8; no se actualizarán otras dependencias.
- Se descarta mantener React Router `7.18.2` únicamente para conservar Node `22.20.0`: evitaría el ajuste de toolchain, pero incorporaría una línea mayor anterior cuando la aplicación puede cumplir la línea base estable actual mediante una actualización acotada de Node.

Fuentes oficiales consultadas:

- React Router 8.3.0 y versiones vigentes: <https://reactrouter.com/start/declarative/installation>
- Configuración declarativa con `BrowserRouter`, `Routes`, `Route` y `Outlet`: <https://reactrouter.com/start/declarative/routing>
- Línea base de React Router 8: <https://reactrouter.com/home/changelog#v800>
- Contrato de `React.lazy`: <https://react.dev/reference/react/lazy>
- Contrato de `Suspense`: <https://react.dev/reference/react/Suspense>

### Router y composición de la aplicación

- `src/main.tsx` conservará `StrictMode`, i18next y el `Provider` de Redux; sustituirá el montaje directo de `Home` por `BrowserRouter` y `App`.
- `src/app/App/index.tsx` será el único propietario de la tabla declarativa de rutas mediante `Routes` y `Route`:
  - ruta índice `/` → `Home`;
  - `/acerca-de` → `About`;
  - `*` → `NotFound`.
- Las tres páginas se declararán con `React.lazy` en el nivel superior del módulo, nunca dentro de un componente. Cada importación dinámica adaptará el export nombrado existente o nuevo al contrato `{ default: Component }` exigido por `lazy`, sin cambiar el convenio de exports nombrados del proyecto.
- `src/app/routes.ts` será el propietario común de `/` y `/acerca-de`, utilizados tanto por la tabla de rutas como por los enlaces. La ruta `*` permanecerá junto a su único uso.
- La ruta se normaliza bajo el directorio `src/app` ya existente porque el sistema de archivos del entorno no distingue mayúsculas y minúsculas; crear simultáneamente `src/App` y `src/app` produciría una colisión. Este ajuste conserva el diseño y evita dos propietarios aparentes de aplicación.
- Se utilizará modo declarativo. No se introducirán `createBrowserRouter`, `RouterProvider`, loaders, actions ni módulos de ruta del modo framework.
- No se configurará precarga de enlaces. Los módulos exclusivos de `Home`, `About` y `NotFound` solo se solicitarán al intentar representar su ruta por primera vez.

### Layout, navegación y carga

- `AppLayout` será el shell compartido y permanecerá en el paquete inicial. Renderizará `AppNavigation`, `LanguageSelector` y la región de contenido de ruta.
- `AppNavigation` utilizará `NavLink`; el enlace a `/` llevará coincidencia exacta para no permanecer activo en otras rutas. `NavLink` expondrá la página vigente mediante `aria-current="page"`, además del tratamiento visual no basado únicamente en color.
- `AppLayout` colocará una única frontera `Suspense` alrededor de `Outlet`, no alrededor del shell completo. Mientras una página suspende, la navegación y el selector de idioma seguirán montados y operativos.
- El fallback de `Suspense` será el componente compartido `Loading`, con el mensaje traducido de carga de página.
- `Loading` recibirá únicamente un `message: string`, mostrará indicador visual y texto, y expondrá `role="status"`, `aria-live="polite"` y `aria-busy="true"`. El indicador será decorativo y respetará `prefers-reduced-motion`.
- `Loading` se reutilizará también para los estados de búsqueda y meteorología de `Home`. `StatusMessage` conservará los tonos inicial, vacío y error, pero dejará de ser propietario del tono y del indicador de carga. Esta deduplicación mantiene un único contrato accesible y visual para esperas equivalentes.
- El selector de idioma dejará de pertenecer a `pages/Home` y pasará a `src/components/LanguageSelector`, conservando su API, botones, endónimos, foco y `aria-pressed`. `AppLayout` será responsable de leer el idioma efectivo y ejecutar `i18n.changeLanguage`.
- `Home` seguirá resolviendo internamente el idioma efectivo para las búsquedas de Open-Meteo, pero ya no devolverá el idioma ni el handler de cambio a su vista.

### Páginas y estado

- `About` será una página estática, sin hooks de datos ni llamadas HTTP. Mostrará la marca y el propósito aprobado mediante traducciones empaquetadas.
- `NotFound` mostrará título, explicación y un `Link` a `/` sin recarga completa.
- Cada página será propietaria de su elemento `main`; `AppLayout` no introducirá otro `main` y evitará landmarks anidados.
- Al navegar fuera de `/`, `Home` se desmontará. Al regresar se creará de nuevo su estado local inicial, cumpliendo AC-11 sin añadir Redux, Context, almacenamiento ni caché de interfaz.
- El idioma permanecerá activo porque i18next vive fuera de las páginas. El store de RTK Query seguirá existiendo durante la navegación, pero `Home` no reconstruirá su presentación con datos anteriores al no conservar su término ni selección local.

### Acceso directo y alojamiento

- `BrowserRouter` conservará URL limpias y utilizará el historial del navegador.
- Vite se utilizará para validar acceso directo y recarga de `/acerca-de` durante desarrollo y preview.
- El repositorio no contiene actualmente configuración de alojamiento. No se inventará una. Antes de un despliegue real, el alojamiento deberá resolver las rutas válidas mediante `index.html`; si el proveedor futuro no ofrece fallback de SPA, esa configuración requerirá un cambio autorizado específico.

## Flujo de ejecución

1. `src/main.tsx` inicializa i18next, Redux y `BrowserRouter`, y monta `App`.
2. `App` compara la URL y selecciona una ruta hija de `AppLayout`.
3. El shell compartido muestra navegación y selector sin esperar al módulo de la página.
4. Al intentar representar una página por primera vez, React inicia su importación dinámica.
5. Mientras la promesa está pendiente, `Suspense` sustituye únicamente el contenido de `Outlet` por `Loading`.
6. Al resolverse el módulo, React conserva el resultado y representa la página solicitada.
7. La navegación posterior utiliza el historial del navegador. Una página ya importada reutiliza el módulo resuelto durante la misma carga de la aplicación.
8. Al salir de `Home`, su estado local desaparece; al volver, la consulta parte del estado inicial. i18next y el store global permanecen montados.

## Alternativas descartadas

- `HashRouter`: evita configurar fallback en el alojamiento, pero introduce URLs con fragmento y no cumple la propuesta de rutas limpias `/` y `/acerca-de`.
- Data Mode o Framework Mode: añaden loaders, actions, configuración y responsabilidades que no existen en el alcance aprobado.
- `route.lazy` de React Router: el requisito técnico indicado es ejercitar explícitamente `React.lazy` y `Suspense`; no se mezclará con otro mecanismo de carga diferida.
- Una frontera `Suspense` alrededor de toda la aplicación: retiraría navegación y selector durante la carga, contradiciendo AC-05.
- Una frontera por cada componente interno: fragmentaría una única espera de página sin necesidad observable.
- Declarar `lazy` dentro de `App`: recrearía el tipo de componente durante renders y podría reiniciar estado; las declaraciones serán estables a nivel de módulo.
- Exportar las páginas por defecto solo para satisfacer `lazy`: contradice el convenio de exports nombrados; se utilizará el adaptador mínimo de la promesa importada.
- Crear un componente de carga exclusivo de rutas: duplicaría un estado semánticamente reutilizable; `Loading` será compartido y `Home` lo compondrá para sus esperas existentes.
- Conservar `LanguageSelector` dentro de `Home`: impediría que permaneciera disponible en «Acerca de», «No encontrada» y durante la carga.
- Elevar el estado de `Home` a Redux o Context: contradice el reinicio aprobado y añadiría persistencia entre rutas no solicitada.
- Añadir una demora artificial en producción: falsearía el rendimiento para hacer visible el fallback; la espera se verificará de forma controlada en pruebas y con throttling manual.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `specs/004-navegacion-entre-paginas/spec.md` | Registrar aprobación; al finalizar una implementación autorizada, añadir estado y evidencias sin validar automáticamente. | Trazabilidad SDD |
| `.nvmrc`, `package.json`, `package-lock.json` | Actualizar Node a `22.22.0`, declarar el engine compatible e instalar `react-router@8.3.0`. | AC-01, AC-02, AC-07 a AC-09 |
| `src/main.tsx` | Montar `BrowserRouter` y `App` manteniendo i18next, `StrictMode` y Redux. | AC-01, AC-02, AC-07, AC-08 |
| `src/app/App/index.tsx`, `src/app/routes.ts` | Definir rutas, paths compartidos y páginas con importaciones dinámicas estables. | AC-01 a AC-09, AC-11 |
| `src/layouts/AppLayout/index.tsx`, `useAppLayout.ts`, `styles.scss` | Crear el shell global, gestionar idioma y limitar `Suspense` a la región de contenido. | AC-01, AC-05, AC-10, AC-12 |
| `src/components/AppNavigation/index.tsx`, `styles.scss` | Crear navegación traducida mediante `NavLink`, página activa y foco visible. | AC-01, AC-02, AC-07, AC-09, AC-10, AC-12 |
| `src/components/Loading/index.tsx`, `types.ts`, `styles.scss` | Crear el estado de carga genérico, tipado, accesible y respetuoso con movimiento reducido. | AC-05, AC-10, AC-12 |
| `src/pages/Home/LanguageSelector/*` → `src/components/LanguageSelector/*` | Mover el selector al propietario compartido y ajustar imports sin cambiar su contrato. | AC-05, AC-10, AC-12, AC-13 |
| `src/pages/About/index.tsx`, `styles.scss` | Crear la página estática traducida. | AC-02, AC-03, AC-04, AC-10, AC-12 |
| `src/pages/NotFound/index.tsx`, `styles.scss` | Crear página desconocida traducida con retorno a `/`. | AC-09, AC-10, AC-12 |
| `src/pages/Home/index.tsx`, `useHome.ts` | Retirar la propiedad visual del selector, usar `Loading` en esperas y preservar idioma de consultas. | AC-05, AC-10, AC-11, AC-13 |
| `src/pages/Home/StatusMessage/index.tsx`, `types.ts`, `styles.scss` | Retirar el tono/indicador de carga ahora compartido, preservando estados neutral, vacío y error. | AC-05, AC-13 |
| `src/locales/es/common.json`, `src/locales/en/common.json`, `src/locales/it/common.json` | Añadir claves equivalentes para navegación, carga de página, «Acerca de» y «No encontrada». | AC-03, AC-05, AC-09, AC-10 |
| `tests/app/App/index.test.tsx`, `tests/app/App/lazy-loading.test.tsx` | Cubrir resolución de rutas, navegación, historial, carga diferida controlada, idioma global, reinicio de `Home` y ausencia de consulta desde «Acerca de». | AC-01 a AC-11, AC-13 |
| `tests/layouts/AppLayout/index.test.tsx` | Cubrir shell persistente, fallback limitado al contenido y cambio de idioma. | AC-05, AC-10, AC-12 |
| `tests/components/AppNavigation/index.test.tsx` | Cubrir enlaces, `aria-current`, coincidencia exacta, teclado y traducciones. | AC-01, AC-02, AC-07, AC-10, AC-12 |
| `tests/components/Loading/index.test.tsx` | Cubrir mensaje, status polite, estado busy e indicador decorativo. | AC-05, AC-10, AC-12 |
| `tests/pages/Home/LanguageSelector/*` → `tests/components/LanguageSelector/*` | Mover la prueba espejo y conservar sus contratos existentes. | AC-10, AC-12, AC-13 |
| `tests/pages/About/index.test.tsx`, `tests/pages/NotFound/index.test.tsx` | Cubrir contenido traducido, ausencia de consulta y enlace de retorno. | AC-03, AC-09, AC-10, AC-12 |
| `tests/pages/Home/index.test.tsx`, `tests/pages/Home/StatusMessage/index.test.tsx` | Adaptar propiedad del selector/carga y conservar la matriz meteorológica existente. | AC-05, AC-10, AC-11, AC-13 |

No se prevén cambios en APIs, store, mocks, fixtures ni adaptadores de Open-Meteo. Tampoco se crearán tipos, hooks, constantes o utilidades vacíos o sin una responsabilidad actual.

## Dependencias e instalaciones

- Runtime requerido: Node `22.22.0`.
- Si Node `22.22.0` no está disponible localmente, su instalación mediante nvm requerirá la autorización de implementación prevista por este plan.
- Activación prevista: `nvm use 22.22.0`.
- Dependencia nueva: `react-router@8.3.0`.
- Instalación prevista: `npm install react-router@8.3.0`.
- El lockfile fijará la resolución exacta. No se instalará `react-router-dom`, `@react-router/dev`, un framework de routing ni una librería de spinners.
- No se actualizarán globalmente npm ni las dependencias existentes.

## Estrategia de pruebas

- `App`: usar `MemoryRouter` para iniciar en `/`, `/acerca-de` y una ruta desconocida; verificar página y navegación activas sin depender de `window.history` global.
- Carga diferida: controlar la resolución de una importación dinámica mediante mock asíncrono, comprobar primero el `Loading` accesible y después la página. Verificar que el módulo de una ruta no visitada no se solicita y que una ruta ya resuelta no repite su carga durante la misma instancia.
- Navegación: utilizar `user-event` sobre enlaces nativos para comprobar cambios de página, retorno, historial representado por entradas de memoria y ausencia de recarga completa.
- `AppNavigation`: comprobar propósito del `nav`, nombres de enlaces, coincidencia exacta de `/`, `aria-current="page"`, foco y etiquetas en los tres idiomas.
- `Loading`: comprobar texto visible, `role="status"`, `aria-live="polite"`, `aria-busy="true"` e indicador oculto para tecnología de asistencia.
- `AppLayout`: comprobar que navegación y selector continúan presentes mientras el contenido suspende, y que cambiar idioma actualiza navegación, fallback y `document.lang`.
- `About`: comprobar marca, propósito, traducciones y ausencia de llamadas a Open-Meteo.
- `NotFound`: comprobar mensaje traducido y navegación accesible de regreso a `/`.
- `Home`: conservar la matriz existente de inicial, validación, carga, vacío, error y éxito; mover al nivel de `App` solo las expectativas cuya propiedad pasa al shell, y activar i18next de forma explícita cuando una prueba aislada de `Home` necesite otro idioma.
- Reinicio: completar una búsqueda, navegar fuera y regresar; verificar estado inicial y ausencia de término, resultados, localidad y meteorología previos.
- Recursos i18n: mantener paridad exacta y valores no vacíos en los tres catálogos tras añadir las nuevas claves.
- Build: confirmar que Vite emite artefactos separados para las páginas y que el paquete inicial no contiene los módulos exclusivos de `About` o `NotFound`; no exigir nombres hash concretos.
- Manual con throttling: en `npm run dev:mocks`, desactivar caché y limitar la red para observar el fallback sin retardos de producción; comprobar que navegación y selector permanecen utilizables.
- Manual de red: iniciar en `/`, confirmar ausencia de recursos exclusivos de rutas no visitadas, visitar `/acerca-de`, comprobar una única carga durante esa instancia y regresar mediante navegación y controles del navegador.
- Acceso directo: abrir y recargar `/` y `/acerca-de` con Vite dev y preview. Registrar que un alojamiento futuro necesitará fallback a `index.html`.
- Responsive y accesibilidad: comprobar a 320, 360, 768 y 1280 px, además de zoom al 200 %, sin solapamientos ni scroll horizontal y con foco visible.
- Regresión completa: ejecutar `npm run check` con Node `22.22.0`.

## Tareas

1. Activar o, si está autorizado y resulta necesario, instalar Node `22.22.0`; actualizar `.nvmrc` y el engine del proyecto.
2. Instalar exclusivamente `react-router@8.3.0` y revisar el diff de manifiesto y lockfile.
3. Cargar `react-ts-feature-pattern` en modo `strict` y registrar el inventario de componentes nuevos y materialmente refactorizados.
4. Mover `LanguageSelector` y su prueba espejo al área compartida, ajustando imports sin cambiar su API ni comportamiento.
5. Crear `Loading` y reutilizarlo en los estados de carga existentes de `Home`; reducir `StatusMessage` a los tonos que conserva.
6. Crear `AppNavigation` y `AppLayout` con idioma global, navegación activa y frontera de carga limitada al contenido.
7. Crear `About` y `NotFound` con textos de los tres catálogos.
8. Crear `App`, rutas constantes e importaciones dinámicas con declaraciones `lazy` estables; montar `BrowserRouter` desde `main.tsx`.
9. Adaptar `Home` y `useHome` al shell compartido sin alterar búsquedas, RTK Query ni presentación meteorológica.
10. Crear o ajustar las pruebas espejo e integración descritas, con resolución diferida controlada y aislamiento de i18next, store, mocks y módulos.
11. Ejecutar la revisión Sonar-like y la deduplicación segura sobre componentes, rutas, paths, estados de carga y contratos movidos; no abstraer adaptadores `lazy` si la extracción añade complejidad sin un propietario claro.
12. Activar Node `22.22.0`, ejecutar `npm run check` y corregir únicamente fallos causados por el alcance autorizado.
13. Ejecutar build y comprobaciones manuales de chunks, fallback, navegación, acceso directo, idiomas, accesibilidad y responsive.
14. Si todas las comprobaciones son satisfactorias, registrar evidencias y pasar especificación y plan a `IMPLEMENTED`; no pasar a `VALIDATED` sin revisión y aceptación expresa.

## Evidencias de implementación

- Aceptación: la persona responsable validó expresamente la implementación el 2026-08-23 y autorizó crear los commits, publicarlos y fusionarlos en `main`.

- Toolchain reproducible: `.nvmrc` fija Node `22.22.0`, `package.json` exige `>=22.22.0` y el lockfile resuelve `react-router` `8.3.0` sin instalar `react-router-dom`.
- Calidad automatizada: `npm run check` con Node `22.22.0` finaliza correctamente con 22 archivos de prueba y 57 pruebas superadas, lint sin incidencias, TypeScript estricto y build de producción satisfactorio.
- Carga bajo demanda: la prueba `tests/app/App/lazy-loading.test.tsx` demuestra que `About` y `NotFound` no se importan antes de visitarse y que `About` se resuelve una sola vez al salir y volver. La prueba controlada de `AppLayout` demuestra el fallback accesible con el shell operativo.
- Separación de bundles: Vite transforma 157 módulos y emite artefactos JavaScript independientes para `Home`, `About` y `NotFound`, además de sus estilos, sin depender de nombres hash concretos.
- Navegación e historial: las pruebas cubren navegación por enlaces, coincidencia exacta, `aria-current="page"`, entradas Atrás/Adelante, acceso directo a `/acerca-de`, ruta desconocida y retorno a `/`.
- Estado e idioma: las pruebas cubren el reinicio de `Home`, el selector global, el idioma del documento y textos en español, inglés e italiano; la matriz i18n mantiene 60 claves equivalentes y no vacías por catálogo.
- Comprobación en navegador interno con `npm run dev:mocks`: se observaron el fallback «Cargando página…» con navegación y selector presentes, las rutas `/`, `/acerca-de` y una ruta desconocida, cambio de idioma, página activa y acceso directo. No aparecieron errores ni avisos de consola.
- Responsive: navegación, selector y contenido permanecieron visibles y sin desplazamiento horizontal a 320, 360, 768 y 1280 px; también se comprobó el reflow equivalente a 1280 px con ampliación al 200 % mediante un viewport CSS de 640 px. El foco y la activación por teclado están cubiertos de forma automatizada.
- Revisión `react-ts-feature-pattern` en modo `strict`: exports nombrados, tipos dedicados donde existen props, componentes y pruebas espejo. La deduplicación consolidó rutas, selector de idioma y estados de carga en sus propietarios compartidos y retiró el fondo duplicado de `Home`.
- Límite conservado: no existe configuración de alojamiento en el repositorio. El acceso directo queda comprobado con Vite; un despliegue futuro seguirá necesitando fallback de SPA a `index.html` y deberá validarse en ese entorno.

| Criterio | Evidencia principal | Resultado de implementación |
| --- | --- | --- |
| AC-01 a AC-03 | Router, navegación, `Home`, `About` y pruebas de integración | Cumplido |
| AC-04 a AC-06 | `React.lazy`, `Suspense`, prueba de importación controlada y chunks separados | Cumplido |
| AC-07 a AC-09 | Pruebas de historial, acceso directo y `NotFound`; comprobación en navegador | Cumplido |
| AC-10 y AC-11 | Shell i18n global y prueba de reinicio de `Home` | Cumplido |
| AC-12 | Semántica, teclado y comprobaciones responsive | Cumplido |
| AC-13 | Matriz meteorológica existente y `npm run check` completo | Cumplido |

## Riesgos, reversión y validación

- Riesgo de toolchain: el shell actual de Codex usa Node `20.19.0`, aunque `.nvmrc` fija `22.20.0`; toda instalación y validación debe comenzar activando `22.22.0` para no generar un lockfile con un runtime incorrecto.
- Riesgo de compatibilidad: React Router 8 eleva la línea base de Node. La actualización se limita a Node y no autoriza actualizar Vite, React, TypeScript, npm ni otras dependencias.
- Riesgo de carga observable: el módulo puede resolverse antes de que una persona perciba el fallback. La prueba usará una promesa controlada y la comprobación manual throttling, sin introducir temporizadores de producción.
- Riesgo de agrupación: Vite puede extraer dependencias compartidas. La validación exigirá separación de módulos exclusivos de página, no una topología o nombre exacto de todos los chunks.
- Riesgo de caché: la pestaña Network puede mostrar caché del navegador tras una recarga distinta. AC-06 se verificará primero dentro de la misma instancia, donde `lazy` conserva la promesa y el módulo resuelto.
- Riesgo de acceso directo: Vite admite el flujo local, pero un host futuro puede responder 404 sin fallback a `index.html`; no se declarará validado un proveedor no configurado.
- Riesgo de regresión: mover `LanguageSelector` y compartir `Loading` cambia propietarios y rutas de importación. Se preservarán sus contratos públicos y se migrarán sus pruebas antes de borrar las ubicaciones anteriores.
- Riesgo de estado: el store de RTK Query sobrevive a la navegación, pero la UI de `Home` debe reiniciarse porque término y selección son locales; las pruebas verificarán el resultado observable, no el contenido interno de la caché.
- Riesgo de error de módulo: un rechazo de la importación dinámica no tendrá recuperación específica porque la especificación lo excluye. Se documentará el límite y no se añadirá silenciosamente un error boundary o reintento.
- Reversión: retirar `BrowserRouter`, `App`, layout, navegación y páginas nuevas; restaurar el montaje directo de `Home`; devolver `LanguageSelector` y su prueba a `Home`; restaurar la rama de carga de `StatusMessage`; retirar traducciones nuevas y `react-router`; restaurar Node `22.20.0` y regenerar el lockfile con el manifiesto anterior.
- Comandos de validación previstos: `nvm use 22.22.0`, `npm run check`, `npm run dev:mocks` y `npm run preview` después de un build satisfactorio.
- Evidencias necesarias para pasar a `IMPLEMENTED`: instalación y toolchain reproducibles; lint, pruebas y build satisfactorios; matriz AC-01–AC-13 cubierta; módulos de página separados; fallback accesible determinista; historial, acceso directo y no encontrada correctos; idioma global; reinicio de `Home`; revisión responsive y ausencia de regresiones meteorológicas.
- Evidencias necesarias para pasar a `VALIDATED`: revisión de las evidencias de implementación, comprobación funcional de navegación y carga bajo demanda, confirmación del comportamiento en un entorno compatible con SPA y aceptación expresa de la persona responsable.
