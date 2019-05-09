import React from 'react';
import { Button, Paragraph, BodyText } from '@apollosproject/ui-kit';

import Slide, { SlideContent } from 'apolloschurchapp/src/ui/Onboarding/Slide';

const Intro = ({ showApp }) => (
  <Slide>
    <SlideContent title={`Welcome to ${'\n'}Apollos Storybook!`} icon>
      <Paragraph>
        <BodyText>
          Storybook is the component workshop for the Apollos app platform.
        </BodyText>
      </Paragraph>
      <Paragraph>
        <BodyText>
          A story is a single state of one or more UI components. You can have
          as many stories as you want.
        </BodyText>
      </Paragraph>
      <Paragraph>
        <BodyText>
          We use Storybook to help document UI and to serve as visual test cases
          for different states.
        </BodyText>
      </Paragraph>
      <Paragraph>
        <BodyText>
          Open the navigator using the navigation bar at the bottom of the
          screen to navigate the available stories.
        </BodyText>
      </Paragraph>
      <Button onPress={() => showApp()} title={'Show the Apollos app'} />
    </SlideContent>
  </Slide>
);

export default Intro;
