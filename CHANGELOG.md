
v1.2.0-beta.0: September 25, 2019

- Adds Groups Functionality to API (#939) (b0913abd)
- Adds Search indexing and Job Queue (#1062) (7218ad9f)
- Adds spacing to miniplayer controls (#1036) (7b11760a)
- Adds search to Discover tab (#1044) (58b7f823)
- Adds action list feed feature for upcoming events (#1059) (80f11156)
- Uses apollos plugin to fix max node issues (#1049) (da61db16)
- Adds Algolia Search (#1037) (eccd30b5)
- Adds Search input component (#1017) (c8e1590f)
- Adds Apollos Plugin Integration (#1021) (00e0fe05)
- Allows Username Login (#997) (68718e8e)
- Adds Events to API (#1015) (a4323d7a)
- Adds numColumns={1} prop to fix ipad. fixes #846 (#1000) (d8308b6b)

- Updates Development to iPhone 11 Sim (#1066) (7348511b)
- Installs Pods Automatically (#1051) (1a97ca2a)
- Improves In App Browser and Chrome Custom Tabs (#972) (0761d53a)
- Adjusts Scripture Padding and Legal Text Logic (#1058) (1a4f40a6)
- Improves testing coverage and performance. (#1057) (67064f79)
- Updates Tab Header Colors (#1043) (8baf7686)
- Bumps lodash-es from 4.17.11 to 4.17.15 (#1050) (4d7b1b8c)
- Removes unneeded FeedView padding (#1042) (10540ced)
- Moves Xcode schemas into workspace (#1048) (27a739ab)
- Updates Cocoapods to 1.7.5 (#1047) (ac855c14)
- Upgrades to React Native 60 (#1020) (410abe40)
- Configures tests to only run story generation when actually publishing (#1039) (58106855)
- Improves Header Contrast (#1035) (be58bab9)
- Bumps mixin-deep from 1.3.1 to 1.3.2 (#1027) (748c0acd)

- Fixes MiniPlayer Safe View (#1034) (c959524e)
- Fixes Lint Error (#1056) (c3258ea0)
- Fixes 20+ Content Children Issue (#1054) (7a5ca1fa)
- Fixes phone entry keyboard covering link (#1055) (64709289)
- Fixes onesignal pod not installing (#1046) (3834a1da)
- Fixes Highlight Play Icon (#1038) (b3c9cff3)
- Fixes calling removed function (#1040) (ad0faf0b)
- Fixes like icon positioning for horizontal cards (#998) (7f5d141e)
- Fixes User Location View (#1001) (da064f4c)
- Fixes bug where sermon algorithm would return an error if current sermon had no children (#1016) (50e5e7fa)

v1.1.0: August 14, 2019

- Adds Android VerticalOffset (#916) (bfe41919)
- Adds `<HorizontalContentCard />` on Content Item children+siblings (#993) (8c2da0e9)
- Adds New Connect tab styles (#979) (62f63a4b)
- Adds BackgroundView back to onboarding (#988) (776c1c36)
- Adds Sharable Features (#976) (0a7868b7)
- Adds HorizontalContentCardConnected and Component prop to ContentCardConnected (#967) (19c82601)

- Moves configuration of bulletin list into config.yml (#987) (0a2092e6)
- Refactors code into a Features component for the home feed (#990) (aa05d922)
- Refactors Share Buttons (#935) (ba0dd2e8)
- Updates React Navigation to v3 (#820) (df4669f6)
- Updates Content single styles (#928) (f0c17b2f)
- Updates package.json (#977) (88f6b35a)

- Fixes ios build (#991) (1413d400)
- Fixes Location Finder Buttons (#891) (e1b01c08)
- Fixes PassKit label color (#989) (92011c31)
- Fixes play button spacing and title overflow on miniplayer (#982) (49a73ef2)
- Fixes liked content feed rendering the wrong cards (#992) (cae538b1)
- Fixes using first instead of top in sermon children algorithm (#978) (edee17be)


v1.1.0-beta.3: August 5, 2019

- Adds HorizontalDefaultCard (#965) (6a6778ed)
- Adds Sharing to the Scripture Feature (#968) (e829ef6b)
- Adds DefaultCard and deprecates ContentCard (#961) (dbda2f5b)
- Adds navigation to auth when logging out (#963) (df207128)

- Simplifies Feature Content Sources (#966) (2b8d414a)

- Fixes wrong campus being selected under certain conditions (#962) (76a0eed1)
- Fixes wrong birthdate showing up in the datepicker. (#969) (0f9d37ca)
- Fixes Back/Close doing the same thing inside devotionals (#970) (3a653a71)
- Fixes not being able to reach logout button on small screen sizes (#971) (b5b9e740)
- Fixes ui-passes image alignment (#960) (4956a8e6)
- Fixes sharing text feature (#938) (f0de6c9a)
- Logs User Out on Auth Error (#927) (9aa3c6ab)
- Changes Image sizes and update snaps (#920) (4fa1eae6)


v1.1.0-beta.2: July 29, 2019

- Adds `<OverlayBackgroundImage />` component (#908) (62e032dc)
- Adds Tests over App Utils Functions (#918) (0ec04720)
- Adds HorizontalHighlightCard (#930) (128af881)
- Adds 100% Coverage for User Web Browser (#921) (f4879a25)
- Adds BodySmall component (#922) (aabfd53c)
- Standardizes FeaturedCard, HighlightCard, and ContentCard prop naming (#929) (11607f7b)

v1.1.0-beta.1: July 29, 2019

- Adds ScriptureFeature to ContentItem feature (#923) (8e01aa1a)
- Adds <StretchyView /> component (#907) (3d40b210)
- Adds Token Check (#924) (54d91ff6)
- Adds Check Against Short Content Summaries (#912) (e41ab54b)
- Adds 100% Coverage to Share Function (#917) (3a400698)
- Adds scripture story for ActionCard (#896) (bd67a5a4)
- Adds Highlight Card (#872) (e4054712)
- Adds 100% Test Coverage to Config Package (#915) (2171230b)
- Adds algorithm to ActionListCard to view content from the sermon throughout the week. (#886) (92d83e92)
- Adds ability to customize gradient (#873) (695054b7)
- Adds support for scripture to function as a 'node' (#883) (d07acdab)
- Adds FeaturedCard component (#867) (0b9317ee)

- Upgrades to RN 0.59.10 (#925) (4acb5c83)
- Updates core Chip component styles (#881) (40b3e3b8)
- Removes Unneccesary Native Code (#902) (eaeed22b)

- Fixes minor bugs in CardWrapper component (#910) (1e4260b8)
- Fixes Poor Loading Content UI (#903) (c3436ce5)
- Fixes CardWrapper and Icon loading states (#893) (f0a0728c)
- Fixes Auth issues (#888) (5bfd3450)
- Fixes action list features having the same id (#885) (ffc2b452)


v1.1.0-beta.0: July 16, 2019

- Adds ability for Text Feature to use KeyValue attribute in Rock (#871) (9a47953e)
- Adds utility to handle rock key/value attribute (#870) (48499d51)
- Adds Safety Checks to Request Filters (#866) (932fac9b)
- Adds support for custom VideoWindow component and disabling of toggle controls on MediaPlayer (#865) (a4088041)
- Adds `minAspectRatio` and `maxAspectRatio` support to ConnectedImage (#862) (d056ff53)
- Adds "Open Livestream" Capability to the MediaControls (#857) (c6a7b4ee)
- Adds support for 64-bit Android build (#864) (abcc4d4c)
- Adds text feature (#847) (fe8c3cb2)
- Adds API support for content items to have livestreams (#848) (5e15830f)
- Adds <ActionCard /> component (#834) (2ffe6e2c)
- Adds support for stripping illegal markup from htmlview (#842) (cde3b60b)
- Adds ActionList on the Home feed driven by a Rock content channel. (#830) (f295ff95)
- Adds TextFeature resolver/schema/dataSource (#833) (afbdb850)
- Adds ActionList algorithm driven by a content channel (#828) (62b9f9e2)

- Bumps lodash from 4.17.11 to 4.17.13 (#868) (93c721fa)
- Bumps lodash.mergewith from 4.6.1 to 4.6.2 (#860) (e31adfeb)
- Bumps lodash.template from 4.4.0 to 4.5.0 (#861) (5409b010)

- Fixes Android Campus Card Shadow (#835) (1ee755ba)
- Fixes publish of packages that had 0 changes in 1.0 (#832) (75dd28ba)

- Deletes unused schema.graphql file (#836) (7a6431cb)


v1.0.0: June 27, 2019

- Adds Today Actions with Persona Feed algorithm (#816) (4ae0646e)
- Adds Onboarding Test Coverage (#826) (cea568f8)
- Adds Willow Required Onboarding Changes (#784) (67a6e6a3)
- Adds Features boilerplate schema/resolvers/datasource (#813) (b4f18cf9)
- Adds additional android permission back to fix android crash on video play (#794) (cbb54843)
- Adds Component prop to ConnectedComponents in Onboarding (#775) (5e24467b)

- Sets new phone numbers in SMS Auth as Mobile phone numbers (#825) (b1debf76)
- Refactors UI Auth package to be more customizable and modular (#788) (d7b36549)
- Redesigns Android Location Markers (#822) (036a8263)
- Updates onesignal (#818) (18269c3c)
- Updates Device Info Package (#799) (0e6f6e9c)
- Updates all queries to use apollo naming standards (#789) (d2409f72)
- Corrects the coordinates being sent to LocationFinder query (#762) (75d245e6)

- Fixes logging in a user if their phone number has multiple users (#786) (194979b7)
- Fixes rock-apollo-datasource null bug (#812) (90fe9b27)
- Fixed not being able to close the check in screen (#810) (7988de29)
- Fixes Parent Image Algorithm (#805) (0d526a46)
- Fixes Save Button to Follow Keyboard (#791) (69c62fe4)
- Fixes version of PassKit node module (#797) (40b63f21)
- Remove required flag from certain schema attributes (#787) (50656d95)
- Fixes Google Maps Issue (#772) (19dcc745)\

v1.0.0-beta.0: June 7, 2019

- Adds GraphQL Schema Diff and Linting (#759) (48ae33d7)
- Sets storybook npm access to public (#763) (31640458)

v0.8.7: June 4, 2019

- Adds UI Notifications Package (#754) (7faac895)
- Adds custom theme scaffolding (#742) (262a30a2)
- Adds fetchMoreResolver and working pagination (#756) (11bb9a01)
- Adds custom icon support (#735) (55cb01c2)
- Adds smarter resetting of Apollo Cache (#743) (cfb881ff)
- Adds analytics over Onboarding Scenes (#709) (44f71f4d)
- Adds Doc Site to README (#750) (6c4fb1c6)
- Adds Scripture Package (#544) (200d982e)
- Adds MediaPlayer package (#543) (318ffbcc)
- Adds filtering out of inactive campuses in the Campus datasource (#725) (a92e4e37)
- Adds documentation around steps to unlock Rock getCurrentPerson endpoint (#748) (2236fd81)
- Adds tap functionality for Campaign Cards (#719) (78e894c4)
- Adds storybook files with NPM release (#715) (3a1addb2)
- Adds church online URL configurablity (#717) (d5071139)

- Upgrades to RN 59 (#738) (e3af49aa)
- Updates Liked Count on Home Feed (#730) (aa0231a7)
- Renames mergeSchema into the more accurate mergeResolvers (#760) (b8bd92fe)
- Cleans up dependencies (#736) (c1ef9243)
- Cleans up Project package.jsons (#720) (b40db5c8)
- Removes KeyboardAwareScrollView Package (#741) (df7601e8)

- Fixes Avatar Margin (#751) (1d645f38)
- Fixes Docs Sidebar Table of Contents (#745) (00334716)
- Fixes Travis Docs Deploy (#724) (c2e66d00)
- Fixes Bible.api so it will handle both data.passages and data (#737) (5961a080)
- Fixes close button navigating back too far (#727) (9a122671)
- Fixes software keyboard in storybook (#734) (bb0412c9)
- Fixes Android Navigation Header (#728) (e27bbf2a)
- Fixes Liked Content Feed not populating on first like. (#732) (08aee402)
- Fixes typo in PhoneEntry.js (#721) (3028cb4e)
- Fixes GetPersonById not returning Photo (#723) (0954a617)
- Fixes Content Items back redirecting to Onboarding (#698) (0a9bbf8e)

v0.8.6: May 14, 2019

- Adds Storybook as an NPM package (#683) (6fc05ad1)
- Adds binary files datasource (#699) (1f04d21f)
- Adds Apollos.json to help improve upgrade tool. (#696) (6fa6c530)
- Adds strategy for canary releases (#703) (348f279a)

- Updates bible.api usage to match current practices (#708) (32312d19)

- Fixes personal devices post by providing required rock field (#706) (c1784acb)
- Fixes Travis deploy script, deploy script arg can only take a single command (#707) (ae305ce8)
- Fixes appcenter by running story build task (#701) (2757b73f)
- Fixes null scripture crash and devotional tests. (#684) (f699db78)


v0.8.5: May 8, 2019

- Adds onboarding package (#678) (08c423b4)
- Fixes email field rendering as [Object object] for sms users (#623) (82041a21)


v0.8.4: May 2, 2019

- Adds featured content in home feed (#603) (bb05dc92)
- Adds Script to Debug Travis (#663) (ad5cc98a)
- Adds Text Input Underline Option (#630) (9425128a)
- Updates Several RN Packages (#660) (702b6599)
- Updates README.md with typo fix (#669) (16df16a7)
- Cleans up and fixes lots of UI/UX related Onboarding issues (#640) (b07ca864)
- Fixed test and snapshot scheduled to fail after a year (#666) (37abc08b)
- Removes Avatar Margin (#667) (2a27ed41)
- Removes Custom Tabs (#661) (7e6644f8)
- Removes react-native-custom-tabs on ios (#671) (efc02f85)

v0.8.3: April 25, 2019

- Adds Script to Generate Component Docs (#601) (a7b5fb54)
- Adds Static iOS Launch Images (#624) (b2ca824e)
- Removes warning from onboarding (#653) (33d1bcc7)
- Simplifies Switch and Fixes Warnings (#628) (56c81a2a)
- v0.8.2 (#643) (4c1ce053)


v0.8.2: April 17, 2019

- Fixs Chip component prop warning that was noticed on onboarding (#639) (84e4a1ea)
- Fixes UX for when users finish onboarding (#637) (70beb296)
- disable default notifications prompt (#638) (ec306b6b)
- Add Prayer Icon (#632) (9248fbd7)
- Upgrades Formik (#633) (050f9e27)
- Updated the passkit package to latest version (#627) (0f2a17b2)
- Adds OnBoarding LocationFinder Screens (#598) (1dc4bcea)
- Adds SMS Auth UI (#591) (18bda067)
- Updates Android color variable names to be more generic (#618) (5345ca62)
- Fixes date picker being unusable for users with null dates (#622) (ce4c5399)
- Adds routing from Auth -> Onboarding -> Home (#621) (0afd5089)
- [OnBoarding] Adds Connected AboutYou Component (#613) (88de0638)
- Adds `AuthLoadingSwitch` to Navigate different directions, depending on if a user is logged in. (#615) (4655403d)
- Fixes Live Content Timezones (#611) (10609dcd)
- Adds ConnectedAskName Components to Onboarding (#612) (51324c79)
- Makes Android Development Smoother (#586) (3c09b69b)
- Creates new personalize component for home feed. (#596) (e7a4720f)
- Adds Analytics UI Package (#604) (62d06122)
- add new issue templates (#608) (35c28751)
- v0.8.1 (#607) (678c7891)


v0.8.1: March 25, 2019

- Adds Onboarding About You Screen (#581) (756d540d)
- Adds UI Auth package (#576) (ac64f9e8)
- Adds testing control panel access to onboarding (#599) (80eb0349)
- Adds Radio Exports, Tests, and Stories (#597) (93908dfc)
- Adds Onboarding "Features" Screen (#580) (9db71fe5)
- Adds App Splash Screen (#579) (19ed0a76)
- Adds MapView Component (#527) (a5449d66)
- Adds Person dataSource method to getViaAliasId w/ tests (#595) (f7d73f04)
- Adds Onboarding notifications screen (#578) (9c2505cc)
- Adds support for Node to use Interface's DataModel instead of relying on Aliases (#585) (269e2926)
- Adds Pagination w/ First and Limit support to the getLikedContent (#568) (a586294e)

- Fixes profile after updating location (#605) (b115456e)
- Fixes mounting graphql at root to fix pass generation (#600) (b392ad59)
- Fixes ButtonIcon to support style prop (#547) (34fc51d4)
- Fixes accessing a person's field by non-current person (#587) (da9fc161)
- Fixes user campus not returning location (#584) (4ca7b3fb)

- Upgrades React Native (#572) (7ad160da)


v0.8.0: March 6, 2019

- Adds API for getting / updating current campus (#577) (5257f595)
- Adds Person Birth Date (#575) (ade8d716)
- Adds HTMLView package (#541) (79b17838)
- Adds Gender in Person API (#574) (5571a916)
- Adds Onboarding Scaffold (#536) (e4d4b06c)
- Adds PersonaFeed query [Personalize Content] (#528) (47298627)
- Adds readme for OneSignal package (#542) (d458fd20)
- Adds `campuses` schema and rock-connector (#538) (e0da820c)
- Adds Passes UI (#533) (8a0305e0)
- Adds Terraform Config (#513) (7f1a9204)
- Adds Rock Package Readme (#537) (da8d01f8)
- Adds Sms Login API (#534) (82f9a4d8)
- Adds props support to BackgroundView (#524) (fb5821b4)
- Adds Rock Request logging extension to apollo-datasource-rock (#511) (56478589)
- Adds Authenticated WebViews (#508) (51e9dbb7)
- Adds Passes GraphQL schema, template generation, and a REST endpoint to download pkpass files (#504) (4d346a1d)
- Adds deep schema merge tool (#510) (bd2392c6)
- Adds proper CDN url in prod (#509) (b2b415d3)
- Adds ability to run yarn ios and yarn android from project root (#507) (c824a868)
- Adds Fastly CDN and Data Caching (#502) (86731ea4)
- Adds react-native-config instead of react-native-dotenv (#491) (c7f1b380)
- Adds PersonalDevices dataSource and attaches PersonalDevices to OneSignal. (#482) (75405724)
- Adds OneSignal pushId reporting to Apollos App (#478) (b1403f74)
- Adds "Upload Push ID" Mutation (#477) (82740ade)
- Adds configurable Content Items (#463) (56d7330d)
- Adds filters for active in content items data source (#465) (f76ced85)
- Adds Scripture API Multiple Verse Support (#466) (589e9fcc)
- Adds Airplay Implementation (#422) (bd74e311)
- Adds all Rock Classes into single Rock Package (#462) (fbefd7f4)
- Adds Parallellized postinstall build command 💥🚀 (#460) (367acf87)
- Adds church online connector (#440) (502704f0)
- Adds Cloudinary / Media resolver packages (#446) (1961eb45)
- Adds nested navigation to Content Single screens (#364) (f2f3d232)
- Adds Like/Unlike using Following rock table (#458) (2e3f9214)
- Adds TestUtils to be used by all package test suites (#457) (017c0d9b)
- Adds more media player UI/UX polish and improves tappability (#420) (579dc079)
- Adds heroku.yml for Heroku deploys (#445) (6f9cfda9)
- Adds a new Card component and visual design for cards across the app (#323) (b20deb08)

- Polishes UI/UX for Discover and Profile tabs (#442) (3fd4664c)
- Polishes StatusBar appearance when MediaPlayer is fullscreen (#373) (7d9f018a)

- Removes People (by email) Query (#582) (7a1d9e03)
- Removes the validation requirement to select save button (#479) (dcac74d4)

- Fixes filter error when content item has no images and no parents with images (#570) (db5c4757)
- Fixes apollo server mounted on root path (#569) (4c2cee6d)
- Fixes packing up ui-passes into server docker image (#540) (a711067a)
- Fixes for Storybook to work in packaged monorepo (f1c16763)
- Fixes up Content Item Code (#506) (c0488599)
- Fixes timezone of dates sent to rock when filtering content items (#488) (2244b92c)
- Fixes missing content when content is not expired  (#475) (8d700b00)
- Fixes Unseen Content Like Button Crash (#464) (e68d1f6c)
- Fixes MISC UI issues discovered while working on Willow Creek prototype (#441) (d7c9086d)
- Fixes summary field throwing an error when no description (#456) (1d3757d7)
- Fixes styles so that auth inputs are not hidden behind the keyboard (#447) (f7ced4ea)
- Fixes Series Trailers not playing after Logout (#454) (bdc3f694)
- Fixes an issue from a bad merge on content single navigation (#455) (81385b99)
- Fixes nodemon version in client (#452) (6c042113)
- Fixes theme mixins (#449) (316b2ce2)
- Fixes nodemon version to remove flatmap-stream dep (#451) (e1782690)
- Fixes sharing message and android sharing (#428) (afd9e259)
- Fixes Empty Scripture Tab (#427) (a062ac79)
- Fixes deploys (#439) (5225a222)

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
