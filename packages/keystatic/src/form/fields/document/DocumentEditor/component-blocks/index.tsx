import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Descendant, Editor, Transforms } from 'slate';

import {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
  useElementWithSetNodes,
  useEventCallback,
} from '../ui-utils';
import { ComponentBlock } from '../../../../api';
import { createGetPreviewProps } from '../../../../preview-props';
import { updateComponentBlockElementProps } from './update-element';
import { ComponentBlockRender } from './component-block-render';
import { ChromefulComponentBlockElement } from './chromeful-element';
import { ChromelessComponentBlockElement } from './chromeless-element';
import { useDocumentEditorConfig } from '../toolbar-state';
import { getInitialPropsValue } from '../../../../initial-values';
import { findChildPropPaths } from './child-prop-paths';
import { transformProps } from '../../../../props-value';
import { cloneDescendent } from './utils';

export { withComponentBlocks } from './with-component-blocks';

export function ComponentInlineProp(props: RenderElementProps) {
  return <span {...props.attributes}>{props.children}</span>;
}

function getInitialValue(type: string, componentBlock: ComponentBlock) {
  const props = getInitialPropsValue({
    kind: 'object',
    fields: componentBlock.schema,
  });
  return {
    type: 'component-block' as const,
    component: type,
    props,
    children: findChildPropPaths(props, componentBlock.schema).map(x => ({
      type: `component-${x.options.kind}-prop` as const,
      propPath: x.path,
      children: [
        x.options.kind === 'block'
          ? { type: 'paragraph' as const, children: [{ text: '' }] }
          : { text: '' },
      ],
    })),
  };
}

export function insertComponentBlock(
  editor: Editor,
  componentBlocks: Record<string, ComponentBlock>,
  componentBlock: string
) {
  const node = getInitialValue(componentBlock, componentBlocks[componentBlock]);
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, node);

  const componentBlockEntry = Editor.above(editor, {
    match: node => node.type === 'component-block',
  });

  if (componentBlockEntry) {
    const start = Editor.start(editor, componentBlockEntry[1]);
    Transforms.setSelection(editor, { anchor: start, focus: start });
  }
}

export const ComponentBlocksElement = ({
  attributes,
  children,
  element: __elementToGetPath,
}: RenderElementProps & { element: { type: 'component-block' } }) => {
  const editor = useSlateStatic();
  const [currentElement, setElement] = useElementWithSetNodes(
    editor,
    __elementToGetPath
  );
  const blockComponents = useDocumentEditorConfig().componentBlocks;
  const componentBlock = blockComponents[currentElement.component] as
    | ComponentBlock
    | undefined;

  const propsWithChildFields = useMemo(() => {
    if (!componentBlock) return;
    const blockChildrenByPath = new Map<string, Descendant[]>();
    for (const child of currentElement.children) {
      if (child.type === 'component-block-prop' && child.propPath) {
        blockChildrenByPath.set(JSON.stringify(child.propPath), child.children);
      }
    }
    if (!blockChildrenByPath.size) return currentElement.props;
    return transformProps(
      { kind: 'object', fields: componentBlock.schema },
      currentElement.props,
      {
        child(schema, value, propPath) {
          if (schema.options.kind === 'block') {
            const key = JSON.stringify(propPath);
            const children = blockChildrenByPath.get(key);
            if (children) {
              return children.map(cloneDescendent) as any;
            }
          }
          return value;
        },
      }
    ) as Record<string, unknown>;
  }, [componentBlock, currentElement]);

  const elementToGetPathRef = useRef({
    __elementToGetPath,
    currentElement,
    propsWithChildFields,
  });

  useEffect(() => {
    elementToGetPathRef.current = {
      __elementToGetPath,
      currentElement,
      propsWithChildFields,
    };
  });

  const onRemove = useEventCallback(() => {
    const path = ReactEditor.findPath(editor, __elementToGetPath);
    Transforms.removeNodes(editor, { at: path });
  });

  const onPropsChange = useCallback(
    (
      cb: (prevProps: Record<string, unknown>) => Record<string, unknown>,
      ignoreChildFields: boolean
    ) => {
      const prevProps = elementToGetPathRef.current.propsWithChildFields!;
      updateComponentBlockElementProps(
        editor,
        componentBlock!,
        prevProps,
        cb(prevProps),
        ReactEditor.findPath(
          editor,
          elementToGetPathRef.current.__elementToGetPath
        ),
        setElement,
        ignoreChildFields
      );
    },
    [setElement, componentBlock, editor]
  );

  const getToolbarPreviewProps = useMemo(() => {
    if (!componentBlock) {
      return () => {
        throw new Error('expected component block to exist when called');
      };
    }
    return createGetPreviewProps(
      { kind: 'object', fields: componentBlock.schema },
      cb => onPropsChange(cb, false),
      () => undefined
    );
  }, [componentBlock, onPropsChange]);

  if (!componentBlock) {
    return (
      <div style={{ border: 'red 4px solid', padding: 8 }}>
        <pre contentEditable={false} style={{ userSelect: 'none' }}>
          {`The block "${currentElement.component}" no longer exists.

Props:

${JSON.stringify(currentElement.props, null, 2)}

Content:`}
        </pre>
        {children}
      </div>
    );
  }

  const toolbarPreviewProps = getToolbarPreviewProps(
    propsWithChildFields as any
  );

  const renderedBlock = (
    <ComponentBlockRender
      children={children}
      componentBlock={componentBlock}
      element={currentElement}
      onChange={onPropsChange}
      onRemove={onRemove}
    />
  );

  return componentBlock.chromeless ? (
    <ChromelessComponentBlockElement
      element={__elementToGetPath}
      attributes={attributes}
      renderedBlock={renderedBlock}
      componentBlock={componentBlock}
      onRemove={onRemove}
      previewProps={toolbarPreviewProps}
    />
  ) : (
    <ChromefulComponentBlockElement
      attributes={attributes}
      children={children}
      componentBlock={componentBlock}
      onRemove={onRemove}
      previewProps={toolbarPreviewProps}
      renderedBlock={renderedBlock}
      elementProps={currentElement.props}
    />
  );
};
