import { HStack } from '@keystar/ui/layout';
import { useAwarenessStates } from './shell/collab';
import { Avatar } from '@keystar/ui/avatar';
import { useCloudInfo } from './shell/data';
import { useRouter } from './router';

export function PresenceAvatars() {
  const cloudInfo = useCloudInfo();
  const awarenessStates = useAwarenessStates();
  const router = useRouter();
  if (!cloudInfo) return null;
  return (
    <HStack>
      {[...awarenessStates.values()].map(val => {
        if (
          !val.user ||
          router.href !== `/keystatic/branch/${val.branch}/${val.location}`
        ) {
          return null;
        }
        return <Avatar src={val.user.avatarUrl} name={val.user.name} />;
      })}
    </HStack>
  );
}
