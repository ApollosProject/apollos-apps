# `@apollosproject/data-connector-postgres`

Provides a data-connector to manage and read/write data stored in postgres (or potentially other SQL databases)


## Setup

Models can be created by calling and exporting `defineModel` function, and then optionally by calling and exporting the `configureModel` function. The `defineModel` is used to setup the schema of your database model, while the `configureModel` function can be used to setup relationships between other models (ie: defining foreign keys). These are two seperate functions so that circular import issues caused by models needing to import each other can be avoided. Below is an example of a `models.js` file. 

```
// model.js

import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'content_item',
  attributes: {
    title: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    coverImageUrl: DataTypes.STRING,
    publishedAt: DataTypes.DATE,
    htmlContent: DataTypes.TEXT,
  },
  external: true,
});

const setupModel = configureModel(({ sequelize }) => {
  // eslint-disable-next-line camelcase
  const { content_item, media } = sequelize.models;
  content_item.hasMany(media, {
    foreignKey: 'mediableId',
    constraints: false,
    scope: {
      mediableType: 'content_item',
    },
  });
  media.belongsTo(content_item, {
    foreignKey: 'mediableId',
    constraints: false,
  });

  content_item.belongsTo(media, {
    scope: { mediableType: 'image' },
    foreignKey: 'coverImageId',
    as: 'coverImage',
  });

  content_item.belongsTo(content_item, {
    foreignKey: 'parentId',
    as: 'parent',
    constraints: false,
  });

  content_item.hasMany(content_item, {
    foreignKey: 'parentId',
    as: 'children',
    constraints: false,
  });
});

export { createModel, setupModel };
```

```
// index.js
export * as models from './model';
```


And then in your `dataSource`

```
import ApollosConfig from '@apollosproject/config';
import { PostgresDataSource } from '../postgres';

export default class ContentItem extends PostgresDataSource {
  initialize(...args) {
    super.initialize(...args);
    this.model = this.sequelize.models.content_item;
  }
}
```

## Usage

You can use the postgres datasource like you would any other Datasource. In order for your schema to updated to match the config you have created in your models, you'll need to sync. The easiest way to do that is import `sync` from `@apollosproject/data-connector-postgres` and call it on app boot.