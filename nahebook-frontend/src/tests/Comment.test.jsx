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

  fetch("http://localhost:3000/post/new", {
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

describe("Comment", () => {
  it("Should render an error", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const commmentInput = await screen.findByLabelText("New comment:");
    const submit = await screen.findAllByRole("button", { name: "Submit" });

    await userEvent.type(commmentInput, "herekittyherekittyherekittyddddd");

    await user.click(submit[0]);
    const errorDivs = await screen.findAllByTestId("commentErrors");

    expect(errorDivs[0].textContent).not.toBe("");
  });

  it("Should display comment", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const commmentInput = await screen.findByLabelText("New comment:");
    const submit = await screen.findAllByRole("button", { name: "Submit" });
    const showComment = await screen.findAllByRole("button", {
      name: "Show comments",
    });

    await userEvent.type(commmentInput, "kitty");

    await user.click(submit[0]);
    await user.click(showComment[0]);

    expect(await screen.findByText("kitty")).toBeInTheDocument();
  });

  it("Should delete a comment", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const showComment = await screen.findAllByRole("button", {
      name: "Show comments",
    });
    const deleteComment = await screen.findAllByRole("button", {
      name: "Delete comment",
    });

    await user.click(showComment[0]);
    await user.click(deleteComment[0]);

    expect(screen.queryByText("kitty")).not.toBeInTheDocument();
  });
});
