import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import api from "../../api/axios";

jest.mock("../../api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock("../../components/Notes/NoteCard", () => {
  return function MockNoteCard({ note }) {
    return <div>{note.title}</div>;
  };
});

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders dashboard after data loads", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "note1",
            title: "My First Note",
            content: "This is my note",
            tags: ["work"],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Notes App")).toBeInTheDocument();
    });

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
    expect(screen.getByText("New Note")).toBeInTheDocument();
    expect(screen.getByText("My First Note")).toBeInTheDocument();
  });

  test("redirects to login when current user request fails", async () => {
    api.post.mockRejectedValue(new Error("Unauthorized"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/current-user");
    });
  });

  test("shows error when notes fetch fails", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockRejectedValue(new Error("Failed to fetch notes"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch notes")).toBeInTheDocument();
    });
  });

  test("filters notes when searching", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "note1",
            title: "JavaScript Notes",
            content: "Important JS concepts",
            tags: ["coding"],
          },
          {
            _id: "note2",
            title: "Shopping List",
            content: "Buy milk and eggs",
            tags: ["personal"],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("JavaScript Notes")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search notes...");

    await userEvent.type(searchInput, "javascript");

    expect(screen.getByText("JavaScript Notes")).toBeInTheDocument();
    expect(screen.queryByText("Shopping List")).not.toBeInTheDocument();
  });

  test("navigates to new note page", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [],
      },
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("New Note")).toBeInTheDocument();
    });

    const newNoteLink = screen.getByRole("link", {
      name: /new note/i,
    });

    expect(newNoteLink).toHaveAttribute("href", "/notes/new");
  });

  test("profile link points to profile page", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    const profileLink = screen.getByRole("link", {
      name: /profile/i,
    });

    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  test("filters notes when searching by tag", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            title: "React Notes",
            content: "Some React content",
            tags: ["frontend", "react"],
          },
          {
            _id: "2",
            title: "Shopping List",
            content: "Milk and eggs",
            tags: ["personal", "shopping"],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("React Notes")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search notes...");

    await userEvent.type(searchInput, "frontend");

    expect(screen.getByText("React Notes")).toBeInTheDocument();
    expect(screen.queryByText("Shopping List")).not.toBeInTheDocument();
  });

  test("shows message when no notes match the search", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            title: "JavaScript Notes",
            content: "Learning JavaScript",
            tags: ["javascript"],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("JavaScript Notes")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search notes...");

    await userEvent.type(searchInput, "python");

    expect(screen.getByText("No notes match your search.")).toBeInTheDocument();

    expect(screen.queryByText("JavaScript Notes")).not.toBeInTheDocument();
  });

  test("renders notes fetched from API", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            title: "JavaScript Notes",
            content: "Learning JavaScript",
            tags: ["javascript"],
          },
          {
            _id: "2",
            title: "React Notes",
            content: "Learning React",
            tags: ["react"],
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("JavaScript Notes")).toBeInTheDocument();
    });

    expect(screen.getByText("React Notes")).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith("/notes/");
  });

  test("shows empty message when user has no notes", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockResolvedValue({
      data: {
        data: [],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("You don't have any notes yet."),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("New Note")).toBeInTheDocument();
  });

  test("shows error when notes API fails", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockRejectedValue(new Error("Failed to fetch notes"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch notes")).toBeInTheDocument();
    });
  });

  test("shows error when notes API fails", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockRejectedValue(new Error("Failed to fetch notes"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch notes")).toBeInTheDocument();
    });
  });

  test("redirects to login when current user request fails", async () => {
    api.post.mockRejectedValue(new Error("Unauthorized"));

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/current-user");
    });

    expect(api.post).toHaveBeenCalledTimes(1);
  });

  test("shows error when notes API fails", async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          _id: "user123",
          fullName: "Test User",
          email: "test@example.com",
        },
      },
    });

    api.get.mockRejectedValue(new Error("Failed to fetch notes"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch notes")).toBeInTheDocument();
    });
  });
});
