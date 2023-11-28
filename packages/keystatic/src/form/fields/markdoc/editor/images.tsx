import { Icon } from '@keystar/ui/icon';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';
import { EditorToolbarButton } from './Toolbar';
import { getUploadedFileObject } from '../../image/ui';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { Plugin } from 'prosemirror-state';
import { EditorSchema } from './schema';
import { dropPoint } from 'prosemirror-transform';
import { Fragment, Slice } from 'prosemirror-model';

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = evt => {
      resolve(evt.target!.result! as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function imageDropPlugin(schema: EditorSchema) {
  return new Plugin({
    props: {
      handleDrop(view, event) {
        if (event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];

          if (file.type.startsWith('image/')) {
            let eventPos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (!eventPos) return;

            let $mouse = view.state.doc.resolve(eventPos.pos);

            (async () => {
              const src = await readFileAsDataUrl(file);
              const slice = Slice.maxOpen(
                Fragment.from(
                  schema.nodes.image.createChecked({
                    src,
                    filename: file.name,
                  })
                )
              );
              const pos = dropPoint(view.state.doc, $mouse.pos, slice);
              if (pos === null) return false;
              view.dispatch(view.state.tr.replace(pos, pos, slice));
            })();
            return true;
          }
        }
      },
      handlePaste(view, event) {
        if (event.clipboardData?.files.length) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            (async () => {
              const src = await readFileAsDataUrl(file);
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  schema.nodes.image.createChecked({
                    src,
                    filename: file.name,
                  })
                )
              );
            })();
            return true;
          }
        }
      },
    },
  });
}
export function ImageToolbarButton() {
  return (
    <TooltipTrigger>
      <EditorToolbarButton
        aria-label="Image"
        command={(_, dispatch, view) => {
          if (dispatch && view) {
            (async () => {
              const file = await getUploadedFileObject('image/*');
              if (!file) return;
              const src = await readFileAsDataUrl(file);
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.createChecked({
                    src,
                    filename: file.name,
                  })
                )
              );
            })();
          }
          return true;
        }}
      >
        <Icon src={imageIcon} />
      </EditorToolbarButton>
      <Tooltip>
        <Text>Image</Text>
      </Tooltip>
    </TooltipTrigger>
  );
}
