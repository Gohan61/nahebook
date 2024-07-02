import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./stylesheets/index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "./components/Homepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Homepage /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
