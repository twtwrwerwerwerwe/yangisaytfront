import { Navigate } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = useAdminStore((s) => s.token);
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
