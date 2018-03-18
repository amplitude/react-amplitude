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

    return <Amplitude ref={this.setRef}>{props.children}</Amplitude>;
  }
}

LogOnMount.propTypes = {
  eventType: PropTypes.string.isRequired,
};

export default LogOnMount;
