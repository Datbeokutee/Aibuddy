import { useState } from "react";
import { LoginScreen, type UserRole } from "./components/LoginScreen";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

export default function App() {
  const [view, setView] = useState<"login" | "dashboard">("login");
  const [loginRole, setLoginRole] = useState<UserRole>("admin");

  const handleLogin = (role: UserRole) => {
    setLoginRole(role);
    setView("dashboard");
  };

  const handleLogout = () => {
    setView("login");
  };

  return (
    <div className="size-full">
      {view === "login" ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        // key={loginRole} đảm bảo DashboardLayout reset khi đăng nhập lại với role khác
        <DashboardLayout
          key={loginRole}
          userRole={loginRole}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
