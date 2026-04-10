import {
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { Box, Flex, VStack, Divider } from '@keystar/ui/layout';
import { Text, Heading } from '@keystar/ui/typography';
import { css, tokenSchema, transition } from '@keystar/ui/style';
import { Avatar } from '@keystar/ui/avatar';
import { Badge } from '@keystar/ui/badge';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { clockIcon } from '@keystar/ui/icon/icons/clockIcon';

import { useViewer } from '../shell/viewer-data';

// Activity types
type ActivityAction = 'created' | 'updated' | 'deleted';

export type ActivityItem = {
  id: string;
  action: ActivityAction;
  collection: string;
  entrySlug: string;
  entryTitle?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatarUrl?: string;
  };
};

// Context to track activity across the app
type ActivityContextType = {
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
};

const ActivityContext = createContext<ActivityContextType | null>(null);

const ACTIVITY_STORAGE_KEY = 'keystatic-activity-log';
const MAX_ACTIVITIES = 50;

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivities(
          parsed.map((item: ActivityItem) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      }
    } catch (e) {
      console.warn('Failed to load activity log:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to save activity log:', e);
    }
  }, [activities]);

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, MAX_ACTIVITIES));
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return (
    <ActivityContext.Provider
      value={{ activities, addActivity, clearActivities }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}

// Hook to track activity (call this from ItemPage, etc.)
export function useTrackActivity() {
  const context = useContext(ActivityContext);
  const viewer = useViewer();

  return (
    action: ActivityAction,
    collection: string,
    entrySlug: string,
    entryTitle?: string
  ) => {
    context?.addActivity({
      action,
      collection,
      entrySlug,
      entryTitle,
      user: viewer
        ? { name: viewer.name ?? viewer.login, avatarUrl: viewer.avatarUrl }
        : undefined,
    });
  };
}

const actionConfig = {
  created: {
    icon: plusIcon,
    label: 'created',
    color: tokenSchema.color.scale.green9,
    bg: tokenSchema.color.scale.green3,
  },
  updated: {
    icon: pencilIcon,
    label: 'updated',
    color: tokenSchema.color.scale.amber9,
    bg: tokenSchema.color.scale.amber3,
  },
  deleted: {
    icon: trash2Icon,
    label: 'deleted',
    color: tokenSchema.color.scale.red9,
    bg: tokenSchema.color.scale.red3,
  },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function ActivityItemRow({ activity }: { activity: ActivityItem }) {
  const config = actionConfig[activity.action];
  const title = activity.entryTitle || activity.entrySlug;

  return (
    <Flex
      gap="regular"
      alignItems="flex-start"
      paddingX="small"
      paddingY="regular"
      UNSAFE_className={css({
        transition: transition(['background-color']),
        borderRadius: tokenSchema.size.radius.small,
        '&:hover': {
          backgroundColor: tokenSchema.color.alias.backgroundHovered,
        },
      })}
    >
      <Box
        borderRadius="full"
        padding="xsmall"
        UNSAFE_className={css({
          backgroundColor: config.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        })}
      >
        <Icon
          src={config.icon}
          size="small"
          UNSAFE_className={css({ color: config.color })}
        />
      </Box>
      <Flex direction="column" gap="xsmall" flex minWidth={0}>
        <Flex gap="small" alignItems="center" wrap>
          {activity.user && (
            <>
              <Avatar
                src={activity.user.avatarUrl}
                name={activity.user.name}
                size="xsmall"
              />
              <Text size="small" weight="medium">
                {activity.user.name}
              </Text>
            </>
          )}
          <Text
            size="small"
            color="neutralSecondary"
            UNSAFE_style={{
              lineHeight: tokenSchema.typography.lineheight.medium,
            }}
          >
            {config.label}
          </Text>
          <Text
            size="small"
            weight="medium"
            truncate
            UNSAFE_className={css({
              maxWidth: '220px',
              lineHeight: tokenSchema.typography.lineheight.medium,
            })}
          >
            {title}
          </Text>
        </Flex>
        <Flex gap="small" alignItems="center">
          <Badge tone="neutral">{activity.collection}</Badge>
          <Flex gap="xsmall" alignItems="center">
            <Icon src={clockIcon} size="small" color="neutralTertiary" />
            <Text
              size="small"
              color="neutralTertiary"
              UNSAFE_style={{
                lineHeight: tokenSchema.typography.lineheight.medium,
              }}
            >
              {formatRelativeTime(activity.timestamp)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

type ActivityFeedProps = {
  maxItems?: number;
};

export function ActivityFeed({ maxItems = 5 }: ActivityFeedProps) {
  // Try to use context if available, otherwise show placeholder
  const context = useContext(ActivityContext);
  const activities = context?.activities ?? [];
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Box
      backgroundColor="surface"
      borderRadius="large"
      padding={{ mobile: 'large', tablet: 'xlarge' }}
      UNSAFE_className={css({
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
        boxShadow: `0 14px 28px ${tokenSchema.color.shadow.muted}`,
      })}
    >
      <VStack gap="regular">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading
            size="small"
            elementType="h3"
            UNSAFE_style={{
              lineHeight: tokenSchema.typography.lineheight.medium,
            }}
          >
            Recent Activity
          </Heading>
          {activities.length > maxItems && (
            <Text size="small" color="neutralSecondary">
              +{activities.length - maxItems} more
            </Text>
          )}
        </Flex>
        <Divider />
        {displayActivities.length > 0 ? (
          <VStack gap="small">
            {displayActivities.map(activity => (
              <ActivityItemRow key={activity.id} activity={activity} />
            ))}
          </VStack>
        ) : (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            paddingY="xlarge"
            gap="regular"
          >
            <Icon src={clockIcon} size="large" color="neutralTertiary" />
            <Text color="neutralSecondary" align="center">
              <Text
                elementType="span"
                UNSAFE_style={{
                  lineHeight: tokenSchema.typography.lineheight.medium,
                }}
              >
                No recent activity yet.
              </Text>
              <br />
              <Text
                elementType="span"
                UNSAFE_style={{
                  lineHeight: tokenSchema.typography.lineheight.medium,
                }}
              >
                Start editing content to see your activity here.
              </Text>
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
