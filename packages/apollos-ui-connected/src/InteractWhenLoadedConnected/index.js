import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import INTERACT_WITH_NODE from './interactWithNode';

class InteractWhenLoaded extends PureComponent {
  componentDidMount() {
    if (!this.props.isLoading) {
      this.interact();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoading && !this.props.isLoading) {
      this.interact();
    }
  }

  interact() {
    return this.props.mutate();
  }

  render() {
    return null;
  }
}

InteractWhenLoaded.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  // properties: PropTypes.any,
  mutate: PropTypes.func.isRequired,
};

const InteractWhenLoadedConnected = (props) => (
  <Mutation
    mutation={INTERACT_WITH_NODE}
    variables={{ nodeId: props.nodeId, action: props.action }}
  >
    {(mutate) => <InteractWhenLoaded {...props} mutate={mutate} />}
  </Mutation>
);

InteractWhenLoadedConnected.propTypes = {
  nodeId: PropTypes.string,
  action: PropTypes.string.isRequired,
};

export default InteractWhenLoadedConnected;
