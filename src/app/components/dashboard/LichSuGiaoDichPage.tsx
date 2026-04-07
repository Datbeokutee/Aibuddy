import { useState, useMemo } from "react";
import {
  History, Search, X, Filter, CheckCircle2, Clock, XCircle,
  Eye, Hash, Calendar, Package, Building2, FileText,
  ChevronDown, Download, RefreshCw, AlertTriangle, Info,
  ArrowUpDown, SlidersHorizontal, MapPin, User, Gift,
  ShieldCheck, Lock, TrendingUp, BarChart2, Activity,
  ChevronRight, Layers, ClipboardList, MessageSquare,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type TrangThai = "Đã duyệt" | "Chờ duyệt" | "Từ chối";
type LoaiGoi   = "BASIC" | "PLUS" | "VIP";
type LoaiDV    = "Trường học" | "Đại lý";

interface LenhGan {
  id: string;
  maLenh: string;
  doiTuongNhan: string;
  loaiDV: LoaiDV;
  diaChi: string;
  loaiGoi: LoaiGoi;
  soLuong: number;
  ngayTao: string;
  trangThai: TrangThai;
  ghiChu?: string;
  nguoiDuyet?: string;
  ngayDuyet?: string;
  maGiaoDich?: string;
}

// ── DỮ LIỆU MẪU 10 BẢN GHI ───────────────────────────────────────────────────

const DU_LIEU: LenhGan[] = [
  {
    id: "1", maLenh: "LG-CG-001", doiTuongNhan: "Trường THCS Dịch Vọng",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "BASIC", soLuong: 100, ngayTao: "01/04/2026",
    trangThai: "Đã duyệt", nguoiDuyet: "Trần Thị Hoa", ngayDuyet: "01/04/2026",
    maGiaoDich: "GD-CG-2026-001",
  },
  {
    id: "2", maLenh: "LG-CG-002", doiTuongNhan: "Đại lý A1",
    loaiDV: "Đại lý", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS", soLuong: 50, ngayTao: "01/04/2026",
    trangThai: "Chờ duyệt",
  },
  {
    id: "3", maLenh: "LG-CG-003", doiTuongNhan: "Trường Tiểu học Mai Dịch",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "BASIC", soLuong: 200, ngayTao: "02/04/2026",
    trangThai: "Từ chối", ghiChu: "Sai đối tượng nhận — Đơn vị này không thuộc phạm vi phân phối của Chi nhánh Cầu Giấy.",
    nguoiDuyet: "Trần Thị Hoa", ngayDuyet: "02/04/2026",
  },
  {
    id: "4", maLenh: "LG-CG-004", doiTuongNhan: "Trường THPT Cầu Giấy",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS", soLuong: 80, ngayTao: "02/04/2026",
    trangThai: "Đã duyệt", nguoiDuyet: "Nguyễn Văn An", ngayDuyet: "03/04/2026",
    maGiaoDich: "GD-CG-2026-002",
  },
  {
    id: "5", maLenh: "LG-CG-005", doiTuongNhan: "Đại lý Hà Đông",
    loaiDV: "Đại lý", diaChi: "Hà Đông, Hà Nội",
    loaiGoi: "VIP", soLuong: 30, ngayTao: "03/04/2026",
    trangThai: "Từ chối", ghiChu: "Vượt hạn mức khả dụng — Số lượng yêu cầu (30) vượt hạn mức còn lại (15) tại thời điểm gán.",
    nguoiDuyet: "Trần Thị Hoa", ngayDuyet: "03/04/2026",
  },
  {
    id: "6", maLenh: "LG-CG-006", doiTuongNhan: "Trường THCS Nghĩa Tân",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "BASIC", soLuong: 150, ngayTao: "03/04/2026",
    trangThai: "Đã duyệt", nguoiDuyet: "Nguyễn Văn An", ngayDuyet: "04/04/2026",
    maGiaoDich: "GD-CG-2026-003",
  },
  {
    id: "7", maLenh: "LG-CG-007", doiTuongNhan: "Trường THCS Mai Dịch",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS", soLuong: 60, ngayTao: "04/04/2026",
    trangThai: "Chờ duyệt",
  },
  {
    id: "8", maLenh: "LG-CG-008", doiTuongNhan: "Đại lý Cầu Giấy B",
    loaiDV: "Đại lý", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "BASIC", soLuong: 120, ngayTao: "04/04/2026",
    trangThai: "Đã duyệt", nguoiDuyet: "Trần Thị Hoa", ngayDuyet: "05/04/2026",
    maGiaoDich: "GD-CG-2026-004",
  },
  {
    id: "9", maLenh: "LG-CG-009", doiTuongNhan: "Trường THPT Yên Hòa",
    loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS", soLuong: 40, ngayTao: "05/04/2026",
    trangThai: "Từ chối", ghiChu: "Thông tin không hợp lệ — Gói PLUS không áp dụng cho cấp Tiểu học. Vui lòng chọn lại loại gói phù hợp.",
    nguoiDuyet: "Nguyễn Văn An", ngayDuyet: "05/04/2026",
  },
  {
    id: "10", maLenh: "LG-CG-010", doiTuongNhan: "Trường Tiểu học Đoàn Thị Điểm",
    loaiDV: "Trường học", diaChi: "Nam Từ Liêm, Hà Nội",
    loaiGoi: "BASIC", soLuong: 90, ngayTao: "05/04/2026",
    trangThai: "Chờ duyệt",
  },
];

// ── CONFIG ────────────────────────────────────────────────────────────────────

const TRANG_THAI_CFG: Record<TrangThai, {
  color: string; bg: string; border: string; icon: React.ElementType; dot: string; rowBorder: string;
}> = {
  "Đã duyệt":  { color: "#0F766E", bg: "rgba(15,118,110,0.1)",  border: "rgba(15,118,110,0.25)",  icon: CheckCircle2, dot: "#0F766E", rowBorder: "transparent" },
  "Chờ duyệt": { color: "#D97706", bg: "rgba(217,119,6,0.1)",   border: "rgba(217,119,6,0.25)",   icon: Clock,        dot: "#D97706", rowBorder: "#D97706"     },
  "Từ chối":   { color: "#D4183D", bg: "rgba(212,24,61,0.1)",   border: "rgba(212,24,61,0.25)",   icon: XCircle,      dot: "#D4183D", rowBorder: "#D4183D"     },
};

const LOAI_GOI_CFG: Record<LoaiGoi, { color: string; bg: string; border: string }> = {
  BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.22)"  },
  PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)", border: "rgba(124,58,237,0.22)" },
  VIP:   { color: "#D97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.22)"  },
};

