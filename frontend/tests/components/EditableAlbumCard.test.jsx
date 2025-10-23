import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditableAlbumCard from "../../src/components/EditableAlbumCard";
import { DarkModeProvider } from "../../src/context/DarkModeContext";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <DarkModeProvider>{component}</DarkModeProvider>
    </BrowserRouter>
  );
};

describe("EditableAlbumCard Component", () => {
  const mockAlbum = {
    id: "123",
    title: "Test Album",
    description: "Test Description",
    preview_image: "test-image.jpg",
    images_count: 5,
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  test("renders album title and description", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Test Album")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("renders preview image when provided", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const image = screen.getByAltText("Test Album");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  test("displays image count", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const imageCountText = screen.getByText((content, element) => {
      const hasImages = element.textContent === "📸 5 images";
      return hasImages;
    });
    expect(imageCountText).toBeInTheDocument();
  });

  test("navigates to album detail page when clicked", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const card = screen.getByText("Test Album").closest(".card-hover");
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith("/albums/123");
  });

  test("renders edit and delete buttons", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const editButton = screen.getByLabelText("Edit album");
    const deleteButton = screen.getByLabelText("Delete album");

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls onEdit when edit button is clicked", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const editButton = screen.getByLabelText("Edit album");
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockAlbum);
  });

  test("calls onDelete when delete button is clicked", () => {
    renderWithProviders(
      <EditableAlbumCard
        album={mockAlbum}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    const deleteButton = screen.getByLabelText("Delete album");
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockAlbum);
  });
});
