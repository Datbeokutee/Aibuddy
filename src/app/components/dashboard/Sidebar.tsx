import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Key,
  BarChart3,
  Share2,
  History,
  ClipboardList,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  LogOut,
  Shield,
  Edit3,
  CheckSquare,
  Tags,
  BookOpen,
  GraduationCap,
  FileText,
  BookMarked,
  FlaskConical,
} from "lucide-react";
import type { UserRole } from "../LoginScreen";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

export type ActivePage =
  | "dashboard"
  // Admin Đối tác
  | "unit-management"
  | "account-management"
  | "content-packages"
  | "goi-cuoc"
  | "chuong-trinh-hoc"
  | "license-bccs"
  | "bao-cao-doi-soat"
  // Người thực hiện (Maker)
  | "chia-se-goi"
  | "lich-su-giao-dich"
  // Người duyệt (Checker)
  | "duyet-chia-se"
  | "bao-cao-don-vi"
  // Đối tác Nội dung
  | "dtnd-chuong-trinh"
  | "dtnd-bai-giang"
  | "dtnd-bai-kiem-tra"
  | "dtnd-ngan-hang-cau-hoi"
  | "dtnd-tai-lieu"
  // Học sinh
  | "hs-danh-sach-goi"
  | "hs-lich-su-thanh-toan";

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: number;
  moTa?: string;
}

// ── CẤU HÌNH MENU THEO ROLE ────────────────────────────────────────────────────

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  admin: [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: LayoutDashboard,
      moTa: "Tổng hợp hoạt động",
    },
    {
      id: "unit-management",
      label: "Quản lý đơn vị",
      icon: Building2,
      badge: 3,
      moTa: "Quản lý đơn vị nội dung",
    },
    {
      id: "chuong-trinh-hoc",
      label: "Quản lý Chương trình học",
      icon: BookOpen,
      moTa: "Kho nội dung & gán gói cước",
    },
    {
      id: "goi-cuoc",
      label: "Quản lý Gói cước",
      icon: Tags,
      moTa: "Mapping gói cước BCCS",
    },
    {
      id: "license-bccs",
      label: "Quản lý License & BCCS",
      icon: Key,
      moTa: "Đồng bộ license BCCS",
    },
    {
      id: "dtnd-chuong-trinh",
      label: "Quản lý Nội dung",
      icon: GraduationCap,
      moTa: "Danh mục nội dung",
    },
    {
      id: "account-management",
      label: "Phân quyền",
      icon: Users,
      moTa: "Phân quyền người dùng",
    },
    {
      id: "bao-cao-doi-soat",
      label: "Báo cáo đối soát",
      icon: BarChart3,
      moTa: "Báo cáo phân tích chi tiết",
    },
  ],
  maker: [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: LayoutDashboard,
      moTa: "Tổng hợp hoạt động",
    },
    {
      id: "chia-se-goi",
      label: "Chia sẻ gói",
      icon: Share2,
      badge: 2,
      moTa: "Khởi tạo lệnh chia sẻ",
    },
    {
      id: "lich-su-giao-dich",
      label: "Lịch sử giao dịch",
      icon: History,
      moTa: "Theo dõi giao dịch",
    },
  ],
  checker: [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: LayoutDashboard,
      moTa: "Tổng hợp hoạt động",
    },
    {
      id: "duyet-chia-se",
      label: "Duyệt chia sẻ",
      icon: ClipboardList,
      badge: 4,
      moTa: "Phê duyệt lệnh chia sẻ",
    },
    {
      id: "bao-cao-don-vi",
      label: "Báo cáo đơn vị",
      icon: PieChart,
      moTa: "Thống kê theo đơn vị",
    },
  ],
  "hoc-sinh": [
    {
      id: "hs-danh-sach-goi",
      label: "Danh sách gói",
      icon: BookOpen,
      moTa: "Xem và mua gói học tập",
    },
    {
      id: "hs-lich-su-thanh-toan",
      label: "Lịch sử thanh toán",
      icon: History,
      moTa: "Lịch sử mua gói",
    },
  ],
  "doi-tac-noi-dung": [
    {
      id: "dtnd-chuong-trinh",
      label: "Quản lý Nội dung",
      icon: GraduationCap,
      moTa: "Danh mục nội dung",
    },
    {
      id: "dtnd-bai-giang",
      label: "Bài giảng",
      icon: BookMarked,
      moTa: "Quản lý bài giảng",
    },
    {
      id: "dtnd-bai-kiem-tra",
      label: "Bài kiểm tra",
      icon: FileText,
      moTa: "Quản lý bài kiểm tra",
    },
    {
      id: "dtnd-ngan-hang-cau-hoi",
      label: "Ngân hàng câu hỏi",
      icon: FlaskConical,
      moTa: "Kho câu hỏi kiểm tra",
    },
    {
      id: "dtnd-tai-lieu",
      label: "Tài liệu",
      icon: BookOpen,
      moTa: "Tài liệu học tập",
    },
  ],
};

