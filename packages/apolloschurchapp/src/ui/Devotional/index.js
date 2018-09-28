import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import ContentTab from 'apolloschurchapp/src/ui/Devotional/ContentTab';
import ScriptureTab from 'apolloschurchapp/src/ui/Devotional/ScriptureTab';

class Devotional extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      body: PropTypes.string,
      title: PropTypes.string,
      route: PropTypes.shape({
        jumpTo: PropTypes.func,
      }),
    }),
    isLoading: PropTypes.bool,
    scripture: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        reference: PropTypes.string,
        html: PropTypes.string,
      })
    ),
  };

  contentRoute = () => (
    <ContentTab
      body={this.props.content.body}
      isLoading={this.props.isLoading}
      route={this.props.content.route}
      scripture={this.props.scripture}
      title={this.props.content.title}
    />
  );

  scriptureRoute = () => (
    <ScriptureTab
      scripture={this.props.scripture}
      isLoading={this.props.isLoading}
    />
  );

  render() {
    const hasScripture = this.props.isLoading || this.props.scripture.length;
    const tabRoutes = [{ title: 'Devotional', key: 'content' }];
    if (hasScripture) tabRoutes.push({ title: 'Scripture', key: 'scripture' });

    return (
      <BackgroundView>
        <TabView
          routes={tabRoutes}
          renderScene={SceneMap({
            content: this.contentRoute,
            scripture: this.scriptureRoute,
          })}
        />
      </BackgroundView>
    );
  }
}

export default Devotional;
