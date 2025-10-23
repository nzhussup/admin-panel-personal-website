import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditableCard from "../../src/components/EditableCard";
import { DarkModeProvider } from "../../src/context/DarkModeContext";

const renderWithDarkMode = (component) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("EditableCard Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const defaultProps = {
    title: "Test Card",
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  test("renders card with title", () => {
    renderWithDarkMode(<EditableCard {...defaultProps} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  test("renders children content", () => {
    renderWithDarkMode(
      <EditableCard {...defaultProps}>
        <div>Test Content</div>
      </EditableCard>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("calls onEdit when card is clicked", () => {
    renderWithDarkMode(<EditableCard {...defaultProps} />);
    const card = screen.getByText("Test Card").closest(".card");
    fireEvent.click(card);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  test("does not throw error when onEdit is not provided", () => {
    const { onEdit, ...propsWithoutEdit } = defaultProps;
    renderWithDarkMode(<EditableCard {...propsWithoutEdit} />);
    const card = screen.getByText("Test Card").closest(".card");
    expect(() => fireEvent.click(card)).not.toThrow();
  });
});
