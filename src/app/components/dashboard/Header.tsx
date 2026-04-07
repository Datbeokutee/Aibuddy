import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  HelpCircle,
  X,
  Shield,
  Edit3,
  CheckSquare,
  RefreshCcw,
  Check,
  Building,
  Package,
} from "lucide-react";
import type { ActivePage } from "./Sidebar";
import type { UserRole } from "../LoginScreen";

// ── NHÃN TRANG ────────────────────────────────────────────────────────────────

const PAGE_LABELS: Record<ActivePage, string> = {
  dashboard: "Tổng quan",
  "unit-management": "Quản lý đơn vị",
  "account-management": "Quản lý tài khoản",
  "content-packages": "Gói nội dung",
  "goi-cuoc": "Quản lý gói cước",
  "chuong-trinh-hoc": "Quản lý chương trình học",
  "license-bccs": "Quản lý License & BCCS",
  "bao-cao-doi-soat": "Báo cáo đối soát",
  "chia-se-goi": "Chia sẻ gói",
  "lich-su-giao-dich": "Lịch sử giao dịch",
  "duyet-chia-se": "Duyệt chia sẻ",
  "bao-cao-don-vi": "Báo cáo đơn vị",
  "dtnd-chuong-trinh": "Nội dung học",
  "dtnd-bai-giang": "Bài giảng",
  "dtnd-bai-kiem-tra": "Bài kiểm tra",
  "dtnd-ngan-hang-cau-hoi": "Ngân hàng câu hỏi",
  "dtnd-tai-lieu": "Tài liệu",
  "hs-danh-sach-goi": "Danh sách gói",
  "hs-lich-su-thanh-toan": "Lịch sử thanh toán",
};

const PAGE_SUBTITLES: Record<ActivePage, string> = {
  dashboard: "Tổng hợp hoạt động phân phối nội dung theo thời gian thực",
  "unit-management": "Quản lý toàn bộ đơn vị nội dung theo môn học và khối lớp",
  "account-management": "Phân quyền và quản lý tài khoản người dùng hệ thống",
  "content-packages": "Cấu hình gói nội dung phân phối đến các trường học",
  "goi-cuoc": "Cấu hình và mapping gói cước thương mại với hệ thống BCCS",
  "chuong-trinh-hoc": "Khai báo kho nội dung chuyên môn và liên kết với Gói cước",
  "license-bccs": "Đồng bộ license và quản lý hạn mức BCCS với đối tác",
  "bao-cao-doi-soat": "Tạo và tải xuống báo cáo đối soát phân phối nội dung",
  "chia-se-goi": "Khởi tạo và theo dõi lệnh chia sẻ gói nội dung",
  "lich-su-giao-dich": "Xem toàn bộ lịch sử giao dịch chia sẻ gói",
  "duyet-chia-se": "Xem xét và phê duyệt các lệnh chia sẻ đang chờ duyệt",
  "bao-cao-don-vi": "Thống kê và báo cáo hoạt động theo từng đơn vị",
  "dtnd-chuong-trinh": "Danh mục nội dung học trên hệ thống K12Online",
  "dtnd-bai-giang": "Quản lý nội dung bài giảng theo nội dung học",
  "dtnd-bai-kiem-tra": "Tạo và quản lý bài kiểm tra đánh giá học sinh",
  "dtnd-ngan-hang-cau-hoi": "Kho câu hỏi phục vụ kiểm tra và đánh giá",
  "dtnd-tai-lieu": "Tài liệu tham khảo và học tập bổ trợ",
  "hs-danh-sach-goi": "Xem và mua các gói chương trình học phù hợp",
  "hs-lich-su-thanh-toan": "Lịch sử các giao dịch mua gói học tập",
};

// ── CẤU HÌNH ROLE ─────────────────────────────────────────────────────────────

