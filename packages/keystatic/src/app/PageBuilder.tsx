import { ReactNode } from 'react';
import { Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Flex, VStack, Box } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

export type PageComponent =
  | {
      type: 'heading';
      id: string;
      level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      content: string;
    }
  | {
      type: 'paragraph';
      id: string;
      content: string;
    }
  | {
      type: 'section';
      id: string;
      title: string;
      children: PageComponent[];
    }
  | {
      type: 'image';
      id: string;
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: 'button';
      id: string;
      label: string;
      url: string;
      variant?: 'primary' | 'secondary';
    }
  | {
      type: 'spacer';
      id: string;
      height: 'small' | 'medium' | 'large';
    };

export type PageData = {
  title: string;
  slug: string;
  description?: string;
  components: PageComponent[];
};

export function PageBuilderPreview({
  components,
}: {
  components: PageComponent[];
}) {
  return (
    <VStack gap="large" paddingY="xlarge" paddingX="large">
      {components.map(component => renderComponent(component))}
    </VStack>
  );
}

function renderComponent(component: PageComponent): ReactNode {
  switch (component.type) {
    case 'heading':
      return (
        <Heading
          key={component.id}
          elementType={component.level}
          UNSAFE_style={{ lineHeight: 1.4 }}
        >
          {component.content}
        </Heading>
      );
    case 'paragraph':
      return (
        <Text
          key={component.id}
          size="regular"
          UNSAFE_style={{ lineHeight: 1.7 }}
        >
          {component.content}
        </Text>
      );
    case 'section':
      return (
        <Box
          key={component.id}
          borderRadius="medium"
          paddingY="large"
          paddingX="xlarge"
          UNSAFE_className={css({
            border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
            background: `linear-gradient(135deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
          })}
        >
          <VStack gap="large">
            {component.title && (
              <Heading size="medium" elementType="h3">
                {component.title}
              </Heading>
            )}
            {component.children.map(child => renderComponent(child))}
          </VStack>
        </Box>
      );
    case 'image':
      return (
        <Box key={component.id}>
          <img
            src={component.src}
            alt={component.alt}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: tokenSchema.size.radius.medium,
            }}
          />
          {component.caption && (
            <Text
              size="small"
              color="neutralSecondary"
              UNSAFE_style={{ marginTop: tokenSchema.size.space.small }}
            >
              {component.caption}
            </Text>
          )}
        </Box>
      );
    case 'button':
      return (
        <Box key={component.id}>
          <Button
            isDisabled
            prominence={component.variant === 'primary' ? 'high' : 'low'}
          >
            {component.label}
          </Button>
        </Box>
      );
    case 'spacer':
      const spacerHeights = {
        small: tokenSchema.size.space.medium,
        medium: tokenSchema.size.space.large,
        large: tokenSchema.size.space.xxlarge,
      };
      return (
        <Box
          key={component.id}
          UNSAFE_style={{ height: spacerHeights[component.height] }}
        />
      );
  }
}

export function PageBuilderEmptyState() {
  return (
    <Box
      borderRadius="large"
      padding="xxlarge"
      UNSAFE_className={css({
        border: `2px dashed ${tokenSchema.color.border.muted}`,
        background: tokenSchema.color.background.canvas,
        textAlign: 'center',
      })}
    >
      <VStack gap="large" alignItems="center">
        <Icon src={plusIcon} size="large" color="neutralTertiary" />
        <VStack gap="small" alignItems="center">
          <Heading size="small" elementType="h3">
            No components yet
          </Heading>
          <Text color="neutralSecondary">
            Add components to start building your page
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
