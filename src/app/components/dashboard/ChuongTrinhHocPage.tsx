import { useState, useRef, useEffect } from "react";
import {
  BookOpen, Plus, Pencil, Trash2, Search, X, Check,
  AlertTriangle,
} from "lucide-react";

// ── DANH SÁCH ĐỐI TÁC (mẫu) ──────────────────────────────────────────────────

const DANH_SACH_DOI_TAC = [
  "AI Book",
  "Viettel Study",
  "Ôn luyện",
  "HOCMAI",
  "Tuyensinh247",
  "VioEdu",
  "Kiến Guru",
  "Luyện thi 123",
  "Educa",
  "Marathon Education",
];

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

interface ChuongTrinhHoc {
  id: string;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  ngayTao: string;
  nguoiTao: string;
  doiTac: string[];
}

// ── DỮ LIỆU MẪU (10 bản ghi) ──────────────────────────────────────────────────

export const SAMPLE_DATA: ChuongTrinhHoc[] = [
  { id: "ct-01", maChuongTrinh: "CT-TOAN-2026", tenChuongTrinh: "AI Book Toán 2026", ngayTao: "15/01/2026", nguoiTao: "Nguyễn Văn An", doiTac: ["AI Book", "Viettel Study"] },
  { id: "ct-02", maChuongTrinh: "CT-VAN-2026", tenChuongTrinh: "AI Book Văn học 2026", ngayTao: "15/01/2026", nguoiTao: "Nguyễn Văn An", doiTac: ["HOCMAI"] },
  { id: "ct-03", maChuongTrinh: "CT-ANH-2026", tenChuongTrinh: "AI Book Tiếng Anh 2026", ngayTao: "16/01/2026", nguoiTao: "Trần Thị Bình", doiTac: ["Ôn luyện", "Kiến Guru"] },
  { id: "ct-04", maChuongTrinh: "CT-LY-2026", tenChuongTrinh: "AI Book Vật lý 2026", ngayTao: "18/01/2026", nguoiTao: "Trần Thị Bình", doiTac: [] },
  { id: "ct-05", maChuongTrinh: "CT-HOA-2026", tenChuongTrinh: "AI Book Hóa học 2026", ngayTao: "20/01/2026", nguoiTao: "Lê Minh Châu", doiTac: [] },
  { id: "ct-06", maChuongTrinh: "CT-SINH-2026", tenChuongTrinh: "AI Book Sinh học 2026", ngayTao: "20/01/2026", nguoiTao: "Lê Minh Châu", doiTac: ["VioEdu"] },
  { id: "ct-07", maChuongTrinh: "CT-KNM-2026", tenChuongTrinh: "Khóa học Kỹ năng mềm", ngayTao: "22/01/2026", nguoiTao: "Phạm Đức Dũng", doiTac: ["Marathon Education", "Educa"] },
  { id: "ct-08", maChuongTrinh: "CT-TIN-2026", tenChuongTrinh: "AI Book Tin học 2026", ngayTao: "25/01/2026", nguoiTao: "Phạm Đức Dũng", doiTac: ["Tuyensinh247"] },
  { id: "ct-09", maChuongTrinh: "CT-SU-2026", tenChuongTrinh: "AI Book Lịch sử 2026", ngayTao: "28/01/2026", nguoiTao: "Hoàng Thu Hà", doiTac: [] },
  { id: "ct-10", maChuongTrinh: "CT-DIA-2026", tenChuongTrinh: "AI Book Địa lý 2026", ngayTao: "28/01/2026", nguoiTao: "Hoàng Thu Hà", doiTac: ["Luyện thi 123", "HOCMAI"] },
];

// ── STYLE CONSTANTS ─────────────────────────────────────────────────────────────

const PRIMARY = "#005CB6";
const PRIMARY_HOVER = "#004A92";
const PRIMARY_LIGHT = "#E8F0FE";

// ── COMPONENT ───────────────────────────────────────────────────────────────────

