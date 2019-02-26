import React from 'react';
import PropTypes from 'prop-types';

import { AmplitudeContext } from './AmplitudeProvider';
import { useInstrument } from '../hooks/use-instrument';
import { useLogEvent } from '../hooks/use-log-event';
import { useSetUserProperties } from '../hooks/use-set-user-properties';

const Amplitude = ({
  children,
  debounceInterval,
  eventProperties,
  instanceName = '$default_instance',
  userProperties,
}) => {
  const logEvent = useLogEvent(instanceName, eventProperties, debounceInterval);
  const instrument = useInstrument(instanceName, eventProperties, debounceInterval);

  useSetUserProperties(instanceName, userProperties);

  const inheritedContext = React.useContext(AmplitudeContext);
  const contextValue = React.useMemo(() => {
    return {
      ...inheritedContext,
      eventProperties: { ...inheritedContext.eventProperties, ...eventProperties },
    };
  }, [eventProperties, inheritedContext]);

  let childElements;

  if (typeof children === 'function') {
    childElements = children({ instrument, logEvent });
  } else {
    childElements = children || null;
  }

  return (
    <AmplitudeContext.Provider value={contextValue}>{childElements}</AmplitudeContext.Provider>
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
