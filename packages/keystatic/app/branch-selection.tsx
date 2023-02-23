import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { gql } from '@ts-gql/tag/no-transform';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { useMutation } from 'urql';

import { Button, ButtonGroup } from '@voussoir/button';
import { Dialog } from '@voussoir/dialog';
import { gitBranchIcon } from '@voussoir/icon/icons/gitBranchIcon';
import { Icon } from '@voussoir/icon';
import { Item, Picker } from '@voussoir/picker';
import { Content, Footer } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';
import { ProgressCircle } from '@voussoir/progress';

import l10nMessages from './l10n/index.json';
import { useRouter } from './router';

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
  children?: ReactNode;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [branchName, setBranchName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [{ error, fetching }, createBranch] = useCreateBranchMutation();
  const createBranchSubmitButtonId = 'create-branch-submit-button';

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
          {props.children}
          <TextField
            ref={textFieldRef}
            value={branchName}
            onChange={setBranchName}
            label="Branch name"
            autoFocus
            errorMessage={error?.message}
          />
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
