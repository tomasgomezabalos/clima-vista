# FEAT-007 — Cobertura de pruebas en GitHub Actions

**Estado:** IMPLEMENTED

**Fecha:** 2026-08-24

**Revisión:** 2026-08-24

**Aprobación:** Revisión para GitHub Actions aprobada el 2026-08-24; versión GitLab aprobada el 2026-08-24

**Implementación previa:** 2026-08-24 para GitLab CI; pendiente de sustitución

**Implementación:** Sustitución por GitHub Actions completada el 2026-08-24

## Problema y resultado esperado

El proyecto dispone de pruebas automatizadas y de un comando local para medir cobertura, pero el repositorio se aloja en GitHub y no existirá un pipeline de GitLab. La configuración de GitLab CI implementada anteriormente no puede ejecutarse ni aportar resultados observables.

El equipo de desarrollo necesita conservar la medición local y ejecutarla automáticamente en la plataforma real del repositorio. Cada ejecución debe mostrar porcentajes comprensibles y conservar un informe navegable descargable desde GitHub Actions.

## Alcance

- Mantener un único comando local, no interactivo y reproducible que ejecute toda la suite de pruebas con cobertura.
- Medir líneas, funciones, ramas y sentencias del código de aplicación elegible situado en `src/`, incluidos los archivos elegibles que ninguna prueba llegue a importar.
- Mostrar al finalizar una tabla con el porcentaje total y el desglose por archivo.
- Incorporar un workflow de GitHub Actions que instale las dependencias de forma reproducible y ejecute el mismo comando de cobertura.
- Ejecutar el workflow en pushes a ramas y en pull requests.
- Mostrar los porcentajes de cobertura en el log del job y conservar el informe HTML como artefacto descargable.
- Hacer fallar el job cuando falle una prueba o no se pueda generar el informe requerido.
- Mantener la medición actual como línea base informativa, sin imponer inicialmente un porcentaje mínimo.
- Retirar la configuración de GitLab CI y sus referencias, porque no existirá un pipeline de GitLab.

## Fuera de alcance

- Crear, configurar o validar un repositorio o pipeline de GitLab.
- Mantener `.gitlab-ci.yml` como configuración de ejemplo sin un consumidor real.
- Añadir, eliminar o modificar pruebas para elevar la cobertura.
- Fijar umbrales mínimos o bloquear el workflow únicamente por una reducción del porcentaje mientras no se apruebe una línea base.
- Cambiar el comportamiento funcional, la interfaz o el código de producción de la aplicación.
- Incorporar servicios externos de análisis de cobertura.
- Publicar comentarios automáticos, anotaciones línea por línea, insignias o reglas de aprobación.
- Incorporar despliegues u otros controles de calidad al workflow.

## Flujo principal

1. Una persona desarrolladora ejecuta el comando local o publica un cambio que inicia GitHub Actions.
2. El entorno instala o utiliza las dependencias declaradas y ejecuta toda la suite una sola vez con cobertura.
3. La ejecución muestra el resultado de las pruebas y los porcentajes de líneas, funciones, ramas y sentencias.
4. GitHub Actions conserva el informe HTML como artefacto del job.
5. La persona desarrolladora consulta el resumen en el log o descarga el informe para revisar el desglose.

## Escenarios y criterios de aceptación

### AC-01 — Medición local reproducible

- **Dado** un checkout con las dependencias declaradas instaladas
- **Cuando** una persona ejecuta el comando documentado de cobertura
- **Entonces** se ejecuta toda la suite en modo no interactivo
- **Y** la terminal muestra los porcentajes totales de líneas, funciones, ramas y sentencias
- **Y** se genera un informe navegable en HTML

### AC-02 — Cobertura representativa del código fuente

- **Dado** que existen archivos TypeScript o TSX de aplicación dentro de `src/`
- **Cuando** finaliza la medición
- **Entonces** el informe considera todos los archivos elegibles del código de aplicación
- **Y** los archivos elegibles no ejecutados aparecen con cobertura nula en lugar de omitirse
- **Y** quedan fuera pruebas, configuración, declaraciones de tipos sin código ejecutable y artefactos generados

### AC-03 — Ejecución automatizada en GitHub

- **Dado** un push a una rama o un pull request
- **Cuando** GitHub Actions inicia el workflow de cobertura
- **Entonces** utiliza una versión de Node.js compatible con la declarada por el proyecto
- **Y** instala las dependencias a partir del lockfile sin actualizarlas implícitamente
- **Y** ejecuta el mismo comando de cobertura disponible localmente

### AC-04 — Resultado consultable en GitHub Actions

- **Dado** que el job genera correctamente el informe
- **Cuando** una persona consulta la ejecución
- **Entonces** el log muestra los cuatro porcentajes de cobertura
- **Y** el informe HTML completo queda disponible como artefacto descargable durante un periodo limitado

### AC-05 — Propagación de fallos

- **Dado** que una prueba falla o el informe requerido no puede generarse
- **Cuando** se ejecuta el comando local o el job de GitHub Actions
- **Entonces** la ejecución termina con estado fallido
- **Y** no comunica como correcto un resultado de cobertura incompleto

### AC-06 — Línea base sin umbral inicial

- **Dado** que todavía no existe un umbral aprobado
- **Cuando** las pruebas terminan correctamente y se genera el informe
- **Entonces** el job no falla únicamente porque un porcentaje sea bajo
- **Y** los porcentajes quedan disponibles para decidir posteriormente si se aprueba un umbral

### AC-07 — Eliminación de la configuración sin consumidor

- **Dado** que el repositorio utiliza GitHub y no tendrá pipeline de GitLab
- **Cuando** se complete la sustitución
- **Entonces** no permanece `.gitlab-ci.yml` ni documentación que prometa publicación o validación en GitLab
- **Y** la automatización de cobertura queda ubicada en la configuración propia de GitHub Actions

## Requisitos transversales aplicables

- Accesibilidad: no aplica a la interfaz; los resultados estarán disponibles como texto en el log y en un informe HTML navegable.
- Responsive: no aplica; no se modifica ninguna interfaz de usuario.
- Internacionalización: no aplica; no se incorporan textos a la aplicación ni se altera su idioma.
- Carga, vacío y error: el job distinguirá mediante su estado entre ejecución correcta y fallo de pruebas, instalación o generación del informe.

## Supuestos, riesgos y cuestiones abiertas

- **Decisión:** GitHub Actions sustituirá a GitLab CI porque `origin` apunta a GitHub y se ha confirmado que no existirá pipeline de GitLab.
- **Decisión:** se conservarán el proveedor V8, el comando local, el alcance completo de `src/` y la línea base ya obtenida.
- **Decisión:** la primera medición seguirá siendo informativa y no incluirá umbrales mínimos.
- **Riesgo:** incluir archivos no ejecutados puede producir una cifra inferior a la esperada, pero evita una cobertura artificialmente alta.
- **Riesgo:** los artefactos de GitHub Actions se entregan como archivos descargables; la navegación del HTML requiere descargar y extraer el artefacto.
- **Abierta:** concretar en el plan técnico la versión de las acciones oficiales y la duración de retención, verificándolas contra la documentación vigente de GitHub.
