import type { ForecastDay } from '../../../services/openMeteo/types'

export type ForecastProps = Readonly<{
  days: readonly ForecastDay[]
}>
