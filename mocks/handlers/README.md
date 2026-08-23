# Handlers

Los handlers de Open-Meteo reproducen el flujo normal y varios escenarios de
FEAT-001 cuando la aplicación se inicia con `npm run dev:mocks`.

| Término de búsqueda | Resultado simulado |
| --- | --- |
| Cualquier localidad, por ejemplo `Madrid` | Dos coincidencias y meteorología completa. |
| `sin resultados` | Búsqueda sin coincidencias. |
| `error busqueda` | Error HTTP de geocodificación. |
| `datos parciales` | Coincidencia con valores meteorológicos aislados no disponibles y código WMO desconocido. |
| `error meteo` | Coincidencia cuya consulta meteorológica devuelve un error HTTP. |
| `respuesta invalida` | Coincidencia cuya previsión contiene solo seis fechas. |
| `carga lenta` | Demora de 1,2 segundos tanto en la búsqueda como en la meteorología. |

Estos términos solo existen en el entorno explícito de mocks. No modifican el
modo normal ni el build de producción.
