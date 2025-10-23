import React from "react";
import { render } from "@testing-library/react";
import { DarkModeProvider } from "../../src/context/DarkModeContext";
import { GlobalAlertProvider } from "../../src/context/GlobalAlertContext";

// Mock clipboard API
export const mockClipboard = {
  writeText: jest.fn(),
};

// Mock context hooks
export const mockDarkModeContext = {
  useDarkMode: jest.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  })),
  DarkModeProvider: ({ children }) => <div>{children}</div>,
};

export const mockGlobalAlertContext = {
  useGlobalAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  GlobalAlertProvider: ({ children }) => <div>{children}</div>,
};

// Helper function for rendering with providers
export const renderWithProviders = (component) => {
  return render(
    <DarkModeProvider>
      <GlobalAlertProvider>{component}</GlobalAlertProvider>
    </DarkModeProvider>
  );
};
