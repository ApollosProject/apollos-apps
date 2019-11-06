/* eslint-disable class-methods-use-this */
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';
import { get } from 'lodash';

export default class LiveStream extends RESTDataSource {
  resource = 'LiveStream';

  get baseURL() {
    return ApollosConfig.CHURCH_ONLINE.URL;
  }

  get mediaUrls() {
    return ApollosConfig.CHURCH_ONLINE.MEDIA_URLS;
  }

  get webViewUrl() {
    return ApollosConfig.CHURCH_ONLINE.WEB_VIEW_URL;
  }

  async getLiveStream() {
    const stream = await this.get('events/current');
    return {
      isLive: get(stream, 'response.item.isLive', false),
      eventStartTime: get(stream, 'response.item.eventStartTime'),
      media: () =>
        this.mediaUrls.length
          ? {
              sources: this.mediaUrls.map((uri) => ({
                uri,
              })),
            }
          : null,
      webViewUrl: this.webViewUrl,
    };
  }

  async getLiveStreams() {
    const { ContentItem } = this.context.dataSources;
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const liveItems = await ContentItem.getActiveLiveStreamContent();
    return Promise.all(
      liveItems.map(async (item) => ({
        contentItem: item,
        ...(await this.getLiveStream()),
      }))
    );
  }
}
