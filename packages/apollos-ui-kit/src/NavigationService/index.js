import { CommonActions } from '@react-navigation/native';

let _navigator;
let _ready = false;
let _pendingActions = [];

const getNavigator = () => _navigator;

const performWhenReady = (func) => (...args) => {
  if (_navigator && _ready) {
    func(...args);
  } else {
    _pendingActions.push(() => func(...args));
  }
};

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
  if (_pendingActions.length > 0 && _ready) {
    _pendingActions.forEach((action) => action());
    _pendingActions = [];
  }
};

const setIsReady = () => {
  _ready = true;
  if (_pendingActions.length > 0 && _navigator) {
    _pendingActions.forEach((action) => action());
    _pendingActions = [];
  }
};

const navigate = performWhenReady((...args) => {
  _navigator.navigate(...args);
});

const dispatch = (...args) => {
  _navigator.dispatch(...args);
};

const resetToAuth = performWhenReady(() => {
  _navigator.reset({
    index: 0,
    routes: [{ name: 'Auth', params: { screen: 'Identity' } }],
  });
});

const resetAction = ({ navigatorName, routeName }) =>
  CommonActions.reset({
    index: 0,
    routes: [{ name: navigatorName, params: { screen: routeName } }],
  });

const goBack = performWhenReady((from) => {
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
