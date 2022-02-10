import { gql } from 'apollo-server';
import {
  extendForEachContentItemType,
  addInterfacesForEachContentItemType,
} from './utils';

export const nodeSchema = gql`
  extend type Query {
    node(id: ID!): Node
  }

  interface Node {
    id: ID!
  }
`;

export const paginationSchema = gql`
  type PaginationInfo {
    startCursor: String
    endCursor: String
  }
`;

export const uploadSchema = gql`
  scalar Upload
`;

export const interfacesSchema = gql`
  interface ContentNode {
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    htmlContent: String
  }

  interface Card {
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    summary: String
  }

  interface VideoNode {
    videos: [VideoMedia]
  }

  interface AudioNode {
    audios: [AudioMedia]
  }

  interface ContentParentNode {
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
  }

  interface ContentChildNode {
    parentChannel: ContentChannel
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
  }

  interface ThemedNode {
    theme: Theme
  }

  interface ProgressNode {
    percentComplete: Float @cacheControl(scope: PRIVATE)
    upNext: ContentItem @cacheControl(scope: PRIVATE)
  }

  interface ScriptureNode {
    scriptures: [Scripture]
  }

  # Maps to each type implementing each interface.
  # Reduces visual fluff in this file. No magic.
  ${addInterfacesForEachContentItemType(
    [
      'ContentNode',
      'Card',
      'VideoNode',
      'AudioNode',
      'ContentChildNode',
      'ContentParentNode',
      'ThemedNode',
    ],
    [
      'UniversalContentItem',
      'WeekendContentItem',
      'MediaContentItem',
      'ContentSeriesContentItem',
      'DevotionalContentItem',
    ]
  )}

  extend type MediaContentItem implements ScriptureNode
  extend type DevotionalContentItem implements ScriptureNode
  extend type ContentSeriesContentItem implements ProgressNode
`;

export const testSchema = gql`
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
    requestSmsLoginPin(phoneNumber: String!): SmsPinResult @deprecated
    authenticateWithSms(phoneNumber: String!, pin: String!): Authentication
      @deprecated
    registerWithSms(
      phoneNumber: String!
      pin: String!
      userProfile: [UpdateProfileInput]
    ): Authentication @deprecated
  }

  enum USER_AUTH_STATUS {
    NONE
    NEW_APP_USER
    EXISTING_APP_USER
  }

  extend type Query {
    userExists(identity: String): USER_AUTH_STATUS
      @cacheControl(scope: PRIVATE)
      @deprecated
  }
`;

export const authSchema = gql`
  type RockPersonDetails {
    authToken: String
    authCookie: String
  }

  type AuthenticatedUser @cacheControl(scope: PRIVATE) {
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
      @deprecated
    changePassword(password: String!): Authentication
    registerPerson(
      email: String!
      password: String!
      userProfile: [UpdateProfileInput]
    ): Authentication @deprecated
  }

  extend type Query {
    currentUser: AuthenticatedUser
  }
`;

