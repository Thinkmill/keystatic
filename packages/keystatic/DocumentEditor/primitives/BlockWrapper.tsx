import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';

import { css } from '@voussoir/style';

type BlockWrapperProps = {
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
  draggable?: boolean;
};

export const BlockWrapper = (props: BlockWrapperProps) => {
  let { attributes, children, draggable = false } = props;
  return (
    <div draggable={draggable} className={blockWrapperStyles} {...attributes}>
      {children}
    </div>
  );
};

const blockWrapperStyles = css({
  marginBlock: '1em',

  '&:first-child': {
    marginTop: 0,
  },
  '&:last-child': {
    marginBottom: 0,
  },
});
