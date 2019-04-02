import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  styled,
  FeedView,
  BackgroundView,
  H3,
  H6,
  H2,
  TouchableScale,
  Card,
  FlexedView,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';
import ContentCardConnected from '../../ui/ContentCardConnected';

import { LiveButton } from '../../live';

import ContentTableCard from '../../ui/ContentTableCard';
import getUserFeed from './getUserFeed';
import getPersonaFeed from './getPersonaFeed';
import getCampaignContentItem from './getCampaignContentItem';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
}))(Image);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const TextContainer = styled(({ theme }) => ({
  // marginTop: theme.sizing.baseUnit / 2.5,
  // borderBottomWidth: 0.5,
  // height: theme.sizing.baseUnit * 4.25,
  borderColor: theme.colors.shadows.default,
}))(FlexedView);

class Home extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  render() {
    return (
      <BackgroundView>
        <SafeAreaView>
          <Query query={getUserFeed} fetchPolicy="cache-and-network">
            {({ loading, error, data, refetch }) => (
              <FeedView
                ListItemComponent={ContentCardConnected}
                content={get(data, 'userFeed.edges', []).map(
                  (edge) => edge.node
                )}
                isLoading={loading}
                error={error}
                refetch={refetch}
                ListHeaderComponent={
                  <>
                    <LogoTitle source={require('./wordmark.png')} />
                    <LiveButton />
                    <Query
                      query={getCampaignContentItem}
                      fetchPolicy="cache-and-network"
                    >
                      {({ data: featuredData, loading: isFeaturedLoading }) => {
                        const featuredContent = get(
                          featuredData,
                          'campaigns.edges',
                          []
                        ).map((edge) => edge.node);

                        const featuredItem = get(
                          featuredContent[0],
                          'childContentItemsConnection.edges[0].node',
                          {}
                        );

                        const imageStyle = {
                          position: 'absolute',
                          bottom: 0,
                          top: 0,
                          left: 0,
                          right: 0,
                        };

                        return (
                          <TouchableScale
                            onPress={() => this.handleOnPress(featuredItem)}
                          >
                            <Card
                              isLoading={isFeaturedLoading}
                              forceRatio={0.75}
                            >
                              <GradientOverlayImage
                                source={get(
                                  featuredItem,
                                  'coverImage.sources[0]',
                                  {}
                                )}
                                isLoading
                                forceRatio={0.75}
                                resizeMode="stretch"
                                imageStyle={imageStyle}
                                overlayColor={get(
                                  featuredItem,
                                  'theme.colors.primary',
                                  '#fff'
                                )}
                                maintainAspectRatio
                              />
                              <TextContainer>
                                <StyledH6>{featuredItem.title}</StyledH6>
                                <H2 numberOfLines={2} ellipsizeMode="tail">
                                  {featuredItem.summary}
                                </H2>
                              </TextContainer>
                            </Card>
                          </TouchableScale>
                        );
                      }}
                    </Query>
                    <Query
                      query={getPersonaFeed}
                      fetchPolicy="cache-and-network"
                    >
                      {({
                        data: personaData,
                        loading: isContentTableLoading,
                      }) => (
                        <ContentTableCard
                          isLoading={isContentTableLoading}
                          onPress={this.handleOnPress}
                          header={
                            <>
                              <StyledH6 isLoading={isContentTableLoading}>
                                FOR YOU
                              </StyledH6>
                              <H3
                                isLoading={isContentTableLoading}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                              >
                                Explore what God calls you to today
                              </H3>
                            </>
                          }
                          content={get(
                            personaData,
                            'personaFeed.edges',
                            []
                          ).map((edge) => edge.node)}
                        />
                      )}
                    </Query>
                  </>
                }
                onPressItem={this.handleOnPress}
              />
            )}
          </Query>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Home;
