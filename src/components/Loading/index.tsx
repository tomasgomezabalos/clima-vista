import type { LoadingProps } from './types'
import './styles.scss'

export const Loading = ({ message }: LoadingProps) => (
  <div
    className="loading"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="loading__indicator" aria-hidden="true" />
    <p>{message}</p>
  </div>
)
