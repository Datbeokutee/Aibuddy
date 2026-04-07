import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, BookOpen, Globe, Shield, Edit3, CheckSquare, Package, GraduationCap } from "lucide-react";

const CLASSROOM_IMAGE =
  "https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGFzc3Jvb20lMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzUwMTc2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080";

export type UserRole = "admin" | "maker" | "checker" | "doi-tac-noi-dung" | "hoc-sinh";

interface RoleConfig {
  id: UserRole;
  label: string;
  moTa: string;
  icon: React.ElementType;
  email: string;
  color: string;
  bg: string;
  border: string;
}

const DANH_SACH_ROLE: RoleConfig[] = [
  {
    id: "admin",
    label: "Quản trị viên",
    moTa: "Toàn quyền hệ thống",
    icon: Shield,
    email: "admin@k12online.edu.vn",
    color: "#005CB6",
    bg: "rgba(0,92,182,0.08)",
    border: "rgba(0,92,182,0.25)",
  },
  {
    id: "maker",
    label: "Quyền chia sẻ",
    moTa: "Khởi tạo lệnh chia sẻ",
    icon: Edit3,
    email: "maker@k12online.edu.vn",
    color: "#0284C7",
    bg: "rgba(2,132,199,0.08)",
    border: "rgba(2,132,199,0.25)",
  },
  {
    id: "checker",
    label: "Quyền duyệt chia sẻ",
    moTa: "Phê duyệt lệnh chia sẻ",
    icon: CheckSquare,
    email: "checker@k12online.edu.vn",
    color: "#0F766E",
    bg: "rgba(15,118,110,0.08)",
    border: "rgba(15,118,110,0.25)",
  },
  {
    id: "doi-tac-noi-dung",
    label: "Đối tác Nội dung",
    moTa: "Quản lý nội dung học",
    icon: Package,
    email: "doitac@k12online.edu.vn",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.25)",
  },
  {
    id: "hoc-sinh",
    label: "Học sinh",
    moTa: "Xem & mua gói học tập",
    icon: GraduationCap,
    email: "hocsinh@k12online.edu.vn",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.25)",
  },
];

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [luuDangNhap, setLuuDangNhap] = useState(false);
  const [roleChon, setRoleChon] = useState<UserRole | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState("");

  const handleChonRole = (role: RoleConfig) => {
    setRoleChon(role.id);
    setEmail(role.email);
    setPassword("demo123456");
    setLoi("");
  };

  const handleDangNhap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setLoi("Vui lòng nhập tên đăng nhập hoặc email.");
      return;
    }
    if (!password.trim()) {
      setLoi("Vui lòng nhập mật khẩu.");
      return;
    }
    setLoi("");
    setDangTai(true);
    setTimeout(() => {
      setDangTai(false);
      // Xác định role từ email nếu không chọn chip
      let role: UserRole = roleChon ?? "admin";
      if (!roleChon) {
        if (email.includes("maker")) role = "maker";
        else if (email.includes("checker")) role = "checker";
        else if (email.includes("doitac")) role = "doi-tac-noi-dung";
        else if (email.includes("hocsinh")) role = "hoc-sinh";
        else role = "admin";
      }
      onLogin(role);
    }, 1400);
  };

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ── PANEL TRÁI ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Ảnh nền */}
        <img
          src={CLASSROOM_IMAGE}
          alt="Lớp học hiện đại"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lớp phủ xanh đậm */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,40,110,0.92) 0%, rgba(0,92,182,0.82) 60%, rgba(0,140,220,0.70) 100%)",
          }}
        />

        {/* Vòng tròn trang trí */}
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: "#fff" }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ background: "#fff" }}
        />

        {/* Nội dung */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Badge trên */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
            >
              <Globe size={20} color="#fff" />
            </div>
            <span
              className="text-sm uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.12em" }}
            >
              K12Online · Phân phối Nội dung
            </span>
          </div>

          {/* Phần giữa – Slogan */}
          <div className="space-y-6">
            <div
              className="w-12 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
            <h2
              className="text-4xl xl:text-5xl"
              style={{
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              Nâng tầm
              <br />
              <span style={{ color: "rgba(180,220,255,1)" }}>Mọi người học</span>
              <br />
              Mọi nơi.
            </h2>
            <p
              className="text-base xl:text-lg max-w-sm"
              style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
            >
              Nền tảng thống nhất để phân phối, chia sẻ và phê duyệt nội dung giáo dục
              K-12 — nhanh chóng, an toàn và hiệu quả.
            </p>

            {/* Thống kê */}
            <div className="flex gap-8 pt-4">
              {[
                { value: "2,4 Tr+", label: "Học sinh tiếp cận" },
                { value: "18.000+", label: "Đơn vị nội dung" },
                { value: "340+", label: "Trường học" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.75rem",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bản quyền */}
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
            © 2026 K12Online · Bảo lưu mọi quyền
          </p>
        </div>
      </div>

      {/* ── PANEL PHẢI ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto"
        style={{ background: "#F7F9FC" }}
      >
        {/* Accent góc phải */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
          style={{ background: "#005CB6" }}
        />

        <div className="w-full max-w-[420px] space-y-7">
          {/* ── LOGO KÉP ── */}
          <div className="flex items-center justify-between">
            {/* Logo AI Book */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shadow-sm"
                style={{ background: "#005CB6" }}
              >
                <BookOpen size={20} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <div style={{ color: "#005CB6", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1 }}>
                  AI Book
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.65rem", lineHeight: 1, marginTop: 2 }}>
                  Học thông minh
                </div>
              </div>
            </div>

            {/* Đường phân cách */}
            <div style={{ width: 1, height: 36, background: "#E2E8F0" }} />

            {/* Logo K12Online */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shadow-sm"
                style={{ background: "linear-gradient(135deg, #005CB6 0%, #0284C7 100%)" }}
              >
                <Globe size={20} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <div style={{ color: "#1E3A5F", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1 }}>
                  K12Online
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.65rem", lineHeight: 1, marginTop: 2 }}>
                  Phân phối Nội dung
                </div>
              </div>
            </div>
          </div>

          {/* ── TIÊU ĐỀ ── */}
          <div className="space-y-1.5">
            <h1
              style={{
                color: "#0F172A",
                fontSize: "1.6rem",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              Chào mừng trở lại
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
              Đăng nhập để truy cập Cổng Quản lý K12Online
            </p>
          </div>

          {/* ── FORM ĐĂNG NHẬP ── */}
          <form onSubmit={handleDangNhap} className="space-y-4">
            {/* Tên đăng nhập / Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                style={{ color: "#334155", fontSize: "0.85rem", fontWeight: 600 }}
              >
                Tên đăng nhập / Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail size={16} color="#94A3B8" />
                </span>
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoi(""); }}
                  className="w-full rounded-xl border outline-none transition-all duration-200 pl-10 pr-4 py-3"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #E2E8F0",
                    color: "#0F172A",
                    fontSize: "0.9rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#005CB6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = loi ? "#D4183D" : "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                style={{ color: "#334155", fontSize: "0.85rem", fontWeight: 600 }}
              >
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={16} color="#94A3B8" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoi(""); }}
                  className="w-full rounded-xl border outline-none transition-all duration-200 pl-10 pr-11 py-3"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #E2E8F0",
                    color: "#0F172A",
                    fontSize: "0.9rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#005CB6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={16} color="#94A3B8" />
                  ) : (
                    <Eye size={16} color="#94A3B8" />
                  )}
                </button>
              </div>
            </div>

            {/* Thông báo lỗi */}
            {loi && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(212,24,61,0.07)", border: "1px solid rgba(212,24,61,0.15)" }}
              >
                <span style={{ color: "#D4183D", fontSize: "0.82rem", fontWeight: 500 }}>{loi}</span>
              </div>
            )}

            {/* Ghi nhớ & Quên mật khẩu */}
            <div className="flex items-center justify-between pt-0.5">
              <label
                className="flex items-center gap-2.5 cursor-pointer select-none"
                style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 400 }}
              >
                <div
                  onClick={() => setLuuDangNhap(!luuDangNhap)}
                  className="flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: luuDangNhap ? "none" : "1.5px solid #CBD5E1",
                    background: luuDangNhap ? "#005CB6" : "#fff",
                  }}
                >
                  {luuDangNhap && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                Ghi nhớ đăng nhập
              </label>

              <button
                type="button"
                style={{
                  color: "#005CB6",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              disabled={dangTai}
              className="w-full rounded-xl py-3.5 transition-all duration-200"
              style={{
                background: dangTai
                  ? "#4A90D9"
                  : "linear-gradient(135deg, #005CB6 0%, #0074E4 100%)",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "'Be Vietnam Pro', sans-serif",
                border: "none",
                cursor: dangTai ? "not-allowed" : "pointer",
                boxShadow: dangTai ? "none" : "0 4px 14px rgba(0,92,182,0.35)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!dangTai)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 20px rgba(0,92,182,0.45)";
              }}
              onMouseLeave={(e) => {
                if (!dangTai)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 14px rgba(0,92,182,0.35)";
              }}
            >
              {dangTai ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Đang đăng nhập…
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* ── ĐĂNG NHẬP NHANH THEO ROLE ── */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "#fff",
              border: "1.5px dashed #CBD5E1",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} />
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Đăng nhập nhanh theo Vai trò
              </span>
            </div>

            <div className="space-y-2">
              {DANH_SACH_ROLE.map((role) => {
                const Icon = role.icon;
                const isActive = roleChon === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleChonRole(role)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 text-left"
                    style={{
                      background: isActive ? role.color : role.bg,
                      border: `1.5px solid ${isActive ? role.color : role.border}`,
                      cursor: "pointer",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      transform: isActive ? "translateY(-1px)" : "none",
                      boxShadow: isActive ? `0 4px 12px ${role.color}35` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 2px 8px ${role.color}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.transform = "none";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.2)" : `${role.color}18`,
                      }}
                    >
                      <Icon size={15} color={isActive ? "#fff" : role.color} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontSize: "0.83rem",
                          fontWeight: 700,
                          color: isActive ? "#fff" : role.color,
                          lineHeight: 1,
                        }}
                      >
                        {role.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: isActive ? "rgba(255,255,255,0.75)" : "#94A3B8",
                          marginTop: 3,
                        }}
                      >
                        {role.moTa}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="flex-shrink-0"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.85)",
                          background: "rgba(255,255,255,0.2)",
                          padding: "2px 8px",
                          borderRadius: 99,
                        }}
                      >
                        Đã chọn
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p style={{ color: "#CBD5E1", fontSize: "0.7rem" }}>
              Chọn vai trò để tự động điền thông tin đăng nhập demo.
            </p>
          </div>

          {/* Footer */}
          <p style={{ color: "#CBD5E1", fontSize: "0.72rem", textAlign: "center" }}>
            Bảo mật cấp doanh nghiệp · Phiên bản 2.4.1
          </p>
        </div>
      </div>
    </div>
  );
}
