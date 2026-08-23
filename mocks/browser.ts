import { setupWorker } from 'msw/browser'
import { openMeteoHandlers } from './handlers/openMeteo'

export const worker = setupWorker(...openMeteoHandlers)
