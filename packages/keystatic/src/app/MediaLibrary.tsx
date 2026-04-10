import { useState, useMemo, useCallback } from 'react';

import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import {
  Dialog,
  DialogTrigger,
  AlertDialog,
  DialogContainer,
} from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { fileTextIcon } from '@keystar/ui/icon/icons/fileTextIcon';
import { filmIcon } from '@keystar/ui/icon/icons/filmIcon';
import { musicIcon } from '@keystar/ui/icon/icons/musicIcon';
import { fileIcon } from '@keystar/ui/icon/icons/fileIcon';
import { uploadIcon } from '@keystar/ui/icon/icons/uploadIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { gridIcon } from '@keystar/ui/icon/icons/gridIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { filterIcon } from '@keystar/ui/icon/icons/filterIcon';
import { Box, Flex, Grid, VStack, Divider } from '@keystar/ui/layout';
import { Text, Heading } from '@keystar/ui/typography';
import { css, tokenSchema, breakpointQueries } from '@keystar/ui/style';
import { SearchField } from '@keystar/ui/search-field';
import { Checkbox } from '@keystar/ui/checkbox';
import { Badge } from '@keystar/ui/badge';
import { Content, Header } from '@keystar/ui/slots';
import { ProgressCircle } from '@keystar/ui/progress';
import { ActionGroup, Item } from '@keystar/ui/action-group';
import { toastQueue } from '@keystar/ui/toast';
import { Selection, Key } from '@react-types/shared';
import { ActionBar, ActionBarContainer } from '@keystar/ui/action-bar';

import { PageRoot, PageHeader, PageBody } from './shell/page';

// Types for media items
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export type MediaItem = {
  path: string;
  name: string;
  type: MediaType;
  size: number;
  lastModified: Date;
  url?: string;
  dimensions?: { width: number; height: number };
};

// Helper to determine media type from file extension
function getMediaType(filename: string): MediaType {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'json', 'yaml', 'yml'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  return 'other';
}

