import { Collection, KeyboardDelegate, Node } from '@react-types/shared';
import { Key } from 'react';

export class TreeKeyboardDelegate<T> implements KeyboardDelegate {
  collator: Intl.Collator;
  collection: Collection<Node<T>>;
  disabledKeys: Set<Key>;

  constructor(
    collator: Intl.Collator,
    collection: Collection<Node<T>>,
    disabledKeys: Set<Key>
  ) {
    this.collator = collator;
    this.collection = collection;
    this.disabledKeys = disabledKeys;
  }

  getKeyAbove(key: Key) {
    let { collection, disabledKeys } = this;
    let keyBefore = collection.getKeyBefore(key);

    while (keyBefore !== null) {
      let item = collection.getItem(keyBefore);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBefore;
      }

      keyBefore = collection.getKeyBefore(keyBefore);
    }

    return null;
  }

  getKeyBelow(key: Key) {
    let { collection, disabledKeys } = this;
    let keyBelow = collection.getKeyAfter(key);

    while (keyBelow !== null) {
      let item = collection.getItem(keyBelow);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBelow;
      }

      keyBelow = collection.getKeyAfter(keyBelow);
    }

    return null;
  }

  getFirstKey() {
    let { collection, disabledKeys } = this;
    let key = collection.getFirstKey();

    while (key !== null) {
      let item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyAfter(key);
    }

    return null;
  }

  getLastKey() {
    let { collection, disabledKeys } = this;
    let key = collection.getLastKey();

    while (key !== null) {
      let item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyBefore(key);
    }

    return null;
  }

  getKeyForSearch(search: string, fromKey = this.getFirstKey()) {
    let { collator, collection } = this;
    let key = fromKey;

    while (key !== null) {
      let item = collection.getItem(key);

      if (
        item?.textValue &&
        collator.compare(search, item.textValue.slice(0, search.length)) === 0
      ) {
        return key;
      }

      key = this.getKeyBelow(key);
    }

    return null;
  }
}
