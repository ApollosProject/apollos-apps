import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H3,
  H5,
  HorizontalTileFeed,
  styled,
  TouchableScale,
  withIsLoading,
  withTheme,
  Touchable,
  ButtonLink,
  FlexedView,
  H6,
} from '@apollosproject/ui-kit';

import { LiveConsumer } from '../../live';
import { HorizontalContentCardComponentMapper } from '../../HorizontalContentCardConnected';

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Title'
)(H5);

const Subtitle = styled(
  {},
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Subtitle'
)(H3);

const Header = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit * 3,
    paddingBottom: theme.sizing.baseUnit * 0.5,
    paddingLeft: theme.sizing.baseUnit,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.Header'
)(View);

const AndroidTouchableFix = withTheme(
  ({ theme }) => ({
    borderRadius: theme.sizing.baseBorderRadius / 2,
    style: { alignSelf: 'flex-end' },
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.AndroidTouchableFix'
)(Touchable);

const ButtonLinkSpacing = styled(
  ({ theme }) => ({
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
    // paddingBottom: titleAndSubtitle ? theme.sizing.baseUnit / 2 : 0,
    alignItems: 'flex-end',
  }),
  'ui-connected.HorizontalCardListFeatureConnected.HorizontalCardListFeature.ButtonLinkSpacing'
)(View);

class HorizontalCardListFeature extends PureComponent {
  static defaultProps = {
    loadingStateObject: {
      id: 'fakeId0',
      isLoading: true,
      title: 'Boom',
      hasAction: true,
      actionIcon: 'umbrella',
      channelType: '',
      coverImage: [],
      // We need to assume a typename so horizontalContentCardComponentMapper knows what "type" to render
      __typename: 'MediaContentItem',
    },
  };

  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool,
    listKey: PropTypes.string, // needed if multiple lists/feeds are displayed as siblings
    loadingStateObject: PropTypes.shape({}),
    onPressItem: PropTypes.func,
    onPressPrimaryButton: PropTypes.func,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    primaryAction: PropTypes.shape({
      title: PropTypes.string,
    }),
  };

  keyExtractor = (item) => item && item.id;

  renderItem = ({ item }) => (
    <LiveConsumer contentId={item.id}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);
        const labelText = isLive ? 'Live' : item.labelText;
        return (
          <TouchableScale onPress={() => this.props.onPressItem(item)}>
            <HorizontalContentCardComponentMapper
              isLive={isLive}
              {...item}
              labelText={labelText}
            />
          </TouchableScale>
        );
      }}
    </LiveConsumer>
  );

  render() {
    const {
      isLoading,
      cards,
      subtitle,
      title,
      primaryAction,
      onPressItem,
      onPressPrimaryButton,
      listKey,
      loadingStateObject,
    } = this.props;
    const onPressAction = onPressPrimaryButton || onPressItem;
    return (
      !!(isLoading || cards.length) && (
        <View>
          {isLoading || title || subtitle || primaryAction ? (
            <Header>
              <FlexedView>
                {isLoading || title ? ( // we check for isloading here so that they are included in the loading state
                  <Title numberOfLines={1}>{title}</Title>
                ) : null}
                {isLoading || subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
              </FlexedView>
              {isLoading || primaryAction ? (
                <AndroidTouchableFix
                  onPress={() => onPressAction(primaryAction)}
                >
                  <ButtonLinkSpacing>
                    <H6>
                      <ButtonLink>{primaryAction?.title}</ButtonLink>
                    </H6>
                  </ButtonLinkSpacing>
                </AndroidTouchableFix>
              ) : null}
            </Header>
          ) : null}
          <HorizontalTileFeed
            content={cards}
            isLoading={isLoading}
            listKey={listKey}
            keyExtractor={this.keyExtractor}
            loadingStateObject={loadingStateObject}
            renderItem={this.renderItem}
          />
        </View>
      )
    );
  }
}

export default withIsLoading(HorizontalCardListFeature);
