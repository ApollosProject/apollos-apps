import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { ErrorCard } from 'apolloschurchapp/src/ui/Card';
import { ThemeMixin } from 'apolloschurchapp/src/ui/theme';

import ModalView from 'apolloschurchapp/src/ui/ModalView';
import TrackEventWhenLoaded from 'apolloschurchapp/src/analytics/TrackEventWhenLoaded';

import { events } from 'apolloschurchapp/src/analytics';
import ActionContainer from './ActionContainer';
import RenderContent from './RenderContent';
import getContentItem from './getContentItem';

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

    const { theme = {}, id } = content;

    return (
      <ThemeMixin
        mixin={{
          type: get(theme, 'type', 'light').toLowerCase(),
          colors: get(theme, 'colors'),
        }}
      >
        <ModalView>
          <TrackEventWhenLoaded
            loaded={!!(!loading && content.title)}
            eventName={events.ViewContent}
            properties={{
              title: content.title,
              itemId: this.id,
            }}
          />
          <RenderContent content={content} loading={loading} />
          <ActionContainer itemId={id} />
        </ModalView>
      </ThemeMixin>
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
