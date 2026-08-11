import { action } from '@keystar/ui-storybook';
import { Text } from '@keystar/ui/typography';

import {
  NavTree,
  NavTreeCollection,
  NavTreeItem,
  NavTreeItemContent,
} from '..';

const items = [
  {
    id: 'animals',
    name: 'Animals',
    children: [{ id: 'koala', name: 'Koala' }],
  },
  { id: 'plants', name: 'Plants', children: [{ id: 'fern', name: 'Fern' }] },
];

export default { title: 'Components/NavTree' };

export const Static = () => (
  <NavTree aria-label="Navigation" onAction={action('onAction')}>
    <NavTreeItem id="one" textValue="One">
      <NavTreeItemContent>
        <Text>One</Text>
      </NavTreeItemContent>
    </NavTreeItem>
    <NavTreeItem id="two" textValue="Two">
      <NavTreeItemContent>
        <Text>Two</Text>
      </NavTreeItemContent>
    </NavTreeItem>
  </NavTree>
);

export const DynamicAndNested = () => (
  <NavTree
    aria-label="Navigation"
    items={items}
    defaultExpandedKeys={['animals']}
  >
    {item => (
      <NavTreeItem id={item.id} textValue={item.name}>
        <NavTreeItemContent>
          <Text>{item.name}</Text>
        </NavTreeItemContent>
        <NavTreeCollection items={item.children}>
          {child => (
            <NavTreeItem id={child.id} textValue={child.name}>
              <NavTreeItemContent>
                <Text>{child.name}</Text>
              </NavTreeItemContent>
            </NavTreeItem>
          )}
        </NavTreeCollection>
      </NavTreeItem>
    )}
  </NavTree>
);
