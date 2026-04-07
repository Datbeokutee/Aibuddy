import { useState, useRef, useEffect } from "react";
import {
  Share2, Building2, Package, Hash, CalendarDays, AlertTriangle,
  CheckCircle2, ChevronDown, Info, Clock, Send, X, Sparkles,
  ShieldAlert, Lock, Search, MapPin, ChevronRight, User,
  FileText, AlertCircle, Shield, Zap, TrendingDown, Gift,
} from "lucide-react";
import type { UserRole } from "../LoginScreen";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const TONG_HAN_MUC      = 1000;   // Hạn mức được cấp (khớp MakerDashboard)
const HAN_MUC_DA_GAN    = 850;    // Đã gán
const HAN_MUC_KHA_DUNG  = 150;    // Còn lại = kho

// ── DATA ──────────────────────────────────────────────────────────────────────

const DON_VI_LIST = [
  { id: "dv001", name: "Trường THCS Nghĩa Tân",         district: "Cầu Giấy, Hà Nội",    loai: "Trường học"  },
  { id: "dv002", name: "Trường THPT Cầu Giấy",          district: "Cầu Giấy, Hà Nội",    loai: "Trường học"  },
  { id: "dv003", name: "Tiểu học Dịch Vọng A",          district: "Cầu Giấy, Hà Nội",    loai: "Trường học"  },
  { id: "dv004", name: "Trường THPT Yên Hòa",           district: "Cầu Giấy, Hà Nội",    loai: "Trường học"  },
  { id: "dv005", name: "Trường THCS Mai Dịch",          district: "Cầu Giấy, Hà Nội",    loai: "Trường học"  },
  { id: "dv006", name: "Đại lý Cầu Giấy A",             district: "Cầu Giấy, Hà Nội",    loai: "Đại lý"      },
  { id: "dv007", name: "Đại lý Hà Đông",               district: "Hà Đông, Hà Nội",     loai: "Đại lý"      },
  { id: "dv008", name: "Trường THCS Trung Tự",          district: "Đống Đa, Hà Nội",     loai: "Trường học"  },
  { id: "dv009", name: "Trường Tiểu học Đoàn Thị Điểm",district: "Nam Từ Liêm, Hà Nội", loai: "Trường học"  },
  { id: "dv010", name: "Đại lý Cầu Giấy B",             district: "Cầu Giấy, Hà Nội",    loai: "Đại lý"      },
];

const GOI_OPTIONS = [
  {
    id: "BASIC",
    name: "BASIC",
    tag: "Cơ bản",
    desc: "Bộ nội dung cốt lõi theo chương trình chuẩn",
    color: "#0284C7",
    bg: "rgba(2,132,199,0.08)",
    bgDark: "rgba(2,132,199,0.15)",
    border: "rgba(2,132,199,0.25)",
    features: ["Toán, Văn, Anh cơ bản", "Video bài giảng HD", "Bài tập tương tác"],
  },
  {
    id: "PLUS",
    name: "PLUS",
    tag: "Nâng cao",
    desc: "Đầy đủ nội dung mở rộng & luyện thi",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    bgDark: "rgba(124,58,237,0.14)",
    border: "rgba(124,58,237,0.25)",
    features: ["Tất cả môn học", "Luyện thi THPT QG", "AI cá nhân hóa"],
  },
  {
    id: "VIP",
    name: "VIP",
    tag: "Cao cấp",
    desc: "Trải nghiệm học tập toàn diện, ưu tiên cao",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    bgDark: "rgba(217,119,6,0.14)",
    border: "rgba(217,119,6,0.25)",
    features: ["Toàn bộ nội dung PLUS", "Gia sư AI 24/7", "Báo cáo học tập nâng cao"],
  },
];

