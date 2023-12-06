// this is used in react-server environments to avoid bundling UI when the reader API is used
// if you added a new field and get an error that there's missing a missing export here,
// you probably just need to add another empty export here

function empty() {
  throw new Error("unexpected call to function that shouldn't be called in React server component environment");
}
let SlugFieldInput = empty,
  TextFieldInput = empty,
  UrlFieldInput = empty,
  SelectFieldInput = empty,
  RelationshipInput = empty,
  PathReferenceInput = empty,
  MultiselectFieldInput = empty,
  IntegerFieldInput = empty,
  ImageFieldInput = empty,
  FileFieldInput = empty,
  DatetimeFieldInput = empty,
  DateFieldInput = empty,
  CloudImageFieldInput = empty,
  BlocksFieldInput = empty,
  DocumentFieldInput = empty,
  CheckboxFieldInput = empty,
  createEditorSchema = empty,
  getDefaultValue = empty,
  parseToEditorState = empty,
  serializeFromEditorState = empty;

export { BlocksFieldInput as B, CheckboxFieldInput as C, DocumentFieldInput as D, FileFieldInput as F, ImageFieldInput as I, MultiselectFieldInput as M, PathReferenceInput as P, RelationshipInput as R, SelectFieldInput as S, TextFieldInput as T, UrlFieldInput as U, DateFieldInput as a, DatetimeFieldInput as b, SlugFieldInput as c, CloudImageFieldInput as d, IntegerFieldInput as e, createEditorSchema as f, getDefaultValue as g, parseToEditorState as p, serializeFromEditorState as s };
