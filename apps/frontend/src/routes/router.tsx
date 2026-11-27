import { createBrowserRouter, Navigate } from "react-router-dom";
import CadastroPage from "../pages/CadastroPage";
import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/LoginPage";
import TutorPage from "../pages/TutorPage";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import PrivateRoutes from "./PrivateRoutes";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/tutor" replace />,
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/cadastro", element: <CadastroPage /> },
        ],
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            element: <AppLayout />,
            children: [{ path: "/tutor", element: <TutorPage /> }],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/tutor" replace />,
      },
    ],
  },
]);

export default router;
