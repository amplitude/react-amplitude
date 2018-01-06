import PropTypes from 'prop-types';
import React from 'react';
import shallowequal from 'shallowequal';

import { isValidAmplitudeInstance } from '../lib/validation';

class Amplitude extends React.Component {
  constructor(props) {
    super(props);

    this._renderPropParams = {
      logEvent: this.logEvent,
      instrument: this.instrument,
    };
  }

  instrument = (func, eventType, eventProperties, callback) => {
    return (...params) => {
      const retVal = func ? func(...params) : undefined;

      this.logEvent(eventType, eventProperties, callback);

      return retVal;
    };
  };

  componentDidMount() {
    const { props } = this;
    const amplitudeInstance = this.getAmplitudeInstance();

    if (amplitudeInstance && props.userProperties) {
      amplitudeInstance.setUserProperties(props.userProperties);
    }
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const amplitudeInstance = this.getAmplitudeInstance();

    if (amplitudeInstance && !shallowequal(prevProps.userProperties, props.userProperties)) {
      amplitudeInstance.setUserProperties(props.userProperties);
    }
  }

  getChildContext() {
    return {
      getAmplitudeEventProperties: this.getAmplitudeEventProperties,
      getAmplitudeNameHierarchy: this.getAmplitudeNameHierarchy,
    };
  }

  getAmplitudeInstance = () => {
    const { context } = this;
    const { amplitudeInstance } = context;

    if (!isValidAmplitudeInstance(amplitudeInstance)) {
      console.error(
        'Failed to get a valid Amplitude instance. This likely means the "amplitudeInstance" prop your provided to the AmplitudeProvider component is not a valid Amplitude instance.',
      );

      return null;
    }

    return amplitudeInstance;
  };

  getAmplitudeEventProperties = () => {
    const { props, context } = this;

    return {
      ...context.getAmplitudeEventProperties(),
      ...(props.eventProperties || {}),
      $hierarchy: this.getAmplitudeNameHierarchy(),
    };
  };

  getAmplitudeNameHierarchy = () => {
    const { props, context } = this;

    if (typeof props.name === 'string' && props.name.length > 0) {
      return [...context.getAmplitudeNameHierarchy(), props.name];
    } else {
      return context.getAmplitudeNameHierarchy();
    }
  };

  logEvent = (eventType, eventProperties, callback) => {
    const amplitudeInstance = this.getAmplitudeInstance();

    if (amplitudeInstance) {
      amplitudeInstance.logEvent(
        eventType,
        {
          ...this.getAmplitudeEventProperties(),
          ...(eventProperties || {}),
        },
        callback,
      );
    }
  };

  render() {
    const { props } = this;

    if (typeof props.children === 'function') {
      return props.children(this._renderPropParams);
    } else {
      return props.children;
    }
  }
}

Amplitude.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  eventProperties: PropTypes.object,
  name: PropTypes.string,
  userProperties: PropTypes.object,
};

Amplitude.contextTypes = {
  amplitudeInstance: PropTypes.object,
  getAmplitudeEventProperties: PropTypes.func,
  getAmplitudeNameHierarchy: PropTypes.func,
};

Amplitude.childContextTypes = {
  getAmplitudeEventProperties: PropTypes.func,
  getAmplitudeNameHierarchy: PropTypes.func,
};

export default Amplitude;
