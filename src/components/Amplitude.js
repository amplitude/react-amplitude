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

  componentWillReceiveProps(nextProps) {
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

    if (props.mountEventType) {
      this.logEvent(props.mountEventType);
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
      return props.children;
    }
  }
}

Amplitude.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  debounceInterval: PropTypes.number,
  instanceName: PropTypes.string,
  mountEventType: PropTypes.string,
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
