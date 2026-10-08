import { useContext, useState } from 'react';
import { FormFieldInputProps } from '../../api';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { validateText } from './validateText';
import { PathContext, SlugFieldContext } from './path-slug-context';

const emptySet = new Set<string>();

export function TextFieldInput(
  props: FormFieldInputProps<string> & {
    multiline: boolean;
    label: string;
    description: string | undefined;
    min: number;
    max: number;
    pattern: { regex: RegExp; message?: string } | undefined;
  }
) {
  const TextFieldComponent = props.multiline ? TextArea : TextField;
  const [blurred, setBlurred] = useState(false);
  const slugContext = useContext(SlugFieldContext);
  const path = useContext(PathContext);
  const slugInfo =
    path.length === 1 &&
    typeof path[0] === 'string' &&
    slugContext?.fields.includes(path[0])
      ? // the last slug field is validated for uniqueness, the other slug
        // fields only get format validation since their uniqueness is
        // enforced via the composite slug
        path[0] === slugContext.field
        ? slugContext
        : { slugs: emptySet, glob: slugContext.glob }
      : undefined;
  return (
    <TextFieldComponent
      label={props.label}
      description={props.description}
      autoFocus={props.autoFocus}
      value={props.value}
      onChange={props.onChange}
      onBlur={() => setBlurred(true)}
      isRequired={props.min > 0}
      errorMessage={
        props.forceValidation || blurred
          ? validateText(
              props.value,
              props.min,
              props.max,
              props.label,
              slugInfo,
              props.pattern
            )
          : undefined
      }
    />
  );
}
