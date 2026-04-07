import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  Trash2,
  X,
  Building2,
  MapPin,
  Hash,
  Users,
  Network,
  Check,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  MoreHorizontal,
  GitBranch,
  Globe,
  ChevronUp,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

interface DonVi {
  id: string;
  maDonVi: string;
  tenDonVi: string;
  donViChaId: string | null;
  donViCha: string | null;
  capDonVi: "root" | "cap1" | "cap2" | "cap3";
  loaiDonVi: string;
  tinh: string[];
  trangThai: "Hoạt động" | "Tạm dừng" | "Chờ kích hoạt";
  soTaiKhoan: number;
  soGoi: number;
  ngayTao: string;
}

// ── DỮ LIỆU MẪU ───────────────────────────────────────────────────────────────

const DU_LIEU_DON_VI: DonVi[] = [
  {
    id: "1",
    maDonVi: "PN-ROOT",
    tenDonVi: "NXB Phương Nam",
    donViChaId: null,
    donViCha: null,
    capDonVi: "root",
    loaiDonVi: "Đối tác chính",
    tinh: ["TP. Hồ Chí Minh"],
    trangThai: "Hoạt động",
    soTaiKhoan: 12,
    soGoi: 6,
    ngayTao: "01/01/2024",
  },
  {
    id: "2",
    maDonVi: "VTL-HCM",
    tenDonVi: "Viettel TP. Hồ Chí Minh",
    donViChaId: "1",
    donViCha: "NXB Phương Nam",
    capDonVi: "cap1",
    loaiDonVi: "Đại lý cấp 1",
    tinh: ["TP. Hồ Chí Minh"],
    trangThai: "Hoạt động",
    soTaiKhoan: 8,
    soGoi: 4,
    ngayTao: "15/03/2024",
  },
  {
    id: "3",
    maDonVi: "VTL-HN",
    tenDonVi: "Viettel Hà Nội",
    donViChaId: "1",
    donViCha: "NXB Phương Nam",
    capDonVi: "cap1",
    loaiDonVi: "Đại lý cấp 1",
    tinh: ["Hà Nội"],
    trangThai: "Hoạt động",
    soTaiKhoan: 7,
    soGoi: 3,
    ngayTao: "15/03/2024",
  },
  {
    id: "4",
    maDonVi: "VTL-DN",
    tenDonVi: "Viettel Đà Nẵng",
    donViChaId: "1",
    donViCha: "NXB Phương Nam",
    capDonVi: "cap1",
    loaiDonVi: "Đại lý cấp 1",
    tinh: ["Đà Nẵng"],
    trangThai: "Hoạt động",
    soTaiKhoan: 5,
    soGoi: 2,
    ngayTao: "20/03/2024",
  },
  {
    id: "5",
    maDonVi: "VTL-CT",
    tenDonVi: "Viettel Cần Thơ",
    donViChaId: "1",
    donViCha: "NXB Phương Nam",
    capDonVi: "cap1",
    loaiDonVi: "Đại lý cấp 1",
    tinh: ["Cần Thơ"],
    trangThai: "Tạm dừng",
    soTaiKhoan: 3,
    soGoi: 1,
    ngayTao: "01/04/2024",
  },
  {
    id: "6",
    maDonVi: "DAL-Q1",
    tenDonVi: "Đại lý Quận 1 – TP.HCM",
    donViChaId: "2",
    donViCha: "Viettel TP. Hồ Chí Minh",
    capDonVi: "cap2",
    loaiDonVi: "Đại lý cấp 2",
    tinh: ["TP. Hồ Chí Minh"],
    trangThai: "Hoạt động",
    soTaiKhoan: 4,
    soGoi: 2,
    ngayTao: "10/04/2024",
  },
  {
    id: "7",
    maDonVi: "DAL-Q7",
    tenDonVi: "Đại lý Quận 7 – TP.HCM",
    donViChaId: "2",
    donViCha: "Viettel TP. Hồ Chí Minh",
    capDonVi: "cap2",
    loaiDonVi: "Đại lý cấp 2",
    tinh: ["TP. Hồ Chí Minh"],
    trangThai: "Hoạt động",
    soTaiKhoan: 3,
    soGoi: 2,
    ngayTao: "10/04/2024",
  },
  {
    id: "8",
    maDonVi: "CN-HK",
    tenDonVi: "Chi nhánh Hoàn Kiếm",
    donViChaId: "3",
    donViCha: "Viettel Hà Nội",
    capDonVi: "cap2",
    loaiDonVi: "Chi nhánh",
    tinh: ["Hà Nội"],
    trangThai: "Hoạt động",
    soTaiKhoan: 2,
    soGoi: 1,
    ngayTao: "15/04/2024",
  },
  {
    id: "9",
    maDonVi: "CN-HC",
    tenDonVi: "Chi nhánh Hải Châu",
    donViChaId: "4",
    donViCha: "Viettel Đà Nẵng",
    capDonVi: "cap2",
    loaiDonVi: "Chi nhánh",
    tinh: ["Đà Nẵng"],
    trangThai: "Chờ kích hoạt",
    soTaiKhoan: 0,
    soGoi: 0,
    ngayTao: "20/04/2024",
  },
  {
    id: "10",
    maDonVi: "PGD-BT",
    tenDonVi: "Phòng GD Bình Thạnh",
    donViChaId: "6",
    donViCha: "Đại lý Quận 1 – TP.HCM",
    capDonVi: "cap3",
    loaiDonVi: "Phòng Giáo dục",
    tinh: ["TP. Hồ Chí Minh"],
    trangThai: "Hoạt động",
    soTaiKhoan: 1,
    soGoi: 1,
    ngayTao: "25/04/2024",
  },
];

