import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme } from 'apolloschurchapp/src/ui/theme';
import FeedView from 'apolloschurchapp/src/ui/FeedView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import Scripture from 'apolloschurchapp/src/ui/Scripture';

import { LiveButton } from '../../live';

import getUserFeed from './getUserFeed';

class Home extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Apollos Church',
    headerStyle: {
      backgroundColor: navigation.getParam('backgroundColor'),
    },
    headerTintColor: navigation.getParam('tintColor'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
    headerBackgroundColor: PropTypes.string,
    headerTintColor: PropTypes.string,
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({
      backgroundColor: props.headerBackgroundColor,
      tintColor: props.headerTintColor,
    });
  }

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      itemTitle: item.title,
    });

  render() {
    return (
      <BackgroundView>
        <Scripture
          references={[
            {
              query: 'John 11:35-36',
              passages: [
                '<h2 class="extra_text">John 11:35–36 <small class="audio extra_text">(<a class="mp3link" href="https://audio.esv.org/hw/43011035-43011036.mp3" title="John 11:35–36" type="audio/mpeg">Listen</a>)</small></h2>\n<p id="p43011035_01-1" class="virtual"><b class="verse-num" id="v43011035-1">35&nbsp;</b>Jesus wept. <b class="verse-num" id="v43011036-1">36&nbsp;</b>So the Jews said, “See how he loved him!”</p>\n<p>(<a href="http://www.esv.org" class="copyright">ESV</a>)</p>',
              ],
            },
          ]}
        />
        <Query query={getUserFeed} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch }) => (
            <FeedView
              content={get(data, 'userFeed.edges', []).map((edge) => edge.node)}
              isLoading={loading}
              error={error}
              refetch={refetch}
              ListHeaderComponent={LiveButton}
              onPressItem={this.handleOnPress}
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default withTheme(({ theme, ...otherProps }) => ({
  headerBackgroundColor: theme.colors.primary,
  headerTintColor: theme.colors.background.paper,
  ...otherProps,
}))(Home);
