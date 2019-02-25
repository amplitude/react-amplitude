import React from 'react';
import shallowequal from 'shallowequal';
import { useInstance } from './use-instance';

const usePrevious = value => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const useSetUserProperties = (instanceName, userProperties) => {
  const instance = useInstance(instanceName);
  const prevUserProperties = usePrevious(usePrevious);

  React.useEffect(() => {
    if (userProperties && !shallowequal(prevUserProperties, userProperties)) {
      instance.setUserProperties(userProperties);
    }
  }, [instance, prevUserProperties, userProperties]);
};
