import { useState } from "react";
import "../stylesheets/App.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function App() {
  const [loginStatus, setLoginStatus] = useState(() => {
    if (localStorage.getItem("Token")) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus }} />
      <Outlet context={{ loginStatus, setLoginStatus }} />
    </>
  );
}

export default App;
