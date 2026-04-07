import { useState, useRef } from "react";
import {
  Plus, RefreshCw, ArrowUpDown, Upload, Pencil, Trash2,
  Share2, Copy, Search, ChevronDown, AlertCircle, Check,
  X, AlertTriangle, Home, ChevronRight, HelpCircle, Image,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// KIỂU DỮ LIỆU
// ═══════════════════════════════════════════════════════════════════════════════

interface SoHocLieu {
  baiGiang: number;
  baiKiemTra: number;
  nganHangCauHoi: number;
}

interface NoiDungHoc {
  id: string;
  ten: string;
  goiCuoc: string;
  khoiLop: string;
  monHoc: string;
  soHocLieu: SoHocLieu;
  nguoiTao: string;
  lanSuaCuoi: string;
}

// ── DATA MASTER: Chương trình → Gói cước ──────────────────────────────────────

interface GoiCuocInfo {
  id: string;
  ten: string;
  gia: number;         // nghìn đồng
  thoiLuong: string;   // "12 tháng"
  khoiLop: string[];
  monHoc: string[];
}

interface ChuongTrinhMaster {
  id: string;
  ten: string;
  danhSachGoi: GoiCuocInfo[];
}

const MASTER_DATA: ChuongTrinhMaster[] = [
  {
    id: "m01", ten: "AI Book 2026",
    danhSachGoi: [
      { id: "g01", ten: "BASIC Tiểu học",  gia: 200,   thoiLuong: "12 tháng", khoiLop: ["Lớp 1","Lớp 2"],         monHoc: ["Toán"] },
      { id: "g02", ten: "PLUS Tiểu học",   gia: 500,   thoiLuong: "12 tháng", khoiLop: ["Lớp 3","Lớp 4"],         monHoc: ["Tiếng Anh"] },
      { id: "g09", ten: "BASIC THPT",      gia: 400,   thoiLuong: "12 tháng", khoiLop: ["Lớp 10","Lớp 11"],       monHoc: ["Lịch sử"] },
    ],
  },
  {
    id: "m02", ten: "Kỹ năng sống Pro",
    danhSachGoi: [
      { id: "g03", ten: "Gói Hè Miễn Phí", gia: 0,    thoiLuong: "3 tháng",  khoiLop: ["Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5"], monHoc: ["Kỹ năng sống"] },
    ],
  },
  {
    id: "m03", ten: "Luyện thi THPT",
    danhSachGoi: [
      { id: "g04", ten: "Gói Cấp tốc",    gia: 1000,  thoiLuong: "6 tháng",  khoiLop: ["Lớp 12"],                monHoc: ["Vật lí","Hóa học"] },
    ],
  },
  {
    id: "m04", ten: "AI Book Ngữ Văn",
    danhSachGoi: [
      { id: "g05", ten: "BASIC THCS",     gia: 300,   thoiLuong: "12 tháng", khoiLop: ["Lớp 6","Lớp 7"],         monHoc: ["Ngữ văn"] },
    ],
  },
  {
    id: "m05", ten: "AI Book Toán",
    danhSachGoi: [
      { id: "g06", ten: "PLUS THCS",      gia: 600,   thoiLuong: "12 tháng", khoiLop: ["Lớp 8","Lớp 9"],         monHoc: ["Toán"] },
    ],
  },
  {
    id: "m06", ten: "Tiếng Anh Giao tiếp",
    danhSachGoi: [
      { id: "g07", ten: "Gói VIP 1 kèm 1", gia: 2000, thoiLuong: "12 tháng", khoiLop: ["Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5","Lớp 6","Lớp 7","Lớp 8","Lớp 9","Lớp 10","Lớp 11","Lớp 12"], monHoc: ["Tiếng Anh"] },
    ],
  },
  {
    id: "m07", ten: "STEM Robotics",
    danhSachGoi: [
      { id: "g08", ten: "Gói Trải nghiệm", gia: 50,   thoiLuong: "1 tháng",  khoiLop: ["Lớp 3","Lớp 4","Lớp 5"], monHoc: ["Tin học"] },
    ],
  },
  {
    id: "m08", ten: "Ôn thi vào 10",
    danhSachGoi: [
      { id: "g10", ten: "Gói Tổng ôn",    gia: 800,   thoiLuong: "6 tháng",  khoiLop: ["Lớp 9"],                 monHoc: ["Toán","Ngữ văn","Tiếng Anh"] },
    ],
  },
];


// ── DỮ LIỆU BẢNG ──────────────────────────────────────────────────────────────

const SAMPLE_TABLE: NoiDungHoc[] = [
  { id: "nd-01", ten: "AI Book 2026",           goiCuoc: "BASIC Tiểu học",    khoiLop: "Lớp 1, 2",    monHoc: "Toán",           soHocLieu: { baiGiang: 1, baiKiemTra: 2, nganHangCauHoi: 0 }, nguoiTao: "quantridoitac", lanSuaCuoi: "28/03/2026, 17:10" },
  { id: "nd-02", ten: "AI Book 2026",           goiCuoc: "PLUS Tiểu học",     khoiLop: "Lớp 3, 4",    monHoc: "Tiếng Anh",      soHocLieu: { baiGiang: 1, baiKiemTra: 1, nganHangCauHoi: 0 }, nguoiTao: "quantridoitac", lanSuaCuoi: "27/03/2026, 16:13" },
  { id: "nd-03", ten: "Kỹ năng sống Pro",       goiCuoc: "Gói Hè Miễn Phí",  khoiLop: "Lớp 1 đến 5", monHoc: "Kỹ năng sống",   soHocLieu: { baiGiang: 1, baiKiemTra: 2, nganHangCauHoi: 1 }, nguoiTao: "quantridoitac", lanSuaCuoi: "28/03/2026, 17:11" },
  { id: "nd-04", ten: "Luyện thi THPT",         goiCuoc: "Gói Cấp tốc",       khoiLop: "Lớp 12",      monHoc: "Vật lí, Hóa",    soHocLieu: { baiGiang: 1, baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "quantridoitac", lanSuaCuoi: "27/03/2026, 09:10" },
  { id: "nd-05", ten: "AI Book Ngữ Văn",        goiCuoc: "BASIC THCS",        khoiLop: "Lớp 6, 7",    monHoc: "Ngữ văn",        soHocLieu: { baiGiang: 1, baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "quantridoitac", lanSuaCuoi: "23/03/2026, 11:15" },
  { id: "nd-06", ten: "AI Book Toán",           goiCuoc: "PLUS THCS",         khoiLop: "Lớp 8, 9",    monHoc: "Toán",           soHocLieu: { baiGiang: 1, baiKiemTra: 1, nganHangCauHoi: 1 }, nguoiTao: "quantridoitac", lanSuaCuoi: "23/03/2026, 09:57" },
  { id: "nd-07", ten: "Tiếng Anh Giao tiếp",   goiCuoc: "Gói VIP 1 kèm 1",  khoiLop: "Lớp 1 đến 12", monHoc: "Tiếng Anh",     soHocLieu: { baiGiang: 12, baiKiemTra: 4, nganHangCauHoi: 3 }, nguoiTao: "quantridoitac", lanSuaCuoi: "20/03/2026, 14:00" },
  { id: "nd-08", ten: "STEM Robotics",          goiCuoc: "Gói Trải nghiệm",   khoiLop: "Lớp 3, 4, 5", monHoc: "Tin học",        soHocLieu: { baiGiang: 8, baiKiemTra: 3, nganHangCauHoi: 2 }, nguoiTao: "quantridoitac", lanSuaCuoi: "19/03/2026, 10:30" },
  { id: "nd-09", ten: "AI Book 2026",           goiCuoc: "BASIC THPT",        khoiLop: "Lớp 10, 11",  monHoc: "Lịch sử",        soHocLieu: { baiGiang: 6, baiKiemTra: 2, nganHangCauHoi: 0 }, nguoiTao: "quantridoitac", lanSuaCuoi: "15/03/2026, 08:45" },
  { id: "nd-10", ten: "Ôn thi vào 10",         goiCuoc: "Gói Tổng ôn",       khoiLop: "Lớp 9",       monHoc: "Toán, Văn, Anh", soHocLieu: { baiGiang: 10, baiKiemTra: 5, nganHangCauHoi: 4 }, nguoiTao: "quantridoitac", lanSuaCuoi: "10/03/2026, 16:20" },
];

// ── Định dạng giá ─────────────────────────────────────────────────────────────
const formatGia = (gia: number) => {
  if (gia === 0) return "Miễn phí";
  return `${gia.toLocaleString("vi-VN")}.000đ`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP THÊM MỚI NỘI DUNG HỌC
// ═══════════════════════════════════════════════════════════════════════════════

interface DonViApDung {
  id: string;
  tinhThanh: string;
  capHoc: string;
  truong: string;
}

interface PopupFormState {
  chuongTrinhId: string;
  goiCuocIds: string[];
  thuTu: boolean;
  khoiLopChon: string[];
  monHocChon: string[];
  gioiThieu: string;
  mucTieu: string;
  anhPreview: string | null;
  loaiDonVi: "chon" | "nhap-ma";
  danhSachDonVi: DonViApDung[];
  maTruongNhap: string;
  luuVaThemTiep: boolean;
}

const POPUP_DEFAULT: PopupFormState = {
  chuongTrinhId: "",
  goiCuocIds: [],
  thuTu: false,
  khoiLopChon: [],
  monHocChon: [],
  gioiThieu: "",
  mucTieu: "",
  anhPreview: null,
  loaiDonVi: "chon",
  danhSachDonVi: [{ id: "dv-1", tinhThanh: "", capHoc: "", truong: "" }],
  maTruongNhap: "",
  luuVaThemTiep: false,
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
  // Danh sách gói đã chọn
  const goiChonList = chuongTrinhChon?.danhSachGoi.filter((g) => form.goiCuocIds.includes(g.id)) ?? [];
  // Hợp khối lớp & môn học từ tất cả gói đã chọn
  const khoiLopKhaDung = [...new Set(goiChonList.flatMap((g) => g.khoiLop))];
  const monHocKhaDung  = [...new Set(goiChonList.flatMap((g) => g.monHoc))];

  const setF = (patch: Partial<PopupFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  // Khi đổi chương trình → reset gói, khối, môn
  const handleChangeChuongTrinh = (id: string) => {
    setF({ chuongTrinhId: id, goiCuocIds: [], khoiLopChon: [], monHocChon: [] });
    setErrors({});
  };

  // Toggle chọn/bỏ gói cước → reset khối+môn đã chọn nếu không còn khả dụng
  const toggleGoi = (id: string) => {
    const newIds = form.goiCuocIds.includes(id)
      ? form.goiCuocIds.filter((x) => x !== id)
      : [...form.goiCuocIds, id];
    const newGoiList = chuongTrinhChon?.danhSachGoi.filter((g) => newIds.includes(g.id)) ?? [];
    const newKhoi = [...new Set(newGoiList.flatMap((g) => g.khoiLop))];
    const newMon  = [...new Set(newGoiList.flatMap((g) => g.monHoc))];
    setF({
      goiCuocIds: newIds,
      khoiLopChon: form.khoiLopChon.filter((k) => newKhoi.includes(k)),
      monHocChon:  form.monHocChon.filter((m) => newMon.includes(m)),
    });
  };

  // Toggle multi-select
  const toggleKhoi = (k: string) =>
    setF({ khoiLopChon: form.khoiLopChon.includes(k) ? form.khoiLopChon.filter((x) => x !== k) : [...form.khoiLopChon, k] });
  const toggleMon = (m: string) =>
    setF({ monHocChon: form.monHocChon.includes(m) ? form.monHocChon.filter((x) => x !== m) : [...form.monHocChon, m] });

  // Ảnh
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setF({ anhPreview: url });
  };

  // Validate & Lưu
  const handleLuu = () => {
    const errs: Record<string, string> = {};
    if (!form.chuongTrinhId)          errs.chuongTrinh = "Vui lòng chọn chương trình học.";
    if (form.goiCuocIds.length === 0) errs.goiCuoc    = "Vui lòng chọn ít nhất 1 gói cước.";
    if (form.khoiLopChon.length === 0) errs.khoiLop = "Vui lòng chọn ít nhất 1 khối lớp.";
    if (form.monHocChon.length === 0)  errs.monHoc  = "Vui lòng chọn ít nhất 1 môn học.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form, form.luuVaThemTiep, editId);
  };

  // ── Styles dùng lại ─────────────────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #d1d5db", outline: "none", fontSize: 13,
    boxSizing: "border-box", background: "#fff", color: "#1a1a2e",
    fontFamily: "'Be Vietnam Pro', sans-serif", transition: "border-color 0.15s",
  };
  const labelBase: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6,
  };
  const errorStyle: React.CSSProperties = {
    fontSize: 11, color: "#dc2626", marginTop: 4,
  };
  const readonlyStyle: React.CSSProperties = {
    ...inputBase, background: "#f3f4f6", color: "#6b7280", cursor: "not-allowed",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 1100, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}
      >
        {/* ── Header popup ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
            {editId ? "Chỉnh sửa Nội dung học" : "Thêm mới Nội dung học"}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#6b7280" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 24, padding: 24, flex: 1 }}>

          {/* ════ CỘT TRÁI ════ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Chương trình học */}
            <div>
              <label style={labelBase}>Chương trình học <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <select
                  value={form.chuongTrinhId}
                  onChange={(e) => handleChangeChuongTrinh(e.target.value)}
                  style={{ ...inputBase, appearance: "none", paddingRight: 32, borderColor: errors.chuongTrinh ? "#ef4444" : "#d1d5db", color: form.chuongTrinhId ? "#1a1a2e" : "#9ca3af" }}
                >
                  <option value="">-- Chọn --</option>
                  {MASTER_DATA.map((m) => <option key={m.id} value={m.id}>{m.ten}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
              </div>
              {errors.chuongTrinh && <p style={errorStyle}>{errors.chuongTrinh}</p>}
            </div>

            {/* Gói cước – multi-select checkbox */}
            <div>
              <label style={labelBase}>
                Gói cước <span style={{ color: "#ef4444" }}>*</span>
                {form.goiCuocIds.length > 0 && (
                  <span style={{ fontWeight: 400, color: "#005CB6", marginLeft: 8 }}>
                    Đã chọn {form.goiCuocIds.length} gói
                  </span>
                )}
              </label>
              {!form.chuongTrinhId ? (
                <div style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db", fontSize: 13, color: "#9ca3af" }}>
                  Chọn chương trình học trước.
                </div>
              ) : (
                <div style={{ borderRadius: 8, border: `1.5px solid ${errors.goiCuoc ? "#ef4444" : "#d1d5db"}`, overflow: "hidden" }}>
                  {chuongTrinhChon?.danhSachGoi.map((g, idx) => {
                    const checked = form.goiCuocIds.includes(g.id);
                    return (
                      <div
                        key={g.id}
                        onClick={() => { toggleGoi(g.id); setErrors((p) => ({ ...p, goiCuoc: "" })); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                          cursor: "pointer", transition: "background 0.15s",
                          background: checked ? "#eff6ff" : idx % 2 === 0 ? "#fff" : "#fafafa",
                          borderBottom: idx < (chuongTrinhChon?.danhSachGoi.length ?? 1) - 1 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `1.5px solid ${checked ? "#005CB6" : "#d1d5db"}`, background: checked ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {checked && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        {/* Tên gói */}
                        <span style={{ flex: 1, fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? "#005CB6" : "#1a1a2e" }}>{g.ten}</span>
                        {/* Giá */}
                        <span style={{ fontSize: 12, fontWeight: 600, color: g.gia === 0 ? "#059669" : "#005CB6", background: g.gia === 0 ? "#ecfdf5" : "#eff6ff", padding: "2px 8px", borderRadius: 20 }}>
                          {formatGia(g.gia)}
                        </span>
                        {/* Thời lượng */}
                        <span style={{ fontSize: 12, color: "#6b7280", minWidth: 64, textAlign: "right" }}>{g.thoiLuong}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.goiCuoc && <p style={errorStyle}>{errors.goiCuoc}</p>}
            </div>

            {/* Bảng tổng hợp gói đã chọn (auto-fill, read-only) */}
            {goiChonList.length > 0 && (
              <div style={{ borderRadius: 8, border: "1px solid #bfdbfe", overflow: "hidden", background: "#eff6ff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderBottom: "1px solid #bfdbfe", fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>
                  <AlertCircle size={13} />
                  Thông tin giá & thời gian do Admin VTS cấu hình — chỉ đọc
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(0,92,182,0.06)" }}>
                      {["Gói cước","Giá tiền","Thời gian sử dụng","Khối lớp","Môn học"].map((h) => (
                        <th key={h} style={{ padding: "6px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#374151" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {goiChonList.map((g) => (
                      <tr key={g.id} style={{ borderTop: "1px solid #dbeafe" }}>
                        <td style={{ padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{g.ten}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, color: g.gia === 0 ? "#059669" : "#005CB6", fontWeight: 600 }}>{formatGia(g.gia)}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, color: "#374151" }}>{g.thoiLuong}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, color: "#374151" }}>{g.khoiLop.join(", ")}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, color: "#374151" }}>{g.monHoc.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Khối lớp (multi-select chips) */}
            <div>
              <label style={labelBase}>
                Khối lớp <span style={{ color: "#ef4444" }}>*</span>
                {khoiLopKhaDung.length > 0 && (
                  <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 6 }}>({khoiLopKhaDung.length} khối từ {goiChonList.length} gói đã chọn)</span>
                )}
              </label>
              {form.goiCuocIds.length === 0 ? (
                <div style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db", fontSize: 13, color: "#9ca3af" }}>
                  Chọn ít nhất 1 gói cước để xem danh sách khối lớp khả dụng.
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${errors.khoiLop ? "#ef4444" : "#d1d5db"}`, minHeight: 46, background: "#fff" }}>
                  {khoiLopKhaDung.map((k) => {
                    const active = form.khoiLopChon.includes(k);
                    return (
                      <button key={k} type="button" onClick={() => { toggleKhoi(k); setErrors((p) => ({ ...p, khoiLop: "" })); }} style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        border: `1.5px solid ${active ? "#005CB6" : "#d1d5db"}`,
                        background: active ? "#005CB6" : "#fff",
                        color: active ? "#fff" : "#374151",
                        fontFamily: "'Be Vietnam Pro', sans-serif", transition: "all 0.15s",
                      }}>{k}</button>
                    );
                  })}
                </div>
              )}
              {errors.khoiLop && <p style={errorStyle}>{errors.khoiLop}</p>}
              {form.khoiLopChon.length > 0 && (
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Đã chọn: {form.khoiLopChon.join(", ")}</p>
              )}
            </div>

            {/* Môn học (multi-select chips) */}
            <div>
              <label style={labelBase}>
                Môn học <span style={{ color: "#ef4444" }}>*</span>
                {monHocKhaDung.length > 0 && (
                  <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 6 }}>({monHocKhaDung.length} môn từ {goiChonList.length} gói đã chọn)</span>
                )}
              </label>
              {form.goiCuocIds.length === 0 ? (
                <div style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db", fontSize: 13, color: "#9ca3af" }}>
                  Chọn ít nhất 1 gói cước để xem danh sách môn học khả dụng.
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${errors.monHoc ? "#ef4444" : "#d1d5db"}`, minHeight: 46, background: "#fff" }}>
                  {monHocKhaDung.map((m) => {
                    const active = form.monHocChon.includes(m);
                    return (
                      <button key={m} type="button" onClick={() => { toggleMon(m); setErrors((p) => ({ ...p, monHoc: "" })); }} style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        border: `1.5px solid ${active ? "#005CB6" : "#d1d5db"}`,
                        background: active ? "#005CB6" : "#fff",
                        color: active ? "#fff" : "#374151",
                        fontFamily: "'Be Vietnam Pro', sans-serif", transition: "all 0.15s",
                      }}>{m}</button>
                    );
                  })}
                </div>
              )}
              {errors.monHoc && <p style={errorStyle}>{errors.monHoc}</p>}
              {form.monHocChon.length > 0 && (
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Đã chọn: {form.monHocChon.join(", ")}</p>
              )}
            </div>

          </div>

          {/* ════ CỘT PHẢI ════ */}
          <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Ảnh đại diện */}
            <div>
              <label style={labelBase}>Ảnh</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%", aspectRatio: "4/3", borderRadius: 10,
                  border: "2px dashed #d1d5db", background: "#f9fafb",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", overflow: "hidden", transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#005CB6")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              >
                {form.anhPreview ? (
                  <img src={form.anhPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                      <Image size={20} color="#005CB6" />
                    </div>
                    <span style={{ fontSize: 13, color: "#005CB6", fontWeight: 600 }}>Chọn ảnh</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Tối đa 15MB</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".jpg,.gif,.png,.jpeg,.bmp" style={{ display: "none" }} onChange={handleFile} />
              {form.anhPreview && (
                <button onClick={() => setF({ anhPreview: null })} style={{ marginTop: 8, fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Xóa ảnh
                </button>
              )}
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                (Chú ý: Hỗ trợ file *.jpg; *.gif; *.png; *.jpeg; *.bmp)
              </p>
            </div>

          </div>
        </div>

        {/* ── Footer popup ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Lưu và thêm tiếp */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: "#374151" }}>
            <div
              onClick={() => setF({ luuVaThemTiep: !form.luuVaThemTiep })}
              style={{
                width: 16, height: 16, borderRadius: 4, cursor: "pointer",
                border: `1.5px solid ${form.luuVaThemTiep ? "#005CB6" : "#d1d5db"}`,
                background: form.luuVaThemTiep ? "#005CB6" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {form.luuVaThemTiep && <Check size={10} color="#fff" strokeWidth={3} />}
            </div>
            Lưu và thêm tiếp
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleLuu}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 28px", borderRadius: 8, border: "none", background: "#005CB6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              <Check size={15} />
              {editId ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANG CHÍNH
// ═══════════════════════════════════════════════════════════════════════════════

const DS_KHOI_LOP = ["Lớp 1","Lớp 2","Lớp 3","Lớp 4","Lớp 5","Lớp 6","Lớp 7","Lớp 8","Lớp 9","Lớp 10","Lớp 11","Lớp 12"];
const DS_MON_HOC = ["Toán","Tiếng Việt","Tiếng Anh","Đạo đức","Vật lí","Hóa học","Sinh học","Lịch sử","Địa lý","Tin học","Kỹ năng sống","Ngữ văn"];

export default function DoiTacChuongTrinhPage() {
  const [danhSach, setDanhSach] = useState<NoiDungHoc[]>(SAMPLE_TABLE);
  const [activeTab, setActiveTab] = useState<"noi-dung" | "lich-su">("noi-dung");
  const [filterKhoi, setFilterKhoi] = useState("");
  const [filterMon, setFilterMon] = useState("");
  const [filterTen, setFilterTen] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const dsHienThi = danhSach.filter((ct) => {
    const matchKhoi = !filterKhoi || ct.khoiLop.includes(filterKhoi);
    const matchMon  = !filterMon  || ct.monHoc.includes(filterMon);
    const matchTen  = !filterTen  || ct.ten.toLowerCase().includes(filterTen.toLowerCase());
    return matchKhoi && matchMon && matchTen;
  });

  const toggleAll = () =>
    setSelected(selected.length === dsHienThi.length ? [] : dsHienThi.map((c) => c.id));
  const toggleOne = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

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
      setShowPopup(false);
      setEditId(null);
    } else {
      setDanhSach((prev) => [{
        id: `nd-${Date.now()}`,
        ten: tenTuDong,
        goiCuoc: goiTen,
        khoiLop: data.khoiLopChon.join(", "),
        monHoc: data.monHocChon.join(", "),
        soHocLieu: { baiGiang: 0, baiKiemTra: 0, nganHangCauHoi: 0 },
        nguoiTao: "quantridoitac",
        lanSuaCuoi: thoiGian,
      }, ...prev]);
      showToast(`Thêm "${tenTuDong}" (${goiTen}) thành công.`);
      if (!themTiep) setShowPopup(false);
    }
  };

  const handleXoa = () => {
    if (deleteId) {
      setDanhSach((prev) => prev.filter((ct) => ct.id !== deleteId));
      setDeleteId(null);
      showToast("Đã xóa nội dung học.");
    }
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

      <div style={{ padding: "20px 24px", maxWidth: 1300, margin: "0 auto" }}>
        {/* Banner */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: 8, background: "#fff8e1", border: "1px solid #fde68a", marginBottom: 16, fontSize: 13, color: "#92400e" }}>
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1, color: "#d97706" }} />
          <span>Hiện tại đang trong thời gian của Học kỳ II trên hệ thống K12Online. Vui lòng chọn lại thời gian Học kỳ II để tiếp tục sử dụng (Thời gian Học kỳ II trên hệ thống của trường bắt đầu từ ngày 16/01/2025).</span>
        </div>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
          <Home size={13} /><span>Trang chủ</span><ChevronRight size={13} />
          <span>Nội dung</span><ChevronRight size={13} />
          <span style={{ color: "#1a1a2e", fontWeight: 600 }}>Nội dung học</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 16px" }}>Nội dung học</h1>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", marginBottom: 20 }}>
          {([{ key: "noi-dung", label: "Nội dung học" }, { key: "lich-su", label: "Lịch sử chia sẻ" }] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: activeTab === tab.key ? "#005CB6" : "#6b7280", borderBottom: activeTab === tab.key ? "2px solid #005CB6" : "2px solid transparent", marginBottom: -2, transition: "all 0.15s", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "lich-su" ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Chức năng lịch sử chia sẻ đang được phát triển.</div>
        ) : (
          <>
            {/* Thanh bộ lọc */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <SelFilter value={filterKhoi} onChange={setFilterKhoi} options={DS_KHOI_LOP} placeholder="-- Chọn khối lớp --" />
              <SelFilter value={filterMon}  onChange={setFilterMon}  options={DS_MON_HOC}  placeholder="-- Chọn môn học --" />
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", minWidth: 220 }}>
                <Search size={13} color="#9ca3af" />
                <input value={filterTen} onChange={(e) => setFilterTen(e.target.value)} placeholder="Tên nội dung học" style={{ border: "none", outline: "none", fontSize: 13, background: "transparent", flex: 1, fontFamily: "'Be Vietnam Pro', sans-serif" }} />
                {filterTen && <X size={12} color="#9ca3af" style={{ cursor: "pointer" }} onClick={() => setFilterTen("")} />}
              </div>
              <div style={{ flex: 1 }} />
              <button onClick={() => { setFilterKhoi(""); setFilterMon(""); setFilterTen(""); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
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
                    {["STT","Tên nội dung học","Gói cước","Số học liệu","Người tạo","Lần sửa cuối","Hành động"].map((h, i) => (
                      <th key={i} style={{ padding: "12px 14px", textAlign: "left" as const, fontSize: 13, fontWeight: 600, color: "#374151", ...(i === 0 ? { width: 50, textAlign: "center" as const } : {}), ...(i === 6 ? { width: 130, textAlign: "center" as const } : {}) }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dsHienThi.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Không tìm thấy nội dung học nào</td></tr>
                  ) : (
                    dsHienThi.map((ct, idx) => {
                      const isSelected = selected.includes(ct.id);
                      return (
                        <tr key={ct.id} style={{ borderBottom: "1px solid #f3f4f6", background: isSelected ? "rgba(0,92,182,0.03)" : "transparent" }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "rgba(0,92,182,0.03)" : "transparent"; }}>
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
                              {ct.soHocLieu.baiGiang > 0 && <div>Bài giảng: <strong>{ct.soHocLieu.baiGiang}</strong></div>}
                              {ct.soHocLieu.baiKiemTra > 0 && <div>Bài kiểm tra: <strong>{ct.soHocLieu.baiKiemTra}</strong></div>}
                              {ct.soHocLieu.nganHangCauHoi > 0 && <div>Ngân hàng câu hỏi: <strong>{ct.soHocLieu.nganHangCauHoi}</strong></div>}
                              {ct.soHocLieu.baiGiang === 0 && ct.soHocLieu.baiKiemTra === 0 && ct.soHocLieu.nganHangCauHoi === 0 && <span style={{ color: "#9ca3af" }}>Chưa có học liệu</span>}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151" }}>{ct.nguoiTao}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280" }}>{ct.lanSuaCuoi}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                              <ActionBtn icon={<Pencil size={14} />} title="Sửa" color="#005CB6" onClick={() => { setEditId(ct.id); setShowPopup(true); }} />
                              <ActionBtn icon={<Trash2 size={14} />} title="Xóa" color="#ef4444" onClick={() => setDeleteId(ct.id)} />
                              <ActionBtn icon={<Share2 size={14} />} title="Chia sẻ" color="#0284C7" onClick={() => showToast("Đã chia sẻ nội dung học.")} />
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
        )}
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
            const khoiArr = item.khoiLop.split(",").map((s) => s.trim()).filter(Boolean);
            const monArr  = item.monHoc.split(",").map((s) => s.trim()).filter(Boolean);
            // Tìm lại chuongTrinhId và goiCuocIds từ tên
            const ct = MASTER_DATA.find((m) => m.ten === item.ten);
            const goiIds = ct?.danhSachGoi.filter((g) => item.goiCuoc.includes(g.ten)).map((g) => g.id) ?? [];
            return {
              ...POPUP_DEFAULT,
              chuongTrinhId: ct?.id ?? "",
              goiCuocIds: goiIds,
              khoiLopChon: khoiArr,
              monHocChon: monArr,
            };
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
              Bạn có chắc chắn muốn xóa nội dung học{" "}
              <strong>"{danhSach.find((c) => c.id === deleteId)?.ten}"</strong>?<br />Thao tác này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy bỏ</button>
              <button onClick={handleXoa} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Xóa</button>
            </div>
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
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10`; }}
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
      <ChevronDown size={13} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
    </div>
  );
}
