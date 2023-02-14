import { gql } from '@ts-gql/tag/no-transform';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'urql';

import { Button, ButtonGroup } from '@voussoir/button';
import { Dialog } from '@voussoir/dialog';
import { gitBranchIcon } from '@voussoir/icon/icons/gitBranchIcon';
import { Icon } from '@voussoir/icon';
import { Item, Picker, Section } from '@voussoir/picker';
import { Content } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Text } from '@voussoir/typography';
import { ProgressCircle } from '@voussoir/progress';

type BranchPickerProps = { allBranches: string[]; currentBranch: string; defaultBranch?: string };

export function BranchPicker(props: BranchPickerProps) {
  const { allBranches, currentBranch, defaultBranch } = props;
  const router = useRouter();
  const items = useMemo(() => {
    let defaultItems = allBranches.map(name => ({
      id: name,
      name,
    }));
    if (defaultBranch) {
      return [
        {
          label: 'Default branch',
          id: 'default-branch',
          children: [{ id: defaultBranch, name: defaultBranch }],
        },
        {
          label: 'Other branches',
          id: 'other-branches',
          children: defaultItems.filter(i => i.name !== defaultBranch),
        },
      ];
    }

    return [
      {
        label: 'Other branches',
        id: 'other-branches',
        children: defaultItems,
      },
    ];
  }, [allBranches, defaultBranch]);

  return (
    <Picker
      aria-label="Branch selection"
      flex
      width="100%"
      items={items}
      selectedKey={currentBranch}
      onSelectionChange={key => {
        if (typeof key === 'string') {
          router.push(router.asPath.replace(/\/branch\/[^/]+/, '/branch/' + key));
        }
      }}
    >
      {section => (
        <Section key={section.id} title={section.label} items={section.children}>
          {item => (
            <Item key={item.id} textValue={item.name}>
              <Icon src={gitBranchIcon} />
              <Text>{item.name}</Text>
            </Item>
          )}
        </Section>
      )}
    </Picker>
  );
}

export function CreateBranchDialog(props: {
  branchOid: string;
  repositoryId: string;
  onDismiss: () => void;
  onCreate: (branchName: string) => void;
  children?: ReactNode;
}) {
  const [branchName, setBranchName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [{ error, fetching }, createBranch] = useCreateBranchMutation();

  return (
    <Dialog>
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          event.preventDefault();
          const name = `refs/heads/${branchName}`;
          const result = await createBranch({
            input: { name, oid: props.branchOid, repositoryId: props.repositoryId },
          });

          if (result.data?.createRef?.__typename) {
            props.onCreate(branchName);
          }
        }}
      >
        <Content>
          {props.children}
          <TextField
            ref={textFieldRef}
            value={branchName}
            onChange={setBranchName}
            // description="Press ESC to cancel"
            label="Branch name"
            placeholder="branch-name"
            autoFocus
            errorMessage={error?.message}
          />
        </Content>
        <ButtonGroup>
          {fetching && <ProgressCircle isIndeterminate aria-label="Creating Branch" />}
          <Button onPress={props.onDismiss} isDisabled={fetching}>
            Cancel
          </Button>
          <Button isDisabled={fetching} prominence="high" type="submit">
            Create
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
