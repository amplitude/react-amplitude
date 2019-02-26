export const getInstanceMock = instanceName => ({
  _instanceName: instanceName,
  init: jest.fn(),
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
});
