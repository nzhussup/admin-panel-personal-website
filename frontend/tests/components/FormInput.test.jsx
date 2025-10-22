import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormInput from "../../src/components/FormInput";

describe("FormInput Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders with label and input", () => {
    render(
      <FormInput
        label='Test Label'
        value=''
        onChange={mockOnChange}
        type='text'
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("handles user input", () => {
    render(
      <FormInput
        label='Test Input'
        value=''
        onChange={mockOnChange}
        type='text'
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('renders textarea for type="textarea"', () => {
    render(
      <FormInput
        label='Test Textarea'
        value=''
        onChange={mockOnChange}
        type='textarea'
        rows={3}
      />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("displays provided value", () => {
    const testValue = "Initial Value";
    render(
      <FormInput
        label='Test Value'
        value={testValue}
        onChange={mockOnChange}
        type='text'
      />
    );

    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });
});
