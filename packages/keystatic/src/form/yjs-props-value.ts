import { assertNever } from 'emery/assertions';
import { ComponentSchema } from './api';
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness.js';
import { setKeysForArrayValue, getKeysForArrayValue } from './initial-values';

export function getYjsValFromParsedValue(
  schema: ComponentSchema,
  value: unknown
): unknown {
  if (schema.kind === 'form') {
    if (schema.formKind === 'content' && schema.collaboration) {
      return schema.collaboration.toYjs(value);
    }
    return value;
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'object') {
    return new Y.Map(
      Object.entries(schema.fields).map(
        ([key, val]) =>
          [key, getYjsValFromParsedValue(val, (value as any)[key])] as const
      )
    );
  }
  if (schema.kind === 'array') {
    const arr = new Y.Array();
    arr.push(
      (value as unknown[]).map(val =>
        getYjsValFromParsedValue(schema.element, val)
      )
    );
    return arr;
  }
  if (schema.kind === 'conditional') {
    const discriminant = (value as any).discriminant;
    return new Y.Map([
      ['discriminant', discriminant],
      [
        'value',
        getYjsValFromParsedValue(
          schema.values[discriminant + ''],
          (value as any).value
        ),
      ],
    ]);
  }
  assertNever(schema);
}

export function yjsToVal(
  schema: ComponentSchema,
  awareness: Awareness,
  yjsValue: unknown
): unknown {
  if (schema.kind === 'form') {
    if (schema.formKind === 'content' && schema.collaboration) {
      return schema.collaboration.fromYjs(yjsValue, awareness);
    }
    return yjsValue;
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(
      Object.entries(schema.fields).map(([key, val]) => [
        key,
        yjsToVal(val, awareness, (yjsValue as Y.Map<unknown>).get(key)),
      ])
    );
  }
  if (schema.kind === 'array') {
    const yArr = yjsValue as Y.Array<unknown>;
    if (!yArr) {
      debugger;
    }
    const val = yArr.map(val => yjsToVal(schema.element, awareness, val));
    setKeysForArrayValue(val, getKeysForArrayValue(yArr));
    return val;
  }
  if (schema.kind === 'conditional') {
    const yjsMap = yjsValue as Y.Map<unknown>;
    return {
      discriminant: yjsToVal(
        schema.discriminant,
        awareness,
        yjsMap.get('discriminant')
      ),
      value: yjsToVal(
        schema.values[yjsMap.get('discriminant') + ''],
        awareness,
        yjsMap.get('value')
      ),
    };
  }
}

export function parsedValToYjs(
  schema: ComponentSchema,
  value: unknown
): unknown {
  if (schema.kind === 'form' || schema.kind === 'child') {
    return value;
  }
  if (schema.kind === 'object') {
    return new Y.Map(
      Object.entries(schema.fields).map(([key, val]) => [
        key,
        parsedValToYjs(val, (value as any)[key]),
      ])
    );
  }
  if (schema.kind === 'array') {
    const arr = new Y.Array();
    arr.push(
      (value as unknown[]).map(val => parsedValToYjs(schema.element, val))
    );
    return arr;
  }
  if (schema.kind === 'conditional') {
    const discriminant = (value as any).discriminant;
    return new Y.Map([
      ['discriminant', discriminant],
      [
        'value',
        parsedValToYjs(
          schema.values[discriminant.toString()],
          (value as any).value
        ),
      ],
    ]);
  }
}
