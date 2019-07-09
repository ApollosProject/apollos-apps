import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import Chip from '../Chip';
import { BodyText } from '../typography';
import ActionCard from '.';

describe('the ActionCard component', () => {
  it('should render children', () => {
    const tree = renderer.create(
      <Providers>
        <ActionCard>
          <BodyText>
            “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros
            eget libero posuere vulputate. Etiam elit elitbibendum.”
          </BodyText>
        </ActionCard>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render an icon and label', () => {
    const tree = renderer.create(
      <Providers>
        <ActionCard icon={'text'} label={'Key Idea'}>
          <BodyText>
            “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros
            eget libero posuere vulputate. Etiam elit elitbibendum.”
          </BodyText>
        </ActionCard>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render an action', () => {
    const tree = renderer.create(
      <Providers>
        <ActionCard
          icon={'text'}
          label={'Key Idea'}
          action={<Chip icon={'share'} title={'Share'} />}
        >
          <BodyText>
            “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros
            eget libero posuere vulputate. Etiam elit elitbibendum.”
          </BodyText>
        </ActionCard>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept additional Card props', () => {
    const tree = renderer.create(
      <Providers>
        <ActionCard cardColor={'salmon'}>
          <BodyText>
            “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros
            eget libero posuere vulputate. Etiam elit elitbibendum.”
          </BodyText>
        </ActionCard>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
