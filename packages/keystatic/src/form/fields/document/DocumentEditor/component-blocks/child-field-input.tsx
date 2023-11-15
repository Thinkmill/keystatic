import { Field } from '@keystar/ui/field';
import { GenericPreviewProps } from '../../../../api';
import { getChildFieldData } from '../../../../preview-props';
import { ChildField } from '../../../child';
import { useDocumentEditorConfig } from '../toolbar-state';
import { DocumentEditor } from '..';
import { useMemo, useState } from 'react';
import { getWholeDocumentFeaturesForChildField } from './utils';
import { ResetEntryLayoutContext } from '../../../../../app/entry-form';

const emptyObj = {};

let i = 0;

function newKey() {
  return i++;
}

function InnerChildFieldInput(props: {
  schema: ChildField & { options: { kind: 'block'; editIn: 'modal' | 'both' } };
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const outerConfig = useDocumentEditorConfig();
  const [state, setState] = useState<{
    key: number;
    value: (typeof props)['value'];
  }>(() => ({
    key: newKey(),
    value: props.value,
  }));

  const documentFeatures = useMemo(() => {
    return getWholeDocumentFeaturesForChildField(
      outerConfig.documentFeatures,
      props.schema.options
    );
  }, [props.schema, outerConfig.documentFeatures]);

  if (state.value !== props.value) {
    setState({ key: newKey(), value: props.value });
  }
  return (
    <ResetEntryLayoutContext>
      <Field label={props.schema.options.label}>
        {inputProps => (
          <DocumentEditor
            {...inputProps}
            key={state.key}
            componentBlocks={
              props.schema.options.componentBlocks === 'inherit'
                ? outerConfig.componentBlocks
                : emptyObj
            }
            documentFeatures={documentFeatures}
            onChange={val => {
              setState(state => ({ key: state.key, value: val as any }));
              props.onChange(val as any);
            }}
            value={state.value as any}
          />
        )}
      </Field>
    </ResetEntryLayoutContext>
  );
}

export function ChildFieldInput(
  props: GenericPreviewProps<ChildField, unknown>
) {
  const data = getChildFieldData(props);
  if (
    props.schema.options.kind === 'block' &&
    (props.schema.options.editIn === 'both' ||
      props.schema.options.editIn === 'modal') &&
    data.value
  ) {
    return (
      <InnerChildFieldInput
        schema={
          props.schema as ChildField & {
            options: { kind: 'block'; editIn: 'modal' | 'both' };
          }
        }
        {...data}
      />
    );
  }
  return null;
}
