import { NavigationActions } from 'react-navigation';

let _navigator;

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

const navigate = (routeName, params) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
};

const goBack = (from) => {
  let key;
  if (from) {
    const route = _navigator.state.nav.routes.find((r) => r.routeName === from);
    if (route) ({ key } = route);
  }
  _navigator.dispatch(NavigationActions.back({ key }));
};

const navigateToAuth = () => {
  navigate('Auth', { emailRequired: true });
};

export default {
  setTopLevelNavigator,
  navigate,
  navigateToAuth,
  goBack,
};
