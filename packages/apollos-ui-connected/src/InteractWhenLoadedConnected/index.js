import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import INTERACT_WITH_NODE from './interactWithNode';

class InteractWhenLoaded extends PureComponent {
  componentDidMount() {
    if (this.props.loaded) {
      this.interact();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loaded && this.props.loaded) {
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
  loaded: PropTypes.bool.isRequired,
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
