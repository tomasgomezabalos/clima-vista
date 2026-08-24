# FEAT-007 — Cobertura de pruebas en GitLab CI

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-24

**Aprobación:** 2026-08-24

**Implementación:** 2026-08-24

## Problema y resultado esperado

El proyecto dispone de pruebas automatizadas, pero actualmente no ofrece un comando reproducible para medir qué parte del código fuente queda cubierta ni una canalización de GitLab CI que ejecute y publique esa medición.

El equipo de desarrollo necesita consultar la cobertura real tanto localmente como en GitLab. Cada ejecución debe mostrar porcentajes comprensibles, conservar un informe descargable y permitir identificar en los cambios de un merge request qué líneas están cubiertas.

## Alcance

- Proporcionar un único comando local, no interactivo y reproducible que ejecute toda la suite de pruebas con cobertura.
- Medir líneas, funciones, ramas y sentencias del código de aplicación elegible situado en `src/`, incluidos los archivos elegibles que ninguna prueba llegue a importar.
- Mostrar al finalizar una tabla resumen con el porcentaje total y el desglose por archivo.
- Incorporar una canalización de GitLab CI que instale las dependencias de forma reproducible y ejecute el comando de cobertura.
- Mostrar el porcentaje total de cobertura en GitLab para el job, el pipeline y los merge requests cuando GitLab disponga de esos contextos.
- Publicar un informe compatible con la visualización de cobertura línea por línea en los cambios de los merge requests.
- Conservar como artefactos descargables el informe interoperable y el informe HTML generado por la ejecución de CI.
- Hacer fallar el job cuando falle una prueba o no se pueda generar o publicar el informe requerido.
- Establecer la medición actual como línea base informativa, sin imponer inicialmente un porcentaje mínimo de cobertura.

## Fuera de alcance

- Añadir, eliminar o modificar pruebas con el objetivo de elevar la cobertura obtenida.
- Fijar umbrales mínimos de cobertura o bloquear el pipeline por una reducción del porcentaje mientras no se apruebe una línea base.
- Cambiar el comportamiento funcional, la interfaz o el código de producción de la aplicación.
- Incorporar servicios externos de análisis de cobertura.
- Crear insignias de cobertura, reglas de aprobación o notificaciones externas.
- Rediseñar otros controles de calidad o incorporar despliegues a la canalización.
- Definir una política general de retención de artefactos distinta de la necesaria para este informe.

## Flujo principal

1. Una persona desarrolladora ejecuta el comando de cobertura local o inicia una canalización en GitLab mediante un cambio del repositorio.
2. El entorno instala o utiliza las dependencias declaradas y ejecuta toda la suite de pruebas una sola vez con la medición activada.
3. La ejecución muestra el resultado de las pruebas y los porcentajes de cobertura de líneas, funciones, ramas y sentencias.
4. En GitLab, el job publica el porcentaje total y conserva los informes generados.
5. Cuando la canalización pertenece a un merge request, GitLab puede presentar anotaciones de cobertura sobre las líneas modificadas.

## Escenarios y criterios de aceptación

### AC-01 — Medición local reproducible

- **Dado** un checkout del repositorio con las dependencias declaradas instaladas
- **Cuando** una persona ejecuta el comando documentado de cobertura
- **Entonces** se ejecuta toda la suite de pruebas en modo no interactivo
- **Y** la terminal muestra los porcentajes totales de líneas, funciones, ramas y sentencias
- **Y** se generan un informe legible en navegador y otro interoperable con GitLab

### AC-02 — Cobertura representativa del código fuente

- **Dado** que existen archivos TypeScript o TSX de aplicación dentro de `src/`
- **Cuando** finaliza la medición
- **Entonces** el informe considera todos los archivos elegibles del código de aplicación
- **Y** los archivos elegibles no ejecutados por ninguna prueba aparecen con cobertura nula en lugar de omitirse
- **Y** quedan fuera los archivos de pruebas, configuración, declaraciones de tipos sin código ejecutable y artefactos generados

### AC-03 — Ejecución automatizada en GitLab

- **Dado** un pipeline originado por una rama o un merge request
- **Cuando** GitLab ejecuta el job de pruebas con cobertura
- **Entonces** utiliza una versión de Node.js compatible con la declarada por el proyecto
- **Y** instala las dependencias a partir del lockfile sin actualizarlas implícitamente
- **Y** ejecuta el mismo comando de cobertura disponible localmente

### AC-04 — Resultado visible en GitLab

- **Dado** que el job de cobertura termina correctamente
- **Cuando** una persona consulta el job, el pipeline o su merge request
- **Entonces** GitLab muestra el porcentaje total de cobertura extraído de la ejecución
- **Y** conserva como artefactos descargables los informes interoperable y HTML
- **Y** el informe interoperable queda registrado como reporte de cobertura de GitLab

### AC-05 — Anotaciones en el merge request

- **Dado** un merge request con líneas modificadas que aparecen en el informe de cobertura
- **Cuando** GitLab termina de procesar un pipeline correcto
- **Entonces** el diff del merge request puede identificar las líneas modificadas cubiertas y no cubiertas
- **Y** las rutas del informe se corresponden con las rutas relativas reales del repositorio

### AC-06 — Propagación de fallos

- **Dado** que una prueba falla o el informe requerido no puede generarse
- **Cuando** se ejecuta el comando local o el job de GitLab
- **Entonces** la ejecución termina con estado fallido
- **Y** no comunica como correcto un resultado de cobertura incompleto

### AC-07 — Línea base sin umbral inicial

- **Dado** que todavía no existe una línea base de cobertura aprobada
- **Cuando** todas las pruebas terminan correctamente y se generan los informes
- **Entonces** el job no falla únicamente porque un porcentaje de cobertura sea bajo
- **Y** los porcentajes obtenidos quedan disponibles para decidir posteriormente si se aprueba un umbral

## Requisitos transversales aplicables

- Accesibilidad: no aplica a la interfaz de la aplicación; los resultados deben estar disponibles como texto en el log y no depender exclusivamente del color de las anotaciones de GitLab.
- Responsive: no aplica; no se modifica ninguna interfaz de usuario.
- Internacionalización: no aplica; no se incorporan textos a la aplicación ni se altera su idioma.
- Carga, vacío y error: el job debe distinguir mediante su estado entre una ejecución correcta y un fallo de pruebas, instalación o generación del informe.

## Supuestos, riesgos y cuestiones abiertas

- **Decisión propuesta:** utilizar la cobertura nativa V8 soportada por Vitest, sujeta a confirmación en el plan técnico.
- **Decisión:** la primera medición será informativa y no incluirá umbrales mínimos.
- **Decisión:** el alcance de la medición incluirá el código elegible de `src/`, aunque no haya sido importado por las pruebas.
- **Riesgo:** incluir archivos no ejecutados puede producir una cifra inferior a la esperada, pero evita presentar una cobertura artificialmente alta.
- **Riesgo:** GitLab procesa las anotaciones de cobertura de forma asíncrona y solo las presenta sobre archivos modificados en el diff del merge request.
- **Riesgo:** la expresión utilizada por GitLab para extraer el porcentaje debe verificarse contra la salida real de la versión instalada de Vitest.
- **Abierta:** concretar en el plan técnico la duración de retención de los artefactos, usando un valor limitado y suficiente para revisar los resultados del pipeline.
