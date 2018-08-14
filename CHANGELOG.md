
v0.4.0: August 14, 2018

- Add ability to style content with colors from API (#173) (aca66fe)
- Added Inline Documentation (#220) (8c63f27)
- 189 react-native-video (#198) (5e722a0)
- add media player client-side state (#202) (b4ed305)
- Convert Rock Data Source to ApolloDataSourceREST (#214) (70fb407)
- fix the `getLiveStream` query so that the LiveButton shows back up (#215) (9c45394)
- Designed GraphQL schema for pulling ESV scripture html (#196) (8464db5)
- Remove dependency of API on parent folder structure (#210) (a02a601)
- Add fetch policies to improve data loading from server (#209) (96c952e)
- added documentation for release creation (#204) (8ed145b)
- Add the ability to share individual pieces of content (#207) (a793c4a)
- updated content-item to be able to display sibling content items (#205) (303ad1e)
- Sibling Content api (#199) (0c43321)

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
