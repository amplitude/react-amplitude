export const isValidAmplitudeInstance = maybeInstance =>
  Boolean(maybeInstance) &&
  typeof maybeInstance.init === 'function' &&
  typeof maybeInstance.logEvent === 'function';
