import { useState, useEffect } from "react";
import {
  Link2, Search, X, Check, CheckCircle, AlertCircle, Building2,
  ChevronDown, ChevronUp, ArrowUpDown, MapPin, BookOpen, Tags,
  Clock, Filter, Eye, Plus, Trash2,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ─────────────────────────────────────────────────────────────

type LoaiYeuCau   = "chuong-trinh";
type TrangThaiGan = "chua-gan" | "da-gan" | "moi-cap-nhat";
type NguoiTao     = "Admin" | "Đối tác";
type SortF        = "tenChuongTrinh" | "tenDoiTac" | "ngayGui";
type SortD        = "asc" | "desc";
type HinhThucKD   = "B2B" | "B2C" | "B2B2C";

interface DonViKhaDung {
  id: string;
  tenDonVi: string;
  maDonVi: string;
  tinhThanh: string;
  capHoc: string;
}

interface CauHinhDonVi {
  _id: string;
  tinhThanhIds: string[];                      // multi-select provinces
  capHoc: string;                              // single filter
  truongIds: string[];                         // multi-select schools (empty = toàn tỉnh)
  hinhThucPerTruong: Record<string, HinhThucKD[]>; // key: truongId or "" for toàn tỉnh
}

interface YeuCauGan {
  id: string;
  loai: LoaiYeuCau;
  tenChuongTrinh: string;
  tenDoiTac: string;
  maDoiTac: string;
  ngayGui: string;
  trangThai: TrangThaiGan;
  donViDaGanIds: string[];
  goiCuocIds: string[];
  nguoiTao: NguoiTao;
  cauHinhs: CauHinhDonVi[];
}

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

const DS_DON_VI: DonViKhaDung[] = [
  { id:"dv01", tenDonVi:"Trường TH Kim Liên",          maDonVi:"HN-TH-001",   tinhThanh:"Hà Nội",           capHoc:"Tiểu học" },
  { id:"dv02", tenDonVi:"Trường TH Lê Văn Tám",        maDonVi:"HCM-TH-001",  tinhThanh:"TP. Hồ Chí Minh",  capHoc:"Tiểu học" },
  { id:"dv03", tenDonVi:"Trường TH Lý Thường Kiệt",    maDonVi:"DN-TH-001",   tinhThanh:"Đà Nẵng",          capHoc:"Tiểu học" },
  { id:"dv04", tenDonVi:"Trường TH Hồng Bàng",         maDonVi:"HP-TH-001",   tinhThanh:"Hải Phòng",        capHoc:"Tiểu học" },
  { id:"dv05", tenDonVi:"Trường TH Bình Thủy",         maDonVi:"CT-TH-001",   tinhThanh:"Cần Thơ",          capHoc:"Tiểu học" },
  { id:"dv06", tenDonVi:"Trường THCS Nguyễn Du",       maDonVi:"HN-THCS-001", tinhThanh:"Hà Nội",           capHoc:"THCS"     },
  { id:"dv07", tenDonVi:"Trường THCS Nguyễn Trãi",     maDonVi:"HCM-THCS-001",tinhThanh:"TP. Hồ Chí Minh",  capHoc:"THCS"     },
  { id:"dv08", tenDonVi:"Trường THCS Trần Phú",        maDonVi:"DN-THCS-001", tinhThanh:"Đà Nẵng",          capHoc:"THCS"     },
  { id:"dv09", tenDonVi:"Trường THCS Châu Văn Liêm",   maDonVi:"CT-THCS-001", tinhThanh:"Cần Thơ",          capHoc:"THCS"     },
  { id:"dv10", tenDonVi:"Trường THPT Chu Văn An",      maDonVi:"HN-THPT-001", tinhThanh:"Hà Nội",           capHoc:"THPT"     },
  { id:"dv11", tenDonVi:"Trường THPT Lê Quý Đôn",      maDonVi:"HCM-THPT-001",tinhThanh:"TP. Hồ Chí Minh",  capHoc:"THPT"     },
  { id:"dv12", tenDonVi:"Trường THPT Phan Châu Trinh", maDonVi:"DN-THPT-001", tinhThanh:"Đà Nẵng",          capHoc:"THPT"     },
  { id:"dv13", tenDonVi:"Trường THPT Thái Phiên",      maDonVi:"HP-THPT-001", tinhThanh:"Hải Phòng",        capHoc:"THPT"     },
  { id:"dv14", tenDonVi:"Trường TH & THCS Vĩnh Long",  maDonVi:"VL-TH-001",   tinhThanh:"Vĩnh Long",        capHoc:"Tiểu học" },
  { id:"dv15", tenDonVi:"Trường THCS Phan Bội Châu",   maDonVi:"NA-THCS-001", tinhThanh:"Nghệ An",          capHoc:"THCS"     },
];

// ── MASTER_DATA: Chương trình → Gói cước ────────────────────────────────────

interface GoiCuocInfo {
  id: string;
  ten: string;
  gia: number;
  thoiLuong: string;
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
      { id: "g01", ten: "BASIC Tiểu học",  gia: 200,   thoiLuong: "12 tháng" },
      { id: "g02", ten: "PLUS Tiểu học",   gia: 500,   thoiLuong: "12 tháng" },
      { id: "g09", ten: "BASIC THPT",      gia: 400,   thoiLuong: "12 tháng" },
    ],
  },
  {
    id: "m02", ten: "Kỹ năng sống Pro",
    danhSachGoi: [
      { id: "g03", ten: "Gói Hè Miễn Phí", gia: 0,    thoiLuong: "3 tháng" },
    ],
  },
  {
    id: "m03", ten: "Luyện thi THPT",
    danhSachGoi: [
      { id: "g04", ten: "Gói Cấp tốc",    gia: 1000,  thoiLuong: "6 tháng" },
    ],
  },
  {
    id: "m04", ten: "AI Book Ngữ Văn",
    danhSachGoi: [
      { id: "g05", ten: "BASIC THCS",     gia: 300,   thoiLuong: "12 tháng" },
    ],
  },
  {
    id: "m05", ten: "AI Book Toán",
    danhSachGoi: [
      { id: "g06", ten: "PLUS THCS",      gia: 600,   thoiLuong: "12 tháng" },
    ],
  },
  {
    id: "m06", ten: "Tiếng Anh Giao tiếp",
    danhSachGoi: [
      { id: "g07", ten: "Gói VIP 1 kèm 1", gia: 2000, thoiLuong: "12 tháng" },
    ],
  },
];

