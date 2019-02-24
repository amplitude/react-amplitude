import { useEventProperties } from './use-event-properties';
import { useInstance } from './use-instance';

export const useLogEvent = (context, instanceName, eventProperties) => {
  const instance = useInstance(context, instanceName);
  const inheritedEventProperties = useEventProperties(context, eventProperties);

  const logEvent = (eventType, eventProperties, callback) => {
    if (instance) {
      instance.logEvent(
        eventType,
        {
          ...inheritedEventProperties,
          ...(eventProperties || {}),
        },
        callback,
      );
    }
  };

  return logEvent;
};
