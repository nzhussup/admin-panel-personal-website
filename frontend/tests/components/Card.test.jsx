import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "../../src/components/Card";

describe("Card Component", () => {
  const mockHandleFunc = jest.fn();
  const defaultProps = {
    title: "Test Card",
    desc: "Test Description",
    handleFunc: mockHandleFunc,
  };

  beforeEach(() => {
    mockHandleFunc.mockClear();
  });

  test("renders card with title", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  test("renders card with image when provided", () => {
    const propsWithImage = {
      ...defaultProps,
      img: "test-image.jpg",
    };
    render(<Card {...propsWithImage} />);

    const image = screen.getByAltText("Test Card");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  test("handles click events when handleFunc is provided", () => {
    render(<Card {...defaultProps} />);

    const cardElement = screen.getByText("Test Card").closest("div.card");
    fireEvent.click(cardElement);

    expect(mockHandleFunc).toHaveBeenCalledTimes(1);
  });

  test("applies custom styles", () => {
    const customStyle = { backgroundColor: "rgb(255, 0, 0)" };
    render(<Card {...defaultProps} style={customStyle} />);

    const cardElement = screen.getByText("Test Card").closest("div.card");
    expect(cardElement).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
  });

  test("renders children when provided", () => {
    const childContent = "Child Content";
    render(
      <Card {...defaultProps}>
        <div>{childContent}</div>
      </Card>
    );

    expect(screen.getByText(childContent)).toBeInTheDocument();
  });
});
