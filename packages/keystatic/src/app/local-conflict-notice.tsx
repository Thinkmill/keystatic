import { useState } from 'react';

import { Button, ButtonGroup } from '@keystar/ui/button';
import { Notice } from '@keystar/ui/notice';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

export function LocalConflictNotice(props: {
  heading?: string;
  reason: string;
  onReload: () => Promise<void>;
}) {
  const [isReloading, setIsReloading] = useState(false);
  const [reloadError, setReloadError] = useState<Error | null>(null);

  return (
    <Notice tone="critical">
      <Heading>{props.heading ?? 'Save conflict'}</Heading>
      <Content>
        <Text>{props.reason}</Text>
        {reloadError && <Text>{reloadError.message}</Text>}
        <ButtonGroup>
          <Button
            isDisabled={isReloading}
            onPress={async () => {
              setIsReloading(true);
              setReloadError(null);
              try {
                await props.onReload();
              } catch (err) {
                setReloadError(err as Error);
              } finally {
                setIsReloading(false);
              }
            }}
          >
            Reload latest
          </Button>
        </ButtonGroup>
      </Content>
    </Notice>
  );
}
