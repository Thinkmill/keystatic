import { useState } from 'react';

import { ActionButton, ToggleButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { eyeIcon } from '@keystar/ui/icon/icons/eyeIcon';
import { eyeOffIcon } from '@keystar/ui/icon/icons/eyeOffIcon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { Box, Flex, VStack, Divider } from '@keystar/ui/layout';
import { Text, Heading } from '@keystar/ui/typography';
import { css, tokenSchema } from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

type PreviewPanelProps = {
  data: Record<string, unknown>;
  schema: Record<string, unknown>;
  title?: string;
};

// Render a preview of the entry data - with depth limit to prevent stack overflow
function renderValue(value: unknown, depth = 0, maxDepth = 3): React.ReactNode {
  // Prevent infinite recursion
  if (depth > maxDepth) {
    return <Text color="neutralSecondary">[nested]</Text>;
  }

  if (value === null || value === undefined) {
    return <Text color="neutralSecondary">—</Text>;
  }

  if (typeof value === 'boolean') {
    return (
      <Text color={value ? 'positive' : 'neutral'}>{value ? 'Yes' : 'No'}</Text>
    );
  }

  if (typeof value === 'number') {
    return <Text color="accent">{value}</Text>;
  }

  if (typeof value === 'string') {
    if (value.length > 100) {
      return <Text>{value.substring(0, 100)}...</Text>;
    }
    return <Text>{value}</Text>;
  }

  // Skip complex objects that might cause recursion (like functions, symbols, etc)
  if (typeof value === 'function' || typeof value === 'symbol') {
    return <Text color="neutralSecondary">[{typeof value}]</Text>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <Text color="neutralSecondary">Empty list</Text>;
    }
    return (
      <VStack gap="xsmall" paddingStart="regular">
        {value.slice(0, 3).map((item, i) => (
          <Flex key={i} gap="small" alignItems="start">
            <Text color="neutralSecondary">{i + 1}.</Text>
            {renderValue(item, depth + 1, maxDepth)}
          </Flex>
        ))}
        {value.length > 3 && (
          <Text color="neutralSecondary">...and {value.length - 3} more</Text>
        )}
      </VStack>
    );
  }

  if (typeof value === 'object') {
    // Skip objects that look like React elements or have circular refs
    if ('$$typeof' in (value as object) || '_owner' in (value as object)) {
      return <Text color="neutralSecondary">[component]</Text>;
    }

    try {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return <Text color="neutralSecondary">Empty object</Text>;
      }
      // Only show simple fields, skip complex nested objects at shallow render
      const simpleEntries = entries
        .filter(([, val]) => typeof val !== 'object' || val === null)
        .slice(0, 5);

      if (simpleEntries.length === 0) {
        return <Text color="neutralSecondary">[{entries.length} fields]</Text>;
      }

      return (
        <VStack gap="xsmall" paddingStart={depth > 0 ? 'regular' : undefined}>
          {simpleEntries.map(([key, val]) => (
            <Flex key={key} gap="small" alignItems="start" wrap>
              <Text weight="medium" color="neutralSecondary">
                {key}:
              </Text>
              {renderValue(val, depth + 1, maxDepth)}
            </Flex>
          ))}
          {entries.length > simpleEntries.length && (
            <Text color="neutralSecondary">
              ...and {entries.length - simpleEntries.length} more fields
            </Text>
          )}
        </VStack>
      );
    } catch {
      return <Text color="neutralSecondary">[object]</Text>;
    }
  }

  return <Text>{String(value)}</Text>;
}

export function PreviewPanel({ data, title }: PreviewPanelProps) {
  return (
    <Box
      padding="large"
      UNSAFE_className={css({
        height: '100%',
        overflowY: 'auto',
      })}
    >
      <VStack gap="large">
        <Heading size="small">{title || 'Preview'}</Heading>
        <Divider />
        <VStack gap="medium">
          {Object.entries(data).map(([key, value]) => (
            <Box
              key={key}
              UNSAFE_className={css({
                padding: tokenSchema.size.space.regular,
                backgroundColor: tokenSchema.color.background.surface,
                borderRadius: tokenSchema.size.radius.regular,
                border: `1px solid ${tokenSchema.color.border.neutral}`,
              })}
            >
              <VStack gap="small">
                <Text
                  weight="semibold"
                  size="small"
                  color="accent"
                  UNSAFE_className={css({
                    textTransform: 'capitalize',
                  })}
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </Text>
                {renderValue(value)}
              </VStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}

type PreviewToggleProps = {
  isPreviewOpen: boolean;
  onToggle: () => void;
};

export function PreviewToggle({ isPreviewOpen, onToggle }: PreviewToggleProps) {
  return (
    <TooltipTrigger>
      <ToggleButton
        isSelected={isPreviewOpen}
        onChange={onToggle}
        aria-label={isPreviewOpen ? 'Hide preview' : 'Show preview'}
      >
        <Icon src={isPreviewOpen ? eyeOffIcon : eyeIcon} />
      </ToggleButton>
      <Tooltip>{isPreviewOpen ? 'Hide preview' : 'Show preview'}</Tooltip>
    </TooltipTrigger>
  );
}

type SplitEditorProps = {
  children: React.ReactNode;
  preview: React.ReactNode;
  isPreviewOpen: boolean;
  previewWidth?: number | string;
};

export function SplitEditor({
  children,
  preview,
  isPreviewOpen,
  previewWidth = '400px',
}: SplitEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isPreviewOpen) {
    return <>{children}</>;
  }

  return (
    <Flex height="100%" minHeight={0}>
      <Box flex minWidth={0}>
        {children}
      </Box>
      {!isCollapsed && (
        <>
          <Divider orientation="vertical" />
          <Box
            UNSAFE_className={css({
              width:
                typeof previewWidth === 'number'
                  ? `${previewWidth}px`
                  : previewWidth,
              minWidth: '300px',
              maxWidth: '50%',
              backgroundColor: tokenSchema.color.background.canvas,
              borderLeft: `1px solid ${tokenSchema.color.border.neutral}`,
              position: 'relative',
            })}
          >
            <Flex
              padding="small"
              gap="xsmall"
              UNSAFE_className={css({
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1,
              })}
            >
              <TooltipTrigger>
                <ActionButton
                  prominence="low"
                  onPress={() => setIsCollapsed(true)}
                >
                  <Icon src={chevronRightIcon} />
                </ActionButton>
                <Tooltip>Collapse preview</Tooltip>
              </TooltipTrigger>
            </Flex>
            {preview}
          </Box>
        </>
      )}
      {isCollapsed && (
        <Box
          UNSAFE_className={css({
            width: '32px',
            backgroundColor: tokenSchema.color.background.canvas,
            borderLeft: `1px solid ${tokenSchema.color.border.neutral}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: tokenSchema.size.space.regular,
          })}
        >
          <TooltipTrigger>
            <ActionButton
              prominence="low"
              onPress={() => setIsCollapsed(false)}
            >
              <Icon src={chevronLeftIcon} />
            </ActionButton>
            <Tooltip>Expand preview</Tooltip>
          </TooltipTrigger>
        </Box>
      )}
    </Flex>
  );
}