const DS_YEU_CAU: YeuCauGan[] = [
  // === ADMIN TẠO (5 dữ liệu) ===
  { id:"yc01", loai:"chuong-trinh", tenChuongTrinh:"AI Book 2026",                       tenDoiTac:"Đối tác Nội dung Edutech",   maDoiTac:"DT-001", ngayGui:"10/04/2025", trangThai:"chua-gan",      donViDaGanIds:[], goiCuocIds:["g01","g02"], nguoiTao:"Admin", cauHinhs:[] },
  { id:"yc02", loai:"chuong-trinh", tenChuongTrinh:"Toán 9 – Luyện thi vào lớp 10",     tenDoiTac:"Công ty CP Giáo dục Sao Mai",maDoiTac:"DT-002", ngayGui:"09/04/2025", trangThai:"da-gan",        donViDaGanIds:["dv06","dv07"], goiCuocIds:["g06"], nguoiTao:"Admin",
    cauHinhs:[
      { _id:"ch2", tinhThanhIds:["Hà Nội","TP. Hồ Chí Minh"], capHoc:"THCS", truongIds:["dv06","dv07"], hinhThucPerTruong:{ "dv06":["B2B"], "dv07":["B2B","B2C"] } },
    ]},
  { id:"yc03", loai:"chuong-trinh", tenChuongTrinh:"Luyện thi THPT",                    tenDoiTac:"Đối tác Nội dung Edutech",   maDoiTac:"DT-001", ngayGui:"08/04/2025", trangThai:"moi-cap-nhat", donViDaGanIds:["dv10","dv11","dv12"], goiCuocIds:["g04"], nguoiTao:"Admin",
    cauHinhs:[
      { _id:"ch1", tinhThanhIds:["Hà Nội","TP. Hồ Chí Minh"], capHoc:"THPT", truongIds:["dv10","dv11"], hinhThucPerTruong:{ "dv10":["B2C"], "dv11":["B2B","B2B2C"] } },
      { _id:"ch3", tinhThanhIds:["Đà Nẵng"],                    capHoc:"",     truongIds:[],             hinhThucPerTruong:{ "":["B2B2C"] } },
    ]},
  { id:"yc04", loai:"chuong-trinh", tenChuongTrinh:"AI Book Toán",                      tenDoiTac:"Đối tác Nội dung Edutech",   maDoiTac:"DT-001", ngayGui:"04/04/2025", trangThai:"da-gan",        donViDaGanIds:["dv06","dv07","dv10","dv11"], goiCuocIds:["g06"], nguoiTao:"Admin",
    cauHinhs:[
      { _id:"ch6", tinhThanhIds:["Hà Nội","TP. Hồ Chí Minh"], capHoc:"THCS", truongIds:["dv06","dv07"], hinhThucPerTruong:{ "dv06":["B2B"], "dv07":["B2B","B2C"] } },
      { _id:"ch8", tinhThanhIds:["Hà Nội","TP. Hồ Chí Minh"], capHoc:"THPT", truongIds:["dv11"],         hinhThucPerTruong:{ "dv11":["B2B2C"] } },
    ]},
  { id:"yc05", loai:"chuong-trinh", tenChuongTrinh:"Vật lý 11 – Điện học & Từ trường",  tenDoiTac:"Nhà xuất bản Giáo dục VN",   maDoiTac:"DT-003", ngayGui:"05/04/2025", trangThai:"chua-gan",      donViDaGanIds:[], goiCuocIds:["g09"], nguoiTao:"Admin", cauHinhs:[] },

  // === ĐỐI TÁC TẠO (5 dữ liệu) ===
  { id:"yc06", loai:"chuong-trinh", tenChuongTrinh:"Kỹ năng sống Pro",                   tenDoiTac:"Nhà xuất bản Giáo dục VN",   maDoiTac:"DT-003", ngayGui:"07/04/2025", trangThai:"da-gan",        donViDaGanIds:["dv01","dv02","dv05"], goiCuocIds:["g03"], nguoiTao:"Đối tác",
    cauHinhs:[
      { _id:"ch4", tinhThanhIds:["Hà Nội"],          capHoc:"Tiểu học", truongIds:["dv01"], hinhThucPerTruong:{ "dv01":["B2B"] } },
      { _id:"ch5", tinhThanhIds:["TP. Hồ Chí Minh"], capHoc:"",         truongIds:[],       hinhThucPerTruong:{ "":["B2C"] } },
    ]},
  { id:"yc07", loai:"chuong-trinh", tenChuongTrinh:"AI Book Ngữ Văn",                    tenDoiTac:"Công ty CP Giáo dục Sao Mai",maDoiTac:"DT-002", ngayGui:"06/04/2025", trangThai:"chua-gan",      donViDaGanIds:[], goiCuocIds:["g05"], nguoiTao:"Đối tác", cauHinhs:[] },
  { id:"yc08", loai:"chuong-trinh", tenChuongTrinh:"Hóa học 12 – Luyện thi THPTQG",     tenDoiTac:"Công ty TNHH EduSoft",       maDoiTac:"DT-004", ngayGui:"03/04/2025", trangThai:"moi-cap-nhat", donViDaGanIds:[], goiCuocIds:["g02","g04"], nguoiTao:"Đối tác", cauHinhs:[] },
  { id:"yc09", loai:"chuong-trinh", tenChuongTrinh:"Ngữ văn 12 – Luyện thi THPTQG",     tenDoiTac:"Nhà xuất bản Giáo dục VN",   maDoiTac:"DT-003", ngayGui:"02/04/2025", trangThai:"da-gan",        donViDaGanIds:["dv10","dv13"], goiCuocIds:["g05","g07"], nguoiTao:"Đối tác",
    cauHinhs:[
      { _id:"ch10", tinhThanhIds:["Hà Nội","Hải Phòng"], capHoc:"THPT", truongIds:["dv10","dv13"], hinhThucPerTruong:{ "dv10":["B2B"], "dv13":["B2C","B2B2C"] } },
    ]},
  { id:"yc10", loai:"chuong-trinh", tenChuongTrinh:"Tiếng Anh Giao tiếp",                 tenDoiTac:"Công ty TNHH EduSoft",       maDoiTac:"DT-004", ngayGui:"01/04/2025", trangThai:"chua-gan",      donViDaGanIds:[], goiCuocIds:["g07"], nguoiTao:"Đối tác", cauHinhs:[] },
];

