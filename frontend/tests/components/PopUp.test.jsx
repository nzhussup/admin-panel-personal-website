import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PopUp from "../../src/components/PopUp";
import { DarkModeProvider } from "../../src/context/DarkModeContext";

// Mock timer functions
jest.useFakeTimers();

const renderWithDarkMode = (component) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("PopUp Component", () => {
  const mockClosePopup = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    closePopup: mockClosePopup,
    title: "Test Popup",
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    mockClosePopup.mockClear();
    mockOnSubmit.mockClear();
    jest.clearAllTimers();
  });

  test("renders popup with title", () => {
    renderWithDarkMode(
      <PopUp {...defaultProps}>
        <div>Popup content</div>
      </PopUp>
    );
    expect(screen.getByText("Test Popup")).toBeInTheDocument();
    expect(screen.getByText("Popup content")).toBeInTheDocument();
  });

  test("closes on overlay click", () => {
    renderWithDarkMode(
      <PopUp {...defaultProps}>
        <div>Popup content</div>
      </PopUp>
    );
    const overlay = screen.getByTestId("popup-overlay");
    fireEvent.click(overlay);
    expect(mockClosePopup).toHaveBeenCalled();
  });

  test("does not close when clicking popup content", () => {
    renderWithDarkMode(
      <PopUp {...defaultProps}>
        <div>Popup content</div>
      </PopUp>
    );
    const content = screen.getByTestId("popup-content");
    fireEvent.click(content);
    expect(mockClosePopup).not.toHaveBeenCalled();
  });

  test("handles form submission", async () => {
    mockOnSubmit.mockResolvedValueOnce();
    renderWithDarkMode(
      <PopUp {...defaultProps}>
        <form>
          <button type='submit'>Submit</button>
        </form>
      </PopUp>
    );

    const submitButton = screen.getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(200);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("shows loading state during submission", async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithDarkMode(
      <PopUp {...defaultProps}>
        <form>
          <button type='submit'>Submit</button>
        </form>
      </PopUp>
    );

    const submitButton = screen.getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
