import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ClearCacheButton from "../../src/components/ClearCacheButton";
import { clearCache } from "../../src/utils/base/apiUtil";

// Mock the apiUtil module
jest.mock("../../src/utils/base/apiUtil", () => ({
  clearCache: jest.fn(),
}));

describe("ClearCacheButton Component", () => {
  const mockTriggerAlertHandler = jest.fn();

  beforeEach(() => {
    clearCache.mockClear();
    mockTriggerAlertHandler.mockClear();
  });

  test("renders clear cache button", () => {
    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/clear cache/i);
  });

  test("handles successful cache clearing", async () => {
    clearCache.mockResolvedValueOnce();

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(clearCache).toHaveBeenCalledTimes(1);
    expect(mockTriggerAlertHandler).toHaveBeenCalledWith(null);
  });

  test("handles cache clearing error", async () => {
    const error = new Error("Failed to clear cache");
    clearCache.mockRejectedValueOnce(error);

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(clearCache).toHaveBeenCalledTimes(1);
    expect(mockTriggerAlertHandler).toHaveBeenCalledWith(error);
  });

  test("disables button while clearing", async () => {
    // Create a promise that we can resolve manually
    let resolvePromise;
    const clearPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    clearCache.mockImplementationOnce(() => clearPromise);

    render(<ClearCacheButton triggerAlertHandler={mockTriggerAlertHandler} />);
    const button = screen.getByRole("button");

    // Click the button but don't resolve the promise yet
    fireEvent.click(button);

    // Button should be disabled and show loading state
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/clearing/i);

    // Resolve the promise
    await act(async () => {
      resolvePromise();
    });

    // Button should be enabled again
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent(/clear cache/i);
  });
});