const THOI_HAN_OPTIONS = [
  { value: "1",  label: "1 tháng"   },
  { value: "3",  label: "3 tháng"   },
  { value: "6",  label: "6 tháng"   },
  { value: "12", label: "12 tháng"  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

const fmtSL = (n: number) => n.toLocaleString("vi-VN");
const today = () => new Date().toISOString().split("T")[0];
const addMonths = (dateStr: string, months: number) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
};
const formatDateVN = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// ── DROPDOWN ĐƠN VỊ CÓ TÌM KIẾM ──────────────────────────────────────────────

function DonViDropdown({
  value, onChange, error,
}: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = DON_VI_LIST.find(d => d.id === value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DON_VI_LIST.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.district.toLowerCase().includes(search.toLowerCase())
  );

  const groups = [
    { label: "Trường học", items: filtered.filter(d => d.loai === "Trường học"), icon: Building2, color: "#005CB6" },
    { label: "Đại lý",     items: filtered.filter(d => d.loai === "Đại lý"),    icon: User,      color: "#7C3AED" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-xl transition-all duration-150"
        style={{
          padding: "11px 14px",
          background: "#fff",
          border: `1.5px solid ${error ? "#D4183D" : open ? "#005CB6" : "#E2E8F0"}`,
          boxShadow: open ? "0 0 0 3px rgba(0,92,182,0.09)" : error ? "0 0 0 3px rgba(212,24,61,0.08)" : "none",
          cursor: "pointer", textAlign: "left", fontFamily: "'Be Vietnam Pro',sans-serif",
        }}>
        {selected ? (
          <>
            <div className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
              style={{ background: selected.loai === "Trường học" ? "rgba(0,92,182,0.1)" : "rgba(124,58,237,0.1)" }}>
              {selected.loai === "Trường học"
                ? <Building2 size={12} color="#005CB6" />
                : <User size={12} color="#7C3AED" />}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected.name}</div>
              <div style={{ fontSize: "0.67rem", color: "#94A3B8" }}>{selected.district}</div>
            </div>
            <span onClick={e => { e.stopPropagation(); onChange(""); }}
              style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <X size={13} color="#94A3B8" />
            </span>
          </>
        ) : (
          <>
            <Search size={14} color="#94A3B8" />
            <span style={{ fontSize: "0.85rem", color: "#94A3B8", flex: 1 }}>— Chọn đơn vị hoặc trường tiếp nhận —</span>
          </>
        )}
        <ChevronDown size={14} color="#94A3B8" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 rounded-xl overflow-hidden z-50"
          style={{ top: "calc(100% + 6px)", background: "#fff", border: "1.5px solid #E2E8F0", boxShadow: "0 10px 32px rgba(0,0,0,0.14)", maxHeight: 320, display: "flex", flexDirection: "column" }}>

          {/* Search box */}
          <div className="p-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="relative flex items-center">
              <Search size={13} color="#94A3B8" className="absolute left-3 pointer-events-none" />
              <input autoFocus type="text" placeholder="Tìm kiếm đơn vị, trường…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full outline-none rounded-lg"
                style={{ padding: "7px 10px 7px 30px", fontSize: "0.8rem", background: "#F8F9FA", border: "1px solid #EEF0F4", fontFamily: "'Be Vietnam Pro',sans-serif" }} />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 py-1">
            {groups.map(g => {
              if (g.items.length === 0) return null;
              const GIcon = g.icon;
              return (
                <div key={g.label}>
                  <div className="px-3 py-1.5 flex items-center gap-1.5"
                    style={{ fontSize: "0.63rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    <GIcon size={10} color={g.color} /> {g.label}
                  </div>
                  {g.items.map(opt => (
                    <button key={opt.id} type="button"
                      onClick={() => { onChange(opt.id); setOpen(false); setSearch(""); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                      style={{ background: value === opt.id ? "rgba(0,92,182,0.06)" : "transparent", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}
                      onMouseEnter={e => { if (value !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA"; }}
                      onMouseLeave={e => { if (value !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                        style={{ background: opt.loai === "Trường học" ? "rgba(0,92,182,0.08)" : "rgba(124,58,237,0.08)" }}>
                        <GIcon size={13} color={g.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: "0.83rem", fontWeight: value === opt.id ? 700 : 500, color: value === opt.id ? "#005CB6" : "#1E293B" }}>
                          {opt.name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} color="#94A3B8" />
                          <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{opt.district}</span>
                        </div>
                      </div>
                      {value === opt.id && <CheckCircle2 size={14} color="#005CB6" />}
                    </button>
                  ))}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-6 text-center">
                <Search size={22} color="#CBD5E1" className="mx-auto mb-2" />
                <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Không tìm thấy đơn vị phù hợp</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONFIRM MODAL ─────────────────────────────────────────────────────────────

function ModalXacNhan({
  donViId, goiId, soLuong, batDau, thoiHan, onConfirm, onCancel,
}: {
  donViId: string; goiId: string; soLuong: string;
  batDau: string; thoiHan: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  const donVi  = DON_VI_LIST.find(d => d.id === donViId);
  const goi    = GOI_OPTIONS.find(g => g.id === goiId);
  const ketThuc = addMonths(batDau, parseInt(thoiHan) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl overflow-hidden mx-4" style={{ width: 460, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeSlideIn 0.25s ease", fontFamily: "'Be Vietnam Pro',sans-serif" }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.18)" }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Xác nhận gửi duyệt</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>Kiểm tra lại thông tin</div>
            </div>
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
            Sau khi gửi, lệnh sẽ được chuyển đến Checker để phê duyệt. Vui lòng kiểm tra kỹ trước khi xác nhận.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-2.5">
          {[
            { label: "Đơn vị nhận",        val: donVi?.name ?? "—",               icon: Building2  },
            { label: "Địa chỉ",            val: donVi?.district ?? "—",            icon: MapPin     },
            { label: "Loại gói",           val: goi?.name ?? "—",                 icon: Gift       },
            { label: "Số lượng license",   val: `${fmtSL(parseInt(soLuong))} license`, icon: Hash  },
            { label: "Thời gian bắt đầu",  val: formatDateVN(batDau),             icon: CalendarDays },
            { label: "Thời hạn sử dụng",   val: `${thoiHan} tháng (đến ${formatDateVN(ketThuc)})`, icon: Clock },
          ].map(row => {
            const RIc = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl"
                style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                <div className="flex items-center gap-2">
                  <RIc size={13} color="#94A3B8" />
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{row.label}</span>
                </div>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>{row.val}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl"
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.87rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
            Quay lại
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.87rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
            <Send size={14} /> Xác nhận gửi duyệt
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

interface ChiaSeGoiPageProps { userRole?: UserRole; }

export function ChiaSeGoiPage({ userRole = "admin" }: ChiaSeGoiPageProps) {
  const [donViId,   setDonViId]   = useState("");
  const [goiId,     setGoiId]     = useState("");
  const [soLuong,   setSoLuong]   = useState("");
  const [batDau,    setBatDau]    = useState(today());
  const [thoiHan,   setThoiHan]   = useState("6");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [maLenh,    setMaLenh]    = useState("");

  const soLuongNum      = parseInt(soLuong) || 0;
  const isVuotHanMuc    = soLuongNum > HAN_MUC_KHA_DUNG;
  const isNhapSaiSL     = soLuongNum > 0 && soLuongNum > HAN_MUC_KHA_DUNG;
  const isFormValid     = !!donViId && !!goiId && soLuong !== "" && soLuongNum > 0 && !!batDau && !!thoiHan && !isVuotHanMuc;
  const pctDaGan        = (HAN_MUC_DA_GAN / TONG_HAN_MUC) * 100;
  const pctLenhNay      = Math.min((soLuongNum / TONG_HAN_MUC) * 100, 100 - pctDaGan);
  const conLaiSauGan    = Math.max(0, HAN_MUC_KHA_DUNG - soLuongNum);
  const goiSelected     = GOI_OPTIONS.find(g => g.id === goiId);
  const ketThuc         = addMonths(batDau, parseInt(thoiHan) || 0);

  function handleReset() {
    setDonViId(""); setGoiId(""); setSoLuong(""); setBatDau(today()); setThoiHan("6");
    setSubmitted(false); setShowConfirm(false); setMaLenh("");
  }

  function handleSubmit() {
    if (!isFormValid) return;
    setShowConfirm(false);
    setMaLenh(`LG-CG-${String(Date.now()).slice(-5)}`);
    setSubmitted(true);
  }

  // Logic chặn: nếu role maker và đơn vị đã hết hạn mức (demo: dv007 bị chặn)
  const BLOCKED_UNITS = ["dv007"];
  const isBlocked = BLOCKED_UNITS.includes(donViId);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 max-w-screen-xl mx-auto space-y-5">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Trang chủ</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Gói nội dung</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#005CB6", fontWeight: 600 }}>Chia sẻ gói</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                <Share2 size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Chia sẻ gói cước</h1>
                <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 3 }}>
                  Phân phối license từ Chi nhánh Cầu Giấy đến đơn vị / trường học
                </p>
              </div>
            </div>
          </div>

          {/* Hạn mức tổng quan nhanh */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#0F766E" }} />
              <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Đã gán:</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A" }}>{fmtSL(HAN_MUC_DA_GAN)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{ background: "rgba(0,92,182,0.05)", border: "1.5px solid rgba(0,92,182,0.2)" }}>
              <Zap size={14} color="#005CB6" />
              <span style={{ fontSize: "0.78rem", color: "#005CB6" }}>Kho còn lại:</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#005CB6" }}>{fmtSL(HAN_MUC_KHA_DUNG)}</span>
              <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>/ {fmtSL(TONG_HAN_MUC)}</span>
            </div>
          </div>
        </div>

        {/* ── LAYOUT CHÍNH ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── LEFT: FORM (3/5) ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* SUCCESS STATE */}
            {submitted ? (
              <div className="rounded-2xl p-8 flex flex-col items-center text-center space-y-5"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", animation: "fadeSlideIn 0.4s ease" }}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(15,118,110,0.1)" }}>
                    <CheckCircle2 size={40} color="#0F766E" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "#0F766E" }}>
                    <Zap size={12} color="#fff" />
                  </div>
                </div>
                <div>
                  <h3 style={{ color: "#0F172A", fontSize: "1.15rem", fontWeight: 800 }}>Lệnh gán đã gửi thành công!</h3>
                  <p style={{ color: "#64748B", fontSize: "0.82rem", marginTop: 6, lineHeight: 1.65 }}>
                    Lệnh chia sẻ gói <strong style={{ color: goiSelected?.color }}>{goiId}</strong> cho{" "}
                    <strong>{DON_VI_LIST.find(d => d.id === donViId)?.name}</strong> đang chờ Checker phê duyệt.
                  </p>
                </div>
                <div className="w-full rounded-2xl p-4 space-y-2.5" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                  {[
                    { label: "Mã lệnh gán",   val: maLenh,                icon: Hash,         mono: true  },
                    { label: "Số lượng",       val: `${fmtSL(soLuongNum)} license`, icon: Package, mono: false },
                    { label: "Thời gian",      val: `${formatDateVN(batDau)} → ${formatDateVN(ketThuc)}`, icon: CalendarDays, mono: false },
                    { label: "Trạng thái",     val: "Chờ duyệt",          icon: Clock,        mono: false },
                  ].map(row => {
                    const RIc = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RIc size={13} color="#94A3B8" />
                          <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>{row.label}</span>
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", fontFamily: row.mono ? "monospace" : "'Be Vietnam Pro'" }}>
                          {row.val}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl"
                  style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.87rem", fontWeight: 700, fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                  <Sparkles size={15} /> Tạo lệnh gán mới
                </button>
              </div>
            ) : (

              /* ── FORM CARD ── */
              <div className="rounded-2xl overflow-visible"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

                {/* Form header */}
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: "1px solid #EEF0F4", background: "#FAFBFC" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(0,92,182,0.08)" }}>
                      <FileText size={16} color="#005CB6" />
                    </div>
                    <div>
                      <h2 style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: 800, lineHeight: 1 }}>Khởi tạo lệnh chia sẻ gói</h2>
                      <p style={{ color: "#94A3B8", fontSize: "0.7rem", marginTop: 3 }}>Điền đầy đủ thông tin bên dưới để gửi duyệt</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{ background: "rgba(15,118,110,0.08)", border: "1px solid rgba(15,118,110,0.2)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#0F766E" }} />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#0F766E" }}>Hoạt động</span>
                  </div>
                </div>

                <form onSubmit={e => { e.preventDefault(); if (isFormValid) setShowConfirm(true); }}
                  className="px-6 py-5 space-y-6">

                  {/* ── 1. Chọn đơn vị ── */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2" style={{ fontSize: "0.83rem", fontWeight: 700, color: "#334155" }}>
                      <Building2 size={13} color="#005CB6" />
                      Đối tượng nhận
                      <span style={{ color: "#D4183D" }}>*</span>
                    </label>
                    <DonViDropdown value={donViId} onChange={setDonViId} error={isBlocked} />
                    {isBlocked && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.2)" }}>
                        <Lock size={13} color="#D4183D" className="flex-shrink-0" />
                        <p style={{ fontSize: "0.74rem", color: "#D4183D", fontWeight: 600 }}>
                          Đơn vị này đang bị <strong>Khóa Gán Gói</strong> do hết hạn mức. Vui lòng liên hệ Admin để bổ sung.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── 2. Chọn gói nội dung ── */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2" style={{ fontSize: "0.83rem", fontWeight: 700, color: "#334155" }}>
                      <Package size={13} color="#005CB6" />
                      Gói nội dung
                      <span style={{ color: "#D4183D" }}>*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {GOI_OPTIONS.map(opt => {
                        const sel = goiId === opt.id;
                        return (
                          <button key={opt.id} type="button" onClick={() => setGoiId(opt.id)}
                            className="flex flex-col items-start rounded-xl p-3.5 transition-all duration-200 text-left"
                            style={{ background: sel ? opt.bg : "#F8F9FA", border: `2px solid ${sel ? opt.color : "#E2E8F0"}`, boxShadow: sel ? `0 0 0 3px ${opt.border}` : "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                            <div className="flex items-center justify-between w-full mb-2">
                              <span style={{ fontSize: "0.92rem", fontWeight: 800, color: sel ? opt.color : "#334155" }}>{opt.name}</span>
                              <span className="rounded-full px-2 py-0.5"
                                style={{ fontSize: "0.6rem", fontWeight: 700, background: sel ? opt.color : "#E2E8F0", color: sel ? "#fff" : "#64748B" }}>
                                {opt.tag}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.67rem", color: sel ? opt.color : "#94A3B8", marginBottom: 8, lineHeight: 1.55 }}>{opt.desc}</p>
                            <div className="space-y-1 w-full">
                              {opt.features.map(f => (
                                <div key={f} className="flex items-center gap-1.5">
                                  <CheckCircle2 size={10} color={sel ? opt.color : "#CBD5E1"} />
                                  <span style={{ fontSize: "0.65rem", color: sel ? opt.color : "#94A3B8" }}>{f}</span>
                                </div>
                              ))}
                            </div>
                            {sel && (
                              <div className="w-full mt-2.5 pt-2" style={{ borderTop: `1px solid ${opt.border}` }}>
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 size={11} color={opt.color} />
                                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: opt.color }}>Đã chọn</span>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 3. Số lượng + Thời gian bắt đầu ── */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* Số lượng */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2" style={{ fontSize: "0.83rem", fontWeight: 700, color: "#334155" }}>
                        <Hash size={13} color="#005CB6" />
                        Số lượng gói cước
                        <span style={{ color: "#D4183D" }}>*</span>
                      </label>
                      <div className="relative">
                        <input type="number" min={1} max={HAN_MUC_KHA_DUNG} placeholder="VD: 50"
                          value={soLuong}
                          onChange={e => setSoLuong(e.target.value)}
                          className="w-full rounded-xl outline-none transition-all"
                          style={{
                            padding: "11px 50px 11px 14px",
                            background: "#fff",
                            border: `1.5px solid ${isNhapSaiSL ? "#D4183D" : soLuong && !isNhapSaiSL ? "#0F766E" : "#E2E8F0"}`,
                            fontSize: "0.95rem", fontWeight: 600, color: "#0F172A",
                            boxShadow: isNhapSaiSL ? "0 0 0 3px rgba(212,24,61,0.09)" : soLuong && !isNhapSaiSL ? "0 0 0 3px rgba(15,118,110,0.09)" : "none",
                            fontFamily: "'Be Vietnam Pro'",
                          }} />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          {isNhapSaiSL
                            ? <AlertCircle size={16} color="#D4183D" />
                            : soLuong && soLuongNum > 0
                            ? <CheckCircle2 size={16} color="#0F766E" />
                            : <Hash size={14} color="#CBD5E1" />}
                        </div>
                      </div>
                      {/* Gợi ý range */}
                      {!soLuong && (
                        <p style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                          Tối đa: <strong style={{ color: "#005CB6" }}>{fmtSL(HAN_MUC_KHA_DUNG)}</strong> license
                        </p>
                      )}
                      {soLuong && !isNhapSaiSL && soLuongNum > 0 && (
                        <p className="flex items-center gap-1" style={{ fontSize: "0.69rem", color: "#0F766E" }}>
                          <CheckCircle2 size={11} /> Trong hạn mức — còn lại {fmtSL(conLaiSauGan)} sau lệnh này
                        </p>
                      )}
                    </div>

                    {/* Thời gian bắt đầu */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2" style={{ fontSize: "0.83rem", fontWeight: 700, color: "#334155" }}>
                        <CalendarDays size={13} color="#005CB6" />
                        Thời gian bắt đầu
                        <span style={{ color: "#D4183D" }}>*</span>
                      </label>
                      <input type="date" value={batDau}
                        min={today()}
                        onChange={e => setBatDau(e.target.value)}
                        className="w-full rounded-xl outline-none transition-all"
                        style={{ padding: "11px 14px", background: "#fff", border: `1.5px solid ${batDau ? "#0F766E" : "#E2E8F0"}`, fontSize: "0.87rem", color: "#0F172A", boxShadow: batDau ? "0 0 0 3px rgba(15,118,110,0.09)" : "none", fontFamily: "'Be Vietnam Pro'", cursor: "pointer" }} />
                    </div>
                  </div>

                  {/* ── 4. Thời gian sử dụng (duration) ── */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2" style={{ fontSize: "0.83rem", fontWeight: 700, color: "#334155" }}>
                      <Clock size={13} color="#005CB6" />
                      Thời gian sử dụng
                      <span style={{ color: "#D4183D" }}>*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {THOI_HAN_OPTIONS.map(opt => {
                        const sel = thoiHan === opt.value;
                        return (
                          <button key={opt.value} type="button" onClick={() => setThoiHan(opt.value)}
                            className="py-2.5 rounded-xl transition-all text-center"
                            style={{ background: sel ? "rgba(0,92,182,0.08)" : "#F8F9FA", border: `2px solid ${sel ? "#005CB6" : "#E2E8F0"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontSize: "0.82rem", fontWeight: sel ? 800 : 500, color: sel ? "#005CB6" : "#64748B" }}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    {batDau && thoiHan && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                        style={{ background: "rgba(0,92,182,0.04)", border: "1px solid rgba(0,92,182,0.12)" }}>
                        <CalendarDays size={13} color="#005CB6" />
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Thời gian hiệu lực: <strong style={{ color: "#005CB6" }}>{formatDateVN(batDau)}</strong>
                          {" → "}
                          <strong style={{ color: "#005CB6" }}>{formatDateVN(ketThuc)}</strong>
                          <span style={{ color: "#94A3B8" }}> ({thoiHan} tháng)</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── THANH PROGRESS HẠN MỨC ── */}
                  <div className="rounded-2xl p-4 space-y-3 transition-all"
                    style={{ background: isNhapSaiSL ? "rgba(212,24,61,0.04)" : "rgba(0,92,182,0.04)", border: `1.5px solid ${isNhapSaiSL ? "rgba(212,24,61,0.2)" : "rgba(0,92,182,0.14)"}` }}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={14} color={isNhapSaiSL ? "#D4183D" : "#005CB6"} />
                        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: isNhapSaiSL ? "#D4183D" : "#005CB6" }}>
                          Hạn mức phân phối
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown size={13} color={isNhapSaiSL ? "#D4183D" : "#0F766E"} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isNhapSaiSL ? "#D4183D" : "#0F172A" }}>
                          Kho còn lại:{" "}
                          <span style={{ fontSize: "0.95rem", fontWeight: 900, color: isNhapSaiSL ? "#D4183D" : "#0F766E" }}>
                            {fmtSL(HAN_MUC_KHA_DUNG)}
                          </span> gói
                        </span>
                      </div>
                    </div>

                    {/* Progress bar 3 lớp */}
                    <div className="space-y-1.5">
                      <div className="w-full rounded-full overflow-hidden relative" style={{ height: 12, background: "#E2E8F0" }}>
                        {/* Đã gán */}
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${pctDaGan}%`, background: "linear-gradient(90deg,#64748B,#94A3B8)" }} />
                        {/* Lệnh này */}
                        {soLuongNum > 0 && (
                          <div className="absolute top-0 h-full rounded-full transition-all duration-400"
                            style={{
                              left: `${pctDaGan}%`,
                              width: `${isNhapSaiSL ? Math.min((HAN_MUC_KHA_DUNG / TONG_HAN_MUC) * 100, 100 - pctDaGan) : pctLenhNay}%`,
                              background: isNhapSaiSL ? "#D4183D" : "linear-gradient(90deg,#005CB6,#0284C7)",
                            }} />
                        )}
                        {/* Overflow indicator */}
                        {isNhapSaiSL && (
                          <div className="absolute top-0 h-full w-3 rounded-r-full"
                            style={{ right: 0, background: "rgba(212,24,61,0.4)", animation: "blink 1s ease infinite" }} />
                        )}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#94A3B8" }} />
                            <span style={{ fontSize: "0.67rem", color: "#94A3B8" }}>Đã gán ({fmtSL(HAN_MUC_DA_GAN)})</span>
                          </div>
                          {soLuongNum > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{ background: isNhapSaiSL ? "#D4183D" : "#005CB6" }} />
                              <span style={{ fontSize: "0.67rem", color: isNhapSaiSL ? "#D4183D" : "#005CB6" }}>
                                Lệnh này ({fmtSL(soLuongNum)})
                              </span>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: "0.68rem", color: "#64748B" }}>
                          Tổng hạn mức:{" "}
                          <strong style={{ color: "#0F172A" }}>{fmtSL(TONG_HAN_MUC)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Số liệu 3 ô */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: "Được cấp",  val: fmtSL(TONG_HAN_MUC),    color: "#64748B", bg: "#F1F5F9" },
                        { label: "Đã gán",    val: fmtSL(HAN_MUC_DA_GAN),  color: "#0F766E", bg: "rgba(15,118,110,0.07)" },
                        { label: "Còn lại",   val: fmtSL(HAN_MUC_KHA_DUNG), color: isNhapSaiSL ? "#D4183D" : "#005CB6", bg: isNhapSaiSL ? "rgba(212,24,61,0.07)" : "rgba(0,92,182,0.07)" },
                      ].map(s => (
                        <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: s.bg }}>
                          <div style={{ fontSize: "1rem", fontWeight: 900, color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── CẢNH BÁO VƯỢT HẠN MỨC ── */}
                  {isNhapSaiSL && (
                    <div className="flex items-start gap-3 rounded-2xl p-4"
                      style={{ background: "rgba(212,24,61,0.06)", border: "2px solid rgba(212,24,61,0.3)", animation: "fadeSlideIn 0.25s ease" }}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ background: "rgba(212,24,61,0.14)" }}>
                        <AlertTriangle size={18} color="#D4183D" />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.87rem", fontWeight: 800, color: "#D4183D", lineHeight: 1 }}>
                          ⚠ Cảnh báo: Số lượng vượt quá hạn mức khả dụng của đơn vị trên BCCS
                        </p>
                        <p style={{ fontSize: "0.76rem", color: "#64748B", marginTop: 6, lineHeight: 1.6 }}>
                          Yêu cầu <strong style={{ color: "#D4183D" }}>{fmtSL(soLuongNum)}</strong> license vượt quá hạn mức khả dụng{" "}
                          <strong style={{ color: "#D4183D" }}>{fmtSL(HAN_MUC_KHA_DUNG)}</strong> license.
                          Vui lòng giảm số lượng hoặc liên hệ Admin để bổ sung hạn mức từ BCCS.
                        </p>
                        <div className="flex items-center gap-2 mt-2.5 px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(212,24,61,0.1)", display: "inline-flex" }}>
                          <Lock size={11} color="#D4183D" />
                          <span style={{ fontSize: "0.69rem", fontWeight: 700, color: "#D4183D" }}>Nút "Gửi duyệt" đã bị vô hiệu hóa</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── ACTION BUTTONS ── */}
                  <div className="flex items-center justify-between gap-3 pt-2"
                    style={{ borderTop: "1px solid #F1F5F9" }}>
                    <div className="flex items-center gap-1.5">
                      <Info size={12} color="#94A3B8" />
                      <span style={{ fontSize: "0.69rem", color: "#94A3B8" }}>
                        Lệnh cần Checker phê duyệt trước khi có hiệu lực
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
                        style={{ background: "#F1F5F9", color: "#64748B", border: "1.5px solid #E2E8F0", fontSize: "0.87rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#E2E8F0")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#F1F5F9")}>
                        <X size={14} /> Hủy
                      </button>
                      <button type="submit" disabled={!isFormValid || isBlocked}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all"
                        style={{
                          background: isFormValid && !isBlocked ? "linear-gradient(135deg,#005CB6,#0074E4)" : "#CBD5E1",
                          color: "#fff", border: "none",
                          fontSize: "0.87rem", fontWeight: 700,
                          cursor: isFormValid && !isBlocked ? "pointer" : "not-allowed",
                          fontFamily: "'Be Vietnam Pro'",
                          boxShadow: isFormValid && !isBlocked ? "0 4px 14px rgba(0,92,182,0.35)" : "none",
                          opacity: isFormValid && !isBlocked ? 1 : 0.55,
                        }}>
                        {isBlocked
                          ? <><Lock size={14} /> Bị khóa</>
                          : isNhapSaiSL
                          ? <><Lock size={14} /> Vượt hạn mức</>
                          : <><Send size={14} /> Gửi duyệt</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── RIGHT: SIDEBAR THÔNG TIN (2/5) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Hạn mức chi nhánh */}
            <div className="rounded-2xl p-5 space-y-4"
              style={{ background: "linear-gradient(160deg,#005CB6,#0074E4)", boxShadow: "0 6px 24px rgba(0,92,182,0.25)" }}>
              <div className="flex items-center gap-2">
                <Shield size={14} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Kho hạn mức</span>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Chi nhánh Cầu Giấy</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", lineHeight: 1, marginTop: 3 }}>{fmtSL(HAN_MUC_KHA_DUNG)}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", marginTop: 3 }}>license còn lại trong kho</div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ height: 8, background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-xl" style={{ width: `${(HAN_MUC_KHA_DUNG / TONG_HAN_MUC) * 100}%`, background: "#fff" }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Tổng được cấp", val: fmtSL(TONG_HAN_MUC)   },
                  { label: "Đã gán",        val: fmtSL(HAN_MUC_DA_GAN) },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.14)" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>{s.val}</div>
                    <div style={{ fontSize: "0.61rem", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Xem trước lệnh */}
            {(donViId || goiId || soLuongNum > 0) && (
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", animation: "fadeSlideIn 0.25s ease" }}>
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} color="#005CB6" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F172A" }}>Xem trước lệnh</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Đơn vị nhận",  val: DON_VI_LIST.find(d => d.id === donViId)?.name ?? "—",  icon: Building2  },
                    { label: "Loại gói",     val: goiId || "—",                                          icon: Gift        },
                    { label: "Số lượng",     val: soLuongNum > 0 ? `${fmtSL(soLuongNum)} license` : "—", icon: Hash       },
                    { label: "Bắt đầu",      val: batDau ? formatDateVN(batDau) : "—",                   icon: CalendarDays },
                    { label: "Thời hạn",     val: thoiHan ? `${thoiHan} tháng` : "—",                   icon: Clock       },
                  ].map(row => {
                    const RIc = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <RIc size={12} color="#94A3B8" />
                          <span style={{ fontSize: "0.71rem", color: "#94A3B8" }}>{row.label}</span>
                        </div>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: row.val === "—" ? "#CBD5E1" : "#0F172A" }}>{row.val}</span>
                      </div>
                    );
                  })}
                </div>
                {goiSelected && soLuongNum > 0 && batDau && !isNhapSaiSL && (
                  <div className="pt-2.5" style={{ borderTop: "1px solid #EEF0F4" }}>
                    <div className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                      style={{ background: `${goiSelected.bg}`, border: `1px solid ${goiSelected.border}` }}>
                      <CheckCircle2 size={12} color={goiSelected.color} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: goiSelected.color }}>
                        Sẵn sàng gửi duyệt
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hướng dẫn quy trình */}
            <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} color="#005CB6" />
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F172A" }}>Quy trình duyệt</span>
              </div>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Maker tạo lệnh gán",        desc: "Điền đủ thông tin và nhấn Gửi duyệt",               color: "#005CB6", done: true  },
                  { step: "2", title: "Checker phê duyệt",          desc: "Checker xem xét và xác nhận hoặc từ chối",           color: "#D97706", done: false },
                  { step: "3", title: "Lệnh có hiệu lực",           desc: "License được cấp phát đến đơn vị tiếp nhận",         color: "#0F766E", done: false },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: s.done ? s.color : "#F1F5F9", border: `2px solid ${s.color}` }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, color: s.done ? "#fff" : s.color }}>{s.step}</span>
                      </div>
                      {i < 2 && <div className="w-0.5 h-5 mt-1" style={{ background: "#EEF0F4" }} />}
                    </div>
                    <div className="pb-1">
                      <div style={{ fontSize: "0.77rem", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{s.title}</div>
                      <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ModalXacNhan
          donViId={donViId} goiId={goiId} soLuong={soLuong}
          batDau={batDau} thoiHan={thoiHan}
          onConfirm={handleSubmit} onCancel={() => setShowConfirm(false)}
        />
      )}

      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
