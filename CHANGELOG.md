v0.7.0: November 19, 2018

- Adds Apollo Data Connector Bible (#436) (545956da)
- Adds Rock content data connector (#432) (36a6a365)
- Fixes inconsistencies for Avatar Photo upload (#429) (924a8310)
- Adds Publishing to NPM via Release Script (#433) (6c4d11c0)
- Adds Data Connector People (#430) (a308db1d)
- Adds open source license, prepares for NPM releases, and upgrades React Native / fixes builds to do so (#431) (8793bb47)
- Adds Data Connector Analytics (#423) (41dfb3a3)
- Adds Auth Module (and sneak peak of Schema Module) (#417) (b3978f66)
- Adds `@apolloschurch/core-api` package (#414) (e22e5c90)
- Adds Content Channels Support to Apollos Config (#380) (b9c5f22a)
- Adds Apollos Config (#357) (bf1a23ff)
- Adds `PaginationInfo` and `pageInfo` to our schema (#360) (1d5d8a96)
- Adds new PR template to encourage better code reviews (#354) (4a72c771)
- Adds cloudinary (#342) (94896d76)
- Adds Devotional to Content (#322) (54b6c5c9)
- Updates ui components into separate @apollosproject/ui-kit package (#418) (337c3673)
- Updates bundle id for android (#362) (42454c72)
- Updates apollos rock data source folder location (#355) (221348eb)
- Renames @apolloschurch to @apollosproject (#415) (fdbb64fa)
- Polishes Profile fields based on QA Feedback (#401) (ca57b9b0)
- Polishes up the connect tab and user profile (#353) (fc697c95)
- Polishes navigation on the connect tab (#358) (e2c1637a)
- Polishes profile image uploading (#337) (1e958a1b)
- Fixes now deploys (#421) (73b1a5e5)
- Fixes nuke scripts to better remove `node_modules` folders (#419) (aa348d55)
- Fixes native button ripple on Android (#416) (1ef5278c)
- Fixes Recently Liked Feed (#363) (bd5749f8)
- Fixes icon shifting upward during app launch and spash screen. Icons now line up smoothly. (#389) (c16e1a2d)
- Fixes new package data source package not included in docker build (#359) (5683ea06)
- Fixes Android Like Button (#365) (920452ce)
- Fixes signup issue (#350) (45f455af)
- Fixes profile image in Cloudinary (#349) (3f318bbc)
- Fixes MediaControls styles (used on content views) (#344) (034211c7)
- Fixes Dockerfile, `yarn link`, and package naming (#361) (73041760)
- Fixes cache redirects - makes content show quicker (#346) (afc4c8fb)
- Removes kexec to fix docker builds (#413) (617951b8)
- Removes themes on the api side (temporary) (#343) (c97d7d99)

v0.6.0: October 18, 2018

- Adds Apollo engine setup (#333) (ede2801)
- Adds Storybook and Nuke lerna scripts (#332) (93747cc)
- Adds Initial Testing control panel (#326) (da105a8)
- Adds polish of home screen and content-single transitions (#313) (31cdb06)
- Adds copyright info to scripture (#328) (74979a1)
- Adds Push Notification Deep Linking (#321) (5b94891)
- Adds Devotional Component (#296) (d507881)
- Adds Change Password Mutation (#320) (cdb9a4e)
- Adds login flow when trying to like a piece of content while logged out (#305) (fa3c3e2)
- Adds tests over Family/Location API (#319) (6e6cea0)
- Adds One Signal push icon (#315) (d1771c8)
- Adds tracking for common events (#300) (396bcca)
- Adds round android app icon (#307) (1b0e1e2)
- Adds script to populate .env file variables from environment (#311) (a5f42af)
- Adds OneSignal support for Push Notifications (#291) (74bbe4a)
- Adds mutation to update multiple people fields at once (#299) (6b61e2a)
- Improves content single screens with design polish (#316) (1bb4fb9)
- Improves the ability to adjust to devices with Safe Area insets, such as notches on the iPhone X (#334) (ffebbb2)
- Improves scripture reading experience (#317) (1299440)
- Improves Media Player UI/UX (#306) (7dfbbd9)
- Improves the User Profile and Connect views (#318) (c88a859)
- Changes deploys to docker (#335) (df67bae)
- Changes Like component to make it reusable (#297) (7599513)
- Fixes comment in dockerfile (#336) (71f25d5)
- Fixes login form login button on Android devices from moving over input fields (#329) (856e136)
- Fixes android builds by removing duplicate launchMode def. (#314) (7a1fb67)
- Fixes release script so CHANGLOG.md users proper version (#303) (1846019)
- Fixes test code left in store/index (#302) (085bed2)
- Removes one signal extension (#312) (d3c7d46)

v0.5.0: September 19, 2018

- Adds Server Side Analytics Support (#263) (de7391e)
- Adds Rock as Analytics Interface (#292) (b132a39)
- Adds a GraphQL API to update user profile attributes (#260) (6dea512)
- Adds audio/video media player (#233) (374f326)
- Adds a protected action handler (#85) (#178) (86aab77)
- Adds Devotional Content Type / Adds ability to query scripture HTML from ContentItem (#255) (daca6c5)
- Adds Scripture Component (#235) (2a4397d)
- Adds complete API flow for Liking Content (#227) (c16277e)
- Adds ability to like a piece of content through an interaction Visually (#257) (8dd4ebb)
- Adds algorithm to parse interactions from a user and spit out all liked content from user (#261) (d9642ef)
- Adds GraphQL Sharing Type w/ Message/Title/URL (#232) (5a987aa)
- Removes step to review change-log from pr template. change-log is autogenerated by pr title now. (#293) (4a50b10)
- Fixes Root Queries to be inline in API (#262) (891e668)
- Fixes missing bracket in xcodeproj file builds work now! (#298) (b3e1c55)
- Fixes storybook for yarn workspaces (#245) (0e8e2ce)
- Fixes now deploys (#246) (3899d4e)
- Fixes auth header (#234) (1c43546)
- Fixes babel multi project config (#231) (dab1025)
- Fixes Importing of Request class fro ApolloEnv (#230) (c837d1c)
- Fixes appcenter to recognize yarn (#229) (eef06f0)
- Fixes yarn workspaces + clean native projects (#226) (9bacbd0)


v0.4.0: August 14, 2018

- Add ability to style content with colors from API (#173) (aca66fe)
- Add Inline Documentation (#220) (8c63f27)
- Add React Native Video Player (#198) (5e722a0)
- Add ability to watch videos in Content Views (#202) (b4ed305)
- Add fetch policies to improve data loading from server (#209) (96c952e)
- Add documentation for release creation (#204) (8ed145b)
- Add the ability to share individual pieces of content (#207) (a793c4a)
- Add Sibling Content Queries in API (#199) (0c43321)
- Add testing support for Apollo Datasources (#200) (4ba9556)
- Add individual devos to the home feed (#195) (ef3ba9b)
- Add Discover Feed (#197) (a7b73db)
- Add absolute local imports (#194) (fdf08f3)
- Add GraphQL schema for pulling ESV scripture html (#196) (8464db5)
- Update Rock Data Source to ApolloDataSourceREST (#214) (70fb407)
- Update content-item to be able to display sibling content items (#205) (303ad1e)
- Improve splashscreen dismissal (8adfb52)
- Remove dependency of API on parent folder structure (#210) (a02a601)
- Fix the `getLiveStream` query so that the LiveButton shows back up (#215) (9c45394)

v0.3.0:

- New look and feel for the authentication modal
- Added the ability to create an account from within the app
- User can now see their profile name and image from the connect screen
- User can now reset their password from the login screen

v0.2.0: July 17, 2018

- Created script to automate introspection fragment for client-side cache
- Added a static login form component with validation
- Ability to register through the api using an email and password
- Created individual content channel feeds
- Added horizontal scrollers and their associated tiles
- Implemented horizontal scrolling lists with content for the discover view
- Added content children to the individual content pages
- Added the ability to log errors to Sentry
- Added a stubbed out liveSteam query to determine when we are or not going to show the live bar
- Updated iPhone X splash screen size
- Upgraded typography components to use vertical rhythm for optional padded prop.
- Visual clean up of content styling.

v0.1.0: June 19, 2018

- The Initial Project Release
- Initial GraphQL server construction with People, Node, and Content Schemas
- Created a content feed home screen
- Created a live bar button that redirects to a web view displaying a Church Online stream
- Imported numerous reusable components
- Designed initial project deployment and release processes
- Added a version tool for quickly updating iOS and Android version numbers
- Created a static connect menu on the connect tab.
- Clean up tab headings to be more consistent
- Tweak styles on live now button
- add pull-to-refresh support on the home screen
- add material bottom tab bar
- Added the ability to tap on a home feed item and see it's content details
