import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModule: true,
    ...originalModule,
    useNavigate: vi.fn(),
    Link: "a",
  };
});

describe("App component", () => {
  it("renders signin + signup without login", () => {
    const loginStatus = false;
    const setLoginStatus = () => {};
    render(<Navbar props={{ loginStatus, setLoginStatus }} />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("renders signin + signup without login", () => {
    const loginStatus = true;
    const setLoginStatus = () => {};
    render(<Navbar props={{ loginStatus, setLoginStatus }} />);
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
