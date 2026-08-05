import {
  Autocomplete,
  FieldInputContext,
} from 'react-aria-components/Autocomplete';
import { useSlottedContext } from 'react-aria-components/slots';
import type { AriaAttributes, KeyboardEventHandler } from 'react';

export { Autocomplete as EditorAutocomplete };
export type { AutocompleteProps as EditorAutocompleteProps } from 'react-aria-components/Autocomplete';

export function useEditorAutocompleteInputProps(): Pick<
  AriaAttributes,
  'aria-activedescendant' | 'aria-autocomplete' | 'aria-controls'
> & {
  onKeyDown: KeyboardEventHandler<HTMLElement>;
} {
  let inputProps = useSlottedContext(FieldInputContext);
  let onKeyDown = inputProps?.onKeyDown as
    | KeyboardEventHandler<HTMLElement>
    | undefined;
  return {
    'aria-activedescendant': inputProps?.['aria-activedescendant'],
    'aria-autocomplete': inputProps?.['aria-autocomplete'],
    'aria-controls': inputProps?.['aria-controls'],
    onKeyDown(event) {
      onKeyDown?.(event);
    },
  };
}
