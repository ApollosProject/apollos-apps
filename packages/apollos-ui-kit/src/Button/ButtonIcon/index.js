import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../../styled';
import Icon from '../../Icon';
import Touchable from '../../Touchable';

const ControlPadding = styled(({ iconPadding }) => ({
  padding: iconPadding, // maximize vertical space for tappability.
}))(View);

class ButtonIcon extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    fill: PropTypes.string,
    iconPadding: PropTypes.number, // this optionally defaults to this.props.size / 2
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    size: 32, // 32 is the default icon size used within the svg component
  };

  render() {
    const {
      onPress,
      disabled,
      iconPadding,
      size,
      name,
      fill,
      isLoading,
      ...otherProps
    } = this.props;

    return (
      <Touchable
        onPress={this.props.onPress}
        disabled={this.props.disabled}
        borderRadius={
          this.props.iconPadding + this.props.size || this.props.size * 2
        }
        {...otherProps}
      >
        <ControlPadding
          iconPadding={
            this.props.iconPadding >= 0
              ? this.props.iconPadding
              : this.props.size
          }
        >
          <Icon
            name={this.props.name}
            size={this.props.size}
            fill={this.props.fill}
            isLoading={this.props.isLoading}
            // I'm also not sure why opacity works here but this is where we want it so... 🤷‍
            opacity={this.props.disabled ? 0.5 : 1}
          />
        </ControlPadding>
      </Touchable>
    );
  }
}

export default ButtonIcon;
