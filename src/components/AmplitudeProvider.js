import PropTypes from 'prop-types';
import React from 'react';

import { isValidAmplitudeInstance } from '../lib/validation';

class AmplitudeProvider extends React.Component {
  componentDidMount() {
    const { props } = this;

    if (isValidAmplitudeInstance(props.amplitudeInstance)) {
      if (props.apiKey) {
        props.amplitudeInstance.init(props.apiKey);
      }

      if (props.userId) {
        props.amplitudeInstance.setUserId(props.userId);
      }
    } else {
      console.error('AmplitudeProvider was not provided with a valid "amplitudeInstance" prop.');
    }
  }

  getChildContext() {
    const { props } = this;

    return {
      amplitudeInstance: props.amplitudeInstance,
      getAmplitudeEventProperties() {
        return props.eventProperties || {};
      },
    };
  }

  render() {
    const { props } = this;

    return props.children;
  }
}

AmplitudeProvider.propTypes = {
  amplitudeInstance: PropTypes.object.isRequired,
  apiKey: PropTypes.string,
  userId: PropTypes.string,
};

AmplitudeProvider.childContextTypes = {
  amplitudeInstance: PropTypes.object,
  getAmplitudeEventProperties: PropTypes.func,
};

export default AmplitudeProvider;
