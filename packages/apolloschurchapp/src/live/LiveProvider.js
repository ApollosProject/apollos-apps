import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { uniqBy } from 'lodash';
import getLiveContent from './getLiveContent';

class LiveUpdater extends Component {
  static propTypes = {
    children: PropTypes.node,
    liveContent: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      })
    ).isRequired,
    client: PropTypes.shape({ writeFragment: PropTypes.func.isRequired })
      .isRequired,
  };

  componentDidUpdate(prevProps) {
    // If there is a difference between the old active content, and the new active conten
    if (
      uniqBy(
        [...prevProps.liveContent, ...this.props.liveContent],
        (liveStream) => liveStream.contentItem.id
      ).length !== 0
    ) {
      this.updateLiveCache({
        lastLiveContent: prevProps.liveContent,
        liveContent: this.props.liveContent,
      });
    }
  }

  updateLiveCache({ lastLiveContent, liveContent }) {
    liveContent.forEach(
      ({ contentItem: { __typename, id }, ...liveStream }) => {
        this.props.client.writeFragment({
          id: `${__typename}:${id}`,
          fragment: gql`
            fragment LiveItem on WeekendContentItem {
              liveStream {
                isLive
                eventStartTime
                media {
                  sources {
                    uri
                  }
                }
                webViewUrl
              }
            }
          `,
          data: { __typename, liveStream: { ...liveStream, isLive: true } },
        });
      }
    );
    lastLiveContent.forEach(
      ({ contentItem: { __typename, id }, ...liveStream }) => {
        this.props.client.writeFragment({
          id: `${__typename}:${id}`,
          fragment: gql`
            fragment LiveItem on WeekendContentItem {
              liveStream {
                isLive
                eventStartTime
                media {
                  sources {
                    uri
                  }
                }
                webViewUrl
              }
            }
          `,
          data: { __typename, liveStream: { ...liveStream, isLive: false } },
        });
      }
    );
  }

  render() {
    return this.props.children;
  }
}

const LiveProvider = (props) => (
  <Query query={getLiveContent} pollInterval={30000}>
    {({ data: { liveStreams = [] } = {}, client }) => (
      <LiveUpdater client={client} liveContent={liveStreams}>
        {props.children}
      </LiveUpdater>
    )}
  </Query>
);

LiveProvider.propTypes = { children: PropTypes.node };

export default LiveProvider;