export const authenticationSchema = gql`
  type AuthenticatedPerson {
    person: Person
    accessToken: String
    refreshToken: String
  }

  extend type Mutation {
    # Requests an OTP to be sent to an existing user.
    requestLogin(identity: AuthenticationIdentityInput!): LoginAttempt
    # Requests an OTP to be sent to a new user.
    requestRegister(identity: AuthenticationIdentityInput!): LoginAttempt
    # Logs in with an OTP.
    validateLogin(
      identity: AuthenticationIdentityInput!
      otp: String!
    ): AuthenticatedPerson

    # Uses a refresh token to get a new access token.
    refreshSession(refreshToken: String!): AuthenticatedPerson

    # Used for connecting an email or phone number to an existing logged in account.
    requestConnectIdentity(
      identity: AuthenticationIdentityInput!
    ): IdentityConnectAttempt
    connectIdentity(
      identity: AuthenticationIdentityInput!
      otp: String!
    ): AuthenticatedPerson
  }

  type IdentityConnectAttempt {
    result: IdentityConnectAttemptResult
  }

  enum IdentityConnectAttemptResult {
    SUCCESS
  }

  enum LoginAttemptResult {
    SUCCESS
    NO_USER
    EXISTING_USER
  }

  type LoginAttempt {
    result: LoginAttemptResult
  }

  input AuthenticationIdentityInput {
    email: String
    phone: String
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
    Email @deprecated
    NickName
    Gender
    BirthDate
    Phone @deprecated
  }

  input UpdateProfileInput {
    field: UPDATEABLE_PROFILE_FIELDS!
    value: String!
  }

  type Person implements Node {
    id: ID!
    firstName: String
    lastName: String
    nickName: String
    email: String
    gender: GENDER
    birthDate: String
    photo: ImageMediaSource
    phone: String
  }

  extend type Mutation {
    updateProfileField(input: UpdateProfileInput!): Person
    updateProfileFields(input: [UpdateProfileInput]!): Person
    uploadProfileImage(file: Upload!, size: Int!): Person
  }

  type SearchPeopleResultsConnection {
    edges: [SearchPeopleResult]
    pageInfo: PaginationInfo
  }

  type SearchPeopleResult {
    node: Person
    cursor: String
  }

  extend type Query {
    suggestedFollows: [Person] @cacheControl(scope: PRIVATE)
    searchPeople(
      name: String
      first: Int
      after: String
    ): SearchPeopleResultsConnection
  }
`;

export const deviceSchema = gql`
  type Device implements Node {
    id: ID!
    pushId: String!
    notificationsEnabled: Boolean!
  }

  extend type Person {
    devices: [Device]
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
    book: String
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
    SERIES_START
  }

  input InteractionDataField {
    field: String!
    value: InteractionValue
  }

  type InteractionResult {
    success: Boolean
    node: Node
  }

  type Interaction implements Node {
    id: ID!
    action: InteractionAction
    node: Node
  }

  extend type Query {
    interactions(nodeId: ID, action: InteractionAction): [Interaction]
      @cacheControl(scope: PRIVATE)
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
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
  }

  type UniversalContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
  }

  type DevotionalContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme

    scriptures: [Scripture]
  }

  type MediaContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme

    scriptures: [Scripture]
  }

  type ContentSeriesContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
    percentComplete: Float @cacheControl(scope: PRIVATE)
    upNext: ContentItem @cacheControl(scope: PRIVATE)
    scriptures: [Scripture]
  }

  type WeekendContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
  }

  input ContentItemsConnectionInput {
    first: Int
    after: String
    orderBy: ContentItemsConnectionOrderInput
  }

  input ContentItemsConnectionOrderInput {
    field: OrderField
    direction: OrderDirection
  }

  enum OrderField {
    DATE
  }

  enum OrderDirection {
    DESC
    ASC
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
    contentItemTags: [String]
    campaigns: ContentItemsConnection
    userFeed(first: Int, after: String): ContentItemsConnection
    personaFeed(first: Int, after: String): ContentItemsConnection
      @cacheControl(scope: PRIVATE)
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
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection

    iconName: String
  }

  extend type Query {
    contentChannels: [ContentChannel]
      @deprecated(reason: "No longer supported.")
  }
`;

export const searchSchema = gql`
  extend type Query {
    search(query: String!, first: Int, after: String): SearchResultsConnection
  }

  type SearchResultsConnection {
    totalCount: Int
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

  interface ShareableNode {
    sharing: SharableContentItem
  }

  ${addInterfacesForEachContentItemType(
    ['ShareableNode'],
    [
      'UniversalContentItem',
      'WeekendContentItem',
      'MediaContentItem',
      'ContentSeriesContentItem',
      'DevotionalContentItem',
    ]
  )}

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

  interface LiveNode {
    liveStream: LiveStream
  }

  extend type WeekendContentItem implements LiveNode
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
      @deprecated(reason: "Use the more general updateLikeNode instead")
    updateLikeNode(input: LikeEntityInput!): Node
  }

  ${extendForEachContentItemType(`
    isLiked: Boolean @cacheControl(scope: PRIVATE)
    likedCount: Int @cacheControl(scope: PRIVATE)
