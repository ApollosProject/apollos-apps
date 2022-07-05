import {
  Card,
  CardContent,
  ByLine,
  AppIcon,
  SocialBar,
  styled,
  H5,
} from '@apollosproject/ui-kit';
import { View } from 'react-native';

const OpaqueSocialBar = styled({ opacity: 0.5 })(SocialBar);

const NotificationRow = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit / 2,
}))(View);

const PlaceholderBar = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.system,
  width: 52,
  height: theme.sizing.baseUnit / 2,
  marginLeft: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
}))(View);

const noop = () => {};

export const Post = ({
  profile = {
    photo: { uri: 'https://picsum.photos/200' },
    firstName: 'John',
    lastName: 'Smith',
  },
}) => (
  <Card>
    <CardContent>
      <ByLine profile={profile} subtitle="You follow" />
      <OpaqueSocialBar onPressLike={noop} onPressShare={noop} />
    </CardContent>
  </Card>
);

export const Notification = ({ name = 'Sean' }) => (
  <Card>
    <CardContent>
      <NotificationRow>
        <AppIcon size={24} />
        <PlaceholderBar />
      </NotificationRow>
      <H5>{name} is praying for you right now!</H5>
    </CardContent>
  </Card>
);

export const Prompt = ({ prompt = 'Send a message' }) => (
  <Card>
    <CardContent>
      <ByLine
        avatarProps={{
          buttonIcon: 'plus',
          iconButtonProps: { type: 'primary' },
        }}
      >
        <H5>{prompt}</H5>
      </ByLine>
    </CardContent>
  </Card>
);
