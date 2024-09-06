import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { gql } from '@ts-gql/tag/no-transform';
import { useMemo, useState } from 'react';
import { CombinedError, useMutation } from 'urql';

import { Button, ButtonGroup } from '@keystar/ui/button';
import { Combobox, Item } from '@keystar/ui/combobox';
import { Dialog } from '@keystar/ui/dialog';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex, Grid } from '@keystar/ui/layout';
import { ProgressCircle } from '@keystar/ui/progress';
import { Radio, RadioGroup } from '@keystar/ui/radio';
import { Content, Footer } from '@keystar/ui/slots';
import { css, tokenSchema } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';

import l10nMessages from './l10n';
import { useRouter } from './router';
import {
  Ref_base,
  useCurrentBranch,
  useBranches,
  useRepoInfo,
} from './shell/data';
import { useConfig } from './shell/context';
import { getBranchPrefix } from './utils';

export function BranchPicker() {
  const branches = useBranches();
  const repoInfo = useRepoInfo();
  const currentBranch = useCurrentBranch();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const config = useConfig();
  const branchPrefix = getBranchPrefix(config);
  const items = useMemo(() => {
    const allBranches = [];
    if (repoInfo) {
      allBranches.push({
        name: repoInfo.defaultBranch,
        description: stringFormatter.format('defaultBranch'),
      });

      for (let branch of branches.keys()) {
        if (branch === repoInfo.defaultBranch) continue;
        allBranches.push({ name: branch });
      }
    }

    return allBranches;
  }, [branches, repoInfo, stringFormatter]);

  const filteredBranches = useMemo(
    () =>
      items.filter(
        item =>
          item.name === repoInfo?.defaultBranch ||
          !branchPrefix ||
          item.name.startsWith(branchPrefix) ||
          item.name === currentBranch
      ),
    [items, repoInfo, branchPrefix, currentBranch]
  );

  return (
    <Combobox
      aria-label={stringFormatter.format('currentBranch')}
      defaultItems={filteredBranches} // use `defaultItems` so the component handles filtering
      loadingState={filteredBranches.length === 0 ? 'loading' : undefined}
      selectedKey={currentBranch}
      onSelectionChange={key => {
        if (typeof key === 'string') {
          router.push(
            router.href.replace(
              /\/branch\/[^/]+/,
              '/branch/' + encodeURIComponent(key)
            )
          );
        }
      }}
      menuTrigger="focus"
      flex
    >
      {item => (
        <Item key={item.name} textValue={item.name}>
          <Icon src={gitBranchIcon} />
          <Text truncate>{item.name}</Text>
          {'description' in item && (
            <Text slot="description">{item.description}</Text>
          )}
        </Item>
      )}
    </Combobox>
  );
}