const fmtSL = (n: number) => n.toLocaleString("vi-VN");

// ── DRAWER CHI TIẾT ───────────────────────────────────────────────────────────

function DrawerChiTiet({ row, onClose }: { row: LenhGan; onClose: () => void }) {
  const ts  = TRANG_THAI_CFG[row.trangThai];
  const lg  = LOAI_GOI_CFG[row.loaiGoi];
  const TsIcon = ts.icon;

  const headerBg =
    row.trangThai === "Từ chối"   ? "linear-gradient(135deg,#D4183D,#E53E3E)" :
    row.trangThai === "Chờ duyệt" ? "linear-gradient(135deg,#D97706,#F59E0B)" :
    "linear-gradient(135deg,#005CB6,#0074E4)";

  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex flex-col h-full" style={{ width: 460, background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", fontFamily: "'Be Vietnam Pro',sans-serif", animation: "drawerIn 0.25s ease" }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ background: headerBg }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
                <TsIcon size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.72)", textTransform: "uppercase" }}>Chi tiết lệnh gán</div>
                <code style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{row.maLenh}</code>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}>
              <X size={14} color="#fff" />
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.2)", fontSize: "0.74rem", fontWeight: 700, color: "#fff" }}>
            <TsIcon size={11} color="#fff" /> {row.trangThai}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Lý do từ chối */}
          {row.trangThai === "Từ chối" && row.ghiChu && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl" style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.22)" }}>
              <AlertTriangle size={15} color="#D4183D" className="flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ fontSize: "0.77rem", fontWeight: 800, color: "#D4183D", marginBottom: 5 }}>Lý do từ chối</p>
                <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.7 }}>{row.ghiChu}</p>
              </div>
            </div>
          )}

          {/* Chờ duyệt info */}
          {row.trangThai === "Chờ duyệt" && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl" style={{ background: "rgba(217,119,6,0.06)", border: "1.5px solid rgba(217,119,6,0.22)" }}>
              <Clock size={14} color="#D97706" className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.65 }}>
                Lệnh đang chờ <strong style={{ color: "#D97706" }}>Checker</strong> xem xét và phê duyệt. Thời gian xử lý thông thường trong vòng 24 giờ.
              </p>
            </div>
          )}

          {/* Mã giao dịch */}
          {row.maGiaoDich && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl" style={{ background: "rgba(0,92,182,0.05)", border: "1px solid rgba(0,92,182,0.15)" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} color="#005CB6" />
                <span style={{ fontSize: "0.74rem", color: "#64748B" }}>Mã giao dịch BCCS</span>
              </div>
              <code style={{ fontSize: "0.82rem", fontWeight: 800, color: "#005CB6", fontFamily: "monospace" }}>{row.maGiaoDich}</code>
            </div>
          )}

          {/* Thông tin lệnh */}
          <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
            <p style={{ fontSize: "0.64rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Thông tin lệnh gán</p>
            {[
              { label: "Đối tượng nhận", val: row.doiTuongNhan,                               icon: row.loaiDV === "Trường học" ? Building2 : User },
              { label: "Loại hình",      val: row.loaiDV,                                      icon: Layers     },
              { label: "Địa chỉ",       val: row.diaChi,                                      icon: MapPin     },
              { label: "Loại gói",      val: row.loaiGoi,                                     icon: Gift       },
              { label: "Số lượng",      val: `${fmtSL(row.soLuong)} license`,                 icon: Hash       },
              { label: "Ngày tạo",      val: row.ngayTao,                                     icon: Calendar   },
            ].map(item => {
              const IIcon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <IIcon size={13} color="#94A3B8" />
                    <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "0.79rem", fontWeight: 700, color: "#1E293B" }}>{item.val}</span>
                </div>
              );
            })}
          </div>

          {/* Thông tin duyệt */}
          {(row.nguoiDuyet || row.ngayDuyet) && (
            <div className="rounded-2xl p-4 space-y-2.5" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
              <p style={{ fontSize: "0.64rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Thông tin xử lý</p>
              {[
                { label: "Checker phụ trách", val: row.nguoiDuyet ?? "—", icon: User     },
                { label: "Ngày xử lý",        val: row.ngayDuyet  ?? "—", icon: Calendar },
              ].map(item => {
                const IIcon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <IIcon size={13} color="#94A3B8" />
                      <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: "0.79rem", fontWeight: 700, color: "#1E293B" }}>{item.val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ghi chú (Từ chối) */}
          {row.trangThai !== "Từ chối" && row.ghiChu && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(0,92,182,0.04)", border: "1px solid rgba(0,92,182,0.12)" }}>
              <Info size={13} color="#005CB6" className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.71rem", color: "#374151", lineHeight: 1.65 }}>{row.ghiChu}</p>
            </div>
          )}

          {/* Hướng dẫn hành động tiếp theo */}
          {row.trangThai === "Từ chối" && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(0,92,182,0.04)", border: "1.5px solid rgba(0,92,182,0.15)" }}>
              <Info size={13} color="#005CB6" className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.7rem", color: "#374151", lineHeight: 1.65 }}>
                <strong style={{ color: "#005CB6" }}>Hành động tiếp theo:</strong> Vui lòng kiểm tra lại thông tin và tạo lệnh gán mới từ menu <em>Chia sẻ gói</em> với thông tin đã chỉnh sửa.
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex-shrink-0 flex gap-3" style={{ borderTop: "1px solid #EEF0F4" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl"
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
            Đóng
          </button>
          {row.trangThai === "Từ chối" && (
            <button className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 12px rgba(0,92,182,0.3)" }}>
              <ClipboardList size={14} /> Tạo lệnh mới
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ────────────────────────────────────────────────────────────

export function LichSuGiaoDichPage() {
  const [tuKhoa,    setTuKhoa]    = useState("");
  const [locTS,     setLocTS]     = useState<TrangThai | "">("");
  const [locGoi,    setLocGoi]    = useState<LoaiGoi | "">("");
  const [locTuNgay, setLocTuNgay] = useState("");
  const [locDenNgay,setLocDenNgay]= useState("");
  const [drawer,    setDrawer]    = useState<LenhGan | null>(null);
  const [sortKey,   setSortKey]   = useState<"soLuong" | "ngayTao" | "">("");
  const [sortAsc,   setSortAsc]   = useState(false);
  const [showFilter,setShowFilter]= useState(false);
  const [refreshing,setRefreshing]= useState(false);

  // parse ngày dd/mm/yyyy → Date
  const parseDate = (s: string) => {
    if (!s) return null;
    const [d, m, y] = s.split("/");
    return new Date(+y, +m - 1, +d);
  };

  const daDaLoc = useMemo(() => {
    return DU_LIEU.filter(row => {
      const keywordOk = !tuKhoa ||
        row.doiTuongNhan.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        row.maLenh.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        (row.maGiaoDich ?? "").toLowerCase().includes(tuKhoa.toLowerCase());
      const tsOk   = !locTS  || row.trangThai === locTS;
      const goiOk  = !locGoi || row.loaiGoi   === locGoi;
      const rowDate = parseDate(row.ngayTao);
      const tuNgay  = locTuNgay  ? new Date(locTuNgay)  : null;
      const denNgay = locDenNgay ? new Date(locDenNgay) : null;
      const dateOk  = (!tuNgay || (rowDate && rowDate >= tuNgay)) &&
                      (!denNgay || (rowDate && rowDate <= denNgay));
      return keywordOk && tsOk && goiOk && dateOk;
    }).sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "soLuong") return sortAsc ? a.soLuong - b.soLuong : b.soLuong - a.soLuong;
      if (sortKey === "ngayTao") {
        const da = parseDate(a.ngayTao)?.getTime() ?? 0;
        const db = parseDate(b.ngayTao)?.getTime() ?? 0;
        return sortAsc ? da - db : db - da;
      }
      return 0;
    });
  }, [tuKhoa, locTS, locGoi, locTuNgay, locDenNgay, sortKey, sortAsc]);

  const handleSort = (key: "soLuong" | "ngayTao") => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const handleReset = () => {
    setTuKhoa(""); setLocTS(""); setLocGoi(""); setLocTuNgay(""); setLocDenNgay("");
  };

  const coBoLoc = tuKhoa || locTS || locGoi || locTuNgay || locDenNgay;

  // Thống kê
  const tongDaDuyet  = DU_LIEU.filter(r => r.trangThai === "Đã duyệt").length;
  const tongChoDuyet = DU_LIEU.filter(r => r.trangThai === "Chờ duyệt").length;
  const tongTuChoi   = DU_LIEU.filter(r => r.trangThai === "Từ chối").length;
  const tongSoLuong  = DU_LIEU.reduce((s, r) => s + r.soLuong, 0);
  const tongDaGan    = DU_LIEU.filter(r => r.trangThai === "Đã duyệt").reduce((s, r) => s + r.soLuong, 0);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Trang chủ</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#005CB6", fontWeight: 600 }}>Lịch sử giao dịch</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                <History size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Lịch sử giao dịch</h1>
                <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 3 }}>
                  Chi nhánh Cầu Giấy · Toàn bộ lệnh gán tháng 04/2026
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: showFilter ? "rgba(0,92,182,0.08)" : "#fff", border: `1.5px solid ${showFilter ? "#005CB6" : "#EEF0F4"}`, color: showFilter ? "#005CB6" : "#374151", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <SlidersHorizontal size={14} /> Bộ lọc nâng cao
              {coBoLoc && <span className="w-2 h-2 rounded-full" style={{ background: "#D4183D" }} />}
            </button>
            <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Làm mới
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 14px rgba(0,92,182,0.3)" }}>
              <Download size={14} /> Xuất Excel
            </button>
          </div>
        </div>

        {/* ── 5 KPI CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Tổng lệnh gán",    val: DU_LIEU.length,  icon: ClipboardList, color: "#005CB6", bg: "rgba(0,92,182,0.08)",    sub: "Toàn bộ" },
            { label: "Đã duyệt",         val: tongDaDuyet,     icon: CheckCircle2,  color: "#0F766E", bg: "rgba(15,118,110,0.08)",  sub: `${((tongDaDuyet/DU_LIEU.length)*100).toFixed(0)}%` },
            { label: "Chờ duyệt",        val: tongChoDuyet,    icon: Clock,         color: "#D97706", bg: "rgba(217,119,6,0.08)",   sub: "Đang xử lý" },
            { label: "Bị từ chối",       val: tongTuChoi,      icon: XCircle,       color: "#D4183D", bg: "rgba(212,24,61,0.08)",   sub: "Cần chỉnh sửa" },
            { label: "License đã gán",   val: fmtSL(tongDaGan),icon: TrendingUp,    color: "#7C3AED", bg: "rgba(124,58,237,0.08)", sub: `/ ${fmtSL(tongSoLuong)} yêu cầu` },
          ].map(s => {
            const SIc = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: s.bg }}>
                  <SIc size={17} color={s.color} />
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
                  <div style={{ fontSize: "0.62rem", color: s.color, fontWeight: 600, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MINI STATUS BARS ── */}
        <div className="flex items-stretch gap-3">
          {([["Đã duyệt", tongDaDuyet], ["Chờ duyệt", tongChoDuyet], ["Từ chối", tongTuChoi]] as [TrangThai, number][]).map(([ts, count]) => {
            const cfg = TRANG_THAI_CFG[ts];
            const TIc = cfg.icon;
            return (
              <button key={ts} onClick={() => setLocTS(locTS === ts ? "" : ts)}
                className="flex-1 flex items-center gap-3 p-3.5 rounded-2xl transition-all"
                style={{ background: locTS === ts ? cfg.bg : "#fff", border: `1.5px solid ${locTS === ts ? cfg.color + "44" : "#EEF0F4"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0" style={{ background: `${cfg.color}12` }}>
                  <TIc size={16} color={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#0F172A" }}>{ts}</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: 900, color: cfg.color }}>{count}</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "#EEF0F4" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / DU_LIEU.length) * 100}%`, background: cfg.color }} />
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: 2 }}>
                    {((count / DU_LIEU.length) * 100).toFixed(0)}% · Nhấn để lọc
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── BỘ LỌC ── */}
        <div className="space-y-3">
          {/* Search bar luôn hiện */}
          <div className="flex items-center gap-3 flex-wrap p-4 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
            <div className="relative flex items-center flex-1" style={{ minWidth: 240 }}>
              <Search size={15} color="#94A3B8" className="absolute left-3.5 pointer-events-none" />
              <input type="text" placeholder="Tìm theo tên trường, đại lý, mã lệnh…"
                value={tuKhoa} onChange={e => setTuKhoa(e.target.value)}
                className="w-full outline-none rounded-xl"
                style={{ border: "1.5px solid #EEF0F4", padding: "9px 34px 9px 38px", fontSize: "0.83rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro'" }}
                onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#EEF0F4"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }} />
              {tuKhoa && (
                <button onClick={() => setTuKhoa("")} className="absolute right-3" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={13} color="#94A3B8" />
                </button>
              )}
            </div>

            {/* Lọc nhanh gói */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F8F9FA", border: "1.5px solid #EEF0F4" }}>
              {(["", "BASIC", "PLUS", "VIP"] as (LoaiGoi | "")[]).map(opt => {
                const sel = locGoi === opt;
                const cfg = opt ? LOAI_GOI_CFG[opt as LoaiGoi] : null;
                return (
                  <button key={opt || "all"} onClick={() => setLocGoi(opt as any)}
                    className="px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ background: sel ? (cfg?.color ?? "#005CB6") : "transparent", color: sel ? "#fff" : (cfg?.color ?? "#64748B"), border: "none", cursor: "pointer", fontSize: "0.74rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'" }}>
                    {opt || "Tất cả"}
                  </button>
                );
              })}
            </div>

            {coBoLoc && (
              <button onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.2)", color: "#D4183D", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                <X size={12} /> Xóa lọc
              </button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Filter size={13} color="#94A3B8" />
              <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                <strong style={{ color: "#0F172A" }}>{daDaLoc.length}</strong> / {DU_LIEU.length}
              </span>
            </div>
          </div>

          {/* Bộ lọc nâng cao */}
          {showFilter && (
            <div className="flex items-end gap-3 flex-wrap p-4 rounded-2xl"
              style={{ background: "#fff", border: "1.5px solid rgba(0,92,182,0.15)", animation: "fadeSlideIn 0.2s ease" }}>
              <div className="flex items-center gap-2 mb-1" style={{ width: "100%" }}>
                <SlidersHorizontal size={13} color="#005CB6" />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#005CB6" }}>Lọc theo thời gian</span>
              </div>
              {[
                { label: "Từ ngày", val: locTuNgay, onChange: setLocTuNgay },
                { label: "Đến ngày", val: locDenNgay, onChange: setLocDenNgay },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B" }}>{f.label}</label>
                  <input type="date" value={f.val} onChange={e => f.onChange(e.target.value)}
                    className="outline-none rounded-xl"
                    style={{ padding: "8px 12px", border: `1.5px solid ${f.val ? "#005CB6" : "#EEF0F4"}`, fontSize: "0.82rem", background: f.val ? "rgba(0,92,182,0.04)" : "#F8F9FA", fontFamily: "'Be Vietnam Pro'", cursor: "pointer" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── BẢNG DỮ LIỆU ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {[
                    { label: "STT",               w: "4%",  sort: null             },
                    { label: "Mã lệnh gán",       w: "12%", sort: null             },
                    { label: "Đối tượng nhận",    w: "20%", sort: null             },
                    { label: "Gói cước",          w: "8%",  sort: null             },
                    { label: "Số lượng",          w: "9%",  sort: "soLuong" as const},
                    { label: "Ngày tạo",          w: "10%", sort: "ngayTao" as const},
                    { label: "Trạng thái",        w: "11%", sort: null             },
                    { label: "Ghi chú / Lý do",  w: "18%", sort: null             },
                    { label: "",                  w: "8%",  sort: null             },
                  ].map((col, ci) => (
                    <th key={`th-${ci}`}
                      style={{ width: col.w, padding: "11px 14px", textAlign: "left", fontSize: "0.62rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {col.sort ? (
                        <button onClick={() => handleSort(col.sort!)}
                          className="flex items-center gap-1"
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontSize: "0.62rem", fontWeight: 800, color: sortKey === col.sort ? "#005CB6" : "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {col.label} <ArrowUpDown size={10} color={sortKey === col.sort ? "#005CB6" : "#CBD5E1"} />
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daDaLoc.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "52px 16px", textAlign: "center" }}>
                      <div className="flex flex-col items-center gap-3">
                        <Search size={36} color="#CBD5E1" />
                        <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>Không tìm thấy lệnh gán phù hợp</p>
                        <button onClick={handleReset}
                          style={{ fontSize: "0.78rem", color: "#005CB6", background: "none", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontWeight: 600 }}>
                          Xóa bộ lọc
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : daDaLoc.map((row, idx) => {
                  const ts     = TRANG_THAI_CFG[row.trangThai];
                  const goi    = LOAI_GOI_CFG[row.loaiGoi];
                  const TsIc   = ts.icon;
                  const isLast = idx === daDaLoc.length - 1;

                  return (
                    <tr key={row.id}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${ts.rowBorder}`,
                        background: row.trangThai === "Từ chối" ? "rgba(212,24,61,0.02)" : "transparent",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = row.trangThai === "Từ chối" ? "rgba(212,24,61,0.02)" : "transparent")}>

                      {/* STT */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#CBD5E1" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Mã lệnh */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex flex-col gap-0.5">
                          <code style={{ fontSize: "0.76rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 7px", borderRadius: 6 }}>
                            {row.maLenh}
                          </code>
                          {row.maGiaoDich && (
                            <span style={{ fontSize: "0.62rem", color: "#94A3B8", paddingLeft: 2 }}>
                              {row.maGiaoDich}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Đối tượng nhận */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: row.loaiDV === "Trường học" ? "rgba(0,92,182,0.09)" : "rgba(124,58,237,0.09)" }}>
                            {row.loaiDV === "Trường học"
                              ? <Building2 size={11} color="#005CB6" />
                              : <User size={11} color="#7C3AED" />}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1E293B" }}>{row.doiTuongNhan}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin size={9} color="#CBD5E1" />
                              <span style={{ fontSize: "0.63rem", color: "#94A3B8" }}>{row.diaChi}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gói cước */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1 w-fit rounded-full px-2.5 py-1"
                          style={{ fontSize: "0.68rem", fontWeight: 800, color: goi.color, background: goi.bg, border: `1px solid ${goi.border}` }}>
                          <Gift size={9} /> {row.loaiGoi}
                        </span>
                      </td>

                      {/* Số lượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#0F172A" }}>{fmtSL(row.soLuong)}</span>
                        <span style={{ fontSize: "0.62rem", color: "#94A3B8", marginLeft: 3 }}>lic</span>
                      </td>

                      {/* Ngày tạo */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.79rem", color: "#64748B" }}>{row.ngayTao}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 w-fit whitespace-nowrap"
                          style={{ fontSize: "0.67rem", fontWeight: 800, color: ts.color, background: ts.bg, border: `1px solid ${ts.border}` }}>
                          <TsIc size={10} /> {row.trangThai}
                        </span>
                      </td>

                      {/* Ghi chú */}
                      <td style={{ padding: "13px 14px", maxWidth: 200 }}>
                        {row.trangThai === "Từ chối" && row.ghiChu ? (
                          <div className="flex items-start gap-1.5">
                            <AlertTriangle size={12} color="#D4183D" className="flex-shrink-0 mt-0.5" />
                            <span style={{ fontSize: "0.72rem", color: "#D4183D", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {row.ghiChu}
                            </span>
                          </div>
                        ) : row.trangThai === "Chờ duyệt" ? (
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} color="#D97706" />
                            <span style={{ fontSize: "0.71rem", color: "#D97706" }}>Đang xử lý…</span>
                          </div>
                        ) : row.nguoiDuyet ? (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck size={11} color="#0F766E" />
                            <span style={{ fontSize: "0.71rem", color: "#0F766E" }}>Duyệt bởi {row.nguoiDuyet}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.71rem", color: "#CBD5E1" }}>—</span>
                        )}
                      </td>

                      {/* Xem chi tiết */}
                      <td style={{ padding: "13px 10px" }}>
                        <button onClick={() => setDrawer(row)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                          style={{ background: "rgba(0,92,182,0.06)", border: "1.5px solid rgba(0,92,182,0.18)", color: "#005CB6", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,92,182,0.12)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,92,182,0.06)"; }}>
                          <Eye size={12} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-4 flex-wrap">
              {([["Đã duyệt", tongDaDuyet], ["Chờ duyệt", tongChoDuyet], ["Từ chối", tongTuChoi]] as [TrangThai, number][]).map(([ts, count]) => {
                const cfg = TRANG_THAI_CFG[ts];
                const FIc = cfg.icon;
                return (
                  <div key={ts} className="flex items-center gap-1.5">
                    <FIc size={11} color={cfg.dot} />
                    <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                      {ts}: <strong style={{ color: "#0F172A" }}>{count}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              Hiển thị <strong style={{ color: "#0F172A" }}>{daDaLoc.length}</strong> / {DU_LIEU.length} bản ghi
            </span>
          </div>
        </div>

        {/* ── GHI CHÚ NGHIỆP VỤ ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: MessageSquare, color: "#D4183D", bg: "rgba(212,24,61,0.07)", title: "Lệnh bị Từ chối",
              desc: "Nhấn 'Chi tiết' để xem lý do cụ thể. Sau đó tạo lại lệnh mới với thông tin đã chỉnh sửa từ menu Chia sẻ gói." },
            { icon: Clock,         color: "#D97706", bg: "rgba(217,119,6,0.07)", title: "Lệnh đang Chờ duyệt",
              desc: "Checker sẽ xem xét và phản hồi trong vòng 24 giờ làm việc. Maker không thể hủy lệnh sau khi đã gửi." },
            { icon: ShieldCheck,   color: "#0F766E", bg: "rgba(15,118,110,0.07)", title: "Lệnh Đã duyệt",
              desc: "License đã được cấp phát. Mã giao dịch BCCS được sinh tự động và khớp với Báo cáo Đối soát của Admin." },
          ].map(rb => {
            const RIc = rb.icon;
            return (
              <div key={rb.title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: rb.bg }}>
                  <RIc size={16} color={rb.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{rb.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748B", lineHeight: 1.65 }}>{rb.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {drawer && <DrawerChiTiet row={drawer} onClose={() => setDrawer(null)} />}

      <style>{`
        @keyframes spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawerIn    { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
