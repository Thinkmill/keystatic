import { Box } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { ReactNode, useState } from 'react';
import { RenderLeafProps } from 'slate-react';
import { InsertMenu } from './insert-menu';

function Placeholder({ placeholder, children }: { placeholder: string; children: ReactNode }) {
  const [width, setWidth] = useState(0);
  return (
    <span className={css({ position: 'relative', display: 'inline-block', width })}>
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
    children = (
      <Box
        elementType="code"
        backgroundColor="accent"
        paddingX="xsmall"
        paddingY={2}
        borderRadius="small"
        UNSAFE_className={css({
          color: tokenSchema.color.foreground.neutralEmphasis,
          fontSize: '0.85em',
          fontFamily: tokenSchema.typography.fontFamily.code,
        })}
      >
        {children}
      </Box>
    );
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

// styles from https://github.com/FormidableLabs/prism-react-renderer/blob/d307f34360ecc4f0b4aadde4f72d09fd6dbf0132/src/themes/github.js
const styles = new Map(
  [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#999988', fontStyle: 'italic' },
    },
    {
      types: ['namespace'],
      style: { opacity: 0.7 },
    },
    {
      types: ['string', 'attr-value'],
      style: { color: '#e3116c' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#393A34' },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted',
      ],
      style: { color: '#36acaa' },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: { color: '#00a4db' },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: { color: '#d73a49' },
    },
    {
      types: ['function-variable'],
      style: { color: '#6f42c1' },
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: { color: '#00009f' },
    },
  ].flatMap(style => {
    const className = css(style.style);
    return style.types.map(x => [x, className]);
  })
);