`)}

  interface LikableNode {
    isLiked: Boolean
    likedCount: Int
  }

  ${addInterfacesForEachContentItemType(
    ['LikableNode'],
    [
      'UniversalContentItem',
      'WeekendContentItem',
      'MediaContentItem',
      'ContentSeriesContentItem',
      'DevotionalContentItem',
    ]
  )}

  extend type Query {
    likedContent(first: Int, after: String): ContentItemsConnection
      @cacheControl(scope: PRIVATE)
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
    OPEN_URL_EXTERNALLY
    OPEN_AUTHENTICATED_URL
    OPEN_NODE
    OPEN_CHANNEL
    OPEN_FEED
    COMPLETE_NODE
  }

  type Url implements Node {
    url: String
    id: ID!
  }

  # Represents a generic action. Typically a button or link.
  type FeatureAction {
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
    title: String
  }

  # An item on an ActionListFeature.
  type ActionListAction {
    id: ID!

    title: String
    subtitle: String
    image: ImageMedia
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
  }

  # A list of "actions", in this case thumbnails, title, and subtitle.
  # Has a button at the very bottom (primary action)
  type ActionListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    actions: [ActionListAction]
    primaryAction: FeatureAction
  }

  # An item in an ActionBarFeature. Buttons with an icon and title.
  type ActionBarAction {
    id: ID!
    icon: String
    title: String
    action: ACTION_FEATURE_ACTION
    relatedNode: Node
  }

  # A list of actions, represented as a series of horizontal buttons with icons.
  # Also has a title above the actions (which can exist by itself by omotting the actions)
  type ActionBarFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    actions: [ActionBarAction]
  }

  type ActionTableAction {
    id: ID!
    icon: String
    title: String
    subtitle: String
    action: ACTION_FEATURE_ACTION
    relatedNode: Node
  }

  type ActionTableFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    actions: [ActionTableAction]
  }

  # A Hero Card with (essentially) an Action List attached to the bottom.
  # Also has a button at the very bottom.
  type HeroListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    actions: [ActionListAction]
    heroCard: CardListItem
    primaryAction: FeatureAction
  }

  # Represents a Card (card type is dictated on the client)
  # Cards are rendered through either a HeroListFeature (hero) or Vertical/HorizontalCardList
  # Similar to ActionListAction
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

  # A Vertical list of cards.
  type VerticalCardListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    isFeatured: Boolean
    cards: [CardListItem]
  }

  # A Vertical list of cards.
  # Also has a button at the top right.
  type HorizontalCardListFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    subtitle: String
    cards: [CardListItem]
    primaryAction: FeatureAction
  }

  type TextFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    body: String
  }

  type ScriptureFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    scriptures: [Scripture]
  }

  type WebviewFeature implements Feature & Node {
    id: ID!
    order: Int
    height: Int
    title: String
    linkText: String
    url: String
  }

  type ButtonFeature implements Feature & Node {
    id: ID!
    order: Int

    action: FeatureAction
  }

  type FeatureFeed implements Node {
    id: ID!
    features: [Feature]
  }

  interface FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  extend type WeekendContentItem implements FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  extend type DevotionalContentItem implements FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  extend type ContentSeriesContentItem implements FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  extend type UniversalContentItem implements FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  extend type MediaContentItem implements FeaturesNode {
    features: [Feature] @deprecated(reason: "Use featureFeed")
    featureFeed: FeatureFeed
  }

  type AppTab {
    title: String
    icon: String
    feed: FeatureFeed
  }

  extend type Query {
    tabs(campusId: ID, tags: [String]): [AppTab] @cacheControl(scope: PRIVATE)
    tabFeedFeatures(tab: Tab!, campusId: ID, tags: [String]): FeatureFeed
      @cacheControl(scope: PRIVATE)
      @deprecated(reason: "Use tabs")
    userFeedFeatures: [Feature]
      @cacheControl(scope: PRIVATE)
      @deprecated(reason: "Use homeFeedFeatures or discoverFeedFeatures")
    homeFeedFeatures(campusId: ID): FeatureFeed
      @cacheControl(scope: PRIVATE)
      @deprecated(reason: "Use tabFeedFeatures(tab: HOME)")
    discoverFeedFeatures: FeatureFeed
      @cacheControl(scope: PRIVATE)
      @deprecated(reason: "Use tabFeedFeatures(tab: DISCOVER)")
  }

  enum Tab {
    HOME
    READ
    WATCH
    PRAY
    CONNECT
  }
`;

