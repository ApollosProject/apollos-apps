import gql from 'graphql-tag';
import { extendForEachContentItemType } from './utils';

export const testSchema = gql`
  scalar Upload
`;

export const authSmsSchema = gql`
  type SmsPinResult {
    success: Boolean
  }

  extend type Mutation {
    requestSmsLoginPin(phoneNumber: String!): SmsPinResult
    authenticateWithSms(phoneNumber: String!, pin: String!): Authentication
  }
`;

export const authSchema = gql`
  type AuthenticatedUser @cacheControl(maxAge: 0) {
    id: ID!
    profile: Person
    rockToken: String
  }

  type Authentication {
    user: AuthenticatedUser
    token: String
  }

  extend type Mutation {
    authenticate(identity: String!, password: String!): Authentication
    changePassword(password: String!): Authentication
    registerPerson(email: String!, password: String!): Authentication
  }

  extend type Query {
    currentUser: AuthenticatedUser
  }
`;

export const peopleSchema = gql`
  enum GENDER {
    Male
    Female
    Unknown
  }
  enum UPDATEABLE_PROFILE_FIELDS {
    FirstName
    LastName
    Email
    NickName
    Gender
    BirthDate
  }

  input UpdateProfileInput {
    field: UPDATEABLE_PROFILE_FIELDS!
    value: String!
  }

  type Person implements Node @cacheControl(maxAge: 0) {
    id: ID!
    firstName: String
    lastName: String!
    nickName: String
    email: String
    gender: GENDER
    birthDate: String
    photo: ImageMediaSource
  }

  extend type Mutation {
    updateProfileField(input: UpdateProfileInput!): Person
    updateProfileFields(input: [UpdateProfileInput]!): Person
    uploadProfileImage(file: Upload!, size: Int!): Person
  }
`;

export const mediaSchema = gql`
  interface Media {
    name: String
    key: String
    sources: [MediaSource]
  }

  interface MediaSource {
    uri: String
  }

  type ImageMedia implements Media {
    name: String
    key: String
    sources: [ImageMediaSource]
  }

  type VideoMedia implements Media {
    name: String
    key: String
    sources: [VideoMediaSource]
    # duration: Float
    embedHtml: String
  }

  type AudioMedia implements Media {
    name: String
    key: String
    # duration: Float
    sources: [AudioMediaSource]
  }

  type AudioMediaSource implements MediaSource {
    uri: String
    # format: String
    # size: String
  }

  type ImageMediaSource implements MediaSource {
    uri: String
    # width: Int
    # height: Int
  }

  type VideoMediaSource implements MediaSource {
    uri: String
    # format: String
    # size: String
  }

  enum MediaInputType {
    IMAGE
    VIDEO
    AUDIO
  }
`;

export const themeSchema = gql`
  type Theme {
    type: ThemeType
    colors: ThemeColors
  }

  enum ThemeType {
    LIGHT
    DARK
  }

  scalar Color

  type ThemeColors {
    primary: Color
    secondary: Color
    screen: Color
    paper: Color
    alert: Color
  }
`;

export const scriptureSchema = gql`
  type Scripture {
    id: String
    html: String
    reference: String
    copyright: String
  }

  extend type Query {
    scripture(query: String!): Scripture
    scriptures(query: String!): [Scripture]
  }
`;

export const analyticsSchema = gql`
  # Not supported right now...
  # union AnalyticsValue = String | Float | Boolean | Int
  scalar AnalyticsValue

  input AnalyticsMetaField {
    field: String!
    value: AnalyticsValue
  }

  enum AnalyticsPlatform {
    iOS
    Android
  }

  input AnalyticsDeviceInfo {
    platform: AnalyticsPlatform
    deviceId: String
    deviceModel: String
    osVersion: String
    appVersion: String
  }

  input AnalyticsIdentifyInput {
    traits: [AnalyticsMetaField]
    anonymousId: String!
    deviceInfo: AnalyticsDeviceInfo
  }

  input AnalyticsTrackInput {
    eventName: String!
    properties: [AnalyticsMetaField]
    anonymousId: String
    deviceInfo: AnalyticsDeviceInfo
  }

  type AnalyticsResult {
    success: Boolean
  }

  extend type Mutation {
    identifySelf(input: AnalyticsIdentifyInput!): AnalyticsResult
    trackEvent(input: AnalyticsTrackInput!): AnalyticsResult
  }
`;

