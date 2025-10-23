import React from "react";
import { render, screen, act } from "@testing-library/react";
import GlobalAlert from "../../src/components/GlobalAlert";
import { useGlobalAlert } from "../../src/context/GlobalAlertContext";

// Mock the useGlobalAlert hook
jest.mock("../../src/context/GlobalAlertContext", () => ({
  useGlobalAlert: jest.fn(),
}));

// Mock timer functions
jest.useFakeTimers();

describe("GlobalAlert Component", () => {
  const mockCloseAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllTimers();
    mockCloseAlert.mockClear();
  });

  test("renders alert when shown", () => {
    useGlobalAlert.mockReturnValue({
      alert: { show: true, message: "Test message", type: "success" },
      closeAlert: mockCloseAlert,
    });

    render(<GlobalAlert />);

    act(() => {
      // Advance timers slightly to allow animations to start
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("alert-success");
  });

  test("hides alert after timeout", () => {
    useGlobalAlert.mockReturnValue({
      alert: { show: true, message: "Test message", type: "success" },
      closeAlert: mockCloseAlert,
    });

    render(<GlobalAlert />);

    act(() => {
      // Advance timers slightly to allow animations to start
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();

    // Fast-forward time by 3.5 seconds (3000ms alert display + 500ms fade out)
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(mockCloseAlert).toHaveBeenCalled();
  });

  test("does not render when show is false", () => {
    useGlobalAlert.mockReturnValue({
      alert: { show: false, message: "Test message", type: "success" },
      closeAlert: mockCloseAlert,
    });

    render(<GlobalAlert />);
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("handles alert type changes", () => {
    useGlobalAlert.mockReturnValue({
      alert: { show: true, message: "Error message", type: "danger" },
      closeAlert: mockCloseAlert,
    });

    render(<GlobalAlert />);

    act(() => {
      // Advance timers slightly to allow animations to start
      jest.advanceTimersByTime(10);
    });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert-danger");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });
});
