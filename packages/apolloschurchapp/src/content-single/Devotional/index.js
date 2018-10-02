import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import ContentTab from './ContentTab';
import ScriptureTab from './ScriptureTab';

/**
 * The devotional component.
 * Displays a TabView with two tabs: ContentTab and ScriptureTab.
 */
class Devotional extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      /** The devotional text */
      body: PropTypes.string,
      /** The devotional title */
      title: PropTypes.string,
    }),
    /** Toggles placeholders */
    isLoading: PropTypes.bool,
    /** An array of scripture objects */
    scripture: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
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
