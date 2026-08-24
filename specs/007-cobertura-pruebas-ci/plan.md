# Plan técnico — FEAT-007 Cobertura de pruebas en GitHub Actions

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-24

**Revisión:** 2026-08-24

**Aprobación:** Revisión de la prueba no determinista aprobada el 2026-08-24; sustitución por GitHub Actions aprobada el 2026-08-24

**Plan anterior:** implementación de GitLab CI aprobada y ejecutada el 2026-08-24; pendiente de sustitución

**Implementación:** Sustitución por GitHub Actions y corrección de la prueba no determinista completadas el 2026-08-24

## Especificación y alcance autorizado

- Especificación: `specs/007-cobertura-pruebas-ci/spec.md`, revisión para GitHub Actions aprobada el 2026-08-24.
- Criterios cubiertos: AC-01 a AC-07.
- Alcance técnico: conservar la cobertura V8 local ya implementada, retirar la configuración sin consumidor de GitLab, crear un workflow de GitHub Actions para push y pull request, publicar el informe HTML y actualizar la documentación y trazabilidad.
- Fuera de alcance: cambiar pruebas o aplicación, imponer umbrales, añadir servicios de cobertura, comentarios automáticos, anotaciones por línea, insignias, reglas de aprobación, despliegues u otros controles de calidad.
- La aprobación de la especificación autoriza este plan. La sustitución requiere la aprobación expresa posterior del plan y una orden expresa de implementar.

## Decisiones y diseño

### Cobertura conservada

- Se conservarán `@vitest/coverage-v8`, `test:coverage`, la inclusión explícita de `src/**/*.{ts,tsx}`, las exclusiones de declaraciones puras y los reporters `text` y `html`.
- Se retirará únicamente el reporter `cobertura`, porque GitHub Actions no lo consumirá y la especificación excluye integraciones externas y anotaciones por línea.
- `coverage/` seguirá ignorado por Git y ESLint.
- No se añadirán umbrales. La línea base continúa siendo informativa.

### Workflow de GitHub Actions

- Se creará `.github/workflows/coverage.yml` con nombre `Coverage` y un único job `coverage` sobre `ubuntu-latest`.
- Los eventos serán `push` y `pull_request` sin limitar ramas. Esto verifica todos los cambios publicados y evita asumir una política de ramas no documentada.
- El token declarará únicamente `permissions: contents: read`; el workflow no requiere escribir en el repositorio, comentar ni acceder a secretos.
- `actions/checkout`, `actions/setup-node` y `actions/upload-artifact` quedarán fijadas a SHAs completos de tags oficiales verificados. GitHub considera el SHA completo la única referencia inmutable para una acción.
- Versiones verificadas el 2026-08-24:
  - `actions/checkout` `v7.0.0`: `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0`.
  - `actions/setup-node` `v7.0.0`: `820762786026740c76f36085b0efc47a31fe5020`.
  - `actions/upload-artifact` `v7.0.1`: `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`.
- Cada SHA llevará un comentario con su tag para facilitar auditoría y actualizaciones controladas.
- `setup-node` leerá `.nvmrc` mediante `node-version-file` y activará caché de npm basada en `package-lock.json`. La caché almacenará descargas de npm, no `node_modules`.
- El job ejecutará `npm ci` y después `npm run test:coverage`; no duplicará flags ni ejecutará una segunda suite.

### Publicación del informe

- `actions/upload-artifact` publicará `coverage/` con nombre `coverage-report` y retención de 14 días.
- El paso de subida usará `if: always()` para conservar un informe parcial si Vitest llegó a generarlo antes de fallar.
- `if-no-files-found: error` impedirá que una ejecución sin informe termine como correcta cuando las pruebas sí hayan finalizado.
- Los cuatro porcentajes permanecerán visibles en el log generado por el reporter `text`; no se añadirá un parser o script duplicado para el resumen.

### Determinismo de la prueba de carga

