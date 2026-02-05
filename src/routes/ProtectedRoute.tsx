// src/routes/ProtectedRoute.tsx (o donde lo tengas)
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";

type Props = {
  children?: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token = authService.getToken();

  if (!token) {
    // tu login está en /admin
    return <Navigate to="/rootrepo" replace state={{ from: location }} />;
  }

  // si lo usas como wrapper -> renderiza children
  if (children) return <>{children}</>;

  // si lo usas como route element con rutas hijas -> Outlet
  return <Outlet />;
}
