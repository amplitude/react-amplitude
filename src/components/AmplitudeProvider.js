import PropTypes from 'prop-types';
import React from 'react';

import { isValidAmplitudeInstance } from '../lib/validation';

export const AmplitudeContext = React.createContext();

const AmplitudeProvider = props => {
  return (
    <AmplitudeContext.Consumer>
      {context => <AmplitudeProviderInner {...props} inheritedContext={context} />}
    </AmplitudeContext.Consumer>
  );
};

const AmplitudeProviderInner = ({
  amplitudeInstance,
  apiKey,
  children,
  eventProperties,
  inheritedContext,
  userId,
}) => {
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

  const getAmplitudeInstance = React.useCallback(
    (instanceName = '$default_instance') => {
      if (amplitudeInstance._instanceName === instanceName) {
        return amplitudeInstance;
      } else if (inheritedContext && inheritedContext.getAmplitudeInstance) {
        return inheritedContext.getAmplitudeInstance(instanceName);
      } else {
        return null;
      }
    },
    [amplitudeInstance, amplitudeInstance._instanceName, inheritedContext],
  );

  const getAmplitudeEventProperties = React.useCallback(() => {
    return eventProperties || {};
  }, [eventProperties]);

  const contextValue = React.useMemo(
    () => ({ getAmplitudeInstance, getAmplitudeEventProperties }),
    [getAmplitudeEventProperties, getAmplitudeInstance],
  );

  return <AmplitudeContext.Provider value={contextValue}>{children}</AmplitudeContext.Provider>;
};

AmplitudeProvider.propTypes = {
  amplitudeInstance: PropTypes.object.isRequired,
  apiKey: PropTypes.string,
  eventProperties: PropTypes.object,
  userId: PropTypes.string,
};

export default AmplitudeProvider;
