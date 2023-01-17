import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React from 'react';
import shallowequal from 'shallowequal';

import { memoize } from '../lib/memoize';
import { isValidAmplitudeInstance } from '../lib/validation';

class Amplitude extends React.Component {
  constructor(props) {
    super(props);

    if (typeof props.debounceInterval === 'number') {
      this.logEvent = debounce(this._makeLogEvent(), props.debounceInterval);
    } else {
      this.logEvent = this._makeLogEvent();
    }

    this._renderPropParams = {
      logEvent: this.logEvent,
      instrument: this.instrument,
    };
  }

  _makeLogEvent = () => (eventType, eventProperties, callback) => {
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

  instrument = memoize((eventType, func) => {
    return (...params) => {
      const retVal = func ? func(...params) : undefined;

      this.logEvent(eventType);

      return retVal;
    };
  });

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
    const { props } = this;

    if (typeof nextProps.debounceInterval === 'number') {
      if (props.debounceInterval !== nextProps.debounceInterval) {
        this.logEvent = debounce(this._makeLogEvent(), nextProps.debounceInterval);

        this._renderPropParams = {
          ...this._renderPropParams,
          logEvent: this.logEvent,
        };
      }
    } else if (typeof props.debounceInterval === 'number') {
      this.logEvent = this._makeLogEvent();

      this._renderPropParams = {
        ...this._renderPropParams,
        logEvent: this.logEvent,
      };
    }
  }

  componentDidMount() {
    const { props } = this;
    const amplitudeInstance = this.getAmplitudeInstance();

    if (amplitudeInstance && props.userProperties) {
      amplitudeInstance.setUserProperties(props.userProperties);
    }
  }

  componentDidUpdate(prevProps) {
    this.instrument.cache.garbageCollect();

    const { props } = this;
    const amplitudeInstance = this.getAmplitudeInstance();

    if (amplitudeInstance && !shallowequal(prevProps.userProperties, props.userProperties)) {
      amplitudeInstance.setUserProperties(props.userProperties);
    }
  }

  getChildContext() {
    return {
      getAmplitudeEventProperties: this.getAmplitudeEventProperties,
    };
  }

  getAmplitudeInstance = () => {
    const { context, props } = this;

    if (!context.getAmplitudeInstance) {
      return null;
    }

    const amplitudeInstance = context.getAmplitudeInstance(props.instanceName);

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

    if (!context.getAmplitudeEventProperties) {
      return props.eventProperties;
    }

    const inheritedEventProperties = context.getAmplitudeEventProperties();

    if (typeof props.eventProperties === 'function') {
      return props.eventProperties(inheritedEventProperties);
    } else {
      return {
        ...inheritedEventProperties,
        ...props.eventProperties,
      };
    }
  };

  render() {
    const { props } = this;

    if (typeof props.children === 'function') {
      return props.children(this._renderPropParams);
    } else {
      return props.children || null;
    }
  }
}

Amplitude.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  debounceInterval: PropTypes.number,
  instanceName: PropTypes.string,
  userProperties: PropTypes.object,
};

Amplitude.contextTypes = {
  getAmplitudeInstance: PropTypes.func,
  getAmplitudeEventProperties: PropTypes.func,
};

Amplitude.childContextTypes = {
  getAmplitudeEventProperties: PropTypes.func,
};

export default Amplitude;
