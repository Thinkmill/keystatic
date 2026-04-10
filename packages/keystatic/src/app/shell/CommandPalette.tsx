import {
  KeyboardEvent,
  ReactNode,
  createContext,
  useDeferredValue,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Badge } from '@keystar/ui/badge';
import { Dialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { folderIcon } from '@keystar/ui/icon/icons/folderIcon';
import { fileTextIcon } from '@keystar/ui/icon/icons/fileTextIcon';
import { homeIcon } from '@keystar/ui/icon/icons/homeIcon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { settingsIcon } from '@keystar/ui/icon/icons/settingsIcon';
import { Box, Divider, Flex, VStack } from '@keystar/ui/layout';
import { TextField } from '@keystar/ui/text-field';
import { css, tokenSchema, transition } from '@keystar/ui/style';
import { Kbd, Text } from '@keystar/ui/typography';

import { useRouter } from '../router';
import { useStandalonePages } from '../standalone-pages';
import { useAppState, useConfig } from './context';

type CommandType =
  | 'navigation'
  | 'page'
  | 'collection'
  | 'singleton'
  | 'action';

type Command = {
  id: string;
  label: string;
  description?: string;
  type: CommandType;
  icon: typeof searchIcon;
  href?: string;
  action?: () => void;
  keywords?: string[];
};

type CommandPaletteContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(
  null
);

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider'
    );
  }
  return context;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }

      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen, toggle]);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CommandPaletteDialog />
    </CommandPaletteContext.Provider>
  );
}