// ── CONFIG ────────────────────────────────────────────────────────────────────

const LOAI_CFG: Record<LoaiYeuCau, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  "chuong-trinh": { label: "Chương trình", color: "#0284C7", bg: "rgba(2,132,199,0.08)",  border: "rgba(2,132,199,0.2)",  icon: BookOpen },
};

const TRANG_THAI_CFG: Record<TrangThaiGan, { label: string; color: string; bg: string; dot: string }> = {
  "chua-gan":      { label: "Chưa gán",      color: "#D97706", bg: "rgba(217,119,6,0.08)" },
  "da-gan":        { label: "Đã gán",        color: "#0F766E", bg: "rgba(15,118,110,0.08)" },
  "moi-cap-nhat":  { label: "Mới cập nhật",  color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
};

const CAP_HOC_CFG: Record<string, { color: string; bg: string }> = {
  "Tiểu học": { color: "#0284C7", bg: "rgba(2,132,199,0.08)"  },
  "THCS":     { color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  "THPT":     { color: "#D97706", bg: "rgba(217,119,6,0.08)"  },
};

const DS_TINH = [...new Set(DS_DON_VI.map(d => d.tinhThanh))].sort();

const HINH_THUC_CFG: Record<HinhThucKD, { label: string; color: string; bg: string; border: string }> = {
  "B2B":   { label: "B2B",   color: "#005CB6", bg: "rgba(0,92,182,0.08)",   border: "rgba(0,92,182,0.25)"   },
  "B2C":   { label: "B2C",   color: "#0F766E", bg: "rgba(15,118,110,0.08)", border: "rgba(15,118,110,0.25)" },
  "B2B2C": { label: "B2B2C", color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.25)" },
};

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const cfg = type === "success"
    ? { bg: "#ECFDF5", border: "#6EE7B7", color: "#065F46", icon: <CheckCircle size={15} color="#059669"/> }
    : { bg: "#FEF2F2", border: "#FCA5A5", color: "#991B1B", icon: <AlertCircle size={15} color="#DC2626"/> };
  return (
    <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, animation: "toastSlide 0.3s ease", fontFamily: "'Be Vietnam Pro',sans-serif", minWidth: 280 }}>
      {cfg.icon}
      <span style={{ fontSize: "0.83rem", fontWeight: 600, color: cfg.color }}>{msg}</span>
    </div>
  );
}

// ── POPUP GÁN ĐƠN VỊ ─────────────────────────────────────────────────────────

