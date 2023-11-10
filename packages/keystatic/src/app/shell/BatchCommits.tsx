import { useEffect, useMemo, useReducer } from 'react';

import { Badge } from '@keystar/ui/badge';
import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import {
  AlertDialog,
  Dialog,
  DialogContainer,
  DialogTrigger,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { Flex, HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ListView, Item } from '@keystar/ui/list-view';
import { Content, Footer } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { useRouter } from '../router';

import { useAppState, useConfig } from './context';
import { useBranchInfo, useChanged } from './data';

const typeToTone = {
  added: 'positive',
  changed: 'accent',
  removed: 'critical',
} as const;

type ChangeType = keyof typeof typeToTone;
type Change = {
  href: string;
  oldSlug?: string;
  slug: string;
  type: ChangeType;
};
// collection or singleton changes keyed by label
type Changes = Record<string, Change[]>;

export function BatchCommits() {
  let [isOpen, toggleOpen] = useReducer(bool => !bool, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>
        <Text>Commit changes…</Text>
      </ActionButton>
      <DialogContainer onDismiss={toggleOpen}>
        {isOpen && <BatchCommitsDialog />}
      </DialogContainer>
    </>
  );
}

function BatchCommitsDialog() {
  const branchInfo = useBranchInfo();
  let router = useRouter();
  let { basePath } = useAppState();
  let config = useConfig();
  let changeMap = useChanged();
  let previousHref = usePrevious(router.href);
  let { dismiss } = useDialogContainer();

  let changeCount = useMemo(() => {
    let count = 0;
    for (const key of changeMap.collections.keys()) {
      const counts = changeMap.collections.get(key);
      count +=
        (counts?.added?.size || 0) +
        (counts?.changed?.size || 0) +
        (counts?.removed?.size || 0);
    }
    count += changeMap.singletons?.size || 0;
    return count;
  }, [changeMap.collections, changeMap.singletons.size]);

  useEffect(() => {
    if (previousHref && previousHref !== router.href) {
      dismiss();
    }
  }, [previousHref, dismiss, router.href]);

  const allChanges: Changes = {};
  if (config.collections) {
    for (const key of Object.keys(config.collections)) {
      const counts = changeMap.collections.get(key);
      const additions = Array.from(counts?.added || []);
      const changes = Array.from(counts?.changed || []);
      const removals = Array.from(counts?.removed || []);

      if (!additions.length && !changes.length && !removals.length) {
        continue;
      }

      const label = config.collections[key].label;

      allChanges[label] = [
        changes.map(slug => ({
          slug: `${key}/${slug}`,
          href: getCollectionItemHref(basePath, key, slug),
          type: 'changed' as const,
        })),
        additions.map(slug => ({
          slug: `${key}/${slug}`,
          href: getCollectionItemHref(basePath, key, slug),
          type: 'added' as const,
        })),
        removals.map(slug => ({
          slug: `${key}/${slug}`,
          href: getCollectionItemHref(basePath, key, slug),
          type: 'removed' as const,
        })),
      ].flat();
    }
  }

  if (config.singletons) {
    for (const key of Object.keys(config.singletons)) {
      let changes = changeMap.singletons.has(key);

      if (!changes) {
        continue;
      }
      const label = config.singletons[key].label;

      allChanges[label] = [
        {
          href: `${basePath}/singleton/${encodeURIComponent(key)}`,
          slug: key,
          type: 'changed' as const,
        },
      ];
    }
  }

  return (
    <Dialog size="large">
      <Heading>Review changes</Heading>
      <Content>
        <VStack gap="xlarge">
          {Object.entries(allChanges).map(([label, changes]) => (
            <VStack gap="medium">
              <Text color="neutralEmphasis" weight="semibold">
                {label}
              </Text>
              <ListView
                aria-label="list view collection example"
                items={changes}
                selectionMode="multiple"
              >
                {item => (
                  <Item
                    key={item.slug}
                    textValue={`${item.slug}, ${item.type}`}
                  >
                    <HStack gridArea="content" alignItems="center">
                      {item.type === 'removed' ? (
                        <Text color="color.alias.foregroundDisabled">
                          {item.slug}
                        </Text>
                      ) : (
                        <TextLink href={item.href}>{item.slug}</TextLink>
                      )}
                      <Badge tone={typeToTone[item.type]}>{item.type}</Badge>
                    </HStack>
                  </Item>
                )}
              </ListView>
            </VStack>
          ))}
        </VStack>
      </Content>
      <Footer>
        <Flex alignItems="center" gap="regular">
          <Icon src={gitBranchIcon} color="neutralSecondary" />
          <Text color="neutralSecondary">{branchInfo.currentBranch}</Text>
          <Badge tone="pending">{changeCount} changes</Badge>
        </Flex>
      </Footer>
      <ButtonGroup>
        <Button onPress={dismiss}>Cancel</Button>
        {/* <Button onPress={dismiss} prominence="high">
          Commit
        </Button> */}
        <DialogTrigger>
          <Button prominence="high">Commit</Button>
          <ConfirmDialog onConfirm={() => {}} />
        </DialogTrigger>
      </ButtonGroup>
    </Dialog>
  );
}

function ConfirmDialog(props: { onConfirm: () => void }) {
  return (
    <AlertDialog
      title="Commit changes"
      cancelLabel="Cancel"
      primaryActionLabel="Yes, commit"
      autoFocusButton="cancel"
      onPrimaryAction={props.onConfirm}
    >
      Are you sure? This action cannot be undone.
    </AlertDialog>
  );
}

// Utils
// ----------------------------------------------------------------------------

// TODO: move somewhere more appropriate
// NOTE: expected to be able to use `require('../utils').getCollectionItemPath` but that doesn't work
function getCollectionItemHref(
  basePath: string,
  collection: string,
  key: string
): string {
  return `${basePath}/collection/${encodeURIComponent(
    collection
  )}/item/${encodeURIComponent(key)}`;
}
