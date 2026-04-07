import { useState } from "react";
import {
  Package, CheckCircle2, Clock, TrendingUp, TrendingDown,
  AlertTriangle, Layers, ArrowRight, RefreshCw, User,
  Calendar, Hash, ChevronRight, Info, Zap, ShieldCheck,
  XCircle, BarChart2, Activity, Gift,
} from "lucide-react";

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

const THONG_TIN_MAKER = {
  hoTen: "Nguyễn Văn Minh",
  chiNhanh: "Chi nhánh Cầu Giấy",
  maNhanVien: "MK-CG-0042",
  vaiTro: "Maker · Người thực hiện",
  capNhat: "01/04/2026 · 09:15",
};

const KPI = {
  hanMucCapPhat: 1000,
  hanMucDaGan: 850,
  conLai: 150,
  choXuLy: 5,
};

// Dữ liệu biểu đồ miền — 30 ngày tháng 4/2026 (tích lũy)
const CHART_DATA = [
  { ngay: "01", giaTriNgay: 80,  tichLuy: 80  },
  { ngay: "02", giaTriNgay: 35,  tichLuy: 115 },
  { ngay: "03", giaTriNgay: 100, tichLuy: 215 },
  { ngay: "04", giaTriNgay: 50,  tichLuy: 265 },
  { ngay: "05", giaTriNgay: 20,  tichLuy: 285 },
  { ngay: "06", giaTriNgay: 0,   tichLuy: 285 },
  { ngay: "07", giaTriNgay: 70,  tichLuy: 355 },
  { ngay: "08", giaTriNgay: 90,  tichLuy: 445 },
  { ngay: "09", giaTriNgay: 30,  tichLuy: 475 },
  { ngay: "10", giaTriNgay: 60,  tichLuy: 535 },
  { ngay: "11", giaTriNgay: 45,  tichLuy: 580 },
  { ngay: "12", giaTriNgay: 0,   tichLuy: 580 },
  { ngay: "13", giaTriNgay: 55,  tichLuy: 635 },
  { ngay: "14", giaTriNgay: 40,  tichLuy: 675 },
  { ngay: "15", giaTriNgay: 25,  tichLuy: 700 },
  { ngay: "16", giaTriNgay: 30,  tichLuy: 730 },
  { ngay: "17", giaTriNgay: 0,   tichLuy: 730 },
  { ngay: "18", giaTriNgay: 15,  tichLuy: 745 },
  { ngay: "19", giaTriNgay: 20,  tichLuy: 765 },
  { ngay: "20", giaTriNgay: 35,  tichLuy: 800 },
  { ngay: "21", giaTriNgay: 10,  tichLuy: 810 },
  { ngay: "22", giaTriNgay: 0,   tichLuy: 810 },
  { ngay: "23", giaTriNgay: 20,  tichLuy: 830 },
  { ngay: "24", giaTriNgay: 10,  tichLuy: 840 },
  { ngay: "25", giaTriNgay: 5,   tichLuy: 845 },
  { ngay: "26", giaTriNgay: 5,   tichLuy: 850 },
  { ngay: "27", giaTriNgay: 0,   tichLuy: 850 },
  { ngay: "28", giaTriNgay: 0,   tichLuy: 850 },
  { ngay: "29", giaTriNgay: 0,   tichLuy: 850 },
  { ngay: "30", giaTriNgay: 0,   tichLuy: 850 },
];

type TrangThaiLenh = "Chờ duyệt" | "Đã duyệt" | "Từ chối";

interface LenhGan {
  id: string;
  maLenh: string;
  loaiGoi: "BASIC" | "PLUS";
  soLuong: number;
  donViNhan: string;
  trangThai: TrangThaiLenh;
  ngayTao: string;
  ghiChu?: string;
}

