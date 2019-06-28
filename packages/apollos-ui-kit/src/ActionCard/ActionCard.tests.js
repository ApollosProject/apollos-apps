import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import Chip from '../Chip';
import { BodyText } from '../typography';
import ActionCard from '.';

describe('the ActionCard component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ActionCard
          label="Key Idea"
          icon="text"
          action={<Chip icon="share" title="Share" />}
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
});
