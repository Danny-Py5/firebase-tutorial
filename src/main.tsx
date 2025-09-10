import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  // BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Dashboard from "./Dashboard.tsx";
import Signup from "./Signup.tsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
  },
  {
    element: <Signup />,
    path: "/signup",
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
