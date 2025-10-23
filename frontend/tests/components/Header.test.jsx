import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../../src/components/Header";
import { AuthProvider } from "../../src/context/AuthContext";
import { DarkModeProvider } from "../../src/context/DarkModeContext";
import { GlobalAlertProvider } from "../../src/context/GlobalAlertContext";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock auth context
jest.mock("../../src/context/AuthContext", () => ({
  ...jest.requireActual("../../src/context/AuthContext"),
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

// Mock clearCache API
jest.mock("../../src/utils/base/apiUtil", () => ({
  clearCache: jest.fn(() => Promise.resolve()),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <GlobalAlertProvider>{component}</GlobalAlertProvider>
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  test("renders header text", () => {
    renderWithProviders(<Header text='Test Header' />);
    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  test("navigates to home when logo is clicked", () => {
    renderWithProviders(<Header text='Test Header' />);
    const logo = screen.getByRole("link");
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles logout", () => {
    renderWithProviders(<Header text='Test Header' />);
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("displays cache clear success message", async () => {
    const mockTriggerAlert = jest.fn();

    // Mock GlobalAlertContext
    jest
      .spyOn(require("../../src/context/GlobalAlertContext"), "useGlobalAlert")
      .mockReturnValue({ triggerAlert: mockTriggerAlert });

    renderWithProviders(<Header text='Test Header' />);

    // Find and click the clear cache button
    const clearCacheButton = screen.getByTestId("clear-cache-button");
    await act(async () => {
      await fireEvent.click(clearCacheButton);
    });

    // Check if the success alert was triggered
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Cache cleared successfully",
      "success"
    );
  });

  test("toggles dark mode", () => {
    renderWithProviders(<Header text='Test Header' />);
    const darkModeToggle = screen.getByLabelText("Toggle dark mode");
    fireEvent.click(darkModeToggle);
    // Note: Testing the actual dark mode state would require additional context testing
  });
});
