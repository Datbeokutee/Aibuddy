import { useState } from "react";
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, TrendingUp,
  AlertTriangle, Eye, Send, User, Building2, ChevronRight,
  Activity, BarChart2, Layers, Package, Hash, Calendar,
  Gift, Zap, Info, ArrowRight, RefreshCw, Filter,
  MapPin, Star, Timer, Shield, Bell, TrendingDown,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

const THONG_TIN_CHECKER = {
  hoTen: "Lê Thị Mai Phương",
  donVi: "Viettel Hà Nội",
  maNhanVien: "CK-HN-0018",
  vaiTro: "Checker · Người phê duyệt",
  capNhat: "01/04/2026 · 08:45",
  khuVuc: "Hà Nội & vùng phụ cận",
};

const KPI = {
  choDuyet: 12,
  daDuyetThang: 145,
  tongHanMuc: 5000,
  hanMucConLai: 1200,
  tuChoiThang: 8,
  thoiGianXuLyTB: "3.2 giờ",
};

// Dữ liệu biểu đồ theo tuần (T1–T4 tháng 4/2026)
const TUAN_DATA = [
  { tuan: "Tuần 1 (1–7/4)",   pheDuyet: 42, tuChoi: 3, phanBo: 3800, target: 40 },
  { tuan: "Tuần 2 (8–14/4)",  pheDuyet: 38, tuChoi: 2, phanBo: 2900, target: 40 },
  { tuan: "Tuần 3 (15–21/4)", pheDuyet: 47, tuChoi: 2, phanBo: 4200, target: 40 },
  { tuan: "Tuần 4 (22–30/4)", pheDuyet: 18, tuChoi: 1, phanBo: 1800, target: 40 },
];

// Lệnh chờ duyệt ưu tiên cao
const LENH_CHO_DUYET = [
  {
    id: "1", maLenh: "LG-CG-011", maker: "Nguyễn Văn Minh",
    doiTuong: "Trường THPT Cầu Giấy",    loaiDV: "Trường học",
    diaChi: "Cầu Giấy, Hà Nội", loaiGoi: "PLUS",
    soLuong: 150, ngayGui: "01/04/2026", thoiGianCho: "6 giờ", mucUuTien: "Cao",
  },
  {
    id: "2", maLenh: "LG-HD-023", maker: "Trần Minh Đức",
    doiTuong: "Đại lý Hoàn Kiếm A",      loaiDV: "Đại lý",
    diaChi: "Hoàn Kiếm, Hà Nội", loaiGoi: "BASIC",
    soLuong: 120, ngayGui: "01/04/2026", thoiGianCho: "5 giờ", mucUuTien: "Cao",
  },
  {
    id: "3", maLenh: "LG-DD-007", maker: "Phạm Thị Lan",
    doiTuong: "Trường THCS Đống Đa",     loaiDV: "Trường học",
    diaChi: "Đống Đa, Hà Nội", loaiGoi: "BASIC",
    soLuong: 90,  ngayGui: "31/03/2026", thoiGianCho: "1 ngày", mucUuTien: "Cao",
  },
  {
    id: "4", maLenh: "LG-TH-019", maker: "Nguyễn Văn Minh",
    doiTuong: "Trường Tiểu học Đội Cấn", loaiDV: "Trường học",
    diaChi: "Ba Đình, Hà Nội", loaiGoi: "VIP",
    soLuong: 60,  ngayGui: "31/03/2026", thoiGianCho: "1 ngày", mucUuTien: "Trung bình",
  },
  {
    id: "5", maLenh: "LG-NR-005", maker: "Lê Hoàng Nam",
    doiTuong: "Đại lý Cầu Giấy Premium", loaiDV: "Đại lý",
    diaChi: "Cầu Giấy, Hà Nội", loaiGoi: "PLUS",
    soLuong: 45,  ngayGui: "30/03/2026", thoiGianCho: "2 ngày", mucUuTien: "Trung bình",
  },
];

// Hoạt động gần đây (Checker đã xử lý)
const HOAT_DONG = [
  { id: "1", hanh_dong: "Phê duyệt",  maLenh: "LG-CG-009", doiTuong: "Trường THCS Nghĩa Tân",   soLuong: 100, thoiGian: "01/04 · 09:10", ok: true  },
  { id: "2", hanh_dong: "Từ chối",    maLenh: "LG-CG-008", doiTuong: "Trường Tiểu học Mai Dịch", soLuong: 200, thoiGian: "01/04 · 08:55", ok: false },
  { id: "3", hanh_dong: "Phê duyệt",  maLenh: "LG-HD-021", doiTuong: "Đại lý Hoàn Kiếm B",      soLuong: 80,  thoiGian: "31/03 · 17:30", ok: true  },
  { id: "4", hanh_dong: "Phê duyệt",  maLenh: "LG-DD-005", doiTuong: "Trường THPT Đống Đa",     soLuong: 130, thoiGian: "31/03 · 16:15", ok: true  },
];

