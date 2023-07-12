import { Fragment } from 'react';

import { flattenChildren, isReactText } from '@keystar/ui/utils';

let fragmentOfReactText = (
  <Fragment>
    {true && 'test'}
    {false}
    {null}
    {true && 123}
    {undefined}
    {0 ?? 456}
  </Fragment>
);

describe('utils/isReactText', () => {
  it('string', () => {
    expect(isReactText('test')).toEqual(true);
  });
  it('number', () => {
    expect(isReactText(123)).toEqual(true);
  });

  it('arrays', () => {
    expect(isReactText(['test', 'test'])).toEqual(true);
    expect(isReactText([123, 456])).toEqual(true);
    expect(isReactText(['test', 123])).toEqual(true);
  });

  it('invalid arguments', () => {
    expect(isReactText(<span>test</span>)).toEqual(false);
    expect(isReactText([<span>test</span>])).toEqual(false);
    expect(isReactText({ a: 1, b: 2 })).toEqual(false);
    expect(isReactText(undefined)).toEqual(false);
  });

  it('should work with flattenChildren', () => {
    expect(isReactText(flattenChildren(fragmentOfReactText))).toEqual(true);
    expect(
      isReactText(
        flattenChildren(
          <Fragment>
            {flattenChildren(fragmentOfReactText)}
            <Fragment>
              {flattenChildren(fragmentOfReactText)}
              {flattenChildren(fragmentOfReactText)}
            </Fragment>
          </Fragment>
        )
      )
    ).toEqual(true);
  });
});
