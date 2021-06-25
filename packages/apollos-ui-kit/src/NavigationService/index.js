import { CommonActions } from '@react-navigation/native';

let _navigator;
let _ready = false;
let _pendingActions = [];

const getNavigator = () => _navigator;

const performWhenReady = (func) => (...args) => {
  console.warn('NavigationService is deprecated.');
  if (_navigator && _ready) {
    func(...args);
  } else {
    _pendingActions.push(() => func(...args));
  }
};

const setTopLevelNavigator = (navigatorRef) => {
  console.warn('NavigationService is deprecated.');
  _navigator = navigatorRef;
  if (_pendingActions.length > 0 && _ready) {
    _pendingActions.forEach((action) => action());
    _pendingActions = [];
  }
};

const setIsReady = () => {
  console.warn('NavigationService is deprecated.');
  _ready = true;
  if (_pendingActions.length > 0 && _navigator) {
    _pendingActions.forEach((action) => action());
    _pendingActions = [];
  }
};

const navigate = performWhenReady((...args) => {
  console.warn('NavigationService is deprecated.');
  _navigator.navigate(...args);
});

const dispatch = (...args) => {
  console.warn('NavigationService is deprecated.');
  _navigator.dispatch(...args);
};

const resetToAuth = performWhenReady(() => {
  console.warn('NavigationService is deprecated.');
  _navigator.reset({
    index: 0,
    routes: [{ name: 'Auth', params: { screen: 'Identity' } }],
  });
});

const resetAction = ({ navigatorName, routeName }) =>
  console.warn('NavigationService is deprecated.') ||
  CommonActions.reset({
    index: 0,
    routes: [{ name: navigatorName, params: { screen: routeName } }],
  });

const goBack = performWhenReady((from) => {
  console.warn('NavigationService is deprecated.');
  let key;
  if (from) {
    const route = _navigator.state.nav.routes.find((r) => r.routeName === from);
    if (route) ({ key } = route);
  }
  _navigator.dispatch(CommonActions.back({ key }));
});

export default {
  setTopLevelNavigator,
  navigate,
  dispatch,
  goBack,
  resetToAuth,
  resetAction,
  getNavigator,
  setIsReady,
};
