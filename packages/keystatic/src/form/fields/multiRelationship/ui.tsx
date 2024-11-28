import { Item } from '@react-stately/collections';
import { ItemDropTarget, Selection } from '@react-types/shared';
import { useReducer, useMemo, useState, useEffect, Key } from 'react';

import { ActionBar, ActionBarContainer } from '@keystar/ui/action-bar';
import { Combobox } from '@keystar/ui/combobox';
import { move, useDragAndDrop } from '@keystar/ui/drag-and-drop';
import { Icon } from '@keystar/ui/icon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { VStack } from '@keystar/ui/layout';
import { ListView } from '@keystar/ui/list-view';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { FormFieldInputProps } from '../../api';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { ExtraFieldInputProps } from '../../form-from-preview';
import { validateMultiRelationshipLength } from './validate';

export function MultiRelationshipInput(
  props: FormFieldInputProps<string[]> & {
    collection: string;
    validation: { length?: { min?: number; max?: number } } | undefined;
    label: string;
    description: string | undefined;
  }
) {
  const valAsObjects = useMemo(() => {
    return props.value.map(key => ({ key }));
  }, [props.value]);
  const [blurred, onBlur] = useReducer(() => true, false);
  const slugs = useSlugsInCollection(props.collection);
  const options = useMemo(() => {
    return slugs.map(slug => ({ slug }));
  }, [slugs]);

  const _errorMessage =
    (props.forceValidation || blurred) &&
    validateMultiRelationshipLength(props.validation, props.value);
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = useState(_errorMessage);
  useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);

  const items = useMemo(() => {
    const elementSet = new Set(props.value);
    return options.filter(option => !elementSet.has(option.slug));
  }, [props.value, options]);

  return (
    <VStack gap="medium" minWidth={0}>
      <Combobox
        label={props.label}
        description={props.description}
        selectedKey={null}
        placeholder={items.length === 0 ? 'All selected' : undefined}
        onSelectionChange={key => {
          if (typeof key === 'string') {
            props.onChange([...props.value, key]);
          }
        }}
        disabledKeys={['No more items…']}
        onBlur={onBlur}
        autoFocus={props.autoFocus}
        defaultItems={items.length ? items : [{ slug: 'No more items…' }]}
        isReadOnly={items.length === 0}
        isRequired={
          props.validation?.length?.min !== undefined &&
          props.validation.length.min >= 1
        }
        errorMessage={errorMessage}
        width="auto"
      >
        {item => <Item key={item.slug}>{item.slug}</Item>}
      </Combobox>
      {true ? (
        <MultiRelationshipListView
          autoFocus={props.autoFocus}
          forceValidation={props.forceValidation}
          onChange={value => {
            props.onChange(value.map(x => x.key));
          }}
          elements={valAsObjects}
          aria-label={props.label}
        />
      ) : null}
    </VStack>
  );
}

function MultiRelationshipListView(
  props: ExtraFieldInputProps & {
    'aria-label': string;
    elements: { key: string }[];
    onChange: (elements: { key: string }[]) => void;
  }
) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    () => new Set([])
  );
  let onMove = (keys: Key[], target: ItemDropTarget) => {
    const targetIndex = props.elements.findIndex(x => x.key === target.key);
    if (targetIndex === -1) return;
    const allKeys = props.elements.map(x => ({ key: x.key }));
    const indexToMoveTo =
      target.dropPosition === 'before' ? targetIndex : targetIndex + 1;
    const indices = keys.map(key => allKeys.findIndex(x => x.key === key));
    props.onChange(move(allKeys, indices, indexToMoveTo));
  };

  const dragType = useMemo(() => Math.random().toString(36), []);

  let { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      // Use a drag type so the items can only be reordered within this list
      // and not dragged elsewhere.
      return [...keys].map(key => {
        key = JSON.stringify(key);
        return {
          [dragType]: key,
          'text/plain': key,
        };
      });
    },
    getAllowedDropOperations() {
      return ['move', 'cancel'];
    },
    async onDrop(e) {
      if (e.target.type !== 'root' && e.target.dropPosition !== 'on') {
        let keys = [];
        for (let item of e.items) {
          if (item.kind === 'text') {
            let key;
            if (item.types.has(dragType)) {
              key = JSON.parse(await item.getText(dragType));
              keys.push(key);
            } else if (item.types.has('text/plain')) {
              // Fallback for Chrome Android case: https://bugs.chromium.org/p/chromium/issues/detail?id=1293803
              // Multiple drag items are contained in a single string so we need to split them out
              key = await item.getText('text/plain');
              keys = key.split('\n').map(val => val.replaceAll('"', ''));
            }
          }
        }
        onMove(keys, e.target);
      }
    },
    getDropOperation(target) {
      if (target.type === 'root' || target.dropPosition === 'on') {
        return 'cancel';
      }

      return 'move';
    },
  });

  return (
    <ActionBarContainer maxHeight="scale.3400" minHeight="scale.1600">
      <ListView
        aria-label={props['aria-label']}
        items={props.elements}
        dragAndDropHooks={dragAndDropHooks}
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
        renderEmptyState={arrayFieldEmptyState}
        // density="compact"
        UNSAFE_className={css({
          borderRadius: tokenSchema.size.radius.regular,
        })}
      >
        {item => {
          const label = item.key;
          return (
            <Item key={item.key} textValue={label}>
              {label}
            </Item>
          );
        }}
      </ListView>
      <ActionBar
        selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
        onClearSelection={() => setSelectedKeys(new Set())}
        onAction={key => {
          if (key === 'delete') {
            let newItems = props.elements;
            if (selectedKeys instanceof Set) {
              newItems = props.elements.filter(
                item => !selectedKeys.has(item.key)
              );
            } else if (selectedKeys === 'all') {
              newItems = [];
            }
            props.onChange(newItems);
            setSelectedKeys(new Set());
          }
        }}
      >
        <Item key="delete" textValue="Remove">
          <Icon src={trash2Icon} />
          <Text>Remove</Text>
        </Item>
      </ActionBar>
    </ActionBarContainer>
  );
}

function arrayFieldEmptyState() {
  return (
    <VStack
      gap="large"
      alignItems="center"
      justifyContent="center"
      height="100%"
      padding="regular"
    >
      <Text align="center" color="neutralTertiary">
        No items selected…
      </Text>
    </VStack>
  );
}
