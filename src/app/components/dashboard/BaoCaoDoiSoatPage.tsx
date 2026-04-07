import { useState, useMemo } from "react";
import {
  BarChart3, Search, X, Download, RefreshCw, Filter,
  AlertTriangle, AlertCircle, CheckCircle, ShieldOff,
  TrendingDown, Eye, FileText, FileSpreadsheet,
  MapPin, Building2, Package, Calendar, Hash, ArrowUpDown,
  Info, Zap, Lock, Activity, Bell, Tag,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────
// Không dùng enum cố định — tên gói & phân loại gói đến từ BCCS qua API

type TrangThaiHanMuc = "an-toan" | "canh-bao" | "nguy-cap";

interface BaoCaoDongDL {
  id: number;
  tinh: string;
  donVi: string;
  maGoi: string;        // Mã gói do BCCS cấp
  tenGoi: string;       // Tên gói do BCCS khai báo
  phanLoaiGoi: string;  // Phân loại gói do BCCS khai báo
  soLuongToiDa: number;
  soLuongDaGan: number;
  thoiGianBatDau: string;
  maGiaoDich: string;
}

// ── DỮ LIỆU MẪU (phản ánh cấu trúc API BCCS thực tế) ─────────────────────────

const DU_LIEU_MAU: BaoCaoDongDL[] = [
  {
    id: 1, tinh: "Hà Nội", donVi: "Viettel Hà Nội",
    maGoi: "BCCS-K12-TH-001", tenGoi: "Học liệu Toán Tiểu học", phanLoaiGoi: "Tiểu học",
    soLuongToiDa: 5000, soLuongDaGan: 4950, thoiGianBatDau: "01/04/2026", maGiaoDich: "GD-HN-001",
  },
  {
    id: 2, tinh: "TP.HCM", donVi: "Viettel TP.HCM",
    maGoi: "BCCS-K12-THCS-002", tenGoi: "Học liệu KHTN THCS", phanLoaiGoi: "THCS",
    soLuongToiDa: 3000, soLuongDaGan: 1200, thoiGianBatDau: "01/04/2026", maGiaoDich: "GD-HCM-002",
  },
  {
    id: 3, tinh: "Đà Nẵng", donVi: "Đại lý Miền Trung",
    maGoi: "BCCS-K12-THPT-003", tenGoi: "Luyện thi THPT Quốc gia", phanLoaiGoi: "THPT",
    soLuongToiDa: 2000, soLuongDaGan: 2000, thoiGianBatDau: "02/04/2026", maGiaoDich: "GD-MT-005",
  },
  {
    id: 4, tinh: "Cần Thơ", donVi: "Chi nhánh Cần Thơ",
    maGoi: "BCCS-K12-TH-001", tenGoi: "Học liệu Toán Tiểu học", phanLoaiGoi: "Tiểu học",
    soLuongToiDa: 1500, soLuongDaGan: 200, thoiGianBatDau: "02/04/2026", maGiaoDich: "GD-CT-008",
  },
  {
    id: 5, tinh: "Hải Phòng", donVi: "Đại lý Miền Bắc",
    maGoi: "BCCS-K12-THCS-004", tenGoi: "Học liệu Ngữ văn THCS", phanLoaiGoi: "THCS",
    soLuongToiDa: 4000, soLuongDaGan: 3850, thoiGianBatDau: "03/04/2026", maGiaoDich: "GD-MB-012",
  },
  {
    id: 6, tinh: "Toàn quốc", donVi: "NXB Phương Nam",
    maGoi: "BCCS-K12-FULL-005", tenGoi: "Trọn bộ K12 tất cả môn", phanLoaiGoi: "Trọn bộ K12",
    soLuongToiDa: 500, soLuongDaGan: 500, thoiGianBatDau: "03/04/2026", maGiaoDich: "GD-PN-001",
  },
  {
    id: 7, tinh: "Nghệ An", donVi: "Viettel Nghệ An",
    maGoi: "BCCS-K12-TH-006", tenGoi: "Tiếng Việt & Tự nhiên Tiểu học", phanLoaiGoi: "Tiểu học",
    soLuongToiDa: 2500, soLuongDaGan: 1000, thoiGianBatDau: "04/04/2026", maGiaoDich: "GD-NA-015",
  },
  {
    id: 8, tinh: "Quảng Ninh", donVi: "Đại lý Quảng Ninh",
    maGoi: "BCCS-K12-THPT-007", tenGoi: "Ôn luyện Toán THPT", phanLoaiGoi: "THPT",
    soLuongToiDa: 3000, soLuongDaGan: 2990, thoiGianBatDau: "04/04/2026", maGiaoDich: "GD-QN-020",
  },
  {
    id: 9, tinh: "Đồng Nai", donVi: "Viettel Đồng Nai",
    maGoi: "BCCS-K12-THCS-008", tenGoi: "Học liệu Lịch sử & Địa lý THCS", phanLoaiGoi: "THCS",
    soLuongToiDa: 4000, soLuongDaGan: 3500, thoiGianBatDau: "05/04/2026", maGiaoDich: "GD-DN-025",
  },
  {
    id: 10, tinh: "Bình Dương", donVi: "Đại lý Bình Dương",
    maGoi: "BCCS-K12-FULL-005", tenGoi: "Trọn bộ K12 tất cả môn", phanLoaiGoi: "Trọn bộ K12",
    soLuongToiDa: 2000, soLuongDaGan: 1900, thoiGianBatDau: "05/04/2026", maGiaoDich: "GD-BD-030",
  },
];

// ── MÀU ĐỘNG THEO PHÂN LOẠI (BCCS API trả về bao nhiêu loại cũng xử lý được) ─

const PALETTE = [
  { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.22)"   },
  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.22)"  },
  { color: "#0F766E", bg: "rgba(15,118,110,0.09)",  border: "rgba(15,118,110,0.22)"  },
  { color: "#D97706", bg: "rgba(217,119,6,0.09)",   border: "rgba(217,119,6,0.22)"   },
  { color: "#BE185D", bg: "rgba(190,24,93,0.09)",   border: "rgba(190,24,93,0.22)"   },
  { color: "#1D4ED8", bg: "rgba(29,78,216,0.09)",   border: "rgba(29,78,216,0.22)"   },
];

