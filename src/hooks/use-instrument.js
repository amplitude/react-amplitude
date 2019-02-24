import { useLogEvent } from './use-log-event';

export const useInstrument = (context, instanceName, eventProperties, eventType, func) => {
  const logEvent = useLogEvent(context, instanceName, eventProperties);

  return function instrumentedFunc(...params) {
    const retVal = func ? func.apply(this, params) : undefined;

    logEvent(eventType);

    return retVal;
  };
};
