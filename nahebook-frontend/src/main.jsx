import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./stylesheets/index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "./components/Homepage";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Userlist from "./components/Userlist";
import OtherProfiles from "./components/OtherProfiles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "userlist", element: <Userlist /> },
      { path: "userprofiles", element: <OtherProfiles /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
