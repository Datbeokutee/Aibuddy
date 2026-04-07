import { useState } from "react";
import {
  Building2,
  Database,
  Key,
  Layers,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";

// ── DỮ LIỆU KPI ────────────────────────────────────────────────────────────────

const KPI_DATA = [
  {
    id: "don-vi",
    label: "Tổng số đơn vị",
    value: "45",
    rawValue: 45,
    delta: "+3",
    deltaLabel: "đơn vị mới tháng này",
    trend: "up" as const,
    icon: Building2,
    color: "#005CB6",
    bg: "rgba(0,92,182,0.08)",
    border: "rgba(0,92,182,0.16)",
    gradient: "linear-gradient(135deg, #005CB6 0%, #0074E4 100%)",
    progress: 100,
    sub: "Đang hoạt động",
  },
  {
    id: "han-muc-bccs",
    label: "Tổng hạn mức từ BCCS",
    value: "50.000",
    rawValue: 50000,
    delta: "Đồng bộ hôm nay",
    deltaLabel: "01/04/2026 · 09:00",
    trend: "neutral" as const,
    icon: Database,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.16)",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #9F5FFF 100%)",
    progress: 100,
    sub: "Tổng cấp phát",
  },
  {
    id: "da-gan",
    label: "License đã gán",
    value: "32.500",
    rawValue: 32500,
    delta: "65%",
    deltaLabel: "tổng hạn mức",
    trend: "up" as const,
    icon: Key,
    color: "#0284C7",
    bg: "rgba(2,132,199,0.08)",
    border: "rgba(2,132,199,0.16)",
    gradient: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
    progress: 65,
    sub: "Đã phân phối",
  },
  {
    id: "con-lai",
    label: "License còn lại",
    value: "17.500",
    rawValue: 17500,
    delta: "35%",
    deltaLabel: "tổng hạn mức",
    trend: "down" as const,
    icon: Layers,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.08)",
    border: "rgba(15,118,110,0.16)",
    gradient: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
    progress: 35,
    sub: "Chưa phân phối",
  },
];

// ── TOP 5 TỈNH ─────────────────────────────────────────────────────────────────

const TOP5_TINH = [
  { tinh: "TP. Hồ Chí Minh", soLuong: 9800, mau: "#005CB6" },
  { tinh: "Hà Nội", soLuong: 8250, mau: "#0284C7" },
  { tinh: "Đà Nẵng", soLuong: 5600, mau: "#7C3AED" },
  { tinh: "Cần Thơ", soLuong: 4900, mau: "#0F766E" },
  { tinh: "Bình Dương", soLuong: 3950, mau: "#D97706" },
];

// ── TỶ LỆ GÓI BASIC / PLUS ────────────────────────────────────────────────────

const TY_LE_GOI = [
  { name: "BASIC", value: 19500, phanTram: "60%", mau: "#005CB6" },
  { name: "PLUS", value: 13000, phanTram: "40%", mau: "#7C3AED" },
];

// ── 5 GIAO DỊCH BCCS MỚI NHẤT ────────────────────────────────────────────────

const GIAO_DICH_MOI_NHAT = [
  {
    id: "BCCS-20260401-0052",
    tenGoi: "Toán lớp 7 – Học kỳ 1",
    phanLoai: "BASIC",
    soLuong: 5000,
    thoiGian: "01/04/2026 · 09:14",
    trangThai: "Hoàn thành",
  },
  {
    id: "BCCS-20260401-0051",
    tenGoi: "Khoa học lớp 8 – Cả năm",
    phanLoai: "PLUS",
    soLuong: 3200,
    thoiGian: "01/04/2026 · 08:47",
    trangThai: "Chờ duyệt",
  },
  {
    id: "BCCS-20260331-0048",
    tenGoi: "Ngữ văn lớp 9 – Nâng cao",
    phanLoai: "PLUS",
    soLuong: 2800,
    thoiGian: "31/03/2026 · 17:02",
    trangThai: "Hoàn thành",
  },
  {
    id: "BCCS-20260331-0047",
    tenGoi: "Tiếng Anh lớp 10",
    phanLoai: "BASIC",
    soLuong: 1500,
    thoiGian: "31/03/2026 · 15:30",
    trangThai: "Đang xử lý",
  },
  {
    id: "BCCS-20260330-0044",
    tenGoi: "Lịch sử lớp 7 – Học kỳ 2",
    phanLoai: "BASIC",
    soLuong: 4100,
    thoiGian: "30/03/2026 · 14:20",
    trangThai: "Thất bại",
  },
];