const LENH_GAN_GAN_DAY: LenhGan[] = [
  { id: "1", maLenh: "LG-CG-0051", loaiGoi: "BASIC", soLuong: 50,  donViNhan: "Trường THCS Nghĩa Tân",    trangThai: "Chờ duyệt", ngayTao: "05/04/2026" },
  { id: "2", maLenh: "LG-CG-0050", loaiGoi: "PLUS",  soLuong: 30,  donViNhan: "Trường THPT Cầu Giấy",    trangThai: "Đã duyệt",  ngayTao: "04/04/2026" },
  { id: "3", maLenh: "LG-CG-0049", loaiGoi: "BASIC", soLuong: 100, donViNhan: "Tiểu học Dịch Vọng A",   trangThai: "Đã duyệt",  ngayTao: "03/04/2026" },
  { id: "4", maLenh: "LG-CG-0048", loaiGoi: "PLUS",  soLuong: 20,  donViNhan: "Trường THPT Yên Hòa",    trangThai: "Từ chối",   ngayTao: "02/04/2026", ghiChu: "Vượt hạn mức còn lại tại thời điểm gán" },
  { id: "5", maLenh: "LG-CG-0047", loaiGoi: "BASIC", soLuong: 80,  donViNhan: "Trường THCS Mai Dịch",    trangThai: "Đã duyệt",  ngayTao: "01/04/2026" },
];

// ── CẤU HÌNH TRẠNG THÁI ───────────────────────────────────────────────────────

const TRANG_THAI_CFG: Record<TrangThaiLenh, {
  color: string; bg: string; border: string; icon: React.ElementType; dot: string;
}> = {
  "Chờ duyệt": { color: "#D97706", bg: "rgba(217,119,6,0.1)",   border: "rgba(217,119,6,0.25)",   icon: Clock,         dot: "#D97706" },
  "Đã duyệt":  { color: "#0F766E", bg: "rgba(15,118,110,0.1)",  border: "rgba(15,118,110,0.25)",  icon: CheckCircle2,  dot: "#0F766E" },
  "Từ chối":   { color: "#D4183D", bg: "rgba(212,24,61,0.1)",   border: "rgba(212,24,61,0.25)",   icon: XCircle,       dot: "#D4183D" },
};

const LOAI_GOI_CFG = {
  BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.2)"   },
  PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)", border: "rgba(124,58,237,0.2)"  },
};

const fmtSL = (n: number) => n.toLocaleString("vi-VN");

// ── BIỂU ĐỒ MIỀN SVG TÙY CHỈNH ───────────────────────────────────────────────

