import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { tokenSchema } from '@keystar/ui/style';
import { blockElementSpacing } from '../ui-utils';
import { BlockPopover, BlockPopoverTrigger } from '../primitives';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex } from '@keystar/ui/layout';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';

import { Transforms } from 'slate';
import {
  CustomAttributesDialog,
  CustomAttributesEditButton,
} from '../custom-attributes';
import { useState } from 'react';
import { useDocumentEditorConfig } from '../toolbar-state';

export const HeadingElement = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'heading' } }) => {
  const ElementType = `h${element.level}` as const;
  const editor = useSlateStatic();
  const { documentFeatures } = useDocumentEditorConfig();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (Object.keys(documentFeatures.formatting.headings.schema).length === 0) {
    return (
      <ElementType
        {...attributes}
        className={blockElementSpacing}
        style={{
          color: tokenSchema.color.foreground.neutralEmphasis,
          textAlign: element.textAlign,
        }}
      >
        {children}
      </ElementType>
    );
  }

  return (
    <>
      <ElementType
        className={blockElementSpacing}
        style={{
          color: tokenSchema.color.foreground.neutralEmphasis,
          textAlign: element.textAlign,
        }}
      >
        <BlockPopoverTrigger element={element}>
          <div>{children}</div>
          <BlockPopover>
            <Flex gap="regular" padding="regular">
              <CustomAttributesEditButton onPress={() => setDialogOpen(true)} />
              <TooltipTrigger>
                <ActionButton
                  prominence="low"
                  onPress={() => {
                    Transforms.removeNodes(editor, {
                      at: ReactEditor.findPath(editor, element),
                    });
                  }}
                >
                  <Icon src={trash2Icon} />
                </ActionButton>
                <Tooltip tone="critical">Remove</Tooltip>
              </TooltipTrigger>
            </Flex>
          </BlockPopover>
        </BlockPopoverTrigger>
      </ElementType>
      <CustomAttributesDialog
        element={element}
        schema={documentFeatures.formatting.headings.schema}
        isOpen={dialogOpen}
        nodeLabel="Heading"
        onDismiss={() => setDialogOpen(false)}
      />
    </>
  );
};
