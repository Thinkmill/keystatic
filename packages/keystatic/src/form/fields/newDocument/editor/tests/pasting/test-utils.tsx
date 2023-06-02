/** @jsxRuntime classic */
/** @jsx jsx */
import { renderEditor, jsx } from '../utils';
import { MyDataTransfer } from './data-transfer';

export async function htmlToEditor(html: string) {
  const { state, user } = renderEditor(
    <doc>
      <paragraph>
        <cursor />
      </paragraph>
    </doc>
  );
  const data = new MyDataTransfer();
  data.setData('text/html', html);
  await user.paste(data);
  return state();
}
