'use client';
import { ActionGroup, Item } from '@voussoir/action-group';
import { ActionButton } from '@voussoir/button';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Divider, Flex } from '@voussoir/layout';

import { PropsWithChildren } from 'react';

import { alertOctagonIcon } from '@voussoir/icon/icons/alertOctagonIcon';
import { alertTriangleIcon } from '@voussoir/icon/icons/alertTriangleIcon';
import { checkCircle2Icon } from '@voussoir/icon/icons/checkCircle2Icon';
import { infoIcon } from '@voussoir/icon/icons/infoIcon';
import { css, tokenSchema } from '@voussoir/style';

const toneToIcon = {
  caution: alertTriangleIcon,
  critical: alertOctagonIcon,
  info: infoIcon,
  positive: checkCircle2Icon,
};

const toneToColor = {
  caution: 'caution',
  critical: 'critical',
  info: 'accent',
  positive: 'positive',
} as const;

export function Note({
  children,
  tone = 'info',
  ...props
}: PropsWithChildren<{
  tone?: 'info' | 'caution' | 'critical' | 'positive';
}>) {
  let icon = toneToIcon[tone];
  let color = toneToColor[tone];
  return (
    <div
      {...props}
      className={css({
        borderRadius: tokenSchema.size.radius.regular,
        background: 'var(--bg)',
        color: 'var(--fg)',
        display: 'flex',
        gap: '1em',
        padding: '1em',

        svg: {
          flexShrink: 0,
          fill: 'none',
          stroke: 'currentColor',
          height: 20,
          width: 20,
        },

        '& [data-slate-node="element"]': {
          '&:first-child': {
            marginTop: 0,
          },
          '&:last-child': {
            marginBottom: 0,
          },
        },
      })}
      style={{
        // @ts-ignore
        '--bg': tokenSchema.color.background[color],
        '--fg': tokenSchema.color.foreground[color],
      }}
    >
      {icon}
      <div>{children}</div>
    </div>
  );
}

export function NoteToolbar(props: {
  onChange: (tone: keyof typeof toneToIcon) => void;
  tones: readonly { label: string; value: keyof typeof toneToIcon }[];
  tone: keyof typeof toneToIcon;
  onRemove: () => void;
}) {
  return (
    <Flex gap="regular" padding="regular">
      <ActionGroup
        selectionMode="single"
        prominence="low"
        density="compact"
        buttonLabelBehavior="hide"
        onAction={key => {
          props.onChange(key as any);
        }}
        selectedKeys={[props.tone]}
        items={props.tones}
      >
        {item => (
          <Item key={item.value} textValue={item.label}>
            <Icon src={toneToIcon[item.value]} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </ActionGroup>
      <Divider orientation="vertical" />
      <TooltipTrigger>
        <ActionButton
          prominence="low"
          onPress={() => {
            props.onRemove();
          }}
        >
          <Icon src={trash2Icon} />
        </ActionButton>
        <Tooltip tone="critical">
          <Text>Remove</Text>
        </Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}
