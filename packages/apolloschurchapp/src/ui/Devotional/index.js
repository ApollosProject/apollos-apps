import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import ContentTab from 'apolloschurchapp/src/ui/Devotional/ContentTab';
import ScriptureTab from 'apolloschurchapp/src/ui/Devotional/ScriptureTab';

/**
 * The devotional component.
 * Displays a TabView with two tabs: Content and Scripture.
 */
class Devotional extends PureComponent {
  /**
   * Props passed to the devotional component:
   * content: An object containing:
   *   body: body text of the devotional.
   *   title: title of the devotional.
   * isLoading: Boolean prop that shows placeholders while the data is loading.
   * scripture: An array of scripture verses containing:
   *   id: The ID of the verse (i.e. '1CO.15.57')
   *   reference: The scripture location (i.e. '1 Corinthians 15:57')
   *   html: The HTML of the verses to render.
   */
  static propTypes = {
    content: PropTypes.shape({
      body: PropTypes.string,
      title: PropTypes.string,
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

  /**
   * The route that TabView uses to render the ContentTab
   */
  contentRoute = (navigationState) => (
    <ContentTab
      body={this.props.content.body}
      isLoading={this.props.isLoading}
      scripture={this.props.scripture}
      title={this.props.content.title}
      navigationState={navigationState}
    />
  );

  /**
   * The route that TabView uses to render the ScriptureTab
   */
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
