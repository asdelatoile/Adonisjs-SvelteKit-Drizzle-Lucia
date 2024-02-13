export const takeUniqueOrThrow = <T>(values: T[]): T => {
  if (values.length !== 1) throw new Error('Found non unique or inexistent value')
  return values[0]!
}

export const takeUniqueOrNull = <T>(values: T[]): T | null => {
  if (values.length !== 1) return null
  return values[0]!
}
