import gql from 'graphql-tag';
import { extendForEachContentItemType } from './utils';

export const testSchema = gql`
  scalar Upload

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE
`;

export const authSmsSchema = gql`
  type SmsPinResult {
    success: Boolean
    userAuthStatus: USER_AUTH_STATUS
  }

  extend type Mutation {
    requestSmsLoginPin(phoneNumber: String!): SmsPinResult
    authenticateWithSms(phoneNumber: String!, pin: String!): Authentication
    registerWithSms(
      phoneNumber: String!
      pin: String!
      userProfile: [UpdateProfileInput]
    ): Authentication
  }

  enum USER_AUTH_STATUS {
    NONE
    NEW_APP_USER
    EXISTING_APP_USER
  }

  extend type Query {
    userExists(identity: String): USER_AUTH_STATUS @cacheControl(maxAge: 0)
  }
`;

export const authSchema = gql`
  type RockPersonDetails {
    authToken: String
    authCookie: String
  }

  type AuthenticatedUser @cacheControl(maxAge: 0) {
    id: ID!
    profile: Person
    rock: RockPersonDetails
    rockToken: String @deprecated(reason: "Use rock.authCookie instead")
  }

  type Authentication {
    user: AuthenticatedUser
    token: String
  }

  extend type Mutation {
    authenticate(identity: String!, password: String!): Authentication
    changePassword(password: String!): Authentication
    registerPerson(
      email: String!
      password: String!
      userProfile: [UpdateProfileInput]
    ): Authentication
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
    lastName: String
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
  type Scripture implements Node {
    id: ID!

    html: String
    reference: String
    copyright: String
    version: String
  }

  enum VERSION {
    WEB
    KJV
  }

  extend type Query {
    scripture(query: String!, version: VERSION): Scripture
      @deprecated(reason: "Use 'scriptures' instead.")
    scriptures(query: String!, version: VERSION): [Scripture]
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

export const interactionsSchema = gql`
  scalar InteractionValue

  enum InteractionAction {
    VIEW
    COMPLETE
  }

  input InteractionDataField {
    field: String!
    value: InteractionValue
  }

  type InteractionResult {
    success: Boolean
    node: Node
  }

  extend type Mutation {
    interactWithNode(
      action: InteractionAction!
      nodeId: ID!
      data: [InteractionDataField]
    ): InteractionResult
  }
`;

export const contentItemSchema = gql`
  interface ContentItem {
    id: ID!
    title(hyphenated: Boolean): String
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
    title(hyphenated: Boolean): String
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
    title(hyphenated: Boolean): String
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
    title(hyphenated: Boolean): String
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
    title(hyphenated: Boolean): String
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

    percentComplete: Float @cacheControl(maxAge: 0)
    upNext: ContentItem @cacheControl(maxAge: 0)
    scriptures: [Scripture]
  }

  type WeekendContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
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
    totalCount: Int
    pageInfo: PaginationInfo
  }

  type ContentItemsConnectionEdge {
    node: ContentItem
    cursor: String
  }

  extend type Query {
    campaigns: ContentItemsConnection
    userFeed(first: Int, after: String): ContentItemsConnection
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

export const searchSchema = gql`
  extend type Query {
    search(query: String!, first: Int, after: String): SearchResultsConnection
  }

  type SearchResultsConnection {
    edges: [SearchResult]
    pageInfo: PaginationInfo
  }

  type SearchResult {
    cursor: String
    title: String
    summary: String
    coverImage: ImageMedia
    node: Node
  }
`;

export const sharableSchema = gql`
  interface Sharable {
    message: String
    title: String
    url: String @deprecated(reason: "Not supported on the interface")
  }

  type SharableContentItem implements Sharable {
    message: String
    title: String
    url: String
  }

  ${extendForEachContentItemType(`
    sharing: SharableContentItem
`)}

  type SharableFeature implements Sharable {
    message: String
    title: String
    url: String @deprecated(reason: "Not supported on a feature")
  }

  extend type TextFeature {
    sharing: SharableFeature
  }

  extend type ScriptureFeature {
    sharing: SharableFeature
  }
`;

export const liveSchema = gql`
  type LiveStream {
    isLive: Boolean @cacheControl(maxAge: 10)
    eventStartTime: String
    media: VideoMedia
    webViewUrl: String
    contentItem: ContentItem @cacheControl(maxAge: 10)
  }

  extend type Query {
    liveStream: LiveStream
      @deprecated(reason: "Use liveStreams, there may be multiple.")
    liveStreams: [LiveStream] @cacheControl(maxAge: 10)
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

export const groupSchema = gql`
  enum GROUP_TYPE {
    Serving
    Community
    Family
  }

  type Group implements Node {
    id: ID!
    name: String
    leader: Person @deprecated(reason: "No longer used, use 'leaders' instead")
    leaders: [Person]
    members: [Person]
  }

  extend type Person {
    groups(type: GROUP_TYPE, asLeader: Boolean): [Group]
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
    latitude: Float
    longitude: Float
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
    READ_EVENT
    OPEN_URL
  }

  type Url implements Node {
    url: String
    id: ID!
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

  type HeroListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    actions: [ActionListAction]
    heroCard: CardListItem
  }

  type CardListItem {
    id: ID!

    hasAction: Boolean
    actionIcon: String
    labelText: String
    summary: String
    coverImage: ImageMedia
    title(hyphenated: Boolean): String

    relatedNode: Node
    action: ACTION_FEATURE_ACTION
  }

  type VerticalCardListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    isFeatured: Boolean
    cards: [CardListItem]
  }

  type HorizontalCardListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    cards: [CardListItem]
  }

  type TextFeature implements Feature & Node {
    id: ID!
    order: Int

    body: String
  }

  type ScriptureFeature implements Feature & Node {
    id: ID!
    order: Int

    scriptures: [Scripture]
  }

  type WebviewFeature implements Feature & Node {
    id: ID!
    order: Int

    linkText: String
    title: String
    url: String
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

export const eventSchema = gql`
  type Event implements Node {
    id: ID!
    name: String
    description: String
    location: String
    start: String
    end: String
    image: ImageMedia
  }

  extend type Campus {
    events: [Event]
  }
`;

export const prayerSchema = gql`
  type PrayerRequest implements Node {
    id: ID!
    text: String!
    requestor: Person
    isAnonymous: Boolean
    isPrayed: Boolean
  }

  type PrayerListFeature implements Feature & Node {
    id: ID!
    order: Int
    isCard: Boolean
    title: String
    subtitle: String
    prayers: [PrayerRequest]
  }

  extend type Mutation {
    addPrayer(text: String!, isAnonymous: Boolean): PrayerRequest
  }

  extend enum InteractionAction {
    PRAY
  }
`;

export { extendForEachContentItemType };
