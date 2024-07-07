import { render, screen, act, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import NewPost from "../components/NewPost";
import { useLocation } from "react-router-dom";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const loginStatus = true;
  const setLoginStatus = () => {};
  const location = { state: undefined };

  return {
    _esModule: true,
    ...originalModule,
    Outlet: vi.fn(),
    Link: "a",
    useNavigate: vi.fn(),
    useOutletContext: () => [loginStatus, setLoginStatus],
    useLocation: () => location,
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

/* Tests below fail when run concurrently. When either is commented out, tests
pass. Don't know currently how to fix this in Vitest
*/

describe("New post", () => {
  describe("Empty post error", () => {
    it("Should render error on empty post", async () => {
      const user = userEvent.setup();

      render(<NewPost />);

      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);

      expect((await screen.findByTestId("newpostErrors")).textContent).not.toBe(
        "",
      );
    });
  });

  describe("Max length error", () => {
    it("Should render error on too many characters", async () => {
      const user = userEvent.setup();

      render(<NewPost />);

      const input = screen.getByLabelText("Text:");
      await userEvent.clear(input);
      await userEvent.type(
        input,
        "Hello world Hello worldHello worldHello worldHello worldHello world",
      );

      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);

      expect((await screen.findByTestId("newpostErrors")).textContent).not.toBe(
        "",
      );
    });
  });
});
