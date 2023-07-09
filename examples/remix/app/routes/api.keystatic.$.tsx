import { LoaderFunction } from '@remix-run/node';
import { handleLoader } from '@keystatic/remix/api';
import config from '../../local-config';

export const loader: LoaderFunction = args => handleLoader({ config }, args);
