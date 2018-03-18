import PropTypes from 'prop-types';
import React from 'react';

import Amplitude from './Amplitude';

class LogOnMount extends React.Component {
  _amplitudeRef = null;

  componentDidMount() {
    const { props } = this;

    if (this._amplitudeRef) {
      this._amplitudeRef.logEvent(props.eventType);
    }
  }

  setRef = ref => {
    this._amplitudeRef = ref;
  };

  render() {
    const { props } = this;

    return (
      <Amplitude
        ref={this.setRef}
        instanceName={props.instanceName}
        eventProperties={props.eventProperties}>
        {props.children}
      </Amplitude>
    );
  }
}

LogOnMount.propTypes = {
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  eventType: PropTypes.string.isRequired,
  instanceName: PropTypes.string,
};

export default LogOnMount;
