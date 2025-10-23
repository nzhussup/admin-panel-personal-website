import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageFormInput from "../../src/components/ImageFormInput";

describe("ImageFormInput Component", () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: "Upload Images",
    onChange: mockOnChange,
    value: [],
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders upload button with label", () => {
    render(<ImageFormInput {...defaultProps} />);
    expect(screen.getByText("Upload Images")).toBeInTheDocument();
    expect(screen.getByLabelText("Choose files")).toBeInTheDocument();
  });

  test("handles file selection", async () => {
    render(<ImageFormInput {...defaultProps} />);
    const file = new File(["dummy content"], "test-image.png", {
      type: "image/png",
    });
    const input = screen.getByLabelText("Choose files");

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onloadend: null,
      result: "data:image/png;base64,dummybase64",
    };
    global.FileReader = jest.fn(() => mockFileReader);

    // Trigger file selection
    fireEvent.change(input, { target: { files: [file] } });

    // Simulate FileReader load
    mockFileReader.onloadend();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          file: expect.any(File),
          preview: "data:image/png;base64,dummybase64",
        },
      ]);
    });
  });

  test("handles multiple file selection", async () => {
    render(<ImageFormInput {...defaultProps} multiple={true} />);
    const files = [
      new File(["dummy1"], "test1.png", { type: "image/png" }),
      new File(["dummy2"], "test2.png", { type: "image/png" }),
    ];
    const input = screen.getByLabelText("Choose files");

    // Mock FileReader
    const createMockFileReader = (result) => ({
      readAsDataURL: function (file) {
        setTimeout(() => {
          this.result = result;
          this.onloadend();
        }, 0);
      },
    });

    let currentIndex = 0;
    global.FileReader = jest.fn(() => {
      const reader = createMockFileReader(
        `data:image/png;base64,dummy${currentIndex + 1}`
      );
      currentIndex++;
      return reader;
    });

    // Trigger file selection
    fireEvent.change(input, { target: { files } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          file: expect.any(File),
          preview: "data:image/png;base64,dummy1",
        },
        {
          file: expect.any(File),
          preview: "data:image/png;base64,dummy2",
        },
      ]);
    });
  });

  test("removes image preview when delete button is clicked", async () => {
    const initialValue = [
      {
        file: new File(["dummy"], "test.png", { type: "image/png" }),
        preview: "data:image/png;base64,dummy",
      },
    ];

    render(<ImageFormInput {...defaultProps} value={initialValue} />);

    const deleteButton = screen.getByLabelText("Remove image");
    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  test("sets required attribute when specified", () => {
    render(<ImageFormInput {...defaultProps} required={true} />);
    const input = screen.getByLabelText("Choose files");
    expect(input).toHaveAttribute("required");
  });

  test("disables multiple selection when multiple is false", () => {
    render(<ImageFormInput {...defaultProps} multiple={false} />);
    const input = screen.getByLabelText("Choose files");
    expect(input).not.toHaveAttribute("multiple");
  });
});