export const followSchema = gql`
  extend type Mutation {
    requestFollow(followedPersonId: ID!): Follow

    ignoreFollowRequest(requestPersonId: ID!): Follow

    acceptFollowRequest(requestPersonId: ID!): Follow
  }

  extend type Query {
    followRequests: [Person] @cacheControl(scope: PRIVATE)
    usersFollowing: [Person] @cacheControl(scope: PRIVATE)
  }

  enum FollowState {
    REQUESTED
    DECLINED
    ACCEPTED
  }

  type Follow {
    id: ID
    state: FollowState
  }

  extend type Person {
    currentUserFollowing: Follow @cacheControl(scope: PRIVATE)
    followingCurrentUser: Follow @cacheControl(scope: PRIVATE)
  }

  type FollowPeopleFeature implements Feature & Node {
    id: ID!
    order: Int

    suggestedPeople: [Person]
  }
`;

export const commentSchema = gql`
  extend type Mutation {
    addComment(
      parentId: ID!
      text: String!
      visibility: CommentVisibility
    ): Comment

    updateComment(
      commentId: ID!
      text: String
      visibility: CommentVisibility
    ): Comment

    deleteComment(commentId: ID!): Boolean

    flagComment(commentId: ID!): Comment

    likeComment(commentId: ID!): Comment

    unlikeComment(commentId: ID!): Comment
  }

  type CommentListFeature implements Feature & Node {
    id: ID!
    order: Int
    comments: [Comment] @cacheControl(maxAge: 10)
  }

  type AddCommentFeature implements Feature & Node {
    id: ID!
    order: Int
    relatedNode: Node!
    addPrompt: String @deprecated(reason: "Use prompt")
    initialPrompt: String @deprecated(reason: "Use prompt")
    prompt: String
  }

  enum CommentVisibility {
    PUBLIC
    PRIVATE
    FOLLOWERS
  }

  type Comment implements Node & LikableNode {
    id: ID!

    person: Person
    text: String
    visibility: CommentVisibility
    isLiked: Boolean @cacheControl(scope: PRIVATE)
    likedCount: Int
  }
`;

export const eventSchema = gql`
  type Event implements Node & ContentNode {
    id: ID!
    title(hyphenated: Boolean): String
    htmlContent: String
    coverImage: ImageMedia

    location: String
    start: String
    end: String

    name: String @deprecated(reason: "Use title")
    description: String @deprecated(reason: "Use htmlContent")
    image: ImageMedia @deprecated(reason: "Use coverImage")
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
    isPrayed: Boolean @cacheControl(scope: PRIVATE)
  }

  type PrayerListFeature implements Feature & Node {
    id: ID!
    order: Int
    isCard: Boolean
    title: String
    subtitle: String
    prayers: [PrayerRequest]
  }

  type VerticalPrayerListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    prayers: [PrayerRequest]
  }

  extend type Mutation {
    addPrayer(text: String!, isAnonymous: Boolean): PrayerRequest
    reportPrayer(prayerId: ID!): PrayerRequest
  }

  extend enum InteractionAction {
    PRAY
  }

  extend type Person {
    prayers: [PrayerRequest]
  }
`;

export { extendForEachContentItemType };
