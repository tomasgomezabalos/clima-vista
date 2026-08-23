export type StatusMessageTone = 'neutral' | 'loading' | 'empty' | 'error'

export type StatusMessageProps = Readonly<{
  message: string
  tone: StatusMessageTone
}>
