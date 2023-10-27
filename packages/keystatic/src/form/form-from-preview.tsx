import { MemoExoticComponent, ReactElement, memo } from 'react';

import { ComponentSchema, GenericPreviewProps } from './api';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import {
  SlugFieldInfo,
  PathContextProvider,
  SlugFieldProvider,
} from './fields/text/path-slug-context';
import { ObjectFieldInput } from './fields/object/ui';
import { ConditionalFieldInput } from './fields/conditional/ui';
import { ArrayFieldInput } from './fields/array/ui';
import { ChildFieldInput } from './fields/document/DocumentEditor/component-blocks/child-field-input';

export type ExtraFieldInputProps = {
  autoFocus: boolean;
  forceValidation: boolean;
};

function getInputComponent(schema: ComponentSchema): any {
  if (schema.kind === 'object') {
    return schema.Input ?? ObjectFieldInput;
  }
  if (schema.kind === 'conditional') {
    return schema.Input ?? ConditionalFieldInput;
  }
  if (schema.kind === 'array') {
    return schema.Input ?? ArrayFieldInput;
  }
  if (schema.kind === 'child') {
    return ChildFieldInput;
  }
  return schema.Input;
}

export const InnerFormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<ComponentSchema, unknown> & {
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
    props: GenericPreviewProps<ComponentSchema, unknown> & {
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