export default function ChuongTrinhHocPage() {
  const [danhSach, setDanhSach] = useState<ChuongTrinhHoc[]>(SAMPLE_DATA);
  const [tuKhoa, setTuKhoa] = useState("");
  const [filterDoiTac, setFilterDoiTac] = useState("");
  const [filterNguoiTao, setFilterNguoiTao] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formMa, setFormMa] = useState("");
  const [formTen, setFormTen] = useState("");
  const [formError, setFormError] = useState("");

  // Đối tác state
  const [selectedDoiTac, setSelectedDoiTac] = useState<string[]>([]);
  const [doiTacOpen, setDoiTacOpen] = useState(false);
  const doiTacTriggerRef = useRef<HTMLButtonElement>(null);
  const doiTacDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!doiTacOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        doiTacTriggerRef.current && !doiTacTriggerRef.current.contains(e.target as Node) &&
        doiTacDropdownRef.current && !doiTacDropdownRef.current.contains(e.target as Node)
      ) {
        setDoiTacOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [doiTacOpen]);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // ── Danh sách người tạo duy nhất (cho dropdown filter) ────────────────────
  const danhSachNguoiTao = Array.from(new Set(danhSach.map((ct) => ct.nguoiTao)));

  // ── Lọc ────────────────────────────────────────────────────────────────────
  const dsHienThi = danhSach.filter((ct) => {
    const kw = tuKhoa.toLowerCase();
    const matchKw =
      ct.tenChuongTrinh.toLowerCase().includes(kw) ||
      ct.maChuongTrinh.toLowerCase().includes(kw);
    const matchDoiTac = !filterDoiTac || ct.doiTac.includes(filterDoiTac);
    const matchNguoi = !filterNguoiTao || ct.nguoiTao === filterNguoiTao;
    return matchKw && matchDoiTac && matchNguoi;
  });

  const hasFilter = filterDoiTac || filterNguoiTao;
  const handleResetFilter = () => {
    setFilterDoiTac("");
    setFilterNguoiTao("");
    setTuKhoa("");
  };

  // ── Helpers đối tác ────────────────────────────────────────────────────────
  const toggleDoiTac = (ten: string) => {
    setSelectedDoiTac((prev) =>
      prev.includes(ten) ? prev.filter((t) => t !== ten) : [...prev, ten]
    );
  };

  // ── Mở form Thêm mới ───────────────────────────────────────────────────────
  const handleThemMoi = () => {
    setEditId(null);
    setFormMa("");
    setFormTen("");
    setFormError("");
    setSelectedDoiTac([]);
    setDoiTacOpen(false);
    setShowForm(true);
  };

  // ── Mở form Sửa ────────────────────────────────────────────────────────────
  const handleSua = (ct: ChuongTrinhHoc) => {
    setEditId(ct.id);
    setFormMa(ct.maChuongTrinh);
    setFormTen(ct.tenChuongTrinh);
    setFormError("");
    setSelectedDoiTac(ct.doiTac);
    setDoiTacOpen(false);
    setShowForm(true);
  };

  // ── Lưu (Thêm / Cập nhật) ──────────────────────────────────────────────────
  const handleLuu = () => {
    const ma = formMa.trim();
    const ten = formTen.trim();

    if (!ma || !ten) {
      setFormError("Vui lòng nhập đầy đủ Mã chương trình và Tên chương trình.");
      return;
    }

    // Kiểm tra trùng mã
    const trungMa = danhSach.some(
      (ct) => ct.maChuongTrinh.toLowerCase() === ma.toLowerCase() && ct.id !== editId
    );
    if (trungMa) {
      setFormError("Mã chương trình đã tồn tại. Vui lòng nhập mã khác.");
      return;
    }

    if (editId) {
      setDanhSach((prev) =>
        prev.map((ct) =>
          ct.id === editId ? { ...ct, maChuongTrinh: ma, tenChuongTrinh: ten, doiTac: selectedDoiTac } : ct
        )
      );
    } else {
      const now = new Date();
      const ngay = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
      const newItem: ChuongTrinhHoc = {
        id: `ct-${Date.now()}`,
        maChuongTrinh: ma,
        tenChuongTrinh: ten,
        ngayTao: ngay,
        nguoiTao: "Admin VTS",
        doiTac: selectedDoiTac,
      };
      setDanhSach((prev) => [newItem, ...prev]);
    }
    setShowForm(false);
  };

  // ── Xóa ─────────────────────────────────────────────────────────────────────
  const handleXoa = () => {
    if (deleteId) {
      setDanhSach((prev) => prev.filter((ct) => ct.id !== deleteId));
      setDeleteId(null);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: PRIMARY,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
              Danh mục Chương trình học
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Quản lý danh mục chương trình học trên hệ thống K12
            </p>
          </div>
        </div>

        <button
          onClick={handleThemMoi}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: PRIMARY, color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = PRIMARY_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
        >
          <Plus size={16} />
          Thêm chương trình
        </button>
      </div>

      {/* ── Thanh tìm kiếm + Filter ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flex: "1 1 260px", minWidth: 220,
          border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px", background: "#fff",
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Tìm theo mã hoặc tên chương trình..."
            style={{ flex: 1, border: "none", outline: "none", padding: "10px 0", fontSize: 14, background: "transparent" }}
          />
          {tuKhoa && <X size={14} color="#9ca3af" style={{ cursor: "pointer" }} onClick={() => setTuKhoa("")} />}
        </div>

        {/* Filter: Đối tác */}
        <select
          value={filterDoiTac}
          onChange={(e) => setFilterDoiTac(e.target.value)}
          style={{
            padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db",
            fontSize: 13, background: "#fff", color: filterDoiTac ? "#1a1a2e" : "#9ca3af",
            outline: "none", cursor: "pointer", minWidth: 180,
            borderColor: filterDoiTac ? PRIMARY : "#d1d5db",
          }}
        >
          <option value="">Tất cả đối tác</option>
          {DANH_SACH_DOI_TAC.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
        </select>

        {/* Filter: Người tạo */}
        <select
          value={filterNguoiTao}
          onChange={(e) => setFilterNguoiTao(e.target.value)}
          style={{
            padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db",
            fontSize: 13, background: "#fff", color: filterNguoiTao ? "#1a1a2e" : "#9ca3af",
            outline: "none", cursor: "pointer", minWidth: 150,
            borderColor: filterNguoiTao ? PRIMARY : "#d1d5db",
          }}
        >
          <option value="">Tất cả người tạo</option>
          {danhSachNguoiTao.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        {/* Nút xóa filter */}
        {hasFilter && (
          <button
            onClick={handleResetFilter}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "9px 14px", borderRadius: 8, border: "1px solid #d1d5db",
              background: "#fff", fontSize: 13, color: "#6b7280", cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <X size={13} />
            Xóa lọc
          </button>
        )}
      </div>

      {/* ── Số lượng kết quả ────────────────────────────────────────────────── */}
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        Hiển thị <strong>{dsHienThi.length}</strong> / {danhSach.length} chương trình
      </p>

      {/* ── Bảng dữ liệu ───────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PRIMARY_LIGHT }}>
              {["STT", "Mã chương trình", "Tên chương trình", "Đối tác", "Ngày tạo", "Người tạo", "Thao tác"].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 16px", textAlign: "left", fontSize: 13,
                  fontWeight: 600, color: PRIMARY, borderBottom: `2px solid ${PRIMARY}`,
                  whiteSpace: "nowrap",
                  ...(i === 0 ? { width: 60, textAlign: "center" as const } : {}),
                  ...(i === 6 ? { width: 120, textAlign: "center" as const } : {}),
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dsHienThi.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                  Không tìm thấy chương trình nào
                </td>
              </tr>
            ) : (
              dsHienThi.map((ct, idx) => (
                <tr
                  key={ct.id}
                  style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, color: "#6b7280" }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-block", padding: "3px 10px", borderRadius: 6,
                      background: PRIMARY_LIGHT, color: PRIMARY,
                      fontSize: 13, fontWeight: 600, fontFamily: "monospace",
                    }}>
                      {ct.maChuongTrinh}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: "#1a1a2e" }}>
                    {ct.tenChuongTrinh}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {ct.doiTac.length === 0 ? (
                      <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>Chưa gán</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {ct.doiTac.map((dt, i) => (
                          <span key={i} style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 12,
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            fontSize: 12, color: "#16a34a", whiteSpace: "nowrap",
                          }}>
                            {dt}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>
                    {ct.ngayTao}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>
                    {ct.nguoiTao}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <button
                        onClick={() => handleSua(ct)}
                        title="Sửa"
                        style={{
                          width: 32, height: 32, borderRadius: 6, border: "1px solid #d1d5db",
                          background: "#fff", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = PRIMARY;
                          e.currentTarget.style.color = PRIMARY;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <Pencil size={14} color="currentColor" />
                      </button>
                      <button
                        onClick={() => setDeleteId(ct.id)}
                        title="Xóa"
                        style={{
                          width: 32, height: 32, borderRadius: 6, border: "1px solid #d1d5db",
                          background: "#fff", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ef4444";
                          e.currentTarget.style.background = "#fef2f2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#d1d5db";
                          e.currentTarget.style.background = "#fff";
                        }}
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* DIALOG: Thêm / Sửa chương trình                                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 14, padding: 28, width: 600,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Dialog header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                {editId ? "Cập nhật chương trình" : "Thêm chương trình mới"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: "#f3f4f6", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} color="#6b7280" />
              </button>
            </div>

            {/* Error */}
            {formError && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca",
                marginBottom: 20, fontSize: 13, color: "#dc2626",
              }}>
                <AlertTriangle size={14} />
                {formError}
              </div>
            )}

            {/* Field: Mã chương trình */}
            <div style={{ marginBottom: 20, position: "relative" }}>
              <label style={{
                position: "absolute", top: -8, left: 12, background: "#fff",
                padding: "0 6px", fontSize: 12, fontWeight: 600, color: PRIMARY,
              }}>
                Mã chương trình <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={formMa}
                onChange={(e) => { setFormMa(e.target.value); setFormError(""); }}
                placeholder="VD: CT-TOAN-2026"
                style={{
                  width: "100%", padding: "14px 14px 12px", borderRadius: 8,
                  border: `1.5px solid ${PRIMARY}`, outline: "none", fontSize: 14,
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                autoFocus
              />
            </div>

            {/* Field: Tên chương trình */}
            <div style={{ marginBottom: 24, position: "relative" }}>
              <label style={{
                position: "absolute", top: -8, left: 12, background: "#fff",
                padding: "0 6px", fontSize: 12, fontWeight: 600, color: PRIMARY,
              }}>
                Tên chương trình <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={formTen}
                onChange={(e) => { setFormTen(e.target.value); setFormError(""); }}
                placeholder="VD: AI Book Tiếng Anh 2026"
                style={{
                  width: "100%", padding: "14px 14px 12px", borderRadius: 8,
                  border: "1.5px solid #d1d5db", outline: "none", fontSize: 14,
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
            </div>

            {/* ── Đối tác ────────────────────────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Đối tác áp dụng
              </div>

              {/* Trigger button */}
              <button
                ref={doiTacTriggerRef}
                type="button"
                onClick={() => setDoiTacOpen((o) => !o)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, textAlign: "left",
                  border: `1.5px solid ${doiTacOpen ? PRIMARY : "#d1d5db"}`,
                  background: "#fff", fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ color: selectedDoiTac.length === 0 ? "#9ca3af" : "#1a1a2e" }}>
                  {selectedDoiTac.length === 0 ? "Chọn đối tác..." : `Đã chọn ${selectedDoiTac.length} đối tác`}
                </span>
                <span style={{ fontSize: 10, color: "#6b7280" }}>{doiTacOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown dùng position fixed – không bị clip bởi overflow của dialog */}
              {doiTacOpen && (() => {
                const rect = doiTacTriggerRef.current?.getBoundingClientRect();
                return (
                  <div
                    ref={doiTacDropdownRef}
                    style={{
                      position: "fixed",
                      top: rect ? rect.bottom + 4 : 0,
                      left: rect ? rect.left : 0,
                      width: rect ? rect.width : 300,
                      zIndex: 2000,
                      background: "#fff",
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      maxHeight: 220,
                      overflowY: "auto",
                    }}
                  >
                    {DANH_SACH_DOI_TAC.map((dt, i) => {
                      const checked = selectedDoiTac.includes(dt);
                      return (
                        <label
                          key={dt}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 14px", cursor: "pointer", fontSize: 13,
                            background: checked ? PRIMARY_LIGHT : "transparent",
                            color: checked ? PRIMARY : "#374151",
                            borderBottom: i < DANH_SACH_DOI_TAC.length - 1 ? "1px solid #f3f4f6" : "none",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDoiTac(dt)}
                            style={{ accentColor: PRIMARY, width: 15, height: 15, flexShrink: 0 }}
                          />
                          {dt}
                          {checked && <Check size={13} color={PRIMARY} style={{ marginLeft: "auto" }} />}
                        </label>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Tags đã chọn */}
              {selectedDoiTac.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {selectedDoiTac.map((dt) => (
                    <span
                      key={dt}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 20,
                        background: PRIMARY_LIGHT, border: `1px solid ${PRIMARY}`,
                        fontSize: 12, color: PRIMARY, fontWeight: 500,
                      }}
                    >
                      {dt}
                      <X size={11} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => toggleDoiTac(dt)} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "1px solid #d1d5db",
                  background: "#fff", fontSize: 14, fontWeight: 500, color: "#374151",
                  cursor: "pointer",
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleLuu}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 24px", borderRadius: 8, border: "none",
                  background: PRIMARY, color: "#fff", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = PRIMARY_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
              >
                <Check size={16} />
                {editId ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* DIALOG: Xác nhận xóa                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 14, padding: 28, width: 400,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center",
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: "#fef2f2",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>
              Xác nhận xóa
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
              Bạn có chắc chắn muốn xóa chương trình{" "}
              <strong>"{danhSach.find((ct) => ct.id === deleteId)?.tenChuongTrinh}"</strong>?
              <br />Thao tác này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db",
                  background: "#fff", fontSize: 14, fontWeight: 500, color: "#374151",
                  cursor: "pointer",
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleXoa}
                style={{
                  padding: "10px 24px", borderRadius: 8, border: "none",
                  background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
              >
                Xóa chương trình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
