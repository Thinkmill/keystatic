import { RenderElementProps } from 'slate-react';
import { tokenSchema } from '@voussoir/style';

export const HeadingElement = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'heading' } }) => {
  const ElementType = `h${element.level}` as const;
  return (
    <ElementType
      {...attributes}
      style={{
        color: tokenSchema.color.foreground.neutralEmphasis,
        textAlign: element.textAlign,
      }}
    >
      {children}
    </ElementType>
  );
};
