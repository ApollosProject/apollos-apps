import { phone } from 'phone';
import { UserInputError } from 'apollo-server';

export const phoneToDB = ({ number }) => {
  const { phoneNumber, isValid } = phone(number);

  if (isValid) {
    return phoneNumber.slice(1);
  }
  throw new UserInputError('Phone number invalid');
};

export const phoneForDisplay = ({ number }) => {
  const { phoneNumber, countryCode } = phone(number);
  return phoneNumber.replace(countryCode, '');
};