// Sinh ra map màu tự động từ danh sách phân loại có trong dữ liệu
function buildColorMap(data: BaoCaoDongDL[]) {
  const unique = [...new Set(data.map(d => d.phanLoaiGoi))];
  const map: Record<string, typeof PALETTE[0]> = {};
  unique.forEach((name, i) => {
    map[name] = PALETTE[i % PALETTE.length];
  });
  return map;
}

const PHAN_LOAI_COLOR_MAP = buildColorMap(DU_LIEU_MAU);

// ── DANH SÁCH LỌC ─────────────────────────────────────────────────────────────

const DS_TINH         = [...new Set(DU_LIEU_MAU.map(d => d.tinh))];
const DS_DON_VI       = [...new Set(DU_LIEU_MAU.map(d => d.donVi))];
const DS_PHAN_LOAI    = [...new Set(DU_LIEU_MAU.map(d => d.phanLoaiGoi))];

// ── LOGIC TRẠNG THÁI ──────────────────────────────────────────────────────────

function tinhTrangThai(toiDa: number, daGan: number): TrangThaiHanMuc {
  const conLai = toiDa - daGan;
  const pct = toiDa > 0 ? (conLai / toiDa) * 100 : 0;
  if (conLai <= 0 || daGan >= toiDa) return "nguy-cap";
  if (pct < 10) return "canh-bao";
  return "an-toan";
}

const TRANG_THAI_CFG = {
  "an-toan": {
    label: "An toàn",
    badgeColor: "#0F766E", badgeBg: "rgba(15,118,110,0.1)",
    rowBg: "transparent", rowBgHover: "rgba(0,92,182,0.013)",
    conLaiColor: "#0F766E", icon: CheckCircle, iconColor: "#0F766E",
    dotColor: "#0F766E", borderLeft: "transparent",
  },
  "canh-bao": {
    label: "Cảnh báo",
    badgeColor: "#D97706", badgeBg: "rgba(217,119,6,0.1)",
    rowBg: "rgba(251,191,36,0.04)", rowBgHover: "rgba(217,119,6,0.07)",
    conLaiColor: "#D97706", icon: AlertTriangle, iconColor: "#D97706",
    dotColor: "#D97706", borderLeft: "#D97706",
  },
  "nguy-cap": {
    label: "Hết hạn mức",
    badgeColor: "#D4183D", badgeBg: "rgba(212,24,61,0.12)",
    rowBg: "rgba(212,24,61,0.04)", rowBgHover: "rgba(212,24,61,0.08)",
    conLaiColor: "#D4183D", icon: ShieldOff, iconColor: "#D4183D",
    dotColor: "#D4183D", borderLeft: "#D4183D",
  },
};

// ── TIỆN ÍCH ──────────────────────────────────────────────────────────────────