function AreaChart({ data, hanMuc }: { data: typeof CHART_DATA; hanMuc: number }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: typeof CHART_DATA[0] } | null>(null);

  const W = 700, H = 180, PAD_L = 42, PAD_R = 16, PAD_T = 14, PAD_B = 32;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const maxVal = hanMuc;

  const xOf = (i: number) => PAD_L + (i / (data.length - 1)) * chartW;
  const yOf = (v: number) => PAD_T + chartH - (v / maxVal) * chartH;

  // Tạo path area cho tích lũy
  const linePoints = data.map((d, i) => `${xOf(i)},${yOf(d.tichLuy)}`).join(" L ");
  const areaPath = `M ${xOf(0)},${yOf(data[0].tichLuy)} L ${linePoints} L ${xOf(data.length - 1)},${PAD_T + chartH} L ${xOf(0)},${PAD_T + chartH} Z`;
  const linePath = `M ${xOf(0)},${yOf(data[0].tichLuy)} L ${linePoints}`;

  // Path bar nhỏ cho ngày (dùng rect thay vì bar riêng)
  const yGridVals = [0, 250, 500, 750, 1000];

  // Đường hạn mức còn lại
  const yConLai = yOf(KPI.conLai + KPI.hanMucDaGan); // = 1000

  return (
    <div className="relative w-full" style={{ fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#005CB6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#005CB6" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#0074E4" />
            <stop offset="100%" stopColor="#005CB6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid ngang */}
        {yGridVals.map(v => (
          <g key={`grid-${v}`}>
            <line x1={PAD_L} y1={yOf(v)} x2={W - PAD_R} y2={yOf(v)}
              stroke="#EEF0F4" strokeWidth={v === 0 ? 1.5 : 1} strokeDasharray={v === 0 ? "none" : "4,4"} />
            <text x={PAD_L - 6} y={yOf(v) + 4} textAnchor="end"
              style={{ fontSize: "0.55rem", fill: "#CBD5E1", fontFamily: "'Be Vietnam Pro'" }}>
              {v === 0 ? "0" : `${v / 1000 >= 1 ? v / 1000 + "K" : v}`}
            </text>
          </g>
        ))}

        {/* Đường hạn mức tối đa */}
        <line x1={PAD_L} y1={PAD_T} x2={W - PAD_R} y2={PAD_T}
          stroke="#D4183D" strokeWidth={1} strokeDasharray="5,4" strokeOpacity={0.5} />
        <text x={W - PAD_R + 4} y={PAD_T + 4}
          style={{ fontSize: "0.52rem", fill: "#D4183D", fontFamily: "'Be Vietnam Pro'", fontWeight: 700 }}>
          Max
        </text>

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth={2.2}
          strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />

        {/* Các thanh cột ngày nhỏ */}
        {data.map((d, i) => {
          if (d.giaTriNgay === 0) return null;
          const barH = (d.giaTriNgay / maxVal) * chartH;
          return (
            <rect key={`bar-${i}`}
              x={xOf(i) - 4} y={PAD_T + chartH - barH}
              width={8} height={barH}
              fill="#005CB6" opacity={0.09} rx={2}
            />
          );
        })}

        {/* Dots + hover areas */}
        {data.map((d, i) => (
          <g key={`dot-${i}`}>
            <rect
              x={xOf(i) - 10} y={PAD_T}
              width={20} height={chartH}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={() => setTooltip({ x: xOf(i), y: yOf(d.tichLuy), d })}
              onMouseLeave={() => setTooltip(null)}
            />
            {d.giaTriNgay > 0 && (
              <circle cx={xOf(i)} cy={yOf(d.tichLuy)} r={tooltip?.d === d ? 5 : 3}
                fill="#005CB6" stroke="#fff" strokeWidth={1.5}
                style={{ transition: "r 0.15s", cursor: "crosshair" }}
              />
            )}
          </g>
        ))}

        {/* Tooltip line */}
        {tooltip && (
          <>
            <line x1={tooltip.x} y1={PAD_T} x2={tooltip.x} y2={PAD_T + chartH}
              stroke="#005CB6" strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.5} />
            <circle cx={tooltip.x} cy={tooltip.y} r={5}
              fill="#005CB6" stroke="#fff" strokeWidth={2} />
          </>
        )}

        {/* Nhãn ngày trục X — chỉ hiện một số ngày */}
        {data.map((d, i) => {
          if (i % 5 !== 0 && i !== data.length - 1) return null;
          return (
            <text key={`xlabel-${i}`} x={xOf(i)} y={H - 6} textAnchor="middle"
              style={{ fontSize: "0.57rem", fill: "#94A3B8", fontFamily: "'Be Vietnam Pro'" }}>
              {d.ngay}/4
            </text>
          );
        })}
      </svg>

      {/* Tooltip nổi */}
      {tooltip && (
        <div className="absolute pointer-events-none z-10 rounded-xl px-3 py-2.5"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(tooltip.y / H) * 100 - 28}%`,
            transform: "translateX(-50%)",
            background: "#0F172A",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
            minWidth: 140,
          }}>
          <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: 3 }}>
            Ngày {tooltip.d.ngay}/04/2026
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ fontSize: "0.7rem", color: "#CBD5E1" }}>Gán trong ngày:</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#60A5FA" }}>{fmtSL(tooltip.d.giaTriNgay)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span style={{ fontSize: "0.7rem", color: "#CBD5E1" }}>Tích lũy tháng:</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff" }}>{fmtSL(tooltip.d.tichLuy)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function MakerDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const pctDaGan = ((KPI.hanMucDaGan / KPI.hanMucCapPhat) * 100).toFixed(1);
  const pctConLai = ((KPI.conLai / KPI.hanMucCapPhat) * 100).toFixed(1);
  const soChoXuLy = LENH_GAN_GAN_DAY.filter(l => l.trangThai === "Chờ duyệt").length;
  const soDaDuyet  = LENH_GAN_GAN_DAY.filter(l => l.trangThai === "Đã duyệt").length;
  const soTuChoi   = LENH_GAN_GAN_DAY.filter(l => l.trangThai === "Từ chối").length;
  const isWarning  = KPI.conLai / KPI.hanMucCapPhat < 0.2;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            {/* Thông tin maker */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#005CB6,#0284C7)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                  <User size={20} color="#fff" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                  style={{ background: "#0F766E" }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A" }}>
                    Xin chào, {THONG_TIN_MAKER.hoTen}
                  </h2>
                  <span className="rounded-full px-2.5 py-0.5"
                    style={{ fontSize: "0.63rem", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.08)", border: "1px solid rgba(0,92,182,0.2)" }}>
                    Maker
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    📍 {THONG_TIN_MAKER.chiNhanh}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "#CBD5E1" }}>·</span>
                  <span style={{ fontSize: "0.68rem", color: "#94A3B8", fontFamily: "monospace" }}>
                    {THONG_TIN_MAKER.maNhanVien}
                  </span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              Tổng quan cá nhân · Cập nhật lần cuối: <strong style={{ color: "#64748B" }}>{THONG_TIN_MAKER.capNhat}</strong>
            </p>
          </div>

          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: refreshing ? "#94A3B8" : "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: refreshing ? "none" : "0 4px 14px rgba(0,92,182,0.3)" }}>
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Đang tải…" : "Làm mới"}
          </button>
        </div>

        {/* ── CẢNH BÁO HẠN MỨC THẤP ── */}
        {isWarning && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(217,119,6,0.07)", border: "1.5px solid rgba(217,119,6,0.28)", animation: "fadeSlideIn 0.35s ease" }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{ background: "rgba(217,119,6,0.14)" }}>
              <AlertTriangle size={16} color="#D97706" />
            </div>
            <div className="flex-1">
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#D97706" }}>
                Hạn mức còn lại thấp — chỉ còn {fmtSL(KPI.conLai)} license ({pctConLai}%)
              </span>
              <span style={{ fontSize: "0.74rem", color: "#64748B", marginLeft: 8 }}>
                Vui lòng liên hệ Admin để bổ sung hạn mức kịp thời.
              </span>
            </div>
          </div>
        )}

        {/* ── 4 KPI CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1. Hạn mức được cấp */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(0,92,182,0.09)" }}>
                <Layers size={18} color="#005CB6" />
              </div>
              <span className="flex items-center gap-1 rounded-full px-2 py-1"
                style={{ fontSize: "0.62rem", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.08)" }}>
                <Activity size={9} /> Tổng cấp
              </span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#005CB6", lineHeight: 1 }}>
              {fmtSL(KPI.hanMucCapPhat)}
            </div>
            <div style={{ fontSize: "0.73rem", color: "#94A3B8", marginTop: 6 }}>Hạn mức đơn vị được cấp</div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: "0.68rem", color: "#64748B" }}>
                📋 Tháng 04/2026 · {THONG_TIN_MAKER.chiNhanh}
              </span>
            </div>
          </div>

          {/* 2. Hạn mức đã gán */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(15,118,110,0.09)" }}>
                <CheckCircle2 size={18} color="#0F766E" />
              </div>
              <span className="flex items-center gap-1 rounded-full px-2 py-1"
                style={{ fontSize: "0.62rem", fontWeight: 700, color: "#0F766E", background: "rgba(15,118,110,0.08)" }}>
                {pctDaGan}% đã dùng
              </span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0F766E", lineHeight: 1 }}>
              {fmtSL(KPI.hanMucDaGan)}
            </div>
            <div style={{ fontSize: "0.73rem", color: "#94A3B8", marginTop: 6 }}>Hạn mức đã gán</div>
            {/* Mini progress */}
            <div className="mt-3 rounded-full overflow-hidden" style={{ height: 5, background: "#F1F5F9" }}>
              <div className="h-full rounded-full"
                style={{ width: `${pctDaGan}%`, background: "linear-gradient(90deg,#0F766E,#059669)", transition: "width 0.8s ease" }} />
            </div>
          </div>

          {/* 3. Hạn mức còn lại */}
          <div className="rounded-2xl p-5" style={{
            background: isWarning ? "rgba(217,119,6,0.04)" : "#fff",
            border: isWarning ? "1.5px solid rgba(217,119,6,0.3)" : "1px solid #EEF0F4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: isWarning ? "rgba(217,119,6,0.12)" : "rgba(0,92,182,0.07)" }}>
                {isWarning
                  ? <AlertTriangle size={18} color="#D97706" />
                  : <TrendingUp size={18} color="#005CB6" />}
              </div>
              <span className="flex items-center gap-1 rounded-full px-2 py-1"
                style={{ fontSize: "0.62rem", fontWeight: 700, color: isWarning ? "#D97706" : "#005CB6", background: isWarning ? "rgba(217,119,6,0.1)" : "rgba(0,92,182,0.08)" }}>
                {isWarning ? "⚠ Sắp hết" : `${pctConLai}% còn`}
              </span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: isWarning ? "#D97706" : "#005CB6", lineHeight: 1 }}>
              {fmtSL(KPI.conLai)}
            </div>
            <div style={{ fontSize: "0.73rem", color: "#94A3B8", marginTop: 6 }}>Hạn mức còn lại</div>
            <div className="mt-3 rounded-full overflow-hidden" style={{ height: 5, background: "#F1F5F9" }}>
              <div className="h-full rounded-full"
                style={{ width: `${pctConLai}%`, background: isWarning ? "#D97706" : "#005CB6", transition: "width 0.8s ease" }} />
            </div>
          </div>

          {/* 4. Lệnh gán đang chờ duyệt */}
          <div className="rounded-2xl p-5" style={{
            background: soChoXuLy > 0 ? "rgba(217,119,6,0.03)" : "#fff",
            border: soChoXuLy > 0 ? "1.5px solid rgba(217,119,6,0.22)" : "1px solid #EEF0F4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: soChoXuLy > 0 ? "rgba(217,119,6,0.12)" : "rgba(100,116,139,0.07)" }}>
                <Clock size={18} color={soChoXuLy > 0 ? "#D97706" : "#94A3B8"} />
              </div>
              {soChoXuLy > 0 && (
                <span className="animate-pulse flex items-center gap-1 rounded-full px-2 py-1"
                  style={{ fontSize: "0.62rem", fontWeight: 700, color: "#D97706", background: "rgba(217,119,6,0.12)" }}>
                  Cần xử lý
                </span>
              )}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: soChoXuLy > 0 ? "#D97706" : "#94A3B8", lineHeight: 1 }}>
              {soChoXuLy}
            </div>
            <div style={{ fontSize: "0.73rem", color: "#94A3B8", marginTop: 6 }}>Lệnh gán đang chờ duyệt</div>
            <div className="mt-3 pt-3 flex items-center gap-3" style={{ borderTop: "1px solid #F1F5F9" }}>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#0F766E" }} />
                <span style={{ fontSize: "0.63rem", color: "#64748B" }}>{soDaDuyet} đã duyệt</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#D4183D" }} />
                <span style={{ fontSize: "0.63rem", color: "#64748B" }}>{soTuChoi} từ chối</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BIỂU ĐỒ + PHÂN TÍCH ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Biểu đồ miền — chiếm 2/3 */}
          <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} color="#005CB6" />
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>
                    Tình hình gán gói theo thời gian
                  </h3>
                </div>
                <p style={{ fontSize: "0.69rem", color: "#94A3B8", marginTop: 3 }}>
                  Tháng 04/2026 · {THONG_TIN_MAKER.chiNhanh} · Biểu đồ tích lũy
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-0.5 rounded" style={{ background: "#005CB6" }} />
                  <span style={{ fontSize: "0.65rem", color: "#64748B" }}>Tích lũy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: "rgba(0,92,182,0.15)" }} />
                  <span style={{ fontSize: "0.65rem", color: "#64748B" }}>Gán/ngày</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 border-t-2 border-dashed" style={{ borderColor: "rgba(212,24,61,0.5)" }} />
                  <span style={{ fontSize: "0.65rem", color: "#D4183D" }}>Tối đa</span>
                </div>
              </div>
            </div>
            <AreaChart data={CHART_DATA} hanMuc={KPI.hanMucCapPhat} />
          </div>

          {/* Phân tích nhanh — 1/3 */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2">
              <Zap size={15} color="#005CB6" />
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>Phân tích nhanh</h3>
            </div>

            {/* Vòng tròn tiến trình */}
            <div className="flex flex-col items-center py-2">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  <circle cx="60" cy="60" r="48" fill="none"
                    stroke={Number(pctDaGan) >= 90 ? "#D4183D" : Number(pctDaGan) >= 70 ? "#D97706" : "#005CB6"}
                    strokeWidth="12"
                    strokeDasharray={`${(Number(pctDaGan) / 100) * (2 * Math.PI * 48)} ${2 * Math.PI * 48}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{pctDaGan}%</div>
                  <div style={{ fontSize: "0.58rem", color: "#94A3B8", marginTop: 2 }}>đã sử dụng</div>
                </div>
              </div>
            </div>

            {/* Thống kê nhỏ */}
            <div className="space-y-2.5">
              {[
                { label: "Tốc độ TB/ngày",  val: `${(KPI.hanMucDaGan / 26).toFixed(0)} license`, color: "#005CB6", icon: TrendingUp },
                { label: "Ngày sử dụng",    val: "26 / 30 ngày",                                  color: "#0F766E", icon: Calendar  },
                { label: "Gói phổ biến nhất",val: "BASIC",                                         color: "#0284C7", icon: Package   },
                { label: "Lệnh gán thành công",val: `${soDaDuyet} / ${LENH_GAN_GAN_DAY.length}`,  color: "#0F766E", icon: ShieldCheck },
              ].map(s => {
                const SIc = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                    <div className="flex items-center gap-2">
                      <SIc size={12} color={s.color} />
                      <span style={{ fontSize: "0.71rem", color: "#64748B" }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0F172A" }}>{s.val}</span>
                  </div>
                );
              })}
            </div>

            {/* Cảnh báo còn lại */}
            <div className="flex items-start gap-2 p-3 rounded-xl mt-auto"
              style={{ background: isWarning ? "rgba(217,119,6,0.07)" : "rgba(0,92,182,0.05)", border: `1px solid ${isWarning ? "rgba(217,119,6,0.2)" : "rgba(0,92,182,0.15)"}` }}>
              <Info size={12} color={isWarning ? "#D97706" : "#005CB6"} className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.66rem", color: "#64748B", lineHeight: 1.6 }}>
                {isWarning
                  ? `Còn ${fmtSL(KPI.conLai)} license · Dự báo hết sau ~${Math.ceil(KPI.conLai / (KPI.hanMucDaGan / 26))} ngày nếu giữ tốc độ hiện tại.`
                  : `Hạn mức đủ dùng cho toàn tháng. Tốc độ gán ổn định ${(KPI.hanMucDaGan / 26).toFixed(0)} license/ngày.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── DANH SÁCH LỆNH GÁN GẦN ĐÂY ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-2"
            style={{ borderBottom: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-2">
              <Activity size={15} color="#005CB6" />
              <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>
                Trạng thái lệnh gán gần đây
              </h3>
              <span className="rounded-full px-2.5 py-0.5"
                style={{ fontSize: "0.65rem", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.08)" }}>
                {LENH_GAN_GAN_DAY.length} lệnh
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { ts: "Chờ duyệt" as const, count: soChoXuLy  },
                { ts: "Đã duyệt"  as const, count: soDaDuyet  },
                { ts: "Từ chối"   as const, count: soTuChoi   },
              ].map(item => {
                const cfg = TRANG_THAI_CFG[item.ts];
                const IIc = cfg.icon;
                return (
                  <div key={item.ts} className="flex items-center gap-1.5">
                    <IIc size={11} color={cfg.dot} />
                    <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                      {item.ts}: <strong style={{ color: "#0F172A" }}>{item.count}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {["STT", "Mã lệnh gán", "Loại gói", "Số lượng", "Đơn vị nhận", "Ngày tạo", "Trạng thái", ""].map((h, i) => (
                    <th key={`th-${i}`}
                      style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.62rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LENH_GAN_GAN_DAY.map((lenh, idx) => {
                  const cfg     = TRANG_THAI_CFG[lenh.trangThai];
                  const loaiCfg = LOAI_GOI_CFG[lenh.loaiGoi];
                  const TIc     = cfg.icon;
                  const isLast  = idx === LENH_GAN_GAN_DAY.length - 1;

                  return (
                    <tr key={lenh.id}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${lenh.trangThai === "Từ chối" ? "#D4183D" : lenh.trangThai === "Chờ duyệt" ? "#D97706" : "transparent"}`,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                      {/* STT */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#CBD5E1" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Mã lệnh */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Hash size={11} color="#94A3B8" />
                          <code style={{ fontSize: "0.76rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 7px", borderRadius: 6 }}>
                            {lenh.maLenh}
                          </code>
                        </div>
                      </td>

                      {/* Loại gói */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1.5 w-fit rounded-full px-2.5 py-1"
                          style={{ fontSize: "0.68rem", fontWeight: 800, color: loaiCfg.color, background: loaiCfg.bg, border: `1px solid ${loaiCfg.border}` }}>
                          <Gift size={10} /> {lenh.loaiGoi}
                        </span>
                      </td>

                      {/* Số lượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#0F172A" }}>
                          {fmtSL(lenh.soLuong)}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "#94A3B8", marginLeft: 3 }}>license</span>
                      </td>

                      {/* Đơn vị nhận */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(0,92,182,0.09)" }}>
                            <Package size={11} color="#005CB6" />
                          </div>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>{lenh.donViNhan}</span>
                        </div>
                        {lenh.ghiChu && (
                          <div className="flex items-center gap-1 mt-1">
                            <Info size={10} color="#D4183D" />
                            <span style={{ fontSize: "0.62rem", color: "#D4183D" }}>{lenh.ghiChu}</span>
                          </div>
                        )}
                      </td>

                      {/* Ngày tạo */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.79rem", color: "#64748B" }}>{lenh.ngayTao}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 w-fit whitespace-nowrap"
                          style={{ fontSize: "0.68rem", fontWeight: 800, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          <TIc size={10} />
                          {lenh.trangThai}
                        </span>
                      </td>

                      {/* Chi tiết */}
                      <td style={{ padding: "13px 10px" }}>
                        <button className="flex items-center gap-1 rounded-lg px-2 py-1.5"
                          style={{ background: "transparent", border: "1px solid transparent", color: "#005CB6", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,92,182,0.07)"; e.currentTarget.style.borderColor = "rgba(0,92,182,0.2)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
              Hiển thị <strong style={{ color: "#0F172A" }}>{LENH_GAN_GAN_DAY.length}</strong> lệnh gán gần nhất
            </span>
            <button className="flex items-center gap-1.5 rounded-xl px-3 py-2"
              style={{ background: "rgba(0,92,182,0.06)", border: "1.5px solid rgba(0,92,182,0.18)", color: "#005CB6", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              Xem tất cả lịch sử <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ── THÔNG TIN QUYỀN HẠN ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              icon: ShieldCheck, color: "#005CB6", bg: "rgba(0,92,182,0.07)",
              title: "Quyền chia sẻ (Maker)",
              desc: "Được phép tạo lệnh gán gói nội dung cho các đơn vị trực thuộc trong hạn mức được cấp.",
            },
            {
              icon: Clock, color: "#D97706", bg: "rgba(217,119,6,0.07)",
              title: "Lệnh gán cần Checker duyệt",
              desc: "Mỗi lệnh gán do Maker tạo sẽ cần Checker xem xét và phê duyệt trước khi có hiệu lực.",
            },
            {
              icon: Info, color: "#0F766E", bg: "rgba(15,118,110,0.07)",
              title: "Tính nhất quán dữ liệu",
              desc: "Số lượng đã gán phản ánh tức thì sau khi Checker duyệt. Dữ liệu đồng bộ với Admin.",
            },
          ].map(rb => {
            const RIc = rb.icon;
            return (
              <div key={rb.title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: rb.bg }}>
                  <RIc size={16} color={rb.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{rb.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", lineHeight: 1.65 }}>{rb.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
