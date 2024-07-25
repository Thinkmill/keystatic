import { LoadingState, Selection } from '@react-types/shared';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { Badge } from '@keystar/ui/badge';
import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Checkbox } from '@keystar/ui/checkbox';
import {
  Dialog,
  DialogContainer,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { minusSquareIcon } from '@keystar/ui/icon/icons/minusSquareIcon';
import { plusSquareIcon } from '@keystar/ui/icon/icons/plusSquareIcon';
import { dotSquareIcon } from '@keystar/ui/icon/icons/dotSquareIcon';
import { undoIcon } from '@keystar/ui/icon/icons/undoIcon';
import { HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ListView, Item } from '@keystar/ui/list-view';
import { Content, Header } from '@keystar/ui/slots';
import {
  breakpointQueries,
  css,
  tokenSchema,
  useMediaQuery,
} from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { Config } from '../../config';

import { BranchPicker } from '../branch-selection';
import { useRouter } from '../router';
import { pluralize } from '../pluralize';

import { useAppState, useConfig } from './context';
import { useChanged, useCurrentBranch, useTree } from './data';

const typeMap = {
  added: {
    icon: plusSquareIcon,
    tone: 'positive',
  },
  changed: {
    icon: dotSquareIcon,
    tone: 'accent',
  },
  removed: {
    icon: minusSquareIcon,
    tone: 'critical',
  },
} as const;

type ChangeType = keyof typeof typeMap;
type Change = { href: string; slug: string; type: ChangeType };

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
  let router = useRouter();
  let isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  let currentBranch = useCurrentBranch();
  let previousBranch = usePrevious(currentBranch);
  let previousHref = usePrevious(router.href);
  let { dismiss } = useDialogContainer();

  let dialogRef = useRef<HTMLDivElement>(null);
  let headingRef = useRef<HTMLHeadingElement>(null);

  const { items, loadingState } = useChangedItems();
  const selection = useListSelection(items);

  useEffect(() => {
    // if we've changed branches, keep the dialog open and clear the selection
    if (previousBranch && previousBranch !== currentBranch) {
      selection.clearAll();
      return;
    }

    // if we've navigated away from the page, dismiss the dialog
    if (previousHref && previousHref !== router.href) {
      dismiss();
    }
  }, [
    selection,
    previousHref,
    previousBranch,
    dismiss,
    router.href,
    currentBranch,
  ]);

  return (
    <Dialog size="large" ref={dialogRef} aria-label="Review changes">
      {!isBelowTablet && (
        <>
          <Heading ref={headingRef}>Review changes</Heading>
          <Header>
            <BranchPicker />
          </Header>
        </>
      )}
      <Content
        UNSAFE_className={css({
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        })}
      >
        <Checkbox
          autoFocus
          isDisabled={items.length === 0}
          isIndeterminate={!selection.isEmpty && !selection.isSelectAll}
          onChange={selection.toggleAll}
          isSelected={selection.isSelectAll}
          UNSAFE_className={css({
            marginInlineEnd: 'auto',
            paddingTop: tokenSchema.size.alias.focusRing, // avoid clipping focus ring
            paddingInline: tokenSchema.size.space.medium, // align with list view checkboxes
            height: tokenSchema.size.element.regular, // ensure decent hit area
          })}
        >
          <Text weight="medium">
            <Text visuallyHidden>Select </Text>
            {pluralize(items.length, { singular: 'change', plural: 'changes' })}
          </Text>
        </Checkbox>
        <ListView
          aria-label={`Changes to "${currentBranch}" branch.`}
          density="compact"
          items={items}
          selectionMode="multiple"
          selectedKeys={selection.keys}
          onSelectionChange={selection.setKeys}
          loadingState={loadingState}
          renderEmptyState={() => (
            <VStack
              gap="medium"
              alignItems="center"
              justifyContent="center"
              height="alias.singleLineWidth"
            >
              <Icon
                src={gitBranchIcon}
                color="neutralSecondary"
                size="large"
                strokeScaling={false}
              />
              <Text color="neutralSecondary" size="medium">
                No changes to commit
              </Text>
            </VStack>
          )}
          UNSAFE_style={{
            height:
              items.length > 0
                ? 'auto'
                : tokenSchema.size.alias.singleLineWidth,
          }}
          flex={items.length > 0}
        >
          {item => (
            <Item key={item.slug} textValue={`${item.slug}, ${item.type}`}>
              <HStack
                gridArea="content"
                alignItems="center"
                minWidth={0}
                gap="regular"
              >
                {item.type === 'removed' ? (
                  <Text color="color.alias.foregroundDisabled">
                    {item.slug}
                  </Text>
                ) : (
                  <TextLink href={item.href}>{item.slug}</TextLink>
                )}
                <ChangeTypeIndicator type={item.type} />
              </HStack>
              <TooltipTrigger>
                <ActionButton aria-label="Revert." marginStart="regular">
                  <Icon src={undoIcon} />
                </ActionButton>
                <Tooltip>Revert changes to item</Tooltip>
              </TooltipTrigger>
            </Item>
          )}
        </ListView>
      </Content>
      <ButtonGroup>
        <Button onPress={dismiss}>Cancel</Button>
        <TooltipTrigger isDisabled={!selection.isEmpty}>
          <Button
            onPress={dismiss}
            prominence="high"
            isDisabled={selection.isEmpty}
          >
            Commit
          </Button>
          <Tooltip>Select files to commit.</Tooltip>
        </TooltipTrigger>
      </ButtonGroup>
    </Dialog>
  );
}