// ── CẤU HÌNH ROLE ──────────────────────────────────────────────────────────────

const ROLE_INFO: Record<
  UserRole,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  admin: {
    label: "Admin Đối tác",
    color: "#005CB6",
    bg: "rgba(0,92,182,0.08)",
    border: "rgba(0,92,182,0.18)",
    icon: Shield,
  },
  maker: {
    label: "Người thực hiện",
    color: "#0284C7",
    bg: "rgba(2,132,199,0.08)",
    border: "rgba(2,132,199,0.18)",
    icon: Edit3,
  },
  checker: {
    label: "Người duyệt",
    color: "#0F766E",
    bg: "rgba(15,118,110,0.08)",
    border: "rgba(15,118,110,0.18)",
    icon: CheckSquare,
  },
  "doi-tac-noi-dung": {
    label: "Đối tác Nội dung",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.18)",
    icon: Package,
  },
  "hoc-sinh": {
    label: "Học sinh",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.18)",
    icon: GraduationCap,
  },
};

// ── HỒ SƠ NGƯỜI DÙNG DEMO ──────────────────────────────────────────────────────

const HO_SO_NGUOI_DUNG: Record<
  UserRole,
  { ten: string; donVi: string; vietTat: string; mauNen: string }
> = {
  admin: {
    ten: "Nguyễn Văn An",
    donVi: "NXB Phương Nam",
    vietTat: "NA",
    mauNen: "#005CB6",
  },
  maker: {
    ten: "Trần Thị Bình",
    donVi: "NXB Phương Nam",
    vietTat: "TB",
    mauNen: "#0284C7",
  },
  checker: {
    ten: "Lê Minh Châu",
    donVi: "NXB Phương Nam",
    vietTat: "MC",
    mauNen: "#0F766E",
  },
  "doi-tac-noi-dung": {
    ten: "Trần Minh Đức",
    donVi: "Đối tác VTS",
    vietTat: "TD",
    mauNen: "#7C3AED",
  },
  "hoc-sinh": {
    ten: "Nguyễn Minh Khoa",
    donVi: "THPT Chu Văn An",
    vietTat: "MK",
    mauNen: "#059669",
  },
};

// ── PROPS ──────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  userRole: UserRole;
  onLogout: () => void;
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

