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
    const prefix = this.getAmplitudeCurrentPrefix();
    const formattedEventType = prefix ? `${prefix} ${eventType}` : eventType;

    this._logEvent(formattedEventType, eventProperties, callback);
  };

  instrument = memoize((eventType, func) => {
    return (...params) => {
      const prefix = this.getAmplitudeCurrentPrefix();
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
      getAmplitudeNameHierarchy: this.getAmplitudeNameHierarchy,
      getAmplitudeCurrentPrefix: this.getAmplitudeCurrentPrefix,
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

  getAmplitudeCurrentPrefix = () => {
    const { props, context } = this;

    if (typeof props.prefix === 'string' && props.prefix.length > 0) {
      return props.prefix;
    } else {
      return context.getAmplitudeCurrentPrefix();
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
  prefix: PropTypes.string,
  userProperties: PropTypes.object,
};

Amplitude.contextTypes = {
  amplitudeInstance: PropTypes.object,
  getAmplitudeCurrentPrefix: PropTypes.func,
  getAmplitudeEventProperties: PropTypes.func,
  getAmplitudeNameHierarchy: PropTypes.func,
};

Amplitude.childContextTypes = {
  getAmplitudeCurrentPrefix: PropTypes.func,
  getAmplitudeEventProperties: PropTypes.func,
  getAmplitudeNameHierarchy: PropTypes.func,
};

export default Amplitude;
