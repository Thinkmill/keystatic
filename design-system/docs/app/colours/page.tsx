import { Metadata } from 'next';
import { makePageTitle } from '../utils';
import { Colours } from './colours-inner';

export const metadata: Metadata = {
  title: makePageTitle('Colours'),
};

export default function ColoursPage() {
  return <Colours />;
}
