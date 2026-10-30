# FEAT-008 — Publicación web pública

**Estado:** IMPLEMENTED

**Fecha:** 2026-10-30

**Aprobación:** 2026-10-30 (spec, ADR-0005 y plan aprobados expresamente junto con la orden de implementar)

**Implementación:** 2026-10-30; pendiente de primer despliegue y validación sobre la URL pública

## Problema y resultado esperado

Clima Vista solo puede verse ejecutándola en local. Cualquier persona (por ejemplo, recruiters o clientes) debería poder abrirla desde una URL pública, sin instalar nada, y ver siempre la última versión validada de `main`.

## Alcance

- Publicar la build de producción en una URL pública HTTPS.
- Desplegar automáticamente cada push a `main`.
- Servir correctamente las rutas de la SPA al acceder directamente o recargar (`/`, `/acerca-de` y rutas inexistentes, que muestran la página NotFound de la app).
- Mantener MSW fuera de producción: la versión publicada consulta la API real de Open-Meteo.
- Mostrar en la pestaña del navegador un título que identifique la aplicación («Clima Vista») en lugar del nombre de la plantilla.
- Documentar en el README la URL pública y cómo se despliega.

## Fuera de alcance

- Dominio propio, analítica, monitorización o SEO avanzado.
- Despliegues de previsualización por pull request (pueden aprobarse más adelante).
- Cambios funcionales o visuales de la aplicación distintos del título del documento.
- Bloquear el despliegue en función del workflow de cobertura.

## Flujo principal

1. Se integra un cambio en `main`.
2. La plataforma de hosting ejecuta la build de producción con la versión de Node declarada.
3. La nueva versión queda disponible en la URL pública.
4. Una persona abre la URL o un enlace profundo y usa la aplicación con datos reales.

## Escenarios y criterios de aceptación

### AC-01 — Acceso público

- **Dado** el último commit de `main` desplegado
- **Cuando** una persona sin sesión abre la URL pública
- **Entonces** se carga la página de inicio por HTTPS

### AC-02 — Enlaces profundos y recarga

- **Dado** la aplicación publicada
- **Cuando** se abre directamente o se recarga `/acerca-de`
- **Entonces** se muestra la página «Acerca de» y no un error 404 del servidor
- **Y** una ruta inexistente muestra la página NotFound de la aplicación

### AC-03 — Datos reales sin mocks

- **Dado** la aplicación publicada
- **Cuando** se busca una ciudad
- **Entonces** los resultados proceden de Open-Meteo y no se registra el worker de MSW

### AC-04 — Despliegue continuo

- **Dado** un push a `main`
- **Cuando** termina la build
- **Entonces** la URL pública sirve la nueva versión sin intervención manual
- **Y** si la build falla, se mantiene la versión anterior publicada

### AC-05 — Identificación de la aplicación

- **Dado** la aplicación publicada
- **Cuando** se observa la pestaña del navegador
- **Entonces** el título es «Clima Vista»

## Requisitos transversales aplicables

- Accesibilidad: sin cambios; se mantiene la existente.
- Responsive: sin cambios; se verificará manualmente en móvil y escritorio sobre la URL pública.
- Internacionalización: los tres idiomas deben funcionar igual en producción.
- Carga, vacío y error: sin cambios funcionales; los estados existentes se comprobarán contra la API real.

## Supuestos, riesgos y cuestiones abiertas

- **Supuesto:** la API de Open-Meteo es pública, sin clave y admite CORS desde el navegador, por lo que no hacen falta secretos ni backend.
- **Riesgo:** las condiciones de uso gratuito de Open-Meteo son para uso no comercial; adecuado para un portfolio.
- **Decisión:** hosting en Vercel con integración Git (ADR-0005).
