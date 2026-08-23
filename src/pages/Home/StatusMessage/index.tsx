import type { StatusMessageProps } from './types'
import './styles.scss'

export const StatusMessage = ({ message, tone }: StatusMessageProps) => {
  const isError = tone === 'error'

  return (
    <div
      className={`status-message status-message--${tone}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {tone === 'loading' && (
        <span className="status-message__loader" aria-hidden="true" />
      )}
      <p>{message}</p>
    </div>
  )
}
