export type StatusMessageTone = 'neutral' | 'empty' | 'error'

export type StatusMessageProps = Readonly<{
  message: string
  tone: StatusMessageTone
}>
