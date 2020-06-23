import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from '../theme';

import Avatar from '.';

const source = {
  uri:
    'https://dg0ddngxdz549.cloudfront.net/images/cached/images/remote/http_s3.amazonaws.com/ns.images/all/member_images/members.nophoto_1000_1000_90_c1.jpg',
};

describe('The Avatar component', () => {
  it('should render small', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar source={source} size={'small'} />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render medium', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar source={source} size={'medium'} />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render large', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar source={source} size={'large'} />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a themeSize', () => {
    // I don't really understand the themeSize prop still
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar source={source} themeSize={80} />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render icon button', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar
          source={source}
          buttonIcon={'settings'}
          onPressIcon={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render icon button', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Avatar
          source={source}
          buttonIcon={'settings'}
          isLoading
          onPressIcon={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render correctly sized notification dots', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <>
          <Avatar
            source={source}
            size={'small'}
            unread
            onPressIcon={jest.fn()}
          />
          <Avatar
            source={source}
            size={'medium'}
            unread
            onPressIcon={jest.fn()}
          />
          <Avatar
            source={source}
            size={'large'}
            unread
            onPressIcon={jest.fn()}
          />
        </>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
