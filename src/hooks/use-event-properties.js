import React from 'react';
import { AmplitudeContext } from '../components/AmplitudeProvider';

export const useEventProperties = eventProperties => {
  const { getAmplitudeEventProperties } = React.useContext(AmplitudeContext);

  if (!getAmplitudeEventProperties) {
    return eventProperties;
  }

  const inheritedEventProperties = getAmplitudeEventProperties();

  if (typeof eventProperties === 'function') {
    return eventProperties(inheritedEventProperties);
  } else {
    return {
      ...inheritedEventProperties,
      ...eventProperties,
    };
  }
};
