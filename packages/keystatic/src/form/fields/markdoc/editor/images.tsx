import { Fragment, Slice } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { dropPoint } from 'prosemirror-transform';

import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';

import { getUploadedFileObject } from '../../image/ui';
import { EditorSchema, getEditorSchema } from './schema';
import { ToolbarButton } from './Toolbar';
import { EditorConfig } from '../config';
import { getSrcPrefix } from '../../image/getSrcPrefix';
import { toSerialized } from './props-serialization';

export function getSrcPrefixForImageBlock(
  config: EditorConfig,
  slug: string | undefined
) {
  return getSrcPrefix(
    typeof config.image === 'object' ? config.image.publicPath : undefined,
    slug
  );
}

export function imageDropPlugin(schema: EditorSchema) {
  const imageType = schema.nodes.image;
  return new Plugin({
    props: {
      handleDrop(view, event) {
        if (event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];
          let eventPos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (!eventPos) return;
          let $mouse = view.state.doc.resolve(eventPos.pos);
          for (const [name, component] of Object.entries(schema.components)) {
            if (
              (component.kind !== 'block' && component.kind !== 'inline') ||
              !component.handleFile
            ) {
              continue;
            }
            const result = component.handleFile(
              file,
              (view.props as any).config
            );
            if (!result) continue;
            (async () => {
              const value = await result;
              const slice = Slice.maxOpen(
                Fragment.from(
                  schema.schema.nodes[name].createChecked({
                    props: toSerialized(value, component.schema),
                  })
                )
              );
              const pos = dropPoint(
                view.state.doc,
                view.state.selection.from,
                slice
              );
              if (pos === null) return;
              view.dispatch(view.state.tr.replace(pos, pos, slice));
            })();
            return true;
          }
          if (
            file.type.startsWith('image/') &&
            imageType &&
            schema.config.image
          ) {
            const { transformFilename } = schema.config.image;
            (async () => {
              const slice = Slice.maxOpen(
                Fragment.from(
                  imageType.createChecked({
                    src: new Uint8Array(await file.arrayBuffer()),
                    filename: transformFilename(file.name),
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
          for (const [name, component] of Object.entries(schema.components)) {
            if (component.kind !== 'block' || !component.handleFile) continue;
            const result = component.handleFile(
              file,
              (view.props as any).config
            );
            if (!result) continue;
            (async () => {
              const value = await result;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  schema.schema.nodes[name].createChecked({
                    props: toSerialized(value, component.schema),
                  })
                )
              );
            })();
            return true;
          }
          if (
            file.type.startsWith('image/') &&
            imageType &&
            schema.config.image
          ) {
            const { transformFilename } = schema.config.image;

            (async () => {
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  imageType.createChecked({
                    src: new Uint8Array(await file.arrayBuffer()),
                    filename: transformFilename(file.name),
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
      <ToolbarButton
        aria-label="Image"
        command={(_, dispatch, view) => {
          if (dispatch && view) {
            (async () => {
              const file = await getUploadedFileObject('image/*');
              const schema = getEditorSchema(view.state.schema);
              if (!file || !schema.config.image) return;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.createChecked({
                    src: new Uint8Array(await file.arrayBuffer()),
                    filename: schema.config.image.transformFilename(file.name),
                  })
                )
              );
            })();
          }
          return true;
        }}
      >
        <Icon src={imageIcon} />
      </ToolbarButton>
      <Tooltip>
        <Text>Image</Text>
      </Tooltip>
    </TooltipTrigger>
  );
}
