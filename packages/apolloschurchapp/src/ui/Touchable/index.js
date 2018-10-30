import { Platform, TouchableHighlight, TouchableOpacity } from 'react-native';

const IOSTouchable = TouchableOpacity;

IOSTouchable.defaultProps = {
  activeOpacity: 0.5,
};

const Touchable = Platform.OS === 'android' ? TouchableHighlight : IOSTouchable;

export default Touchable;
