# Plan técnico — FEAT-007 Cobertura de pruebas en GitLab CI

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-24

**Aprobación:** 2026-08-24; revisión de alcance aprobada el 2026-08-24

**Implementación:** 2026-08-24

## Especificación y alcance autorizado

- Especificación: `specs/007-cobertura-pruebas-ci/spec.md`, aprobada el 2026-08-24.
- Criterios cubiertos: AC-01 a AC-07.
- Alcance técnico: incorporar cobertura V8 a Vitest, generar salidas de terminal, HTML y Cobertura, exponer un comando local, crear un job reproducible de GitLab CI y publicar el porcentaje y los informes requeridos.
- Fuera de alcance: modificar pruebas o código de aplicación, elevar artificialmente la cobertura, imponer umbrales, añadir servicios externos, insignias, reglas de aprobación, notificaciones, despliegues u otros controles de calidad.
- La aprobación de la especificación autorizó redactar este plan. La implementación requiere la aprobación expresa posterior del plan y una orden expresa de implementar.

## Decisiones y diseño

### Proveedor y alcance de cobertura

- Se utilizará `@vitest/coverage-v8` con el mismo rango compatible que Vitest (`^4.1.11`) y ambos quedarán resueltos a `4.1.11` en el lockfile. Es el proveedor predeterminado recomendado por Vitest y evita instrumentar previamente el código.
- La configuración residirá en `test.coverage` dentro de `vite.config.ts`, junto a la configuración de pruebas vigente, para que el comando local y GitLab consuman un único contrato.
- `coverage.include` abarcará `src/**/*.{ts,tsx}`. En Vitest 4 esta declaración es necesaria para incluir archivos que las pruebas no cargan.
- Se excluirán declaraciones sin código ejecutable. No se excluirán componentes, hooks, servicios, utilidades ni puntos de entrada por el mero hecho de carecer de pruebas.
- No se activará ningún umbral. Una ejecución con pruebas correctas podrá finalizar correctamente con cualquier porcentaje y establecerá la línea base inicial.

### Reportes y comando local

- Se añadirá `test:coverage` con `vitest run --coverage`. Los scripts `test` y `check` conservarán su comportamiento vigente.
- Vitest generará los reportes `text`, `html` y `cobertura` dentro de `coverage/`.
- `text` mostrará en terminal sentencias, ramas, funciones y líneas, tanto totales como por archivo.
- `html` permitirá inspeccionar localmente el desglose navegable.
- `cobertura` producirá `coverage/cobertura-coverage.xml`, consumido por GitLab para las anotaciones del diff.
- `coverage/` se ignorará en Git para impedir que entren resultados locales en el repositorio.
- `coverage/` se añadirá también a los ignores globales de ESLint. El informe HTML contiene JavaScript generado por Istanbul que no pertenece al código del proyecto; sin esta exclusión, ejecutar cobertura antes de `npm run check` introduce avisos nuevos en lint.
- El README documentará el comando, la salida y la ubicación del informe HTML.

### GitLab CI

- Se creará `.gitlab-ci.yml` con un stage `test` y un job de cobertura basado en `node:22.22.0`, coherente con `.nvmrc` y `package.json`.
- El job ejecutará `npm ci` para respetar exactamente el lockfile y después `npm run test:coverage`, sin ejecutar la suite una segunda vez.
- Se definirán reglas de workflow para pipelines de merge request y rama, evitando duplicar el pipeline de rama cuando exista un merge request abierto. Los tags quedan fuera del alcance.
- La propiedad `coverage` extraerá de la fila `All files` el porcentaje total de líneas. GitLab mostrará esa métrica agregada; las cuatro métricas seguirán disponibles en el log y los informes.
- `artifacts:reports:coverage_report` registrará el XML en formato `cobertura` para anotar los diffs.
- `artifacts.paths` conservará `coverage/` durante 14 días para descargar XML y HTML. Se intentarán recoger los artefactos generados aunque el job falle posteriormente.
- No se añadirá caché de `node_modules`; no hay una necesidad demostrada que justifique su complejidad en este alcance.

### Trazabilidad y deduplicación

- El script de `package.json` será el único punto de entrada para ejecutar cobertura; `.gitlab-ci.yml` no duplicará flags de Vitest.
- `vite.config.ts` será el propietario único del proveedor, alcance y reporters. El YAML se limitará a orquestar y publicar resultados.
- No se modificará la infraestructura de `tests/`, los mocks ni los archivos de `src/`.
- No aplica `@react-ts-feature-pattern`: no se creará ni modificará ningún componente React.

### Alternativas descartadas

