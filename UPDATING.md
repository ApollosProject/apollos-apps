# Updating from 1.4.1 to 1.4.2

These override names have changed and will need to be updated in order to work.

1. In ActionCard/index.js - `ActionCard.Actions` has been changed to `ui-kit.ActionCard.ActionCardActions`

2. In ActionList/.../ActionListImage.js

- `ui-kit.ActionListImage.CellImage` has been changed to `ui-kit.ActionList.ActionListItem.ActionListImage.CellImage`
- `ui-kit.ActionListImage.CellView'` has been changed to `ui-kit.ActionList.ActionListItem.ActionListImage.CellView`
- `ui-kit.ActionListImage.CellDate` has been changed to `ui-kit.ActionList.ActionListItem.ActionListImage.CellDate`
- `ui-kit.ActionListImage.CellMonth` has been changed to `ui-kit.ActionList.ActionListItem.ActionListImage.CellMonth`

3. In ActionListItem/index.js

- `ui-kit.ActionListItem.Label` has been changed to `ui-kit.ActionList.ActionListItem.Label`
- `ui-kit.ActionListItem.TextContainer` has been changed to `ui-kit.ActionList.ActionListItem.TextContainer`

4. In ActionListCard/.../ActionListImage.js

- `ui-kit.ActionListImage.CellImage` has been changed to `ui-kit.ActionListCard.ActionListItem.ActionListImage.CellImage`
- `ui-kit.ActionListImage.CellImage` has been changed to `ui-kit.ActionListCard.ActionListItem.ActionListImage.CellView`
- `ui-kit.ActionListImage.CellDate` has been changed to `ui-kit.ActionListCard.ActionListItem.ActionListImage.CellDate`
- `ui-kit.ActionListImage.CellMonth` has been changed to `ui-kit.ActionListCard.ActionListItem.ActionListImage.CellMonth`

5. In ActivityIndicator/index.js - `ActivityIndicator` has been changed to `ui-kit.ActivityIndicator`

6. In Avatar.js - `Avatar` has been changed to `ui-kit.Avatar.Avatar.Container`

7. In AvatarCloud/index.js

- `ui-kit.AvatarList.BlurWrapper` has been changed to `ui-kit.Avatar.AvatarCloud.BlurWrapper`
- `ui-kit.AvatarList.UserAvatar` has been changed to `ui-kit.Avatar.AvatarCloud.CenteredAvatar`
- `ui-kit.AvatarList.RandomAvatar` has been changed to `ui-kit.Avatar.AvatarCloud.RandomAvatar`
- `U` has been changed to `u`

8. In TouchableAvatar.android.js

- `ui-kit.AvatarList.TouchableAvatar.StyledAvatar` has been changed to `ui-kit.Avatar.AvatarList.TouchableAvatarAndroid.StyledAvatar`
- `ui-kit.AvatarList.TouchableAvatar.AndroidTouchableRippleFix` has been changed to `ui-kit.Avatar.AvatarList.TouchableAvatarAndroid.AndroidTouchableRippleFix`

9. In TouchableAvatar.ios.js - `ui-kit.AvatarList.TouchableAvatar.StyledAvatar` has been changed to `ui-kit.Avatar.AvatarList.TouchableAvatarIos.StyledAvatar`

10. In AvatarList/index.js

- `ui-kit.AvatarList.AddIcon` has been changed to `ui-kit.Avatar.AvatarList.AddIcon`
- `ui-kit.AvatarList.AddIconBackground` has been changed to `ui-kit.Avatar.AvatarList.AddIconBackground`
- `ui-kit.AvatarList.AndroidTouchableRippleFix` has been changed to `ui-kit.Avatar.AvatarList.AndroidTouchableRippleFix`
- `ui-kit.AvatarList.AvatarFeed` has been changed to `ui-kit.Avatar.AvatarList.AvatarFeed`

11. In Avatar/List.js - `Avatar.List` has been changed to `ui-kit.Avatar.List.AvatarList`

12. In Button/Button.js

- `Button` has been changed to `ui-kit.Button.ButtonStyles`
- `Button.Placeholder` has been changed to `ui-kit.Button.ButtonPlaceholder`

13. In Button/ButtonLink.js - `Button.Link` has been changed to `ui-kit.ButtonLink.ButtonLink`

14. In Card/Actions.js - `Card.Actions` has been changed to `ui-kit.Card.Actions.Actions`

15. In Card/Content.js - `Card.Content` has been changed to `ui-kit.Card.Content.Content`

16. In Card/Image.js - `Card.Image` has been changed to `ui-kit.Card.Image.Image`

17. In Card/Label.js - `ui-kit.CardLabel` has been changed to `ui-kit.Card.Label.StyledChip`

18. In Chip/List.js - `Chip.List` has been changed to `ui-kit.Chip.ChipList`

19. In Chip/index.js - `Chip` has been changed to `ui-kit.Chip.StyledButton`

20. In FlexedView/index.js - `FlexedView` has been changed to `ui-kit.FlexedView`

21. In PaddedView/index.js -`PaddedView` has been changed to `ui-kit.PaddedView`

22. In Placeholder/Line.js - `Placeholder.Line` has been changed to `ui-kit.Placeholder.Line`

23. In Placeholder/Media.js - `Placeholder.Media` has been changed to `ui-kit.Placeholder.Media`

