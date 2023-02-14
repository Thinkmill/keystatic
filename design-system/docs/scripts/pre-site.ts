import fs from 'fs/promises';
import { getWriteGeneratedDir, GENERATED_DIR } from '../utils/packages';

(async () => {
  const write = await getWriteGeneratedDir();

  try {
    await write();
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      // we're not creating this first because we're optimising
      // for the case where the cache directory exists
      await fs.mkdir(GENERATED_DIR, { recursive: true });
      await write();
    } else {
      throw err;
    }
  }
})();
