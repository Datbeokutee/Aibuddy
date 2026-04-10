import { useState, useRef } from "react";
import {
  Plus, RefreshCw, ArrowUpDown, Upload, Pencil, Trash2,
  Copy, Search, ChevronDown, AlertCircle, Check,
  X, AlertTriangle, Home, ChevronRight, Image,
  CheckCircle2, XCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// KIỂU DỮ LIỆU
// ═══════════════════════════════════════════════════════════════════════════════

interface SoHocLieu {
  baiGiang: number;
  baiKiemTra: number;
  nganHangCauHoi: number;
}

type TrangThaiND = "Chưa phê duyệt" | "Đã phê duyệt";
type NguonND = "admin" | "doitac";

interface NoiDungHoc {
  id: string;
  ten: string;
  goiCuoc: string;
  khoiLop: string;
  monHoc: string;
  soHocLieu: SoHocLieu;
  nguoiTao: string;
  tenDoiTac: string;
  nguon: NguonND;
  lanSuaCuoi: string;
  trangThai: TrangThaiND;
}

// ── DATA MASTER ───────────────────────────────────────────────────────────────

type LoaiGiaND = "dong-gia" | "khac-gia" | "free";

interface GoiCuocInfo {
  id: string; ten: string;
  loaiGia: LoaiGiaND;
  gia: number; giaTo?: number;
  giaTheoKhoi?: Record<string, number>;
  sdStart: string; sdEnd: string;       // Ngày bắt đầu / kết thúc gói (DD/MM/YYYY)
  tnStart?: string; tnEnd?: string;     // Ngày bắt đầu / kết thúc dùng thử (DD/MM/YYYY)
  khoiLop: string[]; monHoc: string[];
}
interface ChuongTrinhMaster {
  id: string; ten: string; danhSachGoi: GoiCuocInfo[];
}

const MASTER_DATA: ChuongTrinhMaster[] = [
  {
    id: "m01", ten: "AI Book 2026",
    danhSachGoi: [
      { id: "g01", ten: "BASIC Tiểu học",  loaiGia: "dong-gia", gia: 200,  sdStart: "01/09/2025", sdEnd: "31/08/2026", tnStart: "01/09/2025", tnEnd: "07/09/2025", khoiLop: ["Lớp 1","Lớp 2"],   monHoc: ["Toán"] },
      { id: "g02", ten: "PLUS Tiểu học",   loaiGia: "khac-gia", gia: 400, giaTo: 500, giaTheoKhoi: { "Lớp 3": 400, "Lớp 4": 500 }, sdStart: "01/09/2025", sdEnd: "31/08/2026", khoiLop: ["Lớp 3","Lớp 4"], monHoc: ["Tiếng Anh"] },
      { id: "g09", ten: "BASIC THPT",      loaiGia: "khac-gia", gia: 350, giaTo: 450, giaTheoKhoi: { "Lớp 10": 350, "Lớp 11": 450 }, sdStart: "01/09/2025", sdEnd: "31/08/2026", khoiLop: ["Lớp 10","Lớp 11"], monHoc: ["Lịch sử"] },
    ],
  },
  {
    id: "m02", ten: "Kỹ năng sống Pro",
    danhSachGoi: [
      { id: "g03", ten: "Gói Hè Miễn Phí", loaiGia: "free", gia: 0, sdStart: "01/06/2026", sdEnd: "31/08/2026", tnStart: "01/06/2026", tnEnd: "15/06/2026", khoiLop: ["Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5"], monHoc: ["Kỹ năng sống"] },
    ],
  },
  {
    id: "m03", ten: "Luyện thi THPT",
    danhSachGoi: [
      { id: "g04", ten: "Gói Cấp tốc",    loaiGia: "dong-gia", gia: 1000, sdStart: "01/01/2026", sdEnd: "30/06/2026", khoiLop: ["Lớp 12"], monHoc: ["Vật lí","Hóa học"] },
    ],
  },
  {
    id: "m04", ten: "AI Book Ngữ Văn",
    danhSachGoi: [
      { id: "g05", ten: "BASIC THCS",      loaiGia: "dong-gia", gia: 300,  sdStart: "01/09/2025", sdEnd: "31/08/2026", tnStart: "01/09/2025", tnEnd: "07/09/2025", khoiLop: ["Lớp 6","Lớp 7"], monHoc: ["Ngữ văn"] },
    ],
  },
  {
    id: "m05", ten: "AI Book Toán",
    danhSachGoi: [
      { id: "g06", ten: "PLUS THCS",       loaiGia: "khac-gia", gia: 500, giaTo: 600, giaTheoKhoi: { "Lớp 8": 500, "Lớp 9": 600 }, sdStart: "01/09/2025", sdEnd: "31/08/2026", khoiLop: ["Lớp 8","Lớp 9"], monHoc: ["Toán"] },
    ],
  },
  {
    id: "m06", ten: "Tiếng Anh Giao tiếp",
    danhSachGoi: [
      { id: "g07", ten: "Gói VIP 1 kèm 1", loaiGia: "dong-gia", gia: 2000, sdStart: "01/09/2025", sdEnd: "31/08/2026", tnStart: "01/09/2025", tnEnd: "07/09/2025", khoiLop: ["Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5","Lớp 6","Lớp 7","Lớp 8","Lớp 9","Lớp 10","Lớp 11","Lớp 12"], monHoc: ["Tiếng Anh"] },
    ],
  },
  {
    id: "m07", ten: "STEM Robotics",
    danhSachGoi: [
      { id: "g08", ten: "Gói Trải nghiệm", loaiGia: "free", gia: 0, sdStart: "01/04/2026", sdEnd: "30/04/2026", tnStart: "01/04/2026", tnEnd: "07/04/2026", khoiLop: ["Lớp 3","Lớp 4","Lớp 5"], monHoc: ["Tin học"] },
    ],
  },
  {
    id: "m08", ten: "Ôn thi vào 10",
    danhSachGoi: [
      { id: "g10", ten: "Gói Tổng ôn",     loaiGia: "dong-gia", gia: 800,  sdStart: "01/01/2026", sdEnd: "30/06/2026", khoiLop: ["Lớp 9"], monHoc: ["Toán","Ngữ văn","Tiếng Anh"] },
    ],
  },
];

const DANH_SACH_DOI_TAC = [
  { value: "quantridoitac", label: "Đối tác A" },
  { value: "doitac_edu",    label: "Đối tác B" },
  { value: "doitac_stem",   label: "Đối tác STEM" },
  { value: "admin",         label: "Admin VTS" },
];

const SAMPLE_TABLE: NoiDungHoc[] = [
  { id: "nd-01", ten: "AI Book 2026",         goiCuoc: "BASIC Tiểu học",    khoiLop: "Lớp 1, 2",     monHoc: "Toán",           soHocLieu: { baiGiang: 1,  baiKiemTra: 2, nganHangCauHoi: 0 }, nguoiTao: "quantridoitac", tenDoiTac: "Đối tác A",   nguon: "doitac", lanSuaCuoi: "28/03/2026, 17:10", trangThai: "Đã phê duyệt"   },
  { id: "nd-02", ten: "AI Book 2026",         goiCuoc: "PLUS Tiểu học",     khoiLop: "Lớp 3, 4",     monHoc: "Tiếng Anh",      soHocLieu: { baiGiang: 1,  baiKiemTra: 1, nganHangCauHoi: 0 }, nguoiTao: "quantridoitac", tenDoiTac: "Đối tác A",   nguon: "doitac", lanSuaCuoi: "27/03/2026, 16:13", trangThai: "Chưa phê duyệt"  },
  { id: "nd-03", ten: "Kỹ năng sống Pro",     goiCuoc: "Gói Hè Miễn Phí",  khoiLop: "Lớp 1 đến 5",  monHoc: "Kỹ năng sống",   soHocLieu: { baiGiang: 1,  baiKiemTra: 2, nganHangCauHoi: 1 }, nguoiTao: "doitac_edu",    tenDoiTac: "Đối tác B",   nguon: "doitac", lanSuaCuoi: "28/03/2026, 17:11", trangThai: "Chưa phê duyệt"  },
  { id: "nd-04", ten: "Luyện thi THPT",       goiCuoc: "Gói Cấp tốc",      khoiLop: "Lớp 12",       monHoc: "Vật lí, Hóa",    soHocLieu: { baiGiang: 1,  baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "doitac_edu",    tenDoiTac: "Đối tác B",   nguon: "doitac", lanSuaCuoi: "27/03/2026, 09:10", trangThai: "Đã phê duyệt"   },
  { id: "nd-05", ten: "AI Book Ngữ Văn",      goiCuoc: "BASIC THCS",        khoiLop: "Lớp 6, 7",     monHoc: "Ngữ văn",        soHocLieu: { baiGiang: 1,  baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "doitac_stem",   tenDoiTac: "Đối tác STEM",nguon: "doitac", lanSuaCuoi: "23/03/2026, 11:15", trangThai: "Chưa phê duyệt" },
  { id: "nd-06", ten: "AI Book Toán",         goiCuoc: "PLUS THCS",         khoiLop: "Lớp 8, 9",     monHoc: "Toán",           soHocLieu: { baiGiang: 1,  baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "doitac_stem",   tenDoiTac: "Đối tác STEM",nguon: "doitac", lanSuaCuoi: "23/03/2026, 09:57", trangThai: "Chưa phê duyệt"  },
  { id: "nd-07", ten: "Tiếng Anh Giao tiếp", goiCuoc: "Gói VIP 1 kèm 1",  khoiLop: "Lớp 1 đến 12", monHoc: "Tiếng Anh",      soHocLieu: { baiGiang: 12, baiKiemTra: 4, nganHangCauHoi: 3 }, nguoiTao: "admin",         tenDoiTac: "Admin VTS",   nguon: "admin",  lanSuaCuoi: "20/03/2026, 14:00", trangThai: "Đã phê duyệt"   },
  { id: "nd-08", ten: "STEM Robotics",        goiCuoc: "Gói Trải nghiệm",   khoiLop: "Lớp 3, 4, 5",  monHoc: "Tin học",        soHocLieu: { baiGiang: 8,  baiKiemTra: 3, nganHangCauHoi: 2 }, nguoiTao: "doitac_stem",   tenDoiTac: "Đối tác STEM",nguon: "doitac", lanSuaCuoi: "19/03/2026, 10:30", trangThai: "Chưa phê duyệt"  },
  { id: "nd-09", ten: "AI Book 2026",         goiCuoc: "BASIC THPT",        khoiLop: "Lớp 10, 11",   monHoc: "Lịch sử",        soHocLieu: { baiGiang: 6,  baiKiemTra: 2, nganHangCauHoi: 0 }, nguoiTao: "admin",         tenDoiTac: "Admin VTS",   nguon: "admin",  lanSuaCuoi: "15/03/2026, 08:45", trangThai: "Đã phê duyệt"   },
  { id: "nd-10", ten: "Ôn thi vào 10",        goiCuoc: "Gói Tổng ôn",       khoiLop: "Lớp 9",        monHoc: "Toán, Văn, Anh", soHocLieu: { baiGiang: 10, baiKiemTra: 5, nganHangCauHoi: 4 }, nguoiTao: "quantridoitac", tenDoiTac: "Đối tác A",   nguon: "doitac", lanSuaCuoi: "10/03/2026, 16:20", trangThai: "Đã phê duyệt"   },
];

const formatGia = (gia: number) => gia === 0 ? "Miễn phí" : `${gia.toLocaleString("vi-VN")}.000đ`;

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP THÊM MỚI
// ═══════════════════════════════════════════════════════════════════════════════

interface PopupFormState {
  chuongTrinhId: string; goiCuocIds: string[];
  khoiLopChon: string[]; monHocChon: string[];
  gioiThieu: string; mucTieu: string;
  anhPreview: string | null; luuVaThemTiep: boolean;
}

const POPUP_DEFAULT: PopupFormState = {
  chuongTrinhId: "", goiCuocIds: [],
  khoiLopChon: [], monHocChon: [],
  gioiThieu: "", mucTieu: "",
  anhPreview: null, luuVaThemTiep: false,
};

interface PopupThemMoiProps {
  onClose: () => void;
  onSave: (data: PopupFormState, themTiep: boolean, editId: string | null) => void;
  initialData?: PopupFormState;
  editId?: string | null;
}

function PopupThemMoi({ onClose, onSave, initialData, editId = null }: PopupThemMoiProps) {
  const [form, setForm] = useState<PopupFormState>(initialData ?? POPUP_DEFAULT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const chuongTrinhChon = MASTER_DATA.find((m) => m.id === form.chuongTrinhId);
  const goiChonList = chuongTrinhChon?.danhSachGoi.filter((g) => form.goiCuocIds.includes(g.id)) ?? [];
  const khoiLopKhaDung = [...new Set(goiChonList.flatMap((g) => g.khoiLop))];
  const monHocKhaDung  = [...new Set(goiChonList.flatMap((g) => g.monHoc))];

  const setF = (patch: Partial<PopupFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleChangeChuongTrinh = (id: string) => {
    setF({ chuongTrinhId: id, goiCuocIds: [], khoiLopChon: [], monHocChon: [] });
    setErrors({});
  };

  const toggleGoi = (id: string) => {
    const newIds = form.goiCuocIds.includes(id) ? form.goiCuocIds.filter((x) => x !== id) : [...form.goiCuocIds, id];
    const newGoiList = chuongTrinhChon?.danhSachGoi.filter((g) => newIds.includes(g.id)) ?? [];
    const newKhoi = [...new Set(newGoiList.flatMap((g) => g.khoiLop))];
    const newMon  = [...new Set(newGoiList.flatMap((g) => g.monHoc))];
    setF({ goiCuocIds: newIds, khoiLopChon: form.khoiLopChon.filter((k) => newKhoi.includes(k)), monHocChon: form.monHocChon.filter((m) => newMon.includes(m)) });
  };

  const toggleKhoi = (k: string) => setF({ khoiLopChon: form.khoiLopChon.includes(k) ? form.khoiLopChon.filter((x) => x !== k) : [...form.khoiLopChon, k] });
  const toggleMon  = (m: string) => setF({ monHocChon:  form.monHocChon.includes(m)  ? form.monHocChon.filter((x) => x !== m)  : [...form.monHocChon, m] });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setF({ anhPreview: URL.createObjectURL(file) });
  };

  const handleLuu = () => {
    const errs: Record<string, string> = {};
    if (!form.chuongTrinhId)           errs.chuongTrinh = "Vui lòng chọn chương trình học.";
    if (form.goiCuocIds.length === 0)  errs.goiCuoc     = "Vui lòng chọn ít nhất 1 gói cước.";
    if (form.khoiLopChon.length === 0) errs.khoiLop     = "Vui lòng chọn ít nhất 1 khối lớp.";
    if (form.monHocChon.length === 0)  errs.monHoc      = "Vui lòng chọn ít nhất 1 môn học.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form, form.luuVaThemTiep, editId);
  };

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #d1d5db", outline: "none", fontSize: 13,
    boxSizing: "border-box", background: "#fff", color: "#1a1a2e",
    fontFamily: "'Be Vietnam Pro', sans-serif",
  };
  const labelBase: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
  const errorStyle: React.CSSProperties = { fontSize: 11, color: "#dc2626", marginTop: 4 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 1100, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{editId ? "Chỉnh sửa Nội dung học" : "Thêm mới Nội dung học"}</h2>
            {!editId && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12, color: "#059669", fontWeight: 500 }}>
                <CheckCircle2 size={13} />Nội dung do Admin tạo sẽ được phê duyệt tự động
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", gap: 24, padding: 24 }}>

          {/* CỘT TRÁI */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

            <div>
              <label style={labelBase}>Chương trình học <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <select value={form.chuongTrinhId} onChange={(e) => handleChangeChuongTrinh(e.target.value)} style={{ ...inputBase, appearance: "none", paddingRight: 32, borderColor: errors.chuongTrinh ? "#ef4444" : "#d1d5db", color: form.chuongTrinhId ? "#1a1a2e" : "#9ca3af" }}>
                  <option value="">-- Chọn --</option>
                  {MASTER_DATA.map((m) => <option key={m.id} value={m.id}>{m.ten}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
              </div>
              {errors.chuongTrinh && <p style={errorStyle}>{errors.chuongTrinh}</p>}
            </div>

            <div>
              <label style={labelBase}>Gói cước <span style={{ color: "#ef4444" }}>*</span>{form.goiCuocIds.length > 0 && <span style={{ fontWeight: 400, color: "#005CB6", marginLeft: 8 }}>Đã chọn {form.goiCuocIds.length} gói</span>}</label>
              {!form.chuongTrinhId ? (
                <div style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db", fontSize: 13, color: "#9ca3af" }}>Chọn chương trình học trước.</div>
              ) : (
                <div style={{ borderRadius: 8, border: `1.5px solid ${errors.goiCuoc ? "#ef4444" : "#d1d5db"}`, overflow: "hidden" }}>
                  {chuongTrinhChon?.danhSachGoi.map((g, idx) => {
                    const checked = form.goiCuocIds.includes(g.id);
                    return (
                      <div key={g.id} onClick={() => { toggleGoi(g.id); setErrors((p) => ({ ...p, goiCuoc: "" })); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", background: checked ? "#eff6ff" : idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: idx < (chuongTrinhChon?.danhSachGoi.length ?? 1) - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `1.5px solid ${checked ? "#005CB6" : "#d1d5db"}`, background: checked ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {checked && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? "#005CB6" : "#1a1a2e" }}>{g.ten}</span>
                        {g.loaiGia === "free" && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", background: "#dcfce7", padding: "2px 8px", borderRadius: 20 }}>Miễn phí</span>
                        )}
                        {g.loaiGia === "dong-gia" && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#005CB6", background: "#eff6ff", padding: "2px 8px", borderRadius: 20 }}>{formatGia(g.gia)}</span>
                        )}
                        {g.loaiGia === "khac-gia" && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.08)", padding: "2px 8px", borderRadius: 20 }}>{formatGia(g.gia)} – {formatGia(g.giaTo ?? g.gia)}<span style={{ fontSize: 10, fontWeight: 400, marginLeft: 3 }}>theo khối</span></span>
                        )}
                        <div style={{ textAlign: "right", minWidth: 80 }}>
                          <div style={{ fontSize: 11, color: "#374151" }}>{g.sdStart} →</div>
                          <div style={{ fontSize: 11, color: "#374151" }}>{g.sdEnd}</div>
                          {g.tnStart && <div style={{ fontSize: 10, color: "#059669", fontWeight: 600 }}>Thử: {g.tnStart} → {g.tnEnd}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.goiCuoc && <p style={errorStyle}>{errors.goiCuoc}</p>}
            </div>

            {goiChonList.length > 0 && (
              <div style={{ borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", fontSize: 12, color: "#374151", fontWeight: 600 }}>
                  <AlertCircle size={13} color="#005CB6" />Thông tin giá & thời gian do Admin VTS cấu hình — chỉ đọc
                </div>
                <div>
                  {goiChonList.map((g, idx) => {
                    const isLast = idx === goiChonList.length - 1;

                    /* ── MIỄN PHÍ ── */
                    if (g.loaiGia === "free") return (
                      <div key={g.id} style={{ padding: "12px 14px", borderBottom: isLast ? "none" : "1px solid #d1fae5", background: "#f0fdf4" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{g.ten}</span>
                          <span style={{ background: "#dcfce7", color: "#15803d", fontWeight: 700, fontSize: 12, padding: "3px 12px", borderRadius: 20, border: "1px solid #bbf7d0" }}>Miễn phí</span>
                        </div>
                        <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: "2px 16px", fontSize: 12, color: "#374151" }}>
                          <span>📅 <strong>{g.sdStart}</strong> → <strong>{g.sdEnd}</strong></span>
                          {g.tnStart ? <span style={{ color: "#059669" }}>🎁 Dùng thử: {g.tnStart} → {g.tnEnd}</span> : <span style={{ color: "#9ca3af" }}>Không có thời gian dùng thử</span>}
                          <span>Khối lớp: {g.khoiLop.join(", ")} &nbsp;·&nbsp; Môn: {g.monHoc.join(", ")}</span>
                        </div>
                      </div>
                    );

                    /* ── KHÁC GIÁ THEO KHỐI ── */
                    if (g.loaiGia === "khac-gia") return (
                      <div key={g.id} style={{ padding: "12px 14px", borderBottom: isLast ? "none" : "1px solid #fed7aa", background: "#fff7ed" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{g.ten}</span>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, fontSize: 12, color: "#d97706" }}>{formatGia(g.gia)} – {formatGia(g.giaTo ?? g.gia)}</div>
                            <div style={{ fontSize: 10, color: "#9ca3af" }}>Dao động theo từng khối</div>
                          </div>
                        </div>
                        <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid #fed7aa" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ background: "#fde68a" }}>
                                <th style={{ padding: "5px 10px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#92400e" }}>Khối lớp</th>
                                <th style={{ padding: "5px 10px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#92400e" }}>Giá</th>
                              </tr>
                            </thead>
                            <tbody>
                              {g.khoiLop.map((k) => (
                                <tr key={k} style={{ borderTop: "1px solid #fde68a" }}>
                                  <td style={{ padding: "5px 10px", fontSize: 12, color: "#374151" }}>{k}</td>
                                  <td style={{ padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#d97706", textAlign: "right" }}>
                                    {g.giaTheoKhoi?.[k] != null ? formatGia(g.giaTheoKhoi[k]) : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: "2px 16px", fontSize: 11, color: "#78716c" }}>
                          <span>📅 <strong>{g.sdStart}</strong> → <strong>{g.sdEnd}</strong></span>
                          {g.tnStart ? <span style={{ color: "#059669" }}>🎁 Dùng thử: {g.tnStart} → {g.tnEnd}</span> : <span style={{ color: "#9ca3af" }}>Không có thời gian dùng thử</span>}
                          <span>Môn: {g.monHoc.join(", ")}</span>
                        </div>
                      </div>
                    );

                    /* ── ĐỒNG GIÁ ── */
                    return (
                      <div key={g.id} style={{ padding: "12px 14px", borderBottom: isLast ? "none" : "1px solid #bfdbfe", background: idx % 2 === 0 ? "#eff6ff" : "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{g.ten}</span>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#005CB6" }}>{formatGia(g.gia)}</span>
                        </div>
                        <div style={{ marginTop: 5, fontSize: 12, color: "#374151" }}>
                          📅 <strong>{g.sdStart}</strong> → <strong>{g.sdEnd}</strong>
                          {g.tnStart ? <>&nbsp;·&nbsp;<span style={{ color: "#059669" }}>🎁 Dùng thử: {g.tnStart} → {g.tnEnd}</span></> : <>&nbsp;·&nbsp;<span style={{ color: "#9ca3af" }}>Không có thời gian dùng thử</span></>}
                          &nbsp;·&nbsp; Khối lớp: {g.khoiLop.join(", ")} &nbsp;·&nbsp; Môn: {g.monHoc.join(", ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Khối lớp */}
            {khoiLopKhaDung.length > 0 && (
              <div>
                <label style={labelBase}>Khối lớp áp dụng <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px", borderRadius: 8, border: `1.5px solid ${errors.khoiLop ? "#ef4444" : "#d1d5db"}` }}>
                  {khoiLopKhaDung.map((k) => {
                    const sel = form.khoiLopChon.includes(k);
                    return (
                      <div key={k} onClick={() => { toggleKhoi(k); setErrors((p) => ({ ...p, khoiLop: "" })); }}
                        style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: sel ? 600 : 400, cursor: "pointer", border: `1.5px solid ${sel ? "#005CB6" : "#d1d5db"}`, background: sel ? "#005CB6" : "#fff", color: sel ? "#fff" : "#374151" }}>
                        {k}
                      </div>
                    );
                  })}
                </div>
                {errors.khoiLop && <p style={errorStyle}>{errors.khoiLop}</p>}
              </div>
            )}

            {/* Môn học */}
            {monHocKhaDung.length > 0 && (
              <div>
                <label style={labelBase}>Môn học <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px", borderRadius: 8, border: `1.5px solid ${errors.monHoc ? "#ef4444" : "#d1d5db"}` }}>
                  {monHocKhaDung.map((m) => {
                    const sel = form.monHocChon.includes(m);
                    return (
                      <div key={m} onClick={() => { toggleMon(m); setErrors((p) => ({ ...p, monHoc: "" })); }}
                        style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: sel ? 600 : 400, cursor: "pointer", border: `1.5px solid ${sel ? "#005CB6" : "#d1d5db"}`, background: sel ? "#005CB6" : "#fff", color: sel ? "#fff" : "#374151" }}>
                        {m}
                      </div>
                    );
                  })}
                </div>
                {errors.monHoc && <p style={errorStyle}>{errors.monHoc}</p>}
              </div>
            )}
          </div>

          {/* CỘT PHẢI */}
          <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Giới thiệu */}
            <div>
              <label style={labelBase}>Giới thiệu nội dung</label>
              <textarea value={form.gioiThieu} onChange={(e) => setF({ gioiThieu: e.target.value })} rows={4}
                style={{ ...inputBase, resize: "vertical" }} placeholder="Mô tả ngắn về nội dung học..." />
            </div>

            {/* Mục tiêu */}
            <div>
              <label style={labelBase}>Mục tiêu học tập</label>
              <textarea value={form.mucTieu} onChange={(e) => setF({ mucTieu: e.target.value })} rows={4}
                style={{ ...inputBase, resize: "vertical" }} placeholder="Học sinh đạt được gì sau khi hoàn thành..." />
            </div>

            {/* Ảnh */}
            <div>
              <label style={labelBase}>Ảnh đại diện</label>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
              {form.anhPreview ? (
                <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  <img src={form.anhPreview} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                  <button onClick={() => setF({ anhPreview: null })} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()} style={{ height: 100, borderRadius: 8, border: "2px dashed #d1d5db", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", color: "#9ca3af" }}>
                  <Image size={22} />
                  <span style={{ fontSize: 12 }}>Nhấn để tải ảnh lên</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #e5e7eb" }}>
          {!editId && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
              <div onClick={() => setF({ luuVaThemTiep: !form.luuVaThemTiep })} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${form.luuVaThemTiep ? "#005CB6" : "#d1d5db"}`, background: form.luuVaThemTiep ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {form.luuVaThemTiep && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              Lưu và thêm tiếp
            </label>
          )}
          {editId && <div />}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}>Hủy bỏ</button>
            <button onClick={handleLuu} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 28px", borderRadius: 8, border: "none", background: "#005CB6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <Check size={15} />{editId ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANG CHÍNH — ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

const DS_KHOI_LOP = ["Khối 1","Khối 2","Khối 3","Khối 4","Khối 5","Khối 6","Khối 7","Khối 8","Khối 9","Khối 10","Khối 11","Khối 12"];
const DS_MON_HOC  = ["Toán","Tiếng Việt","Tiếng Anh","Đạo đức","Vật lí","Hóa học","Sinh học","Lịch sử","Địa lý","Tin học","Kỹ năng sống","Ngữ văn"];

const TRANG_THAI_CFG: Record<TrangThaiND, { bg: string; color: string; border: string }> = {
  "Chưa phê duyệt": { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "Đã phê duyệt":   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
};

export default function AdminNoiDungPage() {
  const [danhSach, setDanhSach] = useState<NoiDungHoc[]>(SAMPLE_TABLE);
  const [filterKhoi,      setFilterKhoi]      = useState("");
  const [filterMon,       setFilterMon]       = useState("");
  const [filterTen,       setFilterTen]       = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState<TrangThaiND | "">("");
  const [filterDoiTac,    setFilterDoiTac]    = useState("");
  const [selected,   setSelected]   = useState<string[]>([]);
  const [showPopup,  setShowPopup]  = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [confirmId,  setConfirmId]  = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const dsHienThi = danhSach.filter((ct) => {
    const matchKhoi      = !filterKhoi      || ct.khoiLop.includes(filterKhoi);
    const matchMon       = !filterMon       || ct.monHoc.includes(filterMon);
    const matchTen       = !filterTen       || ct.ten.toLowerCase().includes(filterTen.toLowerCase());
    const matchTrangThai = !filterTrangThai || ct.trangThai === filterTrangThai;
    const matchDoiTac    = !filterDoiTac    || ct.nguoiTao === filterDoiTac;
    return matchKhoi && matchMon && matchTen && matchTrangThai && matchDoiTac;
  });

  const coPheNhap = danhSach.filter((c) => c.trangThai === "Chưa phê duyệt" && c.nguon === "doitac").length;

  const toggleAll = () => setSelected(selected.length === dsHienThi.length ? [] : dsHienThi.map((c) => c.id));
  const toggleOne = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSave = (data: PopupFormState, themTiep: boolean, currentEditId: string | null) => {
    const now = new Date();
    const thoiGian = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()}, ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    const ct = MASTER_DATA.find((m) => m.id === data.chuongTrinhId);
    const goiTen = ct?.danhSachGoi.filter((g) => data.goiCuocIds.includes(g.id)).map((g) => g.ten).join(", ") ?? "";
    const tenTuDong = ct?.ten ?? "";

    if (currentEditId) {
      setDanhSach((prev) => prev.map((item) =>
        item.id === currentEditId
          ? { ...item, ten: tenTuDong, goiCuoc: goiTen, khoiLop: data.khoiLopChon.join(", "), monHoc: data.monHocChon.join(", "), lanSuaCuoi: thoiGian }
          : item
      ));
      showToast(`Đã cập nhật "${tenTuDong}".`);
      setShowPopup(false); setEditId(null);
    } else {
      setDanhSach((prev) => [{
        id: `nd-${Date.now()}`,
        ten: tenTuDong, goiCuoc: goiTen,
        khoiLop: data.khoiLopChon.join(", "),
        monHoc: data.monHocChon.join(", "),
        soHocLieu: { baiGiang: 0, baiKiemTra: 0, nganHangCauHoi: 0 },
        nguoiTao: "admin", tenDoiTac: "Admin VTS", nguon: "admin",
        lanSuaCuoi: thoiGian,
        trangThai: "Đã phê duyệt", // Auto-approved for admin
      }, ...prev]);
      showToast(`Thêm "${tenTuDong}" thành công (đã phê duyệt tự động).`);
      if (!themTiep) setShowPopup(false);
    }
  };

  const handleXoa = () => {
    if (deleteId) {
      setDanhSach((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      showToast("Đã xóa nội dung học.");
    }
  };

  const handlePheDuyet = (id: string) => {
    setDanhSach((prev) => prev.map((item) =>
      item.id === id ? { ...item, trangThai: "Đã phê duyệt" } : item
    ));
    setConfirmId(null);
    showToast("Đã phê duyệt nội dung. Học sinh có thể xem nội dung này.");
  };

  const handleTuChoi = (id: string) => {
    setDanhSach((prev) => prev.map((item) =>
      item.id === id ? { ...item, trangThai: "Chưa phê duyệt" } : item
    ));
    setConfirmId(null);
    showToast("Đã từ chối nội dung. Đối tác sẽ cần chỉnh sửa lại.", "error");
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f5f6fa", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 10, background: toast.type === "success" ? "#ecfdf5" : "#fef2f2", border: `1px solid ${toast.type === "success" ? "#6ee7b7" : "#fca5a5"}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", color: toast.type === "success" ? "#065f46" : "#991b1b", fontSize: 13, fontWeight: 500 }}>
          {toast.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
          <Home size={13} /><span>Trang chủ</span><ChevronRight size={13} />
          <span>Nội dung</span><ChevronRight size={13} />
          <span style={{ color: "#1a1a2e", fontWeight: 600 }}>Quản lý & Phê duyệt Nội dung</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Quản lý & Phê duyệt Nội dung</h1>
          {coPheNhap > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa", fontSize: 13, color: "#c2410c", fontWeight: 500 }}>
              <AlertCircle size={15} />
              <strong>{coPheNhap}</strong> nội dung từ đối tác chờ phê duyệt
            </div>
          )}
        </div>

        <>
          {/* Thanh bộ lọc */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <SelFilterObj value={filterDoiTac} onChange={setFilterDoiTac} options={DANH_SACH_DOI_TAC} placeholder="-- Lọc theo đối tác --" />
            <SelFilter value={filterTrangThai} onChange={(v) => setFilterTrangThai(v as TrangThaiND | "")} options={["Chưa phê duyệt","Đã phê duyệt"]} placeholder="-- Trạng thái --" />
            <SelFilter value={filterKhoi}      onChange={setFilterKhoi}      options={DS_KHOI_LOP}        placeholder="-- Khối lớp --" />
            <SelFilter value={filterMon}       onChange={setFilterMon}       options={DS_MON_HOC}         placeholder="-- Môn học --" />
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", minWidth: 220 }}>
              <Search size={13} color="#9ca3af" />
              <input value={filterTen} onChange={(e) => setFilterTen(e.target.value)} placeholder="Tên nội dung học" style={{ border: "none", outline: "none", fontSize: 13, background: "transparent", flex: 1, fontFamily: "'Be Vietnam Pro', sans-serif" }} />
              {filterTen && <X size={12} color="#9ca3af" style={{ cursor: "pointer" }} onClick={() => setFilterTen("")} />}
            </div>
            <div style={{ flex: 1 }} />
            <button onClick={() => { setFilterKhoi(""); setFilterMon(""); setFilterTen(""); setFilterTrangThai(""); setFilterDoiTac(""); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <RefreshCw size={13} />Tải lại
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <ArrowUpDown size={13} />Sắp xếp theo<ChevronDown size={12} />
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #005CB6", background: "#fff", fontSize: 13, color: "#005CB6", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <Upload size={13} />Import Json
            </button>
            <button onClick={() => setShowPopup(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#005CB6", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <Plus size={14} />Thêm mới
            </button>
          </div>

          {/* Bảng */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ width: 40, padding: "12px 14px" }}>
                    <div onClick={toggleAll} style={{ width: 16, height: 16, borderRadius: 4, cursor: "pointer", border: `1.5px solid ${selected.length === dsHienThi.length && dsHienThi.length > 0 ? "#005CB6" : "#d1d5db"}`, background: selected.length === dsHienThi.length && dsHienThi.length > 0 ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selected.length === dsHienThi.length && dsHienThi.length > 0 && <Check size={10} color="#fff" strokeWidth={3} />}
                    </div>
                  </th>
                  {["STT","Tên nội dung học","Gói cước","Số học liệu","Trạng thái","Đối tác","Lần sửa cuối","Hành động"].map((h, i) => (
                    <th key={i} style={{ padding: "12px 14px", textAlign: "left" as const, fontSize: 13, fontWeight: 600, color: "#374151", ...(i === 0 ? { width: 50, textAlign: "center" as const } : {}), ...(i === 7 ? { width: 160, textAlign: "center" as const } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dsHienThi.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Không tìm thấy nội dung học nào</td></tr>
                ) : (
                  dsHienThi.map((ct, idx) => {
                    const isSelected = selected.includes(ct.id);
                    const s = TRANG_THAI_CFG[ct.trangThai];
                    const canApprove = ct.trangThai === "Chưa phê duyệt" && ct.nguon === "doitac";
                    return (
                      <tr key={ct.id} style={{ borderBottom: "1px solid #f3f4f6", background: isSelected ? "rgba(0,92,182,0.03)" : canApprove ? "rgba(249,115,22,0.04)" : "transparent" }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = canApprove ? "rgba(249,115,22,0.07)" : "#f9fafb"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(0,92,182,0.03)" : canApprove ? "rgba(249,115,22,0.04)" : "transparent"; }}>

                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <div onClick={() => toggleOne(ct.id)} style={{ width: 16, height: 16, borderRadius: 4, cursor: "pointer", border: `1.5px solid ${isSelected ? "#005CB6" : "#d1d5db"}`, background: isSelected ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                            {isSelected && <Check size={10} color="#fff" strokeWidth={3} />}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 13, color: "#6b7280" }}>{idx + 1}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>{ct.ten}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>Khối lớp: <span style={{ color: "#374151" }}>{ct.khoiLop}</span></div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>Môn học: <span style={{ color: "#374151" }}>{ct.monHoc}</span></div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          {ct.goiCuoc.split(", ").map((g) => (
                            <span key={g} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, background: "#eff6ff", color: "#005CB6", fontSize: 12, fontWeight: 600, marginRight: 4, marginBottom: 4 }}>{g}</span>
                          ))}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                            {ct.soHocLieu.baiGiang > 0       && <div>Bài giảng: <strong>{ct.soHocLieu.baiGiang}</strong></div>}
                            {ct.soHocLieu.baiKiemTra > 0     && <div>Bài kiểm tra: <strong>{ct.soHocLieu.baiKiemTra}</strong></div>}
                            {ct.soHocLieu.nganHangCauHoi > 0 && <div>Ngân hàng: <strong>{ct.soHocLieu.nganHangCauHoi}</strong></div>}
                            {ct.soHocLieu.baiGiang === 0 && ct.soHocLieu.baiKiemTra === 0 && ct.soHocLieu.nganHangCauHoi === 0 && <span style={{ color: "#9ca3af" }}>Chưa có học liệu</span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
                            {ct.trangThai}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{ct.tenDoiTac}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{ct.nguoiTao}</div>
                          {ct.nguon === "admin" && (
                            <span style={{ display: "inline-block", marginTop: 2, padding: "1px 7px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#eff6ff", color: "#005CB6", border: "1px solid #bfdbfe" }}>Admin</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280" }}>{ct.lanSuaCuoi}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            {/* Phê duyệt & Từ chối — chỉ hiện với nội dung đối tác Chưa phê duyệt */}
                            {canApprove && (
                              <>
                                <ActionBtn icon={<CheckCircle2 size={14} />} title="Phê duyệt" color="#059669"
                                  onClick={() => setConfirmId({ id: ct.id, action: "approve" })} />
                                <ActionBtn icon={<XCircle size={14} />} title="Từ chối" color="#ef4444"
                                  onClick={() => setConfirmId({ id: ct.id, action: "reject" })} />
                              </>
                            )}
                            <ActionBtn icon={<Pencil size={14} />} title="Sửa" color="#005CB6" onClick={() => { setEditId(ct.id); setShowPopup(true); }} />
                            <ActionBtn icon={<Trash2 size={14} />} title="Xóa" color="#ef4444" onClick={() => setDeleteId(ct.id)} />
                            <ActionBtn icon={<Copy size={14} />} title="Sao chép" color="#6b7280" onClick={() => showToast("Đã sao chép nội dung học.")} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Hiển thị <strong>{dsHienThi.length}</strong> / {danhSach.length} nội dung học
                {selected.length > 0 && <span style={{ marginLeft: 12, color: "#005CB6" }}>· Đã chọn {selected.length}</span>}
              </span>
            </div>
          </div>
        </>
      </div>

      {/* Popup thêm mới / chỉnh sửa */}
      {showPopup && (
        <PopupThemMoi
          onClose={() => { setShowPopup(false); setEditId(null); }}
          onSave={handleSave}
          editId={editId}
          initialData={editId ? (() => {
            const item = danhSach.find((x) => x.id === editId);
            if (!item) return undefined;
            const ct = MASTER_DATA.find((m) => m.ten === item.ten);
            const goiIds = ct?.danhSachGoi.filter((g) => item.goiCuoc.includes(g.ten)).map((g) => g.id) ?? [];
            return { ...POPUP_DEFAULT, chuongTrinhId: ct?.id ?? "", goiCuocIds: goiIds, khoiLopChon: item.khoiLop.split(",").map((s) => s.trim()).filter(Boolean), monHocChon: item.monHoc.split(",").map((s) => s.trim()).filter(Boolean) };
          })() : undefined}
        />
      )}

      {/* Dialog xóa */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDeleteId(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#1a1a2e" }}>Xác nhận xóa</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 22px" }}>
              Bạn có chắc chắn muốn xóa <strong>"{danhSach.find((c) => c.id === deleteId)?.ten}"</strong>?<br />Thao tác này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy bỏ</button>
              <button onClick={handleXoa} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog phê duyệt / từ chối */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setConfirmId(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", textAlign: "center" }}>
            {confirmId.action === "approve" ? (
              <>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <CheckCircle2 size={28} color="#059669" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#1a1a2e" }}>Xác nhận Phê duyệt</h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px" }}>
                  Phê duyệt nội dung <strong>"{danhSach.find((c) => c.id === confirmId.id)?.ten}"</strong>?
                </p>
                <p style={{ fontSize: 13, color: "#059669", margin: "0 0 22px" }}>Học sinh sẽ có thể xem nội dung này sau khi phê duyệt.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button onClick={() => setConfirmId(null)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
                  <button onClick={() => handlePheDuyet(confirmId.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <CheckCircle2 size={15} />Phê duyệt
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <XCircle size={28} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#1a1a2e" }}>Xác nhận Từ chối</h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px" }}>
                  Từ chối nội dung <strong>"{danhSach.find((c) => c.id === confirmId.id)?.ten}"</strong>?
                </p>
                <p style={{ fontSize: 13, color: "#ef4444", margin: "0 0 22px" }}>Đối tác sẽ cần chỉnh sửa và gửi lại yêu cầu phê duyệt.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button onClick={() => setConfirmId(null)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
                  <button onClick={() => handleTuChoi(confirmId.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    <XCircle size={15} />Từ chối
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function ActionBtn({ icon, title, color, onClick }: { icon: React.ReactNode; title: string; color: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", color, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}15`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}>
      {icon}
    </button>
  );
}

function SelFilter({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ appearance: "none", padding: "8px 28px 8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: value ? "#1a1a2e" : "#9ca3af", cursor: "pointer", outline: "none", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
    </div>
  );
}

function SelFilterObj({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder: string }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ appearance: "none", padding: "8px 28px 8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: value ? "#1a1a2e" : "#9ca3af", cursor: "pointer", outline: "none", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
    </div>
  );
}