// ── BADGE TRẠNG THÁI ──────────────────────────────────────────────────────────

function TrangThaiBadge({ trangThai }: { trangThai: string }) {
  const cfg: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    "Hoàn thành": { color: "#0F766E", bg: "rgba(15,118,110,0.1)", icon: <CheckCircle size={10} /> },
    "Chờ duyệt":  { color: "#D97706", bg: "rgba(217,119,6,0.1)",   icon: <Clock size={10} /> },
    "Đang xử lý": { color: "#005CB6", bg: "rgba(0,92,182,0.1)",    icon: <AlertCircle size={10} /> },
    "Thất bại":   { color: "#D4183D", bg: "rgba(212,24,61,0.1)",   icon: <XCircle size={10} /> },
  };
  const c = cfg[trangThai] ?? cfg["Chờ duyệt"];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
      style={{ background: c.bg, color: c.color, fontSize: "0.7rem", fontWeight: 600 }}
    >
      {c.icon}
      {trangThai}
    </span>
  );
}

// ── BADGE PHÂN LOẠI GÓI ───────────────────────────────────────────────────────

function PhanLoaiBadge({ loai }: { loai: string }) {
  const cfg: Record<string, { color: string; bg: string }> = {
    BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.1)" },
    PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  };
  const c = cfg[loai] ?? cfg["BASIC"];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5"
      style={{ background: c.bg, color: c.color, fontSize: "0.65rem", fontWeight: 800 }}
    >
      {loai}
    </span>
  );
}

// ── BIỂU ĐỒ CỘT TÙY CHỈNH (thay thế Recharts BarChart + Cell) ────────────────

