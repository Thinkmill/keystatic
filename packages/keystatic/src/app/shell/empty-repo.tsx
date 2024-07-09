import { Flex } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Heading, Text } from '@keystar/ui/typography';

export function EmptyRepo(props: { repo: string }) {
  return (
    <Flex alignItems="center" justifyContent="center" margin="xxlarge">
      <Flex
        backgroundColor="surface"
        padding="large"
        border="color.alias.borderIdle"
        borderRadius="medium"
        direction="column"
        justifyContent="center"
        gap="xlarge"
        maxWidth="scale.4600"
      >
        <Flex justifyContent="center">
          <Heading>Git repo not initialised</Heading>
        </Flex>
        <Text>
          The Keystatic GitHub App is installed in the GitHub repository{' '}
          <TextLink href={`https://github.com/${props.repo}`}>
            {props.repo}
          </TextLink>{' '}
          but the Git repo is not initialised. Please initialise the Git repo
          before using Keystatic.
        </Text>
      </Flex>
    </Flex>
  );
}
