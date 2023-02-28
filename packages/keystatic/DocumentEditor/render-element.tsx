import { RenderElementProps } from 'slate-react';

import { BlockquoteElement } from './blockquote';
import {
  ComponentBlocksElement,
  ComponentInlineProp,
} from './component-blocks';
import { HeadingElement } from './heading';
import { LayoutArea, LayoutContainer } from './layouts';
import { LinkElement } from './link';
import { CodeElement } from './code-block';
import { DividerElement } from './divider';

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
      return <BlockquoteElement {...props} />;
    case 'divider':
      return <DividerElement {...props} />;
    default:
      let { textAlign } = props.element;
      return (
        <p style={{ textAlign }} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};