function BieuDoCot() {
  const maxVal = Math.max(...TOP5_TINH.map(t => t.soLuong));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ height: 240, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      {/* Grid lines */}
      <div className="relative flex-1">
        {[0, 25, 50, 75, 100].map(pct => (
          <div key={pct} className="absolute w-full" style={{ bottom: `${pct}%`, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "0.62rem", color: "#94A3B8", minWidth: 28, textAlign: "right" }}>
              {pct === 0 ? "0" : `${Math.round(maxVal * pct / 100 / 1000)}k`}
            </span>
            <div className="flex-1" style={{ borderTop: "1px dashed #F1F5F9" }} />
          </div>
        ))}
        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around" style={{ paddingLeft: 36, paddingBottom: 0 }}>
          {TOP5_TINH.map((t, i) => {
            const pct = (t.soLuong / maxVal) * 100;
            const isHov = hovered === i;
            return (
              <div key={t.tinh} className="flex flex-col items-center gap-1" style={{ flex: 1, maxWidth: 64 }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <div className="rounded-lg px-2 py-1 whitespace-nowrap" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "0.72rem", fontWeight: 700, color: "#0F172A" }}>
                    {t.soLuong.toLocaleString("vi-VN")}
                  </div>
                )}
                <div className="w-full rounded-t-xl transition-all duration-200"
                  style={{ height: `${pct}%`, background: isHov ? t.mau : `${t.mau}CC`, maxWidth: 44, margin: "0 auto", boxShadow: isHov ? `0 4px 14px ${t.mau}55` : "none", transition: "all 0.2s ease" }} />
              </div>
            );
          })}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex justify-around" style={{ paddingLeft: 36, marginTop: 8 }}>
        {TOP5_TINH.map(t => (
          <div key={t.tinh} className="flex-1 text-center" style={{ maxWidth: 64 }}>
            <span style={{ fontSize: "0.63rem", color: "#64748B", fontWeight: 500, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t.tinh.replace("TP. ", "")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BIỂU ĐỒ TRÒN TÙY CHỈNH (thay thế Recharts PieChart + Cell) ───────────────

function BieuDoTron() {
  const total = TY_LE_GOI.reduce((s, g) => s + g.value, 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const r = 72, cx = 90, cy = 90, strokeW = 26;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = TY_LE_GOI.map((g, i) => {
    const pct = g.value / total;
    const dash = pct * circumference - 3; // 3px gap
    const seg = { ...g, pct, dash, offset, i };
    offset += pct * circumference;
    return seg;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={strokeW} />
          {/* Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.mau}
              strokeWidth={hovered === seg.i ? strokeW + 4 : strokeW}
              strokeDasharray={`${seg.dash} ${circumference}`}
              strokeDashoffset={-seg.offset + circumference / 4}
              strokeLinecap="butt"
              style={{ transition: "stroke-width 0.2s ease", cursor: "pointer", filter: hovered === seg.i ? `drop-shadow(0 0 6px ${seg.mau}88)` : "none" }}
              onMouseEnter={() => setHovered(seg.i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>32.500</span>
          <span style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 3 }}>Tổng đã gán</span>
        </div>
      </div>
    </div>
  );
}

// ── CUSTOM LEGEND BIỂU ĐỒ TRÒN ───────────────────────────────────────────────

function LegendTron() {
  return (
    <div className="flex flex-col gap-3 mt-2">
      {TY_LE_GOI.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full flex-shrink-0"
              style={{ width: 10, height: 10, background: item.mau }}
            />
            <span style={{ fontSize: "0.8rem", color: "#374151", fontWeight: 600 }}>
              Gói {item.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
              {item.value.toLocaleString("vi-VN")}
            </span>
            <span
              className="rounded-full px-2 py-0.5"
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: item.mau,
                background: item.mau + "18",
              }}
            >
              {item.phanTram}
            </span>
          </div>
        </div>
      ))}
      {/* Tổng */}
      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: "1px dashed #EEF0F4" }}
      >
        <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>Tổng cộng</span>
        <span style={{ fontSize: "0.82rem", color: "#0F172A", fontWeight: 700 }}>
          32.500
        </span>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function DashboardHome() {
  const [dangDongBo, setDangDongBo] = useState(false);

  const handleDongBo = () => {
    setDangDongBo(true);
    setTimeout(() => setDangDongBo(false), 2000);
  };

  const ngayHienTai = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── THANH TIÊU ĐỀ ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: "linear-gradient(135deg, #005CB6, #0074E4)" }}
              >
                <Zap size={16} color="#fff" strokeWidth={2.2} />
              </div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
                Tổng quan hệ thống
              </h2>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 4, marginLeft: 42 }}>
              {ngayHienTai} · Cập nhật theo thời gian thực
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(15,118,110,0.07)",
                border: "1px solid rgba(15,118,110,0.18)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#0F766E" }}
              />
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#0F766E" }}>
                Đồng bộ BCCS · Thành công
              </span>
            </div>

            <button
              onClick={handleDongBo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
              style={{
                background: "#005CB6",
                border: "none",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                boxShadow: "0 2px 10px rgba(0,92,182,0.35)",
                opacity: dangDongBo ? 0.7 : 1,
              }}
            >
              <RefreshCw
                size={14}
                style={{ animation: dangDongBo ? "spin 1s linear infinite" : "none" }}
              />
              {dangDongBo ? "Đang đồng bộ…" : "Đồng bộ BCCS"}
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                background: "#fff",
                border: "1.5px solid #EEF0F4",
                color: "#64748B",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              <Download size={14} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* ── 4 THẺ KPI ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                className="rounded-2xl p-5 transition-all duration-200 relative overflow-hidden"
                style={{
                  background: "#fff",
                  border: `1px solid ${kpi.border}`,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 6px 24px ${kpi.color}22`;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 1px 8px rgba(0,0,0,0.05)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                {/* Nền trang trí góc */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5"
                  style={{ background: kpi.gradient }}
                />

                {/* Header thẻ */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ background: kpi.gradient, boxShadow: `0 4px 12px ${kpi.color}40` }}
                  >
                    <Icon size={19} color="#fff" strokeWidth={2.2} />
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{ background: kpi.bg }}
                  >
                    {kpi.trend === "up" && <TrendingUp size={11} color={kpi.color} />}
                    {kpi.trend === "down" && <TrendingDown size={11} color={kpi.color} />}
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: kpi.color }}>
                      {kpi.sub}
                    </span>
                  </div>
                </div>

                {/* Giá trị chính */}
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#0F172A",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: 6, fontWeight: 500 }}>
                    {kpi.label}
                  </div>
                </div>

                {/* Thanh tiến trình */}
                {idx >= 2 && (
                  <div className="mt-4">
                    <div
                      className="rounded-full overflow-hidden"
                      style={{ height: 5, background: "#F1F5F9" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${kpi.progress}%`,
                          background: kpi.gradient,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                        {kpi.deltaLabel}
                      </span>
                      <span
                        style={{ fontSize: "0.72rem", fontWeight: 700, color: kpi.color }}
                      >
                        {kpi.delta}
                      </span>
                    </div>
                  </div>
                )}

                {/* Thông tin bổ sung cho 2 thẻ đầu */}
                {idx < 2 && (
                  <div className="flex items-center gap-1.5 mt-4">
                    {kpi.trend === "up" ? (
                      <TrendingUp size={12} color="#10B981" />
                    ) : (
                      <Calendar size={12} color="#94A3B8" />
                    )}
                    <span
                      style={{
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        color: kpi.trend === "up" ? "#10B981" : "#94A3B8",
                      }}
                    >
                      {kpi.delta}
                    </span>
                    <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>
                      {kpi.deltaLabel}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── BIỂU ĐỒ: TOP 5 TỈNH + BIỂU ĐỒ TRÒN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Biểu đồ cột – Top 5 tỉnh */}
          <div
            className="lg:col-span-3 rounded-2xl p-5"
            style={{
              background: "#fff",
              border: "1px solid #EEF0F4",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: 700 }}>
                  Top 5 tỉnh có số lượng gán cao nhất
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", marginTop: 3 }}>
                  Tính theo số license đã phân phối · Tháng 4/2026
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{
                  background: "rgba(0,92,182,0.06)",
                  border: "1px solid rgba(0,92,182,0.15)",
                }}
              >
                <ArrowUpRight size={13} color="#005CB6" />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#005CB6" }}>
                  +12% tháng trước
                </span>
              </div>
            </div>

            {/* Biểu đồ */}
            <BieuDoCot />

            {/* Số liệu dưới biểu đồ */}
            <div
              className="grid grid-cols-5 gap-2 mt-3 pt-3"
              style={{ borderTop: "1px solid #F1F5F9" }}
            >
              {TOP5_TINH.map((t) => (
                <div key={t.tinh} className="text-center">
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: t.mau,
                    }}
                  >
                    {t.soLuong.toLocaleString("vi-VN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biểu đồ tròn – BASIC vs PLUS */}
          <div
            className="lg:col-span-2 rounded-2xl p-5"
            style={{
              background: "#fff",
              border: "1px solid #EEF0F4",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div className="mb-4">
              <h3 style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: 700 }}>
                Tỷ lệ gói nội dung
              </h3>
              <p style={{ color: "#94A3B8", fontSize: "0.72rem", marginTop: 3 }}>
                Phân bổ BASIC / PLUS theo license đã gán
              </p>
            </div>

            {/* Biểu đồ */}
            <BieuDoTron />

            {/* Legend */}
            <LegendTron />
          </div>
        </div>

        {/* ── BẢNG 5 GIAO DỊCH BCCS MỚI NHẤT ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #EEF0F4",
            boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header bảng */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #EEF0F4" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ background: "rgba(0,92,182,0.08)" }}
              >
                <RefreshCw size={16} color="#005CB6" strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: 700 }}>
                  5 Giao dịch BCCS mới nhất
                </h3>
                <p style={{ color: "#94A3B8", fontSize: "0.7rem", marginTop: 2 }}>
                  Cập nhật lần cuối · 01/04/2026 · 09:14
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150"
                style={{
                  background: "#F8F9FA",
                  border: "1.5px solid #EEF0F4",
                  color: "#64748B",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                <Download size={13} />
                Xuất dữ liệu
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150"
                style={{
                  background: "rgba(0,92,182,0.07)",
                  border: "1.5px solid rgba(0,92,182,0.18)",
                  color: "#005CB6",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Xem tất cả →
              </button>
            </div>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {[
                    { label: "Mã giao dịch BCCS", w: "22%" },
                    { label: "Tên gói nội dung", w: "30%" },
                    { label: "Phân loại", w: "10%" },
                    { label: "Số lượng", w: "12%" },
                    { label: "Thời gian", w: "15%" },
                    { label: "Trạng thái", w: "11%" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        width: col.w,
                        padding: "11px 18px",
                        textAlign: "left",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: "#94A3B8",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid #EEF0F4",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GIAO_DICH_MOI_NHAT.map((gd, idx) => (
                  <tr
                    key={gd.id}
                    style={{
                      borderBottom: idx < GIAO_DICH_MOI_NHAT.length - 1
                        ? "1px solid #F8F9FA"
                        : "none",
                      transition: "background 0.15s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background =
                        "rgba(0,92,182,0.02)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                    }
                  >
                    {/* Mã giao dịch */}
                    <td style={{ padding: "15px 18px" }}>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: "0.73rem",
                            fontWeight: 700,
                            color: "#005CB6",
                            background: "rgba(0,92,182,0.07)",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontFamily: "monospace, sans-serif",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {gd.id}
                        </span>
                      </div>
                    </td>

                    {/* Tên gói */}
                    <td style={{ padding: "15px 18px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1E293B" }}>
                        {gd.tenGoi}
                      </div>
                    </td>

                    {/* Phân loại */}
                    <td style={{ padding: "15px 18px" }}>
                      <PhanLoaiBadge loai={gd.phanLoai} />
                    </td>

                    {/* Số lượng */}
                    <td style={{ padding: "15px 18px" }}>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "#0F172A",
                        }}
                      >
                        {gd.soLuong.toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Thời gian */}
                    <td style={{ padding: "15px 18px" }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} color="#94A3B8" />
                        <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                          {gd.thoiGian}
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td style={{ padding: "15px 18px" }}>
                      <TrangThaiBadge trangThai={gd.trangThai} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}
          >
            <div className="flex items-center gap-4">
              {[
                { label: "Hoàn thành", count: 2, color: "#0F766E", bg: "rgba(15,118,110,0.1)" },
                { label: "Chờ duyệt", count: 1, color: "#D97706", bg: "rgba(217,119,6,0.1)" },
                { label: "Đang xử lý", count: 1, color: "#005CB6", bg: "rgba(0,92,182,0.1)" },
                { label: "Thất bại", count: 1, color: "#D4183D", bg: "rgba(212,24,61,0.1)" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: s.color,
                      background: s.bg,
                    }}
                  >
                    {s.count}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{s.label}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              Hiển thị 5 / 52 giao dịch gần nhất
            </span>
          </div>
        </div>

        {/* Padding cuối */}
        <div style={{ height: 8 }} />
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}