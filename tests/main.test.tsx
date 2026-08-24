import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createRootMock, renderMock } = vi.hoisted(() => ({
  createRootMock: vi.fn(),
  renderMock: vi.fn(),
}))

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}))

describe('application bootstrap', () => {
  beforeEach(() => {
    vi.resetModules()
    createRootMock.mockReturnValue({ render: renderMock })
    document.body.replaceChildren()
  })

  it('mounts the application in the root element', async () => {
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.append(rootElement)

    await import('../src/main')

    expect(createRootMock).toHaveBeenCalledWith(rootElement)
    expect(renderMock).toHaveBeenCalledOnce()
  })

  it('fails explicitly when the root element is missing', async () => {
    await expect(import('../src/main')).rejects.toThrow('Root element not found')
    expect(createRootMock).not.toHaveBeenCalled()
  })
})