- Ejecutar cobertura sin declarar `coverage.include`: Vitest 4 incluiría por defecto solo archivos cargados y podría presentar una cifra artificialmente alta.
- Instalar `@vitest/coverage-istanbul`: es compatible, pero V8 es la opción recomendada para este runtime y ofrece menor coste sin perder precisión de remapeo en Vitest 4.
- Definir toda la configuración mediante flags de GitLab: duplicaría el contrato local y podría producir resultados diferentes fuera de CI.
- Incorporar cobertura a `test` o `check`: encarecería todas las validaciones actuales sin que la especificación lo requiera.
- Utilizar solo Cobertura: permitiría anotaciones de GitLab, pero no la inspección navegable local solicitada.

## Cambios previstos

| Archivo o área | Cambio | Requisito relacionado |
| --- | --- | --- |
| `package.json` | Añadir `test:coverage` y la dependencia de desarrollo `@vitest/coverage-v8`. | AC-01, AC-03 |
| `package-lock.json` | Registrar de forma reproducible el proveedor de cobertura. | AC-01, AC-03 |
| `vite.config.ts` | Configurar V8, la inclusión del código elegible y los reporters `text`, `html` y `cobertura`. | AC-01, AC-02, AC-04, AC-05 |
| `.gitignore` | Ignorar el directorio local `coverage/`. | AC-01 |
| `eslint.config.js` | Excluir de lint los artefactos generados dentro de `coverage/`. | AC-01, AC-06 |
| `.gitlab-ci.yml` | Crear workflow y job; instalar, medir, extraer el porcentaje y publicar informes. | AC-03 a AC-07 |
| `README.md` | Documentar el comando local, las métricas y el informe HTML. | AC-01 |
| `specs/007-cobertura-pruebas-ci/spec.md` | Registrar el estado de implementación cuando existan evidencias. | Trazabilidad SDD |
| `specs/007-cobertura-pruebas-ci/plan.md` | Registrar instalación, comprobaciones, cobertura inicial y estado. | AC-01 a AC-07 |

## Dependencias e instalaciones

- Dependencia nueva: `@vitest/coverage-v8` con rango `^4.1.11` como dependencia de desarrollo, alineada con el rango declarado de Vitest y resuelta a `4.1.11` en el lockfile.
- Instalación prevista: `npm install --save-dev @vitest/coverage-v8@4.1.11` con Node `22.22.0`.
- No se instalarán paquetes globales ni dependencias de producción.

## Estrategia de pruebas

- Regresión: ejecutar `npm run check` y exigir lint, Vitest, TypeScript y build correctos.
- Cobertura local: ejecutar `npm run test:coverage`; comprobar una sola ejecución de la suite, terminación correcta y las cuatro métricas.
- Alcance: contrastar los archivos elegibles de `src/` con el XML para confirmar que aparecen los no ejecutados y que no aparecen pruebas, configuración, declaraciones puras ni resultados generados.
- Reportes: comprobar que `coverage/index.html` y `coverage/cobertura-coverage.xml` existen, no están vacíos y contienen rutas relativas compatibles con el repositorio.
- Extracción de GitLab: verificar la expresión del job contra la salida real de Vitest y confirmar que obtiene exactamente el porcentaje total de líneas.
- Configuración CI: validar sintácticamente `.gitlab-ci.yml` y revisar que las reglas cubren ramas y merge requests sin duplicados previstos.
- Validación remota: el porcentaje, los artefactos y las anotaciones solo podrán confirmarse completamente mediante un pipeline real de GitLab asociado a un merge request.
- Deduplicación segura: revisar scripts, configuración de pruebas y CI para confirmar que no existe otra ruta de cobertura duplicada.

## Tareas

1. Confirmar que este plan está aprobado y que existe autorización expresa para implementar.
2. Activar Node `22.22.0` y comprobar el estado del árbol de trabajo.
3. Instalar `@vitest/coverage-v8@4.1.11` y revisar que el lockfile solo incorpora el grafo esperado.
4. Añadir `test:coverage` sin modificar `test` ni `check`.
5. Configurar en `vite.config.ts` el proveedor, alcance y tres reporters aprobados.
6. Ignorar `coverage/` en Git y ESLint, y documentar su uso en el README.
7. Crear `.gitlab-ci.yml` con workflow, job, extracción del porcentaje y artefactos.
8. Ejecutar la cobertura local, comprobar los informes y registrar los cuatro porcentajes.
9. Verificar el alcance del informe y la extracción del porcentaje de líneas.
10. Ejecutar `npm run check`.
11. Revisar el alcance tocado y sus módulos hermanos para detectar configuración, scripts o contratos duplicados.
12. Revisar el diff y confirmar que no cambiaron pruebas, componentes, aplicación, mocks ni dependencias de producción.
13. Si las comprobaciones locales son satisfactorias, registrar evidencias y pasar especificación y plan a `IMPLEMENTED`; no pasar a `VALIDATED` sin comprobación remota y aceptación expresa.

