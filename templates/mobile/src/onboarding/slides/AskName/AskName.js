import { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { SafeAreaView } from 'react-native-safe-area-context';

import { PaddedView, TextInput, named } from '@apollosproject/ui-kit';

import Slide, { SlideContent } from '../../Slide';

// memo = sfc PureComponent 💥
const AskName = memo(
  ({
    onPressPrimary,
    slideTitle,
    description,
    firstName,
    lastName,
    values,
    touched,
    errors,
    setFieldValue,
    isLoading,
    ...props
  }) => {
    let LastNameInput = null;

    return (
      <Slide onPressPrimary={onPressPrimary} isLoading={isLoading} {...props}>
        <SafeAreaView>
          <SlideContent title={slideTitle} description={description} icon>
            <PaddedView horizontal={false}>
              <TextInput
                label={'First Name'}
                type={'text'}
                textContentType={'givenName'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'firstName')}
                error={
                  get(touched, 'firstName', false) &&
                  get(errors, 'firstName', null)
                }
                onChangeText={(text) => setFieldValue('firstName', text)}
                onSubmitEditing={() => LastNameInput.focus()}
                disabled={isLoading}
                enablesReturnKeyAutomatically
              />
              <TextInput
                label={'Last Name'}
                type={'text'}
                textContentType={'familyName'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'lastName')}
                error={
                  get(touched, 'lastName', false) &&
                  get(errors, 'lastName', null)
                }
                onChangeText={(text) => setFieldValue('lastName', text)}
                onSubmitEditing={onPressPrimary}
                disabled={isLoading}
                enablesReturnKeyAutomatically
                inputRef={(r) => {
                  LastNameInput = r;
                }}
              />
            </PaddedView>
          </SlideContent>
        </SafeAreaView>
      </Slide>
    );
  }
);

AskName.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  setFieldValue: PropTypes.func.isRequired,
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  touched: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  values: PropTypes.shape({}),
  onPressPrimary: PropTypes.func,
  isLoading: PropTypes.bool,
};

AskName.defaultProps = {
  slideTitle: 'Welcome!',
  description: "Every relationship starts with a name. What's yours?",
};

AskName.displayName = 'AskName';

export default named('ui-onboarding.AskName')(AskName);
