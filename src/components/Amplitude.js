import PropTypes from 'prop-types';
import React from 'react';
import shallowequal from 'shallowequal';

import { memoize } from '../lib/memoize';
import { isValidAmplitudeInstance } from '../lib/validation';

class Amplitude extends React.Component {
  static _instrumentFrameCount = 0;
  static _accumulatedEventTypes = [];

  _instrumentedFunctionsCache = new Map();
  _usedInstrumentedFunctions = new Set();

  constructor(props) {
    super(props);

    this._renderPropParams = {
      logEvent: this.logEvent,
      instrument: this.instrument,
    };
  }

  _logEvent = (eventType, eventProperties, callback) => {
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

  logEvent = (eventType, eventProperties, callback) => {
    const prefix = this.getAmplitudeCurrentEventPrefix();
    const formattedEventType = prefix ? `${prefix} ${eventType}` : eventType;

    this._logEvent(formattedEventType, eventProperties, callback);
  };

  instrument = memoize((eventType, func) => {
    return (...params) => {
      const prefix = this.getAmplitudeCurrentEventPrefix();
      const formattedEventType = prefix ? `${prefix} ${eventType}` : eventType;

      Amplitude._instrumentFrameCount += 1;
      Amplitude._accumulatedEventTypes.push(formattedEventType);

      const retVal = func ? func(...params) : undefined;

      Amplitude._instrumentFrameCount -= 1;

      if (Amplitude._instrumentFrameCount === 0) {
        this._logEvent(
          Amplitude._accumulatedEventTypes[Amplitude._accumulatedEventTypes.length - 1],
        );

        Amplitude._accumulatedEventTypes = [];
      }

      return retVal;
    };
  });

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
      getAmplitudeCurrentEventPrefix: this.getAmplitudeCurrentEventPrefix,
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
    const inheritedEventProperties = context.getAmplitudeEventProperties();
    const componentEventProperties = props.eventProperties || {};

    return {
      ...inheritedEventProperties,
      ...Object.keys(componentEventProperties).reduce((accum, propKey) => {
        if (propKey in inheritedEventProperties) {
          if (Array.isArray(inheritedEventProperties[propKey])) {
            accum[propKey] = [
              ...inheritedEventProperties[propKey],
              componentEventProperties[propKey],
            ];
          } else {
            accum[propKey] = [inheritedEventProperties[propKey], componentEventProperties[propKey]];
          }
        } else {
          accum[propKey] = componentEventProperties[propKey];
        }

        return accum;
      }, {}),
    };
  };

  getAmplitudeCurrentEventPrefix = () => {
    const { props, context } = this;

    if (typeof props.eventPrefix === 'string' && props.eventPrefix.length > 0) {
      return props.eventPrefix;
    } else {
      return context.getAmplitudeCurrentEventPrefix();
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
  eventPrefix: PropTypes.string,
  userProperties: PropTypes.object,
};

Amplitude.contextTypes = {
  amplitudeInstance: PropTypes.object,
  getAmplitudeCurrentEventPrefix: PropTypes.func,
  getAmplitudeEventProperties: PropTypes.func,
};

Amplitude.childContextTypes = {
  getAmplitudeCurrentEventPrefix: PropTypes.func,
  getAmplitudeEventProperties: PropTypes.func,
};

export default Amplitude;