// Icon for media type
function MediaTypeIcon({ type }: { type: MediaType }) {
  const icons = {
    image: imageIcon,
    video: filmIcon,
    audio: musicIcon,
    document: fileTextIcon,
    other: fileIcon,
  };
  return <Icon src={icons[type]} />;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

type MediaCardProps = {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
};

function MediaCard({ item, isSelected, onSelect, onView }: MediaCardProps) {
  const isImage = item.type === 'image';

  return (
    <Box
      UNSAFE_className={css({
        border: `2px solid ${
          isSelected
            ? tokenSchema.color.border.accent
            : tokenSchema.color.border.neutral
        }`,
        borderRadius: tokenSchema.size.radius.medium,
        overflow: 'hidden',
        backgroundColor: tokenSchema.color.background.surface,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: tokenSchema.color.border.accent,
          boxShadow: `0 2px 8px ${tokenSchema.color.shadow.regular}`,
        },
      })}
      onClick={onView}
    >
      {/* Preview area */}
      <Box
        UNSAFE_className={css({
          height: '140px',
          backgroundColor: tokenSchema.color.background.canvas,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        })}
      >
        {isImage && item.url ? (
          <img
            src={item.url}
            alt={item.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Icon
            src={
              item.type === 'image'
                ? imageIcon
                : item.type === 'video'
                ? filmIcon
                : item.type === 'audio'
                ? musicIcon
                : item.type === 'document'
                ? fileTextIcon
                : fileIcon
            }
            size="large"
            color="neutralSecondary"
          />
        )}

        {/* Selection checkbox */}
        <Box
          padding="xsmall"
          onClick={e => {
            e.stopPropagation();
            onSelect();
          }}
          UNSAFE_className={css({
            position: 'absolute',
            top: 0,
            left: 0,
          })}
        >
          <Checkbox
            isSelected={isSelected}
            onChange={onSelect}
            aria-label={`Select ${item.name}`}
          />
        </Box>
      </Box>

      {/* Info area */}
      <Box padding="small">
        <VStack gap="xsmall">
          <Text weight="medium" truncate>
            {item.name}
          </Text>
          <Flex gap="small" alignItems="center">
            <Badge>{item.type}</Badge>
            <Text size="small" color="neutralSecondary">
              {formatFileSize(item.size)}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

type MediaListItemProps = MediaCardProps;

function MediaListItem({
  item,
  isSelected,
  onSelect,
  onView,
}: MediaListItemProps) {
  return (
    <Flex
      alignItems="center"
      gap="regular"
      UNSAFE_className={css({
        padding: tokenSchema.size.space.regular,
        borderBottom: `1px solid ${tokenSchema.color.border.neutral}`,
        backgroundColor: isSelected
          ? tokenSchema.color.background.accentEmphasis
          : 'transparent',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: tokenSchema.color.background.accent,
        },
      })}
      onClick={onView}
    >
      <Box
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <Checkbox
          isSelected={isSelected}
          onChange={onSelect}
          aria-label={`Select ${item.name}`}
        />
      </Box>

      <MediaTypeIcon type={item.type} />

      <Text weight="medium" flex>
        {item.name}
      </Text>

      <Badge>{item.type}</Badge>

      <Text
        size="small"
        color="neutralSecondary"
        UNSAFE_style={{ width: '80px' }}
      >
        {formatFileSize(item.size)}
      </Text>

      <Text size="small" color="neutralSecondary">
        {item.lastModified.toLocaleDateString()}
      </Text>
    </Flex>
  );
}

type MediaDetailDialogProps = {
  item: MediaItem;
  onClose: () => void;
  onDelete: () => void;
};

function MediaDetailDialog({
  item,
  onClose,
  onDelete,
}: MediaDetailDialogProps) {
  const isImage = item.type === 'image';

  return (
    <Dialog>
      <Heading>{item.name}</Heading>
      <Content>
        <VStack gap="large">
          {/* Preview */}
          <Box
            UNSAFE_className={css({
              backgroundColor: tokenSchema.color.background.canvas,
              borderRadius: tokenSchema.size.radius.medium,
              padding: tokenSchema.size.space.large,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
            })}
          >
            {isImage && item.url ? (
              <img
                src={item.url}
                alt={item.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Icon
                src={
                  item.type === 'video'
                    ? filmIcon
                    : item.type === 'audio'
                    ? musicIcon
                    : item.type === 'document'
                    ? fileTextIcon
                    : fileIcon
                }
                size="large"
                color="neutralSecondary"
              />
            )}
          </Box>

          {/* Details */}
          <VStack gap="regular">
            <Flex gap="regular" justifyContent="space-between">
              <Text color="neutralSecondary">Type</Text>
              <Badge>{item.type}</Badge>
            </Flex>
            <Flex gap="regular" justifyContent="space-between">
              <Text color="neutralSecondary">Size</Text>
              <Text>{formatFileSize(item.size)}</Text>
            </Flex>
            {item.dimensions && (
              <Flex gap="regular" justifyContent="space-between">
                <Text color="neutralSecondary">Dimensions</Text>
                <Text>
                  {item.dimensions.width} × {item.dimensions.height}
                </Text>
              </Flex>
            )}
            <Flex gap="regular" justifyContent="space-between">
              <Text color="neutralSecondary">Path</Text>
              <Text truncate>{item.path}</Text>
            </Flex>
            <Flex gap="regular" justifyContent="space-between">
              <Text color="neutralSecondary">Last Modified</Text>
              <Text>{item.lastModified.toLocaleString()}</Text>
            </Flex>
          </VStack>

          <Divider />

          <ButtonGroup>
            <Button onPress={onClose}>Close</Button>
            <Button tone="critical" onPress={onDelete}>
              <Icon src={trash2Icon} />
              <Text>Delete</Text>
            </Button>
          </ButtonGroup>
        </VStack>
      </Content>
    </Dialog>
  );
}

type ViewMode = 'grid' | 'list';
type TypeFilter = MediaType | 'all';

type MediaLibraryProps = {
  items: MediaItem[];
  onUpload?: () => void;
  onDelete?: (paths: string[]) => void;
  isLoading?: boolean;
};

export function MediaLibrary({
  items,
  onUpload,
  onDelete,
  isLoading = false,
}: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [items, searchTerm, typeFilter]);

  // Selection helpers
  const selectedSet = useMemo(() => {
    if (selectedKeys === 'all') return new Set(filteredItems.map(i => i.path));
    return selectedKeys as Set<Key>;
  }, [selectedKeys, filteredItems]);

  const toggleSelection = (path: string) => {
    const newSet = new Set(selectedSet);
    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    setSelectedKeys(newSet as Selection);
  };

  const selectedCount =
    selectedKeys === 'all' ? filteredItems.length : selectedSet.size;

  const handleBulkDelete = useCallback(() => {
    if (onDelete && selectedCount > 0) {
      const paths =
        selectedKeys === 'all'
          ? filteredItems.map(i => i.path)
          : Array.from(selectedSet).map(String);
      onDelete(paths);
      setSelectedKeys(new Set());
      toastQueue.positive(`Deleted ${paths.length} items`);
    }
  }, [onDelete, selectedKeys, selectedSet, filteredItems, selectedCount]);

  const typeFilterOptions: { key: TypeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'image', label: 'Images' },
    { key: 'video', label: 'Videos' },
    { key: 'audio', label: 'Audio' },
    { key: 'document', label: 'Documents' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <PageRoot>
      <PageHeader>
        <Flex alignItems="center" gap="regular" flex wrap>
          <Heading elementType="h1" size="small">
            Media Library
          </Heading>

          <SearchField
            aria-label="Search media"
            placeholder="Search..."
            value={searchTerm}
            onChange={setSearchTerm}
            width="scale.2400"
          />

          <ActionGroup
            aria-label="Type filter"
            selectionMode="single"
            selectedKeys={[typeFilter]}
            onSelectionChange={keys => {
              const selected = [...keys][0] as TypeFilter;
              if (selected) setTypeFilter(selected);
            }}
            density="compact"
          >
            {typeFilterOptions.map(opt => (
              <Item key={opt.key}>{opt.label}</Item>
            ))}
          </ActionGroup>

          <ActionGroup
            aria-label="View mode"
            selectionMode="single"
            selectedKeys={[viewMode]}
            onSelectionChange={keys => {
              const selected = [...keys][0] as ViewMode;
              if (selected) setViewMode(selected);
            }}
            density="compact"
          >
            <Item key="grid" aria-label="Grid view">
              <Icon src={gridIcon} />
            </Item>
            <Item key="list" aria-label="List view">
              <Icon src={listIcon} />
            </Item>
          </ActionGroup>

          {onUpload && (
            <Button marginStart="auto" prominence="high" onPress={onUpload}>
              <Icon src={uploadIcon} />
              <Text>Upload</Text>
            </Button>
          )}
        </Flex>
      </PageHeader>

      <PageBody>
        {isLoading ? (
          <Flex alignItems="center" justifyContent="center" height="scale.3600">
            <ProgressCircle
              aria-label="Loading media"
              isIndeterminate
              size="large"
            />
          </Flex>
        ) : filteredItems.length === 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="scale.3600"
            gap="large"
          >
            <Icon src={imageIcon} size="large" color="neutralSecondary" />
            <Text color="neutralSecondary">
              {searchTerm || typeFilter !== 'all'
                ? 'No media matching your filters'
                : 'No media files yet'}
            </Text>
            {onUpload && (
              <Button onPress={onUpload}>
                <Icon src={uploadIcon} />
                <Text>Upload Media</Text>
              </Button>
            )}
          </Flex>
        ) : (
          <ActionBarContainer height="100%">
            {viewMode === 'grid' ? (
              <Grid
                columns={{
                  mobile: 'repeat(2, 1fr)',
                  tablet: 'repeat(3, 1fr)',
                  desktop: 'repeat(4, 1fr)',
                }}
                gap="regular"
                padding="large"
              >
                {filteredItems.map(item => (
                  <MediaCard
                    key={item.path}
                    item={item}
                    isSelected={selectedSet.has(item.path)}
                    onSelect={() => toggleSelection(item.path)}
                    onView={() => setViewingItem(item)}
                  />
                ))}
              </Grid>
            ) : (
              <Box
                UNSAFE_className={css({
                  border: `1px solid ${tokenSchema.color.border.neutral}`,
                  borderRadius: tokenSchema.size.radius.medium,
                  overflow: 'hidden',
                  margin: tokenSchema.size.space.large,
                })}
              >
                {filteredItems.map(item => (
                  <MediaListItem
                    key={item.path}
                    item={item}
                    isSelected={selectedSet.has(item.path)}
                    onSelect={() => toggleSelection(item.path)}
                    onView={() => setViewingItem(item)}
                  />
                ))}
              </Box>
            )}

            <ActionBar
              selectedItemCount={selectedCount}
              onAction={action => {
                if (action === 'delete') {
                  handleBulkDelete();
                }
              }}
              onClearSelection={() => setSelectedKeys(new Set())}
            >
              <Item key="delete">
                <Icon src={trash2Icon} />
                <Text>Delete</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        )}
      </PageBody>

      {/* Detail dialog */}
      <DialogContainer onDismiss={() => setViewingItem(null)}>
        {viewingItem && (
          <MediaDetailDialog
            item={viewingItem}
            onClose={() => setViewingItem(null)}
            onDelete={() => {
              if (onDelete) {
                onDelete([viewingItem.path]);
                setViewingItem(null);
                toastQueue.positive(`Deleted ${viewingItem.name}`);
              }
            }}
          />
        )}
      </DialogContainer>
    </PageRoot>
  );
}

// Demo data generator for testing
export function generateDemoMediaItems(): MediaItem[] {
  const types: MediaType[] = ['image', 'video', 'audio', 'document', 'other'];
  const extensions = {
    image: ['jpg', 'png', 'gif', 'webp'],
    video: ['mp4', 'webm'],
    audio: ['mp3', 'wav'],
    document: ['pdf', 'txt', 'md'],
    other: ['zip', 'json'],
  };

  const items: MediaItem[] = [];

  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const ext =
      extensions[type][Math.floor(Math.random() * extensions[type].length)];
    const name = `file-${i + 1}.${ext}`;

    items.push({
      path: `/media/${name}`,
      name,
      type,
      size: Math.floor(Math.random() * 5000000) + 1000,
      lastModified: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
      url:
        type === 'image'
          ? `https://picsum.photos/seed/${i}/200/200`
          : undefined,
      dimensions: type === 'image' ? { width: 200, height: 200 } : undefined,
    });
  }

  return items;
}
