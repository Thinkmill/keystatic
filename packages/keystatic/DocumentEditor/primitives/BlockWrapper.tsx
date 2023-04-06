import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import { blockElementSpacing } from '../ui-utils';

type BlockWrapperProps = {
  attributes?: RenderElementProps['attributes'];
  children: ReactNode;
  draggable?: boolean;
};

export const BlockWrapper = (props: BlockWrapperProps) => {
  let { attributes, children, draggable = false } = props;
  return (
    <div draggable={draggable} className={blockElementSpacing} {...attributes}>
      {children}
    </div>
  );
};
