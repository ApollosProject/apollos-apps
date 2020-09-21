# [The Apollos Project](https://apollosapp.io)

### [Visit the docs](https://apollosapp.io/docs/install)

## Develop

Install tools necessary

- [XCode](https://developer.apple.com/xcode/)
- [Yarn](https://yarnpkg.com/)
- [Bundler](https://bundler.io)

Install Dependencies

```
yarn
```

### Simple

For simple UI component development, you can use the Storybook app in the root directory by typing:

```
yarn storybook
```

This will boot generate stories from the different packages and surface them in a React Native app on an iPhone Simulator

### Advanced

For more advanced development, you will need to use our templates repo. This will allow you to spin a local version of the API and app.

#### from `apollos-apps`

Register the packages with `linkemon`

```
yarn link-packages
yarn start
```

#### from `apollos-templates`

Clone down the [templates](https://github.com/apollosproject/templates) repo and run through the quickstart to add all necessary environment variables.

Add reference in the app `.env` file. This step is necessary for `wml` to locate packages.

```
APOLLOS_APPS_LOCATION=../../apollos-apps
```

Link packages with `linkemon`

```
yarn link-packages
```

Run simply run `yarn start` to start up the server and app. If you need to unlink the local packages in the templates repo to test that NPM dependencies are working properly, run `yarn unlink-packages` from both the `apps` and `templates` repos.

## Publish

We publish to both the standard NPM registry and Github Packages. Follow these steps.

### NPM.js Registry

First add an .npmrc file to the root of this directory that looks like this:

```
//registry.npmjs.org/:_authToken=TOKEN
```

Replace `TOKEN` with an access token with publish rights from your NPM settings.

**_Don't commit this file!_**

You can do a release three different ways:

#### Canary (1.0.1-alpha.0)

```
yarn release:canary
```

Will bump the version for any packages that have changed using an `alpha` prerelease ID. Can be installed via:

```
yarn add @apollosproject/package@canary
```

#### Beta (1.1.0-beta.0 or 2.0.0-beta.0)

```
yarn release:beta
```

Installed via:

```
yarn add @apollosproject/package@next
```

#### Stable

```
yarn release
```

### GitHub Package Registry

Change your .npmrc file to this:

```
//npm.pkg.github.com/:_authToken=TOKEN
```

Get the `TOKEN` from creating a Personal Access Token in your Github settings and give it read/write access to packages.

Now run the same `yarn release:<XXX>` command you did before but add `--registry "https://npm.pkg.github.com"`