const DANH_SACH_TINH = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Hải Phòng",
  "Bình Định",
];

const CAP_DON_VI_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; indent: number }
> = {
  root:  { label: "Đối tác chính", color: "#005CB6", bg: "rgba(0,92,182,0.08)", border: "rgba(0,92,182,0.2)", indent: 0 },
  cap1:  { label: "Đại lý cấp 1",  color: "#0284C7", bg: "rgba(2,132,199,0.08)", border: "rgba(2,132,199,0.2)", indent: 1 },
  cap2:  { label: "Cấp 2",         color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)", indent: 2 },
  cap3:  { label: "Cấp 3",         color: "#0F766E", bg: "rgba(15,118,110,0.08)", border: "rgba(15,118,110,0.2)", indent: 3 },
};

const TRANG_THAI_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  "Hoạt động":      { color: "#0F766E", bg: "rgba(15,118,110,0.1)", dot: "#0F766E" },
  "Tạm dừng":       { color: "#D97706", bg: "rgba(217,119,6,0.1)", dot: "#D97706" },
  "Chờ kích hoạt":  { color: "#7C3AED", bg: "rgba(124,58,237,0.1)", dot: "#7C3AED" },
};

// ── FORM TRỐNG ────────────────────────────────────────────────────────────────

const FORM_TRONG = {
  maDonVi: "",
  tenDonVi: "",
  donViChaId: null as string | null,
  loaiDonVi: "",
  tinh: [] as string[],
  trangThai: "Hoạt động" as DonVi["trangThai"],
};

// ── DROPDOWN TREE PICKER ──────────────────────────────────────────────────────

