import { useState } from "react";
import {
  BookOpen, Plus, Pencil, Trash2, Search, X, Check,
  AlertTriangle,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

interface ChuongTrinhHoc {
  id: string;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  ngayTao: string;
  nguoiTao: string;
}

// ── DỮ LIỆU MẪU (10 bản ghi) ──────────────────────────────────────────────────

const SAMPLE_DATA: ChuongTrinhHoc[] = [
  { id: "ct-01", maChuongTrinh: "CT-TOAN-2026", tenChuongTrinh: "AI Book Toán 2026", ngayTao: "15/01/2026", nguoiTao: "Nguyễn Văn An" },
  { id: "ct-02", maChuongTrinh: "CT-VAN-2026", tenChuongTrinh: "AI Book Văn học 2026", ngayTao: "15/01/2026", nguoiTao: "Nguyễn Văn An" },
  { id: "ct-03", maChuongTrinh: "CT-ANH-2026", tenChuongTrinh: "AI Book Tiếng Anh 2026", ngayTao: "16/01/2026", nguoiTao: "Trần Thị Bình" },
  { id: "ct-04", maChuongTrinh: "CT-LY-2026", tenChuongTrinh: "AI Book Vật lý 2026", ngayTao: "18/01/2026", nguoiTao: "Trần Thị Bình" },
  { id: "ct-05", maChuongTrinh: "CT-HOA-2026", tenChuongTrinh: "AI Book Hóa học 2026", ngayTao: "20/01/2026", nguoiTao: "Lê Minh Châu" },
  { id: "ct-06", maChuongTrinh: "CT-SINH-2026", tenChuongTrinh: "AI Book Sinh học 2026", ngayTao: "20/01/2026", nguoiTao: "Lê Minh Châu" },
  { id: "ct-07", maChuongTrinh: "CT-KNM-2026", tenChuongTrinh: "Khóa học Kỹ năng mềm", ngayTao: "22/01/2026", nguoiTao: "Phạm Đức Dũng" },
  { id: "ct-08", maChuongTrinh: "CT-TIN-2026", tenChuongTrinh: "AI Book Tin học 2026", ngayTao: "25/01/2026", nguoiTao: "Phạm Đức Dũng" },
  { id: "ct-09", maChuongTrinh: "CT-SU-2026", tenChuongTrinh: "AI Book Lịch sử 2026", ngayTao: "28/01/2026", nguoiTao: "Hoàng Thu Hà" },
  { id: "ct-10", maChuongTrinh: "CT-DIA-2026", tenChuongTrinh: "AI Book Địa lý 2026", ngayTao: "28/01/2026", nguoiTao: "Hoàng Thu Hà" },
];

// ── STYLE CONSTANTS ─────────────────────────────────────────────────────────────

const PRIMARY = "#005CB6";
const PRIMARY_HOVER = "#004A92";
const PRIMARY_LIGHT = "#E8F0FE";

// ── COMPONENT ───────────────────────────────────────────────────────────────────

export default function ChuongTrinhHocPage() {
  const [danhSach, setDanhSach] = useState<ChuongTrinhHoc[]>(SAMPLE_DATA);
  const [tuKhoa, setTuKhoa] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formMa, setFormMa] = useState("");
  const [formTen, setFormTen] = useState("");
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Lọc theo từ khóa ───────────────────────────────────────────────────────
  const dsHienThi = danhSach.filter((ct) => {
    const kw = tuKhoa.toLowerCase();
    return (
      ct.tenChuongTrinh.toLowerCase().includes(kw) ||
      ct.maChuongTrinh.toLowerCase().includes(kw)
    );
  });

  // ── Mở form Thêm mới ───────────────────────────────────────────────────────
  const handleThemMoi = () => {
    setEditId(null);
    setFormMa("");
    setFormTen("");
    setFormError("");
    setShowForm(true);
  };

  // ── Mở form Sửa ────────────────────────────────────────────────────────────
  const handleSua = (ct: ChuongTrinhHoc) => {
    setEditId(ct.id);
    setFormMa(ct.maChuongTrinh);
    setFormTen(ct.tenChuongTrinh);
    setFormError("");
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
      // Cập nhật
      setDanhSach((prev) =>
        prev.map((ct) =>
          ct.id === editId ? { ...ct, maChuongTrinh: ma, tenChuongTrinh: ten } : ct
        )
      );
    } else {
      // Thêm mới
      const now = new Date();
      const ngay = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
      const newItem: ChuongTrinhHoc = {
        id: `ct-${Date.now()}`,
        maChuongTrinh: ma,
        tenChuongTrinh: ten,
        ngayTao: ngay,
        nguoiTao: "Admin VTS",
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
              Danh mục Nội dung học
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Quản lý danh mục nội dung học trên hệ thống K12
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

      {/* ── Thanh tìm kiếm ──────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: 16, maxWidth: 400,
        border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px",
        background: "#fff",
      }}>
        <Search size={16} color="#9ca3af" />
        <input
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="Tìm theo mã hoặc tên chương trình..."
          style={{
            flex: 1, border: "none", outline: "none", padding: "10px 0",
            fontSize: 14, background: "transparent",
          }}
        />
        {tuKhoa && (
          <X
            size={14} color="#9ca3af" style={{ cursor: "pointer" }}
            onClick={() => setTuKhoa("")}
          />
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
              {["STT", "Mã chương trình", "Tên chương trình", "Ngày tạo", "Người tạo", "Thao tác"].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 16px", textAlign: "left", fontSize: 13,
                  fontWeight: 600, color: PRIMARY, borderBottom: `2px solid ${PRIMARY}`,
                  whiteSpace: "nowrap",
                  ...(i === 0 ? { width: 60, textAlign: "center" as const } : {}),
                  ...(i === 5 ? { width: 120, textAlign: "center" as const } : {}),
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dsHienThi.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
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
              background: "#fff", borderRadius: 14, padding: 28, width: 460,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
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
