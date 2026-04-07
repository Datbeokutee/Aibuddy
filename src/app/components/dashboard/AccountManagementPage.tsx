import { useState } from "react";
import {
  Search, Plus, Eye, Trash2, Edit2,
  X, ChevronDown, Download, RefreshCw,
  UserCircle2, CheckCircle, AlertCircle,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type VaiTro = "maker" | "checker" | "admin";

interface TaiKhoan {
  id: string;
  hoTen: string;
  donVi: string;
  taiKhoan: string;
  soDienThoai: string;
  email: string;
  vaiTro: VaiTro;
  thoiGianTao: string;
  avatar: string;
  mauAvatar: string;
}

// ── DỮ LIỆU MẪU ───────────────────────────────────────────────────────────────

const DU_LIEU: TaiKhoan[] = [
  { id: "1", hoTen: "Nguyễn Văn An",    donVi: "NXB Phương Nam",         taiKhoan: "an.nguyen@phuongnam.vn",   soDienThoai: "0901234567", email: "an.nguyen@phuongnam.vn",   vaiTro: "admin",   thoiGianTao: "25/02/2026 - 16:44:34", avatar: "NA", mauAvatar: "#005CB6" },
  { id: "2", hoTen: "Lê Văn Bình",      donVi: "Viettel Hà Nội",         taiKhoan: "binh.le@vthn.vn",          soDienThoai: "0912345678", email: "binh.le@vthn.vn",          vaiTro: "maker",   thoiGianTao: "06/01/2026 - 16:09:16", avatar: "LB", mauAvatar: "#0284C7" },
  { id: "3", hoTen: "Trần Thị Cẩm",     donVi: "Viettel Hà Nội",         taiKhoan: "pogd@vhv.vn",              soDienThoai: "0344258217", email: "pogd@vhv.vn",              vaiTro: "checker", thoiGianTao: "16/12/2025 - 09:54:23", avatar: "TC", mauAvatar: "#0F766E" },
  { id: "4", hoTen: "Tổ trưởng K12",    donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "totruongk12@gmail.com",   soDienThoai: "0999729873", email: "totruongk12@gmail.com",   vaiTro: "maker",   thoiGianTao: "08/12/2025 - 15:04:08", avatar: "TK", mauAvatar: "#7C3AED" },
  { id: "5", hoTen: "lô tê ka 1111",    donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "ltk1111@gmail.com",       soDienThoai: "0565656666", email: "ltk1111@gmail.com",       vaiTro: "maker",   thoiGianTao: "08/12/2025 - 13:49:08", avatar: "LK", mauAvatar: "#D97706" },
  { id: "6", hoTen: "GVCN 2",           donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "gvcn0612@gmail.com",      soDienThoai: "0379994401", email: "gvcn0612@gmail.com",      vaiTro: "checker", thoiGianTao: "20/11/2025 - 10:13:18", avatar: "G2", mauAvatar: "#0F766E" },
  { id: "7", hoTen: "Giáo viên 2025",   donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "gv2526@gmail.com",        soDienThoai: "0993258741", email: "gv2526@gmail.com",        vaiTro: "maker",   thoiGianTao: "18/11/2025 - 16:03:16", avatar: "GV", mauAvatar: "#0284C7" },
  { id: "8", hoTen: "Giám thị NA",      donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "giamthina@gmail.com",     soDienThoai: "0371234567", email: "giamthina@gmail.com",     vaiTro: "checker", thoiGianTao: "11/11/2025 - 08:48:02", avatar: "GN", mauAvatar: "#64748B" },
  { id: "9", hoTen: "Gv Chuyên cần",    donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "gvcc@gmail.com",          soDienThoai: "0996126874", email: "gvcc@gmail.com",          vaiTro: "maker",   thoiGianTao: "31/10/2025 - 10:45:35", avatar: "GC", mauAvatar: "#005CB6" },
  { id:"10", hoTen: "Mai Thế Anh",      donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "nguyenvandaibe@gmail.com",soDienThoai: "0994941941", email: "nguyenvandaibe@gmail.com",vaiTro: "maker",   thoiGianTao: "24/10/2025 - 16:20:00", avatar: "MA", mauAvatar: "#D97706" },
  { id:"11", hoTen: "Nguyễn Thị B",     donVi: "Viettel TP. Hồ Chí Minh",taiKhoan: "nguyenthibz@gmail.com",   soDienThoai: "0987654321", email: "nguyenthibz@gmail.com",   vaiTro: "checker", thoiGianTao: "19/10/2025 - 09:19:39", avatar: "NB", mauAvatar: "#0F766E" },
  { id:"12", hoTen: "Kiều test bán trú",donVi: "Viettel Hà Nội",          taiKhoan: "kieu01@gmail.com",         soDienThoai: "0987097653", email: "kieu01@gmail.com",         vaiTro: "maker",   thoiGianTao: "17/10/2025 - 09:46:20", avatar: "KB", mauAvatar: "#7C3AED" },
  { id:"13", hoTen: "Giáo viên lớp TH", donVi: "Viettel Đà Nẵng",         taiKhoan: "giaovien1a@gmail.com",    soDienThoai: "0359934355", email: "giaovien1a@gmail.com",    vaiTro: "checker", thoiGianTao: "13/10/2025 - 11:04:39", avatar: "GT", mauAvatar: "#0F766E" },
  { id:"14", hoTen: "Con bot khon",      donVi: "Đại lý HCM 1",            taiKhoan: "pmh301198111@gmail.com",  soDienThoai: "0940001234", email: "pmh301198111@gmail.com",  vaiTro: "maker",   thoiGianTao: "08/10/2025 - 16:36:06", avatar: "CK", mauAvatar: "#0284C7" },
  { id:"15", hoTen: "Vũ Văn Khuyến",    donVi: "Chi nhánh Quận 1",         taiKhoan: "vukhuyen@gmail.com",      soDienThoai: "0325097856", email: "vukhuyen@gmail.com",      vaiTro: "maker",   thoiGianTao: "23/09/2025 - 14:37:26", avatar: "VK", mauAvatar: "#005CB6" },
];

const VAI_TRO_OPTIONS: { value: VaiTro | ""; label: string }[] = [
  { value: "", label: "— Chọn vai trò —" },
  { value: "admin",   label: "Admin Đối tác" },
  { value: "maker",   label: "Người chia sẻ" },
  { value: "checker", label: "Người duyệt chia sẻ" },
];

// Options dùng trong popup thêm mới (chỉ 2 lựa chọn)
const POPUP_VAI_TRO_OPTIONS: { value: VaiTro | ""; label: string }[] = [
  { value: "", label: "— Chọn vai trò —" },
  { value: "maker",   label: "Người chia sẻ" },
  { value: "checker", label: "Người duyệt chia sẻ" },
];

const VAI_TRO_LABEL: Record<VaiTro, string> = {
  admin:   "Admin Đối tác",
  maker:   "Người chia sẻ",
  checker: "Người duyệt chia sẻ",
};

const VAI_TRO_STYLE: Record<VaiTro, { color: string; bg: string }> = {
  admin:   { color: "#005CB6", bg: "rgba(0,92,182,0.08)" },
  maker:   { color: "#0284C7", bg: "rgba(2,132,199,0.08)" },
  checker: { color: "#0F766E", bg: "rgba(15,118,110,0.08)" },
};

// ── TOAST ─────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const show = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

function Toast({ toast }: { toast: { msg: string; type: string } | null }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
      style={{
        background: "#fff",
        border: `1.5px solid ${isSuccess ? "rgba(15,118,110,0.25)" : "rgba(212,24,61,0.25)"}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
        fontFamily: "'Be Vietnam Pro',sans-serif",
      }}
    >
      {isSuccess
        ? <CheckCircle size={16} color="#0F766E" />
        : <AlertCircle size={16} color="#D4183D" />}
      <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1E293B" }}>{toast.msg}</span>
    </div>
  );
}

// ── POPUP THÊM MỚI ────────────────────────────────────────────────────────────

interface ModalThemMoiProps {
  onClose: () => void;
  onSave: (email: string, vaiTro: VaiTro) => void;
}

function ModalThemMoi({ onClose, onSave }: ModalThemMoiProps) {
  const [email, setEmail] = useState("");
  const [vaiTro, setVaiTro] = useState<VaiTro | "">("");
  const [luuVaThemTiep, setLuuVaThemTiep] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; vaiTro?: string }>({});

  const validate = () => {
    const e: { email?: string; vaiTro?: string } = {};
    if (!email.trim()) e.email = "Email/Tài khoản không được để trống";
    if (!vaiTro) e.vaiTro = "Vui lòng chọn vai trò";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(email, vaiTro as VaiTro);
    if (luuVaThemTiep) {
      setEmail("");
      setVaiTro("");
      setErrors({});
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.4)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: 480,
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          fontFamily: "'Be Vietnam Pro',sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #EEF0F4" }}
        >
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#0F172A" }}>
            Thêm mới tài khoản
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X size={16} color="#64748B" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Email/Tài khoản */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Email/Tài khoản <span style={{ color: "#D4183D" }}>*</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(v => ({ ...v, email: undefined })); }}
              placeholder=""
              className="w-full outline-none rounded-lg"
              style={{
                border: `1px solid ${errors.email ? "#D4183D" : "#D1D5DB"}`,
                padding: "9px 12px",
                fontSize: "0.84rem",
                fontFamily: "'Be Vietnam Pro',sans-serif",
                color: "#0F172A",
                background: "#fff",
              }}
              onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = errors.email ? "#D4183D" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
            />
            {errors.email && <p style={{ fontSize: "0.72rem", color: "#D4183D", marginTop: 4 }}>{errors.email}</p>}
          </div>

          {/* Vai trò */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Vai trò <span style={{ color: "#D4183D" }}>*</span>
            </label>
            <div className="relative">
              <select
                value={vaiTro}
                onChange={e => { setVaiTro(e.target.value as VaiTro | ""); if (errors.vaiTro) setErrors(v => ({ ...v, vaiTro: undefined })); }}
                className="w-full outline-none appearance-none rounded-lg"
                style={{
                  border: `1px solid ${errors.vaiTro ? "#D4183D" : "#D1D5DB"}`,
                  padding: "9px 36px 9px 12px",
                  fontSize: "0.84rem",
                  fontFamily: "'Be Vietnam Pro',sans-serif",
                  color: vaiTro ? "#0F172A" : "#9CA3AF",
                  background: "#fff",
                  cursor: "pointer",
                }}
                onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = errors.vaiTro ? "#D4183D" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
              >
                {POPUP_VAI_TRO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.vaiTro && <p style={{ fontSize: "0.72rem", color: "#D4183D", marginTop: 4 }}>{errors.vaiTro}</p>}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid #EEF0F4" }}
        >
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={luuVaThemTiep}
              onChange={e => setLuuVaThemTiep(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: "#005CB6", cursor: "pointer" }}
            />
            <span style={{ fontSize: "0.82rem", color: "#374151" }}>Lưu và thêm tiếp</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg transition-all"
              style={{ background: "#fff", border: "1px solid #D1D5DB", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, color: "#374151", fontFamily: "'Be Vietnam Pro',sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg transition-all"
              style={{ background: "#1E3A5F", border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, color: "#fff", fontFamily: "'Be Vietnam Pro',sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#005CB6")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1E3A5F")}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ────────────────────────────────────────────────────────────

export function AccountManagementPage() {
  const [data, setData] = useState<TaiKhoan[]>(DU_LIEU);
  const [search, setSearch] = useState("");
  const [filterVaiTro, setFilterVaiTro] = useState<VaiTro | "">("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const { toast, show: showToast } = useToast();

  // Lọc dữ liệu
  const filtered = data.filter(tk => {
    const matchSearch =
      !search ||
      tk.hoTen.toLowerCase().includes(search.toLowerCase()) ||
      tk.taiKhoan.toLowerCase().includes(search.toLowerCase()) ||
      tk.email.toLowerCase().includes(search.toLowerCase()) ||
      tk.soDienThoai.includes(search);
    const matchRole = !filterVaiTro || tk.vaiTro === filterVaiTro;
    return matchSearch && matchRole;
  });

  // Checkbox
  const allChecked = filtered.length > 0 && filtered.every(tk => selectedIds.has(tk.id));
  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(tk => tk.id)));
  };
  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Xóa
  const handleDelete = (id: string) => {
    setData(prev => prev.filter(tk => tk.id !== id));
    showToast("Đã xóa tài khoản thành công");
  };

  // Lưu thêm mới
  const handleSave = (email: string, vaiTro: VaiTro) => {
    const ten = email.split("@")[0];
    const newTk: TaiKhoan = {
      id: String(Date.now()),
      hoTen: ten,
      donVi: "NXB Phương Nam",
      taiKhoan: email,
      soDienThoai: "—",
      email,
      vaiTro,
      thoiGianTao: new Date().toLocaleString("vi-VN").replace(",", " -"),
      avatar: ten.slice(0, 2).toUpperCase(),
      mauAvatar: "#005CB6",
    };
    setData(prev => [newTk, ...prev]);
    showToast("Thêm tài khoản thành công");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'Be Vietnam Pro',sans-serif", background: "#F7F8FA", minHeight: 0 }}
    >
      <Toast toast={toast} />
      {showModal && <ModalThemMoi onClose={() => setShowModal(false)} onSave={handleSave} />}

      {/* ── THANH TIÊU ĐỀ & ACTION ── */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: "#fff", borderBottom: "1px solid #EEF0F4" }}
      >
        <h1 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
          Quản lý tài khoản
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all"
            style={{ background: "#fff", border: "1px solid #D1D5DB", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <Download size={14} color="#374151" />
            Xuất excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all"
            style={{ background: "#005CB6", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: "#fff" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0047A3")}
            onMouseLeave={e => (e.currentTarget.style.background = "#005CB6")}
          >
            <Plus size={14} color="#fff" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* ── BỘ LỌC ── */}
      <div
        className="flex items-center gap-3 px-6 py-3 flex-shrink-0"
        style={{ background: "#fff", borderBottom: "1px solid #EEF0F4" }}
      >
        {/* Dropdown vai trò */}
        <div className="relative" style={{ width: 190 }}>
          <select
            value={filterVaiTro}
            onChange={e => setFilterVaiTro(e.target.value as VaiTro | "")}
            className="w-full outline-none appearance-none rounded-lg"
            style={{
              border: "1px solid #D1D5DB",
              padding: "7px 32px 7px 10px",
              fontSize: "0.82rem",
              fontFamily: "'Be Vietnam Pro',sans-serif",
              color: filterVaiTro ? "#0F172A" : "#9CA3AF",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {VAI_TRO_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={13} color="#9CA3AF" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Tìm kiếm */}
        <div className="relative flex-1" style={{ maxWidth: 340 }}>
          <Search size={14} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Họ và tên, tài khoản, email, số điện thoại"
            className="w-full outline-none rounded-lg"
            style={{
              border: "1px solid #D1D5DB",
              padding: "7px 10px 7px 32px",
              fontSize: "0.82rem",
              fontFamily: "'Be Vietnam Pro',sans-serif",
              color: "#0F172A",
              background: "#fff",
            }}
            onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#D1D5DB"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Tải lại */}
        <button
          onClick={() => { setSearch(""); setFilterVaiTro(""); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ml-auto"
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "0.82rem", color: "#64748B" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <RefreshCw size={13} color="#64748B" />
          Tải lại
        </button>
      </div>

      {/* ── BẢNG ── */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #EEF0F4",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #EEF0F4", background: "#F8F9FA" }}>
                <th style={{ width: 44, padding: "10px 16px" }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    style={{ width: 14, height: 14, accentColor: "#005CB6", cursor: "pointer" }}
                  />
                </th>
                {["STT", "Họ và tên", "Đơn vị", "Tài khoản", "Số điện thoại", "Email", "Vai trò", "Thời gian tạo", "Hành động"].map(col => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 14px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      color: "#64748B",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tk, idx) => (
                <tr
                  key={tk.id}
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    background: selectedIds.has(tk.id) ? "rgba(0,92,182,0.03)" : "#fff",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!selectedIds.has(tk.id)) (e.currentTarget as HTMLTableRowElement).style.background = "#FAFBFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = selectedIds.has(tk.id) ? "rgba(0,92,182,0.03)" : "#fff"; }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "10px 16px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tk.id)}
                      onChange={() => toggleOne(tk.id)}
                      style={{ width: 14, height: 14, accentColor: "#005CB6", cursor: "pointer" }}
                    />
                  </td>

                  {/* STT */}
                  <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#64748B", fontWeight: 500 }}>
                    {idx + 1}
                  </td>

                  {/* Họ và tên */}
                  <td style={{ padding: "10px 14px" }}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 30, height: 30, background: tk.mauAvatar, fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}
                      >
                        {tk.avatar}
                      </div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {tk.hoTen}
                      </span>
                    </div>
                  </td>

                  {/* Đơn vị */}
                  <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#374151" }}>
                    <span style={{ whiteSpace: "nowrap" }}>{tk.donVi}</span>
                  </td>

                  {/* Tài khoản */}
                  <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#005CB6", fontWeight: 500 }}>
                    {tk.taiKhoan}
                  </td>

                  {/* Số điện thoại */}
                  <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#374151" }}>
                    {tk.soDienThoai}
                  </td>

                  {/* Email */}
                  <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#374151" }}>
                    {tk.email}
                  </td>

                  {/* Vai trò */}
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: VAI_TRO_STYLE[tk.vaiTro].color,
                        background: VAI_TRO_STYLE[tk.vaiTro].bg,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {VAI_TRO_LABEL[tk.vaiTro]}
                    </span>
                  </td>

                  {/* Thời gian tạo */}
                  <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: "#64748B", whiteSpace: "nowrap" }}>
                    {tk.thoiGianTao}
                  </td>

                  {/* Hành động */}
                  <td style={{ padding: "10px 14px" }}>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        title="Xem chi tiết"
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Eye size={14} color="#005CB6" />
                      </button>
                      <button
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        title="Chỉnh sửa"
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(2,132,199,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Edit2 size={14} color="#0284C7" />
                      </button>
                      <button
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        title="Xóa"
                        onClick={() => handleDelete(tk.id)}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,24,61,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Trash2 size={14} color="#D4183D" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: "48px 0", textAlign: "center" }}>
                    <UserCircle2 size={36} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
                    <p style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>Không tìm thấy tài khoản nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer bảng */}
          {filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}
            >
              <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                Hiển thị <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> / {data.length} tài khoản
                {selectedIds.size > 0 && <> · <strong style={{ color: "#005CB6" }}>{selectedIds.size} đã chọn</strong></>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}