/** Displays an icon on mobile, and a badge above. */
function ChangeTypeIndicator(props: { type: ChangeType }) {
  let type = typeMap[props.type];

  return (
    <>
      <Icon
        aria-label={props.type}
        color={type.tone}
        src={type.icon}
        isHidden={{ above: 'mobile' }}
      />
      <Badge tone={type.tone} isHidden={{ below: 'tablet' }}>
        {props.type}
      </Badge>
    </>
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

function useListSelection(items: Change[]) {
  let [keys, setKeys] = useState<Selection>('all');

  let isEmpty = keys !== 'all' && !keys.size;

  let toggleAll = (isSelected: boolean) => {
    setKeys(isSelected ? 'all' : new Set());
  };
  let clearAll = () => {
    toggleAll(false);
  };

  return {
    isEmpty,
    get isSelectAll() {
      if (isEmpty) {
        return false;
      }

      if (keys === 'all') {
        return true;
      }

      let _keys = keys; // appease the type gods
      return items.map(item => item.slug).every(k => _keys.has(k));
    },
    keys,
    setKeys,
    clearAll,
    toggleAll,
  };
}

function useChangedItems() {
  let { basePath } = useAppState();
  let config = useConfig();
  let changeMap = useChanged();
  let loadingState = useLoadingState();

  let items = useMemo(
    () => getChangedItems(basePath, config, changeMap),
    [basePath, changeMap, config]
  );

  // show old items while loading
  let oldItems = usePrevious(items) || [];
  return { items: loadingState === 'idle' ? items : oldItems, loadingState };
}

function getChangedItems(
  basePath: string,
  config: Config,
  changeMap: ReturnType<typeof useChanged>
) {
  let items: Change[] = [];
  if (config.collections) {
    for (const key of Object.keys(config.collections)) {
      const counts = changeMap.collections.get(key);

      if (
        !counts?.added.size &&
        !counts?.changed.size &&
        !counts?.removed.size
      ) {
        continue;
      }

      if (counts?.changed.size) {
        items.push(
          ...Array.from(counts.changed).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            slug: `${key}/${slug}`,
            type: 'changed' as const,
          }))
        );
      }
      if (counts?.added.size) {
        items.push(
          ...Array.from(counts.added).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            slug: `${key}/${slug}`,
            type: 'added' as const,
          }))
        );
      }
      if (counts?.removed.size) {
        items.push(
          ...Array.from(counts.removed).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            slug: `${key}/${slug}`,
            type: 'removed' as const,
          }))
        );
      }
    }
  }

  if (config.singletons) {
    for (const slug of Object.keys(config.singletons)) {
      let changes = changeMap.singletons.has(slug);

      if (!changes) {
        continue;
      }

      items.push({
        href: `${basePath}/singleton/${encodeURIComponent(slug)}`,
        slug,
        type: 'changed' as const,
      });
    }
  }

  return items;
}

function useLoadingState(): LoadingState {
  let { current } = useTree();

  if (current.kind === 'loaded') {
    return 'idle';
  }

  return current.kind;
}
