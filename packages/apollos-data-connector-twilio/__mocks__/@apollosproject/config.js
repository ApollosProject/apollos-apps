const ApollosConfig = require.requireActual('@apollosproject/config').default;

ApollosConfig.loadJs({
  TWILIO: {
    ACCOUNT_SID: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    AUTH_TOKEN: 'SOME_AUTH_TOKEN',
    FROM_NUMBER: '+15133112113',
  },
});

export default ApollosConfig;
