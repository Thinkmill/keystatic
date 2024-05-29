import { useMemo } from 'react';
import * as Y from 'yjs';
import { createGetPreviewProps } from '../form/preview-props';
import {
  ComponentSchema,
  GenericPreviewProps,
  ParsedValueForComponentSchema,
} from '../form/api';
import { useYjs } from './shell/collab';
import { createGetPreviewPropsFromY } from '../form/preview-props-yjs';
import { useConfig } from './shell/context';

export function usePreviewProps<Schema extends ComponentSchema>(
  schema: Schema,
  setState: (
    cb: (
      state: ParsedValueForComponentSchema<Schema>
    ) => ParsedValueForComponentSchema<Schema>
  ) => void,
  state: any
): GenericPreviewProps<Schema, undefined> {
  return useMemo(
    () => createGetPreviewProps(schema, setState, () => undefined),
    [schema, setState]
  )(state);
}

export function usePreviewPropsFromY<Schema extends ComponentSchema>(
  schema: Schema,
  map: Y.Map<any>,
  state: any
): GenericPreviewProps<Schema, undefined> {
  const yjsInfo = useYjs();

  return useMemo(
    () => createGetPreviewPropsFromY(schema as any, map, yjsInfo.awareness),
    [map, schema, yjsInfo.awareness]
  )(state) as any;
}

export function useCollection(collection: string) {
  const config = useConfig();
  const collectionConfig = config.collections![collection]!;
  const schema = useMemo(
    () => ({ kind: 'object' as const, fields: collectionConfig.schema }),
    [collectionConfig.schema]
  );
  return { schema, collectionConfig };
}

export function useSingleton(singleton: string) {
  const config = useConfig();
  const singletonConfig = config.singletons![singleton]!;
  const schema = useMemo(
    () => ({ kind: 'object' as const, fields: singletonConfig.schema }),
    [singletonConfig.schema]
  );
  return { schema, singletonConfig };
}
