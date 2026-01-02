import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Ej: ['Admin'] o ['Cliente']
  redirectTo?: string; // Ruta alternativa si el rol no coincide
  requireOwnerForClients?: boolean; // Requiere owner=true para Clientes
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
  requireOwnerForClients,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? safeParse(userRaw) : null;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role || user?.statusRole || user?.status; // flexibilidad por backend
    // Si status viene numérico y queremos mapear 1=Activo etc, mantenemos string check aparte
    if (!role || !allowedRoles.includes(String(role))) {
      return <Navigate to={redirectTo || "/"} replace />;
    }

    // Verificar si es Cliente y se requiere owner=true
    if (requireOwnerForClients && String(role) === "Cliente") {
      const owner = user?.owner;
      if (owner !== true) {
        return <Navigate to={redirectTo || "/dashboard"} replace />;
      }
    }
  }

  return <>{children}</>;
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
