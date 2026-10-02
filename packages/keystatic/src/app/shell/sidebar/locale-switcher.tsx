import { Picker, Item } from '@keystar/ui/picker';
import { HStack } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { useContentLocale } from '../content-locale';

export function SidebarLocaleSwitcher() {
  const { locale, locales, setLocale } = useContentLocale();

  if (locale === undefined || locales.length === 0) {
    return null;
  }

  return (
    <HStack gap="regular" paddingY="regular" paddingX="medium">
      <Picker
        aria-label="Content language"
        items={locales}
        selectedKey={locale}
        onSelectionChange={key => {
          if (typeof key === 'string') {
            setLocale(key);
          }
        }}
        flex
      >
        {item => (
          <Item key={item.code} textValue={item.label}>
            <Text truncate>{item.label}</Text>
          </Item>
        )}
      </Picker>
    </HStack>
  );
}
