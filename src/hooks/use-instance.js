import React from 'react';
import { AmplitudeContext } from '../components/AmplitudeProvider';
import { isValidAmplitudeInstance } from '../lib/validation';

export const useInstance = instanceName => {
  const context = React.useContext(AmplitudeContext);
  const amplitudeInstance = context.instances[instanceName];

  if (!isValidAmplitudeInstance(amplitudeInstance)) {
    console.error(
      'Failed to get a valid Amplitude instance. This likely means the "amplitudeInstance" prop your provided to the AmplitudeProvider component is not a valid Amplitude instance.',
    );

    return null;
  }

  return amplitudeInstance;
};
