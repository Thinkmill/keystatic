import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { handleLoader } from '@keystatic/remix/api';
import config from '../../keystatic.config';

export const loader: LoaderFunction = args => handleLoader({ config }, args);
export const action: ActionFunction = args => handleLoader({ config }, args);