- La ejecución real `32701419996` demostró que `tests/pages/Home/index.test.tsx` consulta de forma síncrona el rol `status` después de iniciar la búsqueda inglesa, mientras el handler específico responde sin demora y puede completar la petición antes de la aserción.
- El handler local de ese escenario pasará a ser asíncrono e incorporará una demora controlada antes de devolver la fixture. Así la prueba podrá observar de forma determinista el estado transitorio que pretende proteger.
- No se añadirá espera arbitraria a la aplicación ni se relajará la aserción; la demora pertenecerá exclusivamente al doble HTTP de la prueba.
- No se modificarán fixtures, handlers compartidos, código de producción ni contratos observables.

### Sustitución y documentación

- Se eliminará `.gitlab-ci.yml`; no se conservará como plantilla sin consumidor.
- El README sustituirá las referencias a GitLab por el workflow real de GitHub Actions y explicará que el artefacto debe descargarse y extraerse para abrir `index.html`.
- La especificación y el plan conservarán la trazabilidad de la implementación anterior, pero sus estados finales reflejarán exclusivamente la solución GitHub vigente.

### Trazabilidad y deduplicación

- `package.json` seguirá siendo el único punto de entrada de cobertura.
- `vite.config.ts` seguirá siendo el único propietario del proveedor, alcance y reporters.
- El workflow solo orquestará instalación, ejecución y publicación.
- No aplica `@react-ts-feature-pattern`: no se tocarán componentes ni archivos de `src/`.

### Alternativas descartadas

- Conservar GitLab CI: no tendrá pipeline ni consumidor real.
- Dejar solo el comando local: perdería la automatización solicitada y no aprovecharía el remoto GitHub existente.
- Usar tags móviles como `@v7`: son cómodos, pero un SHA completo reduce el riesgo de cadena de suministro y puede cumplir políticas estrictas del repositorio.
- Añadir una acción externa de cobertura: aumentaría permisos, dependencias y exposición sin necesidad para mostrar el resultado actual.
- Generar comentarios de pull request mediante scripts propios: exigiría permisos de escritura y mantenimiento adicional, expresamente fuera de alcance.
- Ejecutar también `npm run check` en este workflow: repetiría la suite de pruebas dentro del mismo job. Otros controles de CI deberán definirse como alcance independiente si se necesitan.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `.gitlab-ci.yml` | Eliminar la configuración sin consumidor. | AC-07 |
| `.github/workflows/coverage.yml` | Crear el workflow de push y pull request con permisos mínimos, Node desde `.nvmrc`, instalación reproducible, cobertura y artefacto. | AC-03 a AC-07 |
| `vite.config.ts` | Retirar el reporter Cobertura y conservar `text` y `html`. | AC-01, AC-02, AC-04 |
| `README.md` | Sustituir las referencias a GitLab por GitHub Actions y documentar la descarga del HTML. | AC-01, AC-04, AC-07 |
| `tests/pages/Home/index.test.tsx` | Hacer asíncrono el handler del escenario inglés y demorar su respuesta para observar de forma determinista el estado de carga. | AC-03, AC-05 |
| `specs/007-cobertura-pruebas-ci/spec.md` | Registrar la sustitución implementada y posteriormente validada. | Trazabilidad SDD |
| `specs/007-cobertura-pruebas-ci/plan.md` | Registrar comprobaciones locales, ejecución remota y estados. | AC-01 a AC-07 |

No se prevén cambios en `package.json`, `package-lock.json`, `.gitignore`, `eslint.config.js`, `src/`, otros archivos de `tests/` ni `mocks/`.

## Dependencias e instalaciones

- Ninguna dependencia npm nueva.
- Acciones oficiales reutilizadas, fijadas a los SHAs completos enumerados.
- No se instalarán herramientas globales ni se modificarán dependencias de producción o desarrollo.

## Estrategia de pruebas

