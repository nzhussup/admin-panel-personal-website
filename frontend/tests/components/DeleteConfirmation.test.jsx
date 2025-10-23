import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmation from "../../src/components/DeleteConfirmation";
import { DarkModeProvider } from "../../src/context/DarkModeContext";

describe("DeleteConfirmation Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  const renderWithProvider = (props) => {
    return render(
      <DarkModeProvider>
        <DeleteConfirmation {...props} />
      </DarkModeProvider>
    );
  };

  test("renders nothing when not open", () => {
    renderWithProvider({
      isOpen: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    const dialog = screen.queryByRole("dialog");
    expect(dialog).not.toBeInTheDocument();
  });

  test("renders confirmation dialog when open", () => {
    renderWithProvider({
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  test("calls onClose when Cancel button is clicked", () => {
    renderWithProvider({
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test("calls onConfirm when Delete button is clicked", () => {
    renderWithProvider({
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("closes when clicking overlay", () => {
    renderWithProvider({
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    const overlay = screen.getByRole("dialog");
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not close when clicking dialog content", () => {
    renderWithProvider({
      isOpen: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    });

    const dialogContent = screen
      .getByRole("dialog")
      .querySelector(".popup-content");
    fireEvent.click(dialogContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