function DropdownTree({
  value,
  onChange,
  donViList,
  excludeId,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  donViList: DonVi[];
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = donViList.find((d) => d.id === value);
  const filtered = donViList.filter((d) => d.id !== excludeId);

  const renderTree = (parentId: string | null, depth: number): React.ReactNode[] => {
    return filtered
      .filter((d) => d.donViChaId === parentId)
      .map((d) => {
        const cfg = CAP_DON_VI_CONFIG[d.capDonVi];
        const isSelected = d.id === value;
        return (
          <div key={d.id}>
            <button
              onClick={() => { onChange(d.id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 transition-all duration-100 text-left"
              style={{
                paddingLeft: 12 + depth * 20,
                background: isSelected ? "rgba(0,92,182,0.08)" : "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {depth > 0 && (
                <span style={{ color: "#CBD5E1", fontSize: "0.7rem" }}>
                  {"└─"}
                </span>
              )}
              <Building2 size={13} color={cfg.color} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "0.8rem", fontWeight: isSelected ? 700 : 500, color: "#0F172A" }}>
                  {d.tenDonVi}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{d.maDonVi}</div>
              </div>
              <span
                className="rounded-full px-1.5 py-0.5 flex-shrink-0"
                style={{ fontSize: "0.6rem", fontWeight: 700, color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
              {isSelected && <Check size={13} color="#005CB6" />}
            </button>
            {renderTree(d.id, depth + 1)}
          </div>
        );
      });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150"
        style={{
          background: "#F8F9FA",
          border: `1.5px solid ${open ? "#005CB6" : "#E2E8F0"}`,
          boxShadow: open ? "0 0 0 3px rgba(0,92,182,0.08)" : "none",
          cursor: "pointer",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          textAlign: "left",
        }}
      >
        <Network size={14} color="#94A3B8" />
        <span
          className="flex-1"
          style={{ fontSize: "0.82rem", color: selected ? "#0F172A" : "#94A3B8", fontWeight: selected ? 600 : 400 }}
        >
          {selected ? selected.tenDonVi : "— Chọn đơn vị trực thuộc —"}
        </span>
        {selected && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: 0 }}
          >
            <X size={12} color="#94A3B8" />
          </span>
        )}
        <ChevronDown size={14} color="#94A3B8" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden overflow-y-auto z-50"
          style={{
            background: "#fff",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            maxHeight: 260,
          }}
        >
          <div className="py-1">
            {renderTree(null, 0)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MULTI-SELECT TỈNH ─────────────────────────────────────────────────────────

function MultiSelectTinh({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DANH_SACH_TINH.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (tinh: string) => {
    if (value.includes(tinh)) onChange(value.filter((t) => t !== tinh));
    else onChange([...value, tinh]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150 flex-wrap"
        style={{
          background: "#F8F9FA",
          border: `1.5px solid ${open ? "#005CB6" : "#E2E8F0"}`,
          boxShadow: open ? "0 0 0 3px rgba(0,92,182,0.08)" : "none",
          cursor: "pointer",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          minHeight: 44,
          textAlign: "left",
        }}
      >
        <MapPin size={14} color="#94A3B8" className="flex-shrink-0" />
        {value.length === 0 ? (
          <span style={{ fontSize: "0.82rem", color: "#94A3B8", flex: 1 }}>
            — Chọn Tỉnh/TP —
          </span>
        ) : (
          <div className="flex flex-wrap gap-1 flex-1">
            {value.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: "rgba(0,92,182,0.1)", color: "#005CB6", fontSize: "0.7rem", fontWeight: 600 }}
              >
                {t}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggle(t); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
                >
                  <X size={9} color="#005CB6" />
                </button>
              </span>
            ))}
          </div>
        )}
        <ChevronDown size={14} color="#94A3B8" className="flex-shrink-0" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden z-50"
          style={{
            background: "#fff",
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <div className="p-2" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="relative flex items-center">
              <Search size={12} color="#94A3B8" className="absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm tỉnh/thành phố…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none rounded-lg"
                style={{
                  paddingLeft: 26,
                  padding: "6px 8px 6px 26px",
                  fontSize: "0.78rem",
                  border: "1px solid #EEF0F4",
                  background: "#F8F9FA",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {filtered.map((tinh) => {
              const sel = value.includes(tinh);
              return (
                <button
                  key={tinh}
                  type="button"
                  onClick={() => toggle(tinh)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left"
                  style={{
                    background: sel ? "rgba(0,92,182,0.05)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                  onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA"; }}
                  onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div
                    className="flex items-center justify-center rounded flex-shrink-0"
                    style={{
                      width: 16, height: 16,
                      background: sel ? "#005CB6" : "transparent",
                      border: `2px solid ${sel ? "#005CB6" : "#CBD5E1"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {sel && <Check size={10} color="#fff" strokeWidth={3} />}
                  </div>
                  <MapPin size={12} color={sel ? "#005CB6" : "#94A3B8"} />
                  <span style={{ fontSize: "0.8rem", color: sel ? "#005CB6" : "#374151", fontWeight: sel ? 600 : 400 }}>
                    {tinh}
                  </span>
                </button>
              );
            })}
          </div>
          {value.length > 0 && (
            <div className="px-3 py-2" style={{ borderTop: "1px solid #F1F5F9" }}>
              <button
                type="button"
                onClick={() => onChange([])}
                style={{ fontSize: "0.72rem", color: "#D4183D", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                Xóa tất cả ({value.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MODAL THÊM / CHỈNH SỬA ───────────────────────────────────────────────────

function ModalDonVi({
  mode,
  donViEdit,
  donViList,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  donViEdit: DonVi | null;
  donViList: DonVi[];
  onClose: () => void;
  onSave: (data: typeof FORM_TRONG) => void;
}) {
  const [form, setForm] = useState(
    donViEdit
      ? {
          maDonVi: donViEdit.maDonVi,
          tenDonVi: donViEdit.tenDonVi,
          donViChaId: donViEdit.donViChaId,
          loaiDonVi: donViEdit.loaiDonVi,
          tinh: [...donViEdit.tinh],
          trangThai: donViEdit.trangThai,
        }
      : { ...FORM_TRONG }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.maDonVi.trim()) e.maDonVi = "Mã đơn vị không được để trống";
    if (!form.tenDonVi.trim()) e.tenDonVi = "Tên đơn vị không được để trống";
    if (!form.loaiDonVi) e.loaiDonVi = "Vui lòng chọn loại đơn vị";
    if (form.tinh.length === 0) e.tinh = "Vui lòng chọn ít nhất một Tỉnh/TP";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(form); }, 800);
  };

  const LOAI_DON_VI = [
    "Đối tác chính",
    "Đại lý cấp 1",
    "Đại lý cấp 2",
    "Chi nhánh",
    "Phòng Giáo dục",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: 560,
          maxHeight: "90vh",
          background: "#fff",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {/* Header modal */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #005CB6, #0074E4)",
            color: "#fff",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Building2 size={18} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800 }}>
                {mode === "add" ? "Thêm mới Đơn vị" : "Chỉnh sửa Đơn vị"}
              </div>
              <div style={{ fontSize: "0.7rem", opacity: 0.8, marginTop: 2 }}>
                {mode === "add"
                  ? "Điền đầy đủ thông tin để tạo đơn vị mới"
                  : `Đang chỉnh sửa: ${donViEdit?.tenDonVi}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* Nội dung form */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

          {/* Mã đơn vị + Tên đơn vị */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                <Hash size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                Mã đơn vị <span style={{ color: "#D4183D" }}>*</span>
              </label>
              <input
                type="text"
                value={form.maDonVi}
                onChange={(e) => setForm({ ...form, maDonVi: e.target.value.toUpperCase() })}
                placeholder="VD: VTL-HCM"
                className="w-full outline-none rounded-xl"
                style={{
                  border: `1.5px solid ${errors.maDonVi ? "#D4183D" : "#E2E8F0"}`,
                  padding: "10px 12px",
                  fontSize: "0.83rem",
                  fontFamily: "monospace, sans-serif",
                  background: "#F8F9FA",
                  color: "#005CB6",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.maDonVi ? "#D4183D" : "#E2E8F0"; e.target.style.boxShadow = "none"; e.target.style.background = "#F8F9FA"; }}
              />
              {errors.maDonVi && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 4 }}>{errors.maDonVi}</p>}
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Loại đơn vị <span style={{ color: "#D4183D" }}>*</span>
              </label>
              <div className="relative">
                <select
                  value={form.loaiDonVi}
                  onChange={(e) => setForm({ ...form, loaiDonVi: e.target.value })}
                  className="w-full outline-none rounded-xl appearance-none"
                  style={{
                    border: `1.5px solid ${errors.loaiDonVi ? "#D4183D" : "#E2E8F0"}`,
                    padding: "10px 32px 10px 12px",
                    fontSize: "0.83rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    background: "#F8F9FA",
                    color: form.loaiDonVi ? "#0F172A" : "#94A3B8",
                    cursor: "pointer",
                  }}
                >
                  <option value="">— Chọn loại —</option>
                  {LOAI_DON_VI.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={13} color="#94A3B8" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.loaiDonVi && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 4 }}>{errors.loaiDonVi}</p>}
            </div>
          </div>

          {/* Tên đơn vị */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
              <Building2 size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Tên đơn vị <span style={{ color: "#D4183D" }}>*</span>
            </label>
            <input
              type="text"
              value={form.tenDonVi}
              onChange={(e) => setForm({ ...form, tenDonVi: e.target.value })}
              placeholder="VD: Viettel TP. Hồ Chí Minh"
              className="w-full outline-none rounded-xl"
              style={{
                border: `1.5px solid ${errors.tenDonVi ? "#D4183D" : "#E2E8F0"}`,
                padding: "10px 12px",
                fontSize: "0.83rem",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: "#F8F9FA",
                color: "#0F172A",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = errors.tenDonVi ? "#D4183D" : "#E2E8F0"; e.target.style.boxShadow = "none"; e.target.style.background = "#F8F9FA"; }}
            />
            {errors.tenDonVi && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 4 }}>{errors.tenDonVi}</p>}
          </div>

          {/* Đơn vị trực thuộc (Dropdown Tree) */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
              <GitBranch size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Đơn vị trực thuộc (Cha)
              <span style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>
                Để trống nếu là đơn vị gốc
              </span>
            </label>
            <DropdownTree
              value={form.donViChaId}
              onChange={(id) => setForm({ ...form, donViChaId: id })}
              donViList={donViList}
              excludeId={donViEdit?.id}
            />
          </div>

          {/* Tỉnh/TP Multi-select */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
              <Globe size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Tỉnh/Thành phố <span style={{ color: "#D4183D" }}>*</span>
            </label>
            <MultiSelectTinh
              value={form.tinh}
              onChange={(v) => setForm({ ...form, tinh: v })}
            />
            {errors.tinh && <p style={{ fontSize: "0.68rem", color: "#D4183D", marginTop: 4 }}>{errors.tinh}</p>}
          </div>

          {/* Trạng thái */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
              Trạng thái hoạt động
            </label>
            <div className="flex gap-2">
              {(["Hoạt động", "Tạm dừng", "Chờ kích hoạt"] as DonVi["trangThai"][]).map((ts) => {
                const cfg = TRANG_THAI_CONFIG[ts];
                const sel = form.trangThai === ts;
                return (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setForm({ ...form, trangThai: ts })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-150"
                    style={{
                      background: sel ? cfg.bg : "#F8F9FA",
                      border: `1.5px solid ${sel ? cfg.dot : "#E2E8F0"}`,
                      cursor: "pointer",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: sel ? cfg.dot : "#CBD5E1" }}
                    />
                    <span style={{ fontSize: "0.78rem", fontWeight: sel ? 700 : 400, color: sel ? cfg.color : "#64748B" }}>
                      {ts}
                    </span>
                    {sel && <Check size={11} color={cfg.color} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lưu ý */}
          <div
            className="flex items-start gap-2.5 rounded-xl p-3"
            style={{ background: "rgba(0,92,182,0.05)", border: "1px solid rgba(0,92,182,0.15)" }}
          >
            <AlertCircle size={14} color="#005CB6" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: "0.75rem", color: "#374151", lineHeight: 1.6 }}>
              Mã đơn vị sẽ được sử dụng để liên kết dữ liệu với hệ thống BCCS.
              Đảm bảo mã chính xác trước khi lưu.
            </p>
          </div>
        </div>

        {/* Footer modal */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl transition-all duration-150"
            style={{
              background: "#F1F5F9",
              border: "1.5px solid #E2E8F0",
              color: "#64748B",
              fontSize: "0.84rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-150"
            style={{
              background: saving ? "#94A3B8" : "linear-gradient(135deg, #005CB6, #0074E4)",
              border: "none",
              color: "#fff",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              boxShadow: saving ? "none" : "0 4px 12px rgba(0,92,182,0.35)",
            }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" style={{ animation: "spin 0.8s linear infinite" }} />
                Đang lưu…
              </>
            ) : (
              <>
                <CheckCircle size={15} />
                {mode === "add" ? "Tạo đơn vị" : "Lưu thay đổi"}
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ── DRAWER CHI TIẾT ───────────────────────────────────────────────────────────

function DrawerChiTiet({
  donVi,
  donViList,
  onClose,
  onEdit,
}: {
  donVi: DonVi;
  donViList: DonVi[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const children = donViList.filter((d) => d.donViChaId === donVi.id);
  const cfg = CAP_DON_VI_CONFIG[donVi.capDonVi];
  const tsCfg = TRANG_THAI_CONFIG[donVi.trangThai];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{
          width: 400,
          background: "#fff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.14)",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {/* Header drawer */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #005CB6, #0074E4)", color: "#fff" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Eye size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>Chi tiết đơn vị</div>
              <div style={{ fontSize: "0.68rem", opacity: 0.8, marginTop: 2 }}>{donVi.maDonVi}</div>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}>
            <X size={15} color="#fff" />
          </button>
        </div>

        {/* Nội dung drawer */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Badge cấp + trạng thái */}
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {cfg.label}
            </span>
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: tsCfg.bg, color: tsCfg.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: tsCfg.dot }} />
              {donVi.trangThai}
            </span>
          </div>

          {/* Thông tin cơ bản */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Thông tin cơ bản
            </h4>
            {[
              { label: "Mã đơn vị", value: donVi.maDonVi, mono: true },
              { label: "Tên đơn vị", value: donVi.tenDonVi, mono: false },
              { label: "Loại đơn vị", value: donVi.loaiDonVi, mono: false },
              { label: "Ngày tạo", value: donVi.ngayTao, mono: false },
            ].map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-2">
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", minWidth: 110 }}>{item.label}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1E293B", textAlign: "right", fontFamily: item.mono ? "monospace" : "'Be Vietnam Pro', sans-serif" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Đơn vị cha */}
          <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Đơn vị trực thuộc
            </h4>
            {donVi.donViCha ? (
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(0,92,182,0.05)", border: "1px solid rgba(0,92,182,0.15)" }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "#005CB6" }}>
                  <Building2 size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#005CB6" }}>{donVi.donViCha}</div>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Đơn vị cha trực tiếp</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontStyle: "italic" }}>— Đây là đơn vị gốc —</div>
            )}
          </div>

          {/* Tỉnh/TP */}
          <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Tỉnh/Thành phố
            </h4>
            <div className="flex flex-wrap gap-2">
              {donVi.tinh.map((t) => (
                <span key={t} className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: "rgba(0,92,182,0.08)", color: "#005CB6", fontSize: "0.75rem", fontWeight: 600 }}>
                  <MapPin size={11} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Số liệu */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tài khoản", value: donVi.soTaiKhoan, icon: Users, color: "#005CB6", bg: "rgba(0,92,182,0.08)" },
              { label: "Gói nội dung", value: donVi.soGoi, icon: Network, color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
            ].map((item) => {
              const IIcon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: item.bg, border: `1px solid ${item.color}22` }}>
                  <IIcon size={20} color={item.color} style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: 2 }}>{item.label}</div>
                </div>
              );
            })}
          </div>

          {/* Đơn vị con */}
          {children.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
              <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Đơn vị con ({children.length})
              </h4>
              <div className="space-y-2">
                {children.map((c) => {
                  const cCfg = CAP_DON_VI_CONFIG[c.capDonVi];
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 rounded-xl p-2.5" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
                      <ChevronRight size={12} color={cCfg.color} />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{c.tenDonVi}</div>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{c.maDonVi}</div>
                      </div>
                      <span className="rounded-full px-2 py-0.5" style={{ fontSize: "0.6rem", fontWeight: 700, color: cCfg.color, background: cCfg.bg }}>
                        {cCfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer drawer */}
        <div className="flex gap-2 px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid #EEF0F4" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Đóng
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ background: "#005CB6", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", boxShadow: "0 3px 10px rgba(0,92,182,0.3)" }}>
            <Edit2 size={14} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function UnitManagementPage() {
  const [donViList, setDonViList] = useState<DonVi[]>(DU_LIEU_DON_VI);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locTinh, setLocTinh] = useState<string[]>([]);
  const [locCapDonVi, setLocCapDonVi] = useState("Tất cả");
  const [locTrangThai, setLocTrangThai] = useState("Tất cả");
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDonVi, setSelectedDonVi] = useState<DonVi | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [locTinhOpen, setLocTinhOpen] = useState(false);
  const locTinhRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (locTinhRef.current && !locTinhRef.current.contains(e.target as Node)) setLocTinhOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Lọc dữ liệu
  const dsDaLoc = donViList.filter((d) => {
    const khopTu = d.tenDonVi.toLowerCase().includes(tuKhoa.toLowerCase()) || d.maDonVi.toLowerCase().includes(tuKhoa.toLowerCase());
    const khopTinh = locTinh.length === 0 || d.tinh.some((t) => locTinh.includes(t));
    const khopCap = locCapDonVi === "Tất cả" || CAP_DON_VI_CONFIG[d.capDonVi]?.label === locCapDonVi;
    const khopTS = locTrangThai === "Tất cả" || d.trangThai === locTrangThai;
    return khopTu && khopTinh && khopCap && khopTS;
  });

  const handleSave = (formData: typeof FORM_TRONG) => {
    if (modalMode === "add") {
      const newDonVi: DonVi = {
        id: Date.now().toString(),
        maDonVi: formData.maDonVi,
        tenDonVi: formData.tenDonVi,
        donViChaId: formData.donViChaId,
        donViCha: formData.donViChaId ? donViList.find((d) => d.id === formData.donViChaId)?.tenDonVi || null : null,
        capDonVi: formData.donViChaId ? "cap2" : "root",
        loaiDonVi: formData.loaiDonVi,
        tinh: formData.tinh,
        trangThai: formData.trangThai,
        soTaiKhoan: 0,
        soGoi: 0,
        ngayTao: new Date().toLocaleDateString("vi-VN"),
      };
      setDonViList([...donViList, newDonVi]);
      showToast(`Đã tạo đơn vị "${newDonVi.tenDonVi}" thành công`);
    } else if (selectedDonVi) {
      setDonViList(donViList.map((d) =>
        d.id === selectedDonVi.id
          ? { ...d, maDonVi: formData.maDonVi, tenDonVi: formData.tenDonVi, donViChaId: formData.donViChaId, donViCha: formData.donViChaId ? donViList.find((x) => x.id === formData.donViChaId)?.tenDonVi || null : null, loaiDonVi: formData.loaiDonVi, tinh: formData.tinh, trangThai: formData.trangThai }
          : d
      ));
      showToast(`Đã cập nhật đơn vị "${formData.tenDonVi}"`);
    }
    setShowModal(false);
    setSelectedDonVi(null);
  };

  const handleDelete = (id: string) => {
    const d = donViList.find((x) => x.id === id);
    const hasChildren = donViList.some((x) => x.donViChaId === id);
    if (hasChildren) {
      showToast(`Không thể xóa "${d?.tenDonVi}" vì có đơn vị con trực thuộc`, "error");
    } else {
      setDonViList(donViList.filter((x) => x.id !== id));
      showToast(`Đã xóa đơn vị "${d?.tenDonVi}"`);
    }
    setShowDeleteConfirm(null);
  };

  // Thống kê nhanh
  const soHoatDong = donViList.filter((d) => d.trangThai === "Hoạt động").length;
  const soCap1 = donViList.filter((d) => d.capDonVi === "cap1").length;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl"
          style={{
            background: toast.type === "success" ? "#fff" : "#fff",
            border: `1.5px solid ${toast.type === "success" ? "rgba(15,118,110,0.3)" : "rgba(212,24,61,0.3)"}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            animation: "slideIn 0.3s ease",
          }}
        >
          {toast.type === "success"
            ? <CheckCircle size={17} color="#0F766E" />
            : <AlertCircle size={17} color="#D4183D" />}
          <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#1E293B" }}>{toast.msg}</span>
        </div>
      )}

      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: "linear-gradient(135deg, #005CB6, #0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
              <Building2 size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Quản lý Đơn vị</h2>
              <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 4 }}>
                Cấu trúc phân cấp tổ chức · {donViList.length} đơn vị
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-150"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#64748B", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              <Download size={14} />
              Xuất Excel
            </button>
            <button
              onClick={() => { setModalMode("add"); setSelectedDonVi(null); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-150"
              style={{
                background: "linear-gradient(135deg, #005CB6, #0074E4)",
                border: "none",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                boxShadow: "0 4px 14px rgba(0,92,182,0.38)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,92,182,0.48)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,92,182,0.38)")}
            >
              <Plus size={16} strokeWidth={2.5} />
              Thêm mới đơn vị
            </button>
          </div>
        </div>

        {/* ── THẺ SỐ LIỆU NHANH ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tổng đơn vị", value: donViList.length, icon: Building2, color: "#005CB6", bg: "rgba(0,92,182,0.07)" },
            { label: "Đang hoạt động", value: soHoatDong, icon: CheckCircle, color: "#0F766E", bg: "rgba(15,118,110,0.07)" },
            { label: "Đại lý cấp 1", value: soCap1, icon: GitBranch, color: "#0284C7", bg: "rgba(2,132,199,0.07)" },
            { label: "Tỉnh/TP phủ sóng", value: [...new Set(donViList.flatMap((d) => d.tinh))].length, icon: MapPin, color: "#7C3AED", bg: "rgba(124,58,237,0.07)" },
          ].map((s) => {
            const SIcon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl px-4 py-3.5" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: s.bg }}>
                  <SIcon size={17} color={s.color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── THANH TÌM KIẾM + LỌC ── */}
        <div
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
        >
          {/* Tìm kiếm */}
          <div className="relative flex items-center flex-1" style={{ minWidth: 220 }}>
            <Search size={15} color="#94A3B8" className="absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên đơn vị, mã đơn vị…"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              className="w-full outline-none rounded-xl"
              style={{
                border: "1.5px solid #EEF0F4",
                padding: "9px 36px 9px 38px",
                fontSize: "0.83rem",
                background: "#F8F9FA",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                color: "#0F172A",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#EEF0F4"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }}
            />
            {tuKhoa && (
              <button onClick={() => setTuKhoa("")} className="absolute right-3" style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={13} color="#94A3B8" />
              </button>
            )}
          </div>

          {/* Lọc Tỉnh */}
          <div className="relative" ref={locTinhRef}>
            <button
              onClick={() => setLocTinhOpen(!locTinhOpen)}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-all duration-150"
              style={{
                border: `1.5px solid ${locTinh.length > 0 ? "#005CB6" : "#EEF0F4"}`,
                background: locTinh.length > 0 ? "rgba(0,92,182,0.06)" : "#F8F9FA",
                cursor: "pointer",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: "0.82rem",
                fontWeight: locTinh.length > 0 ? 700 : 500,
                color: locTinh.length > 0 ? "#005CB6" : "#64748B",
              }}
            >
              <MapPin size={14} color={locTinh.length > 0 ? "#005CB6" : "#94A3B8"} />
              Lọc tỉnh
              {locTinh.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-white" style={{ background: "#005CB6", fontSize: "0.6rem", fontWeight: 800 }}>
                  {locTinh.length}
                </span>
              )}
              <ChevronDown size={13} style={{ transform: locTinhOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {locTinhOpen && (
              <div className="absolute top-full mt-1.5 left-0 z-40 rounded-xl overflow-hidden overflow-y-auto" style={{ background: "#fff", border: "1.5px solid #E2E8F0", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 200, maxHeight: 240 }}>
                {DANH_SACH_TINH.map((t) => {
                  const sel = locTinh.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setLocTinh(sel ? locTinh.filter((x) => x !== t) : [...locTinh, t])}
                      className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left"
                      style={{ background: sel ? "rgba(0,92,182,0.06)" : "transparent", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "#F8F9FA"; }}
                      onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      <div className="flex items-center justify-center rounded" style={{ width: 15, height: 15, background: sel ? "#005CB6" : "transparent", border: `2px solid ${sel ? "#005CB6" : "#CBD5E1"}` }}>
                        {sel && <Check size={9} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: sel ? "#005CB6" : "#374151", fontWeight: sel ? 600 : 400 }}>{t}</span>
                    </button>
                  );
                })}
                {locTinh.length > 0 && (
                  <div className="px-3 py-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                    <button onClick={() => setLocTinh([])} style={{ fontSize: "0.7rem", color: "#D4183D", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lọc cấp */}
          <select
            value={locCapDonVi}
            onChange={(e) => setLocCapDonVi(e.target.value)}
            className="outline-none rounded-xl"
            style={{ border: "1.5px solid #EEF0F4", padding: "9px 12px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#64748B", cursor: "pointer" }}
          >
            <option>Tất cả</option>
            {Object.values(CAP_DON_VI_CONFIG).map((c) => (
              <option key={c.label}>{c.label}</option>
            ))}
          </select>

          {/* Lọc trạng thái */}
          <select
            value={locTrangThai}
            onChange={(e) => setLocTrangThai(e.target.value)}
            className="outline-none rounded-xl"
            style={{ border: "1.5px solid #EEF0F4", padding: "9px 12px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#64748B", cursor: "pointer" }}
          >
            <option>Tất cả</option>
            <option>Hoạt động</option>
            <option>Tạm dừng</option>
            <option>Chờ kích hoạt</option>
          </select>

          {(tuKhoa || locTinh.length > 0 || locCapDonVi !== "Tất cả" || locTrangThai !== "Tất cả") && (
            <button
              onClick={() => { setTuKhoa(""); setLocTinh([]); setLocCapDonVi("Tất cả"); setLocTrangThai("Tất cả"); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-150"
              style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.2)", color: "#D4183D", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              <X size={13} />
              Xóa bộ lọc
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Filter size={14} color="#94A3B8" />
            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              <strong style={{ color: "#0F172A" }}>{dsDaLoc.length}</strong> / {donViList.length} đơn vị
            </span>
          </div>
        </div>

        {/* ── BẢNG DỮ LIỆU ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {[
                    { label: "Mã đơn vị", w: "10%" },
                    { label: "Tên đơn vị · Quan hệ cha-con", w: "28%" },
                    { label: "Loại / Cấp", w: "14%" },
                    { label: "Tỉnh/TP", w: "15%" },
                    { label: "Tài khoản · Gói", w: "10%" },
                    { label: "Trạng thái", w: "11%" },
                    { label: "Ngày tạo", w: "8%" },
                    { label: "", w: "4%" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        width: col.w,
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: "0.64rem",
                        fontWeight: 800,
                        color: "#94A3B8",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid #EEF0F4",
                        whiteSpace: "nowrap",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dsDaLoc.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "48px 16px", textAlign: "center" }}>
                      <div className="flex flex-col items-center gap-3">
                        <Building2 size={36} color="#CBD5E1" />
                        <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Không tìm thấy đơn vị phù hợp</p>
                        <button onClick={() => { setTuKhoa(""); setLocTinh([]); setLocCapDonVi("Tất cả"); setLocTrangThai("Tất cả"); }} style={{ fontSize: "0.78rem", color: "#005CB6", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                          Xóa bộ lọc →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dsDaLoc.map((dv, idx) => {
                    const cfg = CAP_DON_VI_CONFIG[dv.capDonVi];
                    const tsCfg = TRANG_THAI_CONFIG[dv.trangThai];
                    const indentMap = { root: 0, cap1: 1, cap2: 2, cap3: 3 };
                    const indent = indentMap[dv.capDonVi];
                    const showDelete = showDeleteConfirm === dv.id;

                    return (
                      <tr
                        key={dv.id}
                        style={{
                          borderBottom: idx < dsDaLoc.length - 1 ? "1px solid #F8F9FA" : "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,92,182,0.015)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* Mã đơn vị */}
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: "0.73rem", fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "3px 8px", borderRadius: 6, fontFamily: "monospace", letterSpacing: "0.03em" }}>
                            {dv.maDonVi}
                          </span>
                        </td>

                        {/* Tên + Quan hệ cha-con */}
                        <td style={{ padding: "13px 16px" }}>
                          <div className="flex items-start gap-1.5">
                            {/* Indent cấp bậc */}
                            {indent > 0 && (
                              <div className="flex items-center gap-0 flex-shrink-0 pt-1">
                                {Array.from({ length: indent }).map((_, i) => (
                                  <span
                                    key={i}
                                    className="inline-block"
                                    style={{
                                      width: i === indent - 1 ? 14 : 10,
                                      height: 14,
                                      borderLeft: `1.5px solid ${i === indent - 1 ? cfg.color + "60" : "#CBD5E150"}`,
                                      borderBottom: i === indent - 1 ? `1.5px solid ${cfg.color + "60"}` : "none",
                                      marginRight: i === indent - 1 ? 4 : 0,
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#1E293B", lineHeight: 1.3 }}>
                                {dv.tenDonVi}
                              </div>
                              {dv.donViCha && (
                                <div className="flex items-center gap-1 mt-1">
                                  <ChevronUp size={10} color="#CBD5E1" />
                                  <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                                    {dv.donViCha}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Loại / Cấp */}
                        <td style={{ padding: "13px 16px" }}>
                          <div className="flex flex-col gap-1">
                            <span className="rounded-full px-2.5 py-1 inline-block" style={{ fontSize: "0.68rem", fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, width: "fit-content" }}>
                              {cfg.label}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{dv.loaiDonVi}</span>
                          </div>
                        </td>

                        {/* Tỉnh/TP */}
                        <td style={{ padding: "13px 16px" }}>
                          <div className="flex flex-wrap gap-1">
                            {dv.tinh.map((t) => (
                              <span key={t} className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ fontSize: "0.67rem", fontWeight: 500, color: "#64748B", background: "#F1F5F9" }}>
                                <MapPin size={9} color="#94A3B8" />
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Tài khoản · Gói */}
                        <td style={{ padding: "13px 16px" }}>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Users size={12} color="#0284C7" />
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284C7" }}>{dv.soTaiKhoan}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Network size={12} color="#7C3AED" />
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#7C3AED" }}>{dv.soGoi}</span>
                            </div>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td style={{ padding: "13px 16px" }}>
                          <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 w-fit" style={{ fontSize: "0.7rem", fontWeight: 700, color: tsCfg.color, background: tsCfg.bg }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tsCfg.dot }} />
                            {dv.trangThai}
                          </span>
                        </td>

                        {/* Ngày tạo */}
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{dv.ngayTao}</span>
                        </td>

                        {/* Hành động */}
                        <td style={{ padding: "13px 10px" }}>
                          {showDelete ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(dv.id)} className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "rgba(212,24,61,0.1)", border: "none", cursor: "pointer" }} title="Xác nhận xóa">
                                <Check size={13} color="#D4183D" strokeWidth={2.5} />
                              </button>
                              <button onClick={() => setShowDeleteConfirm(null)} className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "#F1F5F9", border: "none", cursor: "pointer" }} title="Hủy">
                                <X size={13} color="#64748B" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { setSelectedDonVi(dv); setShowDrawer(true); }}
                                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                                title="Xem chi tiết"
                                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,92,182,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <Eye size={14} color="#005CB6" />
                              </button>
                              <button
                                onClick={() => { setSelectedDonVi(dv); setModalMode("edit"); setShowModal(true); }}
                                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(2,132,199,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <Edit2 size={14} color="#0284C7" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(dv.id)}
                                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                                title="Xóa đơn vị"
                                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,24,61,0.07)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <Trash2 size={14} color="#D4183D" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer bảng */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-4">
              {Object.entries(TRANG_THAI_CONFIG).map(([ts, cfg]) => {
                const count = donViList.filter((d) => d.trangThai === ts).length;
                return (
                  <div key={ts} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                    <span style={{ fontSize: "0.72rem", color: "#64748B" }}>{ts}: <strong style={{ color: "#0F172A" }}>{count}</strong></span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              Hiển thị <strong style={{ color: "#0F172A" }}>{dsDaLoc.length}</strong> / {donViList.length} đơn vị
            </span>
          </div>
        </div>

        {/* Chú thích cấp bậc */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em" }}>SƠ ĐỒ CẤP BẬC:</span>
          {Object.entries(CAP_DON_VI_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>{cfg.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <ChevronUp size={12} color="#CBD5E1" />
            <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Chỉ đơn vị cha trực tiếp</span>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <ModalDonVi
          mode={modalMode}
          donViEdit={selectedDonVi}
          donViList={donViList}
          onClose={() => { setShowModal(false); setSelectedDonVi(null); }}
          onSave={handleSave}
        />
      )}

      {/* Drawer Chi tiết */}
      {showDrawer && selectedDonVi && (
        <DrawerChiTiet
          donVi={selectedDonVi}
          donViList={donViList}
          onClose={() => { setShowDrawer(false); setSelectedDonVi(null); }}
          onEdit={() => { setShowDrawer(false); setModalMode("edit"); setShowModal(true); }}
        />
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
