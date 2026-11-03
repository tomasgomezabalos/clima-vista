# ADR-0006 — Verificación automática de accesibilidad

**Estado:** APPROVED

**Fecha:** 2026-11-03

**Aprobación:** 2026-11-03, autorización expresa en el chat por la persona responsable para ejecutar el ciclo SDD completo de FEAT-016 y su ADR-0006 («redacta el ADR y el spec de feature en draft. Implementalo, valídalo. Llévalo hasta validated»), sin revisión previa del texto; autoriza exclusivamente lo enumerado en este documento, incluida la instalación de las dependencias de desarrollo indicadas, y sin commit ni push.

## Contexto

Las auditorías de accesibilidad de FEAT-013, FEAT-014 y FEAT-015 detectaron problemas que ninguna comprobación automática del proyecto podía detectar: `npm run check` ejecuta ESLint sin reglas de accesibilidad y pruebas sin ninguna comprobación de accesibilidad. Una regresión (un botón sin nombre, un elemento no interactivo con manejador de clic, un `alt` ausente) llegaría a producción sin que nada falle.

ADR-0002 permite añadir plugins de ESLint «únicamente cuando una necesidad aprobada lo justifique». Esta decisión introduce dependencias de desarrollo, por lo que debe aprobarse antes de incluirlas en el plan técnico o instalarlas.

Verificado el 2026-11-03 en copias aisladas del proyecto, sin modificarlo:

- `eslint-plugin-jsx-a11y` 6.10.2 (última versión; publicada el 2024-10-26) declara `peerDependencies.eslint` hasta `^9`, y el proyecto usa ESLint 10.9.0. Una instalación normal falla con `ERESOLVE`. Con un `overrides` de npm que fija el peer `eslint` de ese plugin a `$eslint`, `npm install` y `npm ci` funcionan con el `package.json` y el lockfile reales, y las 34 reglas de la configuración recomendada se cargan y se ejecutan; el código actual no produce errores. En un `package.json` mínimo de prueba, el mismo `overrides` hizo fallar a npm 10.9.8 con un error interno (`edgesOut`), por lo que el comportamiento depende del árbol de dependencias.
- `axe-core` ejecutado en Vitest 4.1.11 con jsdom 29.1.1 sobre la aplicación real (`/`, `/acerca-de` y una ruta desconocida) no informa violaciones, pero marca `color-contrast` como regla incompleta: jsdom no calcula el diseño ni los colores renderizados, de modo que el contraste no queda cubierto.
- `vitest-axe` 0.1.0 es compatible con la versión de Vitest del proyecto (peer `>=0.16.0`) y detectó una violación en la prueba; su última versión estable es de 2025-01 y la rama 1.x solo existe como prelanzamiento.

## Decisión

- Incorporar `eslint-plugin-jsx-a11y` como dependencia de desarrollo, con versión exacta fijada en el plan, y aplicar su configuración plana recomendada junto a las demás configuraciones de ADR-0002.
- Declarar en `package.json` un `overrides` que fije el peer `eslint` de `eslint-plugin-jsx-a11y` a la versión de ESLint del proyecto (`$eslint`), porque la última versión del plugin no declara compatibilidad con ESLint 10. Esta compatibilidad es observada, no declarada por el plugin.
- Incorporar `axe-core` como dependencia de desarrollo, con versión exacta fijada en el plan, y utilizarlo directamente desde un ayudante de pruebas mínimo en `tests/setup/`, sin `vitest-axe` ni otros envoltorios.
- Ejecutar axe en pruebas de componentes con React Testing Library sobre las rutas y los estados principales de la aplicación, analizando el documento completo (con un contenedor como contexto axe omite las reglas de página `document-title`, `html-has-lang` y `region`; comprobado el 2026-11-03) y con la regla `color-contrast` desactivada porque jsdom no la puede evaluar.
- No instalar `jest-axe` ni `vitest-axe`.
- Mantener las auditorías manuales y con el agente de accesibilidad para lo que la automatización no cubre: contraste real, foco visible, reflujo, anuncios con lector de pantalla y control por voz.
- Si una versión posterior de ESLint o del plugin rompe la compatibilidad observada, retirar el `overrides` y sustituir o suspender el plugin mediante un ADR nuevo.

## Consecuencias

- `npm run check` fallará ante regresiones estáticas de accesibilidad en JSX y ante violaciones de axe en las rutas y estados cubiertos.
- La baseline incorpora dos dependencias de desarrollo y una entrada `overrides` que hay que mantener. Medido en la implementación: el lockfile pasa de 352 a 464 paquetes (112 añadidos y ninguno eliminado; solo cambia la entrada raíz por las dos nuevas dependencias), casi todos transitivos de `eslint-plugin-jsx-a11y` (familia `es-abstract`).
- `npm audit` pasa de 20 a 21 entradas (de 15 a 16 moderadas): el plugin aparece afectado por el aviso de `minimatch` (GHSA-g3hv-75wg-m249) que ya afectaba a otras dependencias de desarrollo del proyecto. No se añade ningún aviso distinto y todo queda en dependencias de desarrollo.
- El peer de `eslint-plugin-jsx-a11y` se fuerza más allá de lo que su autoría declara: puede haber reglas que se comporten mal con ESLint 10 y no se hayan ejercitado.
- El contraste, el foco visible, el reflujo y los lectores de pantalla siguen sin cobertura automática.
- Cada versión nueva de `axe-core` puede añadir reglas y hacer fallar pruebas que antes pasaban; se fijará la versión exacta y se actualizará de forma deliberada.

## Alternativas descartadas

- `vitest-axe`: añade un envoltorio con una versión estable antigua y prelanzamientos como única evolución; `axe-core` directo basta para comprobar ausencia de violaciones.
- `jest-axe`: pensado para Jest.
- Sustituir ESLint por otra herramienta con reglas de accesibilidad nativas: contradice ADR-0002.
- Activar `legacy-peer-deps` en `.npmrc`: desactiva la validación de peers para todo el proyecto.
- No añadir comprobaciones automáticas y depender solo de auditorías manuales: deja pasar regresiones.
