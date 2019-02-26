import PropTypes from 'prop-types';
import React from 'react';

import { isValidAmplitudeInstance } from '../lib/validation';

export const AmplitudeContext = React.createContext({
  eventProperties: {},
  instances: {},
});

const AmplitudeProvider = ({ amplitudeInstance, apiKey, children, eventProperties, userId }) => {
  const inheritedContext = React.useContext(AmplitudeContext);

  const contextValue = React.useMemo(() => {
    return {
      eventProperties: { ...inheritedContext.eventProperties, ...eventProperties },
      instances: {
        ...inheritedContext.instances,
        [amplitudeInstance._instanceName]: amplitudeInstance,
      },
    };
  }, [
    amplitudeInstance,
    amplitudeInstance._instanceName,
    eventProperties,
    inheritedContext.eventProperties,
    inheritedContext.instances,
  ]);

  React.useEffect(() => {
    if (isValidAmplitudeInstance(amplitudeInstance)) {
      if (apiKey) {
        amplitudeInstance.init(apiKey);
      }

      if (userId) {
        amplitudeInstance.setUserId(userId);
      }
    } else {
      console.error('AmplitudeProvider was not provided with a valid "amplitudeInstance" prop.');
    }
    // Intentionally ignore changes to props for now and only init/setUser once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AmplitudeContext.Provider value={contextValue}>{children}</AmplitudeContext.Provider>;
};

AmplitudeProvider.propTypes = {
  amplitudeInstance: PropTypes.object.isRequired,
  apiKey: PropTypes.string,
  eventProperties: PropTypes.object,
  userId: PropTypes.string,
};

export default AmplitudeProvider;
