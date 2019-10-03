# `@apollosproject/data-connector-twilio`

Provides a connector to Twilio for sending SMS messages.

## Dependants / Dependencies

Required by
- `AuthSms` in `@apollosproject/data-connector-rock`

## Usage

In your `src/data/index`,

```
import * as Sms from '@apollosproject/data-connector-twilio'

...

const data = {
  ...
  Sms,
  ...
}
```

## Overriding

Any package that seeks to replace this functionality can do so by defining a single method inside an Sms datasource. The method name is `sendSms` and the argument signature is `{ String: to, String: from (default should be provided), String: body }`.