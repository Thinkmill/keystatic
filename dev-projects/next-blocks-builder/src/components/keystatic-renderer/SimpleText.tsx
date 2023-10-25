// import { cx } from '@/utils';
// import { reader } from '@/keystatic/reader';

export async function SimpleText(props) {
  console.log({ props });
  return <div className="prose" {...props} />;
}