interface RoleOption {
  id: UserRole;
  label: string;
  moTa: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

const DANH_SACH_ROLE: RoleOption[] = [
  {
    id: "admin",
    label: "Admin Đối tác",
    moTa: "Toàn quyền quản trị hệ thống",
    icon: Shield,
    color: "#005CB6",
    bg: "rgba(0,92,182,0.07)",
    border: "rgba(0,92,182,0.2)",
  },
  {
    id: "maker",
    label: "Người thực hiện",
    moTa: "Khởi tạo lệnh chia sẻ gói",
    icon: Edit3,
    color: "#0284C7",
    bg: "rgba(2,132,199,0.07)",
    border: "rgba(2,132,199,0.2)",
  },
  {
    id: "checker",
    label: "Người duyệt",
    moTa: "Phê duyệt lệnh chia sẻ",
    icon: CheckSquare,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.07)",
    border: "rgba(15,118,110,0.2)",
  },
  {
    id: "doi-tac-noi-dung",
    label: "Đối tác Nội dung",
    moTa: "Quản lý nội dung học",
    icon: Package,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.2)",
  },
  {
    id: "hoc-sinh",
    label: "Học sinh",
    moTa: "Xem & mua gói học tập",
    icon: Building,
    color: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.2)",
  },
];

// ── HỒ SƠ NGƯỜI DÙNG ──────────────────────────────────────────────────────────

const HO_SO: Record<
  UserRole,
  { ten: string; email: string; donVi: string; vietTat: string; mauNen: string }
> = {
  admin: {
    ten: "Nguyễn Văn An",
    email: "an.nguyen@phuongnam.com.vn",
    donVi: "NXB Phương Nam",
    vietTat: "NA",
    mauNen: "#005CB6",
  },
  maker: {
    ten: "Trần Thị Bình",
    email: "binh.tran@phuongnam.com.vn",
    donVi: "NXB Phương Nam",
    vietTat: "TB",
    mauNen: "#0284C7",
  },
  checker: {
    ten: "Lê Minh Châu",
    email: "chau.le@phuongnam.com.vn",
    donVi: "NXB Phương Nam",
    vietTat: "MC",
    mauNen: "#0F766E",
  },
  "doi-tac-noi-dung": {
    ten: "Trần Minh Đức",
    email: "duc.tran@vts.edu.vn",
    donVi: "Đối tác VTS",
    vietTat: "TD",
    mauNen: "#7C3AED",
  },
  "hoc-sinh": {
    ten: "Nguyễn Minh Khoa",
    email: "khoa.nguyen@thpt-cva.edu.vn",
    donVi: "THPT Chu Văn An",
    vietTat: "MK",
    mauNen: "#059669",
  },
};

// ── THÔNG BÁO MẪU ─────────────────────────────────────────────────────────────

const THONG_BAO_DATA = [
  {
    id: 1,
    text: "Đồng bộ BCCS hoàn thành thành công",
    time: "2 phút trước",
    unread: true,
    icon: "✅",
  },
  {
    id: 2,
    text: "5 lệnh chia sẻ mới đang chờ phê duyệt",
    time: "1 giờ trước",
    unread: true,
    icon: "⏳",
  },
  {
    id: 3,
    text: 'Gói "Toán lớp 7" đã cập nhật số lượng tối đa',
    time: "3 giờ trước",
    unread: false,
    icon: "📦",
  },
];

// ── PROPS ─────────────────────────────────────────────────────────────────────

interface HeaderProps {
  activePage: ActivePage;
  userRole: UserRole;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export function Header({ activePage, userRole, onLogout, onRoleChange }: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [thongBao, setThongBao] = useState(THONG_BAO_DATA);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const hoSo = HO_SO[userRole];
  const soChưaDoc = thongBao.filter((n) => n.unread).length;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    onRoleChange(role);
    setShowProfile(false);
  };

