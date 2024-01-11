'use client';

import { Icon } from '@keystar/ui/icon';
import { Box, Flex } from '@keystar/ui/layout';
import { Item, Picker } from '@keystar/ui/picker';
import { tokenSchema } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { useRef, useEffect } from 'react';

const colors = {
  gray: '#6B7280',
  purple: '#8B5CF6',
  blue: '#3B82F6',
  red: '#EF4444',
  yellow: '#F59E0B',
  green: '#10B981',
};

type Value = {
  label: string;
  color: 'gray' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';
};
export function StatusToolbarView(props: {
  value: Value;
  onChange: (value: Value) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!props.value) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Flex direction="column" gap="xsmall">
      <TextField
        ref={inputRef}
        aria-label="Label"
        value={props.value.label}
        onChange={label => {
          props.onChange({ ...props.value, label });
        }}
      />
      <Picker
        aria-label="Color"
        selectedKey={props.value.color}
        onSelectionChange={key => {
          props.onChange({ ...props.value, color: key as Value['color'] });
        }}
      >
        {Object.entries(colors).map(([color, val]) => {
          const label = color[0].toUpperCase() + color.slice(1);
          return (
            <Item textValue={label} key={color}>
              <Icon
                src={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="1em"
                    height="1em"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="8"
                      ry="8"
                      color={val}
                      fill={val}
                    />
                  </svg>
                }
              />
              <Text>{label}</Text>
            </Item>
          );
        })}
      </Picker>
    </Flex>
  );
}

export function StatusNodeView(props: { value: Value; isSelected: boolean }) {
  return (
    <Box
      elementType="span"
      padding="small"
      borderRadius="large"
      marginX="xsmall"
      UNSAFE_style={{
        color: 'white',
        backgroundColor: colors[props.value.color],
        ...(props.isSelected
          ? {
              boxShadow: `0 0 0 2px ${tokenSchema.color.alias.borderFocused}`,
            }
          : undefined),
      }}
    >
      {props.value.label || 'Set a status'}
    </Box>
  );
}
