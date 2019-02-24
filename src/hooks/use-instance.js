import React from 'react';
import { isValidAmplitudeInstance } from '../lib/validation';

export const useInstance = (context, instanceName) => {
  const { getAmplitudeInstance } = React.useContext(context);

  if (!getAmplitudeInstance) {
    return null;
  }

  const amplitudeInstance = getAmplitudeInstance(instanceName);

  if (!isValidAmplitudeInstance(amplitudeInstance)) {
    console.error(
      'Failed to get a valid Amplitude instance. This likely means the "amplitudeInstance" prop your provided to the AmplitudeProvider component is not a valid Amplitude instance.',
    );

    return null;
  }

  return amplitudeInstance;
};
