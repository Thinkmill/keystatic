/*
  This component is currently not used.
  Nested document fields are not yet
  supported in Keystatic.
*/

// import { cx } from '../../utils';
// import { reader } from '../../keystatic/reader';

export async function SimpleText(props) {
  console.log({ props });
  return <div className="prose" {...props} />;
}
