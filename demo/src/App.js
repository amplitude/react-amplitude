import React, { Component } from 'react';
import { Amplitude, AmplitudeProvider } from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';

import logo from './logo.svg';
import './App.css';

const amplitudeInstance = amplitude.getInstance('react-amplitude-demo');
amplitudeInstance.init('2e0b5889ca91e3a925a589564a9f3deb');

class App extends Component {
  render() {
    return (
      <AmplitudeProvider amplitudeInstance={amplitudeInstance}>
        <div className="App">
          <header className="App-header">
            <Amplitude>
              {({ instrument }) => (
                <img
                  src={logo}
                  className="App-logo"
                  alt="logo"
                  onClick={instrument('click logo')}
                />
              )}
            </Amplitude>
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </AmplitudeProvider>
    );
  }
}

export default App;
