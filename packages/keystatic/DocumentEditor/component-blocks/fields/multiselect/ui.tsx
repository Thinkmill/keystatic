'use client';
import { Checkbox } from '@voussoir/checkbox';
import { FieldLabel } from '@voussoir/field';
import { Flex } from '@voussoir/layout';
import { useId } from 'react';
import { FormFieldInputProps } from '../../api';
import { Text } from '@voussoir/typography';

export function MultiselectFieldInput<Value extends string>(
  props: FormFieldInputProps<readonly Value[]> & {
    options: readonly { label: string; value: Value }[];
    label: string;
    description: string | undefined;
  }
) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <Flex
      role="group"
      aria-labelledby={labelId}
      aria-describedby={props.description ? descriptionId : undefined}
      direction="column"
      gap="medium"
    >
      <FieldLabel elementType="span" id={labelId}>
        {props.label}
      </FieldLabel>
      {props.description && (
        <Text id={descriptionId} size="small" color="neutralSecondary">
          {props.description}
        </Text>
      )}
      {props.options.map(option => (
        <Checkbox
          isSelected={props.value.includes(option.value)}
          onChange={() => {
            if (props.value.includes(option.value)) {
              props.onChange(props.value.filter(x => x !== option.value));
            } else {
              props.onChange([...props.value, option.value]);
            }
          }}
        >
          {option.label}
        </Checkbox>
      ))}
    </Flex>
  );
}
