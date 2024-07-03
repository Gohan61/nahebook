import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const loginStatus = false;
  const setLoginStatus = () => {};

  return {
    _esModule: true,
    ...originalModule,
    useOutletContext: () => [loginStatus, setLoginStatus],
    useNavigate: vi.fn(),
  };
});

describe("Signup", () => {
  it("Should display the validation errors", async () => {
    const user = userEvent.setup();

    render(<Signup />);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const bioInput = screen.getByLabelText("Bio:");
    const submitButton = screen.getByText("Submit");

    await userEvent.type(first_nameInput, " ");
    await userEvent.type(last_nameInput, " ");
    await userEvent.type(usernameInput, " ");
    await userEvent.type(passwordInput, " ");
    await userEvent.type(bioInput, " ");

    await user.click(submitButton);

    expect(
      await screen.findByText("First name must be between 2 and 50 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Last name must be between 2 and 50 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Username must be between 5 and 20 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be between 5 and 80 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Bio must be between one and 200 characters"),
    ).toBeInTheDocument();
  });

  it("Should sign user up", async () => {
    const user = userEvent.setup();

    render(<Signup />);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");
    const submitButton = screen.getByText("Submit");

    await userEvent.type(first_nameInput, "testing");
    await userEvent.type(last_nameInput, "testing");
    await userEvent.type(usernameInput, "testing");
    await userEvent.type(passwordInput, "testing");
    await userEvent.type(ageInput, "12");
    await userEvent.type(bioInput, "testing testing testing");

    await user.click(submitButton);

    expect(await screen.findByTestId("signupErrors")).toBeEmpty();
  });
});

describe("Signin", () => {
  it("Should display validation errors", async () => {
    const user = userEvent.setup();

    render(<Signin />);

    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const submitButton = screen.getByText("Submit");

    await userEvent.type(usernameInput, " ");
    await userEvent.type(passwordInput, " ");

    await user.click(submitButton);

    expect(await screen.findByText("Username must be at least 5 characters"));
    expect(await screen.findByText("Password must be at least 5 characters"));
  });

  it("Should log user in", async () => {
    const user = userEvent.setup();

    render(<Signin />);

    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const submitButton = screen.getByText("Submit");

    await userEvent.type(usernameInput, "testing");
    await userEvent.type(passwordInput, "testing");

    await user.click(submitButton);

    expect(await screen.findByTestId("signinErrors")).toBeEmptyDOMElement();
  });
});
