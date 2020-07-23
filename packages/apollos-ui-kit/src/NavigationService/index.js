import { StackActions, NavigationActions } from 'react-navigation';

let _navigator;
let _pendingActions = [];

const getNavigator = () => _navigator;

const performWhenReady = (func) => (...args) => {
  if (_navigator) {
    func(...args);
  } else {
    _pendingActions.push(() => func(...args));
  }
};

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
  if (_pendingActions.length > 0) {
    _pendingActions.forEach((action) => action());
  }
  _pendingActions = [];
};

const navigate = performWhenReady((routeName, params) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
});

const dispatch = (...args) => {
  _navigator.dispatch(...args);
};

const resetToAuth = performWhenReady(() => {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'Auth',
          action: NavigationActions.navigate({
            routeName: 'AuthSMSPhoneEntryConnected',
          }),
        }),
      ],
    })
  );
});

const resetAction = ({ navigatorName, routeName }) =>
  StackActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({
        routeName: navigatorName,
        action: NavigationActions.navigate({
          routeName,
        }),
      }),
    ],
  });

const goBack = performWhenReady((from) => {
  let key;
  if (from) {
    const route = _navigator.state.nav.routes.find((r) => r.routeName === from);
    if (route) ({ key } = route);
  }
  _navigator.dispatch(NavigationActions.back({ key }));
});

export default {
  setTopLevelNavigator,
  navigate,
  dispatch,
  goBack,
  resetToAuth,
  resetAction,
  getNavigator,
};
