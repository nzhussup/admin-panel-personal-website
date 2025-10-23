import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageSubHeader from "../../src/components/PageSubHeader";

// Mock the child components
jest.mock("../../src/components/BackArrow", () => () => (
  <div data-testid='mock-back-arrow'>Back Arrow</div>
));

jest.mock("../../src/components/SortButton", () => ({ onSort }) => (
  <button data-testid='mock-sort-button' onClick={onSort}>
    Sort
  </button>
));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PageSubHeader Component", () => {
  const mockToggleSort = jest.fn();

  beforeEach(() => {
    mockToggleSort.mockClear();
  });

  test("renders back arrow", () => {
    renderWithRouter(<PageSubHeader toggleSort={mockToggleSort} />);
    expect(screen.getByTestId("mock-back-arrow")).toBeInTheDocument();
  });

  test("renders sort button when showSort is true", () => {
    renderWithRouter(
      <PageSubHeader toggleSort={mockToggleSort} showSort={true} />
    );
    expect(screen.getByTestId("mock-sort-button")).toBeInTheDocument();
  });

  test("does not render sort button when showSort is false", () => {
    renderWithRouter(
      <PageSubHeader toggleSort={mockToggleSort} showSort={false} />
    );
    expect(screen.queryByTestId("mock-sort-button")).not.toBeInTheDocument();
  });

  test("renders children in the center when sort is shown", () => {
    renderWithRouter(
      <PageSubHeader toggleSort={mockToggleSort} showSort={true}>
        <div data-testid='child-content'>Test Content</div>
      </PageSubHeader>
    );
    const childContent = screen.getByTestId("child-content");
    expect(childContent).toBeInTheDocument();
    expect(childContent.parentElement).toHaveClass(
      "flex-grow-1",
      "d-flex",
      "justify-content-center"
    );
  });

  test("renders children aligned to the right when sort is hidden", () => {
    renderWithRouter(
      <PageSubHeader toggleSort={mockToggleSort} showSort={false}>
        <div data-testid='child-content'>Test Content</div>
      </PageSubHeader>
    );
    const childContent = screen.getByTestId("child-content");
    expect(childContent).toBeInTheDocument();
    expect(childContent.parentElement).toHaveClass(
      "ms-auto",
      "d-flex",
      "align-items-center"
    );
  });
});
