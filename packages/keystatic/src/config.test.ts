import { expect, test } from 'vitest';
import { collection, fields } from './index';
import { parseProps } from './form/parse-props';

test('collection().columns accepts scalar array fields and rejects object/content fields', () => {
  const validCollection = collection({
    label: 'Posts',
    slugField: 'slug',
    columns: ['slug', 'title', 'tags', 'counts', 'slugList'],
    schema: {
      slug: fields.slug({ name: { label: 'Slug' } }),
      title: fields.text({ label: 'Title' }),
      tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
      counts: fields.array(fields.integer({ label: 'Count' }), {
        label: 'Counts',
      }),
      slugList: fields.array(fields.slug({ name: { label: 'Item slug' } }), {
        label: 'Slug list',
      }),
      nested: fields.array(
        fields.object({ name: fields.text({ label: 'Name' }) }),
        { label: 'Nested' }
      ),
      body: fields.markdoc({ label: 'Body' }),
    },
  });

  collection({
    label: 'Invalid columns',
    slugField: 'slug',
    columns: [
      // @ts-expect-error array of objects is not allowed in columns
      'nested',
      // @ts-expect-error content field is not allowed in columns
      'body',
    ],
    schema: validCollection.schema,
  });

  expect(validCollection.columns).toEqual([
    'slug',
    'title',
    'tags',
    'counts',
    'slugList',
  ]);

  const parsed = parseProps(
    { kind: 'object', fields: validCollection.schema },
    { slug: 'hello', title: 'Hello', tags: ['a', 'b'], counts: [1, 2] },
    [],
    [],
    (schema, value, path) => {
      if (schema.formKind === 'content' || schema.formKind === 'assets') {
        return;
      }
      if (
        path.length === 1 &&
        path[0] === 'slug' &&
        schema.formKind === 'slug'
      ) {
        return schema.reader.parseWithSlug(value, { slug: 'hello', glob: '*' });
      }
      return schema.reader.parse(value);
    },
    true
  );

  expect((parsed as { tags: unknown }).tags + '').toBe('a,b');
  expect((parsed as { counts: unknown }).counts + '').toBe('1,2');
});