  return (
    <header
      className="flex items-center gap-4 px-6 relative z-20 flex-shrink-0"
      style={{
        height: 72,
        background: "#fff",
        borderBottom: "1px solid #EEF0F4",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* ── TIÊU ĐỀ TRANG ── */}
      <div className="flex-1 min-w-0">
        <h1
          style={{
            color: "#0F172A",
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {PAGE_LABELS[activePage]}
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "0.7rem", marginTop: 3, lineHeight: 1 }}>
          {PAGE_SUBTITLES[activePage]}
        </p>
      </div>

      {/* ── CÁC BIỂU TƯỢNG ── */}
      <div className="flex items-center gap-1">
        {/* Hỗ trợ */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
          title="Trung tâm hỗ trợ"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
          }
        >
          <HelpCircle size={17} color="#94A3B8" />
        </button>

        {/* ── THÔNG BÁO ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 relative"
            style={{
              background: showNotif ? "#F0F5FF" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!showNotif)
                (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA";
            }}
            onMouseLeave={(e) => {
              if (!showNotif)
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Bell size={17} color={showNotif ? "#005CB6" : "#94A3B8"} />
            {soChưaDoc > 0 && (
              <span
                className="absolute flex items-center justify-center rounded-full text-white"
                style={{
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  background: "#D4183D",
                  border: "2px solid #fff",
                  fontSize: "0.5rem",
                  fontWeight: 800,
                }}
              >
                {soChưaDoc}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
              style={{
                width: 340,
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #EEF0F4",
                zIndex: 50,
              }}
            >
              {/* Header thông báo */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #EEF0F4" }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.87rem", fontWeight: 700, color: "#0F172A" }}>
                    Thông báo
                  </span>
                  {soChưaDoc > 0 && (
                    <span
                      className="flex items-center justify-center rounded-full text-white"
                      style={{
                        background: "#D4183D",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        padding: "0 4px",
                      }}
                    >
                      {soChưaDoc}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setThongBao((n) => n.map((x) => ({ ...x, unread: false })))}
                  style={{
                    fontSize: "0.72rem",
                    color: "#005CB6",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              </div>

              {/* Danh sách thông báo */}
              {thongBao.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer"
                  style={{
                    background: notif.unread ? "rgba(0,92,182,0.03)" : "transparent",
                    borderBottom: "1px solid #F8F9FA",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background = "#F8F9FA")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background =
                      notif.unread ? "rgba(0,92,182,0.03)" : "transparent")
                  }
                >
                  <span style={{ fontSize: "1rem", lineHeight: 1, marginTop: 2 }}>
                    {notif.icon}
                  </span>
                  <div className="flex-1">
                    <p style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                      {notif.text}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 3 }}>
                      {notif.time}
                    </p>
                  </div>
                  {notif.unread && (
                    <span
                      className="flex-shrink-0 rounded-full mt-2"
                      style={{ width: 7, height: 7, background: "#005CB6" }}
                    />
                  )}
                </div>
              ))}

              <div className="px-4 py-2.5" style={{ borderTop: "1px solid #EEF0F4" }}>
                <button
                  style={{
                    width: "100%",
                    fontSize: "0.78rem",
                    color: "#005CB6",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    textAlign: "center",
                  }}
                >
                  Xem tất cả thông báo →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── THÔNG TIN TÀI KHOẢN + CHUYỂN ROLE ── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-150"
            style={{
              background: showProfile ? "#F0F5FF" : "transparent",
              border: `1.5px solid ${showProfile ? "rgba(0,92,182,0.2)" : "transparent"}`,
              cursor: "pointer",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!showProfile)
                (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA";
            }}
            onMouseLeave={(e) => {
              if (!showProfile)
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg, ${hoSo.mauNen} 0%, ${hoSo.mauNen}cc 100%)`,
                boxShadow: `0 2px 8px ${hoSo.mauNen}40`,
                border: "2px solid #fff",
              }}
            >
              <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 800 }}>
                {hoSo.vietTat}
              </span>
            </div>

            {/* Tên + đơn vị */}
            <div className="hidden md:block text-left">
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                {hoSo.ten}
              </div>
              <div
                className="flex items-center gap-1"
                style={{ marginTop: 2 }}
              >
                <Building size={9} color="#94A3B8" />
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#94A3B8",
                    whiteSpace: "nowrap",
                  }}
                >
                  {hoSo.donVi}
                </span>
              </div>
            </div>
            <ChevronDown
              size={13}
              color="#94A3B8"
              style={{
                transition: "transform 0.2s",
                transform: showProfile ? "rotate(180deg)" : "none",
              }}
            />
          </button>

          {/* ── DROPDOWN PROFILE ── */}
          {showProfile && (
            <div
              className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
              style={{
                width: 280,
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                border: "1px solid #EEF0F4",
                zIndex: 50,
              }}
            >
              {/* Thông tin người dùng */}
              <div className="px-4 py-4" style={{ borderBottom: "1px solid #EEF0F4" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 42,
                      height: 42,
                      background: `linear-gradient(135deg, ${hoSo.mauNen} 0%, ${hoSo.mauNen}cc 100%)`,
                      boxShadow: `0 3px 10px ${hoSo.mauNen}40`,
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800 }}>
                      {hoSo.vietTat}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.87rem", fontWeight: 700, color: "#0F172A" }}>
                      {hoSo.ten}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 1 }}>
                      {hoSo.email}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Building size={9} color="#94A3B8" />
                      <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 500 }}>
                        {hoSo.donVi}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CHUYỂN ĐỔI VAI TRÒ DEMO ── */}
              <div className="px-3 py-3" style={{ borderBottom: "1px solid #EEF0F4" }}>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5"
                    style={{
                      background: "rgba(217,119,6,0.1)",
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      color: "#D97706",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    DEMO
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748B" }}>
                    Chuyển đổi vai trò
                  </span>
                </div>

                <div className="space-y-1.5">
                  {DANH_SACH_ROLE.map((role) => {
                    const Icon = role.icon;
                    const isActive = userRole === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSwitch(role.id)}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 text-left"
                        style={{
                          background: isActive ? role.bg : "transparent",
                          border: `1.5px solid ${isActive ? role.border : "transparent"}`,
                          cursor: "pointer",
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }}
                      >
                        {/* Icon role */}
                        <div
                          className="flex items-center justify-center flex-shrink-0 rounded-lg"
                          style={{
                            width: 30,
                            height: 30,
                            background: isActive ? role.color : "#F1F5F9",
                          }}
                        >
                          <Icon
                            size={14}
                            color={isActive ? "#fff" : "#94A3B8"}
                            strokeWidth={2}
                          />
                        </div>
                        {/* Thông tin role */}
                        <div className="flex-1 min-w-0">
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: isActive ? role.color : "#374151",
                              lineHeight: 1.1,
                            }}
                          >
                            {role.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: isActive ? role.color + "aa" : "#94A3B8",
                              marginTop: 2,
                            }}
                          >
                            {role.moTa}
                          </div>
                        </div>
                        {/* Dấu tích active */}
                        {isActive && (
                          <div
                            className="flex-shrink-0 flex items-center justify-center rounded-full"
                            style={{ width: 20, height: 20, background: role.color }}
                          >
                            <Check size={11} color="#fff" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Menu người dùng */}
              <div className="py-1.5">
                {[
                  { label: "Hồ sơ cá nhân", emoji: "👤" },
                  { label: "Cài đặt tài khoản", emoji: "⚙️" },
                  { label: "Hướng dẫn sử dụng", emoji: "📖" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2 transition-colors text-left"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      color: "#4A5568",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                    }
                  >
                    <span style={{ width: 18, textAlign: "center" }}>{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Đăng xuất */}
              <div style={{ borderTop: "1px solid #EEF0F4" }} className="py-1.5">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors text-left"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    color: "#D4183D",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(212,24,61,0.04)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                  }
                >
                  <span style={{ width: 18, textAlign: "center" }}>🚪</span>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}