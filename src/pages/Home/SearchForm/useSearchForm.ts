import type { FormEvent } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { UseSearchFormParams } from './types'

export const useSearchForm = ({ onSubmit }: UseSearchFormParams) => {
  const { t } = useTranslation()
  const inputId = useId()
  const errorId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return {
    t,
    inputId,
    errorId,
    handleSubmit,
  }
}
