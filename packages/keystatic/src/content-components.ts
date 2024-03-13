import { ReactElement, ReactNode } from 'react';
import {
  BasicFormField,
  ComponentSchema,
  ObjectField,
  ParsedValueForComponentSchema,
  SlugFormField,
} from './form/api';
import {
  CloudImagePreviewForNewEditor,
  cloudImageToolbarIcon,
  handleFile,
} from '#cloud-image-preview';
import { cloudImageSchema } from './component-blocks/cloud-image-schema';
import { Config } from '.';

type WrapperComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  description?: string;
  icon?: ReactElement;
  schema: Schema;
  forSpecificLocations?: boolean;
} & (
  | {
      ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        children: ReactNode;
      }) => ReactNode;
    }
  | {
      NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(
          value: ParsedValueForComponentSchema<ObjectField<Schema>>
        ): void;
        onRemove(): void;
        isSelected: boolean;
        children: ReactNode;
      }) => ReactNode;
    }
);

type WrapperComponent<Schema extends Record<string, ComponentSchema>> =
  WrapperComponentConfig<Schema> & { kind: 'wrapper' };

export function wrapper<Schema extends Record<string, ComponentSchema>>(
  config: WrapperComponentConfig<Schema>
): WrapperComponent<Schema> {
  return { kind: 'wrapper', ...config };
}

type BlockComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  description?: string;
  icon?: ReactElement;
  schema: Schema;
  forSpecificLocations?: boolean;
} & (
  | {
      ContentView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
      }) => ReactNode;
    }
  | {
      NodeView?: (props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
        onChange(
          value: ParsedValueForComponentSchema<ObjectField<Schema>>
        ): void;
        onRemove(): void;
        isSelected: boolean;
      }) => ReactNode;
    }
);

type BlockComponent<Schema extends Record<string, ComponentSchema>> =
  BlockComponentConfig<Schema> & {
    kind: 'block';
    // this is here instead of BlockComponentConfig so it's a little hidden
    // since it shouldn't be used often
    handleFile?: (
      file: File,
      config: Config
    ) => false | Promise<ParsedValueForComponentSchema<ObjectField<Schema>>>;
  };

export function block<Schema extends Record<string, ComponentSchema>>(
  config: BlockComponentConfig<Schema>
): BlockComponent<Schema> {
  return { kind: 'block', ...config };
}

type InlineComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  description?: string;
  icon?: ReactElement;
  schema: Schema;
  NodeView?(props: {
    value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
    onRemove(): void;
    isSelected: boolean;
  }): ReactNode;
  ToolbarView?(props: {
    value: ParsedValueForComponentSchema<ObjectField<Schema>>;
    onChange(value: ParsedValueForComponentSchema<ObjectField<Schema>>): void;
    onRemove(): void;
  }): ReactNode;
};

type InlineComponent<Schema extends Record<string, ComponentSchema>> =
  InlineComponentConfig<Schema> & { kind: 'inline' };

export function inline<Schema extends Record<string, ComponentSchema>>(
  config: InlineComponentConfig<Schema>
): InlineComponent<Schema> {
  return { kind: 'inline', ...config };
}

type Thing<T, Schema extends Record<string, ComponentSchema>> =
  | T
  // this is so that it's bivariant
  | {
      method(props: {
        value: ParsedValueForComponentSchema<ObjectField<Schema>>;
      }): T;
    }['method'];

type MarkComponentConfig<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  icon: ReactElement;
  schema: Schema;
  tag?:
    | 'span'
    | 'strong'
    | 'em'
    | 'u'
    | 'del'
    | 'code'
    | 'a'
    | 'sub'
    | 'sup'
    | 'kbd'
    | 'abbr'
    | 'mark'
    | 's'
    | 'small'
    | 'big';
  style?: Thing<{ [key: string]: string }, Schema>;
  className?: Thing<string, Schema>;
};

type MarkComponent<Schema extends Record<string, ComponentSchema>> =
  MarkComponentConfig<Schema> & { kind: 'mark' };

export function mark<Schema extends Record<string, ComponentSchema>>(
  config: MarkComponentConfig<Schema>
): MarkComponent<Schema> {
  return { kind: 'mark', ...config };
}

type RepeatingComponentConfig<Schema extends Record<string, ComponentSchema>> =
  WrapperComponentConfig<Schema> & {
    children: string | string[];
    validation?: { children?: { min?: number; max?: number } };
  };

type RepeatingComponent<Schema extends Record<string, ComponentSchema>> =
  WrapperComponentConfig<Schema> & {
    kind: 'repeating';
    children: string[];
    validation: { children: { min: number; max: number } };
  };

export function repeating<Schema extends Record<string, ComponentSchema>>(
  config: RepeatingComponentConfig<Schema>
): RepeatingComponent<Schema> {
  return {
    kind: 'repeating',
    ...config,
    children: Array.isArray(config.children)
      ? config.children
      : [config.children],
    validation: {
      children: {
        min: config.validation?.children?.min ?? 0,
        max: config.validation?.children?.max ?? Infinity,
      },
    },
  };
}

export type ContentComponent =
  | WrapperComponent<Record<string, ComponentSchema>>
  | BlockComponent<Record<string, ComponentSchema>>
  | RepeatingComponent<Record<string, ComponentSchema>>
  | InlineComponent<Record<string, ComponentSchema>>
  | MarkComponent<Record<string, ComponentSchema>>;

export function cloudImage(args: { label: string }): BlockComponent<{
  src: SlugFormField<string, string, string, null>;
  alt: SlugFormField<string, string, string, null>;
  height: BasicFormField<number | null>;
  width: BasicFormField<number | null>;
}> {
  return {
    kind: 'block',
    label: args.label,
    schema: cloudImageSchema,
    NodeView: CloudImagePreviewForNewEditor,
    icon: cloudImageToolbarIcon,
    handleFile: handleFile,
  };
}
