import { useState, useRef, useEffect } from "react";
import {
  Package, Plus, Edit2, Eye, X, Check, AlertCircle, CheckCircle,
  ChevronDown, Search, Clock, Calendar,
  Layers, Zap,
  GraduationCap, Sparkles,
  RefreshCw, Info, ChevronRight, ArrowUpDown,
  ChevronUp, Database,
  BadgeDollarSign, Timer,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type PhanLoai = "BASIC" | "PLUS" | "ADVANCED";
type DonViThoiGian = "thang" | "nam";
type TrangThai = "Đang bán" | "Ngừng bán" | "Bản nháp";

interface KhoiLop {
  id: string;
  ten: string;
  capHoc: "TH" | "THCS" | "THPT";
}

interface GoiNoiDung {
  id: string;
  tenGoi: string;
  phanLoai: PhanLoai;
  giaBanLe: number;
  giaDaiLy: number;
  thoiLuongThuNghiem: number; // ngày
  thoiLuongSuDung: number;
  donViThoiGian: DonViThoiGian;
  khoiLopApDung: string[];
  trangThai: TrangThai;
  ghiChu: string;
  ngayTao: string;
  soLicenseBan: number;
}

// ── KHỐI LỚP ────────────────────────────────────────────────────────────────

const DS_KHOI_LOP: KhoiLop[] = [
  { id: "l1",  ten: "Lớp 1",  capHoc: "TH"   },
  { id: "l2",  ten: "Lớp 2",  capHoc: "TH"   },
  { id: "l3",  ten: "Lớp 3",  capHoc: "TH"   },
  { id: "l4",  ten: "Lớp 4",  capHoc: "TH"   },
  { id: "l5",  ten: "Lớp 5",  capHoc: "TH"   },
  { id: "l6",  ten: "Lớp 6",  capHoc: "THCS" },
  { id: "l7",  ten: "Lớp 7",  capHoc: "THCS" },
  { id: "l8",  ten: "Lớp 8",  capHoc: "THCS" },
  { id: "l9",  ten: "Lớp 9",  capHoc: "THCS" },
  { id: "l10", ten: "Lớp 10", capHoc: "THPT" },
  { id: "l11", ten: "Lớp 11", capHoc: "THPT" },
  { id: "l12", ten: "Lớp 12", capHoc: "THPT" },
];

const ALL_IDS = DS_KHOI_LOP.map(k => k.id);

const CAP_HOC_CFG: Record<string, { label: string; color: string; bg: string }> = {
  TH:   { label: "Tiểu học", color: "#0284C7", bg: "rgba(2,132,199,0.08)"   },
  THCS: { label: "THCS",     color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  THPT: { label: "THPT",     color: "#D97706", bg: "rgba(217,119,6,0.08)"  },
};

// ── CẤU HÌNH PHÂN LOẠI GÓI CƯỚC BCCS ─────────────────────────────────────────

interface PhanLoaiConfig {
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
  moTa: string;
  maBCCS: string;
  quotaToiDa: number;
}

const PHAN_LOAI_CFG: Record<PhanLoai, PhanLoaiConfig> = {
  BASIC: {
    color: "#0284C7", bg: "rgba(2,132,199,0.08)", border: "rgba(2,132,199,0.22)",
    icon: Layers, moTa: "Gói nền tảng phổ thông", maBCCS: "BCCS_BASIC", quotaToiDa: 10,
  },
  PLUS: {
    color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.22)",
    icon: Sparkles, moTa: "Gói cao cấp nâng cao", maBCCS: "BCCS_PLUS", quotaToiDa: 8,
  },
  ADVANCED: {
    color: "#D97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.22)",
    icon: Zap, moTa: "Gói chuyên sâu luyện thi", maBCCS: "BCCS_ADVANCED", quotaToiDa: 5,
  },
};

const DS_PHAN_LOAI: PhanLoai[] = ["BASIC", "PLUS", "ADVANCED"];

const TRANG_THAI_CFG: Record<TrangThai, { color: string; bg: string; dot: string }> = {
  "Đang bán":  { color: "#0F766E", bg: "rgba(15,118,110,0.09)", dot: "#0F766E" },
  "Ngừng bán": { color: "#D4183D", bg: "rgba(212,24,61,0.08)",  dot: "#D4183D" },
  "Bản nháp":  { color: "#D97706", bg: "rgba(217,119,6,0.09)",  dot: "#D97706" },
};

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

const DU_LIEU_GOI: GoiNoiDung[] = [
  {
    id: "1", tenGoi: "Gói Khởi đầu",
    phanLoai: "BASIC", giaBanLe: 200000, giaDaiLy: 150000,
    thoiLuongThuNghiem: 7, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l1","l2","l3","l4","l5"],
    trangThai: "Đang bán", ghiChu: "Gói nền tảng cho học sinh Tiểu học toàn cấp.",
    ngayTao: "01/01/2025", soLicenseBan: 8420,
  },
  {
    id: "2", tenGoi: "Gói Nâng cao",
    phanLoai: "PLUS", giaBanLe: 500000, giaDaiLy: 450000,
    thoiLuongThuNghiem: 7, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l1","l2","l3","l4","l5"],
    trangThai: "Đang bán", ghiChu: "Gói cao cấp Tiểu học với nội dung mở rộng và AI.",
    ngayTao: "01/01/2025", soLicenseBan: 5130,
  },
  {
    id: "3", tenGoi: "Gói Chuyên sâu",
    phanLoai: "ADVANCED", giaBanLe: 1000000, giaDaiLy: 900000,
    thoiLuongThuNghiem: 10, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l6","l7","l8","l9"],
    trangThai: "Đang bán", ghiChu: "Gói chuyên sâu THCS, bồi dưỡng HSG và luyện thi.",
    ngayTao: "01/02/2025", soLicenseBan: 2180,
  },
  {
    id: "4", tenGoi: "Gói BASIC THCS",
    phanLoai: "BASIC", giaBanLe: 300000, giaDaiLy: 250000,
    thoiLuongThuNghiem: 0, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l6","l7","l8","l9"],
    trangThai: "Đang bán", ghiChu: "Gói nền tảng THCS, bao phủ toàn bộ môn học.",
    ngayTao: "01/02/2025", soLicenseBan: 6280,
  },
  {
    id: "5", tenGoi: "Gói PLUS THCS",
    phanLoai: "PLUS", giaBanLe: 600000, giaDaiLy: 550000,
    thoiLuongThuNghiem: 0, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l6","l7","l8","l9"],
    trangThai: "Đang bán", ghiChu: "Gói cao cấp THCS với lộ trình cá nhân hóa AI.",
    ngayTao: "15/02/2025", soLicenseBan: 3940,
  },
  {
    id: "6", tenGoi: "Gói BASIC THPT",
    phanLoai: "BASIC", giaBanLe: 400000, giaDaiLy: 350000,
    thoiLuongThuNghiem: 0, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l10","l11","l12"],
    trangThai: "Đang bán", ghiChu: "Gói nền tảng THPT đầy đủ 8 môn tổ hợp thi THPTQG.",
    ngayTao: "01/03/2025", soLicenseBan: 4720,
  },
  {
    id: "7", tenGoi: "Gói PLUS THPT",
    phanLoai: "PLUS", giaBanLe: 800000, giaDaiLy: 750000,
    thoiLuongThuNghiem: 0, thoiLuongSuDung: 12, donViThoiGian: "thang",
    khoiLopApDung: ["l10","l11","l12"],
    trangThai: "Đang bán", ghiChu: "Gói THPT cao cấp với ngân hàng đề thi và phân tích AI.",
    ngayTao: "01/03/2025", soLicenseBan: 2850,
  },
  {
    id: "8", tenGoi: "Gói Hè 2026",
    phanLoai: "BASIC", giaBanLe: 100000, giaDaiLy: 80000,
    thoiLuongThuNghiem: 3, thoiLuongSuDung: 3, donViThoiGian: "thang",
    khoiLopApDung: ALL_IDS,
    trangThai: "Đang bán", ghiChu: "Gói học hè ngắn hạn dành cho toàn cấp K12.",
    ngayTao: "01/04/2025", soLicenseBan: 1200,
  },
  {
    id: "9", tenGoi: "Gói VIP Luyện thi",
    phanLoai: "ADVANCED", giaBanLe: 2000000, giaDaiLy: 1800000,
    thoiLuongThuNghiem: 0, thoiLuongSuDung: 6, donViThoiGian: "thang",
    khoiLopApDung: ["l9","l12"],
    trangThai: "Đang bán", ghiChu: "Gói VIP luyện thi chuyên biệt cho lớp 9 và lớp 12.",
    ngayTao: "15/04/2025", soLicenseBan: 870,
  },
  {
    id: "10", tenGoi: "Gói Trải nghiệm",
    phanLoai: "BASIC", giaBanLe: 50000, giaDaiLy: 20000,
    thoiLuongThuNghiem: 15, thoiLuongSuDung: 1, donViThoiGian: "thang",
    khoiLopApDung: ALL_IDS,
    trangThai: "Đang bán", ghiChu: "Gói dùng thử toàn cấp 1 tháng, phù hợp khách hàng lần đầu.",
    ngayTao: "01/05/2025", soLicenseBan: 3100,
  },
];

// ── TIỆN ÍCH ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}tr`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
};

