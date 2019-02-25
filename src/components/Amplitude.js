import PropTypes from 'prop-types';

import { useInstrument } from '../hooks/use-instrument';
import { useLogEvent } from '../hooks/use-log-event';
import { useSetUserProperties } from '../hooks/use-set-user-properties';

const Amplitude = ({
  children,
  debounceInterval,
  eventProperties,
  instanceName,
  userProperties,
}) => {
  const logEvent = useLogEvent(instanceName, eventProperties, debounceInterval);
  const instrument = useInstrument(instanceName, eventProperties, debounceInterval);
  useSetUserProperties(instanceName, userProperties);

  if (typeof children === 'function') {
    return children({ instrument, logEvent });
  } else {
    return children || null;
  }
};

Amplitude.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  debounceInterval: PropTypes.number,
  instanceName: PropTypes.string,
  userProperties: PropTypes.object,
};

export default Amplitude;
