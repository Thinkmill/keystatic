import { css, tokenSchema } from '@keystar/ui/style';
import { ReactNode, useState } from 'react';
import { RenderLeafProps } from 'slate-react';

import { InsertMenu } from './insert-menu';

function Placeholder({
  placeholder,
  children,
}: {
  placeholder: string;
  children: ReactNode;
}) {
  const [width, setWidth] = useState(0);
  return (
    <span
      className={css({ position: 'relative', display: 'inline-block', width })}
    >
      <span
        contentEditable={false}
        className={css({
          position: 'absolute',
          pointerEvents: 'none',
          display: 'inline-block',
          left: 0,
          top: 0,
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          opacity: '0.5',
          userSelect: 'none',
          fontStyle: 'normal',
          fontWeight: 'normal',
          textDecoration: 'none',
          textAlign: 'left',
        })}
      >
        <span
          ref={node => {
            if (node) {
              const offsetWidth = node.offsetWidth;
              if (offsetWidth !== width) {
                setWidth(offsetWidth);
              }
            }
          }}
        >
          {placeholder}
        </span>
      </span>
      {children}
    </span>
  );
}

const Leaf = ({ leaf, text, children, attributes }: RenderLeafProps) => {
  const {
    underline,
    strikethrough,
    bold,
    italic,
    code,
    keyboard,
    superscript,
    subscript,
    placeholder,
    insertMenu,
    ...rest
  } = leaf;

  if (placeholder !== undefined) {
    children = <Placeholder placeholder={placeholder}>{children}</Placeholder>;
  }

  if (insertMenu) {
    children = <InsertMenu text={text}>{children}</InsertMenu>;
  }

  if (code) {
    children = <code>{children}</code>;
  }
  if (bold) {
    children = <strong>{children}</strong>;
  }
  if (strikethrough) {
    children = <s>{children}</s>;
  }
  if (italic) {
    children = <em>{children}</em>;
  }
  if (keyboard) {
    children = <kbd>{children}</kbd>;
  }
  if (superscript) {
    children = <sup>{children}</sup>;
  }
  if (subscript) {
    children = <sub>{children}</sub>;
  }
  if (underline) {
    children = <u>{children}</u>;
  }
  const prismClassNames = Object.keys(rest)
    .filter(x => x.startsWith('prism_'))
    .map(x => styles.get(x.replace('prism_', '')));
  if (prismClassNames.length) {
    const className = prismClassNames.join(' ');
    children = <span className={className}>{children}</span>;
  }
  return <span {...attributes}>{children}</span>;
};

export const renderLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

const styles = new Map(
  [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: tokenSchema.color.foreground.neutralTertiary,
        fontStyle: 'italic',
      },
    },
    {
      types: ['atrule', 'attr-name', 'class-name', 'selector'],
      style: { color: tokenSchema.color.scale.amber11 },
    },
    {
      types: [
        'boolean',
        'constant',
        'inserted-sign',
        'entity',
        'inserted',
        'number',
        'regex',
        'symbol',
        'variable',
      ],
      style: { color: tokenSchema.color.scale.green11 },
    },
    {
      types: ['attr-value', 'builtin', 'char', 'constant', 'generics', 'url'],
      style: { color: tokenSchema.color.scale.pink11 },
    },
    {
      types: ['string'],
      style: { color: tokenSchema.color.scale.indigo9 },
    },
    {
      types: [
        'annotation',
        'deleted',
        'deleted-sign',
        'decorator',
        'important',
        'tag',
      ],
      style: { color: tokenSchema.color.scale.red11 },
    },
    {
      types: ['function', 'function-variable', 'operator'],
      style: { color: tokenSchema.color.scale.purple11 },
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: { color: tokenSchema.color.scale.indigo11 },
    },
    {
      types: ['punctuation'],
      style: { color: tokenSchema.color.foreground.neutralSecondary },
    },
  ].flatMap(style => {
    const className = css(style.style);
    return style.types.map(x => [x, className]);
  })
);