## Evidencias de implementación

- Autorización: la especificación fue aprobada y se autorizó crear el plan; posteriormente se aprobaron el plan original, su revisión para excluir los artefactos en ESLint y la implementación completa el 2026-08-24.
- Dependencia: `@vitest/coverage-v8` y Vitest comparten el rango `^4.1.11`; `npm ls` confirma que ambos quedan resueltos y deduplicados en `4.1.11`.
- Instalación reproducible: `npm ci` con Node `22.22.0` instaló correctamente las 316 dependencias registradas en el lockfile antes de repetir la cobertura.
- Suite con cobertura: 22 archivos de prueba y 57 pruebas superadas en una única ejecución de `npm run test:coverage`.
- Línea base: 94,44 % de sentencias (255/270), 87,65 % de ramas (142/162), 100 % de funciones (67/67) y 94,36 % de líneas (251/266).
- Alcance: los 32 archivos ejecutables elegibles de `src/` coinciden exactamente con los 32 archivos únicos del XML Cobertura; `src/main.tsx`, no ejecutado por las pruebas, aparece con cobertura nula.
- Reportes: `coverage/index.html` y `coverage/cobertura-coverage.xml` existen y no están vacíos. El XML declara rutas relativas como `src/main.tsx`, compatibles con el repositorio.
- Extracción: la expresión configurada para GitLab se comprobó contra la fila real `All files` y extrajo `94.36`, el porcentaje total de líneas.
- GitLab CI: el YAML se analizó correctamente y contiene el workflow, el job, `npm ci`, el comando único de cobertura, la retención de 14 días y el reporte Cobertura esperado.
- Calidad completa: `npm run check` con Node `22.22.0` finalizó sin errores ni avisos; lint correcto, 22 archivos y 57 pruebas superadas, TypeScript correcto y build de 157 módulos satisfactorio.
- Deduplicación: `package.json` conserva el único comando de entrada, `vite.config.ts` concentra la configuración de cobertura y `.gitlab-ci.yml` solo orquesta y publica; no existe otro flujo equivalente que consolidar.
- Alcance preservado: no se modificaron archivos de `src/`, `tests/` ni `mocks/`, ni dependencias de producción.
- Validación pendiente: el remoto actual es GitHub y no existe contexto de proyecto GitLab disponible en este checkout; por ello no se afirma todavía que GitLab haya publicado el porcentaje, los artefactos o las anotaciones del merge request.

## Riesgos, reversión y validación

- Riesgo de compatibilidad: Vitest y su proveedor deben mantener la misma versión efectiva. Compartirán el rango `^4.1.11` y se comprobará que el lockfile resuelve ambos a `4.1.11`.
- Riesgo de métrica engañosa: omitir archivos no cargados inflaría el porcentaje. La inclusión explícita de `src/**/*.{ts,tsx}` protegerá la línea base.
- Riesgo de extracción: un cambio futuro en la tabla de Vitest podría impedir que GitLab reconozca el porcentaje. La expresión se verificará contra la salida real.
- Riesgo de rutas: GitLab puede omitir anotaciones cuando las rutas Cobertura no coinciden con el repositorio. El XML se inspeccionará antes de entregar.
- Riesgo de validación parcial: sin un pipeline real no se puede confirmar el procesamiento asíncrono ni la interfaz de GitLab. La limitación quedará explícita hasta obtener evidencia remota.
- Riesgo de pipeline: las reglas de workflow condicionarán futuros jobs. Cualquier ampliación de fuentes requerirá actualizar el alcance.
- Reversión: retirar el YAML, el script y la configuración; desinstalar el proveedor restaurando el lockfile; retirar la entrada de `.gitignore` y la documentación. No habrá datos ni aplicación que migrar.
- Comandos previstos: `nvm use 22.22.0`, `npm run test:coverage` y `npm run check`.
- Evidencias para pasar a `IMPLEMENTED`: diff limitado; dependencia alineada; suite correcta; cuatro porcentajes registrados; archivos no ejecutados incluidos; HTML y Cobertura válidos; expresión verificada; YAML válido; `npm run check` satisfactorio y sin avisos causados por los artefactos de cobertura; ausencia de cambios en `src/`, `tests/` y `mocks/`.
- Evidencias para pasar a `VALIDATED`: pipeline real de rama y merge request correcto; porcentaje visible; informes descargables; anotaciones correctas sobre el diff; aceptación expresa de la persona responsable.
