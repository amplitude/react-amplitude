import React from 'react';
import { cleanup, render } from 'react-testing-library';

import { getInstanceMock } from '../utils';
import AmplitudeProvider from '../../src/components/AmplitudeProvider';

afterEach(cleanup);

test('A provider with no props has no side effects', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);

  render(<AmplitudeProvider amplitudeInstance={mockAmplitudeInstance} />);

  expect(mockAmplitudeInstance.init.mock.calls.length).toBe(0);
  expect(mockAmplitudeInstance.setUserId.mock.calls.length).toBe(0);
});

test('Passing an apiKey prop initializes the Amplitude instance', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';
  const mockUserId = 'mock-user-id';

  render(
    <AmplitudeProvider
      amplitudeInstance={mockAmplitudeInstance}
      apiKey={mockApiKey}
      userId={mockUserId}
    />,
  );

  expect(mockAmplitudeInstance.init.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.init.mock.calls[0][0]).toBe(mockApiKey);
});

test('Passing a userId prop sets the user ID', () => {
  const mockInstanceName = 'mock-instance-name';
  const mockAmplitudeInstance = getInstanceMock(mockInstanceName);
  const mockApiKey = 'mock-api-key';
  const mockUserId = 'mock-user-id';

  render(
    <AmplitudeProvider
      amplitudeInstance={mockAmplitudeInstance}
      apiKey={mockApiKey}
      userId={mockUserId}
    />,
  );

  expect(mockAmplitudeInstance.setUserId.mock.calls.length).toBe(1);
  expect(mockAmplitudeInstance.setUserId.mock.calls[0][0]).toBe(mockUserId);
});
