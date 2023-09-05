import { component } from '..';
import { CloudImagePreview } from '#cloud-image-preview';
import { cloudImageSchema } from './cloud-image-schema';

/** @deprecated Experimental */
export function cloudImage(args: { label: string }) {
  return component({
    label: args.label,
    schema: cloudImageSchema,
    preview: CloudImagePreview,
    chromeless: true,
    toolbar: null,
  });
}
