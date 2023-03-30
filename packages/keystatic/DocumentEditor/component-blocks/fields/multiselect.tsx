import { Checkbox } from '@voussoir/checkbox';
import { FieldLabel } from '@voussoir/field';
import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';
import { useId } from 'react';
import { BasicFormField } from '../api';

export function multiselect<Option extends { label: string; value: string }>({
  label,
  options,
  defaultValue = [],
  description,
}: {
  label: string;
  options: readonly Option[];
  defaultValue?: readonly Option['value'][];
  description?: string;
}): BasicFormField<readonly Option['value'][]> & {
  options: readonly Option[];
} {
  const valuesToOption = new Map(options.map(x => [x.value, x]));
  return {
    kind: 'form',
    Input({ value, onChange }) {
      const labelId = useId();
      const descriptionId = useId();
      return (
        <Flex
          role="group"
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
          direction="column"
          gap="medium"
        >
          <FieldLabel elementType="span" id={labelId}>
            {label}
          </FieldLabel>
          {description && (
            <Text id={descriptionId} size="small" color="neutralSecondary">
              {description}
            </Text>
          )}
          {options.map(option => (
            <Checkbox
              isSelected={value.includes(option.value)}
              onChange={() => {
                if (value.includes(option.value)) {
                  onChange(value.filter(x => x !== option.value));
                } else {
                  onChange([...value, option.value]);
                }
              }}
            >
              {option.label}
            </Checkbox>
          ))}
        </Flex>
      );
    },
    options,
    defaultValue,
    validate(value) {
      return (
        Array.isArray(value) &&
        value.every(
          value => typeof value === 'string' && valuesToOption.has(value)
        )
      );
    },
  };
}
