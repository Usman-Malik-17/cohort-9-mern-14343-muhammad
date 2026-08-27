import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import api from "../../api/axios";

jest.mock("../../api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

import Signup from "./Signup";

describe("Signup Page", () => {
  test("renders signup form correctly", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /create account/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/enter full name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/enter email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/enter password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /login/i,
      }),
    ).toBeInTheDocument();
  });

  test("shows error for invalid name", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Usman123");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Test@12345678");

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(
      screen.getByText("Only alphabets are allowed in name"),
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows browser validation for invalid email", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Test@12345678");

    expect(emailInput).toBeInvalid();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows error for invalid name", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Test123");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Test@12345678");

    const createAccountButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await userEvent.click(createAccountButton);

    expect(
      screen.getByText("Only alphabets are allowed in name"),
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows error when password is less than 12 characters", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@123");
    await userEvent.type(confirmPasswordInput, "Test@123");

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(
      screen.getByText("Password must be at least 12 characters long"),
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("shows error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Different@12345678");

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test("signs up successfully and navigates to login", async () => {
    api.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "  Test User  ");
    await userEvent.type(emailInput, "  TEST@EXAMPLE.COM  ");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Test@12345678");

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(api.post).toHaveBeenCalledWith("/auth/register", {
      email: "test@example.com",
      fullName: "Test User",
      password: "Test@12345678",
    });
  });

  test("shows error message when signup fails", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/enter full name/i);
    const emailInput = screen.getByLabelText(/enter email address/i);
    const passwordInput = screen.getByLabelText(/enter password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Test@12345678");
    await userEvent.type(confirmPasswordInput, "Test@12345678");

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });

  test("shows loading state while signup request is in progress", async () => {
    let resolveRequest;

    api.post.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    await userEvent.type(
      screen.getByLabelText(/enter full name/i),
      "Test User",
    );

    await userEvent.type(
      screen.getByLabelText(/enter email address/i),
      "test@example.com",
    );

    await userEvent.type(
      screen.getByLabelText(/enter password/i),
      "Test@12345678",
    );

    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "Test@12345678",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(
      await screen.findByRole("button", {
        name: /creating account/i,
      }),
    ).toBeDisabled();

    resolveRequest({
      data: {
        success: true,
      },
    });
  });

  test("toggles password visibility", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/enter password/i);

    const toggleButtons = screen.getAllByRole("button");

    // First toggle button is for password visibility
    const passwordToggle = toggleButtons[0];

    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(passwordToggle);

    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.click(passwordToggle);

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggles confirm password visibility", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    const toggleButtons = screen.getAllByRole("button");

    // Second toggle button is for confirm password
    const confirmPasswordToggle = toggleButtons[1];

    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    await userEvent.click(confirmPasswordToggle);

    expect(confirmPasswordInput).toHaveAttribute("type", "text");

    await userEvent.click(confirmPasswordToggle);

    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });
});
