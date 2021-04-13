import React, { useState } from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import PropTypes from 'prop-types';

import { Text, Button } from 'react-native';
import PaddedView from '../PaddedView';
import Modal, { ModalHeader } from '.';

const OnPreviousStory = () => {
  const [open, setOpen] = useState(true);

  return (
    <Modal animationType="slide" visible={open}>
      <ModalHeader onPrevious={() => setOpen(false)} />
    </Modal>
  );
};

const OnNextStory = ({ onNextText, title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Modal animationType="slide" visible={open}>
      <ModalHeader
        onNext={() => setOpen(false)}
        onNextText={onNextText}
        title={title}
      />
      {children}
    </Modal>
  );
};

OnNextStory.propTypes = {
  onNextText: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

const ModalTriggerStory = () => {
  const [open, setOpen] = useState(false);

  return (
    <PaddedView>
      <Button title="Open" onPress={() => setOpen(true)} />
      <Modal animationType="slide" visible={open}>
        <ModalHeader onNext={() => setOpen(false)} />
      </Modal>
    </PaddedView>
  );
};

storiesOf('ui-kit/Modal', module)
  .add('open trigger', () => <ModalTriggerStory />)
  .add('onPrevious', () => <OnPreviousStory open />)
  .add('onNext', () => <OnNextStory />)
  .add('onNext custom text', () => <OnNextStory onNextText="Save" />)
  .add('title', () => <OnNextStory title="Title" />)
  .add('with content', () => (
    <OnNextStory>
      <PaddedView>
        <Text>Hello there!</Text>
      </PaddedView>
    </OnNextStory>
  ));
