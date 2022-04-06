import React from "react";

import async from "./components/Async";

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";

// Guards
import AuthGuard from "./guards/AuthGuard";

// Auth components
import SignIn from "./pages/auth/SignIn/index";
import SignUp from "./pages/auth/SignUp/index";
import ForgotPassword from "./pages/auth/ForgotPassword/index";
import ResetPassword from "./pages/auth/ResetPassword/index";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

// Page components
import Sales from "./pages/main/Sales";
import Brands from "./pages/main/Brands";

const Profile = async(() => import("./pages/main/Profile"));

const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
  },
  {
    path: "profile",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },
  {
    path: "sales",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Sales />,
      },
    ],
  },
  {
    path: "brands",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Brands />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
