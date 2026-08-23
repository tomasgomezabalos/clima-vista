import type { SearchFormProps } from './types'
import { useSearchForm } from './useSearchForm'
import './styles.scss'

export const SearchForm = ({
  term,
  isLoading,
  validationMessage,
  onTermChange,
  onSubmit,
}: SearchFormProps) => {
  const { t, inputId, errorId, handleSubmit } = useSearchForm({ onSubmit })

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <label className="search-form__label" htmlFor={inputId}>
        {t('search.label')}
      </label>
      <div className="search-form__controls">
        <input
          id={inputId}
          className="search-form__input"
          type="search"
          value={term}
          placeholder={t('search.placeholder')}
          autoComplete="off"
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? errorId : undefined}
          onChange={(event) => onTermChange(event.target.value)}
        />
        <button className="search-form__button" type="submit" disabled={isLoading}>
          {t('search.submit')}
        </button>
      </div>
      {validationMessage && (
        <p id={errorId} className="search-form__error" role="alert">
          {validationMessage}
        </p>
      )}
    </form>
  )
}
