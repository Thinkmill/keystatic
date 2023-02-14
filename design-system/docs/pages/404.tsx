import { Heading, Text } from '@voussoir/typography';
import { DocsContent } from '../components/content';

export default function NotFoundPage() {
  return (
    <DocsContent pageTitle="Page not found">
      <Heading size="large" elementType="h1">
        Page not found
      </Heading>
      <Text>This page does not exist. Please check the URL and try again.</Text>
    </DocsContent>
  );
}
