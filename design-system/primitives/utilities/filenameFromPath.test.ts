import { filenameFromPath } from './filenameFromPath';

describe('Utilities: filenameFromPath', () => {
  it('gets the file name from a path', () => {
    expect(filenameFromPath('path/to/filename.ts')).toStrictEqual('filename');
  });

  it('handles deep paths', () => {
    expect(filenameFromPath('deeply/nested/path/to/filename.ts')).toStrictEqual(
      'filename'
    );
  });

  it('handles shallow paths', () => {
    expect(filenameFromPath('filename.ts')).toStrictEqual('filename');
  });

  it('handles files containing dots', () => {
    expect(filenameFromPath('path/to/filename.test.ts')).toStrictEqual(
      'filename.test'
    );
  });
});