const fmtSL = (n: number) => n.toLocaleString("vi-VN");

const LOAI_GOI_CFG: Record<string, { color: string; bg: string; border: string }> = {
  BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.22)"  },
  PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)", border: "rgba(124,58,237,0.22)" },
  VIP:   { color: "#D97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.22)"  },
};

const UU_TIEN_CFG: Record<string, { color: string; bg: string }> = {
  "Cao":        { color: "#D4183D", bg: "rgba(212,24,61,0.09)"  },
  "Trung bình": { color: "#D97706", bg: "rgba(217,119,6,0.09)" },
  "Thấp":       { color: "#0F766E", bg: "rgba(15,118,110,0.09)"},
};

// ── CUSTOM TOOLTIP BIỂU ĐỒ ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl p-4 space-y-2.5"
      style={{ background: "#fff", border: "1.5px solid #EEF0F4", boxShadow: "0 8px 28px rgba(0,0,0,0.13)", fontFamily: "'Be Vietnam Pro',sans-serif", minWidth: 200 }}>
      <div style={{ fontSize: "0.73rem", fontWeight: 800, color: "#005CB6", borderBottom: "1px solid #EEF0F4", paddingBottom: 6, marginBottom: 4 }}>{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color, display: "inline-block" }} />
            <span style={{ fontSize: "0.73rem", color: "#64748B" }}>{entry.name}</span>
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F172A" }}>{fmtSL(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────────────────────

