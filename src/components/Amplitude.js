import React from 'react';
import PropTypes from 'prop-types';

import { AmplitudeContext } from './AmplitudeProvider';
import { useInstrument } from '../hooks/use-instrument';
import { useLogEvent } from '../hooks/use-log-event';
import { useSetUserProperties } from '../hooks/use-set-user-properties';

const useMergedContext = eventProperties => {
  const context = React.useContext(AmplitudeContext);
  const { getAmplitudeEventProperties } = context;
  const newGetAmplitudeEventProperties = React.useCallback(() => {
    return { ...getAmplitudeEventProperties(), ...(eventProperties || {}) };
  });

  return React.useMemo(
    () => ({
      ...context,
      getAmplitudeEventProperties: newGetAmplitudeEventProperties,
    }),
    [context, newGetAmplitudeEventProperties],
  );
};

const Amplitude = ({
  children,
  debounceInterval,
  eventProperties,
  instanceName,
  userProperties,
}) => {
  const logEvent = useLogEvent(instanceName, eventProperties, debounceInterval);
  const instrument = useInstrument(instanceName, eventProperties, debounceInterval);
  const mergedContext = useMergedContext(eventProperties);
  useSetUserProperties(instanceName, userProperties);

  let childElements;

  if (typeof children === 'function') {
    childElements = children({ instrument, logEvent });
  } else {
    childElements = children || null;
  }

  return (
    <AmplitudeContext.Provider value={mergedContext}>{childElements}</AmplitudeContext.Provider>
  );
};

Amplitude.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  debounceInterval: PropTypes.number,
  instanceName: PropTypes.string,
  userProperties: PropTypes.object,
};

export default Amplitude;
