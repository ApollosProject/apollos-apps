/* eslint-disable class-methods-use-this */
import { RESTDataSource } from 'apollo-datasource-rest';
import { get } from 'lodash';

const CurrentLivestreamQuery = `
query CurrentState {
  currentService(onEmpty: LOAD_NEXT) {
    ...ServiceFields
    __typename
  }
}
fragment ServiceFields on Service {
  id
  startTime
  scheduleTime
  endTime
  content {
    id
    hostInfo
    notes
    title
    hasVideo
    videoStarted
    video {
      type
      url
      source
      __typename
    }
    videoStartTime
    __typename
  }
}`;

export default class LiveStream extends RESTDataSource {
  resource = 'LiveStream';

  get chopConfig() {
    return this.context.dataSources.Config.CHURCH_ONLINE || {};
  }

  get baseURL() {
    return this.chopConfig.URL;
  }

  get mediaUrls() {
    return this.chopConfig.MEDIA_URLS || [];
  }

  get webViewUrl() {
    return this.chopConfig.WEB_VIEW_URL || this.chopConfig.URL;
  }

  async getAccessToken() {
    const { Cache } = this.context.dataSources;
    const cachedAccessToken = await Cache.get({
      key: ['church-online', 'access-token'],
    });
    if (cachedAccessToken) return cachedAccessToken;
    const authResponse = await this.post('auth/guest');
    const accessToken = authResponse.access_token;
    await Cache.set({
      key: ['church-online', 'access-token'],
      data: accessToken,
    });
    return accessToken;
  }

  async getLiveStream() {
    const accessToken = await this.getAccessToken();
    const result = await this.post(
      'graphql',
      {
        operationName: 'CurrentState',
        query: CurrentLivestreamQuery,
      },
      {
        headers: {
          cookie: `access_token=${accessToken};`,
        },
      }
    );
    // TODO: The cookie above won't last forever.
    const { data } = result;
    return {
      isLive: get(data, 'currentService.content.videoStarted', false),
      eventStartTime: get(data, 'currentService.startTime'),
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
    if (!this.chopConfig?.URL) return [];
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
