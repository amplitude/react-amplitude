import PropTypes from 'prop-types';
import React from 'react';

import Amplitude from './Amplitude';

class LogOnChange extends React.Component {
  _amplitudeRef = null;

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (prevProps.value !== props.value) {
      if (this._amplitudeRef) {
        this._amplitudeRef.logEvent(props.eventType);
      }
    }
  }

  setRef = ref => {
    this._amplitudeRef = ref;
  };

  render() {
    const { props } = this;

    return (
      <Amplitude ref={this.setRef} debounceInterval={props.debounceInterval}>
        {props.children}
      </Amplitude>
    );
  }
}

LogOnChange.propTypes = {
  debounceInterval: PropTypes.number,
  eventType: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};

export default LogOnChange;
