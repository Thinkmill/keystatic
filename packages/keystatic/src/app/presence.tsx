import { useCallback, useSyncExternalStore } from 'react';
import { Flex } from '@keystar/ui/layout';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { useYjs, useYjsIfAvailable } from './shell/collab';
import { Avatar } from '@keystar/ui/avatar';

export function PresenceAvatars() {
  const yJsInfo = useYjsIfAvailable();
  return yJsInfo && yJsInfo !== 'loading' ? (
    <PresenceAvatarsInner yjsInfo={yJsInfo} />
  ) : null;
}

function PresenceAvatarsInner({
  yjsInfo,
}: {
  yjsInfo: ReturnType<typeof useYjs>;
}) {
  const awarenessStates = useSyncExternalStore(
    useCallback(
      onStoreChange => {
        yjsInfo.awareness.on('change', onStoreChange);
        return () => yjsInfo.awareness.off('change', onStoreChange);
      },
      [yjsInfo]
    ),
    () => yjsInfo.awareness?.getStates()
  );
  const seenUserIds = new Set<string>();
  return (
    <Flex>
      {[...awarenessStates].map(([key, val]) => {
        if (
          yjsInfo.awareness.clientID === key ||
          !val.user ||
          seenUserIds.has(val.user.id)
        ) {
          return null;
        }
        seenUserIds.add(val.user.id);
        return (
          <TooltipTrigger key={key}>
            <Avatar src={val.user?.avatarUrl} />
            <Tooltip>{val.user?.name}</Tooltip>
          </TooltipTrigger>
        );
      })}
    </Flex>
  );
}
