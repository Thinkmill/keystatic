export function validateDatetime(
  validation: { min?: string; max?: string; isRequired?: boolean } | undefined,
  value: string | null,
  label: string
) {
  if (value !== null && isNaN(Date.parse(value))) {
    return `${label} is not a valid datetime`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation?.min || validation?.max) && value !== null) {
    const datetime = new Date(value);
    const utcDatetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000);
    if (validation?.min !== undefined) {
      const min = new Date(validation.min);
      if (utcDatetime < min) {
        return `${label} must be after ${min.toISOString()}`;
      }
    }
    if (validation?.max !== undefined) {
      const max = new Date(validation.max);
      if (utcDatetime > max) {
        return `${label} must be no later than ${max.toISOString()}`;
      }
    }
  }
}
