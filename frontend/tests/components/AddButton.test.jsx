import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddButton from "../../src/components/AddButton";

describe("AddButton Component", () => {
  const mockOpenPopup = jest.fn();

  beforeEach(() => {
    mockOpenPopup.mockClear();
  });

  test("renders add button", () => {
    render(<AddButton openPopup={mockOpenPopup} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("+");
  });

  test("calls openPopup when clicked", () => {
    render(<AddButton openPopup={mockOpenPopup} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockOpenPopup).toHaveBeenCalledTimes(1);
  });

  test("has correct styling", () => {
    render(<AddButton openPopup={mockOpenPopup} />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("btn-floating");
    expect(button).toHaveStyle({
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
      backgroundColor: "#007bff",
      borderRadius: "50%",
    });
  });
});