function ModalGanDonVi({ yeuCau, onClose, onSave }: {
  yeuCau: YeuCauGan;
  onClose: () => void;
  onSave: (yeuCauId: string, cauHinhs: CauHinhDonVi[]) => void;
}) {
  const mkRow = (): CauHinhDonVi => ({
    _id: Math.random().toString(36).slice(2),
    tinhThanhIds: [], capHoc: "", truongIds: [], hinhThucPerTruong: {},
  });

  const [rows, setRows] = useState<CauHinhDonVi[]>(
    yeuCau.cauHinhs.length > 0 ? [...yeuCau.cauHinhs] : [mkRow()]
  );
  const [openDrop, setOpenDrop] = useState<{ rIdx: number; field: "tinh" | "truong" } | null>(null);
  const [saving, setSaving]     = useState(false);

  const loai     = LOAI_CFG[yeuCau.loai];
  const LoaiIcon = loai.icon;

  // Close on outside click
  useEffect(() => {
    if (!openDrop) return;
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-drop]")) setOpenDrop(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [openDrop]);

  const truongForRow = (row: CauHinhDonVi) =>
    DS_DON_VI.filter(d =>
      (row.tinhThanhIds.length === 0 || row.tinhThanhIds.includes(d.tinhThanh)) &&
      (!row.capHoc || d.capHoc === row.capHoc)
    );

  const patchRow = (rIdx: number, patch: Partial<CauHinhDonVi>) =>
    setRows(prev => prev.map((r, i) => i !== rIdx ? r : { ...r, ...patch }));

  // Tỉnh thành multi-toggle
  const toggleTinh = (rIdx: number, tinh: string) => {
    const row = rows[rIdx];
    const ids = row.tinhThanhIds.includes(tinh)
      ? row.tinhThanhIds.filter(x => x !== tinh)
      : [...row.tinhThanhIds, tinh];
    patchRow(rIdx, { tinhThanhIds: ids, truongIds: [], hinhThucPerTruong: {} });
  };

  const setCapHoc = (rIdx: number, cap: string) =>
    patchRow(rIdx, { capHoc: cap, truongIds: [], hinhThucPerTruong: {} });

  // Trường multi-toggle — sync hinhThucPerTruong
  const toggleTruong = (rIdx: number, tid: string) => {
    const row = rows[rIdx];
    const adding = !row.truongIds.includes(tid);
    const newIds = adding ? [...row.truongIds, tid] : row.truongIds.filter(x => x !== tid);
    const newHTPT = { ...row.hinhThucPerTruong };
    if (adding) { newHTPT[tid] = []; } else { delete newHTPT[tid]; }
    patchRow(rIdx, { truongIds: newIds, hinhThucPerTruong: newHTPT });
  };

  // Hình thức toggle per key (truongId or "" for toàn tỉnh)
  const toggleHT = (rIdx: number, key: string, ht: HinhThucKD) => {
    const row = rows[rIdx];
    const cur = row.hinhThucPerTruong[key] ?? [];
    const next = cur.includes(ht) ? cur.filter(x => x !== ht) : [...cur, ht];
    patchRow(rIdx, { hinhThucPerTruong: { ...row.hinhThucPerTruong, [key]: next } });
  };

  const addRow    = () => setRows(prev => [...prev, mkRow()]);
  const removeRow = (rIdx: number) => setRows(prev => prev.filter((_, i) => i !== rIdx));

  const isValid = rows.length > 0 && rows.every(r => r.tinhThanhIds.length > 0);

  const handleSave = () => {
    if (!isValid) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(yeuCau.id, rows); }, 600);
  };

  // shared dropdown list item styles
  const ddItem = (sel: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer",
    background: sel ? "rgba(0,92,182,0.05)" : "#fff", borderTop: "1px solid #F8FAFC",
  });

  const checkbox = (sel: boolean) => (
    <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0,
      border: `2px solid ${sel ? "#005CB6" : "#CBD5E1"}`, background: sel ? "#005CB6" : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {sel && <Check size={8} color="#fff" strokeWidth={3}/>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 940, maxHeight: "94vh", background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", fontFamily: "'Be Vietnam Pro',sans-serif" }}>

        {/* HEADER */}
        <div className="px-6 pt-5 pb-5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#004A9B 0%,#005CB6 50%,#0074E4 100%)" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Link2 size={19} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 900, color: "#fff" }}>Gán đơn vị</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", marginTop: 3 }}>
                  Cấu hình theo Tỉnh thành → Cấp học → Trường → Hình thức kinh doanh
                </div>
              </div>
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
              <X size={16} color="#fff"/>
            </button>
          </div>
          <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: loai.bg, border: `1px solid ${loai.border}` }}>
                <LoaiIcon size={14} color={loai.color}/>
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {yeuCau.tenChuongTrinh}
                </div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                  🏢 {yeuCau.tenDoiTac} · 📅 {yeuCau.ngayGui}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#fff" }}>{rows.length} cấu hình</span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>Đơn vị áp dụng</div>

          <div className="space-y-4">
            {rows.map((row, rIdx) => {
              const isTinhOpen  = openDrop?.rIdx === rIdx && openDrop.field === "tinh";
              const isTruongOpen = openDrop?.rIdx === rIdx && openDrop.field === "truong";
              const avail       = truongForRow(row);
              const hasErr      = row.tinhThanhIds.length === 0;
              // Which rows to show in the hình thức section
              const htKeys: string[] = row.truongIds.length > 0
                ? row.truongIds
                : (row.tinhThanhIds.length > 0 ? [""] : []);

              return (
                <div key={row._id} className="rounded-xl"
                  style={{ border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E2E8F0"}`, background: hasErr ? "#FFFAFA" : "#FAFBFC" }}>

                  {/* ── Selector row: 4 columns ── */}
                  <div className="grid gap-3 p-4" style={{ gridTemplateColumns: "1fr 100px 1fr 36px", alignItems: "start" }}>

                    {/* TỈNH THÀNH (multi) */}
                    <div>
                      <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
                        Tỉnh thành <span style={{ color: "#DC2626" }}>*</span>
                      </div>
                      <div className="relative" data-drop="">
                        <button type="button"
                          onClick={() => setOpenDrop(isTinhOpen ? null : { rIdx, field: "tinh" })}
                          style={{ width: "100%", border: `1.5px solid ${hasErr ? "#FCA5A5" : isTinhOpen ? "#005CB6" : "#E2E8F0"}`, borderRadius: 8, padding: "8px 28px 8px 10px", fontSize: "0.81rem", background: hasErr ? "#FEF2F2" : isTinhOpen ? "rgba(0,92,182,0.04)" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "'Be Vietnam Pro',sans-serif", color: row.tinhThanhIds.length > 0 ? "#0F172A" : "#9CA3AF", fontWeight: row.tinhThanhIds.length > 0 ? 600 : 400 }}>
                          {row.tinhThanhIds.length === 0 ? "-- Chọn tỉnh --" : `${row.tinhThanhIds.length} tỉnh / thành`}
                        </button>
                        <ChevronDown size={13} color="#94A3B8" style={{ position: "absolute", right: 8, top: 10, pointerEvents: "none" }}/>
                        {/* chips */}
                        {row.tinhThanhIds.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {row.tinhThanhIds.map(t => (
                              <span key={t} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md"
                                style={{ background: "rgba(0,92,182,0.08)", border: "1px solid rgba(0,92,182,0.2)", fontSize: "0.63rem", fontWeight: 600, color: "#005CB6" }}>
                                <MapPin size={8}/>{t}
                                <button type="button" onClick={e => { e.stopPropagation(); toggleTinh(rIdx, t); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                                  <X size={8} color="#005CB6"/>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        {/* dropdown */}
                        {isTinhOpen && (
                          <div className="absolute z-30 rounded-xl overflow-hidden"
                            style={{ top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #E2E8F0", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                            <div style={{ maxHeight: 230, overflowY: "auto" }}>
                              {DS_TINH.map(t => {
                                const sel = row.tinhThanhIds.includes(t);
                                return (
                                  <div key={t} style={ddItem(sel)}
                                    onClick={() => toggleTinh(rIdx, t)}
                                    onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = "#F8FAFC"; }}
                                    onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}>
                                    {checkbox(sel)}
                                    <span style={{ fontSize: "0.81rem", fontWeight: sel ? 700 : 500, color: sel ? "#005CB6" : "#0F172A" }}>{t}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CẤP HỌC (single) */}
                    <div>
                      <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
                        Cấp học
                      </div>
                      <div className="relative">
                        <select value={row.capHoc} onChange={e => setCapHoc(rIdx, e.target.value)}
                          style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 28px 8px 10px", fontSize: "0.81rem", appearance: "none" as const, cursor: "pointer", color: "#374151", background: "#fff", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
                          <option value="">Tất cả</option>
                          <option value="Tiểu học">Tiểu học</option>
                          <option value="THCS">THCS</option>
                          <option value="THPT">THPT</option>
                        </select>
                        <ChevronDown size={13} color="#94A3B8" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}/>
                      </div>
                    </div>

                    {/* TRƯỜNG (multi) */}
                    <div>
                      <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
                        Trường <span style={{ fontSize: "0.61rem", fontWeight: 500, color: "#94A3B8", textTransform: "none", letterSpacing: 0 }}>(trống = toàn tỉnh)</span>
                      </div>
                      <div className="relative" data-drop="">
                        <button type="button"
                          onClick={() => row.tinhThanhIds.length > 0 && setOpenDrop(isTruongOpen ? null : { rIdx, field: "truong" })}
                          style={{ width: "100%", border: `1.5px solid ${isTruongOpen ? "#005CB6" : "#E2E8F0"}`, borderRadius: 8, padding: "8px 28px 8px 10px", fontSize: "0.81rem", background: row.tinhThanhIds.length === 0 ? "#F8FAFC" : isTruongOpen ? "rgba(0,92,182,0.04)" : "#fff", cursor: row.tinhThanhIds.length === 0 ? "not-allowed" : "pointer", textAlign: "left", fontFamily: "'Be Vietnam Pro',sans-serif", color: row.tinhThanhIds.length === 0 ? "#CBD5E1" : row.truongIds.length > 0 ? "#005CB6" : "#9CA3AF", fontWeight: row.truongIds.length > 0 ? 700 : 400 }}>
                          {row.tinhThanhIds.length === 0 ? "-- Chọn tỉnh trước --" : row.truongIds.length === 0 ? "Toàn tỉnh" : `${row.truongIds.length} trường`}
                        </button>
                        <ChevronDown size={13} color="#94A3B8" style={{ position: "absolute", right: 8, top: 10, pointerEvents: "none" }}/>
                        {/* chips */}
                        {row.truongIds.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {row.truongIds.map(tid => {
                              const dv = DS_DON_VI.find(d => d.id === tid);
                              return dv ? (
                                <span key={tid} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md"
                                  style={{ background: "rgba(0,92,182,0.08)", border: "1px solid rgba(0,92,182,0.2)", fontSize: "0.63rem", fontWeight: 600, color: "#005CB6" }}>
                                  <Building2 size={8}/>{dv.tenDonVi}
                                  <button type="button" onClick={e => { e.stopPropagation(); toggleTruong(rIdx, tid); }}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                                    <X size={8} color="#005CB6"/>
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                        {/* dropdown */}
                        {isTruongOpen && (
                          <div className="absolute z-30 rounded-xl overflow-hidden"
                            style={{ top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #E2E8F0", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                            <div className="px-3 py-1.5" style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                              <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "#64748B" }}>
                                {avail.length} trường · để trống = toàn tỉnh
                              </span>
                            </div>
                            <div style={{ maxHeight: 210, overflowY: "auto" }}>
                              {avail.length === 0
                                ? <div style={{ padding: "14px", fontSize: "0.75rem", color: "#94A3B8", textAlign: "center" }}>Không có trường phù hợp</div>
                                : avail.map(dv => {
                                  const sel = row.truongIds.includes(dv.id);
                                  const capCfg = CAP_HOC_CFG[dv.capHoc] ?? { color: "#64748B", bg: "#F1F5F9" };
                                  return (
                                    <div key={dv.id} style={ddItem(sel)}
                                      onClick={() => toggleTruong(rIdx, dv.id)}
                                      onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = "#F8FAFC"; }}
                                      onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}>
                                      {checkbox(sel)}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: "0.79rem", fontWeight: sel ? 700 : 500, color: sel ? "#005CB6" : "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dv.tenDonVi}</div>
                                        <div style={{ fontSize: "0.61rem", color: "#94A3B8" }}>{dv.maDonVi} · {dv.tinhThanh}</div>
                                      </div>
                                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: capCfg.color, background: capCfg.bg, padding: "1px 7px", borderRadius: 12, flexShrink: 0 }}>{dv.capHoc}</span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete btn */}
                    <div style={{ paddingTop: 26 }}>
                      <button type="button" onClick={() => rows.length > 1 && removeRow(rIdx)}
                        disabled={rows.length <= 1}
                        style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #FCA5A5", background: rows.length <= 1 ? "#F8FAFC" : "rgba(220,38,38,0.05)", cursor: rows.length <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { if (rows.length > 1) e.currentTarget.style.background = "rgba(220,38,38,0.14)"; }}
                        onMouseLeave={e => { if (rows.length > 1) e.currentTarget.style.background = "rgba(220,38,38,0.05)"; }}>
                        <Trash2 size={14} color={rows.length <= 1 ? "#CBD5E1" : "#DC2626"}/>
                      </button>
                    </div>
                  </div>

                  {/* ── Hình thức kinh doanh sub-table ── */}
                  {htKeys.length > 0 && (
                    <div className="px-4 pb-4">
                      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                        {/* header */}
                        <div className="flex items-center px-3 py-2" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                          <div style={{ flex: 1, fontSize: "0.64rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {row.truongIds.length > 0 ? "Trường" : "Phạm vi áp dụng"}
                          </div>
                          <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Hình thức kinh doanh
                          </div>
                        </div>
                        {/* rows */}
                        {htKeys.map((key, ki) => {
                          const dv      = key ? DS_DON_VI.find(d => d.id === key) : null;
                          const capCfg  = dv ? (CAP_HOC_CFG[dv.capHoc] ?? { color: "#64748B", bg: "#F1F5F9" }) : null;
                          const selHT   = row.hinhThucPerTruong[key] ?? [];
                          return (
                            <div key={key || "toan-tinh"} className="flex items-center px-3 py-2.5"
                              style={{ borderTop: ki > 0 ? "1px solid #F1F5F9" : "none", background: "#fff", gap: 12 }}>
                              {/* label */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {dv ? (
                                  <>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0" style={{ background: capCfg!.bg }}>
                                      <Building2 size={11} color={capCfg!.color}/>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontSize: "0.79rem", fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dv.tenDonVi}</div>
                                      <div style={{ fontSize: "0.61rem", color: "#94A3B8" }}>{dv.tinhThanh}</div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0" style={{ background: "rgba(0,92,182,0.08)" }}>
                                      <MapPin size={11} color="#005CB6"/>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: "0.79rem", fontWeight: 600, color: "#005CB6" }}>
                                        Toàn tỉnh{row.tinhThanhIds.length === 1 ? ` (${row.tinhThanhIds[0]})` : row.tinhThanhIds.length > 1 ? ` (${row.tinhThanhIds.length} tỉnh)` : ""}
                                      </div>
                                      {row.capHoc && <div style={{ fontSize: "0.61rem", color: "#94A3B8" }}>Cấp: {row.capHoc}</div>}
                                    </div>
                                  </>
                                )}
                              </div>
                              {/* HT toggle chips */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {(["B2B", "B2C", "B2B2C"] as HinhThucKD[]).map(ht => {
                                  const hCfg = HINH_THUC_CFG[ht];
                                  const on   = selHT.includes(ht);
                                  return (
                                    <button key={ht} type="button" onClick={() => toggleHT(rIdx, key, ht)}
                                      style={{ padding: "4px 11px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", transition: "all 0.12s", border: `1.5px solid ${on ? hCfg.border : "#E2E8F0"}`, background: on ? hCfg.bg : "#F8FAFC", color: on ? hCfg.color : "#94A3B8" }}>
                                      {ht}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* + Thêm */}
          <button type="button" onClick={addRow}
            className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(0,92,182,0.06)", border: "1.5px dashed rgba(0,92,182,0.3)", color: "#005CB6", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.11)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,92,182,0.06)")}>
            <Plus size={15}/> + Thêm
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
          <button onClick={onClose}
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", padding: "10px 22px", borderRadius: 12 }}>
            Hủy bỏ
          </button>
          <div className="flex items-center gap-3">
            {!isValid && <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Vui lòng chọn Tỉnh thành cho mỗi cấu hình</span>}
            <button onClick={handleSave} disabled={saving || !isValid}
              className="flex items-center gap-2"
              style={{ background: !isValid ? "#E2E8F0" : saving ? "#94A3B8" : "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: !isValid ? "#94A3B8" : "#fff", fontSize: "0.85rem", fontWeight: 800, cursor: !isValid || saving ? "not-allowed" : "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", padding: "10px 26px", borderRadius: 12, boxShadow: !isValid || saving ? "none" : "0 4px 14px rgba(0,92,182,0.4)" }}>
              {saving
                ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" style={{ marginRight: 8 }}/>Đang gán…</>
                : <><Link2 size={15} style={{ marginRight: 6 }}/> Xác nhận gán ({rows.length} cấu hình)</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TRANG CHÍNH ───────────────────────────────────────────────────────────────

export default function GanDonViPage() {
  const [list, setList]           = useState<YeuCauGan[]>(DS_YEU_CAU);
  const [search, setSearch]       = useState("");
  const [filterLoai, setFilterLoai]   = useState<LoaiYeuCau | "">("");
  const [filterTT, setFilterTT]       = useState<TrangThaiGan | "">("");
  const [sortF, setSortF]         = useState<SortF>("ngayGui");
  const [sortD, setSortD]         = useState<SortD>("desc");
  const [ganTarget, setGanTarget] = useState<YeuCauGan | null>(null);
  const [viewTarget, setViewTarget]   = useState<YeuCauGan | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const handleSort = (f: SortF) => {
    if (sortF === f) setSortD(d => d === "asc" ? "desc" : "asc");
    else { setSortF(f); setSortD("asc"); }
  };

  const handleSaveGan = (yeuCauId: string, cauHinhs: CauHinhDonVi[]) => {
    setList(prev => prev.map(yc => yc.id !== yeuCauId ? yc : {
      ...yc,
      cauHinhs,
      trangThai: cauHinhs.length > 0 ? "da-gan" : "chua-gan",
    }));
    setGanTarget(null);
    const yc = list.find(y => y.id === yeuCauId);
    const soTinh = new Set(cauHinhs.flatMap(c => c.tinhThanhIds)).size;
    showToast(`Đã gán ${cauHinhs.length} cấu hình (${soTinh} tỉnh) cho "${yc?.tenChuongTrinh}"`, "success");
  };

  const filtered = list.filter(yc => {
    const q = search.toLowerCase();
    if (q && !yc.tenChuongTrinh.toLowerCase().includes(q) && !yc.tenDoiTac.toLowerCase().includes(q)) return false;
    if (filterLoai && yc.loai !== filterLoai) return false;
    if (filterTT && yc.trangThai !== filterTT) return false;
    return true;
  }).sort((a, b) => {
    let va: string, vb: string;
    if (sortF === "tenChuongTrinh") { va = a.tenChuongTrinh; vb = b.tenChuongTrinh; }
    else if (sortF === "tenDoiTac") { va = a.tenDoiTac;      vb = b.tenDoiTac;      }
    else { va = a.ngayGui.split("/").reverse().join(""); vb = b.ngayGui.split("/").reverse().join(""); }
    return (va < vb ? -1 : va > vb ? 1 : 0) * (sortD === "asc" ? 1 : -1);
  });

  const totalChua = list.filter(y => y.trangThai === "chua-gan").length;
  const totalDa   = list.filter(y => y.trangThai === "da-gan").length;

  const SortIcon = ({ f }: { f: SortF }) =>
    sortF !== f ? <ArrowUpDown size={11} color="#CBD5E1"/> :
    sortD === "asc" ? <ChevronUp size={11} color="#005CB6"/> : <ChevronDown size={11} color="#005CB6"/>;

  const thS: React.CSSProperties = {
    padding: "12px 14px", fontSize: "0.68rem", fontWeight: 700,
    color: "#64748B", textAlign: "left", background: "#F8FAFC",
    whiteSpace: "nowrap", letterSpacing: "0.04em", textTransform: "uppercase",
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F5F7FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <style>{`
        @keyframes toastSlide { from{opacity:0;transform:translateY(-12px) scale(0.95);}to{opacity:1;transform:none;} }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)}/>}
      {ganTarget  && <ModalGanDonVi yeuCau={ganTarget}  onClose={() => setGanTarget(null)}  onSave={handleSaveGan}/>}
      {viewTarget && (
        <ModalXemDonVi yeuCau={viewTarget} onClose={() => setViewTarget(null)} onGan={() => { setGanTarget(viewTarget); setViewTarget(null); }}/>
      )}

      <div className="p-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
              style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)" }}>
              <Link2 size={19} color="#fff"/>
            </div>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0F172A", lineHeight: 1.2 }}>Gán đơn vị</h1>
              <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
                Danh sách yêu cầu từ đối tác đang chờ được gán đơn vị
              </p>
            </div>
          </div>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Tổng yêu cầu",  value: list.length,  color: "#005CB6", bg: "rgba(0,92,182,0.07)", border: "rgba(0,92,182,0.18)" },
            { label: "Chưa gán",       value: totalChua,    color: "#D97706", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.18)" },
            { label: "Đã gán",         value: totalDa,      color: "#0F766E", bg: "rgba(15,118,110,0.07)", border: "rgba(15,118,110,0.18)" },
          ].map(card => (
            <div key={card.label} className="rounded-2xl px-5 py-4"
              style={{ background: card.bg, border: `1.5px solid ${card.border}` }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: card.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: card.color, lineHeight: 1 }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="rounded-2xl mb-4 p-4 flex items-center gap-3 flex-wrap"
          style={{ background: "#fff", border: "1.5px solid #EEF0F4", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm chương trình, tên đối tác…"
              className="w-full outline-none"
              style={{ border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "9px 32px 9px 36px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}
              onFocus={e => Object.assign(e.target.style, { borderColor: "#005CB6", background: "#fff", boxShadow: "0 0 0 3px rgba(0,92,182,0.08)" })}
              onBlur={e  => Object.assign(e.target.style, { borderColor: "#E2E8F0", background: "#F8F9FA", boxShadow: "none" })}
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full"
                style={{ background: "#E2E8F0", border: "none", cursor: "pointer" }}>
                <X size={9} color="#64748B"/>
              </button>
            )}
          </div>

          {/* Loại */}
          <div className="relative">
            <Filter size={13} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <select value={filterLoai} onChange={e => setFilterLoai(e.target.value as LoaiYeuCau | "")}
              style={{ border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "9px 32px 9px 32px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro',sans-serif", appearance: "none", cursor: "pointer", minWidth: 150 }}>
              <option value="">Tất cả loại</option>
              <option value="chuong-trinh">Chương trình</option>
              <option value="goi-cuoc">Gói cước</option>
            </select>
            <ChevronDown size={13} color="#94A3B8" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
          </div>

          {/* Trạng thái */}
          <div className="relative">
            <select value={filterTT} onChange={e => setFilterTT(e.target.value as TrangThaiGan | "")}
              style={{ border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "9px 32px 9px 12px", fontSize: "0.82rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro',sans-serif", appearance: "none", cursor: "pointer", minWidth: 140 }}>
              <option value="">Tất cả trạng thái</option>
              <option value="chua-gan">Chưa gán</option>
              <option value="da-gan">Đã gán</option>
              <option value="moi-cap-nhat">Mới cập nhật</option>
            </select>
            <ChevronDown size={13} color="#94A3B8" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
          </div>

          <span style={{ fontSize: "0.78rem", color: "#94A3B8", marginLeft: "auto" }}>
            <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> kết quả
          </span>
        </div>

        {/* ── TABLE ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1.5px solid #EEF0F4", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thS, width: 52, textAlign: "center" }}>STT</th>
                <th style={{ ...thS, cursor: "pointer" }} onClick={() => handleSort("tenChuongTrinh")}>
                  <div className="flex items-center gap-1.5">Tên chương trình học <SortIcon f="tenChuongTrinh"/></div>
                </th>
                <th style={thS}>Gói cước</th>
                <th style={{ ...thS, cursor: "pointer" }} onClick={() => handleSort("ngayGui")}>
                  <div className="flex items-center gap-1.5">Ngày gửi <SortIcon f="ngayGui"/></div>
                </th>
                <th style={thS}>Người tạo</th>
                <th style={thS}>Trạng thái gán</th>
                <th style={{ ...thS, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Link2 size={36} color="#CBD5E1"/>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#64748B" }}>Không có yêu cầu nào</div>
                        <div style={{ fontSize: "0.74rem", color: "#94A3B8", marginTop: 4 }}>
                          Khi đối tác nhấn "Gửi Admin", yêu cầu sẽ xuất hiện tại đây
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((yc, idx) => {
                const loai = LOAI_CFG[yc.loai];
                const LoaiIcon = loai.icon;
                const tt = TRANG_THAI_CFG[yc.trangThai];
                return (
                  <tr key={yc.id}
                    style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : "none", background: idx % 2 === 0 ? "#fff" : "#FAFBFC", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#FAFBFC")}>

                    {/* STT */}
                    <td style={{ padding: "14px", textAlign: "center" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8" }}>{idx + 1}</span>
                    </td>

                    {/* Tên */}
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>
                        {yc.tenChuongTrinh}
                      </div>
                    </td>

                    {/* Gói cước */}
                    <td style={{ padding: "14px" }}>
                      {yc.goiCuocIds.length === 0 ? (
                        <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>--</span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {yc.goiCuocIds.map(gId => {
                            const goi = MASTER_DATA.flatMap(m => m.danhSachGoi).find(g => g.id === gId);
                            return goi ? (
                              <span key={gId} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 16, background: "rgba(0,92,182,0.08)", color: "#005CB6", fontSize: "0.73rem", fontWeight: 600 }}>
                                {goi.ten}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </td>

                    {/* Ngày gửi */}
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{yc.ngayGui}</span>
                    </td>

                    {/* Người tạo */}
                    <td style={{ padding: "14px" }}>
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg"
                        style={{ background: yc.nguoiTao === "Admin" ? "rgba(59,130,246,0.1)" : "rgba(34,197,94,0.1)", fontSize: "0.8rem", fontWeight: 600, color: yc.nguoiTao === "Admin" ? "#1E40AF" : "#15803D" }}>
                        {yc.nguoiTao}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td style={{ padding: "14px" }}>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ background: tt.bg, fontSize: "0.75rem", fontWeight: 700, color: tt.color, width: "fit-content" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: tt.dot, display: "inline-block" }}/>
                        {tt.label}
                      </span>
                    </td>

                    {/* Hành động */}
                    <td style={{ padding: "14px" }}>
                      <div className="flex items-center justify-center gap-2">
                        {/* Xem */}
                        {yc.trangThai === "da-gan" && (
                          <button
                            onClick={() => setViewTarget(yc)}
                            title="Xem đơn vị đã gán"
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                            style={{ background: "rgba(15,118,110,0.07)", border: "none", cursor: "pointer" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(15,118,110,0.14)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(15,118,110,0.07)")}>
                            <Eye size={14} color="#0F766E"/>
                          </button>
                        )}
                        {/* Gán đơn vị */}
                        <button
                          onClick={() => setGanTarget(yc)}
                          title={yc.trangThai === "chua-gan" ? "Gán đơn vị" : "Cập nhật"}
                          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                          style={{
                            background: yc.trangThai === "chua-gan" ? "rgba(0,92,182,0.07)" : yc.trangThai === "moi-cap-nhat" ? "rgba(124,58,237,0.07)" : "rgba(217,119,6,0.07)",
                            border: "none", cursor: "pointer",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                          <Link2 size={14} color={yc.trangThai === "chua-gan" ? "#005CB6" : yc.trangThai === "moi-cap-nhat" ? "#7C3AED" : "#D97706"}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// ── MODAL XEM ĐƠN VỊ ─────────────────────────────────────────────────────────

function ModalXemDonVi({
  yeuCau, onClose, onGan,
}: { yeuCau: YeuCauGan; onClose: () => void; onGan: () => void }) {
  const loai    = LOAI_CFG[yeuCau.loai];
  const LoaiIcon = loai.icon;
  const configs  = yeuCau.cauHinhs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 580, maxHeight: "82vh", background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", fontFamily: "'Be Vietnam Pro',sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1.5px solid #EEF0F4" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "rgba(15,118,110,0.1)" }}>
              <Eye size={17} color="#0F766E"/>
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#0F172A" }}>Cấu hình gán đơn vị</div>
              <div style={{ fontSize: "0.66rem", color: "#94A3B8", marginTop: 2 }}>
                {configs.length} cấu hình · {new Set(configs.flatMap(c => c.tinhThanhIds)).size} tỉnh / thành
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: "#F1F5F9", border: "none", cursor: "pointer" }}>
            <X size={16} color="#64748B"/>
          </button>
        </div>

        {/* Info */}
        <div className="px-5 py-3 flex-shrink-0" style={{ background: "#F8FAFC", borderBottom: "1px solid #EEF0F4" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: loai.bg }}>
              <LoaiIcon size={13} color={loai.color}/>
            </div>
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A" }}>{yeuCau.tenChuongTrinh}</div>
              <div style={{ fontSize: "0.68rem", color: "#64748B" }}>{yeuCau.tenDoiTac} · {yeuCau.ngayGui}</div>
            </div>
          </div>
        </div>

        {/* Config list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5">
          {configs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Building2 size={28} color="#CBD5E1"/>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Chưa có cấu hình nào</div>
            </div>
          ) : configs.map((cfg, idx) => {
            const capCfg = cfg.capHoc ? (CAP_HOC_CFG[cfg.capHoc] ?? { color: "#64748B", bg: "#F1F5F9" }) : null;
            const truongList = cfg.truongIds.map(id => DS_DON_VI.find(d => d.id === id)).filter(Boolean) as DonViKhaDung[];
            // htKeys: per-school keys or "" for toàn tỉnh
            const htKeys = truongList.length > 0 ? cfg.truongIds : (cfg.tinhThanhIds.length > 0 ? [""] : []);
            return (
              <div key={cfg._id} className="rounded-xl p-3.5"
                style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} color="#64748B"/>
                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A" }}>{cfg.tinhThanhIds.join(", ")}</span>
                  </div>
                  {capCfg && (
                    <>
                      <span style={{ color: "#CBD5E1" }}>·</span>
                      <span className="px-2.5 py-0.5 rounded-lg"
                        style={{ fontSize: "0.72rem", fontWeight: 700, color: capCfg.color, background: capCfg.bg }}>
                        {cfg.capHoc}
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748B", marginLeft: "auto" }}>
                    #{idx + 1}
                  </span>
                </div>
                {/* Per-school hình thức display */}
                {htKeys.length === 0 ? null : (
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {htKeys.map(key => {
                      const dv = key ? DS_DON_VI.find(d => d.id === key) : null;
                      const htList = cfg.hinhThucPerTruong[key] ?? [];
                      return (
                        <div key={key} className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                            style={{ background: "#fff", border: "1px solid #E2E8F0", fontSize: "0.68rem", fontWeight: 600, color: "#374151" }}>
                            <Building2 size={10} color="#94A3B8"/>
                            {dv ? dv.tenDonVi : "Toàn tỉnh"}
                          </span>
                          <div className="flex gap-1">
                            {htList.map(ht => {
                              const hCfg = HINH_THUC_CFG[ht];
                              return (
                                <span key={ht} className="px-2 py-0.5 rounded-md"
                                  style={{ fontSize: "0.66rem", fontWeight: 800, color: hCfg.color, background: hCfg.bg, border: `1px solid ${hCfg.border}` }}>
                                  {hCfg.label}
                                </span>
                              );
                            })}
                            {htList.length === 0 && (
                              <span style={{ fontSize: "0.66rem", color: "#94A3B8" }}>Chưa chọn</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {htKeys.length === 0 && cfg.tinhThanhIds.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle size={12} color="#0F766E"/>
                    <span style={{ fontSize: "0.74rem", color: "#0F766E", fontWeight: 600 }}>Toàn tỉnh (không giới hạn trường)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3.5 flex-shrink-0"
          style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl"
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
