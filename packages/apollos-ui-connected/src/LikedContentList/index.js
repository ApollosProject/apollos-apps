import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { BackgroundView, FeedView } from '@apollosproject/ui-kit';

import fetchMoreResolver from '../utils/fetchMoreResolver';

import ContentCardConnected from '../../../ui/ContentCardConnected';

import GET_LIKED_CONTENT from './getLikedContent';

/** A FeedView wrapped in a query to pull content data. */
class LikedContentList extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = () => ({
    title: 'Your Likes',
  });

  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  static defaultProps = {
    Component: FeedView,
  };

  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });

  getContent = (data) =>
    get(data, 'likedContent.edges', []).map((edge) => edge.node);

  render() {
    return (
      <BackgroundView>
        <Query
          query={GET_LIKED_CONTENT}
          fetchPolicy="cache-and-network"
          variables={{ first: 20 }}
        >
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <this.props.Component
              ListItemComponent={ContentCardConnected}
              content={this.getContent(data)}
              isLoading={loading}
              error={error}
              refetch={refetch}
              onPressItem={this.handleOnPress}
              fetchMore={fetchMoreResolver({
                collectionName: 'likedContent',
                fetchMore,
                variables,
                data,
              })}
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export { LikedContentList as default, GET_LIKED_CONTENT };
