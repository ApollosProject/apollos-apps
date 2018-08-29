import React, { PureComponent } from 'react';
import { Query, Mutation } from 'react-apollo';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { ErrorCard } from 'apolloschurchapp/src/ui/Card';
import CardTile from 'apolloschurchapp/src/ui/CardTile';
import VideoPlayer from 'apolloschurchapp/src/ui/VideoPlayer';
import HorizontalTileFeed from 'apolloschurchapp/src/ui/HorizontalTileFeed';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import styled from 'apolloschurchapp/src/ui/styled';
import { ThemeMixin } from 'apolloschurchapp/src/ui/theme';
import Share from 'apolloschurchapp/src/ui/Share';
import Like from 'apolloschurchapp/src/ui/Like';

import getSessionId from 'apolloschurchapp/src/auth/getSessionId';

import getContentItem from './getContentItem';
import getContentItemMinimalState from './getContentItemMinimalState';
import createInteraction from './createInteraction';

const FeedContainer = styled({
  paddingHorizontal: 0,
})(PaddedView);

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView);
const ActionContainer = ({ content, itemId, isLiked, navigation }) => (
  <View>
    <Query query={getSessionId} fetchPolicy="cache-only">
      {({ data: { sessionId } }) =>
        sessionId ? (
          <Mutation mutation={createInteraction}>
            {(createSession) => (
              <Like
                itemId={itemId}
                sessionId={sessionId}
                isLiked={isLiked}
                operation={isLiked ? 'Unlike' : 'Like'}
                toggleLike={async (variables) => {
                  try {
                    await createSession({ variables });
                    await navigation.setParams({ isLiked: !isLiked });
                  } catch (e) {
                    console.log(e);
                  }
                }}
              />
            )}
          </Mutation>
        ) : null
      }
    </Query>
    <Share content={content} />
  </View>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
  }),
  isLiked: PropTypes.bool,
  itemId: PropTypes.string,
  navigation: PropTypes.func,
};
class ContentSingle extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const shareObject = navigation.getParam('sharing', 'Content');
    const itemId = navigation.getParam('itemId', []);
    const isLiked = navigation.getParam('isLiked', false);
    return {
      title: shareObject.title,
      headerRight: (
        <ActionContainer
          isLiked={isLiked}
          itemId={itemId}
          content={shareObject}
          navigation={navigation}
        />
      ),
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      push: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.itemId = { itemId: props.navigation.getParam('itemId', []) };
    this.loadingStateObject = {
      node: {
        id: 'fakeId0',
        title: '',
        isLoading: true,
      },
    };
  }

  handleOnPressItem(item) {
    this.props.navigation.push('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });
  }

  renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => this.handleOnPressItem(item)}>
      <CardTile
        number={index + 1}
        title={get(item, 'title', '')}
        /*
          * These are props that are not yet being passed in the data.
          * We will need to make sure they get added back when that data is available.
          * byLine={item.content.speaker}
          * date={item.meta.date}
          */
        isLoading={item.isLoading}
      />
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <Query
        query={getContentItemMinimalState}
        variables={this.itemId}
        fetchPolicy="cache-only"
      >
        {({ data: cachedData }) => (
          <Query
            query={getContentItem}
            variables={this.itemId}
            fetchPolicy="cache-and-network"
          >
            {({ loading, error, data }) => {
              if (error) return <ErrorCard error={error} />;

              const content = {
                ...((cachedData && cachedData.node) || {}),
                ...((data && data.node) || {}),
              };

              const childContent = get(
                data,
                'node.childContentItemsConnection.edges',
                []
              ).map((edge) => edge.node);

              const siblingContent = get(
                data,
                'node.siblingContentItemsConnection.edges',
                []
              ).map((edge) => edge.node);

              const horizontalContent = siblingContent.length
                ? siblingContent
                : childContent;

              return (
                <ThemeMixin
                  mixin={{
                    type: get(content, 'theme.type', 'light').toLowerCase(),
                    colors: get(content, 'theme.colors'),
                  }}
                >
                  <ScrollView>
                    <VideoPlayer
                      source={get(content, 'videos[0].sources[0]', null)}
                      thumbnail={get(content, 'coverImage.sources', [])}
                      overlayColor={get(content, 'theme.colors.paper')}
                    />
                    <BackgroundView>
                      <ContentContainer>
                        <H2 padded isLoading={!content.title && loading}>
                          {content.title}
                        </H2>
                        <HTMLView isLoading={!content.htmlContent && loading}>
                          {content.htmlContent}
                        </HTMLView>
                      </ContentContainer>
                    </BackgroundView>
                    {(horizontalContent && horizontalContent.length) ||
                    loading ? (
                      <FeedContainer>
                        <HorizontalTileFeed
                          content={horizontalContent}
                          isLoading={loading}
                          loadingStateObject={this.loadingStateObject}
                          renderItem={this.renderItem}
                        />
                      </FeedContainer>
                    ) : null}
                  </ScrollView>
                </ThemeMixin>
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}

export default ContentSingle;
