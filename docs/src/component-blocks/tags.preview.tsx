import { NotEditable, PreviewProps, ObjectField } from '@keystatic/core';

import type { schema } from './tags';

export function preview(props: PreviewProps<ObjectField<typeof schema>>) {
  return (
    <NotEditable>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {props.fields.tags.value.map(tag => (
          <span
            style={{
              border: 'solid 1px #ddd',
              padding: '0.25rem 0.5rem',
              borderRadius: '20px',
              fontSize: '11px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </NotEditable>
  );
}
