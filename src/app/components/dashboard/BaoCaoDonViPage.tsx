import { useState, useMemo } from "react";
import {
  BarChart2, Download, Search, X, ChevronRight,
  Building2, User, Gift, Calendar, Clock, CheckCircle2,
  AlertTriangle, Shield,
  FileSpreadsheet, RefreshCw, Info, Eye,
  MapPin,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type LoaiGoi   = "BASIC" | "PLUS" | "VIP";
type LoaiDV    = "Trường học" | "Đại lý";
type TrangThai = "Đang sử dụng" | "Sắp hết hạn" | "Hết hạn";

interface Record {
  id: string;
  stt: number;
  tenDonVi: string;
  loaiDV: LoaiDV;
  diaChi: string;
  loaiGoi: LoaiGoi;
  soLuongDaGan: number;
  soLuongSuDung: number;
  ngayKichHoat: string;
  ngayHetHan: string;
  trangThai: TrangThai;
  maGiaoDichBCCS: string;
  maker: string;
}

// ── DỮ LIỆU MẪU 10 BẢN GHI ───────────────────────────────────────────────────

const DATA: Record[] = [
  {
    id: "1", stt: 1, tenDonVi: "Trường THCS Chu Văn An", loaiDV: "Trường học",
    diaChi: "Tây Hồ, Hà Nội", loaiGoi: "BASIC", soLuongDaGan: 500, soLuongSuDung: 432,
    ngayKichHoat: "01/04/2026", ngayHetHan: "01/04/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260401-001", maker: "Nguyễn Văn Minh",
  },
  {
    id: "2", stt: 2, tenDonVi: "Trường Tiểu học Ba Đình", loaiDV: "Trường học",
    diaChi: "Ba Đình, Hà Nội", loaiGoi: "PLUS", soLuongDaGan: 300, soLuongSuDung: 289,
    ngayKichHoat: "15/03/2026", ngayHetHan: "15/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260315-004", maker: "Trần Minh Đức",
  },
  {
    id: "3", stt: 3, tenDonVi: "Đại lý Hoàn Kiếm A", loaiDV: "Đại lý",
    diaChi: "Hoàn Kiếm, Hà Nội", loaiGoi: "BASIC", soLuongDaGan: 200, soLuongSuDung: 198,
    ngayKichHoat: "10/02/2026", ngayHetHan: "10/02/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260210-002", maker: "Phạm Thị Lan",
  },
  {
    id: "4", stt: 4, tenDonVi: "Trường THPT Đống Đa", loaiDV: "Trường học",
    diaChi: "Đống Đa, Hà Nội", loaiGoi: "PLUS", soLuongDaGan: 420, soLuongSuDung: 401,
    ngayKichHoat: "20/03/2026", ngayHetHan: "20/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260320-007", maker: "Nguyễn Văn Minh",
  },
  {
    id: "5", stt: 5, tenDonVi: "Trường THCS Nghĩa Tân", loaiDV: "Trường học",
    diaChi: "Cầu Giấy, Hà Nội", loaiGoi: "BASIC", soLuongDaGan: 350, soLuongSuDung: 317,
    ngayKichHoat: "05/01/2026", ngayHetHan: "05/04/2026", trangThai: "Sắp hết hạn",
    maGiaoDichBCCS: "BCCS-HN-20260105-003", maker: "Lê Hoàng Nam",
  },
  {
    id: "6", stt: 6, tenDonVi: "Đại lý Cầu Giấy Premium", loaiDV: "Đại lý",
    diaChi: "Cầu Giấy, Hà Nội", loaiGoi: "PLUS", soLuongDaGan: 150, soLuongSuDung: 143,
    ngayKichHoat: "12/03/2026", ngayHetHan: "12/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260312-005", maker: "Vũ Thị Hương",
  },
  {
    id: "7", stt: 7, tenDonVi: "Trường THPT Bắc Từ Liêm", loaiDV: "Trường học",
    diaChi: "Bắc Từ Liêm, Hà Nội", loaiGoi: "BASIC", soLuongDaGan: 480, soLuongSuDung: 455,
    ngayKichHoat: "25/03/2026", ngayHetHan: "25/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260325-009", maker: "Đinh Quang Hải",
  },
  {
    id: "8", stt: 8, tenDonVi: "Trường Tiểu học Đoàn Thị Điểm", loaiDV: "Trường học",
    diaChi: "Nam Từ Liêm, Hà Nội", loaiGoi: "VIP", soLuongDaGan: 120, soLuongSuDung: 118,
    ngayKichHoat: "01/03/2026", ngayHetHan: "01/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260301-006", maker: "Trần Minh Đức",
  },
  {
    id: "9", stt: 9, tenDonVi: "Đại lý Hai Bà Trưng", loaiDV: "Đại lý",
    diaChi: "Hai Bà Trưng, Hà Nội", loaiGoi: "BASIC", soLuongDaGan: 250, soLuongSuDung: 0,
    ngayKichHoat: "10/01/2025", ngayHetHan: "10/01/2026", trangThai: "Hết hạn",
    maGiaoDichBCCS: "BCCS-HN-20250110-012", maker: "Phạm Thị Lan",
  },
  {
    id: "10", stt: 10, tenDonVi: "Trường THCS Từ Liêm", loaiDV: "Trường học",
    diaChi: "Nam Từ Liêm, Hà Nội", loaiGoi: "PLUS", soLuongDaGan: 380, soLuongSuDung: 362,
    ngayKichHoat: "18/03/2026", ngayHetHan: "18/03/2027", trangThai: "Đang sử dụng",
    maGiaoDichBCCS: "BCCS-HN-20260318-010", maker: "Lê Hoàng Nam",
  },
];

// ── CONFIG ─────────────────────────────────────────────────────────────────────

const LOAI_GOI_CFG: Record<LoaiGoi, { color: string; bg: string; border: string; grad: string }> = {
  BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.22)",  grad: "linear-gradient(90deg,#0284C7,#38BDF8)" },
  PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)", border: "rgba(124,58,237,0.22)", grad: "linear-gradient(90deg,#7C3AED,#A78BFA)" },
  VIP:   { color: "#D97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.22)",  grad: "linear-gradient(90deg,#D97706,#FCD34D)" },
};

const TRANG_THAI_CFG: Record<TrangThai, { color: string; bg: string; border: string; dot: string }> = {
  "Đang sử dụng": { color: "#0F766E", bg: "rgba(15,118,110,0.09)", border: "rgba(15,118,110,0.25)", dot: "#0F766E" },
  "Sắp hết hạn":  { color: "#D97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.25)",  dot: "#D97706" },
  "Hết hạn":      { color: "#9CA3AF", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.25)", dot: "#9CA3AF" },
};

const fmtSL = (n: number) => n.toLocaleString("vi-VN");

// ── MODAL CHI TIẾT ─────────────────────────────────────────────────────────────

function ModalChiTiet({ row, onClose }: { row: Record; onClose: () => void }) {
  const goi  = LOAI_GOI_CFG[row.loaiGoi];
  const tt   = TRANG_THAI_CFG[row.trangThai];
  const pctSD = row.soLuongDaGan > 0 ? (row.soLuongSuDung / row.soLuongDaGan) * 100 : 0;
  const conLai = row.soLuongDaGan - row.soLuongSuDung;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: 500, background: "#fff", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", fontFamily: "'Be Vietnam Pro',sans-serif", overflow: "hidden", animation: "popIn 0.25s ease" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#003D7A,#0074E4)", padding: "20px 24px" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {row.loaiDV === "Trường học" ? <Building2 size={20} color="#fff" /> : <User size={20} color="#fff" />}
              </div>
              <div>
                <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>{row.loaiDV}</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{row.tenDonVi}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{row.diaChi}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={13} color="#fff" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mã BCCS */}
          <div style={{ background: "rgba(0,92,182,0.05)", border: "1.5px solid rgba(0,92,182,0.15)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Mã giao dịch BCCS</div>
            <code style={{ fontSize: "0.78rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6" }}>{row.maGiaoDichBCCS}</code>
          </div>

          {/* Grid info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Loại gói", val: <span style={{ fontSize: "0.85rem", fontWeight: 800, color: goi.color }}>{row.loaiGoi}</span> },
              { label: "Trạng thái", val: <span style={{ fontSize: "0.82rem", fontWeight: 700, color: tt.color }}>{row.trangThai}</span> },
              { label: "Ngày kích hoạt", val: row.ngayKichHoat },
              { label: "Ngày hết hạn", val: row.ngayHetHan },
              { label: "Maker thực hiện", val: row.maker },
              { label: "Số lượng đã gán", val: <strong style={{ color: "#005CB6" }}>{fmtSL(row.soLuongDaGan)}</strong> },
            ].map(item => (
              <div key={item.label} style={{ background: "#F8FAFB", border: "1px solid #EEF0F4", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
                <div style={{ fontSize: "0.82rem", color: "#1E293B" }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Sử dụng */}
          <div style={{ background: "#F8FAFB", border: "1px solid #EEF0F4", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#334155", marginBottom: 10 }}>Tình trạng sử dụng license</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Đã sử dụng: <strong style={{ color: "#005CB6" }}>{fmtSL(row.soLuongSuDung)}</strong></span>
              <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Còn lại: <strong style={{ color: "#0F766E" }}>{fmtSL(conLai)}</strong></span>
            </div>
            <div style={{ height: 10, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pctSD}%`, background: pctSD > 90 ? "linear-gradient(90deg,#D4183D,#EF4444)" : pctSD > 70 ? "linear-gradient(90deg,#D97706,#F59E0B)" : "linear-gradient(90deg,#005CB6,#0284C7)", borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 6, textAlign: "right" }}>{pctSD.toFixed(1)}% đã dùng</div>
          </div>
        </div>

        <div style={{ padding: "12px 24px", borderTop: "1px solid #EEF0F4", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 22px", borderRadius: 10, background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ────────────────────────────────────────────────────────────

export function BaoCaoDonViPage() {
  const [search,       setSearch]       = useState("");
  const [locGoi,       setLocGoi]       = useState<LoaiGoi | "">("");
  const [locTT,        setLocTT]        = useState<TrangThai | "">("");
  const [locLoaiDV,    setLocLoaiDV]    = useState<LoaiDV | "">("");
  const [selectedRow,  setSelectedRow]  = useState<Record | null>(null);
  const [refreshing,   setRefreshing]   = useState(false);
  const [exportAnim,   setExportAnim]   = useState(false);

  const filtered = useMemo(() => {
    return DATA.filter(row => {
      const kwOk  = !search || row.tenDonVi.toLowerCase().includes(search.toLowerCase()) || row.maGiaoDichBCCS.toLowerCase().includes(search.toLowerCase());
      const goiOk = !locGoi || row.loaiGoi === locGoi;
      const ttOk  = !locTT  || row.trangThai === locTT;
      const dvOk  = !locLoaiDV || row.loaiDV === locLoaiDV;
      return kwOk && goiOk && ttOk && dvOk;
    });
  }, [search, locGoi, locTT, locLoaiDV]);

  const sapHH = filtered.filter(r => r.trangThai === "Sắp hết hạn").length;

  function handleExport() {
    setExportAnim(true);
    setTimeout(() => setExportAnim(false), 2000);
    const headers = ["STT", "Tên đơn vị", "Loại DV", "Địa chỉ", "Loại gói", "Số lượng đã gán", "Số lượng sử dụng", "Ngày kích hoạt", "Ngày hết hạn", "Trạng thái", "Mã GD BCCS", "Maker"];
    const rows = filtered.map(r => [r.stt, r.tenDonVi, r.loaiDV, r.diaChi, r.loaiGoi, r.soLuongDaGan, r.soLuongSuDung, r.ngayKichHoat, r.ngayHetHan, r.trangThai, r.maGiaoDichBCCS, r.maker]);
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `BaoCao_License_ViettelHaNoi_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  const hasFilter = !!(search || locGoi || locTT || locLoaiDV);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Trang chủ</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#005CB6", fontWeight: 600 }}>Báo cáo đơn vị</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                <BarChart2 size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Báo cáo sử dụng License</h1>
                <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 3 }}>Viettel Hà Nội · Cập nhật 01/04/2026 · 08:45</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {sapHH > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(217,119,6,0.08)", border: "1.5px solid rgba(217,119,6,0.25)" }}>
                <AlertTriangle size={13} color="#D97706" />
                <span style={{ fontSize: "0.77rem", fontWeight: 700, color: "#D97706" }}>
                  {sapHH} đơn vị sắp hết hạn
                </span>
              </div>
            )}
            <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Làm mới
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: exportAnim ? "linear-gradient(135deg,#0F766E,#10B981)" : "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.81rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 3px 12px rgba(0,92,182,0.3)", transition: "background 0.3s" }}>
              {exportAnim
                ? <><CheckCircle2 size={14} /> Đã xuất!</>
                : <><FileSpreadsheet size={14} /> Xuất Excel</>}
            </button>
          </div>
        </div>

        {/* ── BANNER TỔNG QUAN ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(130deg,#003D7A 0%,#005CB6 45%,#0074E4 100%)", boxShadow: "0 6px 28px rgba(0,92,182,0.28)" }}>
          <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5">
            <div className="flex items-center gap-4">
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={24} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "0.63rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Checker · Viettel Hà Nội</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>Lê Thị Mai Phương</div>
                <div style={{ fontSize: "0.71rem", color: "rgba(255,255,255,0.7)", marginTop: 3 }}>Phạm vi quản lý: Hà Nội & vùng phụ cận · {DATA.length} đơn vị trực thuộc</div>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { label: "Tổng đã gán",   val: fmtSL(DATA.reduce((s,r)=>s+r.soLuongDaGan,0)),  sub: "license" },
                { label: "Đang sử dụng",  val: fmtSL(DATA.reduce((s,r)=>s+r.soLuongSuDung,0)), sub: "license" },
                { label: "Tỷ lệ dùng",   val: (DATA.reduce((s,r)=>s+r.soLuongSuDung,0)/DATA.reduce((s,r)=>s+r.soLuongDaGan,0)*100).toFixed(1)+"%", sub: "trung bình" },
                { label: "Đơn vị hoạt động", val: DATA.filter(r=>r.trangThai==="Đang sử dụng").length.toString(), sub: `/ ${DATA.length} tổng` },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#fff" }}>{s.val}</div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{s.label}</div>
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.4)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BỘ LỌC + BẢNG ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

          {/* Thanh lọc */}
          <div className="flex items-center gap-3 flex-wrap px-5 py-4" style={{ borderBottom: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            {/* Search */}
            <div className="relative flex items-center flex-1" style={{ minWidth: 200 }}>
              <Search size={13} color="#94A3B8" style={{ position: "absolute", left: 12, pointerEvents: "none" }} />
              <input type="text" placeholder="Tìm tên đơn vị, mã BCCS…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", border: "1.5px solid #EEF0F4", borderRadius: 10, padding: "8px 28px 8px 34px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro'", outline: "none" }}
                onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#EEF0F4"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer" }}><X size={12} color="#94A3B8" /></button>}
            </div>

            {/* Lọc gói */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0" }}>
              {(["", "BASIC", "PLUS", "VIP"] as (LoaiGoi | "")[]).map(g => {
                const sel = locGoi === g;
                const cfg = g ? LOAI_GOI_CFG[g as LoaiGoi] : null;
                return (
                  <button key={g || "all"} onClick={() => setLocGoi(g as any)}
                    style={{ padding: "5px 10px", borderRadius: 8, background: sel ? (cfg?.color ?? "#005CB6") : "transparent", color: sel ? "#fff" : (cfg?.color ?? "#64748B"), border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'" }}>
                    {g || "Tất cả"}
                  </button>
                );
              })}
            </div>

            {/* Lọc loại DV */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0" }}>
              {(["", "Trường học", "Đại lý"] as (LoaiDV | "")[]).map(dv => {
                const sel = locLoaiDV === dv;
                return (
                  <button key={dv || "all"} onClick={() => setLocLoaiDV(dv as any)}
                    style={{ padding: "5px 10px", borderRadius: 8, background: sel ? "#005CB6" : "transparent", color: sel ? "#fff" : "#64748B", border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
                    {dv || "Tất cả"}
                  </button>
                );
              })}
            </div>

            {/* Lọc trạng thái */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0" }}>
              {([
                { key: "", label: "Tất cả", color: "#64748B" },
                { key: "Đang sử dụng", label: "Đang HĐ", color: "#0F766E" },
                { key: "Sắp hết hạn",  label: "Sắp HH",  color: "#D97706" },
                { key: "Hết hạn",      label: "Hết HH",  color: "#9CA3AF" },
              ] as {key:string,label:string,color:string}[]).map(opt => {
                const sel = locTT === opt.key;
                return (
                  <button key={opt.key} onClick={() => setLocTT(opt.key as any)}
                    style={{ padding: "5px 10px", borderRadius: 8, background: sel ? opt.color : "transparent", color: sel ? "#fff" : opt.color, border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {hasFilter && (
              <button onClick={() => { setSearch(""); setLocGoi(""); setLocTT(""); setLocLoaiDV(""); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{ background: "rgba(212,24,61,0.07)", border: "1.5px solid rgba(212,24,61,0.2)", color: "#D4183D", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                <X size={12} /> Xóa lọc
              </button>
            )}

            <span style={{ fontSize: "0.77rem", color: "#94A3B8", marginLeft: "auto" }}>
              <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> / {DATA.length} bản ghi
            </span>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {["STT", "Tên Trường / Đại lý", "Loại gói", "Số lượng đã gán", "Sử dụng", "Tỷ lệ", "Ngày kích hoạt", "Ngày hết hạn", "Trạng thái", "Mã GD BCCS", "Thao tác"].map((col, i) => (
                    <th key={i} style={{ padding: "10px 13px", textAlign: "left", fontSize: "0.59rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: "52px 16px", textAlign: "center" }}>
                      <div className="flex flex-col items-center gap-3">
                        <Search size={36} color="#E2E8F0" />
                        <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Không tìm thấy bản ghi phù hợp</p>
                        <button onClick={() => { setSearch(""); setLocGoi(""); setLocTT(""); setLocLoaiDV(""); }}
                          style={{ fontSize: "0.8rem", color: "#005CB6", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Be Vietnam Pro'" }}>
                          Xóa bộ lọc
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((row, idx) => {
                  const goi   = LOAI_GOI_CFG[row.loaiGoi];
                  const tt    = TRANG_THAI_CFG[row.trangThai];
                  const pctSD = row.soLuongDaGan > 0 ? (row.soLuongSuDung / row.soLuongDaGan * 100) : 0;
                  const isLast = idx === filtered.length - 1;
                  const isSapHH = row.trangThai === "Sắp hết hạn";
                  const isHH    = row.trangThai === "Hết hạn";
                  return (
                    <tr key={row.id}
                      onClick={() => setSelectedRow(row)}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${isSapHH ? "#D97706" : isHH ? "#9CA3AF" : "#E2E8F0"}`,
                        background: isSapHH ? "rgba(217,119,6,0.015)" : isHH ? "rgba(156,163,175,0.06)" : "transparent",
                        cursor: "pointer", transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = isSapHH ? "rgba(217,119,6,0.015)" : isHH ? "rgba(156,163,175,0.06)" : "transparent")}>

                      {/* STT */}
                      <td style={{ padding: "13px 13px" }}>
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(0,92,182,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#005CB6" }}>{row.stt}</span>
                        </div>
                      </td>

                      {/* Tên đơn vị */}
                      <td style={{ padding: "13px 13px" }}>
                        <div className="flex items-center gap-2.5">
                          <div style={{ width: 30, height: 30, borderRadius: 10, background: row.loaiDV === "Trường học" ? "rgba(0,92,182,0.1)" : "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {row.loaiDV === "Trường học" ? <Building2 size={13} color="#005CB6" /> : <User size={13} color="#7C3AED" />}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "#1E293B" }}>{row.tenDonVi}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <MapPin size={9} color="#CBD5E1" />
                              <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>{row.diaChi}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Loại gói */}
                      <td style={{ padding: "13px 13px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.67rem", fontWeight: 800, color: goi.color, background: goi.bg, border: `1px solid ${goi.border}`, padding: "3px 10px", borderRadius: 999 }}>
                          <Gift size={9} /> {row.loaiGoi}
                        </span>
                      </td>

                      {/* Số lượng đã gán */}
                      <td style={{ padding: "13px 13px" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 900, color: "#0F172A" }}>{fmtSL(row.soLuongDaGan)}</span>
                        <span style={{ fontSize: "0.6rem", color: "#94A3B8", marginLeft: 2 }}>lic</span>
                      </td>

                      {/* Sử dụng */}
                      <td style={{ padding: "13px 13px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isHH ? "#9CA3AF" : "#005CB6" }}>
                          {isHH ? "—" : fmtSL(row.soLuongSuDung)}
                        </span>
                      </td>

                      {/* Tỷ lệ */}
                      <td style={{ padding: "13px 13px", minWidth: 90 }}>
                        {!isHH ? (
                          <div>
                            <div style={{ height: 6, background: "#EEF0F4", borderRadius: 999, overflow: "hidden", marginBottom: 3 }}>
                              <div style={{ height: "100%", width: `${pctSD}%`, background: pctSD > 90 ? "linear-gradient(90deg,#D4183D,#EF4444)" : pctSD > 70 ? "linear-gradient(90deg,#D97706,#F59E0B)" : "linear-gradient(90deg,#005CB6,#0284C7)", borderRadius: 999 }} />
                            </div>
                            <span style={{ fontSize: "0.63rem", fontWeight: 700, color: pctSD > 90 ? "#D4183D" : "#64748B" }}>{pctSD.toFixed(0)}%</span>
                          </div>
                        ) : <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>—</span>}
                      </td>

                      {/* Ngày kích hoạt */}
                      <td style={{ padding: "13px 13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Calendar size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.77rem", color: "#64748B" }}>{row.ngayKichHoat}</span>
                        </div>
                      </td>

                      {/* Ngày hết hạn */}
                      <td style={{ padding: "13px 13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Clock size={11} color={isSapHH ? "#D97706" : isHH ? "#9CA3AF" : "#94A3B8"} />
                          <span style={{ fontSize: "0.77rem", color: isSapHH ? "#D97706" : isHH ? "#9CA3AF" : "#64748B", fontWeight: isSapHH ? 700 : 400 }}>{row.ngayHetHan}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td style={{ padding: "13px 13px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.67rem", fontWeight: 800, color: tt.color, background: tt.bg, border: `1px solid ${tt.border}`, padding: "4px 10px", borderRadius: 999 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: tt.dot, display: "inline-block" }} />
                          {row.trangThai}
                        </span>
                      </td>

                      {/* Mã BCCS */}
                      <td style={{ padding: "13px 13px" }}>
                        <code style={{ fontSize: "0.67rem", fontFamily: "monospace", color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 7px", borderRadius: 5 }}>
                          {row.maGiaoDichBCCS}
                        </code>
                      </td>

                      {/* Thao tác */}
                      <td style={{ padding: "13px 10px" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedRow(row)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: "rgba(0,92,182,0.07)", border: "1.5px solid rgba(0,92,182,0.2)", color: "#005CB6", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                          <Eye size={11} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 flex-wrap gap-3"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <Info size={12} color="#94A3B8" />
                <span style={{ fontSize: "0.71rem", color: "#94A3B8" }}>Nhấn vào dòng để xem chi tiết</span>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: "Đang HĐ", c: "#0F766E" },
                  { label: "Sắp HH",  c: "#D97706" },
                  { label: "Hết HH",  c: "#9CA3AF" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.c, display: "inline-block" }} />
                    <span style={{ fontSize: "0.68rem", color: "#64748B" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                Tổng: <strong style={{ color: "#005CB6" }}>{fmtSL(filtered.reduce((s,r)=>s+r.soLuongDaGan,0))}</strong> license đã gán
              </span>
              <button onClick={handleExport}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 10, background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 2px 10px rgba(0,92,182,0.28)" }}>
                <Download size={12} /> Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* ── GHI CHÚ NGHIỆP VỤ ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: CheckCircle2, color: "#0F766E", bg: "rgba(15,118,110,0.07)", title: "Đang sử dụng", desc: "License đang trong thời hạn hợp đồng. Đơn vị đang khai thác nền tảng K12Online bình thường." },
            { icon: AlertTriangle, color: "#D97706", bg: "rgba(217,119,6,0.07)",  title: "Sắp hết hạn (≤30 ngày)", desc: "Checker cần liên hệ đơn vị và Maker để gia hạn hoặc tạo lệnh gán mới trước khi hết hạn." },
            { icon: Clock,        color: "#9CA3AF", bg: "rgba(156,163,175,0.07)", title: "Hết hạn", desc: "License đã hết hạn, đơn vị không thể truy cập nội dung. Cần tạo lệnh gán mới để kích hoạt lại." },
          ].map(s => {
            const SIc = s.icon;
            return (
              <div key={s.title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SIc size={16} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRow && (
        <ModalChiTiet row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

      <style>{`
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
