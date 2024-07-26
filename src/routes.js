import React from "react";

// Admin Imports
import Dashboard from "views/admin/default";
import Collection from "views/admin/collection";

// Auth Imports
import SignIn from "views/auth/SignIn";
import ForgotPassword from "views/auth/ForgotPassword";
import Register from "views/auth/Register";

// Icon Imports
import { MdHome, MdCollections, MdLock } from "react-icons/md";

const routes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Forgot Password",
    layout: "/auth",
    path: "forgot-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ForgotPassword />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <Register />,
  },
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "Collection",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdCollections className="h-6 w-6" />,
    component: <Collection />,
    secondary: true,
  },
];
export default routes;
