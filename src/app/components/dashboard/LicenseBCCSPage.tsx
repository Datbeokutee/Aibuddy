import { useState } from "react";
import {
  Key, Search, X, Download, RefreshCw,
  ChevronDown, AlertCircle, CheckCircle, Info,
  Database, Edit2, Plus, Minus, Clock, History,
  ShieldCheck, TrendingUp, TrendingDown, Hash,
  ChevronRight,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type LoaiDieuChinh = "cap-moi" | "dieu-chinh-giam";

interface LichSuDieuChinh {
  id: string;
  loai: LoaiDieuChinh;
  soLuong: number;       // số license thay đổi (luôn dương)
  maTrx: string;         // Mã giao dịch BCCS liên kết (nếu có)
  ghiChu: string;
  nguoiThuc: string;
  thoiGian: string;      // "DD/MM/YYYY HH:mm"
  tongSauDieuChinh: number;
}

interface LicenseGoi {
  id: string;
  tenGoi: string;
  maBCSS: string;
  tongLicense: number;
  licenseGan: number;
  ngayCapNhat: string;
  lichSu: LichSuDieuChinh[];
}

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

const DU_LIEU_INIT: LicenseGoi[] = [
  {
    id: "1", tenGoi: "Toàn diện Tiểu học", maBCSS: "BCCS-TH-001",
    tongLicense: 5000, licenseGan: 4800, ngayCapNhat: "05/04/2026",
    lichSu: [
      { id:"h1a", loai:"cap-moi",        soLuong:5000, maTrx:"TRX_20260101_001", ghiChu:"Cấp ban đầu theo hợp đồng Q1/2026",   nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 08:30", tongSauDieuChinh:5000 },
    ],
  },
  {
    id: "2", tenGoi: "Cơ bản THCS", maBCSS: "BCCS-TC-001",
    tongLicense: 3000, licenseGan: 1500, ngayCapNhat: "01/04/2026",
    lichSu: [
      { id:"h2a", loai:"cap-moi",        soLuong:3000, maTrx:"TRX_20260101_002", ghiChu:"Cấp ban đầu theo hợp đồng Q1/2026",   nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 08:31", tongSauDieuChinh:3000 },
    ],
  },
  {
    id: "3", tenGoi: "Luyện thi THPTQG", maBCSS: "BCCS-TP-001",
    tongLicense: 500, licenseGan: 490, ngayCapNhat: "05/04/2026",
    lichSu: [
      { id:"h3a", loai:"cap-moi",        soLuong:500,  maTrx:"TRX_20260101_003", ghiChu:"Cấp ban đầu theo hợp đồng Q1/2026",   nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 08:32", tongSauDieuChinh:500  },
      { id:"h3b", loai:"cap-moi",        soLuong:0,    maTrx:"TRX_99",           ghiChu:"Cấp bù License theo lỗi giao dịch ngày 03/04", nguoiThuc:"admin@k12.vn", thoiGian:"05/04/2026 14:10", tongSauDieuChinh:500  },
    ],
  },
  {
    id: "4", tenGoi: "Trải nghiệm Miễn phí", maBCSS: "BCCS-FREE-001",
    tongLicense: 99999, licenseGan: 45000, ngayCapNhat: "01/01/2026",
    lichSu: [
      { id:"h4a", loai:"cap-moi",        soLuong:99999,maTrx:"",                 ghiChu:"Gói miễn phí, không giới hạn",         nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 08:00", tongSauDieuChinh:99999},
    ],
  },
  {
    id: "5", tenGoi: "Toàn diện K12", maBCSS: "BCCS-K12-001",
    tongLicense: 3000, licenseGan: 2800, ngayCapNhat: "03/04/2026",
    lichSu: [
      { id:"h5a", loai:"cap-moi",        soLuong:2000, maTrx:"TRX_20260101_005", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:00", tongSauDieuChinh:2000 },
      { id:"h5b", loai:"cap-moi",        soLuong:1000, maTrx:"TRX_20260403_011", ghiChu:"Bổ sung Q2/2026 theo đề nghị Sở GD",   nguoiThuc:"admin@k12.vn", thoiGian:"03/04/2026 10:15", tongSauDieuChinh:3000 },
    ],
  },
  {
    id: "6", tenGoi: "Khoa học TN Nâng cao", maBCSS: "BCCS-TP-002",
    tongLicense: 2500, licenseGan: 1200, ngayCapNhat: "02/04/2026",
    lichSu: [
      { id:"h6a", loai:"cap-moi",        soLuong:3000, maTrx:"TRX_20260101_006", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:05", tongSauDieuChinh:3000 },
      { id:"h6b", loai:"dieu-chinh-giam",soLuong:500,  maTrx:"",                 ghiChu:"Điều chỉnh giảm theo thực tế hợp đồng", nguoiThuc:"admin@k12.vn", thoiGian:"02/04/2026 11:00", tongSauDieuChinh:2500 },
    ],
  },
  {
    id: "7", tenGoi: "Xã hội & Ngoại ngữ", maBCSS: "BCCS-TC-003",
    tongLicense: 2000, licenseGan: 2000, ngayCapNhat: "01/04/2026",
    lichSu: [
      { id:"h7a", loai:"cap-moi",        soLuong:2000, maTrx:"TRX_20260101_007", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:10", tongSauDieuChinh:2000 },
    ],
  },
  {
    id: "8", tenGoi: "Chuyên sâu Luyện thi", maBCSS: "BCCS-TP-001B",
    tongLicense: 1500, licenseGan: 800, ngayCapNhat: "04/04/2026",
    lichSu: [
      { id:"h8a", loai:"cap-moi",        soLuong:1000, maTrx:"TRX_20260101_008", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:15", tongSauDieuChinh:1000 },
      { id:"h8b", loai:"cap-moi",        soLuong:500,  maTrx:"TRX_20260404_022", ghiChu:"Bổ sung theo yêu cầu phụ huynh Q2",    nguoiThuc:"admin@k12.vn", thoiGian:"04/04/2026 14:30", tongSauDieuChinh:1500 },
    ],
  },
  {
    id: "9", tenGoi: "Khoa học TN THCS", maBCSS: "BCCS-TC-002",
    tongLicense: 3000, licenseGan: 1800, ngayCapNhat: "01/03/2026",
    lichSu: [
      { id:"h9a", loai:"cap-moi",        soLuong:3000, maTrx:"TRX_20260101_009", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:20", tongSauDieuChinh:3000 },
    ],
  },
  {
    id: "10", tenGoi: "Chuyên Toán Lý Hóa", maBCSS: "BCCS-TP-003",
    tongLicense: 800, licenseGan: 800, ngayCapNhat: "01/02/2026",
    lichSu: [
      { id:"h10a", loai:"cap-moi",        soLuong:1000,maTrx:"TRX_20260101_010", ghiChu:"Cấp ban đầu Q1/2026",                  nguoiThuc:"admin@k12.vn", thoiGian:"01/01/2026 09:25", tongSauDieuChinh:1000 },
      { id:"h10b", loai:"dieu-chinh-giam",soLuong:200, maTrx:"",                 ghiChu:"Giảm theo điều chỉnh hợp đồng",        nguoiThuc:"admin@k12.vn", thoiGian:"01/02/2026 16:00", tongSauDieuChinh:800  },
    ],
  },
];

// ── TIỆN ÍCH ──────────────────────────────────────────────────────────────────

const fmtSL = (n: number) => n.toLocaleString("vi-VN");
const now   = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
};

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error" | "info"; onDone: () => void }) {
  const c = { success:"#0F766E", error:"#D4183D", info:"#005CB6" }[type];
  return (
    <div className="fixed top-5 right-5 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
      style={{ background:"#fff", border:`1.5px solid ${c}40`, boxShadow:"0 8px 32px rgba(0,0,0,0.14)", fontFamily:"'Be Vietnam Pro',sans-serif", maxWidth:400 }}>
      {type==="success" ? <CheckCircle size={16} color={c}/> : type==="error" ? <AlertCircle size={16} color={c}/> : <Info size={16} color={c}/>}
      <span style={{ fontSize:"0.84rem", fontWeight:600, color:"#1E293B" }}>{msg}</span>
      <button onClick={onDone} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", opacity:0.5 }}><X size={13}/></button>
    </div>
  );
}

// ── PROGRESS BAR ──────────────────────────────────────────────────────────────

function QuotaBar({ gan, tong }: { gan: number; tong: number }) {
  const pct = tong > 0 ? Math.min((gan / tong) * 100, 100) : 0;
  const color = pct >= 100 ? "#D4183D" : pct >= 90 ? "#D97706" : pct >= 60 ? "#005CB6" : "#059669";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height:5, background:"#EEF0F4", minWidth:60 }}>
        <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:color }}/>
      </div>
      <span style={{ fontSize:"0.65rem", fontWeight:700, color, minWidth:32, textAlign:"right" }}>{Math.round(pct)}%</span>
    </div>
  );
}

// ── FORM KHAI BÁO & ĐIỀU CHỈNH LICENSE ───────────────────────────────────────

interface FormData {
  loai: LoaiDieuChinh;
  soLuong: string;
  maTrx: string;
  ghiChu: string;
}

const FORM_RONG: FormData = { loai:"cap-moi", soLuong:"", maTrx:"", ghiChu:"" };

function DrawerDieuChinh({
  goi, onClose, onSave,
}: {
  goi: LicenseGoi;
  onClose: () => void;
  onSave: (loai: LoaiDieuChinh, soLuong: number, maTrx: string, ghiChu: string) => void;
}) {
  const [form, setForm] = useState<FormData>(FORM_RONG);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [tab, setTab] = useState<"form"|"history">("form");

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const soLuongNum = Number(form.soLuong);
  const conLaiHienTai = goi.tongLicense - goi.licenseGan;
  const tongSau = form.loai === "cap-moi"
    ? goi.tongLicense + (soLuongNum || 0)
    : goi.tongLicense - (soLuongNum || 0);
  const conLaiSau = tongSau - goi.licenseGan;
  const isGiamQuaMin = form.loai === "dieu-chinh-giam" && soLuongNum > 0 && conLaiSau < 0;

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.soLuong || isNaN(soLuongNum) || soLuongNum <= 0)
      e.soLuong = "Số lượng phải là số nguyên dương";
    if (form.loai === "dieu-chinh-giam" && soLuongNum > conLaiHienTai)
      e.soLuong = `Không thể giảm quá ${fmtSL(conLaiHienTai)} license còn lại`;
    if (!form.ghiChu.trim()) e.ghiChu = "Vui lòng nhập ghi chú / lý do điều chỉnh";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave(form.loai, soLuongNum, form.maTrx.trim(), form.ghiChu.trim());
  };

  const iStyle = (k: keyof FormData): React.CSSProperties => ({
    display:"block", width:"100%", padding:"9px 13px",
    border:`1.5px solid ${errors[k] ? "#D4183D" : "#E2E8F0"}`,
    borderRadius:10, fontSize:"0.82rem", outline:"none", background:"#fff",
    fontFamily:"'Be Vietnam Pro',sans-serif", color:"#0F172A",
    boxShadow: errors[k] ? "0 0 0 3px rgba(212,24,61,0.08)" : "none",
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background:"rgba(15,23,42,0.42)", backdropFilter:"blur(3px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="flex flex-col h-full" style={{ width:480, background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.14)", fontFamily:"'Be Vietnam Pro',sans-serif" }}>

        {/* ── HEADER ── */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0"
          style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)", color:"#fff" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl"
                style={{ background:"rgba(255,255,255,0.16)" }}>
                <Key size={20} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize:"0.61rem", fontWeight:700, letterSpacing:"0.12em", opacity:0.75, textTransform:"uppercase", marginBottom:3 }}>
                  Khai báo & Điều chỉnh License
                </div>
                <div style={{ fontSize:"0.95rem", fontWeight:800, lineHeight:1.3 }}>{goi.tenGoi}</div>
                <div style={{ fontSize:"0.7rem", opacity:0.75, marginTop:2, fontFamily:"monospace" }}>{goi.maBCSS}</div>
              </div>
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{ background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.28)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.15)")}>
              <X size={15} color="#fff"/>
            </button>
          </div>

          {/* Quota snapshot */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:"Tổng license", value: fmtSL(goi.tongLicense), color:"rgba(255,255,255,0.9)" },
              { label:"Đã gán",       value: fmtSL(goi.licenseGan),  color:"rgba(255,255,255,0.9)" },
              { label:"Còn lại",      value: fmtSL(conLaiHienTai),   color: conLaiHienTai===0 ? "#FCA5A5" : conLaiHienTai < goi.tongLicense*0.1 ? "#FDE68A" : "rgba(255,255,255,0.9)" },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-3 py-2 text-center"
                style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)" }}>
                <div style={{ fontSize:"1.1rem", fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"0.6rem", opacity:0.75, marginTop:1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB ── */}
        <div className="flex flex-shrink-0 border-b" style={{ borderColor:"#EEF0F4" }}>
          {([["form","Điều chỉnh",Edit2],["history","Lịch sử",History]] as const).map(([id,label,Icon])=>(
            <button key={id} onClick={()=>setTab(id)}
              className="flex items-center gap-2 px-5 py-3 flex-1 justify-center"
              style={{
                fontSize:"0.8rem", fontWeight: tab===id ? 700 : 500,
                color: tab===id ? "#005CB6" : "#64748B",
                borderBottom: `2.5px solid ${tab===id ? "#005CB6" : "transparent"}`,
                background:"none", border:"none", borderBottomWidth:"2.5px",
                borderBottomStyle:"solid", borderBottomColor: tab===id ? "#005CB6" : "transparent",
                cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif",
                transition:"all 0.15s",
              }}>
              <Icon size={13}/>{label}
              {id==="history" && goi.lichSu.length > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full"
                  style={{ background:"rgba(0,92,182,0.12)", fontSize:"0.55rem", fontWeight:800, color:"#005CB6" }}>
                  {goi.lichSu.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── NỘI DUNG ── */}
        <div className="flex-1 overflow-y-auto">

          {/* === TAB FORM === */}
          {tab==="form" && (
            <div className="px-6 py-5 space-y-5">

              {/* Thông tin gói (read-only) */}
              <div className="rounded-xl p-4" style={{ background:"rgba(0,92,182,0.04)", border:"1.5px solid rgba(0,92,182,0.14)" }}>
                <p style={{ fontSize:"0.62rem", fontWeight:700, color:"#94A3B8", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Thông tin gói (chỉ đọc)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p style={{ fontSize:"0.65rem", color:"#94A3B8", marginBottom:2 }}>Tên gói cước</p>
                    <p style={{ fontSize:"0.82rem", fontWeight:700, color:"#0F172A" }}>{goi.tenGoi}</p>
                  </div>
                  <div>
                    <p style={{ fontSize:"0.65rem", color:"#94A3B8", marginBottom:2 }}>Mã gói BCCS</p>
                    <p style={{ fontSize:"0.82rem", fontWeight:700, color:"#005CB6", fontFamily:"monospace" }}>{goi.maBCSS}</p>
                  </div>
                  <div>
                    <p style={{ fontSize:"0.65rem", color:"#94A3B8", marginBottom:2 }}>Cập nhật lần cuối</p>
                    <p style={{ fontSize:"0.78rem", fontWeight:600, color:"#374151" }}>{goi.ngayCapNhat}</p>
                  </div>
                </div>
              </div>

              {/* Loại điều chỉnh */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:10 }}>
                  Loại điều chỉnh <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { val:"cap-moi"          as LoaiDieuChinh, label:"Cấp mới",           desc:"Cộng thêm license vào kho",    Icon:Plus,  color:"#0F766E", bg:"rgba(15,118,110,0.06)", border:"rgba(15,118,110,0.25)" },
                    { val:"dieu-chinh-giam"  as LoaiDieuChinh, label:"Điều chỉnh giảm",   desc:"Trừ bớt license khỏi kho",    Icon:Minus, color:"#D97706", bg:"rgba(217,119,6,0.06)",  border:"rgba(217,119,6,0.25)"  },
                  ]).map(opt => {
                    const sel = form.loai === opt.val;
                    return (
                      <label key={opt.val}
                        className="flex flex-col gap-1.5 rounded-xl p-3.5 cursor-pointer transition-all"
                        style={{
                          border:`2px solid ${sel ? opt.color : "#E2E8F0"}`,
                          background: sel ? opt.bg : "#fff",
                          boxShadow: sel ? `0 0 0 3px ${opt.color}15` : "none",
                        }}>
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ border:`2px solid ${sel ? opt.color : "#CBD5E1"}`, background: sel ? opt.color : "transparent" }}>
                            {sel && <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-px"/>}
                          </div>
                          <input type="radio" name="loai" value={opt.val} checked={sel}
                            onChange={()=>set("loai",opt.val)} className="sr-only"/>
                          <div className="flex items-center gap-1.5">
                            <opt.Icon size={12} color={sel ? opt.color : "#94A3B8"}/>
                            <span style={{ fontSize:"0.78rem", fontWeight:800, color: sel ? opt.color : "#374151" }}>{opt.label}</span>
                          </div>
                        </div>
                        <p style={{ fontSize:"0.64rem", color:"#64748B", lineHeight:1.5, paddingLeft:20 }}>{opt.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Số lượng */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Số lượng License thay đổi <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="number" min="1"
                    value={form.soLuong}
                    onChange={e=>set("soLuong",e.target.value)}
                    placeholder="Ví dụ: 1000"
                    style={{ ...iStyle("soLuong"), paddingRight:56 }}
                    onFocus={e=>Object.assign(e.target.style,{ borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.1)" })}
                    onBlur={e=>Object.assign(e.target.style,{ borderColor:errors.soLuong?"#D4183D":"#E2E8F0", boxShadow:errors.soLuong?"0 0 0 3px rgba(212,24,61,0.08)":"none" })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600, pointerEvents:"none" }}>license</span>
                </div>
                {errors.soLuong && (
                  <p className="flex items-center gap-1.5 mt-1.5" style={{ fontSize:"0.68rem", color:"#D4183D" }}>
                    <AlertCircle size={11}/>{errors.soLuong}
                  </p>
                )}

                {/* Preview tính toán */}
                {soLuongNum > 0 && !errors.soLuong && (
                  <div className="mt-3 rounded-xl px-4 py-3 space-y-1.5"
                    style={{ background: isGiamQuaMin ? "rgba(212,24,61,0.05)" : "rgba(0,92,182,0.05)", border:`1px solid ${isGiamQuaMin ? "rgba(212,24,61,0.2)" : "rgba(0,92,182,0.15)"}` }}>
                    {isGiamQuaMin ? (
                      <p className="flex items-center gap-2" style={{ fontSize:"0.72rem", color:"#D4183D", fontWeight:600 }}>
                        <AlertCircle size={13}/> Không thể giảm: License còn lại sẽ âm ({fmtSL(conLaiSau)})
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize:"0.7rem", color:"#64748B" }}>Tổng license hiện tại</span>
                          <span style={{ fontSize:"0.75rem", fontWeight:700, color:"#0F172A" }}>{fmtSL(goi.tongLicense)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize:"0.7rem", color:"#64748B" }}>
                            {form.loai==="cap-moi" ? "Cộng thêm" : "Giảm bớt"}
                          </span>
                          <span style={{ fontSize:"0.75rem", fontWeight:700, color: form.loai==="cap-moi" ? "#0F766E" : "#D97706" }}>
                            {form.loai==="cap-moi" ? "+" : "−"}{fmtSL(soLuongNum)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(0,92,182,0.12)" }}>
                          <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#005CB6" }}>Tổng sau điều chỉnh</span>
                          <span style={{ fontSize:"0.82rem", fontWeight:900, color:"#005CB6" }}>{fmtSL(tongSau)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize:"0.7rem", color:"#64748B" }}>Còn lại sau điều chỉnh</span>
                          <span style={{ fontSize:"0.75rem", fontWeight:700, color: conLaiSau===0?"#D4183D":conLaiSau<tongSau*0.1?"#D97706":"#0F766E" }}>{fmtSL(conLaiSau)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mã giao dịch BCCS */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Mã giao dịch BCCS liên kết
                  <span style={{ fontSize:"0.62rem", color:"#94A3B8", fontWeight:400, marginLeft:6 }}>Không bắt buộc</span>
                </label>
                <div className="relative">
                  <Hash size={13} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                  <input
                    type="text"
                    value={form.maTrx}
                    onChange={e=>set("maTrx",e.target.value)}
                    placeholder="VD: TRX_20260405_099"
                    style={{ ...iStyle("maTrx"), paddingLeft:34, fontFamily:"monospace", fontSize:"0.8rem" }}
                    onFocus={e=>Object.assign(e.target.style,{ borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.1)" })}
                    onBlur={e=>Object.assign(e.target.style,{ borderColor:"#E2E8F0", boxShadow:"none" })}
                  />
                </div>
                <p style={{ fontSize:"0.65rem", color:"#94A3B8", marginTop:4 }}>Dùng để đối soát với hệ thống thanh toán BCCS</p>
              </div>

              {/* Ghi chú */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Ghi chú / Lý do điều chỉnh <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <textarea
                  value={form.ghiChu}
                  onChange={e=>set("ghiChu",e.target.value)}
                  placeholder="VD: Cấp bù License cho lỗi giao dịch ngày 05/04 theo yêu cầu Sở GD&ĐT..."
                  rows={3}
                  style={{
                    ...iStyle("ghiChu"), resize:"vertical", lineHeight:1.6,
                    border:`1.5px solid ${errors.ghiChu ? "#D4183D" : "#E2E8F0"}`,
                  }}
                  onFocus={e=>Object.assign(e.target.style,{ borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.1)" })}
                  onBlur={e=>Object.assign(e.target.style,{ borderColor:errors.ghiChu?"#D4183D":"#E2E8F0", boxShadow:errors.ghiChu?"0 0 0 3px rgba(212,24,61,0.08)":"none" })}
                />
                {errors.ghiChu && (
                  <p className="flex items-center gap-1.5 mt-1.5" style={{ fontSize:"0.68rem", color:"#D4183D" }}>
                    <AlertCircle size={11}/>{errors.ghiChu}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* === TAB LỊCH SỬ === */}
          {tab==="history" && (
            <div className="px-6 py-5">
              {goi.lichSu.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <History size={28} color="#CBD5E1"/>
                  <p style={{ fontSize:"0.8rem", color:"#94A3B8" }}>Chưa có lịch sử điều chỉnh</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-3 bottom-3 w-px" style={{ background:"#EEF0F4" }}/>
                  <div className="space-y-4 pl-10">
                    {[...goi.lichSu].reverse().map((h, i) => {
                      const isCapMoi = h.loai === "cap-moi";
                      return (
                        <div key={h.id} className="relative">
                          {/* Dot */}
                          <div className="absolute -left-10 top-2 flex items-center justify-center w-8 h-8 rounded-full"
                            style={{ background: isCapMoi ? "rgba(15,118,110,0.1)" : "rgba(217,119,6,0.1)", border:`2px solid ${isCapMoi ? "rgba(15,118,110,0.3)" : "rgba(217,119,6,0.3)"}` }}>
                            {isCapMoi ? <Plus size={11} color="#0F766E"/> : <Minus size={11} color="#D97706"/>}
                          </div>
                          <div className="rounded-xl p-3.5" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                                  style={{
                                    background: isCapMoi ? "rgba(15,118,110,0.1)" : "rgba(217,119,6,0.1)",
                                    fontSize:"0.65rem", fontWeight:800,
                                    color: isCapMoi ? "#0F766E" : "#D97706",
                                  }}>
                                  {isCapMoi ? <TrendingUp size={9}/> : <TrendingDown size={9}/>}
                                  {isCapMoi ? "Cấp mới" : "Điều chỉnh giảm"}
                                </span>
                                {h.soLuong > 0 && (
                                  <span className="ml-2" style={{ fontSize:"0.82rem", fontWeight:800, color: isCapMoi ? "#0F766E" : "#D97706" }}>
                                    {isCapMoi ? "+" : "−"}{fmtSL(h.soLuong)}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize:"0.62rem", color:"#94A3B8", flexShrink:0, marginLeft:8 }}>{h.thoiGian}</span>
                            </div>
                            {h.maTrx && (
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Hash size={10} color="#94A3B8"/>
                                <span style={{ fontSize:"0.68rem", fontFamily:"monospace", color:"#005CB6", fontWeight:600 }}>{h.maTrx}</span>
                              </div>
                            )}
                            <p style={{ fontSize:"0.72rem", color:"#374151", lineHeight:1.6 }}>{h.ghiChu}</p>
                            {h.tongSauDieuChinh > 0 && (
                              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t" style={{ borderColor:"#EEF0F4" }}>
                                <Database size={10} color="#94A3B8"/>
                                <span style={{ fontSize:"0.64rem", color:"#64748B" }}>Tổng sau: <strong style={{ color:"#0F172A" }}>{fmtSL(h.tongSauDieuChinh)}</strong></span>
                                <span className="ml-2" style={{ fontSize:"0.6rem", color:"#94A3B8" }}>· {h.nguoiThuc}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        {tab==="form" && (
          <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
            <button onClick={onClose}
              className="flex items-center justify-center px-5 py-2.5 rounded-xl"
              style={{ flex:1, background:"#F1F5F9", border:"1.5px solid #E2E8F0", color:"#64748B", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              Hủy bỏ
            </button>
            <button onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl"
              style={{ flex:2, background:"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.84rem", fontWeight:700, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow:"0 4px 14px rgba(0,92,182,0.35)" }}
              onMouseEnter={e=>(e.currentTarget.style.opacity="0.92")}
              onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
              <ShieldCheck size={15}/> Cập nhật hạn mức
            </button>
          </div>
        )}
        {tab==="history" && (
          <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
            <button onClick={()=>setTab("form")}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl"
              style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.84rem", fontWeight:700, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              <Edit2 size={14}/> Thực hiện điều chỉnh mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function LicenseBCCSPage() {
  const [list, setList] = useState<LicenseGoi[]>(DU_LIEU_INIT);
  const [search, setSearch] = useState("");
  const [filterTT, setFilterTT] = useState<"" | "day" | "thap" | "het">("");
  const [sortCol, setSortCol] = useState<"tongLicense"|"licenseGan"|"conLai"|"">("");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [editGoi, setEditGoi] = useState<LicenseGoi | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  // ── Derived stats ──
  const tongAll       = list.reduce((a,g) => a + g.tongLicense, 0);
  const ganAll        = list.reduce((a,g) => a + g.licenseGan, 0);
  const conLaiAll     = tongAll - ganAll;
  const soDayLicense  = list.filter(g => (g.tongLicense - g.licenseGan) / (g.tongLicense || 1) < 0.1).length;

  // ── Filter + sort ──
  const filtered = list
    .filter(g => {
      if (search && !g.tenGoi.toLowerCase().includes(search.toLowerCase()) && !g.maBCSS.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTT === "het")  return (g.tongLicense - g.licenseGan) === 0;
      if (filterTT === "thap") return (g.tongLicense - g.licenseGan) > 0 && (g.tongLicense - g.licenseGan) / (g.tongLicense||1) < 0.1;
      if (filterTT === "day")  return (g.tongLicense - g.licenseGan) / (g.tongLicense||1) >= 0.1;
      return true;
    })
    .sort((a, b) => {
      if (!sortCol) return 0;
      const va = sortCol === "conLai" ? (a.tongLicense - a.licenseGan) : sortCol === "tongLicense" ? a.tongLicense : a.licenseGan;
      const vb = sortCol === "conLai" ? (b.tongLicense - b.licenseGan) : sortCol === "tongLicense" ? b.tongLicense : b.licenseGan;
      return sortDir === "asc" ? va - vb : vb - va;
    });

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  // ── Cập nhật license ──
  const handleSave = (loai: LoaiDieuChinh, soLuong: number, maTrx: string, ghiChu: string) => {
    if (!editGoi) return;
    const newHistory: LichSuDieuChinh = {
      id: `h${Date.now()}`, loai, soLuong, maTrx, ghiChu,
      nguoiThuc: "admin@k12.vn",
      thoiGian: now(),
      tongSauDieuChinh: loai === "cap-moi" ? editGoi.tongLicense + soLuong : editGoi.tongLicense - soLuong,
    };
    setList(prev => prev.map(g => {
      if (g.id !== editGoi.id) return g;
      const tongMoi = loai === "cap-moi" ? g.tongLicense + soLuong : g.tongLicense - soLuong;
      return { ...g, tongLicense: tongMoi, ngayCapNhat: todayStr(), lichSu: [...g.lichSu, newHistory] };
    }));
    setEditGoi(prev => prev ? {
      ...prev,
      tongLicense: loai === "cap-moi" ? prev.tongLicense + soLuong : prev.tongLicense - soLuong,
      ngayCapNhat: todayStr(),
      lichSu: [...prev.lichSu, newHistory],
    } : null);
    const verb = loai === "cap-moi" ? `Đã cấp thêm ${fmtSL(soLuong)} license` : `Đã giảm ${fmtSL(soLuong)} license`;
    setToast({ msg: `${verb} cho gói "${editGoi.tenGoi}"`, type:"success" });
    setEditGoi(null);
  };

  const thS: React.CSSProperties = {
    padding:"10px 14px", fontSize:"0.67rem", fontWeight:700, color:"#64748B",
    letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap",
  };

  return (
    <div className="min-h-screen" style={{ background:"#F5F7FA", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      {editGoi && <DrawerDieuChinh goi={editGoi} onClose={()=>setEditGoi(null)} onSave={handleSave}/>}

      <div className="p-6 max-w-[1300px] mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize:"0.72rem", color:"#94A3B8", fontWeight:500 }}>Quản lý License & BCCS</span>
              <ChevronRight size={13} color="#CBD5E1"/>
              <span style={{ fontSize:"0.72rem", color:"#005CB6", fontWeight:700 }}>Danh sách hạn mức</span>
            </div>
            <h1 style={{ fontSize:"1.35rem", fontWeight:900, color:"#0F172A", lineHeight:1.25, margin:0 }}>
              Quản lý License & BCCS
            </h1>
            <p style={{ fontSize:"0.8rem", color:"#64748B", marginTop:4 }}>
              Khai báo và điều chỉnh hạn mức license cho các gói cước theo từng mã giao dịch BCCS
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background:"rgba(0,92,182,0.08)", border:"1.5px solid rgba(0,92,182,0.22)", color:"#005CB6", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
            <Download size={14}/> Xuất Excel
          </button>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label:"Tổng gói có hạn mức", value:String(list.length),      sub:"gói đã cấu hình",        color:"#005CB6", bg:"rgba(0,92,182,0.08)",   Icon:Key         },
            { label:"Tổng License cấp",     value:fmtSL(tongAll),            sub:"license trong hệ thống", color:"#005CB6", bg:"rgba(0,92,182,0.08)",   Icon:Database    },
            { label:"License đã gán",       value:fmtSL(ganAll),             sub:`${Math.round(ganAll/tongAll*100)||0}% đang sử dụng`, color:"#7C3AED", bg:"rgba(124,58,237,0.08)", Icon:ShieldCheck },
            { label:"License còn lại",      value:fmtSL(conLaiAll),          sub:`${soDayLicense} gói sắp cạn kiệt`, color: soDayLicense>0?"#D97706":"#059669", bg: soDayLicense>0?"rgba(217,119,6,0.08)":"rgba(5,150,105,0.08)", Icon:TrendingUp },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background:"#fff", border:`1.5px solid ${s.color}22`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                style={{ background:s.bg }}><s.Icon size={19} color={s.color}/></div>
              <div className="flex-1">
                <div style={{ fontSize:"1.5rem", fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#0F172A", marginTop:3 }}>{s.label}</div>
                <div style={{ fontSize:"0.65rem", color:"#94A3B8", marginTop:2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BẢNG CHÍNH ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1.5px solid #E8ECF0", boxShadow:"0 4px 16px rgba(0,0,0,0.04)" }}>

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-4 flex-wrap" style={{ borderBottom:"1px solid #EEF0F4" }}>
            {/* Search */}
            <div className="relative" style={{ flex:1, minWidth:220, maxWidth:340 }}>
              <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Tìm tên gói hoặc mã BCCS…"
                className="w-full outline-none rounded-xl"
                style={{ border:"1.5px solid #E2E8F0", padding:"9px 14px 9px 34px", fontSize:"0.82rem", fontFamily:"'Be Vietnam Pro',sans-serif", background:"#fff" }}
                onFocus={e=>Object.assign(e.target.style,{ borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" })}
                onBlur={e=>Object.assign(e.target.style,{ borderColor:"#E2E8F0", boxShadow:"none" })}
              />
              {search && <button onClick={()=>setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full" style={{ background:"#E2E8F0", border:"none", cursor:"pointer" }}><X size={10} color="#64748B"/></button>}
            </div>

            {/* Trạng thái hạn mức */}
            <div className="relative">
              <select value={filterTT} onChange={e=>setFilterTT(e.target.value as typeof filterTT)}
                className="outline-none rounded-xl appearance-none pr-8"
                style={{ border:"1.5px solid #E2E8F0", padding:"9px 14px", fontSize:"0.82rem", background:"#fff", cursor:"pointer", color:filterTT?"#0F172A":"#94A3B8", fontFamily:"'Be Vietnam Pro',sans-serif", minWidth:160 }}>
                <option value="">Tất cả trạng thái</option>
                <option value="day">Dồi dào (≥10%)</option>
                <option value="thap">Sắp cạn (&lt;10%)</option>
                <option value="het">Đã hết (0%)</option>
              </select>
              <ChevronDown size={13} color="#94A3B8" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
            </div>

            {(search || filterTT) && (
              <button onClick={()=>{ setSearch(""); setFilterTT(""); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{ border:"1.5px solid #E2E8F0", background:"#fff", cursor:"pointer", fontSize:"0.78rem", color:"#64748B", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
                <RefreshCw size={12}/> Xóa lọc
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background:"#F8FAFC", borderBottom:"1.5px solid #EEF0F4" }}>
                  <th style={{ ...thS, textAlign:"center", width:44 }}>STT</th>
                  <th style={{ ...thS }}>Tên chương trình</th>
                  <th style={{ ...thS }}>Gói cước</th>
                  <th style={{ ...thS, textAlign:"right", cursor:"pointer" }} onClick={()=>toggleSort("tongLicense")}>
                    <span className="flex items-center justify-end gap-1">Tổng License cấp <ChevronDown size={11} style={{ transform: sortCol==="tongLicense" && sortDir==="asc" ? "rotate(180deg)":"rotate(0deg)", opacity:sortCol==="tongLicense"?1:0.4 }}/></span>
                  </th>
                  <th style={{ ...thS, textAlign:"right", cursor:"pointer" }} onClick={()=>toggleSort("licenseGan")}>
                    <span className="flex items-center justify-end gap-1">License đã gán <ChevronDown size={11} style={{ transform: sortCol==="licenseGan" && sortDir==="asc" ? "rotate(180deg)":"rotate(0deg)", opacity:sortCol==="licenseGan"?1:0.4 }}/></span>
                  </th>
                  <th style={{ ...thS, textAlign:"right", cursor:"pointer" }} onClick={()=>toggleSort("conLai")}>
                    <span className="flex items-center justify-end gap-1">License còn lại <ChevronDown size={11} style={{ transform: sortCol==="conLai" && sortDir==="asc" ? "rotate(180deg)":"rotate(0deg)", opacity:sortCol==="conLai"?1:0.4 }}/></span>
                  </th>
                  <th style={{ ...thS }}>Mức sử dụng</th>
                  <th style={{ ...thS }}>Ngày cập nhật cuối</th>
                  <th style={{ ...thS, textAlign:"center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding:"52px 24px", textAlign:"center" }}>
                      <Key size={32} color="#CBD5E1" style={{ margin:"0 auto 12px" }}/>
                      <p style={{ color:"#94A3B8", fontSize:"0.85rem" }}>Không tìm thấy gói cước phù hợp</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((g, idx) => {
                    const conLai = g.tongLicense - g.licenseGan;
                    const pct = g.tongLicense > 0 ? (g.licenseGan / g.tongLicense) * 100 : 0;
                    const isHet  = conLai === 0;
                    const isThap = !isHet && pct >= 90;
                    return (
                      <tr key={g.id}
                        style={{ borderBottom:"1px solid #F1F5F9", transition:"background 0.12s" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="#FAFBFE")}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        {/* STT */}
                        <td style={{ padding:"12px 14px", textAlign:"center" }}>
                          <span style={{ fontSize:"0.74rem", color:"#94A3B8", fontWeight:600 }}>{idx+1}</span>
                        </td>
                        {/* Tên chương trình */}
                        <td style={{ padding:"12px 14px", maxWidth:220 }}>
                          <div style={{ fontSize:"0.84rem", fontWeight:700, color:"#0F172A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.tenGoi}</div>
                        </td>
                        {/* Mã BCCS */}
                        <td style={{ padding:"12px 14px" }}>
                          <div style={{ fontSize:"0.72rem", fontFamily:"monospace", fontWeight:700, color:"#005CB6" }}>{g.maBCSS}</div>
                        </td>
                        {/* Tổng */}
                        <td style={{ padding:"12px 14px", textAlign:"right" }}>
                          <span style={{ fontSize:"0.85rem", fontWeight:800, color:"#005CB6" }}>{fmtSL(g.tongLicense)}</span>
                        </td>
                        {/* Đã gán */}
                        <td style={{ padding:"12px 14px", textAlign:"right" }}>
                          <span style={{ fontSize:"0.84rem", fontWeight:700, color:"#374151" }}>{fmtSL(g.licenseGan)}</span>
                        </td>
                        {/* Còn lại */}
                        <td style={{ padding:"12px 14px", textAlign:"right" }}>
                          <span style={{ fontSize:"0.84rem", fontWeight:800, color: isHet?"#D4183D":isThap?"#D97706":"#0F766E" }}>
                            {fmtSL(conLai)}
                          </span>
                          {isHet && (
                            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"#D4183D", marginTop:2 }}>● Đã hết</div>
                          )}
                          {isThap && (
                            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"#D97706", marginTop:2 }}>▲ Sắp cạn</div>
                          )}
                        </td>
                        {/* Mức sử dụng */}
                        <td style={{ padding:"12px 14px", minWidth:130 }}>
                          <QuotaBar gan={g.licenseGan} tong={g.tongLicense}/>
                        </td>
                        {/* Cập nhật */}
                        <td style={{ padding:"12px 14px" }}>
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} color="#94A3B8"/>
                            <span style={{ fontSize:"0.76rem", color:"#64748B" }}>{g.ngayCapNhat}</span>
                          </div>
                          {g.lichSu.length > 0 && (
                            <div style={{ fontSize:"0.6rem", color:"#94A3B8", marginTop:2 }}>
                              {g.lichSu.length} lần điều chỉnh
                            </div>
                          )}
                        </td>
                        {/* Action */}
                        <td style={{ padding:"12px 14px", textAlign:"center" }}>
                          <button
                            onClick={()=>setEditGoi(g)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg mx-auto"
                            style={{ background:"rgba(100,116,139,0.07)", border:"1px solid rgba(100,116,139,0.2)", cursor:"pointer", color:"#64748B" }}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,92,182,0.08)";e.currentTarget.style.borderColor="rgba(0,92,182,0.25)";e.currentTarget.style.color="#005CB6";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="rgba(100,116,139,0.07)";e.currentTarget.style.borderColor="rgba(100,116,139,0.2)";e.currentTarget.style.color="#64748B";}}>
                            <Edit2 size={13}/>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
            <span style={{ fontSize:"0.75rem", color:"#94A3B8" }}>
              Hiển thị {filtered.length}/{list.length} gói cước
            </span>
            <div />
          </div>
        </div>

        {/* ── THÔNG BÁO CẢNH BÁO ── */}
        {filtered.some(g => (g.tongLicense - g.licenseGan) <= 0) && (
          <div className="mt-4 flex items-start gap-3 px-5 py-4 rounded-2xl"
            style={{ background:"rgba(212,24,61,0.05)", border:"1.5px solid rgba(212,24,61,0.2)" }}>
            <AlertCircle size={16} color="#D4183D" className="flex-shrink-0 mt-0.5"/>
            <div>
              <p style={{ fontSize:"0.8rem", fontWeight:700, color:"#D4183D", marginBottom:4 }}>Cảnh báo: Một số gói đã hết license</p>
              <p style={{ fontSize:"0.74rem", color:"#374151", lineHeight:1.6 }}>
                {filtered.filter(g=>(g.tongLicense-g.licenseGan)===0).map(g=>g.tenGoi).join(", ")} — Cần khai báo thêm license để đảm bảo liên tục cấp phát.
              </p>
            </div>
            <button onClick={()=>{
              const het = filtered.find(g=>(g.tongLicense-g.licenseGan)===0);
              if (het) setEditGoi(het);
            }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
              style={{ background:"#D4183D", border:"none", color:"#fff", fontSize:"0.75rem", fontWeight:700, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              <Plus size={12}/> Cấp ngay
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
