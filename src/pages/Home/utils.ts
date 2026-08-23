const numberFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
})

export const formatMeasurement = (
  value: number | null,
  unit: string,
  unavailable: string,
): string => (value === null ? unavailable : `${numberFormatter.format(value)} ${unit}`)
