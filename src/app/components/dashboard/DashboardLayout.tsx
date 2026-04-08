import { DuyetChiaShePage } from "./DuyetChiaShePage";
import { BaoCaoDonViPage } from "./BaoCaoDonViPage";
import { MakerDashboard } from "./MakerDashboard";
import { CheckerDashboard } from "./CheckerDashboard";
import { LichSuGiaoDichPage } from "./LichSuGiaoDichPage";
import { LicenseBCCSPage } from "./LicenseBCCSPage";
import { BaoCaoDoiSoatPage } from "./BaoCaoDoiSoatPage";
import { useState } from "react";
import { Sidebar, type ActivePage } from "./Sidebar";
import { Header } from "./Header";
import { DashboardHome } from "./DashboardHome";
import { PlaceholderPage } from "./PlaceholderPage";
import { ChiaSeGoiPage } from "./ChiaSeGoiPage";
import { UnitManagementPage } from "./UnitManagementPage";
import { AccountManagementPage } from "./AccountManagementPage";
import { ContentPackagePage } from "./ContentPackagePage";
import { GoiCuocPage } from "./GoiCuocPage";
import ChuongTrinhHocPage from "./ChuongTrinhHocPage";
import DoiTacChuongTrinhPage from "./DoiTacChuongTrinhPage";
import AdminNoiDungPage from "./AdminNoiDungPage";
import HocSinhGoiPage from "./HocSinhGoiPage";
import type { UserRole } from "../LoginScreen";

// ── TRANG MẶC ĐỊNH THEO ROLE ───────────────────────────────────────────────────

const TRANG_MAC_DINH: Record<UserRole, ActivePage> = {
  admin: "dashboard",
  maker: "dashboard",
  checker: "dashboard",
  "doi-tac-noi-dung": "dtnd-chuong-trinh",
  "hoc-sinh": "hs-danh-sach-goi",
};

// ── PROPS ──────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  userRole: UserRole;
  onLogout: () => void;
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

export function DashboardLayout({ userRole: initialRole, onLogout }: DashboardLayoutProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [activePage, setActivePage] = useState<ActivePage>(TRANG_MAC_DINH[initialRole]);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActivePage(TRANG_MAC_DINH[newRole]);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        if (currentRole === "maker")   return <MakerDashboard />;
        if (currentRole === "checker") return <CheckerDashboard />;
        return <DashboardHome />;
      case "unit-management":   return <UnitManagementPage />;
      case "account-management":return <AccountManagementPage />;
      case "content-packages":  return <ContentPackagePage />;
      case "goi-cuoc":          return <GoiCuocPage userRole={currentRole} />;
      case "chuong-trinh-hoc":  return <ChuongTrinhHocPage />;
      case "license-bccs":      return <LicenseBCCSPage />;
      case "bao-cao-doi-soat":  return <BaoCaoDoiSoatPage />;
      case "chia-se-goi":       return <ChiaSeGoiPage userRole={currentRole} />;
      case "lich-su-giao-dich": return <LichSuGiaoDichPage />;
      case "duyet-chia-se":     return <DuyetChiaShePage />;
      case "bao-cao-don-vi":    return <BaoCaoDonViPage />;
      case "dtnd-chuong-trinh": return <DoiTacChuongTrinhPage />;
      case "admin-noi-dung":    return <AdminNoiDungPage />;
      case "hs-danh-sach-goi":  return <HocSinhGoiPage />;
      default:                  return <PlaceholderPage page={activePage} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#F8F9FA" }}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        userRole={currentRole}
        onLogout={onLogout}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          activePage={activePage}
          userRole={currentRole}
          onLogout={onLogout}
          onRoleChange={handleRoleChange}
        />
        <div className="flex-1 overflow-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}