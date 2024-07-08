import { render, screen, act, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import NewPost from "../components/NewPost";
import { useLocation } from "react-router-dom";
import Feedpage from "../components/Feedpage";

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

  await fetch("http://localhost:3000/post/new", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Token"),
    },
    body: JSON.stringify({
      userId: localStorage.getItem("userId"),
      text: "Test post",
    }),
  });
});

describe("Feed", () => {
  it("Should display loading", async () => {
    render(<Feedpage />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  describe("Post in feed", async () => {
    it("Should render post", async () => {
      render(<Feedpage />);

      expect(await screen.findByText(/Test/)).toBeInTheDocument();
    });
  });

  describe("Renders error", async () => {
    it("Should render error", async () => {
      localStorage.removeItem("userId");
      localStorage.setItem("userId", "621ff30d2a3e781873fcb664");

      render(<Feedpage />);

      expect((await screen.findByTestId("feedErrors")).textContent).not.toBe(
        "",
      );
    });
  });
});
