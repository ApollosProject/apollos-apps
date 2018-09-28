import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Transition } from 'react-navigation-fluid-transitions';

import GradientOverlayImage from 'apolloschurchapp/src/ui/GradientOverlayImage';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import { ThemeMixin } from 'apolloschurchapp/src/ui/theme';
import { ErrorCard } from 'apolloschurchapp/src/ui/Card';
import styled from 'apolloschurchapp/src/ui/styled';
import ModalView from 'apolloschurchapp/src/ui/ModalView';

import { events } from 'apolloschurchapp/src/analytics';
import TrackEventWhenLoaded from 'apolloschurchapp/src/analytics/TrackEventWhenLoaded';

import ActionContainer from './ActionContainer';
import HTMLContent from './HTMLContent';
import HorizontalContentFeed from './HorizontalContentFeed';
import MediaControls from './MediaControls';

import getContentItem from './getContentItem';

const FlexedScrollView = styled({ flex: 1 })(ScrollView);

class ContentSingle extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      push: PropTypes.func,
    }),
  };

  get queryVariables() {
    return { itemId: this.props.navigation.getParam('itemId', []) };
  }

  renderWithData = ({ loading, error, data }) => {
    if (error) return <ErrorCard error={error} />;

    const content = data.node || {};

    const transitionKey =
      this.props.navigation.getParam('transitionKey') || content.id;

    const coverImageSources = get(content, 'coverImage.sources', []);

    const { theme = {}, title, id } = content;

    return (
      <Transition anchor={`content/${transitionKey}/image`}>
        <TrackEventWhenLoaded
          loaded={!!(!loading && content.title)}
          eventName={events.ViewContent}
          properties={{
            title: content.title,
            itemId: this.itemId.itemId,
          }}
        />
        <ThemeMixin
          mixin={{
            type: get(theme, 'type', 'light').toLowerCase(),
            colors: get(theme, 'colors'),
          }}
        >
          <ModalView>
            <FlexedScrollView>
              <Transition shared={`content/${transitionKey}/image`}>
                <GradientOverlayImage
                  isLoading={!coverImageSources.length && loading}
                  source={coverImageSources}
                  overlayColor={get(theme, 'colors.paper')}
                />
              </Transition>

              <MediaControls contentId={id} />
              <PaddedView vertical={false}>
                <H2 padded isLoading={!title && loading}>
                  {title}
                </H2>
                <HTMLContent contentId={id} />
              </PaddedView>
              <HorizontalContentFeed contentId={id} />
            </FlexedScrollView>
            <ActionContainer itemId={id} />
          </ModalView>
        </ThemeMixin>
      </Transition>
    );
  };

  render() {
    return (
      <Query query={getContentItem} variables={this.queryVariables}>
        {this.renderWithData}
      </Query>
    );
  }
}

export default ContentSingle;
