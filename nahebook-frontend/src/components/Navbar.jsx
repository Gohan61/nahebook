import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/Navbar.css";

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
            <Link to={"profile"}>My profile</Link>
            <Link to={"userlist"}>User list</Link>
            <Link to={"feed"}>Feed</Link>
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
