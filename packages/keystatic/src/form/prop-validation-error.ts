import type { ComponentSchema } from './api';
import type { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';

export class PropValidationError extends Error {
  path: ReadonlyPropPath;
  schema: ComponentSchema;
  cause: unknown;
  constructor(cause: unknown, path: ReadonlyPropPath, schema: ComponentSchema) {
    super(`field error at ${path.join('.')}`, { cause });
    this.path = path;
    this.schema = schema;
    this.cause = cause;
  }
}
