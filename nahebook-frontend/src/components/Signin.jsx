import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "../stylesheets/Forms.css";

export default function Signin() {
  const { setLoginStatus } = useOutletContext();
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  const [signinForm, setSigninForm] = useState({
    username: "",
    password: "",
  });

  const handleSignin = (event) => {
    event.preventDefault();

    fetch("https://nahebook-backend.fly.dev/user/signin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signinForm.username,
        password: signinForm.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.token !== undefined) {
          localStorage.setItem("Token", `Bearer ${res.token}`);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("username", res.username);
          setLoginStatus(true);
          navigate("/");
        } else if (res.message === "Validation failed") {
          throw res.errors.errors;
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  const guestSignin = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/user/signin", {
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
        if (res.token !== undefined) {
          localStorage.setItem("Token", `Bearer ${res.token}`);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("username", res.username);
          setLoginStatus(true);
          navigate("/");
        } else if (res.message === "Validation failed") {
          throw res.errors.errors;
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="signinContainer">
      <h2>Sign in</h2>
      <div className="errors" data-testid="signinErrors">
        {typeof error === "object" ? (
          error.map((item) => <p key={item.msg}>{item.msg}</p>)
        ) : typeof error === "string" ? (
          <p className="error">{error}</p>
        ) : (
          ""
        )}
      </div>
      <form action="" method="post" className="signinForm">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={signinForm.username}
          onChange={(e) =>
            setSigninForm({ ...signinForm, username: e.target.value })
          }
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          value={signinForm.password}
          onChange={(e) =>
            setSigninForm({ ...signinForm, password: e.target.value })
          }
        />
        <button onClick={(e) => handleSignin(e)}>Submit</button>
        <button onClick={(e) => guestSignin(e)}>Guest sign in</button>
      </form>
    </div>
  );
}
