import React from 'react';

export const useEventProperties = (context, eventProperties) => {
  const { getAmplitudeEventProperties } = React.useContext(context);

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