const toSuDungNgay = (luong: number, donVi: DonViThoiGian) =>
  donVi === "nam" ? luong * 365 : luong * 30;

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error" | "info"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const c = { success: "#0F766E", error: "#D4183D", info: "#005CB6" }[type];
  return (
    <div className="fixed top-5 right-5 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
      style={{ background: "#fff", border: `1.5px solid ${c}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)", maxWidth: 400, fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      {type === "success" ? <CheckCircle size={16} color={c} /> : type === "error" ? <AlertCircle size={16} color={c} /> : <Info size={16} color={c} />}
      <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1E293B" }}>{msg}</span>
    </div>
  );
}

// ── DROPDOWN PHÂN LOẠI ────────────────────────────────────────────────────────

function PhanLoaiDropdown({ value, onChange, error }: {
  value: PhanLoai; onChange: (v: PhanLoai) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = PHAN_LOAI_CFG[value];
  const Icon = cfg.icon;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 rounded-xl outline-none text-left transition-all"
        style={{
          border: `1.5px solid ${error ? "#D4183D" : open ? "#005CB6" : "#E2E8F0"}`,
          padding: "10px 14px", background: open ? "#fff" : "#F8F9FA",
          cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif",
          boxShadow: open ? "0 0 0 3px rgba(0,92,182,0.08)" : "none",
        }}>
        {/* Badge loại */}
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <Icon size={12} color={cfg.color} />
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: cfg.color }}>{value}</span>
        </span>
        <div className="flex-1 overflow-hidden">
          <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap" }}>{cfg.moTa}</div>
          <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginTop: 1 }}>
            Mã BCCS: <span style={{ fontFamily: "monospace", color: "#005CB6", fontWeight: 700 }}>{cfg.maBCCS}</span>
          </div>
        </div>
        <ChevronDown size={15} color="#94A3B8" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div className="absolute z-50 w-full rounded-2xl overflow-hidden mt-1"
          style={{ background: "#fff", border: "1.5px solid #E2E8F0", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}>
          {DS_PHAN_LOAI.map(pl => {
            const c = PHAN_LOAI_CFG[pl];
            const Ic = c.icon;
            const sel = pl === value;
            const used = DU_LIEU_GOI.filter(g => g.phanLoai === pl).length;
            return (
              <button key={pl} type="button" onClick={() => { onChange(pl); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                style={{ background: sel ? c.bg : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F1F5F9", fontFamily: "'Be Vietnam Pro',sans-serif" }}
                onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFB"; }}
                onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: sel ? c.color : c.bg }}>
                  <Ic size={15} color={sel ? "#fff" : c.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: sel ? c.color : "#0F172A" }}>{pl}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "0.6rem", fontWeight: 700, background: c.bg, color: c.color }}>{c.maBCCS}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: 1 }}>{c.moTa}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Quota</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: used >= c.quotaToiDa ? "#D4183D" : c.color }}>
                    {used}/{c.quotaToiDa}
                  </div>
                </div>
                {sel && <Check size={14} color={c.color} className="flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {error && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{error}</p>}
    </div>
  );
}

// ── PICKER KHỐI LỚP ──────────────────────────────────────────────────────────

function KhoiLopPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const groups = ["TH", "THCS", "THPT"] as const;

  const toggleGroup = (cap: "TH" | "THCS" | "THPT") => {
    const ids = DS_KHOI_LOP.filter(k => k.capHoc === cap).map(k => k.id);
    const allIn = ids.every(id => value.includes(id));
    if (allIn) onChange(value.filter(v => !ids.includes(v)));
    else onChange([...new Set([...value, ...ids])]);
  };

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id));
    else onChange([...value, id]);
  };

  return (
    <div className="space-y-2">
      {groups.map(cap => {
        const cfg = CAP_HOC_CFG[cap];
        const lops = DS_KHOI_LOP.filter(k => k.capHoc === cap);
        const allIn = lops.every(k => value.includes(k.id));
        const someIn = lops.some(k => value.includes(k.id)) && !allIn;
        return (
          <div key={cap} className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #EEF0F4" }}>
            <button type="button" onClick={() => toggleGroup(cap)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors"
              style={{ background: allIn ? cfg.bg : someIn ? `${cfg.bg}80` : "#F8FAFB", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
              <div className="flex items-center justify-center rounded"
                style={{ width: 18, height: 18, background: allIn ? cfg.color : "transparent", border: `2px solid ${allIn || someIn ? cfg.color : "#CBD5E1"}`, transition: "all 0.15s", flexShrink: 0 }}>
                {allIn && <Check size={11} color="#fff" strokeWidth={3} />}
                {someIn && <div style={{ width: 8, height: 2, background: cfg.color, borderRadius: 2 }} />}
              </div>
              <GraduationCap size={14} color={allIn || someIn ? cfg.color : "#94A3B8"} />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: allIn || someIn ? cfg.color : "#374151" }}>{cfg.label}</span>
              <span className="ml-auto rounded-full px-2 py-0.5"
                style={{ fontSize: "0.62rem", fontWeight: 800, color: cfg.color, background: cfg.bg }}>
                {lops.filter(k => value.includes(k.id)).length}/{lops.length}
              </span>
            </button>
            <div className="flex flex-wrap gap-2 px-3.5 pb-2.5 pt-1.5" style={{ background: "#fff" }}>
              {lops.map(k => {
                const sel = value.includes(k.id);
                return (
                  <button key={k.id} type="button" onClick={() => toggle(k.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-150"
                    style={{ background: sel ? cfg.bg : "#F8FAFB", border: `1.5px solid ${sel ? cfg.color : "#E2E8F0"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                    <div className="flex items-center justify-center rounded" style={{ width: 14, height: 14, background: sel ? cfg.color : "transparent", border: `1.5px solid ${sel ? cfg.color : "#CBD5E1"}` }}>
                      {sel && <Check size={9} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: sel ? 700 : 500, color: sel ? cfg.color : "#374151" }}>{k.ten}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── FORM STATE ────────────────────────────────────────────────────────────────

interface FormState {
  tenGoi: string;
  phanLoai: PhanLoai;
  giaBanLe: string;
  giaDaiLy: string;
  thoiLuongThuNghiem: string;
  thoiLuongSuDung: string;
  donViThoiGian: DonViThoiGian;
  khoiLopApDung: string[];
  trangThai: TrangThai;
  ghiChu: string;
}

const FORM_TRONG: FormState = {
  tenGoi: "", phanLoai: "BASIC", giaBanLe: "", giaDaiLy: "",
  thoiLuongThuNghiem: "0", thoiLuongSuDung: "12", donViThoiGian: "thang",
  khoiLopApDung: [], trangThai: "Đang bán", ghiChu: "",
};

// ── MODAL FORM ────────────────────────────────────────────────────────────────

function ModalGoi({
  mode, goiEdit, allGoi, onClose, onSave,
}: {
  mode: "add" | "edit";
  goiEdit: GoiNoiDung | null;
  allGoi: GoiNoiDung[];
  onClose: () => void;
  onSave: (f: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(goiEdit ? {
    tenGoi: goiEdit.tenGoi, phanLoai: goiEdit.phanLoai,
    giaBanLe: String(goiEdit.giaBanLe), giaDaiLy: String(goiEdit.giaDaiLy),
    thoiLuongThuNghiem: String(goiEdit.thoiLuongThuNghiem),
    thoiLuongSuDung: String(goiEdit.thoiLuongSuDung),
    donViThoiGian: goiEdit.donViThoiGian,
    khoiLopApDung: [...goiEdit.khoiLopApDung],
    trangThai: goiEdit.trangThai, ghiChu: goiEdit.ghiChu,
  } : { ...FORM_TRONG });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const plCfg = PHAN_LOAI_CFG[form.phanLoai];
  const PLIcon = plCfg.icon;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.tenGoi.trim()) { e.tenGoi = "Tên gói không được để trống"; }
    else {
      const dup = allGoi.find(g => g.tenGoi.trim().toLowerCase() === form.tenGoi.trim().toLowerCase() && g.id !== goiEdit?.id);
      if (dup) e.tenGoi = "Tên gói đã tồn tại, vui lòng chọn tên khác";
    }
    if (!form.giaBanLe || isNaN(Number(form.giaBanLe)) || Number(form.giaBanLe) <= 0)
      e.giaBanLe = "Giá bán lẻ phải là số dương";
    if (!form.giaDaiLy || isNaN(Number(form.giaDaiLy)) || Number(form.giaDaiLy) <= 0)
      e.giaDaiLy = "Giá đại lý phải là số dương";
    if (Number(form.giaDaiLy) > Number(form.giaBanLe))
      e.giaDaiLy = "Giá đại lý không được cao hơn giá bán lẻ";
    if (Number(form.thoiLuongThuNghiem) < 0) e.thoiLuongThuNghiem = "Không được âm";
    if (!form.thoiLuongSuDung || Number(form.thoiLuongSuDung) <= 0)
      e.thoiLuongSuDung = "Thời lượng sử dụng phải lớn hơn 0";
    // Validate: trial days <= usage period days
    const sdNgay = toSuDungNgay(Number(form.thoiLuongSuDung) || 0, form.donViThoiGian);
    if (Number(form.thoiLuongThuNghiem) > sdNgay)
      e.thoiLuongThuNghiem = `Dùng thử (${form.thoiLuongThuNghiem} ngày) không được vượt quá thời lượng sử dụng (${sdNgay} ngày)`;
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(2);
  };

  const handleSubmit = () => {
    const e1 = validateStep1();
    const e2: Record<string, string> = {};
    if (form.khoiLopApDung.length === 0) e2.khoiLopApDung = "Phải chọn ít nhất một khối lớp";
    const allErrors = { ...e1, ...e2 };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) { if (Object.keys(e1).length > 0) setStep(1); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(form); }, 700);
  };

  const set = (key: keyof FormState, val: string | string[]) => setForm(f => ({ ...f, [key]: val }));

  const inputStyle = (errKey?: string) => ({
    border: `1.5px solid ${errors[errKey || ""] ? "#D4183D" : "#E2E8F0"}`,
    padding: "10px 14px", fontSize: "0.85rem",
    fontFamily: "'Be Vietnam Pro',sans-serif", background: "#F8F9FA",
    borderRadius: 12, outline: "none", width: "100%",
  });

  const focusStyle = { borderColor: "#005CB6", background: "#fff", boxShadow: "0 0 0 3px rgba(0,92,182,0.08)" };
  const blurStyle = (errKey?: string) => ({ borderColor: errors[errKey || ""] ? "#D4183D" : "#E2E8F0", background: "#F8F9FA", boxShadow: "none" });

  // Quota check
  const usedQuota = allGoi.filter(g => g.phanLoai === form.phanLoai && g.id !== goiEdit?.id).length;
  const maxQuota = plCfg.quotaToiDa;
  const quotaOk = usedQuota < maxQuota;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.54)", backdropFilter: "blur(5px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 660, maxHeight: "94vh", background: "#fff", boxShadow: "0 28px 72px rgba(0,0,0,0.22)", fontFamily: "'Be Vietnam Pro',sans-serif" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", color: "#fff" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Package size={19} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800 }}>
                {mode === "add" ? "Thêm mới Gói nội dung" : `Chỉnh sửa: ${goiEdit?.tenGoi}`}
              </div>
              <div style={{ fontSize: "0.68rem", opacity: 0.8, marginTop: 2 }}>
                Bước {step}/2 · {step === 1 ? "Thông tin cơ bản & phân loại BCCS" : "Cấu hình khối lớp áp dụng"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {([1, 2] as const).map(s => (
                <div key={s} className="flex items-center justify-center w-6 h-6 rounded-full transition-all"
                  style={{ background: step >= s ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", fontSize: "0.65rem", fontWeight: 800, color: step >= s ? "#005CB6" : "#fff" }}>
                  {step > s ? <Check size={11} strokeWidth={3} /> : s}
                </div>
              ))}
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl ml-2"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}>
              <X size={16} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {step === 1 ? (
            <>
              {/* Phân loại gói – DROPDOWN BCCS */}
              <div>
                <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Phân loại gói (Gói cước BCCS) <span style={{ color: "#D4183D" }}>*</span>
                  <span style={{ fontSize: "0.64rem", color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>Xác định hạn mức quota từ hệ thống BCCS</span>
                </label>
                <PhanLoaiDropdown
                  value={form.phanLoai}
                  onChange={v => set("phanLoai", v)}
                  error={errors.phanLoai}
                />
                {/* Quota warning */}
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
                  style={{ background: quotaOk ? "rgba(15,118,110,0.05)" : "rgba(212,24,61,0.05)", border: `1px solid ${quotaOk ? "rgba(15,118,110,0.18)" : "rgba(212,24,61,0.18)"}` }}>
                  {quotaOk ? <CheckCircle size={12} color="#0F766E" /> : <AlertCircle size={12} color="#D4183D" />}
                  <span style={{ fontSize: "0.7rem", color: quotaOk ? "#0F766E" : "#D4183D", fontWeight: 600 }}>
                    Quota {form.phanLoai}: đã sử dụng {usedQuota}/{maxQuota} gói
                    {!quotaOk && " — Đã đạt giới hạn, không thể thêm mới"}
                  </span>
                </div>
              </div>

              {/* Tên gói */}
              <div>
                <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                  Tên gói nội dung <span style={{ color: "#D4183D" }}>*</span>
                </label>
                <input type="text" value={form.tenGoi} onChange={e => set("tenGoi", e.target.value)}
                  placeholder="VD: Gói học tập BASIC 01"
                  style={inputStyle("tenGoi")}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle("tenGoi"))}
                />
                {errors.tenGoi && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{errors.tenGoi}</p>}
              </div>

              {/* Giá bán lẻ / Giá đại lý */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    <BadgeDollarSign size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                    Giá bán lẻ (VNĐ) <span style={{ color: "#D4183D" }}>*</span>
                  </label>
                  <div className="relative">
                    <input type="number" value={form.giaBanLe} onChange={e => set("giaBanLe", e.target.value)}
                      placeholder="200000"
                      style={{ ...inputStyle("giaBanLe"), paddingRight: 52 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle("giaBanLe"))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>VNĐ</span>
                  </div>
                  {errors.giaBanLe && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{errors.giaBanLe}</p>}
                  {form.giaBanLe && !isNaN(Number(form.giaBanLe)) && Number(form.giaBanLe) > 0 && (
                    <p style={{ fontSize: "0.68rem", color: "#005CB6", marginTop: 2, fontWeight: 600 }}>{fmt(Number(form.giaBanLe))}</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    <BadgeDollarSign size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                    Giá đại lý (VNĐ) <span style={{ color: "#D4183D" }}>*</span>
                  </label>
                  <div className="relative">
                    <input type="number" value={form.giaDaiLy} onChange={e => set("giaDaiLy", e.target.value)}
                      placeholder="150000"
                      style={{ ...inputStyle("giaDaiLy"), paddingRight: 52 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle("giaDaiLy"))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>VNĐ</span>
                  </div>
                  {errors.giaDaiLy && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{errors.giaDaiLy}</p>}
                  {form.giaDaiLy && !isNaN(Number(form.giaDaiLy)) && Number(form.giaDaiLy) > 0 && (
                    <p style={{ fontSize: "0.68rem", color: "#7C3AED", marginTop: 2, fontWeight: 600 }}>{fmt(Number(form.giaDaiLy))}</p>
                  )}
                </div>
              </div>

              {/* Thời lượng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    <Timer size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                    Thời lượng dùng thử
                    <span style={{ fontSize: "0.64rem", color: "#94A3B8", fontWeight: 400, marginLeft: 5 }}>0 = không có</span>
                  </label>
                  <div className="relative">
                    <input type="number" min="0" value={form.thoiLuongThuNghiem}
                      onChange={e => set("thoiLuongThuNghiem", e.target.value)}
                      style={{ ...inputStyle("thoiLuongThuNghiem"), paddingRight: 52 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, blurStyle("thoiLuongThuNghiem"))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>ngày</span>
                  </div>
                  {errors.thoiLuongThuNghiem && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{errors.thoiLuongThuNghiem}</p>}
                </div>
                <div>
                  <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                    <Calendar size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
                    Thời lượng sử dụng <span style={{ color: "#D4183D" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input type="number" min="1" value={form.thoiLuongSuDung}
                        onChange={e => set("thoiLuongSuDung", e.target.value)}
                        style={{ ...inputStyle("thoiLuongSuDung") }}
                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                        onBlur={e => Object.assign(e.target.style, blurStyle("thoiLuongSuDung"))}
                      />
                    </div>
                    {/* Đơn vị */}
                    <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E2E8F0" }}>
                      {(["thang", "nam"] as DonViThoiGian[]).map(dv => (
                        <button key={dv} type="button" onClick={() => set("donViThoiGian", dv)}
                          className="px-3 py-2 transition-colors"
                          style={{ background: form.donViThoiGian === dv ? "#005CB6" : "#F8F9FA", color: form.donViThoiGian === dv ? "#fff" : "#64748B", fontSize: "0.74rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                          {dv === "thang" ? "Tháng" : "Năm"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.thoiLuongSuDung && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 3 }}>{errors.thoiLuongSuDung}</p>}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>
                  Ghi chú
                </label>
                <textarea value={form.ghiChu} onChange={e => set("ghiChu", e.target.value)}
                  placeholder="Mô tả ngắn về gói, đối tượng áp dụng, điểm nổi bật…"
                  rows={3}
                  className="w-full outline-none rounded-xl resize-none"
                  style={{ border: "1.5px solid #E2E8F0", padding: "10px 14px", fontSize: "0.83rem", fontFamily: "'Be Vietnam Pro',sans-serif", background: "#F8F9FA", lineHeight: 1.6 }}
                  onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>Trạng thái</label>
                <div className="flex gap-2 flex-wrap">
                  {(["Đang bán", "Bản nháp", "Ngừng bán"] as TrangThai[]).map(ts => {
                    const cfg = TRANG_THAI_CFG[ts];
                    const sel = form.trangThai === ts;
                    return (
                      <button key={ts} type="button" onClick={() => set("trangThai", ts)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
                        style={{ background: sel ? cfg.bg : "#F8F9FA", border: `1.5px solid ${sel ? cfg.dot : "#E2E8F0"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: sel ? cfg.dot : "#CBD5E1" }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: sel ? 700 : 400, color: sel ? cfg.color : "#64748B" }}>{ts}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info box BCCS */}
              <div className="flex items-start gap-2.5 rounded-xl p-3.5" style={{ background: "rgba(0,92,182,0.04)", border: "1px solid rgba(0,92,182,0.14)" }}>
                <Database size={14} color="#005CB6" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#005CB6", marginBottom: 3 }}>Ánh xạ Quota BCCS tự động</p>
                  <p style={{ fontSize: "0.71rem", color: "#374151", lineHeight: 1.65 }}>
                    Khi gói được tạo với phân loại <strong>{form.phanLoai}</strong>, hệ thống sẽ tự động trừ 1 đơn vị quota
                    từ hạn mức cước <strong>{plCfg.maBCCS}</strong> của BCCS. Hiện tại: {usedQuota}/{maxQuota} quota đã sử dụng.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Step 2 – Cấu hình khối lớp */
            <>
              {/* Summary card */}
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: plCfg.bg, border: `1.5px solid ${plCfg.border}` }}>
                <PLIcon size={20} color={plCfg.color} />
                <div className="flex-1">
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: plCfg.color }}>{form.tenGoi || "Gói chưa đặt tên"}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: 2 }}>
                    {form.phanLoai} · Bán lẻ {fmtShort(Number(form.giaBanLe) || 0)} / Đại lý {fmtShort(Number(form.giaDaiLy) || 0)} ·{" "}
                    {form.thoiLuongSuDung} {form.donViThoiGian === "thang" ? "tháng" : "năm"}
                    {Number(form.thoiLuongThuNghiem) > 0 && ` · Thử ${form.thoiLuongThuNghiem} ngày`}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.77rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
                  <GraduationCap size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  Cấu hình khối lớp áp dụng (Logic Đồng giá) <span style={{ color: "#D4183D" }}>*</span>
                  <span style={{ fontSize: "0.63rem", color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>
                    Học sinh đăng nhập lớp nào chỉ thấy nội dung lớp đó
                  </span>
                </label>
                <KhoiLopPicker value={form.khoiLopApDung} onChange={v => set("khoiLopApDung", v)} />
                {errors.khoiLopApDung && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl" style={{ background: "rgba(212,24,61,0.06)", border: "1px solid rgba(212,24,61,0.2)" }}>
                    <AlertCircle size={13} color="#D4183D" />
                    <p style={{ fontSize: "0.72rem", color: "#D4183D", fontWeight: 600 }}>{errors.khoiLopApDung}</p>
                  </div>
                )}
              </div>

              {form.khoiLopApDung.length > 0 && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.2)" }}>
                  <CheckCircle size={14} color="#0F766E" className="flex-shrink-0 mt-0.5" />
                  <p style={{ fontSize: "0.73rem", color: "#0F766E", fontWeight: 600, lineHeight: 1.6 }}>
                    Đã chọn <strong>{form.khoiLopApDung.length}</strong> khối lớp: {" "}
                    {form.khoiLopApDung.map(id => DS_KHOI_LOP.find(k => k.id === id)?.ten).join(", ")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
          {step === 1 ? (
            <>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl"
                style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                Hủy bỏ
              </button>
              <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
                style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", boxShadow: "0 4px 14px rgba(0,92,182,0.38)" }}>
                Tiếp theo <ChevronRight size={15} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
                style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                ← Quay lại
              </button>
              <button onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
                style={{ background: saving ? "#94A3B8" : "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", boxShadow: saving ? "none" : "0 4px 14px rgba(0,92,182,0.38)" }}>
                {saving
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Đang lưu…</>
                  : <><CheckCircle size={15} />{mode === "add" ? "Tạo gói nội dung" : "Lưu thay đổi"}</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── BADGE PHÂN LOẠI ───────────────────────────────────────────────────────────

function PhanLoaiBadge({ pl }: { pl: PhanLoai }) {
  const cfg = PHAN_LOAI_CFG[pl];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: "0.72rem", fontWeight: 800, color: cfg.color }}>
      <Icon size={11} />
      {pl}
    </span>
  );
}

// ── TRANG THÁI BADGE ──────────────────────────────────────────────────────────

function TrangThaiBadge({ ts }: { ts: TrangThai }) {
  const cfg = TRANG_THAI_CFG[ts];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
      style={{ background: cfg.bg, fontSize: "0.72rem", fontWeight: 700, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {ts}
    </span>
  );
}

// ── HIỂN THỊ KHỐI LỚP ────────────────────────────────────────────────────────

function KhoiLopDisplay({ ids }: { ids: string[] }) {
  if (ids.length === 0) return <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>—</span>;
  if (ids.length === 12) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg"
      style={{ background: "rgba(0,92,182,0.07)", border: "1px solid rgba(0,92,182,0.15)", fontSize: "0.7rem", fontWeight: 700, color: "#005CB6" }}>
      Lớp 1 – 12
    </span>
  );

  // Group by cap hoc
  const groups = (["TH", "THCS", "THPT"] as const).map(cap => {
    const allInCap = DS_KHOI_LOP.filter(k => k.capHoc === cap);
    const inCap = allInCap.filter(k => ids.includes(k.id));
    return { cap, inCap, full: inCap.length === allInCap.length };
  }).filter(g => g.inCap.length > 0);

  return (
    <div className="flex flex-wrap gap-1">
      {groups.map(g => {
        const cfg = CAP_HOC_CFG[g.cap];
        if (g.full) {
          return (
            <span key={g.cap} className="px-2 py-0.5 rounded-lg"
              style={{ background: cfg.bg, fontSize: "0.68rem", fontWeight: 700, color: cfg.color }}>
              {cfg.label}
            </span>
          );
        }
        return g.inCap.map(k => (
          <span key={k.id} className="px-1.5 py-0.5 rounded"
            style={{ background: cfg.bg, fontSize: "0.65rem", fontWeight: 600, color: cfg.color }}>
            L{k.id.replace("l", "")}
          </span>
        ));
      })}
    </div>
  );
}

// ── BANNER QUOTA BCCS ─────────────────────────────────────────────────────────

function BannerQuotaBCCS({ goiList }: { goiList: GoiNoiDung[] }) {
  return (
    <div className="flex gap-3 mb-5">
      {DS_PHAN_LOAI.map(pl => {
        const cfg = PHAN_LOAI_CFG[pl];
        const Icon = cfg.icon;
        const used = goiList.filter(g => g.phanLoai === pl).length;
        const max = cfg.quotaToiDa;
        const pct = Math.round((used / max) * 100);
        const warn = used >= max;
        return (
          <div key={pl} className="flex-1 rounded-2xl p-4 flex items-start gap-3"
            style={{ background: "#fff", border: `1.5px solid ${warn ? "rgba(212,24,61,0.22)" : cfg.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ background: cfg.bg }}>
              <Icon size={18} color={cfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: cfg.color }}>{pl}</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: warn ? "#D4183D" : "#64748B" }}>
                  {used}/{max} gói
                </span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginBottom: 6 }}>{cfg.maBCCS}</div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "#EEF0F4" }}>
                <div className="rounded-full transition-all" style={{ width: `${pct}%`, height: "100%", background: warn ? "#D4183D" : cfg.color }} />
              </div>
              <div style={{ fontSize: "0.62rem", color: warn ? "#D4183D" : "#94A3B8", marginTop: 3, fontWeight: warn ? 700 : 400 }}>
                {warn ? "Đã đạt giới hạn quota" : `Còn ${max - used} slot trống`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

type SortField = "tenGoi" | "giaBanLe" | "giaDaiLy" | "thoiLuongSuDung";
type SortDir = "asc" | "desc";

export function ContentPackagePage() {
  const [goiList, setGoiList] = useState<GoiNoiDung[]>(DU_LIEU_GOI);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<GoiNoiDung | null>(null);
  const [viewTarget, setViewTarget] = useState<GoiNoiDung | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [filterPL, setFilterPL] = useState<PhanLoai | "">("");
  const [filterTS, setFilterTS] = useState<TrangThai | "">("");
  const [sortField, setSortField] = useState<SortField>("tenGoi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => setToast({ msg, type });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = goiList
    .filter(g => {
      if (search && !g.tenGoi.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterPL && g.phanLoai !== filterPL) return false;
      if (filterTS && g.trangThai !== filterTS) return false;
      return true;
    })
    .sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortField === "tenGoi") { va = a.tenGoi; vb = b.tenGoi; }
      else if (sortField === "giaBanLe") { va = a.giaBanLe; vb = b.giaBanLe; }
      else if (sortField === "giaDaiLy") { va = a.giaDaiLy; vb = b.giaDaiLy; }
      else { va = a.thoiLuongSuDung; vb = b.thoiLuongSuDung; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const handleSave = (f: FormState) => {
    if (modalMode === "add") {
      const newGoi: GoiNoiDung = {
        id: String(Date.now()),
        tenGoi: f.tenGoi.trim(),
        phanLoai: f.phanLoai,
        giaBanLe: Number(f.giaBanLe),
        giaDaiLy: Number(f.giaDaiLy),
        thoiLuongThuNghiem: Number(f.thoiLuongThuNghiem),
        thoiLuongSuDung: Number(f.thoiLuongSuDung),
        donViThoiGian: f.donViThoiGian,
        khoiLopApDung: f.khoiLopApDung,
        trangThai: f.trangThai,
        ghiChu: f.ghiChu,
        ngayTao: new Date().toLocaleDateString("vi-VN"),
        soLicenseBan: 0,
      };
      setGoiList(prev => [newGoi, ...prev]);
      showToast(`Tạo gói "${newGoi.tenGoi}" thành công!`, "success");
    } else if (editTarget) {
      setGoiList(prev => prev.map(g => g.id === editTarget.id ? {
        ...g,
        tenGoi: f.tenGoi.trim(),
        phanLoai: f.phanLoai,
        giaBanLe: Number(f.giaBanLe),
        giaDaiLy: Number(f.giaDaiLy),
        thoiLuongThuNghiem: Number(f.thoiLuongThuNghiem),
        thoiLuongSuDung: Number(f.thoiLuongSuDung),
        donViThoiGian: f.donViThoiGian,
        khoiLopApDung: f.khoiLopApDung,
        trangThai: f.trangThai,
        ghiChu: f.ghiChu,
      } : g));
      showToast(`Cập nhật "${f.tenGoi}" thành công!`, "success");
    }
    setModalMode(null);
    setEditTarget(null);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} color="#CBD5E1" />;
    return sortDir === "asc" ? <ChevronUp size={12} color="#005CB6" /> : <ChevronDown size={12} color="#005CB6" />;
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 14px", fontSize: "0.72rem", fontWeight: 700,
    color: "#64748B", textAlign: "left", whiteSpace: "nowrap",
    background: "#F8FAFC", letterSpacing: "0.02em",
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F5F7FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(-10px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      {/* Modal */}
      {modalMode && (
        <ModalGoi
          mode={modalMode}
          goiEdit={editTarget}
          allGoi={goiList}
          onClose={() => { setModalMode(null); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}

      {/* View drawer */}
      {viewTarget && <DrawerChiTiet goi={viewTarget} onClose={() => setViewTarget(null)} onEdit={() => { setEditTarget(viewTarget); setModalMode("edit"); setViewTarget(null); }} />}

      <div className="p-6">
        {/* ── PAGE HEADER ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)" }}>
                <Package size={19} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", lineHeight: 1.2 }}>Cấu hình Gói nội dung</h1>
                <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>Định nghĩa gói thương mại dựa trên hạn mức cước BCCS</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,92,182,0.35)" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,92,182,0.48)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,92,182,0.35)")}>
            <Plus size={16} />
            Thêm mới gói
          </button>
        </div>

        {/* ── BANNER QUOTA ── */}
        <BannerQuotaBCCS goiList={goiList} />

        {/* ── BỘ LỌC ── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1" style={{ minWidth: 220, maxWidth: 320 }}>
            <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên gói…"
              className="w-full outline-none rounded-xl"
              style={{ border: "1.5px solid #E2E8F0", padding: "9px 14px 9px 36px", fontSize: "0.83rem", fontFamily: "'Be Vietnam Pro',sans-serif", background: "#fff" }}
              onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Filter Phân loại */}
          <select value={filterPL} onChange={e => setFilterPL(e.target.value as PhanLoai | "")}
            className="outline-none rounded-xl"
            style={{ border: "1.5px solid #E2E8F0", padding: "9px 14px", fontSize: "0.83rem", fontFamily: "'Be Vietnam Pro',sans-serif", background: "#fff", cursor: "pointer", color: filterPL ? "#0F172A" : "#94A3B8" }}>
            <option value="">Tất cả phân loại</option>
            {DS_PHAN_LOAI.map(pl => <option key={pl} value={pl}>{pl}</option>)}
          </select>

          {/* Filter Trạng thái */}
          <select value={filterTS} onChange={e => setFilterTS(e.target.value as TrangThai | "")}
            className="outline-none rounded-xl"
            style={{ border: "1.5px solid #E2E8F0", padding: "9px 14px", fontSize: "0.83rem", fontFamily: "'Be Vietnam Pro',sans-serif", background: "#fff", cursor: "pointer", color: filterTS ? "#0F172A" : "#94A3B8" }}>
            <option value="">Tất cả trạng thái</option>
            {(["Đang bán", "Bản nháp", "Ngừng bán"] as TrangThai[]).map(ts => <option key={ts} value={ts}>{ts}</option>)}
          </select>

          {(search || filterPL || filterTS) && (
            <button onClick={() => { setSearch(""); setFilterPL(""); setFilterTS(""); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
              style={{ border: "1.5px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: "0.78rem", color: "#64748B", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
              <RefreshCw size={12} /> Xóa lọc
            </button>
          )}

          <div className="ml-auto" style={{ fontSize: "0.78rem", color: "#94A3B8", whiteSpace: "nowrap" }}>
            {filtered.length}/{goiList.length} gói
          </div>
        </div>

        {/* ── BẢNG DỮ LIỆU ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #EEF0F4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "2px solid #EEF0F4" }}>
                  <th style={{ ...thStyle, width: 44, textAlign: "center" }}>#</th>
                  <th style={thStyle}>
                    <button onClick={() => handleSort("tenGoi")} className="flex items-center gap-1.5 cursor-pointer" style={{ background: "none", border: "none", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, color: "#64748B", fontSize: "0.72rem" }}>
                      Tên gói <SortIcon field="tenGoi" />
                    </button>
                  </th>
                  <th style={thStyle}>Phân loại</th>
                  <th style={thStyle}>
                    <button onClick={() => handleSort("giaBanLe")} className="flex items-center gap-1.5 cursor-pointer" style={{ background: "none", border: "none", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, color: "#64748B", fontSize: "0.72rem" }}>
                      Giá bán lẻ <SortIcon field="giaBanLe" />
                    </button>
                  </th>
                  <th style={thStyle}>
                    <button onClick={() => handleSort("giaDaiLy")} className="flex items-center gap-1.5 cursor-pointer" style={{ background: "none", border: "none", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, color: "#64748B", fontSize: "0.72rem" }}>
                      Giá đại lý <SortIcon field="giaDaiLy" />
                    </button>
                  </th>
                  <th style={thStyle}>Dùng thử</th>
                  <th style={thStyle}>
                    <button onClick={() => handleSort("thoiLuongSuDung")} className="flex items-center gap-1.5 cursor-pointer" style={{ background: "none", border: "none", fontFamily: "'Be Vietnam Pro',sans-serif", fontWeight: 700, color: "#64748B", fontSize: "0.72rem" }}>
                      Sử dụng <SortIcon field="thoiLuongSuDung" />
                    </button>
                  </th>
                  <th style={thStyle}>Khối lớp</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "48px 24px", textAlign: "center" }}>
                      <Package size={32} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                      <p style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: 500 }}>Không tìm thấy gói nội dung phù hợp</p>
                    </td>
                  </tr>
                ) : filtered.map((goi, idx) => (
                  <tr key={goi.id}
                    style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FAFBFE")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    {/* # */}
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600 }}>{idx + 1}</span>
                    </td>
                    {/* Tên gói */}
                    <td style={{ padding: "12px 14px", maxWidth: 200 }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {goi.tenGoi}
                      </div>
                      {goi.ghiChu && (
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                          {goi.ghiChu}
                        </div>
                      )}
                    </td>
                    {/* Phân loại */}
                    <td style={{ padding: "12px 14px" }}>
                      <PhanLoaiBadge pl={goi.phanLoai} />
                    </td>
                    {/* Giá bán lẻ */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#0F172A" }}>{fmtShort(goi.giaBanLe)}</div>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>lẻ</div>
                    </td>
                    {/* Giá đại lý */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#7C3AED" }}>{fmtShort(goi.giaDaiLy)}</div>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>đại lý</div>
                    </td>
                    {/* Dùng thử */}
                    <td style={{ padding: "12px 14px" }}>
                      {goi.thoiLuongThuNghiem > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg"
                          style={{ background: "rgba(5,150,105,0.08)", fontSize: "0.73rem", fontWeight: 700, color: "#059669" }}>
                          <Clock size={10} />
                          {goi.thoiLuongThuNghiem}n
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.73rem", color: "#CBD5E1", fontWeight: 500 }}>—</span>
                      )}
                    </td>
                    {/* Sử dụng */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#005CB6" }}>
                        {goi.thoiLuongSuDung} {goi.donViThoiGian === "thang" ? "tháng" : "năm"}
                      </span>
                    </td>
                    {/* Khối lớp */}
                    <td style={{ padding: "12px 14px", maxWidth: 160 }}>
                      <KhoiLopDisplay ids={goi.khoiLopApDung} />
                    </td>
                    {/* Trạng thái */}
                    <td style={{ padding: "12px 14px" }}>
                      <TrangThaiBadge ts={goi.trangThai} />
                    </td>
                    {/* Thao tác */}
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button title="Xem chi tiết" onClick={() => setViewTarget(goi)}
                          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                          style={{ background: "rgba(0,92,182,0.07)", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.14)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,92,182,0.07)")}>
                          <Eye size={13} color="#005CB6" />
                        </button>
                        <button title="Chỉnh sửa" onClick={() => { setEditTarget(goi); setModalMode("edit"); }}
                          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                          style={{ background: "rgba(124,58,237,0.07)", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.14)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,58,237,0.07)")}>
                          <Edit2 size={13} color="#7C3AED" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer bảng */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              Hiển thị {filtered.length} / {goiList.length} gói nội dung
            </span>
            <div className="flex items-center gap-3">
              {DS_PHAN_LOAI.map(pl => {
                const cfg = PHAN_LOAI_CFG[pl];
                const count = goiList.filter(g => g.phanLoai === pl).length;
                return (
                  <span key={pl} className="flex items-center gap-1.5"
                    style={{ fontSize: "0.72rem", fontWeight: 600, color: cfg.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                    {pl}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DRAWER CHI TIẾT ───────────────────────────────────────────────────────────

function DrawerChiTiet({ goi, onClose, onEdit }: { goi: GoiNoiDung; onClose: () => void; onEdit: () => void }) {
  const plCfg = PHAN_LOAI_CFG[goi.phanLoai];
  const tsCfg = TRANG_THAI_CFG[goi.trangThai];
  const PLIcon = plCfg.icon;
  const gradients: Record<PhanLoai, string> = {
    BASIC:    "linear-gradient(135deg,#005CB6,#0074E4)",
    PLUS:     "linear-gradient(135deg,#5B21B6,#7C3AED)",
    ADVANCED: "linear-gradient(135deg,#92400E,#D97706)",
  };

  const groupedLop = (["TH", "THCS", "THPT"] as const).map(cap => ({
    cap, cfg: CAP_HOC_CFG[cap],
    lops: DS_KHOI_LOP.filter(k => k.capHoc === cap && goi.khoiLopApDung.includes(k.id)),
  })).filter(g => g.lops.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,23,42,0.42)", backdropFilter: "blur(3px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex flex-col h-full" style={{ width: 460, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.14)", fontFamily: "'Be Vietnam Pro',sans-serif", animation: "fadeIn 0.2s ease" }}>

        {/* Header */}
        <div className="px-5 py-5 flex-shrink-0" style={{ background: gradients[goi.phanLoai], color: "#fff" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl" style={{ background: "rgba(255,255,255,0.18)" }}>
                <PLIcon size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", opacity: 0.75, textTransform: "uppercase", marginBottom: 2 }}>
                  {goi.phanLoai} · Chi tiết gói
                </div>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, lineHeight: 1.3 }}>{goi.tenGoi}</div>
              </div>
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}>
              <X size={15} color="#fff" />
            </button>
          </div>
          {/* Giá */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: "0.62rem", opacity: 0.75, marginBottom: 4 }}>Giá bán lẻ</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.02em" }}>{fmtShort(goi.giaBanLe)}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: "0.62rem", opacity: 0.75, marginBottom: 4 }}>Giá đại lý</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.02em" }}>{fmtShort(goi.giaDaiLy)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>
              {goi.thoiLuongSuDung} {goi.donViThoiGian === "thang" ? "tháng" : "năm"}
              {goi.thoiLuongThuNghiem > 0 && ` · ${goi.thoiLuongThuNghiem} ngày thử`}
            </span>
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,0.18)", fontSize: "0.72rem", fontWeight: 700 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#fff" }} />
              {goi.trangThai}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* BCCS mapping */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "rgba(0,92,182,0.05)", border: "1.5px solid rgba(0,92,182,0.18)" }}>
            <div className="flex items-center gap-2">
              <Database size={16} color="#005CB6" />
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginBottom: 2 }}>Mapping BCCS</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#005CB6", fontFamily: "monospace", letterSpacing: "0.04em" }}>{plCfg.maBCCS}</div>
              </div>
            </div>
            <PhanLoaiBadge pl={goi.phanLoai} />
          </div>

          {/* Thông tin chi tiết */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <p style={{ fontSize: "0.67rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Thông tin gói</p>
            {[
              { label: "Giá bán lẻ", val: fmt(goi.giaBanLe), color: "#0F172A" },
              { label: "Giá đại lý", val: fmt(goi.giaDaiLy), color: "#7C3AED" },
              { label: "Chênh lệch", val: fmt(goi.giaBanLe - goi.giaDaiLy) + ` (${Math.round((goi.giaBanLe - goi.giaDaiLy) / goi.giaBanLe * 100)}%)`, color: "#059669" },
              { label: "Thời lượng dùng thử", val: goi.thoiLuongThuNghiem > 0 ? `${goi.thoiLuongThuNghiem} ngày` : "Không có", color: "#64748B" },
              { label: "Thời lượng sử dụng", val: `${goi.thoiLuongSuDung} ${goi.donViThoiGian === "thang" ? "tháng" : "năm"}`, color: "#005CB6" },
              { label: "License đã bán", val: goi.soLicenseBan.toLocaleString("vi-VN"), color: "#005CB6" },
              { label: "Ngày tạo", val: goi.ngayTao, color: "#64748B" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>{item.label}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* Khối lớp */}
          <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <p style={{ fontSize: "0.67rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Khối lớp áp dụng</p>
            <div className="space-y-2">
              {groupedLop.map(g => (
                <div key={g.cap} className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded flex-shrink-0" style={{ background: g.cfg.bg, fontSize: "0.68rem", fontWeight: 700, color: g.cfg.color, minWidth: 60, textAlign: "center" }}>{g.cfg.label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {g.lops.map(k => (
                      <span key={k.id} className="px-2 py-0.5 rounded-lg"
                        style={{ background: g.cfg.bg, fontSize: "0.7rem", fontWeight: 600, color: g.cfg.color, border: `1px solid ${g.cfg.color}30` }}>
                        {k.ten}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          {goi.ghiChu && (
            <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
              <p style={{ fontSize: "0.67rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Ghi chú</p>
              <p style={{ fontSize: "0.8rem", color: "#374151", lineHeight: 1.7 }}>{goi.ghiChu}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid #EEF0F4" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl"
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
            Đóng
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", boxShadow: "0 4px 14px rgba(0,92,182,0.38)" }}>
            <Edit2 size={14} /> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
