import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ props }) {
  const navigate = useNavigate();

  return (
    <nav>
      <a href="/">Nahebook</a>
      <div className="links">
        {props.loginStatus ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem("Token");
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                props.setLoginStatus(false);
                navigate("/");
              }}
              className="logoutButton"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={"signin"}>Sign in</Link>
            <Link to={"signup"}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
