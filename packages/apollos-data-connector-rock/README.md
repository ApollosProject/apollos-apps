# `@apollosproject/data-connector-rock`

Provides a connector to Rock for the following parts of the app

- Auth
- ContentItems
- ContentChannels
- Family
- Followings
- Interactions
- People
- PersonalDevices
- RockConstants
- Shareable
- Template

## Dependants / Dependencies

None, right now. This module is 100% standalone. However, several modules internally require other modules internally. For example,

- `People` and `Family` modules rely on the `Auth` module.
- `Followings` and `Interactions` relies on `RockConstants`.


## Usage

In your `src/data/index`,

```
import {
  Followings,
  Interactions,
  RockConstants,
  Family,
  Person,
  ContentItem,
  ContentChannel,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
} from '@apollosproject/data-connector-rock';
import * as Theme from './theme';

...

const data = {
  ...
  Followings,
  Interactions,
  RockConstants,
  Family,
  Person,
  ContentItem,
  ContentChannel,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
  ...
}
```

The naming of each of the modules is important.

## Overriding

Overriding can be performed in a number of ways, depending on your goals when overriding. There are a few specific types of overriding default behavior that I will cover below.

### Adding _new_ fields to the schema.

Adding new fields to the schema is a three part process. The process differs depending on if you're adding a new root `query` or if you're changing an existing type. Only the process for overriding a root query will be covered, but the process for adding a field to a type is very similar. Take note that these changes are _not_ specific to the `data-connector-rock` module, but you may find yourself overriding this module more than other modules.

#### 1. Create a new module.

Inside the `src/data/` directory of the API, create a new folder named after your new model. For this example, will pretend we are adding a new query to find ContentItems that have groups attached, so we will create a folder named `group-content-item` and a file called `index.js` within that folder. For now, that file will look something like this.

```
import gql from graphql-tag;
import { ContentItem } from '@apollosproject/data-connector-rock';

const ContentItemDataSource = ContentItem.dataSource;

const schema = gql``;
const resolver = {};
const dataSource = ContentItemDataSource;
```

Every new module should export any/all of these three variables. The naming is important, the export schema should always be `schema`, resolver should be `resolver`, and the dataSource class should be `dataSource`. You don't need to export all three if you aren't defining all three.

#### 2. Extend the schema for your new query

Thanks to new syntax in the GraphQL schema langauge, adding a new query is really easy. Inside the file you already created, make the following changes

```
const schema = gql`
extend type Query {
  contentItemsWithGroups: [ContentItem]
}
`;
```

#### 3. Add a resolver for your new query

Now you need to add a field to the root resolver object to actually fetch your data. You'll need to do something like:

```
const resolver = {
  Query: {
    contentItemsWithGroups: (root, args, { dataSources: { GroupContentItem } }) => GroupContentItem.getContentItemsWithGroups(),
  }
}
```

#### Define your data source.

Finally, you'll want to extend your


