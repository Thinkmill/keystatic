import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { gql } from '@ts-gql/tag/no-transform';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { useMutation } from 'urql';

import { Button, ButtonGroup } from '@voussoir/button';
import { Dialog } from '@voussoir/dialog';
import { gitBranchIcon } from '@voussoir/icon/icons/gitBranchIcon';
import { Icon } from '@voussoir/icon';
import { Item, Picker } from '@voussoir/picker';
import { ProgressCircle } from '@voussoir/progress';
import { Radio, RadioGroup } from '@voussoir/radio';
import { Content, Footer } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';

import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { Grid } from '@voussoir/layout';

type BranchPickerProps = {
  allBranches: string[];
  currentBranch: string;
  defaultBranch?: string;
};

export function BranchPicker(props: BranchPickerProps) {
  const { allBranches, currentBranch, defaultBranch } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const items = useMemo(() => {
    let defaultItems = allBranches.map(name => ({
      id: name,
      name,
    }));

    if (defaultBranch) {
      return [
        {
          id: defaultBranch,
          name: defaultBranch,
          description: stringFormatter.format('defaultBranch'),
        },
        ...defaultItems.filter(i => i.name !== defaultBranch),
      ];
    }

    return defaultItems;
  }, [allBranches, defaultBranch, stringFormatter]);

  return (
    <Picker
      aria-label={stringFormatter.format('currentBranch')}
      flex
      width="100%"
      items={items}
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
    >
      {item => (
        <Item key={item.id} textValue={item.name}>
          <Icon src={gitBranchIcon} />
          <Text>{item.name}</Text>
          {'description' in item && (
            <Text slot="description">{item.description}</Text>
          )}
        </Item>
      )}
    </Picker>
  );
}

export function CreateBranchDialog(props: {
  branchOid: string;
  repositoryId: string;
  onDismiss: () => void;
  onCreate: (branchName: string) => void;
  currentBranch: string;
  defaultBranch?: string;
}) {
  const { currentBranch, defaultBranch } = props;
  const isDefaultBranch = defaultBranch === currentBranch;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [{ error, fetching }, createBranch] = useCreateBranchMutation();
  const createBranchSubmitButtonId = 'create-branch-submit-button';

  const [branchName, setBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState(defaultBranch ?? currentBranch);

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          event.preventDefault();
          const name = `refs/heads/${branchName}`;
          const result = await createBranch({
            input: {
              name,
              oid: props.branchOid,
              repositoryId: props.repositoryId,
            },
          });

          if (result.data?.createRef?.__typename) {
            props.onCreate(branchName);
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
              errorMessage={error?.message}
            />
          ) : (
            <Grid gap="xlarge">
              <TextField
                label={stringFormatter.format('branchName')}
                value={branchName}
                onChange={setBranchName}
                autoFocus
                errorMessage={error?.message}
              />
              <RadioGroup
                label={stringFormatter.format('basedOn')}
                value={baseBranch}
                onChange={setBaseBranch}
              >
                <Radio value={defaultBranch}>
                  <Text>
                    {defaultBranch}
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

export function useCreateBranchMutation() {
  return useMutation(
    gql`
      mutation CreateBranch($input: CreateRefInput!) {
        createRef(input: $input) {
          __typename
          ref {
            __typename
            id
            name
            target {
              __typename
              id
              oid
              ... on Commit {
                tree {
                  id
                  oid
                }
              }
            }
            associatedPullRequests(states: [OPEN]) {
              totalCount
            }
          }
        }
      }
    ` as import('../__generated__/ts-gql/CreateBranch').type
  );
}
