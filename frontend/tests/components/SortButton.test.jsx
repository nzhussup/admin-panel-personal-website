import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortButton from "../../src/components/SortButton";

describe("SortButton Component", () => {
  const mockOnSort = jest.fn();

  beforeEach(() => {
    mockOnSort.mockClear();
  });

  test("renders sort button with text", () => {
    render(<SortButton onSort={mockOnSort} />);
    expect(screen.getByText("Sort")).toBeInTheDocument();
  });

  test("renders funnel icon", () => {
    render(<SortButton onSort={mockOnSort} />);
    const icon = screen.getByTestId("sort-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("bi", "bi-funnel", "me-2");
  });

  test("toggles sort direction and calls onSort with correct boolean", () => {
    render(<SortButton onSort={mockOnSort} />);
    const button = screen.getByRole("button");

    // First click - should be true (ascending)
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenCalledWith(true);

    // Second click - should be false (descending)
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenCalledWith(false);

    // Third click - back to true (ascending)
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenCalledWith(true);

    expect(mockOnSort).toHaveBeenCalledTimes(3);
  });

  test("has correct button styles", () => {
    render(<SortButton onSort={mockOnSort} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "btn",
      "btn-outline-primary",
      "d-flex",
      "align-items-center"
    );
  });

  test("maintains internal state between sorts", () => {
    render(<SortButton onSort={mockOnSort} />);
    const button = screen.getByRole("button");

    // Initial click should pass true
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenLastCalledWith(true);

    // Second click should pass false
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenLastCalledWith(false);

    // State should persist even with rerenders
    button.blur();
    button.focus();
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenLastCalledWith(true);
  });
});
