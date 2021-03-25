import { useEffect, useState, useCallback } from 'react';
import { Keyboard } from 'react-native';

export default () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleOnKeyboardShow = useCallback((event) => {
    setKeyboardHeight(event.endCoordinates.height);
  }, []);

  const handleOnKeyboardHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleOnKeyboardShow);

    return () => {
      Keyboard.removeListener('keyboardWillShow', handleOnKeyboardShow);
    };
  }, [handleOnKeyboardShow]);

  useEffect(() => {
    Keyboard.addListener('keyboardWillHide', handleOnKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardWillHide', handleOnKeyboardHide);
    };
  }, [handleOnKeyboardHide]);

  return keyboardHeight;
};
