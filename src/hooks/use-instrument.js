import React from 'react';
import { useLogEvent } from './use-log-event';

export const useInstrument = (instanceName, eventProperties, debounceInterval) => {
  const logEvent = useLogEvent(instanceName, eventProperties, debounceInterval);

  return React.useCallback(
    function instrument(eventType, func) {
      return function instrumentedFunc(...params) {
        const retVal = func ? func.apply(this, params) : undefined;

        logEvent(eventType);

        return retVal;
      };
    },
    [logEvent],
  );
};
