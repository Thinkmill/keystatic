import fs from 'fs/promises';
import { writeComponentReexports, GENERATED_DIR } from '../utils/packages';

(async () => {
  try {
    await writeComponentReexports();
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      // we're not creating this first because we're optimising
      // for the case where the cache directory exists
      await fs.mkdir(GENERATED_DIR, { recursive: true });
      await writeComponentReexports();
    } else {
      throw err;
    }
  }
})();
