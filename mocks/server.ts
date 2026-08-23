import { setupServer } from 'msw/node'
import { openMeteoHandlers } from './handlers/openMeteo'

export const server = setupServer(...openMeteoHandlers)
