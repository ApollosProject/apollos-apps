import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { H3, BodyText, Paragraph } from '../typography';
import Button, { ButtonLink } from '../Button';

import Card, { CardActions, CardContent, CardImage, CardLabel } from '.';

storiesOf('ui-kit/Card', module)
  .add('simple', () => (
    <Card>
      <CardImage source={'https://picsum.photos/600/400/?image=63'} />
      <CardContent>
        <H3 padded>Coffee</H3>
        <CardLabel
          title={'noun'}
          style={{ alignSelf: 'flex-start' }} // eslint-disable-line react-native/no-inline-styles
          icon={'filter'}
        />

        <Paragraph>
          <BodyText>
            {
              'A dark substance that turns "leave me alone" into "good morning!"'
            }
          </BodyText>
        </Paragraph>
      </CardContent>
      <CardActions>
        <Button title="Learn More" pill={false} />
        <ButtonLink>Share</ButtonLink>
      </CardActions>
    </Card>
  ))
  .add('loading', () => (
    <Card isLoading>
      <CardImage />
      <CardContent>
        <H3 padded />
        <CardLabel
          icon={'filter'}
          style={{ alignSelf: 'flex-start' }} // eslint-disable-line react-native/no-inline-styles
        />
        <Paragraph>
          <BodyText />
        </Paragraph>
      </CardContent>
      <CardActions>
        <Button pill={false} />
        <ButtonLink />
      </CardActions>
    </Card>
  ));