export function Sidebar({ activePage, onNavigate, userRole, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = NAV_CONFIG[userRole];
  const roleInfo = ROLE_INFO[userRole];
  const hoSo = HO_SO_NGUOI_DUNG[userRole];
  const RoleIcon = roleInfo.icon;

  return (
    <aside
      className="relative flex flex-col h-full flex-shrink-0"
      style={{
        width: collapsed ? 72 : 256,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        background: "#fff",
        borderRight: "1px solid #EEF0F4",
        boxShadow: "2px 0 16px rgba(0,0,0,0.04)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* ── LOGO ── */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ height: 72, borderBottom: "1px solid #EEF0F4", flexShrink: 0 }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #005CB6 0%, #0074E4 100%)",
            boxShadow: "0 4px 12px rgba(0,92,182,0.3)",
          }}
        >
          <Globe size={18} color="#fff" strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div
              style={{
                color: "#005CB6",
                fontSize: "0.92rem",
                fontWeight: 800,
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              K12Online
            </div>
            <div
              style={{
                color: "#94A3B8",
                fontSize: "0.58rem",
                whiteSpace: "nowrap",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Phân phối Nội dung
            </div>
          </div>
        )}
      </div>

      {/* ── NÚT THU GỌN ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute z-10 flex items-center justify-center transition-all duration-150"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          border: "1.5px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          cursor: "pointer",
          top: 48,
          right: -12,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#F0F5FF";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#005CB6";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
        }}
      >
        {collapsed ? (
          <ChevronRight size={12} color="#005CB6" />
        ) : (
          <ChevronLeft size={12} color="#005CB6" />
        )}
      </button>

      {/* ── BADGE ROLE ── */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-1">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: roleInfo.bg,
              border: `1px solid ${roleInfo.border}`,
            }}
          >
            <div
              className="flex items-center justify-center w-5 h-5 rounded-lg flex-shrink-0"
              style={{ background: roleInfo.color }}
            >
              <RoleIcon size={11} color="#fff" strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: roleInfo.color,
                whiteSpace: "nowrap",
              }}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>
      )}

      {/* ── NHÃN ĐIỀU HƯỚNG ── */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1.5">
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 800,
              color: "#CBD5E1",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Chức năng
          </span>
        </div>
      )}
      {collapsed && <div style={{ height: 16 }} />}

      {/* ── DANH SÁCH MENU ── */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto" style={{ paddingBottom: 8 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center rounded-xl transition-all duration-150 relative group"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "11px 0" : "9px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive
                  ? `linear-gradient(135deg, ${roleInfo.bg}, ${roleInfo.bg})`
                  : "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,92,182,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {/* Thanh active bên trái */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                  style={{ width: 3, height: 28, background: roleInfo.color }}
                />
              )}

              {/* Icon wrapper */}
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-150"
                style={{
                  width: 34,
                  height: 34,
                  background: isActive ? roleInfo.color : "transparent",
                }}
              >
                <Icon
                  size={17}
                  color={isActive ? "#fff" : "#94A3B8"}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </div>

              {!collapsed && (
                <>
                  <div className="flex-1 text-left overflow-hidden">
                    <div
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? roleInfo.color : "#374151",
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </div>
                  </div>

                  {/* Badge */}
                  {item.badge !== undefined && (
                    <span
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        background: isActive ? roleInfo.color : roleInfo.bg,
                        color: isActive ? "#fff" : roleInfo.color,
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        minWidth: 20,
                        height: 20,
                        padding: "0 5px",
                        border: `1px solid ${isActive ? "transparent" : roleInfo.border}`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── PHẦN CUỐI: CÀI ĐẶT & ĐĂNG XUẤT ── */}
      <div
        className="px-2 py-2 space-y-0.5"
        style={{ borderTop: "1px solid #EEF0F4", flexShrink: 0 }}
      >
        {/* Cài đặt */}
        <button
          className="w-full flex items-center rounded-xl transition-all duration-150"
          style={{
            gap: collapsed ? 0 : 10,
            padding: collapsed ? "10px 0" : "9px 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
          }
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 34, height: 34 }}
          >
            <Settings size={16} color="#94A3B8" strokeWidth={1.8} />
          </div>
          {!collapsed && (
            <span style={{ fontSize: "0.84rem", fontWeight: 500, color: "#64748B" }}>
              Cài đặt hệ thống
            </span>
          )}
        </button>

        {/* Đng xuất */}
        <button
          onClick={onLogout}
          className="w-full flex items-center rounded-xl transition-all duration-150"
          style={{
            gap: collapsed ? 0 : 10,
            padding: collapsed ? "10px 0" : "9px 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(212,24,61,0.05)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
          }
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 34, height: 34 }}
          >
            <LogOut size={16} color="#D4183D" strokeWidth={1.8} />
          </div>
          {!collapsed && (
            <span style={{ fontSize: "0.84rem", fontWeight: 500, color: "#D4183D" }}>
              Đăng xuất
            </span>
          )}
        </button>
      </div>

      {/* ── HỒ SƠ NGƯỜI DÙNG ── */}
      {!collapsed && (
        <div
          className="px-3 py-3"
          style={{ borderTop: "1px solid #EEF0F4", flexShrink: 0 }}
        >
          <div
            className="flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-150"
            style={{ background: "#F8F9FA", cursor: "default" }}
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg, ${hoSo.mauNen} 0%, ${hoSo.mauNen}cc 100%)`,
                boxShadow: `0 2px 8px ${hoSo.mauNen}40`,
              }}
            >
              <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 800 }}>
                {hoSo.vietTat}
              </span>
            </div>
            {/* Thông tin */}
            <div className="flex-1 overflow-hidden">
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {hoSo.ten}
              </div>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "#94A3B8",
                  whiteSpace: "nowrap",
                  marginTop: 1,
                }}
              >
                {hoSo.donVi}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}