- Cobertura local: ejecutar `npm run test:coverage` con Node `22.22.0`; confirmar las 57 pruebas, las cuatro métricas y `coverage/index.html` no vacío.
- Alcance: confirmar que los 32 archivos ejecutables elegibles de `src/` siguen incluidos y que `src/main.tsx` mantiene cobertura nula.
- Regresión: ejecutar `npm run check` y exigir lint sin avisos, suite, TypeScript y build correctos.
- Prueba enfocada: ejecutar repetidamente el escenario de cambio a inglés y búsqueda posterior para confirmar que el estado de carga y el resultado final son estables.
- YAML: analizar el workflow y comprobar eventos, permisos, runner, acciones, SHAs, Node, caché, comandos, artefacto y retención.
- Seguridad: contrastar los SHAs mediante `git ls-remote` contra los tags de los repositorios oficiales y comprobar que no se solicitan permisos de escritura ni secretos.
- GitHub real: después del push, esperar la ejecución `Coverage`, comprobar conclusión correcta y verificar mediante GitHub que el artefacto `coverage-report` existe y caduca conforme a la retención configurada.
- Pull requests: validar estructuralmente el trigger `pull_request`; no se creará un pull request artificial únicamente para probar el evento.
- Deduplicación: revisar scripts, configuración y workflows hermanos para confirmar que no existe otro flujo equivalente.

## Tareas

1. Confirmar aprobación del plan y autorización expresa para implementar.
2. Comprobar que el árbol solo contiene la revisión SDD esperada sobre el commit GitLab anterior.
3. Eliminar `.gitlab-ci.yml` y crear `.github/workflows/coverage.yml` con el diseño aprobado.
4. Retirar el reporter `cobertura` sin alterar proveedor, alcance ni el reporte local HTML.
5. Actualizar el README para GitHub Actions.
6. Hacer determinista el handler HTTP del escenario inglés y ejecutar repetidamente esa prueba enfocada.
7. Ejecutar cobertura y confirmar métricas, archivos elegibles e informe HTML.
8. Ejecutar `npm run check` con Node `22.22.0`.
9. Validar sintaxis, estructura, permisos y SHAs del workflow.
10. Revisar el diff y confirmar ausencia de cambios fuera del alcance.
11. Registrar evidencias locales y pasar especificación y plan a `IMPLEMENTED`.
12. Crear un commit coherente y hacer push a `origin/main`, conforme a la petición vigente de entrega.
13. Esperar una nueva ejecución real de GitHub Actions y comprobar estado y artefacto.
14. Presentar la evidencia remota; no pasar a `VALIDATED` sin aceptación expresa de la persona responsable.

## Evidencias de implementación

