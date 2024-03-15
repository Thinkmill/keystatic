import { Heading, Text } from '@keystar/ui/typography';
import { Metadata } from 'next';
import { DocsContent } from '../../components/content';
import { makePageTitle } from './utils';

export const metadata: Metadata = {
  title: makePageTitle('Page not found'),
};

export default function NotFoundPage() {
  return (
    <DocsContent>
      <Heading size="large" elementType="h1">
        Page not found
      </Heading>
      <Text>This page does not exist. Please check the URL and try again.</Text>
    </DocsContent>
  );
}
