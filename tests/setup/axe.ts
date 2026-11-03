import axe from 'axe-core'

// Se analiza el documento completo, no un contenedor: con un contenedor axe
// omite las reglas de página (título, idioma, landmarks).
// jsdom no calcula el diseño ni los colores renderizados: axe marcaría
// `color-contrast` como incompleto. El contraste se verifica a mano.
export const expectNoAccessibilityViolations = async () => {
  const { violations } = await axe.run(document, {
    rules: { 'color-contrast': { enabled: false } },
  })

  if (violations.length > 0) {
    const report = violations.map(
      ({ id, impact, help, nodes }) =>
        `${id} (${impact}): ${help} -> ${nodes.map(({ target }) => target.join(' ')).join(', ')}`,
    )

    throw new Error(`Accessibility violations:\n${report.join('\n')}`)
  }
}
