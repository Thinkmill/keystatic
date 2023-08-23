import { RenderElementProps } from 'slate-react';

import {
  ComponentBlocksElement,
  ComponentInlineProp,
} from './component-blocks';
import { HeadingElement } from './heading/heading';
import { LayoutArea, LayoutContainer } from './layouts/layouts-ui';
import { LinkElement } from './link/link';
import { CodeElement } from './code-block/code-block-ui';
import { DividerElement } from './divider';
import { ImageElement } from './image';
import {
  TableBodyElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
  TableRowElement,
} from './table/table-ui';

// some of the renderers read properties of the element
// and TS doesn't understand the type narrowing when doing a spread for some reason
// so that's why things aren't being spread in some cases
export const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'layout':
      return (
        <LayoutContainer
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'layout-area':
      return <LayoutArea {...props} />;
    case 'code':
      return (
        <CodeElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'component-block': {
      return (
        <ComponentBlocksElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    }
    case 'component-inline-prop':
    case 'component-block-prop':
      return <ComponentInlineProp {...props} />;
    case 'heading':
      return (
        <HeadingElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'link':
      return (
        <LinkElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'ordered-list':
      return <ol {...props.attributes}>{props.children}</ol>;
    case 'unordered-list':
      return <ul {...props.attributes}>{props.children}</ul>;
    case 'list-item':
      return <li {...props.attributes}>{props.children}</li>;
    case 'list-item-content':
      return <span {...props.attributes}>{props.children}</span>;
    case 'blockquote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>;
    case 'divider':
      return <DividerElement {...props} />;
    case 'image':
      return (
        <ImageElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'table':
      return (
        <TableElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'table-head':
      return (
        <TableHeadElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'table-body':
      return (
        <TableBodyElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'table-row':
      return (
        <TableRowElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );
    case 'table-cell':
      return (
        <TableCellElement
          attributes={props.attributes}
          children={props.children}
          element={props.element}
        />
      );

    default:
      let { textAlign } = props.element;
      return (
        <p style={{ textAlign }} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};
