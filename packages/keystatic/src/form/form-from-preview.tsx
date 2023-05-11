import { MemoExoticComponent, ReactElement, memo } from 'react';

import {
  ArrayField,
  BasicFormField,
  ComponentSchema,
  ConditionalField,
  FormField,
  GenericPreviewProps,
  ObjectField,
} from './api';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import {
  PathContextProvider,
  SlugFieldInfo,
  SlugFieldProvider,
} from './fields/text/ui';
import { ObjectFieldInput } from './fields/object/ui';
import { ConditionalFieldInput } from './fields/conditional/ui';
import { ArrayFieldInput } from './fields/array/ui';

export type ExtraFieldInputProps = {
  autoFocus: boolean;
  forceValidation: boolean;
};

export type NonChildFieldComponentSchema =
  | FormField<any, any, any>
  | ObjectField
  | ConditionalField<BasicFormField<any>, { [key: string]: ComponentSchema }>
  | ArrayField<ComponentSchema>;

export function isNonChildFieldPreviewProps(
  props: GenericPreviewProps<ComponentSchema, unknown>
): props is GenericPreviewProps<NonChildFieldComponentSchema, unknown> &
  GenericPreviewProps<ComponentSchema, unknown> {
  return props.schema.kind !== 'child';
}

function getInputComponent(schema: NonChildFieldComponentSchema): any {
  if (schema.kind === 'object') {
    return schema.Input ?? ObjectFieldInput;
  }
  if (schema.kind === 'conditional') {
    return schema.Input ?? ConditionalFieldInput;
  }
  if (schema.kind === 'array') {
    return schema.Input ?? ArrayFieldInput;
  }
  return schema.Input;
}

export const InnerFormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<NonChildFieldComponentSchema, unknown> & {
      autoFocus?: boolean;
      forceValidation?: boolean;
    }
  ) => ReactElement
> = memo(function InnerFormValueContentFromPreview(props) {
  let Input = getInputComponent(props.schema);
  return (
    <Input
      {...(props as any)}
      autoFocus={!!props.autoFocus}
      forceValidation={!!props.forceValidation}
    />
  );
});

const emptyArray: ReadonlyPropPath = [];
export const FormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<NonChildFieldComponentSchema, unknown> & {
      autoFocus?: boolean;
      forceValidation?: boolean;
      slugField?: SlugFieldInfo;
    }
  ) => ReactElement
> = memo(function FormValueContentFromPreview({ slugField, ...props }) {
  let Input = getInputComponent(props.schema);
  return (
    <PathContextProvider value={emptyArray}>
      <SlugFieldProvider value={slugField}>
        <Input
          {...(props as any)}
          autoFocus={!!props.autoFocus}
          forceValidation={!!props.forceValidation}
        />
      </SlugFieldProvider>
    </PathContextProvider>
  );
});
