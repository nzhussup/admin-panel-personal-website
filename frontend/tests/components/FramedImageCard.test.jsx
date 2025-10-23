import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FramedImageCard from "../../src/components/FramedImageCard";
import { DarkModeProvider } from "../../src/context/DarkModeContext";
import { GlobalAlertProvider } from "../../src/context/GlobalAlertContext";

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};
Object.assign(navigator, { clipboard: mockClipboard });

// Mock context hooks
jest.mock("../../src/context/GlobalAlertContext", () => ({
  useGlobalAlert: jest.fn(),
}));

jest.mock("../../src/context/DarkModeContext", () => ({
  useDarkMode: jest.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  })),
  DarkModeProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../src/context/GlobalAlertContext", () => ({
  useGlobalAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  GlobalAlertProvider: ({ children }) => <div>{children}</div>,
}));

const renderWithProviders = (component) => {
  return render(
    <DarkModeProvider>
      <GlobalAlertProvider>{component}</GlobalAlertProvider>
    </DarkModeProvider>
  );
};

describe("FramedImageCard Component", () => {
  const mockImageUrl = "https://example.com/images/test-image.jpg";
  const mockAlt = "Test Image";
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
    mockClipboard.writeText.mockClear();
    jest.clearAllMocks();
  });

  test("renders image with correct url and alt text", () => {
    renderWithProviders(
      <FramedImageCard
        imageUrl={mockImageUrl}
        alt={mockAlt}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
    const image = screen.getByAltText(mockAlt);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockImageUrl);
  });

  test("copies image URL when clicked", async () => {
    mockClipboard.writeText.mockResolvedValueOnce();
    const mockTriggerAlert = jest.fn();
    const { useGlobalAlert } = require("../../src/context/GlobalAlertContext");
    const { useDarkMode } = require("../../src/context/DarkModeContext");

    useGlobalAlert.mockReturnValue({ triggerAlert: mockTriggerAlert });
    useDarkMode.mockReturnValue({ isDarkMode: false });

    await act(async () => {
      renderWithProviders(
        <FramedImageCard
          imageUrl={mockImageUrl}
          alt={mockAlt}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );
    });

    const imageFrame = screen.getByTestId("image-frame");
    await act(async () => {
      await fireEvent.click(imageFrame);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockImageUrl);
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Image URL copied to clipboard!",
      "success"
    );
  });

  test("shows error alert when copy fails", async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error("Copy failed"));
    const mockTriggerAlert = jest.fn();
    const { useGlobalAlert } = require("../../src/context/GlobalAlertContext");
    const { useDarkMode } = require("../../src/context/DarkModeContext");

    useGlobalAlert.mockReturnValue({ triggerAlert: mockTriggerAlert });
    useDarkMode.mockReturnValue({ isDarkMode: false });

    await act(async () => {
      renderWithProviders(
        <FramedImageCard
          imageUrl={mockImageUrl}
          alt={mockAlt}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );
    });

    const imageFrame = screen.getByTestId("image-frame");
    await act(async () => {
      await fireEvent.click(imageFrame);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith(mockImageUrl);
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Failed to copy image URL.",
      "danger"
    );
  });

  test("applies dark mode styles when dark mode is enabled", async () => {
    const { useDarkMode } = require("../../src/context/DarkModeContext");
    const { useGlobalAlert } = require("../../src/context/GlobalAlertContext");

    useDarkMode.mockReturnValue({ isDarkMode: true });
    useGlobalAlert.mockReturnValue({ triggerAlert: jest.fn() });

    await act(async () => {
      renderWithProviders(
        <FramedImageCard
          imageUrl={mockImageUrl}
          alt={mockAlt}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );
    });

    const frame = screen.getByTestId("image-frame");
    expect(frame.className).toContain("dark-mode");
  });

  test("calls onDelete when delete button is clicked", () => {
    renderWithProviders(
      <FramedImageCard
        imageUrl={mockImageUrl}
        alt={mockAlt}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalled();
  });

  test("calls onEdit when edit button is clicked", () => {
    renderWithProviders(
      <FramedImageCard
        imageUrl={mockImageUrl}
        alt={mockAlt}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalled();
  });
});
