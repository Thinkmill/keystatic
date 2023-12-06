import { ReactNode } from 'react';
import {
  ComponentSchema,
  ObjectField,
  ParsedValueForComponentSchema,
} from './form/api';

type WrapperComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  schema: Schema;
  preview?: (
    props: ParsedValueForComponentSchema<ObjectField<Schema>> & {
      children: ReactNode;
    }
  ) => ReactNode;
};

type WrapperComponent<Schema extends Record<string, ComponentSchema>> =
  WrapperComponentConfig<Schema> & {
    kind: 'wrapper';
  };

export function wrapper<Schema extends Record<string, ComponentSchema>>(
  config: WrapperComponentConfig<Schema>
): WrapperComponent<Schema> {
  return { kind: 'wrapper', ...config };
}

type BlockComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  schema: Schema;
  preview?: (
    props: ParsedValueForComponentSchema<ObjectField<Schema>>
  ) => ReactNode;
};

type BlockComponent<Schema extends Record<string, ComponentSchema>> =
  BlockComponentConfig<Schema> & {
    kind: 'block';
  };

export function block<Schema extends Record<string, ComponentSchema>>(
  config: BlockComponentConfig<Schema>
): BlockComponent<Schema> {
  return { kind: 'block', ...config };
}

type InlineComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  schema: Schema;
  preview?: (
    props: ParsedValueForComponentSchema<ObjectField<Schema>>
  ) => ReactNode;
};

type InlineComponent<Schema extends Record<string, ComponentSchema>> =
  InlineComponentConfig<Schema> & {
    kind: 'inline';
  };

export function inline<Schema extends Record<string, ComponentSchema>>(
  config: InlineComponentConfig<Schema>
): InlineComponent<Schema> {
  return { kind: 'inline', ...config };
}

export type ContentComponent =
  | WrapperComponent<Record<string, ComponentSchema>>
  | BlockComponent<Record<string, ComponentSchema>>
  | InlineComponent<Record<string, ComponentSchema>>;
