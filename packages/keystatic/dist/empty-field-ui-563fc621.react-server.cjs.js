'use strict';

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

exports.BlocksFieldInput = BlocksFieldInput;
exports.CheckboxFieldInput = CheckboxFieldInput;
exports.CloudImageFieldInput = CloudImageFieldInput;
exports.DateFieldInput = DateFieldInput;
exports.DatetimeFieldInput = DatetimeFieldInput;
exports.DocumentFieldInput = DocumentFieldInput;
exports.FileFieldInput = FileFieldInput;
exports.ImageFieldInput = ImageFieldInput;
exports.IntegerFieldInput = IntegerFieldInput;
exports.MultiselectFieldInput = MultiselectFieldInput;
exports.PathReferenceInput = PathReferenceInput;
exports.RelationshipInput = RelationshipInput;
exports.SelectFieldInput = SelectFieldInput;
exports.SlugFieldInput = SlugFieldInput;
exports.TextFieldInput = TextFieldInput;
exports.UrlFieldInput = UrlFieldInput;
exports.createEditorSchema = createEditorSchema;
exports.getDefaultValue = getDefaultValue;
exports.parseToEditorState = parseToEditorState;
exports.serializeFromEditorState = serializeFromEditorState;
