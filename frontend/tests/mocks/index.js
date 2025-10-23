const React = require("react");

exports.mockDarkModeContext = {
  useDarkMode: jest.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  })),
  DarkModeProvider: ({ children }) => children,
};

exports.mockGlobalAlertContext = {
  useGlobalAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  GlobalAlertProvider: ({ children }) => children,
};

exports.mockClipboard = {
  writeText: jest.fn(),
};
