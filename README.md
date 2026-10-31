# Clima Vista

**Demo:** <https://clima-vista.vercel.app>

Aplicación web de página única (SPA) para buscar una localidad y consultar su **tiempo actual** y la **previsión de los próximos siete días**, con datos de [Open-Meteo](https://open-meteo.com/). No necesita backend propio ni claves de API.

## Qué hace

- **Búsqueda de localidades** con Open-Meteo Geocoding. Cada resultado muestra el nombre, la región y el país.
- **Tiempo actual:** temperatura, sensación térmica, humedad, viento y estado meteorológico con iconos SVG propios.
- **Previsión de 7 días:** temperaturas máxima y mínima y probabilidad de precipitación de cada día.
- **Estados claros de la interfaz:** inicial, carga, sin resultados, error recuperable y éxito, comunicados también a lectores de pantalla.
- **Tres idiomas:** español, inglés e italiano, con un selector de idioma compacto en la cabecera. La app recuerda la elección y, la primera vez, usa el idioma del navegador si está soportado.
- **Navegación** entre páginas (Inicio, Acerca de y página 404) con carga diferida de rutas.

## Stack

- **React 19** funcional y **TypeScript** estricto, con **Vite**.
- **Redux Toolkit Query** para las consultas a Open-Meteo: datos, carga, errores y caché.
- **React Router** para la navegación.
- **i18next** y **react-i18next** para la internacionalización.
- **Sass/SCSS** para los estilos.
- **Vitest**, **React Testing Library**, **user-event** y **jsdom** para los tests.
- **Mock Service Worker (MSW)** para simular la API en desarrollo y en las pruebas.
- **ESLint** para el análisis estático.
- **GitHub Actions** ejecuta tests con cobertura (umbral mínimo del 95 %), lint y build en cada push y pull request.

## Puesta en marcha

Requiere Node.js 22.22 o posterior (la versión está fijada en `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Para trabajar sin conexión a Open-Meteo, con respuestas simuladas por MSW:

```bash
npm run dev:mocks
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo |
| `npm run dev:mocks` | Arranca el desarrollo con la API simulada (MSW) |
| `npm test` | Ejecuta los tests |
| `npm run test:coverage` | Ejecuta los tests con informe de cobertura (`coverage/index.html`) |
| `npm run lint` | Ejecuta ESLint |
| `npm run build` | Compila la versión de producción |
| `npm run check` | Lint, tests y build en un solo paso |

## Estructura

```
src/
  app/          Configuración de la app, rutas y store de Redux
  pages/        Páginas: Home (búsqueda, tiempo actual y previsión), About y NotFound
  components/   Componentes compartidos: navegación, selector de idioma y carga
  layouts/      Layout común de la aplicación
  services/     Clientes de Open-Meteo (geocodificación y previsión) con RTK Query
  i18n/         Configuración de idiomas
  locales/      Traducciones (es, en, it)
tests/          Tests, con la misma estructura que src/
mocks/          Handlers y datos de ejemplo de MSW
specs/          Especificaciones de cada funcionalidad
docs/           Flujo de trabajo SDD y decisiones de arquitectura
```

## Cómo se ha desarrollado

El proyecto sigue **Spec-Driven Development (SDD)**. Cada funcionalidad empieza con una especificación con criterios de aceptación en `specs/`, después un plan técnico y, por último, la implementación con sus tests. Las decisiones de arquitectura están documentadas en `docs/architecture/decisions/`.

Funcionalidades especificadas e implementadas:

1. Consulta meteorológica por localidad
2. Cambio de idioma
3. Idioma italiano
4. Navegación entre páginas
5. Alineación visual de la página Acerca de
6. Selector de idioma compacto
7. Cobertura de pruebas en CI
8. Publicación web pública
9. Calidad en CI y mantenimiento
10. Idioma inicial: recuerdo y detección

## Despliegue

La aplicación se publica en **Vercel**: cada push a `main` genera un despliegue de producción. La configuración está en `vercel.json`, que además redirige las rutas de la SPA a `index.html` para que los enlaces directos, como `/acerca-de`, funcionen al recargar.

Demo: **<https://clima-vista.vercel.app>**

## Datos

Los datos meteorológicos y de geocodificación proceden de la API gratuita de [Open-Meteo](https://open-meteo.com/), que no requiere registro ni clave.