export function CreateBranchDialog(props: {
  onDismiss: () => void;
  onCreate: (branchName: string) => void;
}) {
  const config = useConfig();
  const repoInfo = useRepoInfo();
  const branches = useBranches();
  const currentBranch = useCurrentBranch();
  const isDefaultBranch = repoInfo?.defaultBranch === currentBranch;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [{ error, fetching }, createBranch] = useCreateBranchMutation();
  const createBranchSubmitButtonId = 'create-branch-submit-button';

  const [branchName, setBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState(repoInfo!.defaultBranch);

  const branchPrefix = getBranchPrefix(config);

  const propsForBranchPrefix = branchPrefix
    ? {
        UNSAFE_className: css({
          '& input': {
            paddingInlineStart: tokenSchema.size.space.xsmall,
          },
        }),
        startElement: (
          <Flex
            alignItems="center"
            paddingStart="regular"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text color="neutralSecondary">{branchPrefix}</Text>
          </Flex>
        ),
      }
    : {};

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          const fullBranchName = (branchPrefix ?? '') + branchName;
          const name = `refs/heads/${fullBranchName}`;
          const result = await createBranch({
            input: {
              name,
              oid: branches.get(baseBranch)!.commitSha,
              repositoryId: repoInfo!.id,
            },
          });

          if (result.data?.createRef?.__typename) {
            props.onCreate(fullBranchName);
          }
        }}
      >
        <Heading>{stringFormatter.format('newBranch')}</Heading>
        <Content>
          {isDefaultBranch ? (
            <TextField
              value={branchName}
              onChange={setBranchName}
              label={stringFormatter.format('branchName')}
              // description="Your new branch will be based on the currently checked out branch, which is the default branch for this repository."
              autoFocus
              errorMessage={prettyErrorForCreateBranchMutation(error)}
              {...propsForBranchPrefix}
            />
          ) : (
            <Grid gap="xlarge">
              <TextField
                label={stringFormatter.format('branchName')}
                value={branchName}
                onChange={setBranchName}
                autoFocus
                errorMessage={prettyErrorForCreateBranchMutation(error)}
                {...propsForBranchPrefix}
              />
              <RadioGroup
                label={stringFormatter.format('basedOn')}
                value={baseBranch}
                onChange={setBaseBranch}
              >
                <Radio value={repoInfo!.defaultBranch}>
                  <Text>
                    {repoInfo!.defaultBranch}
                    <Text visuallyHidden>.</Text>
                  </Text>
                  <Text slot="description">
                    {stringFormatter.format('theDefaultBranchInYourRepository')}
                  </Text>
                </Radio>
                <Radio value={currentBranch}>
                  <Text>
                    {currentBranch}
                    <Text visuallyHidden>.</Text>
                  </Text>
                  <Text slot="description">
                    {stringFormatter.format('theCurrentlyCheckedOutBranch')}
                  </Text>
                </Radio>
              </RadioGroup>
            </Grid>
          )}
        </Content>

        <Footer UNSAFE_style={{ justifyContent: 'flex-end' }}>
          {fetching && (
            <ProgressCircle
              aria-labelledby={createBranchSubmitButtonId}
              isIndeterminate
              size="small"
            />
          )}
        </Footer>
        <ButtonGroup>
          <Button onPress={props.onDismiss} isDisabled={fetching}>
            {stringFormatter.format('cancel')}
          </Button>
          <Button
            isDisabled={fetching}
            prominence="high"
            type="submit"
            id={createBranchSubmitButtonId}
          >
            {stringFormatter.format('create')}
          </Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
}

// Data
// -----------------------------------------------------------------------------

// https://git-scm.com/docs/git-check-ref-format
const invalidAnywhere = [' ', '~', '^', ':', '*', '?', '[', '..', '@{', '\\'];
const invalidStart = ['.', '/'];
const invalidEnd = ['.', '/', '.lock'];

export function prettyErrorForCreateBranchMutation(error?: CombinedError) {
  if (!error) {
    return undefined;
  }

  if (error.message.includes('is not a valid ref name')) {
    let refnameMatch = error.message.match(/"([^"]+)"/);
    let branchname = refnameMatch
      ? refnameMatch[1].replace('refs/heads/', '')
      : '';

    // start rules
    for (let char of invalidStart) {
      if (branchname.startsWith(char)) {
        return `Cannot start with "${char}"`;
      }
    }

    // end rules
    for (let char of invalidEnd) {
      if (branchname.endsWith(char)) {
        return `Cannot end with "${char}"`;
      }
    }

    // anywhere rules
    let invalidMatches = invalidAnywhere.filter(c => branchname.includes(c));
    if (invalidMatches.length > 0) {
      let options = { style: 'long', type: 'conjunction' } as const;
      let formatter = new Intl.ListFormat('en-US', options);
      let list = invalidMatches.map(char => `"${char}"`);
      return `Some characters are not allowed: ${formatter.format(list)}`;
    }

    // unknown
    return 'Invalid branch name';
  }

  return error.message;
}

export function useCreateBranchMutation() {
  return useMutation(
    gql`
      mutation CreateBranch($input: CreateRefInput!) {
        createRef(input: $input) {
          __typename
          ref {
            ...Ref_base
          }
        }
      }
      ${Ref_base}
    ` as import('../../__generated__/ts-gql/CreateBranch').type
  );
}