24. In Placeholder/Paragraph.js - `Placeholder.Paragraph.line` has been changed to `ui-kit.Placeholder.Paragraph.ParagraphLine`

25. In Placeholder/Typography.js - `Placeholder.Typography` has been changed to `ui-kit.Placeholder.Typography`

26. In UIText/index.js - `UIText` has been changed to `ui-kit.UIText`

## Updating from 0.8.7 to 1.0.0

- OnboardingSwiper used to use `BackgroundView`, but it no longer does. If you want to maintain an identical visual experience, wrap your `OnboardingSwiper` in a `BackgroundView` from ui-kit.

## Updating from 0.8.0-alpha.9 to 0.8.0-alpha.10

This update introduces a major breaking schema in change in the `getAllLikedContent` content query. This change adds pagination to the result. Changes on the API are automatically integrated, but changes to the ReactNative project will need to be integrated automatically.

To integrate these changes, _copy and paste four files_ from the [master branch of apolloschurchapp](https://github.com/ApollosProject/apollos-prototype/tree/master/packages/apolloschurchapp).

1. [src/tabs/connect/LikedContentList/index.js](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apolloschurchapp/src/tabs/connect/LikedContentList/index.js)
2. [src/tabs/connect/RecentlyLikedTileFeed/RecentlyLikedTileFeedConnected.js](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apolloschurchapp/src/tabs/connect/RecentlyLikedTileFeed/RecentlyLikedTileFeedConnected.js)
3. [src/tabs/connect/getLikedContent.js](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apolloschurchapp/src/tabs/connect/getLikedContent.js)
4. [src/ui/LikeButton/updateLikedContent.js](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apolloschurchapp/src/ui/LikeButton/updateLikedContent.js)

If you have snapshots, you will need to update them after making changes. `yarn jest -u`.

## Updating from 0.8.0-alpha.4 to 0.8.0-alpha.5

### Updating Config

1. In Config.yml
   Replace

```
  CONTENT_ITEM_TYPES:
    - ContentItem
    - UniversalContentItem
    - DevotionalContentItem
    - MediaContentItem
```

With

```
  CONTENT_ITEM:
    ContentSeriesContentItem:
      # When resolving "ContentSeriesContentItem" look in rock for a "ContentChannelItem"
      EntityType: ContentChannelItem
      # Used to define the subset of content channels types that use this specific type.
      ContentChannelTypeId: [6, 7]
    DevotionalContentItem:
      EntityType: ContentChannelItem
      ContentChannelTypeId: [1]
    MediaContentItem:
      EntityType: ContentChannelItem
    UniversalContentItem:
      EntityType: ContentChannelItem
    ContentItem:
      EntityType: ContentChannelItem
```

Delete `SERIES_CONTENT_CHANNEL_TYPE_IDS:` and `DEVOTIONAL_TYPE_IDS:`

## Updating from 0.8.0-alpha.3 to 0.8.0-alpha.4

### Updating API

1. In `src/data/index.js`

- [ ] Remove `Interactions` import and delete folder `data/interactions`.
- [ ] Remove `RockConstants` import and delete `connectors` folder and all contents.
- [ ] Add below code to top of file

```
import {
  Followings,
  Interactions,
  RockConstants,
} from '@apollosproject/data-connector-rock-actions';
```

- [ ] Add `Followings,` to the data object.

2. In `package.json`

- [ ] Add `"@apollosproject/data-connector-rock-actions": "^0.8.0-alpha.X",` to your dependencies. (Replace X with latest release.)

### Updating Client

1. In `content-single/getContentItem.js`

- [ ] Add `likedCount` and `summary` to `contentItemFragment`.

2. In `src/ui/LikeButton/index.js`

- [ ] (line 33-35) Change `updateLikeEntity` prop of `Mutation` to

```
        id: itemId, // unknown at this time
        isLiked: !isLiked,
        __typename: item.__typename,
```

- [ ] (line 33-35) Change `updateLikeEntity: { operation },` into `updateLikeEntity: { isLiked: liked },`
- [ ] (line 53) Change `isLiked: operation === 'Like',` to `isLiked: liked,`

3. In `src/ui/LikeButton/updateLikeEntity.js`

- [ ] Add `isLiked` to the mutation result fields and remove `operation` and `interactionDateTime`

### Config

1. In config.yml

- [ ] Add `APP.DEEP_LINK_HOST` config field. This field is used for the protocol when deep linking. Leave blank if you don't know yet.

```
APP:
  # This variable is used for generating deep links.
  # It should match whatver is in your Info.plist `CFBundleURLTypes`
  DEEP_LINK_HOST: apolloschurchapp
```

- [ ] Add `CONTENT_ITEM_TYPES` to `ROCK_MAPPINGS`. This is used to reference all the different content item types. You should be safe to use the below as a default.

```
 CONTENT_ITEM_TYPES:
   - ContentItem
   - UniversalContentItem
   - DevotionalContentItem
   - MediaContentItem
```

- [ ] Add `INTERACTIONS` to `ROCK_MAPPINGS`. Change your values to match your team / project

```
  INTERACTIONS:
    # Name of the InteractionChannel that will be created
    CHANNEL_NAME: Apollos App
    # Name of the InteractionComponent that will be created for Content Items
    COMPONENT_NAME: Apollos Content Item
    # 512 is "Mobile App"
    CHANNEL_MEDIUM_TYPE_ID: 512
```
