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
- Campus

## Dependants / Dependencies

None, right now. This module is 100% standalone. However, modules within the `data-connector` might depend on each other. For example,

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
  Campus,
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
import gql from 'graphql-tag';
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

#### 4. Define your data source.

Finally, you'll want to extend the existing ContentItem dataSource, and add your new method to it. The body below is just pseudo-code, and is not guaranteed to work.
```
class GroupContentItem extends ContentItemDataSource {
  // because I am extending the ContentItem's data source, I have access to all the methods defined on that class.

  getContentItemsWithGroups() {
    return this.request().filter('GroupId ne Null').get();
  }
}

export { GroupContentItem as dataSource };

```

#### 5. Including your new Module.

Finally, back in `src/data/index.js` go ahead and import and include your new module.

```
// The import name is _very_ important. That will be the name of your dataSource.
import * as GroupContentItem from './group-content-item'

const data = {
  ...
  GroupContentItem,
  ...
}
```

Now your schema will have access to your new `contentItemsWithGroups` query. Congrats!

### Changing the behavior of existing fields.

Sometimes you may want to change the behavior of existing fields. For this example, we will override the firstName field of person so it always displays as all capital letters.


#### 1. Create a new module.
As before, this first thing you should do is create a new module, create a file/folder called `apollos-person/index.js`


```
import gql from graphql-tag;
import { People } from '@apollosproject/data-connector-rock';

const resolver = {};
```

#### 2. Define your overide.

We have a helper to enable safely overriding. You can import if from `@apollos/server-core`.

```
import gql from graphql-tag;
import { People } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

const resolver = resolverMerge({
  Person: {
    firstName: ({ firstName }) => firstName.toUpperCase()
  }
}, People);

// make sure to export your resolver as resolver.

export { resolver };
```

#### 3. Import your new module.

Naming this time isn't important because we don't have a data source.

```
import * as ApollosPerson from './apollos-person'

const data = {
  ...
  // make sure you put your override after the original person module.
  ApollosPerson,
}
```

#### Adding a new ContentItemType

Adding a new ContentItemType is a common operation, and we have some configuration tools to make it easier. Once you define your new ContentItem type's schema by extending the `ContentItem` GraphQL interface, add a new line to your `config.yml` in the RockMapppings -> ContentItem section. For example, if we knew that all of our GroupContentItem's referenced above had a content channel id of 27, we could add this to our config.yml in the RockMappings section.

```
    GroupContentItem:
      EntityType: ContentChannelItem
      ContentChannelTypeId: [27]
```

If determining the `ContentItem` type is more complex than something like` ContentChannelTypeId`, you'll need to override the `__resolveType` function on the `ContentItem` resolver.

### F.A.Q

#### Q: How do I figure out what methods are on X data source?

Look at the code :D. It's easier than you would imagine to read, really!

#### Q: Okay, I looked at the code. What is this `request()..` thing I keep seeing.

That's a module called RequestBuilder. You can find more info about it in `@apollosproject/rock-apollo-data-source`.

#### Q: I have another question that's not answered here.

That's okay :) Open an issue with your question and we'll do our best to answer it.
