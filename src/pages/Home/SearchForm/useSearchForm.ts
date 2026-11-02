import type { SubmitEvent } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { UseSearchFormParams } from './types'

export const useSearchForm = ({
  isLoading,
  onSubmit,
}: UseSearchFormParams) => {
  const { t } = useTranslation()
  const inputId = useId()
  const errorId = useId()

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    onSubmit()
  }

  return {
    t,
    inputId,
    errorId,
    handleSubmit,
  }
}
