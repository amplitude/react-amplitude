import React from 'react';
import { cleanup, render } from 'react-testing-library';

import { getInstanceMock } from '../utils';
import Amplitude from '../../src/components/Amplitude';
import AmplitudeProvider from '../../src/components/AmplitudeProvider';

afterEach(cleanup);

test('logEvent is correctly proxied to the Amplitude instance', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';

  const { getByTestId } = render(
    <AmplitudeProvider amplitudeInstance={mockAmplitudeInstance} apiKey={mockApiKey}>
      <Amplitude instanceName={mockInstanceName}>
        {({ logEvent }) => (
          <button
            data-testid="button"
            onClick={() => {
              logEvent('mock-event-type', { 'mock-event-property': 'mock-property-value' });
            }}
          />
        )}
      </Amplitude>
    </AmplitudeProvider>,
  );

  getByTestId('button').click();

  expect(mockAmplitudeInstance.logEvent.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.logEvent.mock.calls[0][0]).toBe('mock-event-type');
  expect(mockAmplitudeInstance.logEvent.mock.calls[0][1]).toEqual({
    'mock-event-property': 'mock-property-value',
  });
});

test('instrument causes logEvent to be called on the Amplitude instance', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';

  const { getByTestId } = render(
    <AmplitudeProvider amplitudeInstance={mockAmplitudeInstance} apiKey={mockApiKey}>
      <Amplitude
        eventProperties={{ 'mock-event-property': 'mock-property-value' }}
        instanceName={mockInstanceName}>
        {({ instrument }) => {
          const instrumented = instrument('mock-event-type', () => {});

          return <button data-testid="button" onClick={instrumented} />;
        }}
      </Amplitude>
    </AmplitudeProvider>,
  );

  getByTestId('button').click();

  expect(mockAmplitudeInstance.logEvent.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.logEvent.mock.calls[0][0]).toBe('mock-event-type');
  expect(mockAmplitudeInstance.logEvent.mock.calls[0][1]).toEqual({
    'mock-event-property': 'mock-property-value',
  });
});

test('event properties are inherited from ancestors', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';

  const { getByTestId } = render(
    <AmplitudeProvider amplitudeInstance={mockAmplitudeInstance} apiKey={mockApiKey}>
      <Amplitude eventProperties={{ a: 1 }} instanceName={mockInstanceName}>
        <Amplitude eventProperties={{ b: 2 }} instanceName={mockInstanceName}>
          <Amplitude eventProperties={{ c: 3 }} instanceName={mockInstanceName}>
            {({ logEvent }) => (
              <button
                data-testid="button"
                onClick={() => {
                  logEvent('mock-event-type', { d: 4 });
                }}
              />
            )}
          </Amplitude>
        </Amplitude>
      </Amplitude>
    </AmplitudeProvider>,
  );

  getByTestId('button').click();

  expect(mockAmplitudeInstance.logEvent.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.logEvent.mock.calls[0][1]).toEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  });
});

test('user properties are set', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';

  render(
    <AmplitudeProvider amplitudeInstance={mockAmplitudeInstance} apiKey={mockApiKey}>
      <Amplitude
        userProperties={{ 'mock-user-property': 'mock-property-value' }}
        instanceName={mockInstanceName}
      />
    </AmplitudeProvider>,
  );

  expect(mockAmplitudeInstance.setUserProperties.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.setUserProperties.mock.calls[0][0]).toEqual({
    'mock-user-property': 'mock-property-value',
  });
});
