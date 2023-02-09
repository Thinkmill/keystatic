/**
 * Format IDs for compound components.
 *
 * @example
 * const root = useId()
 * const inputId = composeId(root, 'input') // => ':R1:--input'
 * const descriptionId = composeId(root, 'field-element' 'description') // => ':R1:--field-element--description'
 */
export function composeId(...args: (string | number | null | undefined)[]) {
  return args.filter(Boolean).join('--');
}