export const contentItemSchema = gql`
  interface ContentItem {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel

    theme: Theme
  }

  type UniversalContentItem implements ContentItem & Node {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
  }

  type DevotionalContentItem implements ContentItem & Node {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel

    theme: Theme
    scriptures: [Scripture]
  }

  type MediaContentItem implements ContentItem & Node {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel

    theme: Theme
    scriptures: [Scripture]
  }

  type ContentSeriesContentItem implements ContentItem & Node {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel

    theme: Theme
    scriptures: [Scripture]
  }

  type WeekendContentItem implements ContentItem & Node {
    id: ID!
    title: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    parentChannel: ContentChannel

    theme: Theme
  }

  input ContentItemsConnectionInput {
    first: Int
    after: String
  }

  type ContentItemsConnection {
    edges: [ContentItemsConnectionEdge]
    # TODO totalCount: Int
    pageInfo: PaginationInfo
  }

  type ContentItemsConnectionEdge {
    node: ContentItem
    cursor: String
  }

  extend type Query {
    campaigns: ContentItemsConnection
    userFeed(first: Int, after: String): ContentItemsConnection
      @cacheControl(maxAge: 0)
    personaFeed(first: Int, after: String): ContentItemsConnection
      @cacheControl(maxAge: 0)
  }
`;

export const contentChannelSchema = gql`
  type ContentChannel implements Node {
    id: ID!
    name: String
    description: String

    childContentChannels: [ContentChannel]
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection

    iconName: String
  }

  extend type Query {
    contentChannels: [ContentChannel]
  }
`;

export const contentSharableSchema = gql`
  interface Sharable {
    url: String
    message: String
    title: String
  }

  type SharableContentItem implements Sharable {
    url: String
    message: String
    title: String
  }

  ${extendForEachContentItemType(`
    sharing: SharableContentItem
`)}
`;

export const liveSchema = gql`
  type LiveStream {
    isLive: Boolean
    eventStartTime: String
    media: VideoMedia
    webViewUrl: String
  }

  extend type Query {
    liveStream: LiveStream
  }

  extend type WeekendContentItem {
    liveStream: LiveStream
  }
`;

export const pushSchema = gql`
  input PushSettingsInput {
    enabled: Boolean
    pushProviderUserId: String
  }

  extend type Mutation {
    updateUserPushSettings(input: PushSettingsInput!): Person
  }
`;

export const campusSchema = gql`
  type Campus implements Node {
    id: ID!
    name: String
    street1: String
    street2: String
    city: String
    state: String
    postalCode: String
    latitude: Float
    longitude: Float
    image: ImageMediaSource
    distanceFromLocation(location: CampusLocationInput): Float
  }

  extend type Query {
    campuses(location: CampusLocationInput): [Campus]
  }

  input CampusLocationInput {
    latitude: Float!
    longitude: Float!
  }

  extend type Person {
    campus: Campus
  }

  extend type Mutation {
    updateUserCampus(campusId: String!): Person
  }
`;

export const followingsSchema = gql`
  enum LIKE_OPERATION {
    Like
    Unlike
  }

  input LikeEntityInput {
    nodeId: ID!
    operation: LIKE_OPERATION!
  }

  extend type Mutation {
    updateLikeEntity(input: LikeEntityInput!): ContentItem
  }

  ${extendForEachContentItemType(`
    isLiked: Boolean @cacheControl(maxAge: 0)
    likedCount: Int @cacheControl(maxAge: 0)
`)}

  extend type Query {
    likedContent(first: Int, after: String): ContentItemsConnection
      @cacheControl(maxAge: 0)
  }
`;

export const passSchema = gql`
  extend type Query {
    userPass: Pass
  }

  type Pass implements Node {
    id: ID!
    type: PassType
    description: String
    logo: ImageMediaSource
    thumbnail: ImageMediaSource
    barcode: ImageMediaSource
    primaryFields: [PassField]
    secondaryFields: [PassField]
    backgroundColor: Color
    foregroundColor: Color
    labelColor: Color
    logoText: String
    passkitFileUrl: String
  }

  type PassField {
    key: String!
    label: String
    value: String!
    textAlignment: PassFieldTextAlignment
  }

  enum PassFieldTextAlignment {
    LEFT
    CENTER
    RIGHT
    NATURAL
  }

  enum PassType {
    GENERIC
  }
`;

export const featuresSchema = gql`
  interface Feature {
    id: ID!
    order: Int # 0 is the "Main Content". If order is < 0 than this comes before the body content.
  }

  enum ACTION_FEATURE_ACTION {
    READ_CONTENT
  }

  type ActionListAction {
    id: ID!

    title: String
    subtitle: String
    image: ImageMedia
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
  }

  type ActionListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    actions: [ActionListAction]
  }

  type TextFeature implements Feature & Node {
    id: ID!
    order: Int

    body: String
  }

  extend type WeekendContentItem {
    features: [Feature]
  }

  extend type ContentSeriesContentItem {
    features: [Feature]
  }

  extend type Query {
    userFeedFeatures: [Feature] @cacheControl(maxAge: 0)
  }
`;

export { extendForEachContentItemType };
