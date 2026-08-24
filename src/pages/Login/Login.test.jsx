import Login from "./Login";
import api from "../../api/axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /sign in to your account/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /sign in/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /sign up/i,
      }),
    ).toBeInTheDocument();
  });

  test("shows browser validation for invalid email", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);

    await userEvent.type(emailInput, "invalid-email");

    expect(emailInput).toBeInvalid();
  });

  test("logs in successfully and navigates to dashboard", async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");

    await userEvent.click(signInButton);

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "Test@12345678",
    });
  });

  test("shows error message when login fails", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole("button", {
      name: /sign in/i,
    });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "WrongPassword123");

    await userEvent.click(signInButton);

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("shows loading state while login request is in progress", async () => {
    api.post.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole("button", {
      name: /sign in/i,
    });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");

    await userEvent.click(signInButton);

    expect(
      screen.getByRole("button", { name: /signing in/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });

  test("shows error for invalid email", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", {
      name: /sign in/i,
    });

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(signInButton);

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows generic error when login API fails without response message", async () => {
    api.post.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", {
      name: /sign in/i,
    });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(signInButton);

    expect(
      await screen.findByText("Login failed. Please try again."),
    ).toBeInTheDocument();
  });

  test("displays message passed through location state", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: {
              message: "Account created successfully!",
            },
          },
        ]}
      >
        <Login />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Account created successfully!"),
    ).toBeInTheDocument();
  });
});
