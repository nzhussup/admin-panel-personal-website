import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../src/components/BackArrow";

// Mock react-router-dom's useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("BackArrow Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    mockNavigate.mockClear();
  });

  test("renders back button", () => {
    render(<BackArrow />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("navigates back when clicked", () => {
    render(<BackArrow />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("has correct styling", () => {
    render(<BackArrow />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass(
      "btn",
      "btn-outline-primary",
      "d-flex",
      "align-items-center"
    );
    expect(button).toHaveStyle({
      fontSize: "1rem",
      padding: "0.375rem 0.75rem",
    });
  });

  test("renders back arrow icon", () => {
    render(<BackArrow />);
    const icon = screen.getByText("Back");
    expect(icon).toBeInTheDocument();
  });
});
