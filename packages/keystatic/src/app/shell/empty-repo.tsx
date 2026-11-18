import { Flex } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Heading, Text } from '@keystar/ui/typography';

import { formatWithElements, useLocalizedString } from './i18n';

export function EmptyRepo(props: { repo: string }) {
  const stringFormatter = useLocalizedString();
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
          <Heading>{stringFormatter.format('gitRepoNotInitialised')}</Heading>
        </Flex>
        <Text>
          {formatWithElements(stringFormatter, 'gitRepoNotInitialisedMessage', {
            repo: (
              <TextLink href={`https://github.com/${props.repo}`}>
                {props.repo}
              </TextLink>
            ),
          })}
        </Text>
      </Flex>
    </Flex>
  );
}
