import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';
import { H3, BodyText, Paragraph } from '../typography';
import Button, { ButtonLink } from '../Button';

import Card, { CardImage, CardContent, CardActions, CardLabel } from '.';

describe('the Card component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Card>
          <CardImage source={'https://picsum.photos/600/400/?image=63'} />
          <CardContent>
            <H3>Coffee</H3>
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
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('it should render a placeholder', () => {
    const tree = renderer.create(
      <Providers>
        <Card isLoading>
          <CardContent>
            <H3 />
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
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
