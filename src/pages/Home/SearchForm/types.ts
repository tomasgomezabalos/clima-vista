export type SearchFormProps = Readonly<{
  term: string
  isLoading: boolean
  validationMessage: string
  onTermChange: (value: string) => void
  onSubmit: () => void
}>

export type UseSearchFormParams = Readonly<{
  onSubmit: () => void
}>