export function CheckerDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"tuoc" | "phanbo">("tuoc");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1400);
  };

  const pctConLai = (KPI.hanMucConLai / KPI.tongHanMuc) * 100;
  const pctDaDung = 100 - pctConLai;
  const trangThaiKho = pctConLai <= 15 ? "Cảnh báo" : pctConLai <= 35 ? "Chú ý" : "An toàn";
  const khoColor = pctConLai <= 15 ? "#D4183D" : pctConLai <= 35 ? "#D97706" : "#0F766E";
  const khoBg   = pctConLai <= 15 ? "rgba(212,24,61,0.08)" : pctConLai <= 35 ? "rgba(217,119,6,0.08)" : "rgba(15,118,110,0.08)";
  const khoGrad  = pctConLai <= 15 ? "linear-gradient(90deg,#D4183D,#EF4444)"
                 : pctConLai <= 35 ? "linear-gradient(90deg,#D97706,#F59E0B)"
                 : "linear-gradient(90deg,#0F766E,#059669)";

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Trang chủ</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#005CB6", fontWeight: 600 }}>Tổng quan Checker</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                  <ShieldCheck size={20} color="#fff" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#D4183D", border: "2px solid #F4F6FA" }}>
                  <span style={{ fontSize: "0.52rem", fontWeight: 900, color: "#fff" }}>{KPI.choDuyet}</span>
                </span>
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Tổng quan phê duyệt</h1>
                <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 3 }}>
                  {THONG_TIN_CHECKER.donVi} · Cập nhật {THONG_TIN_CHECKER.capNhat}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Cảnh báo tồn đọng */}
            {KPI.choDuyet >= 10 && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(212,24,61,0.07)", border: "1.5px solid rgba(212,24,61,0.25)" }}>
                <Bell size={14} color="#D4183D" />
                <span style={{ fontSize: "0.77rem", fontWeight: 700, color: "#D4183D" }}>
                  {KPI.choDuyet} lệnh cần duyệt ngay
                </span>
              </div>
            )}
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Làm mới
            </button>
          </div>
        </div>

        {/* ── CARD THÔNG TIN CHECKER ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(130deg,#003D7A 0%,#005CB6 45%,#0074E4 100%)", boxShadow: "0 6px 28px rgba(0,92,182,0.28)" }}>
          <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                <ShieldCheck size={26} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                  {THONG_TIN_CHECKER.vaiTro}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                  {THONG_TIN_CHECKER.hoTen}
                </div>
                <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
                  {THONG_TIN_CHECKER.donVi} · {THONG_TIN_CHECKER.khuVuc}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              {[
                { label: "Mã nhân viên",     val: THONG_TIN_CHECKER.maNhanVien },
                { label: "Đã duyệt tháng",   val: KPI.daDuyetThang + " lệnh"  },
                { label: "T/g xử lý TB",      val: KPI.thoiGianXuLyTB          },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div style={{ fontSize: "1rem", fontWeight: 900, color: "#fff" }}>{s.val}</div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}

              {/* Badge trạng thái kho */}
              <div className="flex flex-col items-center px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.22)" }}>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>Kho hạn mức</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff" }}>
                  {fmtSL(KPI.hanMucConLai)}
                  <span style={{ fontSize: "0.62rem", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}> / {fmtSL(KPI.tongHanMuc)}</span>
                </div>
                <div className="w-28 rounded-full overflow-hidden mt-2" style={{ height: 5, background: "rgba(255,255,255,0.2)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pctConLai}%`, background: "#fff" }} />
                </div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{pctConLai.toFixed(0)}% còn lại</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 KPI CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Chờ duyệt — trạng thái nóng */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg,#D4183D,#EF4444)" }} />
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,24,61,0.1)" }}>
                <Clock size={20} color="#D4183D" />
              </div>
              <span className="rounded-full px-2.5 py-1"
                style={{ fontSize: "0.6rem", fontWeight: 700, background: "rgba(212,24,61,0.09)", color: "#D4183D" }}>
                Cần xử lý
              </span>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#D4183D", lineHeight: 1 }}>{KPI.choDuyet}</div>
              <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#64748B", marginTop: 4 }}>Yêu cầu chờ duyệt</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(212,24,61,0.06)", border: "1px solid rgba(212,24,61,0.15)" }}>
              <AlertTriangle size={12} color="#D4183D" />
              <span style={{ fontSize: "0.67rem", color: "#D4183D", fontWeight: 600 }}>+5 so với hôm qua</span>
            </div>
          </div>

          {/* Card 2: Đã duyệt trong tháng */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg,#0F766E,#10B981)" }} />
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(15,118,110,0.1)" }}>
                <CheckCircle2 size={20} color="#0F766E" />
              </div>
              <span className="rounded-full px-2.5 py-1"
                style={{ fontSize: "0.6rem", fontWeight: 700, background: "rgba(15,118,110,0.08)", color: "#0F766E" }}>
                Tháng 4/2026
              </span>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#0F766E", lineHeight: 1 }}>{KPI.daDuyetThang}</div>
              <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#64748B", marginTop: 4 }}>Đã phê duyệt trong tháng</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(15,118,110,0.06)", border: "1px solid rgba(15,118,110,0.15)" }}>
              <TrendingUp size={12} color="#0F766E" />
              <span style={{ fontSize: "0.67rem", color: "#0F766E", fontWeight: 600 }}>+18% so với tháng trước</span>
            </div>
          </div>

          {/* Card 3: Tổng hạn mức */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg,#005CB6,#0074E4)" }} />
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(0,92,182,0.1)" }}>
                <Layers size={20} color="#005CB6" />
              </div>
              <span className="rounded-full px-2.5 py-1"
                style={{ fontSize: "0.6rem", fontWeight: 700, background: "rgba(0,92,182,0.07)", color: "#005CB6" }}>
                Cấp năm 2026
              </span>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#005CB6", lineHeight: 1 }}>{fmtSL(KPI.tongHanMuc)}</div>
              <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#64748B", marginTop: 4 }}>Tổng hạn mức đơn vị</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(0,92,182,0.05)", border: "1px solid rgba(0,92,182,0.12)" }}>
              <Shield size={12} color="#005CB6" />
              <span style={{ fontSize: "0.67rem", color: "#005CB6", fontWeight: 600 }}>Viettel Hà Nội · BCCS</span>
            </div>
          </div>

          {/* Card 4: Hạn mức còn lại — màu động */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: khoGrad }} />
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: khoBg }}>
                <Zap size={20} color={khoColor} />
              </div>
              <span className="rounded-full px-2.5 py-1"
                style={{ fontSize: "0.6rem", fontWeight: 700, background: khoBg, color: khoColor }}>
                {trangThaiKho}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: khoColor, lineHeight: 1 }}>{fmtSL(KPI.hanMucConLai)}</div>
              <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#64748B", marginTop: 4 }}>Hạn mức khả dụng còn lại</div>
            </div>
            {/* Mini bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>Đã phân bổ: {pctDaDung.toFixed(0)}%</span>
                <span style={{ fontSize: "0.65rem", color: khoColor, fontWeight: 700 }}>Còn {pctConLai.toFixed(0)}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: "#EEF0F4" }}>
                <div className="h-full rounded-full" style={{ width: `${pctConLai}%`, background: khoGrad }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW: BIỂU ĐỒ + HOẠT ĐỘNG ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Biểu đồ tốc độ phê duyệt (2/3) */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #EEF0F4" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(0,92,182,0.08)" }}>
                  <BarChart2 size={17} color="#005CB6" />
                </div>
                <div>
                  <h2 style={{ fontSize: "0.94rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Tốc độ phê duyệt theo tuần</h2>
                  <p style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 3 }}>Tháng 4/2026 · Viettel Hà Nội</p>
                </div>
              </div>
              {/* Tab chuyển biểu đồ */}
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F8F9FA", border: "1px solid #EEF0F4" }}>
                {[
                  { key: "tuoc", label: "Phê duyệt" },
                  { key: "phanbo", label: "Phân bổ" },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className="px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: activeTab === tab.key ? "#005CB6" : "transparent",
                      color: activeTab === tab.key ? "#fff" : "#64748B",
                      border: "none", cursor: "pointer",
                      fontSize: "0.72rem", fontWeight: 700,
                      fontFamily: "'Be Vietnam Pro'",
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <ResponsiveContainer width="100%" height={240}>
                {activeTab === "tuoc" ? (
                  <LineChart data={TUAN_DATA} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="tuan" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Be Vietnam Pro'" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Be Vietnam Pro'" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8}
                      formatter={(v) => <span style={{ fontSize: "0.73rem", color: "#64748B", fontFamily: "'Be Vietnam Pro'" }}>{v}</span>} />
                    <ReferenceLine y={40} stroke="#D97706" strokeDasharray="5 3" strokeWidth={1.5}
                      label={{ value: "Mục tiêu", position: "insideTopRight", fontSize: 10, fill: "#D97706" }} />
                    <Line type="monotone" dataKey="pheDuyet" name="Đã phê duyệt"
                      stroke="#005CB6" strokeWidth={2.5} dot={{ r: 5, fill: "#005CB6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="tuChoi" name="Từ chối"
                      stroke="#D4183D" strokeWidth={2.5} dot={{ r: 5, fill: "#D4183D", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={TUAN_DATA} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradPB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005CB6" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#005CB6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="tuan" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Be Vietnam Pro'" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "'Be Vietnam Pro'" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="phanBo" name="License phân bổ"
                      stroke="#005CB6" strokeWidth={2.5} fill="url(#gradPB)"
                      dot={{ r: 5, fill: "#005CB6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Tổng kết biểu đồ */}
            <div className="grid grid-cols-3 gap-0" style={{ borderTop: "1px solid #EEF0F4" }}>
              {[
                { label: "Tổng phê duyệt", val: TUAN_DATA.reduce((s, d) => s + d.pheDuyet, 0), color: "#005CB6", icon: CheckCircle2 },
                { label: "Tổng từ chối",   val: TUAN_DATA.reduce((s, d) => s + d.tuChoi,   0), color: "#D4183D", icon: XCircle     },
                { label: "License phân bổ",val: fmtSL(TUAN_DATA.reduce((s, d) => s + d.phanBo, 0)), color: "#0F766E", icon: TrendingUp },
              ].map((s, i) => {
                const SIc = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center py-3.5 gap-1"
                    style={{ borderRight: i < 2 ? "1px solid #EEF0F4" : "none" }}>
                    <SIc size={14} color={s.color} />
                    <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0F172A" }}>{s.val}</div>
                    <div style={{ fontSize: "0.62rem", color: "#94A3B8" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hoạt động gần đây (1/3) */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #EEF0F4" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,92,182,0.08)" }}>
                <Activity size={16} color="#005CB6" />
              </div>
              <div className="flex-1">
                <h2 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Hoạt động gần đây</h2>
                <p style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 3 }}>Các lệnh Checker vừa xử lý</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {HOAT_DONG.map(hd => (
                <div key={hd.id} className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: hd.ok ? "rgba(15,118,110,0.1)" : "rgba(212,24,61,0.1)" }}>
                    {hd.ok ? <CheckCircle2 size={15} color="#0F766E" /> : <XCircle size={15} color="#D4183D" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <code style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6" }}>{hd.maLenh}</code>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, color: hd.ok ? "#0F766E" : "#D4183D" }}>{hd.hanh_dong}</span>
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "#334155", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {hd.doiTuong}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span style={{ fontSize: "0.65rem", color: "#64748B" }}>{fmtSL(hd.soLuong)} license</span>
                      <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>{hd.thoiGian}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl"
                style={{ background: "rgba(0,92,182,0.06)", border: "1.5px solid rgba(0,92,182,0.18)", color: "#005CB6", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                Xem toàn bộ lịch sử <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── DANH SÁCH ƯU TIÊN ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,24,61,0.1)" }}>
                <Star size={16} color="#D4183D" />
              </div>
              <div>
                <h2 style={{ fontSize: "0.94rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                  Lệnh gán ưu tiên cao — cần duyệt ngay
                </h2>
                <p style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 3 }}>Sắp xếp theo số lượng & thời gian chờ dài nhất</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(212,24,61,0.08)", border: "1px solid rgba(212,24,61,0.2)" }}>
                <Clock size={11} color="#D4183D" />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#D4183D" }}>{KPI.choDuyet} đang chờ</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {["#", "Mã lệnh gán", "Đối tượng nhận", "Gói cước", "Số lượng", "Maker", "Ngày gửi", "Thời gian chờ", "Ưu tiên", "Thao tác"].map((col, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.6rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LENH_CHO_DUYET.map((lenh, idx) => {
                  const goi = LOAI_GOI_CFG[lenh.loaiGoi] ?? LOAI_GOI_CFG.BASIC;
                  const ut  = UU_TIEN_CFG[lenh.mucUuTien] ?? UU_TIEN_CFG["Trung bình"];
                  const isLast = idx === LENH_CHO_DUYET.length - 1;
                  const isCao  = lenh.mucUuTien === "Cao";
                  return (
                    <tr key={lenh.id}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${isCao ? "#D4183D" : "#D97706"}`,
                        background: isCao ? "rgba(212,24,61,0.015)" : "transparent",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = isCao ? "rgba(212,24,61,0.015)" : "transparent")}>

                      {/* # */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: isCao ? "rgba(212,24,61,0.1)" : "rgba(217,119,6,0.08)" }}>
                          <span style={{ fontSize: "0.62rem", fontWeight: 900, color: isCao ? "#D4183D" : "#D97706" }}>{idx + 1}</span>
                        </div>
                      </td>

                      {/* Mã lệnh */}
                      <td style={{ padding: "13px 14px" }}>
                        <code style={{ fontSize: "0.77rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 8px", borderRadius: 6 }}>
                          {lenh.maLenh}
                        </code>
                      </td>

                      {/* Đối tượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: lenh.loaiDV === "Trường học" ? "rgba(0,92,182,0.08)" : "rgba(124,58,237,0.08)" }}>
                            {lenh.loaiDV === "Trường học"
                              ? <Building2 size={11} color="#005CB6" />
                              : <User size={11} color="#7C3AED" />}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1E293B" }}>{lenh.doiTuong}</div>
                            <div className="flex items-center gap-1">
                              <MapPin size={9} color="#CBD5E1" />
                              <span style={{ fontSize: "0.63rem", color: "#94A3B8" }}>{lenh.diaChi}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gói */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1 w-fit rounded-full px-2.5 py-1"
                          style={{ fontSize: "0.68rem", fontWeight: 800, color: goi.color, background: goi.bg, border: `1px solid ${goi.border}` }}>
                          <Gift size={9} /> {lenh.loaiGoi}
                        </span>
                      </td>

                      {/* Số lượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 900, color: "#0F172A" }}>{fmtSL(lenh.soLuong)}</span>
                        <span style={{ fontSize: "0.6rem", color: "#94A3B8", marginLeft: 2 }}>lic</span>
                      </td>

                      {/* Maker */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(0,92,182,0.1)" }}>
                            <User size={11} color="#005CB6" />
                          </div>
                          <span style={{ fontSize: "0.77rem", color: "#334155" }}>{lenh.maker}</span>
                        </div>
                      </td>

                      {/* Ngày gửi */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.77rem", color: "#64748B" }}>{lenh.ngayGui}</span>
                        </div>
                      </td>

                      {/* Thời gian chờ */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Timer size={12} color={isCao ? "#D4183D" : "#D97706"} />
                          <span style={{ fontSize: "0.77rem", fontWeight: 700, color: isCao ? "#D4183D" : "#D97706" }}>
                            {lenh.thoiGianCho}
                          </span>
                        </div>
                      </td>

                      {/* Ưu tiên */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1 w-fit rounded-full px-2.5 py-1"
                          style={{ fontSize: "0.64rem", fontWeight: 800, color: ut.color, background: ut.bg }}>
                          <Star size={8} fill={ut.color} /> {lenh.mucUuTien}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td style={{ padding: "13px 10px" }}>
                        <div className="flex items-center gap-1.5">
                          <button
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl"
                            style={{ background: "rgba(0,92,182,0.07)", border: "1.5px solid rgba(0,92,182,0.2)", color: "#005CB6", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,92,182,0.13)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,92,182,0.07)")}>
                            <Eye size={11} /> Xem
                          </button>
                          <button
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl"
                            style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,92,182,0.3)" }}>
                            <ShieldCheck size={11} /> Duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 flex-wrap gap-3"
            style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
            <div className="flex items-center gap-2">
              <Info size={13} color="#94A3B8" />
              <span style={{ fontSize: "0.71rem", color: "#94A3B8" }}>
                Hiển thị top <strong style={{ color: "#0F172A" }}>5</strong> lệnh ưu tiên cao nhất. Tổng chờ duyệt: <strong style={{ color: "#D4183D" }}>{KPI.choDuyet}</strong>
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.81rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 3px 12px rgba(0,92,182,0.3)" }}>
              Vào Duyệt chia sẻ <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ── HÀNG DƯỚI: 3 MINI CARDS THỐNG KÊ ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Tỷ lệ phê duyệt */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} color="#0F766E" />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F172A" }}>Tỷ lệ phê duyệt</span>
            </div>
            {[
              { label: "Phê duyệt",     val: 145, pct: 94, color: "#0F766E", bg: "rgba(15,118,110,0.12)" },
              { label: "Từ chối",       val: 8,   pct: 5,  color: "#D4183D", bg: "rgba(212,24,61,0.1)"  },
              { label: "Chờ xử lý",    val: 12,  pct: 1,  color: "#D97706", bg: "rgba(217,119,6,0.1)"  },
            ].map(s => (
              <div key={s.label} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "0.73rem", color: "#64748B" }}>{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F172A" }}>{s.val}</span>
                    <span style={{ fontSize: "0.65rem", color: s.color, fontWeight: 700 }}>({s.pct}%)</span>
                  </div>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 7, background: "#EEF0F4" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.bg.replace("0.1)", "1)").replace("0.12)", "1)") }} />
                </div>
              </div>
            ))}
          </div>

          {/* Phân bổ theo gói */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
            <div className="flex items-center gap-2 mb-4">
              <Package size={15} color="#005CB6" />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F172A" }}>Phân bổ theo loại gói</span>
            </div>
            {[
              { label: "BASIC", val: 2200, pct: 57, color: "#0284C7" },
              { label: "PLUS",  val: 1400, pct: 36, color: "#7C3AED" },
              { label: "VIP",   val: 200,  pct: 7,  color: "#D97706" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 mb-3">
                <span className="rounded-full px-2 py-0.5 flex-shrink-0"
                  style={{ fontSize: "0.64rem", fontWeight: 800, background: `${s.color}14`, color: s.color, minWidth: 44, textAlign: "center" }}>
                  {s.label}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{fmtSL(s.val)} license</span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.color }}>{s.pct}%</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: "#EEF0F4" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #EEF0F4" }}>
              <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Tổng đã phân bổ</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "#005CB6" }}>{fmtSL(3800)} license</span>
            </div>
          </div>

          {/* Checker nhanh + SLA */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
            <div className="flex items-center gap-2 mb-4">
              <Timer size={15} color="#7C3AED" />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0F172A" }}>Hiệu suất xử lý</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "T/g xử lý trung bình",   val: "3.2 giờ",   icon: Clock,        color: "#005CB6" },
                { label: "Lệnh xử lý nhanh nhất",  val: "12 phút",   icon: Zap,          color: "#0F766E" },
                { label: "Tỷ lệ đúng SLA (24h)",   val: "96.4%",     icon: ShieldCheck,  color: "#7C3AED" },
                { label: "Lệnh tồn đọng >24h",     val: "2 lệnh",    icon: AlertTriangle,color: "#D4183D" },
              ].map(s => {
                const SIc = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                    <div className="flex items-center gap-2">
                      <SIc size={13} color={s.color} />
                      <span style={{ fontSize: "0.73rem", color: "#64748B" }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#0F172A" }}>{s.val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