const fmtSL = (n: number) => n.toLocaleString("vi-VN");
const pctConLai = (td: number, dg: number) =>
  td > 0 ? (((td - dg) / td) * 100).toFixed(1) : "0.0";

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "info" | "warning"; onClose: () => void }) {
  const colors = { success: "#0F766E", info: "#005CB6", warning: "#D97706" };
  const icons  = { success: CheckCircle, info: Info, warning: AlertTriangle };
  const Ic = icons[type];
  return (
    <div onClick={onClose} className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer"
      style={{ background: "#fff", border: `1.5px solid ${colors[type]}30`, boxShadow: "0 8px 32px rgba(0,0,0,0.13)", maxWidth: 400, animation: "fadeSlideIn 0.3s ease" }}>
      <Ic size={16} color={colors[type]} />
      <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1E293B" }}>{msg}</span>
      <X size={13} color="#94A3B8" />
    </div>
  );
}

// ── BADGE PHÂN LOẠI GÓI (động) ───────────────────────────────────────────────

function PhanLoaiBadge({ value }: { value: string }) {
  const cfg = PHAN_LOAI_COLOR_MAP[value] ?? PALETTE[0];
  return (
    <span className="rounded-full px-2.5 py-1 whitespace-nowrap"
      style={{ fontSize: "0.68rem", fontWeight: 800, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {value}
    </span>
  );
}

// ── DRAWER CHI TIẾT ───────────────────────────────────────────────────────────

function DrawerChiTiet({ row, onClose }: { row: BaoCaoDongDL; onClose: () => void }) {
  const conLai  = row.soLuongToiDa - row.soLuongDaGan;
  const ts      = tinhTrangThai(row.soLuongToiDa, row.soLuongDaGan);
  const cfg     = TRANG_THAI_CFG[ts];
  const TsIcon  = cfg.icon;
  const pct     = Number(pctConLai(row.soLuongToiDa, row.soLuongDaGan));
  const pctGan  = row.soLuongToiDa > 0 ? ((row.soLuongDaGan / row.soLuongToiDa) * 100) : 0;
  const goiClr  = PHAN_LOAI_COLOR_MAP[row.phanLoaiGoi] ?? PALETTE[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,23,42,0.44)", backdropFilter: "blur(3px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex flex-col h-full" style={{ width: 460, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", fontFamily: "'Be Vietnam Pro',sans-serif", animation: "drawerIn 0.25s ease" }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0"
          style={{ background: ts === "nguy-cap" ? "linear-gradient(135deg,#D4183D,#E53E3E)" : ts === "canh-bao" ? "linear-gradient(135deg,#D97706,#F59E0B)" : "linear-gradient(135deg,#005CB6,#0074E4)", color: "#fff" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.18)" }}>
                <TsIcon size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.12em", opacity: 0.75, textTransform: "uppercase" }}>Chi tiết Báo cáo Đối soát</div>
                <div style={{ fontSize: "0.96rem", fontWeight: 800, marginTop: 2 }}>{row.donVi}</div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.2)", fontSize: "0.74rem", fontWeight: 700 }}>
            <TsIcon size={12} color="#fff" />{cfg.label}
            {ts === "nguy-cap" && " · Khóa Gán Gói"}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Cảnh báo nguy cấp */}
          {ts === "nguy-cap" && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.22)" }}>
              <Lock size={14} color="#D4183D" className="flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ fontSize: "0.76rem", fontWeight: 800, color: "#D4183D", marginBottom: 3 }}>Đã kích hoạt Logic Chặn</p>
                <p style={{ fontSize: "0.69rem", color: "#374151", lineHeight: 1.65 }}>
                  Maker thuộc đơn vị <strong>{row.donVi}</strong> không thể thực hiện Gán gói. Nút "Gán gói" đã bị vô hiệu hóa tự động.
                </p>
              </div>
            </div>
          )}
          {ts === "canh-bao" && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(217,119,6,0.06)", border: "1.5px solid rgba(217,119,6,0.22)" }}>
              <Bell size={14} color="#D97706" className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.69rem", color: "#374151", lineHeight: 1.65 }}>
                Hạn mức còn lại <strong style={{ color: "#D97706" }}>{pct}%</strong> — Admin cần bổ sung hạn mức từ BCCS trước khi hết hoàn toàn.
              </p>
            </div>
          )}

          {/* Thông tin gói — lấy từ BCCS */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(0,92,182,0.04)", border: "1.5px solid rgba(0,92,182,0.14)" }}>
            <p style={{ fontSize: "0.63rem", fontWeight: 800, color: "#005CB6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Thông tin gói (nguồn BCCS)</p>
            {/* Tên gói */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Package size={13} color="#94A3B8" />
                <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Tên gói</span>
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1E293B", textAlign: "right", maxWidth: 220 }}>{row.tenGoi}</span>
            </div>
            {/* Mã gói BCCS */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Hash size={13} color="#94A3B8" />
                <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Mã gói BCCS</span>
              </div>
              <code style={{ fontSize: "0.74rem", fontFamily: "monospace,sans-serif", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.08)", padding: "2px 7px", borderRadius: 6 }}>
                {row.maGoi}
              </code>
            </div>
            {/* Phân loại gói */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag size={13} color="#94A3B8" />
                <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Phân loại gói</span>
              </div>
              <PhanLoaiBadge value={row.phanLoaiGoi} />
            </div>
          </div>

          {/* 3 KPI chính */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Số lượng tối đa",  val: fmtSL(row.soLuongToiDa), color: "#005CB6", bg: "rgba(0,92,182,0.08)" },
              { label: "Số lượng đã gán",  val: fmtSL(row.soLuongDaGan), color: "#0F766E", bg: "rgba(15,118,110,0.08)" },
              { label: "Số lượng còn lại", val: fmtSL(conLai),           color: cfg.conLaiColor, bg: `${cfg.conLaiColor}14` },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>Tỉ lệ đã gán</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: ts === "nguy-cap" ? "#D4183D" : ts === "canh-bao" ? "#D97706" : "#005CB6" }}>
                {pctGan.toFixed(1)}%
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: "#EEF0F4" }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(pctGan, 100)}%`,
                background: ts === "nguy-cap" ? "#D4183D" : ts === "canh-bao" ? "#D97706" : "linear-gradient(90deg,#005CB6,#0284C7)",
                transition: "width 0.6s ease"
              }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>0</span>
              <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>{fmtSL(row.soLuongToiDa)}</span>
            </div>
          </div>

          {/* Metadata giao dịch */}
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Thông tin giao dịch</p>
            {[
              { label: "Tỉnh / TP",        val: row.tinh,            icon: MapPin    },
              { label: "Đơn vị",            val: row.donVi,           icon: Building2 },
              { label: "Thời gian bắt đầu", val: row.thoiGianBatDau, icon: Calendar  },
              { label: "Mã giao dịch BCCS", val: row.maGiaoDich,     icon: Hash      },
            ].map(item => {
              const IIcon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <IIcon size={13} color="#94A3B8" />
                    <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1E293B", fontFamily: item.label.includes("Mã") ? "monospace" : "'Be Vietnam Pro'" }}>
                    {item.val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quy tắc nghiệp vụ */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(0,92,182,0.04)", border: "1.5px solid rgba(0,92,182,0.14)" }}>
            <Info size={13} color="#005CB6" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: "0.68rem", color: "#374151", lineHeight: 1.65 }}>
              <strong style={{ color: "#005CB6" }}>Tính nhất quán:</strong> Số liệu tại đây khớp 100% với dữ liệu nhận từ Menu <em>Quản lý License & BCCS</em>. Tên gói và phân loại gói phản ánh đúng khai báo từ BCCS.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid #EEF0F4" }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function BaoCaoDoiSoatPage() {
  const [tuKhoa,        setTuKhoa]        = useState("");
  const [locTinh,       setLocTinh]       = useState("");
  const [locDonVi,      setLocDonVi]      = useState("");
  const [locPhanLoai,   setLocPhanLoai]   = useState("");   // ← động từ BCCS
  const [locTrangThai,  setLocTrangThai]  = useState<TrangThaiHanMuc | "">("");
  const [sortKey,       setSortKey]       = useState<"soLuongToiDa" | "soLuongDaGan" | "conLai" | "">("");
  const [sortAsc,       setSortAsc]       = useState(false);
  const [drawer,        setDrawer]        = useState<BaoCaoDongDL | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; type: "success" | "info" | "warning" } | null>(null);
  const [refreshing,    setRefreshing]    = useState(false);

  const showToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast("Làm mới dữ liệu thành công — 06/04/2026 · 09:00", "success"); }, 1800);
  };

  const handleSort = (key: "soLuongToiDa" | "soLuongDaGan" | "conLai") => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const daDaLoc = useMemo(() => {
    return DU_LIEU_MAU
      .filter(row => {
        const ts = tinhTrangThai(row.soLuongToiDa, row.soLuongDaGan);
        const tuKhoaOk = !tuKhoa ||
          row.maGiaoDich.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          row.donVi.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          row.tinh.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          row.tenGoi.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          row.maGoi.toLowerCase().includes(tuKhoa.toLowerCase());
        return tuKhoaOk
          && (!locTinh      || row.tinh === locTinh)
          && (!locDonVi     || row.donVi === locDonVi)
          && (!locPhanLoai  || row.phanLoaiGoi === locPhanLoai)
          && (!locTrangThai || ts === locTrangThai);
      })
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = sortKey === "conLai" ? a.soLuongToiDa - a.soLuongDaGan : a[sortKey];
        const vb = sortKey === "conLai" ? b.soLuongToiDa - b.soLuongDaGan : b[sortKey];
        return sortAsc ? va - vb : vb - va;
      });
  }, [tuKhoa, locTinh, locDonVi, locPhanLoai, locTrangThai, sortKey, sortAsc]);

  // KPI tổng hợp
  const tongToiDa     = DU_LIEU_MAU.reduce((s, r) => s + r.soLuongToiDa, 0);
  const tongDaGan     = DU_LIEU_MAU.reduce((s, r) => s + r.soLuongDaGan, 0);
  const tongConLai    = tongToiDa - tongDaGan;
  const soNguyCapRows = DU_LIEU_MAU.filter(r => tinhTrangThai(r.soLuongToiDa, r.soLuongDaGan) === "nguy-cap").length;
  const soCanhBaoRows = DU_LIEU_MAU.filter(r => tinhTrangThai(r.soLuongToiDa, r.soLuongDaGan) === "canh-bao").length;
  const soAnToanRows  = DU_LIEU_MAU.filter(r => tinhTrangThai(r.soLuongToiDa, r.soLuongDaGan) === "an-toan").length;
  const pctSuDung     = tongToiDa > 0 ? ((tongDaGan / tongToiDa) * 100).toFixed(1) : "0";

  const coBoLoc = tuKhoa || locTinh || locDonVi || locPhanLoai || locTrangThai;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
              <BarChart3 size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.12rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                Báo cáo Đối soát License &amp; Hạn mức Phân phối
              </h2>
              <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 4 }}>
                Giám sát thông minh · Cảnh báo rủi ro thời gian thực · {DU_LIEU_MAU.length} đơn vị · Gói từ BCCS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => showToast("Đang xuất file Excel…", "info")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <FileSpreadsheet size={14} color="#0F766E" /> Excel
            </button>
            <button onClick={() => showToast("Đang xuất file PDF…", "info")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <FileText size={14} color="#D4183D" /> PDF
            </button>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: refreshing ? "#94A3B8" : "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: refreshing ? "none" : "0 4px 14px rgba(0,92,182,0.35)" }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              {refreshing ? "Đang làm mới…" : "Làm mới dữ liệu"}
            </button>
          </div>
        </div>

        {/* ── ALERT BANNER khi có nguy cấp ── */}
        {soNguyCapRows > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(212,24,61,0.07)", border: "1.5px solid rgba(212,24,61,0.25)", animation: "fadeSlideIn 0.4s ease" }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0" style={{ background: "rgba(212,24,61,0.14)" }}>
              <AlertCircle size={16} color="#D4183D" />
            </div>
            <div className="flex-1">
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#D4183D" }}>
                {soNguyCapRows} đơn vị đã HẾT HẠN MỨC
              </span>
              <span style={{ fontSize: "0.75rem", color: "#64748B", marginLeft: 8 }}>
                — Logic Chặn đã kích hoạt. Maker thuộc các đơn vị này không thể gán gói.
              </span>
            </div>
            {soCanhBaoRows > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(217,119,6,0.12)", fontSize: "0.72rem", fontWeight: 700, color: "#D97706" }}>
                <AlertTriangle size={12} /> {soCanhBaoRows} sắp hết
              </span>
            )}
          </div>
        )}

        {/* ── 5 KPI CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Số lượng tối đa",  val: fmtSL(tongToiDa),  icon: Activity,      color: "#005CB6", bg: "rgba(0,92,182,0.08)",    sub: "Tổng hạn mức" },
            { label: "Số lượng đã gán",  val: fmtSL(tongDaGan),  icon: CheckCircle,   color: "#0F766E", bg: "rgba(15,118,110,0.08)",  sub: `${pctSuDung}% sử dụng` },
            { label: "Số lượng còn lại", val: fmtSL(tongConLai), icon: TrendingDown,  color: "#D97706", bg: "rgba(217,119,6,0.08)",   sub: "Chưa phân phối" },
            { label: "Nguy cấp", val: soNguyCapRows, icon: ShieldOff,     color: soNguyCapRows > 0 ? "#D4183D" : "#94A3B8", bg: soNguyCapRows > 0 ? "rgba(212,24,61,0.08)" : "rgba(100,116,139,0.06)", sub: "Hết hạn mức" },
            { label: "Cảnh báo", val: soCanhBaoRows, icon: AlertTriangle, color: soCanhBaoRows > 0 ? "#D97706" : "#94A3B8", bg: soCanhBaoRows > 0 ? "rgba(217,119,6,0.08)"   : "rgba(100,116,139,0.06)", sub: "Dưới 10%" },
          ].map(s => {
            const SIc = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: s.bg }}>
                  <SIc size={17} color={s.color} />
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: "1.22rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
                  <div style={{ fontSize: "0.62rem", color: s.color, fontWeight: 600, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MINI HEAT MAP TRẠNG THÁI ── */}
        <div className="flex items-stretch gap-3">
          {[
            { ts: "an-toan"  as const, count: soAnToanRows,  label: "An toàn",     pct: (soAnToanRows  / DU_LIEU_MAU.length) * 100 },
            { ts: "canh-bao" as const, count: soCanhBaoRows, label: "Cảnh báo",    pct: (soCanhBaoRows / DU_LIEU_MAU.length) * 100 },
            { ts: "nguy-cap" as const, count: soNguyCapRows, label: "Hết hạn mức", pct: (soNguyCapRows / DU_LIEU_MAU.length) * 100 },
          ].map(g => {
            const cfg = TRANG_THAI_CFG[g.ts];
            const GIc = cfg.icon;
            return (
              <button key={g.ts} onClick={() => setLocTrangThai(locTrangThai === g.ts ? "" : g.ts)}
                className="flex-1 flex items-center gap-3 p-4 rounded-2xl transition-all"
                style={{ background: locTrangThai === g.ts ? cfg.badgeBg : "#fff", border: `1.5px solid ${locTrangThai === g.ts ? cfg.badgeColor + "44" : "#EEF0F4"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ background: `${cfg.badgeColor}14` }}>
                  <GIc size={18} color={cfg.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>{g.label}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: cfg.badgeColor }}>{g.count}</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "#EEF0F4" }}>
                    <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: cfg.badgeColor, transition: "width 0.6s ease" }} />
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginTop: 3 }}>
                    {g.pct.toFixed(0)}% đơn vị · Nhấn để lọc
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── BỘ LỌC THÔNG MINH ── */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>

          {/* Tìm kiếm */}
          <div className="relative flex items-center flex-1" style={{ minWidth: 240 }}>
            <Search size={15} color="#94A3B8" className="absolute left-3.5 pointer-events-none" />
            <input type="text" placeholder="Tìm mã GD, tên gói, đơn vị, tỉnh…" value={tuKhoa}
              onChange={e => setTuKhoa(e.target.value)}
              className="w-full outline-none rounded-xl"
              style={{ border: "1.5px solid #EEF0F4", padding: "9px 34px 9px 38px", fontSize: "0.83rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro'" }}
              onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#EEF0F4"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }}
            />
            {tuKhoa && (
              <button onClick={() => setTuKhoa("")} className="absolute right-3" style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={13} color="#94A3B8" />
              </button>
            )}
          </div>

          {/* Lọc Tỉnh */}
          <select value={locTinh} onChange={e => setLocTinh(e.target.value)} className="outline-none rounded-xl"
            style={{ border: `1.5px solid ${locTinh ? "#005CB6" : "#EEF0F4"}`, padding: "9px 12px", fontSize: "0.82rem", background: locTinh ? "rgba(0,92,182,0.05)" : "#F8F9FA", fontFamily: "'Be Vietnam Pro'", color: locTinh ? "#005CB6" : "#64748B", fontWeight: locTinh ? 700 : 400, cursor: "pointer" }}>
            <option value="">Tất cả Tỉnh / TP</option>
            {DS_TINH.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* Lọc Đơn vị */}
          <select value={locDonVi} onChange={e => setLocDonVi(e.target.value)} className="outline-none rounded-xl"
            style={{ border: `1.5px solid ${locDonVi ? "#005CB6" : "#EEF0F4"}`, padding: "9px 12px", fontSize: "0.82rem", background: locDonVi ? "rgba(0,92,182,0.05)" : "#F8F9FA", fontFamily: "'Be Vietnam Pro'", color: locDonVi ? "#005CB6" : "#64748B", fontWeight: locDonVi ? 700 : 400, cursor: "pointer" }}>
            <option value="">Tất cả Đơn vị</option>
            {DS_DON_VI.map(d => <option key={d}>{d}</option>)}
          </select>

          {/* Lọc Phân loại gói — ĐỘNG TỪ BCCS */}
          <select value={locPhanLoai} onChange={e => setLocPhanLoai(e.target.value)} className="outline-none rounded-xl"
            style={{ border: `1.5px solid ${locPhanLoai ? "#005CB6" : "#EEF0F4"}`, padding: "9px 12px", fontSize: "0.82rem", background: locPhanLoai ? "rgba(0,92,182,0.05)" : "#F8F9FA", fontFamily: "'Be Vietnam Pro'", color: locPhanLoai ? "#005CB6" : "#64748B", fontWeight: locPhanLoai ? 700 : 400, cursor: "pointer" }}>
            <option value="">Tất cả Phân loại gói</option>
            {DS_PHAN_LOAI.map(p => <option key={p}>{p}</option>)}
          </select>

          {coBoLoc && (
            <button onClick={() => { setTuKhoa(""); setLocTinh(""); setLocDonVi(""); setLocPhanLoai(""); setLocTrangThai(""); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.2)", color: "#D4183D", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <X size={12} /> Xóa lọc
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Filter size={13} color="#94A3B8" />
            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              <strong style={{ color: "#0F172A" }}>{daDaLoc.length}</strong> / {DU_LIEU_MAU.length}
            </span>
          </div>
        </div>

        {/* ── BẢNG DỮ LIỆU ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

          {/* Chú thích */}
          <div className="flex items-center gap-5 px-5 py-3 flex-wrap"
            style={{ background: "#FAFBFC", borderBottom: "1px solid #EEF0F4" }}>
            <div className="flex items-center gap-2">
              <Zap size={13} color="#005CB6" />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#005CB6" }}>Nhận diện rủi ro trong 3 giây</span>
            </div>
            {[
              { ts: "an-toan"  as const, label: "Bình thường (>20%)"  },
              { ts: "canh-bao" as const, label: "Cảnh báo (<10%)"     },
              { ts: "nguy-cap" as const, label: "Hết hạn mức (=0)"    },
            ].map(item => {
              const cfg = TRANG_THAI_CFG[item.ts];
              const LIc = cfg.icon;
              return (
                <div key={item.ts} className="flex items-center gap-1.5">
                  <LIc size={12} color={cfg.iconColor} />
                  <span style={{ fontSize: "0.7rem", color: "#64748B" }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {[
                    { label: "STT",                 w: "4%",  sort: null },
                    { label: "Tỉnh / TP",           w: "9%",  sort: null },
                    { label: "Đơn vị",              w: "16%", sort: null },
                    { label: "Tên gói",             w: "18%", sort: null },
                    { label: "Phân loại",           w: "9%",  sort: null },
                    { label: "Số lượng tối đa",     w: "10%", sort: "soLuongToiDa" as const },
                    { label: "Số lượng đã gán",     w: "10%", sort: "soLuongDaGan" as const },
                    { label: "Số lượng còn lại",    w: "11%", sort: "conLai" as const },
                    { label: "Mã giao dịch BCCS",   w: "10%", sort: null },
                    { label: "Trạng thái",          w: "9%",  sort: null },
                    { label: "",                    w: "4%",  sort: null },
                  ].map((col, ci) => (
                    <th key={`th-${ci}`}
                      style={{ width: col.w, padding: "11px 12px", textAlign: "left", fontSize: "0.63rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {col.sort ? (
                        <button onClick={() => handleSort(col.sort!)}
                          className="flex items-center gap-1"
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontSize: "0.63rem", fontWeight: 800, color: sortKey === col.sort ? "#005CB6" : "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {col.label}
                          <ArrowUpDown size={10} color={sortKey === col.sort ? "#005CB6" : "#CBD5E1"} />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daDaLoc.length === 0 ? (
                  <tr><td colSpan={11} style={{ padding: "52px 16px", textAlign: "center" }}>
                    <div className="flex flex-col items-center gap-3">
                      <Filter size={36} color="#CBD5E1" />
                      <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Không tìm thấy dữ liệu phù hợp</p>
                    </div>
                  </td></tr>
                ) : daDaLoc.map((row, idx) => {
                  const conLai  = row.soLuongToiDa - row.soLuongDaGan;
                  const ts      = tinhTrangThai(row.soLuongToiDa, row.soLuongDaGan);
                  const cfg     = TRANG_THAI_CFG[ts];
                  const TsIc    = cfg.icon;
                  const pctGan  = row.soLuongToiDa > 0 ? (row.soLuongDaGan / row.soLuongToiDa) * 100 : 0;
                  const isLast  = idx === daDaLoc.length - 1;

                  return (
                    <tr key={row.id}
                      style={{
                        background: cfg.rowBg,
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${cfg.borderLeft}`,
                        transition: "background 0.13s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = cfg.rowBgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = cfg.rowBg)}>

                      {/* STT */}
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#CBD5E1" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Tỉnh */}
                      <td style={{ padding: "13px 12px" }}>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.79rem", fontWeight: 600, color: "#374151" }}>{row.tinh}</span>
                        </div>
                      </td>

                      {/* Đơn vị */}
                      <td style={{ padding: "13px 12px" }}>
                        <div className="flex items-center gap-2">
                          {ts === "nguy-cap" && (
                            <div className="flex items-center justify-center w-5 h-5 rounded flex-shrink-0" style={{ background: "rgba(212,24,61,0.12)" }}>
                              <Lock size={10} color="#D4183D" />
                            </div>
                          )}
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: ts === "nguy-cap" ? "#D4183D" : "#1E293B" }}>
                            {row.donVi}
                          </span>
                        </div>
                      </td>

                      {/* Tên gói — động từ BCCS */}
                      <td style={{ padding: "13px 12px" }}>
                        <div>
                          <div style={{ fontSize: "0.79rem", fontWeight: 600, color: "#1E293B", lineHeight: 1.3 }}>
                            {row.tenGoi}
                          </div>
                          <code style={{ fontSize: "0.63rem", fontFamily: "monospace,sans-serif", color: "#94A3B8", marginTop: 2, display: "block" }}>
                            {row.maGoi}
                          </code>
                        </div>
                      </td>

                      {/* Phân loại gói — động */}
                      <td style={{ padding: "13px 12px" }}>
                        <PhanLoaiBadge value={row.phanLoaiGoi} />
                      </td>

                      {/* Số lượng tối đa */}
                      <td style={{ padding: "13px 12px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#005CB6" }}>
                          {fmtSL(row.soLuongToiDa)}
                        </span>
                      </td>

                      {/* Số lượng đã gán + mini bar */}
                      <td style={{ padding: "13px 12px" }}>
                        <div>
                          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0F172A" }}>
                            {fmtSL(row.soLuongDaGan)}
                          </span>
                          <div className="w-full rounded-full overflow-hidden mt-1" style={{ height: 4, background: "#EEF0F4", maxWidth: 80 }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${Math.min(pctGan, 100)}%`, background: ts === "nguy-cap" ? "#D4183D" : ts === "canh-bao" ? "#D97706" : "#0F766E" }} />
                          </div>
                        </div>
                      </td>

                      {/* Số lượng còn lại — Smart State Cell */}
                      <td style={{ padding: "13px 12px" }}>
                        {ts === "nguy-cap" ? (
                          <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 w-fit"
                            style={{ background: "rgba(212,24,61,0.12)", color: "#D4183D", fontSize: "0.75rem", fontWeight: 800 }}>
                            <ShieldOff size={11} />
                            {fmtSL(conLai)} · Hết
                          </span>
                        ) : ts === "canh-bao" ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={13} color="#D97706" />
                            <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#D97706" }}>{fmtSL(conLai)}</span>
                            <span style={{ fontSize: "0.62rem", color: "#D97706", fontWeight: 600 }}>({pctConLai(row.soLuongToiDa, row.soLuongDaGan)}%)</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F766E" }}>{fmtSL(conLai)}</span>
                        )}
                      </td>

                      {/* Mã giao dịch BCCS */}
                      <td style={{ padding: "13px 12px" }}>
                        <code style={{ fontSize: "0.74rem", fontFamily: "monospace,sans-serif", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 7px", borderRadius: 6 }}>
                          {row.maGiaoDich}
                        </code>
                      </td>

                      {/* Trạng thái badge */}
                      <td style={{ padding: "13px 12px" }}>
                        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 w-fit whitespace-nowrap"
                          style={{ background: cfg.badgeBg, color: cfg.badgeColor, fontSize: "0.67rem", fontWeight: 800 }}>
                          <TsIc size={10} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Xem chi tiết */}
                      <td style={{ padding: "13px 8px" }}>
                        <button onClick={() => setDrawer(row)}
                          className="flex items-center justify-center w-7 h-7 rounded-lg"
                          style={{ background: "transparent", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <Eye size={14} color="#005CB6" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer bảng */}
          <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { ts: "an-toan"  as const, count: soAnToanRows  },
                { ts: "canh-bao" as const, count: soCanhBaoRows },
                { ts: "nguy-cap" as const, count: soNguyCapRows },
              ].map(item => {
                const cfg = TRANG_THAI_CFG[item.ts];
                const FIc = cfg.icon;
                return (
                  <div key={item.ts} className="flex items-center gap-1.5">
                    <FIc size={11} color={cfg.dotColor} />
                    <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                      {cfg.label}: <strong style={{ color: "#0F172A" }}>{item.count}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                Tổng: <strong style={{ color: "#005CB6" }}>{fmtSL(tongToiDa)}</strong> license
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                Hiển thị <strong style={{ color: "#0F172A" }}>{daDaLoc.length}</strong> / {DU_LIEU_MAU.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {drawer && <DrawerChiTiet row={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
}
