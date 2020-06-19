create-apollos-app
==================

Easily create an apollos project

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/create-apollos-app.svg)](https://npmjs.org/package/create-apollos-app)
[![Downloads/week](https://img.shields.io/npm/dw/create-apollos-app.svg)](https://npmjs.org/package/create-apollos-app)
[![License](https://img.shields.io/npm/l/create-apollos-app.svg)](https://github.com/ApollosProject/apollos-apps/blob/master/package.json)

# Usage
```
yarn create apollos-app <NAME> <FLAGS>
```

Basic usage looks like this:

```
yarn create apollos-app myapp
cd my-app
yarn start

// view in ios
yarn ios

// view in android
yarn android
```

# Command Arguments

`NAME`: The name of your project

# Command Flags
-b, --bundleIdentifier=bundleIdentifier              The bundle identifier to use for your iOS app
-c, --core                                           Set to true if you're developing core components
-d, --dir=dir                                        [default: .] The directory where you want your project relative to your current working directory
-g, --debug
-h, --help                                           show CLI help
-l, --coreComponentsLocation=coreComponentsLocation  The location for your components (the apollos-apps repo). If you already cloned apollos-apps make sure to point this at your clone
-n, --appName=appName                                [default: $name] The name to use for your app, this will be displayed
-r, --release=release                                [default: latest] The release you want to use for your project
-v, --version                                        show CLI version
