import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { useImageLibraryURL } from '../../component-blocks/cloud-image-preview';
import { Text } from '@keystar/ui/typography';
import { DashboardSection } from './components';
import { useCloudInfo } from '../shell/data';

export function ImagesSection() {
  const cloudInfo = useCloudInfo();
  const imageLibraryUrl = useImageLibraryURL();
  if (!cloudInfo?.team.images) {
    return null;
  }
  return (
    <DashboardSection title="Images">
      <ActionButton href={imageLibraryUrl} alignSelf="start">
        <Icon src={imageIcon} />
        <Text>Image Library</Text>
      </ActionButton>
    </DashboardSection>
  );
}