function CommandPaletteDialog() {
  const { isOpen, close } = useCommandPalette();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const config = useConfig();
  const { basePath } = useAppState();
  const router = useRouter();
  const standalonePages = useStandalonePages(basePath);
  const standalonePageSingletonKey = standalonePages.singleton?.key;

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands = useMemo<Command[]>(() => {
    const standalonePageKeys = new Set(
      standalonePages.collections.map(collection => collection.key)
    );
    const nextCommands: Command[] = [
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        description: 'Overview and quick actions',
        type: 'navigation',
        icon: homeIcon,
        href: basePath,
        keywords: ['home', 'overview', 'start'],
      },
    ];

    standalonePages.collections.forEach(collection => {
      nextCommands.push({
        id: `create-page-${collection.key}`,
        label:
          standalonePages.collections.length === 1
            ? 'New page'
            : `New ${collection.label.replace(/s$/i, '')}`,
        description: 'Create standalone page',
        type: 'action',
        icon: plusIcon,
        href: collection.createHref,
        keywords: ['create', 'new', 'page', collection.key, collection.label],
      });
    });

    standalonePages.items.forEach(page => {
      nextCommands.push({
        id: `page-${page.id}`,
        label: page.label,
        description: 'Page',
        type: 'page',
        icon: fileTextIcon,
        href: page.href,
        keywords: ['page', 'builder', page.slug, page.key],
      });
    });

    Object.entries(config.collections || {}).forEach(([key, collection]) => {
      if (standalonePageKeys.has(key)) {
        return;
      }
      nextCommands.push({
        id: `collection-${key}`,
        label: collection.label,
        description: 'Collection',
        type: 'collection',
        icon: folderIcon,
        href: `${basePath}/collection/${encodeURIComponent(key)}`,
        keywords: ['collection', 'content', 'browse', key],
      });

      nextCommands.push({
        id: `create-${key}`,
        label: `New ${collection.label}`,
        description: 'Create entry',
        type: 'action',
        icon: plusIcon,
        href: `${basePath}/collection/${encodeURIComponent(key)}/create`,
        keywords: ['create', 'new', 'add', key],
      });
    });

    Object.entries(config.singletons || {}).forEach(([key, singleton]) => {
      if (key === standalonePageSingletonKey) {
        return;
      }
      nextCommands.push({
        id: `singleton-${key}`,
        label: singleton.label,
        description: 'Singleton',
        type: 'singleton',
        icon: settingsIcon,
        href: `${basePath}/singleton/${encodeURIComponent(key)}`,
        keywords: ['singleton', 'settings', 'page', key],
      });
    });

    return nextCommands;
  }, [
    basePath,
    config.collections,
    config.singletons,
    standalonePages.collections,
    standalonePages.items,
    standalonePageSingletonKey,
  ]);

  const filteredCommands = useMemo(() => {
    if (!deferredSearch.trim()) {
      return commands;
    }

    const query = deferredSearch.trim().toLowerCase();
    return commands.filter(command => {
      return (
        command.label.toLowerCase().includes(query) ||
        command.description?.toLowerCase().includes(query) ||
        command.keywords?.some(keyword => keyword.toLowerCase().includes(query))
      );
    });
  }, [commands, deferredSearch]);

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);

  const executeCommand = useCallback(
    (command: Command) => {
      if (command.href) {
        router.push(command.href);
      } else if (command.action) {
        command.action();
      }
      close();
    },
    [close, router]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(index =>
          Math.min(index + 1, filteredCommands.length - 1)
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(index => Math.max(index - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
    }
  };

  const groupedCommands = useMemo(() => {
    const groups: Record<CommandType, Command[]> = {
      navigation: [],
      page: [],
      collection: [],
      singleton: [],
      action: [],
    };

    filteredCommands.forEach(command => {
      groups[command.type].push(command);
    });

    return groups;
  }, [filteredCommands]);

  const typeLabels: Record<CommandType, string> = {
    navigation: 'Navigation',
    page: 'Pages',
    collection: 'Collections',
    singleton: 'Singletons',
    action: 'Actions',
  };

  let currentIndex = -1;

  return (
    <DialogContainer onDismiss={close}>
      {isOpen && (
        <Dialog size="large" isDismissable>
          <Box
            padding="large"
            UNSAFE_className={css({
              boxSizing: 'border-box',
              width: 'min(100vw - 32px, 860px)',
              maxWidth: '100%',
              minWidth: 0,
              overflow: 'hidden',
            })}
          >
            <VStack gap="large">
              <Box
                borderRadius="large"
                padding="large"
                UNSAFE_className={css({
                  boxSizing: 'border-box',
                  border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
                  background: `linear-gradient(135deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
                  boxShadow: `0 18px 36px ${tokenSchema.color.shadow.muted}`,
                  maxWidth: '100%',
                  minWidth: 0,
                  overflow: 'hidden',
                })}
              >
                <VStack gap="medium">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    gap="regular"
                    wrap
                    minWidth={0}
                  >
                    <VStack gap="xsmall" minWidth={0} flex>
                      <Text
                        size="small"
                        weight="semibold"
                        color="accent"
                        UNSAFE_className={css({
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        })}
                      >
                        Search
                      </Text>
                      <Text weight="semibold">
                        Jump anywhere in the admin UI
                      </Text>
                    </VStack>
                    <Flex gap="xsmall" alignItems="center">
                      <Kbd>Ctrl</Kbd>
                      <Kbd>K</Kbd>
                    </Flex>
                  </Flex>

                  <TextField
                    aria-label="Search commands"
                    autoFocus
                    onChange={setSearch}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, collections, singletons, and actions..."
                    value={search}
                    width="100%"
                    UNSAFE_className={css({
                      minWidth: 0,
                      '& input': {
                        fontSize: tokenSchema.typography.text.large.size,
                        fontWeight: tokenSchema.typography.fontWeight.medium,
                      },
                    })}
                  />
                </VStack>
              </Box>

              <Flex
                alignItems="center"
                justifyContent="space-between"
                gap="regular"
                wrap
              >
                <Text color="neutralSecondary" size="small">
                  {filteredCommands.length
                    ? `${filteredCommands.length} results`
                    : 'No results'}
                </Text>
                <Flex gap="xsmall" alignItems="center" wrap>
                  <Kbd>Up</Kbd>
                  <Kbd>Down</Kbd>
                  <Text color="neutralSecondary" size="small">
                    move
                  </Text>
                  <Kbd>Enter</Kbd>
                  <Text color="neutralSecondary" size="small">
                    open
                  </Text>
                  <Kbd>Esc</Kbd>
                  <Text color="neutralSecondary" size="small">
                    close
                  </Text>
                </Flex>
              </Flex>

              <Box
                UNSAFE_className={css({
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  minWidth: 0,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  paddingRight: tokenSchema.size.space.small,
                })}
              >
                {filteredCommands.length === 0 ? (
                  <EmptyResults />
                ) : (
                  <VStack gap="large">
                    {(Object.keys(groupedCommands) as CommandType[]).map(
                      type => {
                        const groupItems = groupedCommands[type];
                        if (!groupItems.length) {
                          return null;
                        }

                        return (
                          <Box
                            key={type}
                            borderRadius="large"
                            padding="large"
                            UNSAFE_className={css({
                              boxSizing: 'border-box',
                              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
                              backgroundColor:
                                tokenSchema.color.background.surface,
                              maxWidth: '100%',
                              minWidth: 0,
                              overflow: 'hidden',
                            })}
                          >
                            <VStack gap="medium">
                              <Text
                                size="small"
                                weight="semibold"
                                color="neutralSecondary"
                                UNSAFE_className={css({
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                })}
                              >
                                {typeLabels[type]}
                              </Text>
                              <Divider />
                              <VStack gap="small">
                                {groupItems.map(command => {
                                  currentIndex += 1;
                                  const commandIndex = currentIndex;
                                  return (
                                    <CommandItem
                                      key={command.id}
                                      command={command}
                                      isSelected={
                                        commandIndex === selectedIndex
                                      }
                                      onHover={() =>
                                        setSelectedIndex(commandIndex)
                                      }
                                      onSelect={() => executeCommand(command)}
                                    />
                                  );
                                })}
                              </VStack>
                            </VStack>
                          </Box>
                        );
                      }
                    )}
                  </VStack>
                )}
              </Box>
            </VStack>
          </Box>
        </Dialog>
      )}
    </DialogContainer>
  );
}

function CommandItem(props: {
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  const { command, isSelected, onHover, onSelect } = props;

  return (
    <Flex
      alignItems="center"
      gap="regular"
      padding="regular"
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onHover}
      UNSAFE_className={css({
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: tokenSchema.size.radius.medium,
        border: `${tokenSchema.size.border.regular} solid ${
          isSelected
            ? tokenSchema.color.border.accent
            : tokenSchema.color.border.muted
        }`,
        backgroundColor: isSelected
          ? tokenSchema.color.alias.backgroundSelected
          : tokenSchema.color.background.canvas,
        transition: transition([
          'background-color',
          'border-color',
          'box-shadow',
          'transform',
        ]),
        '&:hover': {
          transform: 'translateY(-1px)',
          borderColor: tokenSchema.color.border.accent,
          boxShadow: `0 10px 20px ${tokenSchema.color.shadow.muted}`,
        },
      })}
    >
      <Box
        borderRadius="medium"
        padding="small"
        UNSAFE_className={css({
          backgroundColor: tokenSchema.color.scale.indigo3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        })}
      >
        <Icon src={command.icon} color="accent" />
      </Box>
      <Flex direction="column" gap="xsmall" flex minWidth={0}>
        <Text weight="semibold" truncate>
          {command.label}
        </Text>
        {command.description && (
          <Text color="neutralSecondary" size="small" truncate>
            {command.description}
          </Text>
        )}
      </Flex>
      <Badge
        tone={command.type === 'action' ? 'accent' : 'neutral'}
        UNSAFE_className={css({
          flexShrink: 0,
        })}
      >
        {command.type}
      </Badge>
    </Flex>
  );
}

function EmptyResults() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      minHeight="scale.3000"
      borderRadius="large"
      UNSAFE_className={css({
        overflow: 'hidden',
        border: `2px dashed ${tokenSchema.color.border.muted}`,
        background: `linear-gradient(180deg, ${tokenSchema.color.background.canvas} 0%, ${tokenSchema.color.background.surface} 100%)`,
      })}
    >
      <VStack gap="small" alignItems="center">
        <Icon src={searchIcon} size="large" color="neutralTertiary" />
        <Text weight="semibold">No matching commands</Text>
        <Text color="neutralSecondary" size="small" align="center">
          Try a page title, collection name, singleton label, or an action like
          "new" or "settings".
        </Text>
      </VStack>
    </Flex>
  );
}

export function SearchTrigger() {
  const { open } = useCommandPalette();

  return (
    <Flex
      alignItems="center"
      gap="regular"
      paddingX="regular"
      paddingY="small"
      borderRadius="medium"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      UNSAFE_className={css({
        cursor: 'pointer',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        backgroundColor: tokenSchema.color.background.surface,
        transition: transition(['border-color', 'box-shadow', 'transform']),
        '&:hover': {
          transform: 'translateY(-1px)',
          borderColor: tokenSchema.color.border.accent,
          boxShadow: `0 10px 18px ${tokenSchema.color.shadow.muted}`,
        },
        '&:focus-visible': {
          outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
          outlineOffset: tokenSchema.size.alias.focusRingGap,
        },
      })}
    >
      <Icon src={searchIcon} size="small" color="accent" />
      <Text color="neutralSecondary" flex minWidth={0} truncate>
        Search admin UI...
      </Text>
      <Flex gap="xsmall" flexShrink={0}>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </Flex>
    </Flex>
  );
}
