import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExportButton from "../../src/components/ExportButton";

describe("ExportButton Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders with default text", () => {
    render(<ExportButton onClick={mockOnClick} />);
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  test("renders with custom text", () => {
    render(<ExportButton onClick={mockOnClick} text='Download Data' />);
    expect(screen.getByText("Download Data")).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", () => {
    render(<ExportButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("renders download icon", () => {
    render(<ExportButton onClick={mockOnClick} />);
    const icon = screen.getByTestId("export-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("bi", "bi-download", "me-2");
  });

  test("handles null onClick prop", () => {
    render(<ExportButton />);
    const button = screen.getByRole("button");
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  test("has correct button styles", () => {
    render(<ExportButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "btn",
      "btn-outline-primary",
      "d-flex",
      "align-items-center"
    );
  });
});
