import { render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import OtherProfiles from "../components/OtherProfiles";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Userlist from "../components/Userlist";
import Following from "../components/Following";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModule: true,
    ...originalModule,
    Link: "a",
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
      age: 12,
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
      first_name: "fn_peter",
      last_name: "ln_peter",
      username: "peter",
      password: "testing",
      age: 12,
      bio: "bio_peter",
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
      first_name: "fn_manfried",
      last_name: "ln_manfried",
      username: "manfried",
      password: "testing",
      age: 12,
      bio: "bio_manfried",
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

describe("User list", () => {
  it("Should only render other users", async () => {
    render(<Userlist />);

    expect(await screen.findByText(/peter:/)).toBeInTheDocument();
    expect(screen.queryByText(/testing:/)).not.toBeInTheDocument();
  });

  it("Should display user request as pending", async () => {
    const user = userEvent.setup();

    render(<Userlist />);

    const followButton = await screen.findAllByRole("button", {
      name: "Follow",
    });

    await user.click(followButton[0]);
    await user.click(followButton[1]);

    render(<Userlist />);

    expect((await screen.findByTestId("pendingFollow")).textContent).toMatch(
      /peter:/,
    );
  });

  it("Should display user under following after accept", async () => {
    await fetch("http://localhost:3000/user/signin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "manfried",
        password: "testing",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        localStorage.removeItem("Token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.setItem("Token", `Bearer ${res.token}`);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("username", res.username);
      });

    const user = userEvent.setup();

    render(<Userlist />);

    const acceptButton = await screen.findByRole("button", {
      name: "Accept",
    });

    await user.click(acceptButton);

    render(<Userlist />);

    expect((await screen.findByTestId("following")).textContent).toMatch(
      /testing:/,
    );
  });

  it("Should display user under rest after deny", async () => {
    await fetch("http://localhost:3000/user/signin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "peter",
        password: "testing",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        localStorage.removeItem("Token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.setItem("Token", `Bearer ${res.token}`);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("username", res.username);
      });

    const user = userEvent.setup();

    render(<Userlist />);

    const denyButton = await screen.findByRole("button", { name: "Deny" });
    await user.click(denyButton);

    render(<Userlist />);

    expect(await screen.findByTestId("pendingFollow")).toBeEmptyDOMElement();
  });
});
