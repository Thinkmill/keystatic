import { css } from '@keystar/ui/style';
import React, { useContext, useMemo, ReactElement } from 'react';
import { Element } from 'slate';
import { ComponentBlock } from '../../../../api';
import { createGetPreviewProps } from '../../../../preview-props';
import { ReadonlyPropPath, getSchemaAtPropPath } from './utils';
import { getKeysForArrayValue } from '../../../../initial-values';

export const ChildrenByPathContext = React.createContext<
  Record<string, ReactElement>
>({});

export function ChildFieldEditable({ path }: { path: readonly string[] }) {
  const childrenByPath = useContext(ChildrenByPathContext);
  const child = childrenByPath[JSON.stringify(path)];
  if (child === undefined) {
    return null;
  }
  return child;
}

export function ComponentBlockRender({
  componentBlock,
  element,
  onChange,
  children,
  onRemove,
}: {
  element: Element & { type: 'component-block' };
  onChange: (
    cb: (props: Record<string, unknown>) => Record<string, unknown>,
    ignoreChildFields: boolean
  ) => void;
  onRemove: () => void;
  componentBlock: ComponentBlock;
  children: any;
}) {
  const getPreviewProps = useMemo(() => {
    return createGetPreviewProps(
      { kind: 'object', fields: componentBlock.schema },
      cb => onChange(cb, true),
      path => <ChildFieldEditable path={path} />
    );
  }, [onChange, componentBlock]);

  const previewProps = getPreviewProps(element.props);

  const childrenByPath: Record<string, ReactElement> = {};
  let maybeChild: ReactElement | undefined;
  let extraChildren: ReactElement[] = [];
  children.forEach((child: ReactElement) => {
    const propPath = (child.props as any).children.props.element.propPath;
    if (propPath === undefined) {
      maybeChild = child;
    } else {
      const schema = getSchemaAtPropPath(
        propPath,
        element.props,
        componentBlock.schema
      );
      if (
        schema?.kind === 'child' &&
        schema.options.kind === 'block' &&
        schema.options.editIn === 'modal'
      ) {
        extraChildren.push(child);
        return;
      }
      childrenByPath[
        JSON.stringify(propPathWithIndiciesToKeys(propPath, element.props))
      ] = child;
    }
  });

  const ComponentBlockPreview = componentBlock.preview;

  return (
    <ChildrenByPathContext.Provider value={childrenByPath}>
      {useMemo(
        () => (
          <ComponentBlockPreview onRemove={onRemove} {...previewProps} />
        ),
        [ComponentBlockPreview, onRemove, previewProps]
      )}
      <span
        className={css({
          caretColor: 'transparent',
          '& ::selection': { backgroundColor: 'transparent' },
          overflow: 'hidden',
          width: 1,
          height: 1,
          position: 'absolute',
        })}
      >
        {maybeChild}
        {extraChildren}
      </span>
    </ChildrenByPathContext.Provider>
  );
}

// note this is written to avoid crashing when the given prop path doesn't exist in the value
// this is because editor updates happen asynchronously but we have some logic to ensure
// that updating the props of a component block synchronously updates it
// (this is primarily to not mess up things like cursors in inputs)
// this means that sometimes the child elements will be inconsistent with the values
// so to deal with this, we return a prop path this is "wrong" but won't break anything
function propPathWithIndiciesToKeys(
  propPath: ReadonlyPropPath,
  val: any
): readonly string[] {
  return propPath.map(key => {
    if (typeof key === 'string') {
      val = val?.[key];
      return key;
    }
    if (!Array.isArray(val)) {
      val = undefined;
      return '';
    }
    const keys = getKeysForArrayValue(val);
    val = val?.[key];
    return keys[key];
  });
}
