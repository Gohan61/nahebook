import { render, screen, act, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const loginStatus = true;
  const setLoginStatus = () => {};

  return {
    _esModule: true,
    ...originalModule,
    Outlet: vi.fn(),
    Link: "a",
    useNavigate: vi.fn(),
    useOutletContext: () => [loginStatus, setLoginStatus],
  };
});

beforeAll(async () => {
  await fetch("http://localhost:3000/user/signup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: "fn_testing",
      last_name: "ln_testing",
      username: "testing",
      password: "testing",
      age: 89,
      bio: "bio_testing",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.message === "You are signed up") {
        console.log("Signup sucess");
      }
    });

  await fetch("http://localhost:3000/user/signup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: "testing",
      last_name: "testing",
      username: "peter",
      password: "testing",
      age: 12,
      bio: "testing",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.message === "You are signed up") {
        console.log("Signup sucess");
      }
    });

  await fetch("http://localhost:3000/user/signin", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "testing",
      password: "testing",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      localStorage.setItem("Token", `Bearer ${res.token}`);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("username", res.username);
    });
});

describe("Profile information", () => {
  it("Should display user profile information", async () => {
    render(<Profile />);

    const avatar = await screen.findByAltText("Avatar of your user profile");

    expect(await screen.findByText("fn_testing")).toBeInTheDocument();
    expect(await screen.findByText("ln_testing")).toBeInTheDocument();
    expect(await screen.findByText("testing")).toBeInTheDocument();
    expect(await screen.findByText("89")).toBeInTheDocument();
    expect(avatar.src).toMatch(/https/);
    expect(await screen.findByText("bio_testing")).toBeInTheDocument();
  });
});

describe("Update profile", () => {
  it("Should update profile information", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const updateButton = await screen.findByRole("button", {
      name: "Update profile",
    });

    await user.click(updateButton);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");

    await userEvent.clear(first_nameInput);
    await userEvent.type(first_nameInput, "fn_update");

    await userEvent.clear(last_nameInput);
    await userEvent.type(last_nameInput, "ln_update");

    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, "testing");

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "testing2");

    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, "166");

    await userEvent.clear(bioInput);
    await userEvent.type(bioInput, "bio_update");

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await user.click(submitButton);

    await act(async () => {
      render(<Profile />);
    });

    const avatar = await screen.findByAltText("Avatar of your user profile");

    expect(await screen.findByText(/fn_update/)).toBeInTheDocument();
    expect(await screen.findByText(/ln_update/)).toBeInTheDocument();
    expect(await screen.findByText(/testing/)).toBeInTheDocument();
    expect(await screen.findByText(/166/)).toBeInTheDocument();
    expect(avatar.src).toMatch(/https/);
    expect(await screen.findByText(/bio_update/)).toBeInTheDocument();
  });

  it("Should display validation errors", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const updateButton = await screen.findByRole("button", {
      name: "Update profile",
    });

    await user.click(updateButton);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");

    await userEvent.clear(first_nameInput);
    await userEvent.clear(last_nameInput);
    await userEvent.clear(usernameInput);
    await userEvent.clear(passwordInput);
    await userEvent.clear(ageInput);
    await userEvent.clear(bioInput);

    await userEvent.type(first_nameInput, " ");
    await userEvent.type(last_nameInput, " ");
    await userEvent.type(usernameInput, " ");
    await userEvent.type(passwordInput, " ");
    await userEvent.type(ageInput, "aa");
    await userEvent.type(bioInput, " ");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    render(<Profile />);
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
    expect(await screen.findByText("Age must be a number")).toBeInTheDocument();
    expect(
      await screen.findByText("Bio must be between one and 200 characters"),
    ).toBeInTheDocument();
  });

  it("Should show error that username exists", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const updateButton = await screen.findByRole("button", {
      name: "Update profile",
    });

    await user.click(updateButton);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");

    // Tests somehow skip the first clear method
    // resulting in the first input not to be cleared
    // That is why clear method is repeated for first_nameInput
    await userEvent.clear(first_nameInput);
    await userEvent.clear(first_nameInput);
    await userEvent.clear(last_nameInput);
    await userEvent.clear(usernameInput);
    await userEvent.clear(passwordInput);
    await userEvent.clear(ageInput);
    await userEvent.clear(bioInput);

    await userEvent.type(first_nameInput, "Testing");
    await userEvent.type(last_nameInput, "Testing");
    await userEvent.type(usernameInput, "peter");
    await userEvent.type(passwordInput, "testing");
    await userEvent.type(ageInput, "12");
    await userEvent.type(bioInput, "Testing testing testing testing testing");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    render(<Profile />);

    expect(
      await screen.findByText("Username already exists"),
    ).toBeInTheDocument();
  });
});