- Autorización: la revisión de la especificación, el plan de sustitución y su implementación fueron aprobados expresamente el 2026-08-24.
- Plataforma: `origin` apunta a GitHub y se confirmó expresamente que no existirá pipeline de GitLab; `.gitlab-ci.yml` fue eliminado.
- Workflow: `.github/workflows/coverage.yml` cubre `push` y `pull_request`, usa `ubuntu-latest`, declara únicamente `contents: read` y no consume secretos.
- Acciones: los tres SHAs completos del workflow se contrastaron mediante `git ls-remote` con los tags oficiales `actions/checkout@v7.0.0`, `actions/setup-node@v7.0.0` y `actions/upload-artifact@v7.0.1`.
- Node e instalación: el workflow obtiene la versión desde `.nvmrc`, activa la caché de npm basada en `package-lock.json` y ejecuta `npm ci`.
- Cobertura: `npm run test:coverage` con Node `22.22.0` superó 22 archivos y 57 pruebas y mantuvo la línea base: 94,44 % de sentencias, 87,65 % de ramas, 100 % de funciones y 94,36 % de líneas.
- Alcance: `src/main.tsx` permanece incluido con cobertura nula; `coverage/index.html` y su página de detalle existen y no están vacíos.
- Reporters: Vitest conserva únicamente `text` y `html`; el XML Cobertura específico de GitLab dejó de generarse.
- Artefacto: el workflow publica `coverage/` como `coverage-report`, falla si no encuentra archivos y limita la retención a 14 días.
- Calidad completa: `npm run check` terminó sin errores ni avisos; lint correcto, 22 archivos y 57 pruebas superadas, TypeScript correcto y build de 157 módulos satisfactorio.
- Validación estática: el YAML se analizó correctamente y se verificaron eventos, permisos, runner, acciones, SHAs, Node, caché, comandos y retención.
- Alcance preservado: no cambiaron `package.json`, `package-lock.json`, `.gitignore`, `eslint.config.js`, `src/`, `tests/` ni `mocks/`.
- Ejecución remota: el push `a21929e` activó correctamente `Coverage` en la ejecución `32701419996`; checkout, Node e instalación terminaron correctamente.
- Fallo detectado: la prueba `preserves current weather and localizes only subsequent searches` no encontró el rol `status` porque la respuesta HTTP inglesa terminó antes de la aserción. Al fallar las pruebas no se generó `coverage/` y el paso de artefacto comunicó correctamente su ausencia.
- Corrección: el handler específico del escenario pasó a ser asíncrono y demora 40 ms únicamente la respuesta inglesa; no cambiaron producción, fixtures ni handlers compartidos.
- Prueba enfocada: `tests/pages/Home/index.test.tsx` superó cinco ejecuciones consecutivas, con 10 pruebas correctas en cada una y ningún fallo.
- Revalidación: `npm run test:coverage` mantuvo 57/57 pruebas y la misma línea base; `npm run check` volvió a finalizar sin errores ni avisos y con build satisfactorio.
- Validación pendiente: hacer push y comprobar una nueva ejecución real y su artefacto antes de solicitar aceptación final.

## Riesgos, reversión y validación

- Riesgo de runner: las acciones v7 requieren un runner compatible con Node 24 internamente. `ubuntu-latest` alojado por GitHub es el objetivo soportado; un futuro runner propio deberá cumplir la versión mínima de las acciones.
- Riesgo de SHA obsoleto: el pin inmutable no recibe correcciones automáticamente. Las actualizaciones deberán revisar un nuevo tag oficial y sustituir deliberadamente el SHA.
- Riesgo de almacenamiento: los informes consumen cuota de artefactos. La retención de 14 días limita ese coste.
- Riesgo de fallo: con `if: always()`, una prueba fallida puede quedar acompañada por un fallo adicional si no existe informe. El job seguirá comunicando correctamente un estado fallido y conservará el error original en el paso de pruebas.
- Riesgo de temporización: una respuesta inmediata del mock puede hacer desaparecer el estado transitorio antes de observarlo. La demora controlada se limitará al handler del escenario afectado.
- Riesgo de plataforma: la comprobación local no reproduce completamente GitHub Actions. La ejecución posterior al push será evidencia obligatoria de implementación remota.
- Reversión: eliminar el workflow, restaurar `.gitlab-ci.yml` desde el commit anterior, recuperar el reporter Cobertura y revertir README y artefactos SDD. No existen datos o código de aplicación que migrar.
- Comandos previstos: `nvm use 22.22.0`, `npm run test:coverage`, `npm run check`, validación YAML y consultas de Git/GitHub de solo lectura.
- Evidencias para pasar a `IMPLEMENTED`: diff limitado; prueba enfocada estable; YAML válido; SHAs verificados; permisos mínimos; cobertura y check locales satisfactorios; documentación coherente; ausencia de `.gitlab-ci.yml` y de referencias activas a GitLab fuera de la trazabilidad SDD.
- Evidencias para pasar a `VALIDATED`: commit subido; ejecución `Coverage` correcta en GitHub; artefacto `coverage-report` disponible; revisión de evidencias y aceptación expresa.

## Referencias técnicas

- [Uso seguro de GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use).
- [Artefactos de workflows](https://docs.github.com/actions/configuring-and-managing-workflows/persisting-workflow-data-using-artifacts).
- [actions/checkout](https://github.com/actions/checkout).
- [actions/setup-node](https://github.com/actions/setup-node).
- [actions/upload-artifact](https://github.com/actions/upload-artifact).
