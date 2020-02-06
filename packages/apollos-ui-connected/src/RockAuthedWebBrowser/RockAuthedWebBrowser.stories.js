import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import {
  ButtonLink,
  CenteredView,
  BackgroundView,
  FlexedView,
} from '@apollosproject/ui-kit';

import RockAuthedWebBrowser from '.';

storiesOf('ui-connected/RockAuthedWebBrowser', module)
  .add('Default', () => (
    <BackgroundView>
      <FlexedView>
        <CenteredView>
          <RockAuthedWebBrowser>
            {(openUrl) => (
              <ButtonLink
                onPress={() => openUrl('https://apollosrock.newspring.cc')}
              >
                Open Url
              </ButtonLink>
            )}
          </RockAuthedWebBrowser>
        </CenteredView>
      </FlexedView>
    </BackgroundView>
  ))
  .add('With Token', () => (
    <BackgroundView>
      <FlexedView>
        <CenteredView>
          <RockAuthedWebBrowser>
            {(openUrl) => (
              <ButtonLink
                onPress={() =>
                  openUrl(
                    'https://apollosrock.newspring.cc',
                    {},
                    { useRockToken: true }
                  )
                }
              >
                Open Url (with token)
              </ButtonLink>
            )}
          </RockAuthedWebBrowser>
        </CenteredView>
      </FlexedView>
    </BackgroundView>
  ));
