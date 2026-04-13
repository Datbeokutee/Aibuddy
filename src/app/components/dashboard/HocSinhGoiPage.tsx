import { useState, useEffect } from "react";
import {
  Search, Home, ChevronRight, ChevronDown, Check,
  BookOpen, Clock, GraduationCap, ShoppingCart, X, AlertCircle,
  ArrowLeft, Shield, CheckCircle2, Loader2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// DỮ LIỆU MẪU
// ═══════════════════════════════════════════════════════════════════════════════

const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=220&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=220&fit=crop&auto=format",
];

interface GoiCuoc {
  id: string;
  ten: string;
  tenLoai: string;            // Tên loại gói: BASIC, PLUS, PREMIUM, etc.
  gia: number;
  moTa?: string;
  thoiGian: string;           // Thời gian dùng: từ - đến (VD: "01/09/2025 — 31/08/2026")
  thoiGianDungThu?: string;   // Thời gian dùng thử (VD: "01/09/2025 — 07/09/2025")
}

interface GoiChuongTrinh {
  id: string;
  ten: string;
  moTa: string;
  khoiLop: string[];
  monHoc: string[];
  maxMon: number;
  thoiGian: string;
  daMua: boolean;
  img: string;
  goiCuoc: GoiCuoc[]; // Danh sách gói cước
}

const DANH_SACH_GOI: GoiChuongTrinh[] = [
  {
    id: "g01", ten: "Gói Toán Tiểu học BASIC",
    moTa: "Các khóa học chất lượng về môn Toán dành cho học sinh Tiểu học.",
    khoiLop: ["Khối 1","Khối 2","Khối 3"],
    monHoc: ["Toán","Tiếng Việt","Tự nhiên xã hội","Đạo đức","Kỹ năng sống"],
    maxMon: 2, thoiGian: "08:40, 17/02/2026 – 08:40, 20/03/2026",
    daMua: true, img: PLACEHOLDER_IMGS[0],
    goiCuoc: [
      { id: "gc01-1", ten: "1 tháng", tenLoai: "BASIC", gia: 200000, thoiGian: "17/02/2026 — 20/03/2026", thoiGianDungThu: "15/03/2026 — 17/03/2026" },
      { id: "gc01-3", ten: "3 tháng", tenLoai: "PREMIUM", gia: 450000, thoiGian: "17/02/2026 — 20/05/2026" },
    ],
  },
  {
    id: "g02", ten: "Gói Tiếng Anh Giao tiếp",
    moTa: "Luyện kỹ năng nghe, nói Tiếng Anh cùng giáo viên bản ngữ.",
    khoiLop: ["Khối 4","Khối 5","Khối 6"],
    monHoc: ["Tiếng Anh","Tiếng Việt","Toán","Tin học"],
    maxMon: 2, thoiGian: "08:40, 01/02/2026 – 08:40, 30/04/2026",
    daMua: false, img: PLACEHOLDER_IMGS[1],
    goiCuoc: [
      { id: "gc02-1", ten: "1 tháng", tenLoai: "BASIC", gia: 500000, thoiGian: "01/02/2026 — 29/02/2026" },
      { id: "gc02-3", ten: "3 tháng", tenLoai: "PLUS", gia: 1200000, thoiGian: "01/02/2026 — 30/04/2026", thoiGianDungThu: "01/02/2026 — 15/02/2026" },
      { id: "gc02-6", ten: "6 tháng", tenLoai: "PREMIUM", gia: 2200000, thoiGian: "01/02/2026 — 31/07/2026" },
    ],
  },
  {
    id: "g03", ten: "Gói Toán & Văn THCS",
    moTa: "Hệ thống bài giảng Toán và Ngữ Văn theo chuẩn CTGDPT mới.",
    khoiLop: ["Khối 6","Khối 7","Khối 8","Khối 9"],
    monHoc: ["Toán","Ngữ văn","Tiếng Anh","Lịch sử","Địa lý"],
    maxMon: 3, thoiGian: "08:40, 01/03/2026 – 08:40, 31/08/2026",
    daMua: false, img: PLACEHOLDER_IMGS[2],
    goiCuoc: [
      { id: "gc03-1", ten: "1 tháng", tenLoai: "BASIC", gia: 350000, thoiGian: "01/03/2026 — 31/03/2026", thoiGianDungThu: "01/03/2026 — 10/03/2026" },
      { id: "gc03-6", ten: "6 tháng", tenLoai: "PREMIUM", gia: 1800000, thoiGian: "01/03/2026 — 31/08/2026" },
    ],
  },
  {
    id: "g04", ten: "Gói Luyện thi vào 10",
    moTa: "Luyện đề thi vào lớp 10 chuyên sâu Toán, Văn, Anh.",
    khoiLop: ["Khối 9"],
    monHoc: ["Toán","Ngữ văn","Tiếng Anh","Vật lí","Hóa học","Sinh học"],
    maxMon: 3, thoiGian: "08:40, 01/03/2026 – 08:40, 30/05/2026",
    daMua: false, img: PLACEHOLDER_IMGS[3],
    goiCuoc: [
      { id: "gc04-1", ten: "1 tháng", tenLoai: "BASIC", gia: 800000, thoiGian: "01/03/2026 — 31/03/2026" },
      { id: "gc04-3", ten: "3 tháng", tenLoai: "PREMIUM", gia: 2100000, thoiGian: "01/03/2026 — 30/05/2026", thoiGianDungThu: "01/03/2026 — 15/03/2026" },
    ],
  },
  {
    id: "g05", ten: "Gói Khoa học Tự nhiên THCS",
    moTa: "Vật lí, Hóa học, Sinh học được thiết kế theo chủ đề tích hợp.",
    khoiLop: ["Khối 6","Khối 7","Khối 8","Khối 9"],
    monHoc: ["Vật lí","Hóa học","Sinh học","Toán","Địa lý"],
    maxMon: 3, thoiGian: "08:40, 01/02/2026 – 08:40, 30/04/2026",
    daMua: true, img: PLACEHOLDER_IMGS[4],
    goiCuoc: [
      { id: "gc05-1", ten: "1 tháng", tenLoai: "BASIC", gia: 450000, thoiGian: "01/02/2026 — 29/02/2026" },
      { id: "gc05-3", ten: "3 tháng", tenLoai: "PLUS", gia: 1100000, thoiGian: "01/02/2026 — 30/04/2026", thoiGianDungThu: "01/02/2026 — 08/02/2026" },
    ],
  },
  {
    id: "g06", ten: "Gói Hè Miễn Phí Tiểu học",
    moTa: "Chương trình ôn hè miễn phí dành cho học sinh Tiểu học.",
    khoiLop: ["Khối 1","Khối 2","Khối 3","Khối 4","Khối 5"],
    monHoc: ["Toán","Tiếng Việt","Tiếng Anh","Tự nhiên xã hội","Đạo đức","Âm nhạc","Mỹ thuật","Thể dục","Thủ công","Kỹ năng sống"],
    maxMon: 5, thoiGian: "08:40, 01/06/2026 – 08:40, 31/08/2026",
    daMua: false, img: PLACEHOLDER_IMGS[0],
    goiCuoc: [
      { id: "gc06-1", ten: "Miễn phí", tenLoai: "FREE", gia: 0, thoiGian: "01/06/2026 — 31/08/2026", thoiGianDungThu: "01/06/2026 — 15/06/2026" },
      { id: "gc06-3", ten: "Premium", tenLoai: "PLUS", gia: 300000, thoiGian: "01/06/2026 — 31/08/2026" },
    ],
  },
  {
    id: "g07", ten: "Gói THPT Toàn diện",
    moTa: "Đầy đủ 9 môn học theo chương trình THPT, hỗ trợ luyện đề THPTQG.",
    khoiLop: ["Khối 10","Khối 11","Khối 12"],
    monHoc: ["Toán","Vật lí","Hóa học","Sinh học","Lịch sử","Địa lý","Tiếng Anh","Ngữ văn","Tin học"],
    maxMon: 5, thoiGian: "08:40, 01/03/2026 – 08:40, 31/08/2026",
    daMua: false, img: PLACEHOLDER_IMGS[1],
    goiCuoc: [
      { id: "gc07-3", ten: "3 tháng", tenLoai: "PLUS", gia: 1000000, thoiGian: "01/03/2026 — 31/05/2026", thoiGianDungThu: "01/03/2026 — 20/03/2026" },
      { id: "gc07-6", ten: "6 tháng", tenLoai: "PREMIUM", gia: 1800000, thoiGian: "01/03/2026 — 31/08/2026" },
    ],
  },
  {
    id: "g08", ten: "Gói Cấp tốc Luyện thi THPTQG",
    moTa: "Luyện thi THPTQG cấp tốc dành cho học sinh lớp 12.",
    khoiLop: ["Khối 12"],
    monHoc: ["Toán","Tiếng Anh","Vật lí","Hóa học","Sinh học","Ngữ văn"],
    maxMon: 4, thoiGian: "08:40, 01/04/2026 – 08:40, 30/06/2026",
    daMua: false, img: PLACEHOLDER_IMGS[2],
    goiCuoc: [
      { id: "gc08-1", ten: "1 tháng", tenLoai: "BASIC", gia: 1200000, thoiGian: "01/04/2026 — 30/04/2026" },
      { id: "gc08-3", ten: "3 tháng", tenLoai: "PREMIUM", gia: 3000000, thoiGian: "01/04/2026 — 30/06/2026", thoiGianDungThu: "01/04/2026 — 15/04/2026" },
    ],
  },
  {
    id: "g09", ten: "Gói VIP 1 kèm 1 Tiếng Anh",
    moTa: "Học Tiếng Anh với gia sư 1:1 cùng giáo viên bản ngữ, lịch học linh hoạt.",
    khoiLop: ["Khối 1","Khối 2","Khối 3","Khối 4","Khối 5","Khối 6","Khối 7","Khối 8","Khối 9","Khối 10","Khối 11","Khối 12"],
    monHoc: ["Tiếng Anh"],
    maxMon: 1, thoiGian: "08:40, 17/02/2026 – 08:40, 20/03/2026",
    daMua: false, img: PLACEHOLDER_IMGS[3],
    goiCuoc: [
      { id: "gc09-1", ten: "VIP BASIC", tenLoai: "VIP BASIC", gia: 2000000, thoiGian: "17/02/2026 — 20/03/2026" },
      { id: "gc09-3", ten: "VIP PREMIUM", tenLoai: "VIP PREMIUM", gia: 5500000, thoiGian: "17/02/2026 — 20/05/2026", thoiGianDungThu: "15/03/2026 — 17/03/2026" },
    ],
  },
  {
    id: "g10", ten: "Gói Kỹ năng sống & STEM",
    moTa: "Phát triển tư duy sáng tạo, kỹ năng mềm và lập trình cơ bản.",
    khoiLop: ["Khối 3","Khối 4","Khối 5","Khối 6"],
    monHoc: ["Kỹ năng sống","Tin học","Mỹ thuật","Âm nhạc","Thủ công"],
    maxMon: 3, thoiGian: "08:40, 01/02/2026 – 08:40, 30/04/2026",
    daMua: true, img: PLACEHOLDER_IMGS[4],
    goiCuoc: [
      { id: "gc10-1", ten: "BASIC", tenLoai: "BASIC", gia: 300000, thoiGian: "01/02/2026 — 29/02/2026", thoiGianDungThu: "01/02/2026 — 07/02/2026" },
      { id: "gc10-3", ten: "PLUS", tenLoai: "PLUS", gia: 750000, thoiGian: "01/02/2026 — 30/04/2026" },
    ],
  },
];

const DS_KHOI = ["Khối 1","Khối 2","Khối 3","Khối 4","Khối 5","Khối 6","Khối 7","Khối 8","Khối 9","Khối 10","Khối 11","Khối 12"];
const DS_MON  = ["Toán","Tiếng Việt","Tiếng Anh","Ngữ văn","Vật lí","Hóa học","Sinh học","Lịch sử","Địa lý","Tin học","Kỹ năng sống"];

const formatGia = (gia: number) =>
  gia === 0 ? "Miễn phí" : `${gia.toLocaleString("vi-VN")}đ`;

const formatGiaRange = (goiCuoc: GoiCuoc[]) => {
  if (goiCuoc.length === 0) return "0đ";
  const gias = goiCuoc.map(g => g.gia).sort((a, b) => a - b);
  const min = gias[0];
  const max = gias[gias.length - 1];
  if (min === max) return formatGia(min);
  if (min === 0 && max === 0) return "Miễn phí";
  if (min === 0) return `Miễn phí - ${formatGia(max)}`;
  return `${formatGia(min)} - ${formatGia(max)}`;
};

type PopupStep = "chon-goi-cuoc" | "chon-mon" | "xac-nhan" | "thanh-toan" | null;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CHÍNH
// ═══════════════════════════════════════════════════════════════════════════════

export default function HocSinhGoiPage() {
  const [filterKhoi, setFilterKhoi] = useState("");
  const [filterMon,  setFilterMon]  = useState("");
  const [filterTen,  setFilterTen]  = useState("");
  const [danhSach, setDanhSach]     = useState<GoiChuongTrinh[]>(DANH_SACH_GOI);
  const [toastMsg, setToastMsg]     = useState<string | null>(null);

  // Luồng mua nhiều bước
  const [popupStep, setPopupStep]   = useState<PopupStep>(null);
  const [popupGoi, setPopupGoi]     = useState<GoiChuongTrinh | null>(null);
  const [chonGoiCuoc, setChonGoiCuoc] = useState<string[]>([]); // ID của các gói cước đã chọn
  const [chonMon,  setChonMon]      = useState<string[]>([]);

  const dsHienThi = danhSach.filter((g) => {
    const matchKhoi = !filterKhoi || g.khoiLop.includes(filterKhoi);
    const matchMon  = !filterMon  || g.monHoc.includes(filterMon);
    const matchTen  = !filterTen  || g.ten.toLowerCase().includes(filterTen.toLowerCase());
    return matchKhoi && matchMon && matchTen;
  });

  const openMua = (goi: GoiChuongTrinh) => {
    setPopupGoi(goi);
    setChonGoiCuoc([]);
    setChonMon([]);
    setPopupStep("chon-goi-cuoc");
  };

  const closeAll = () => {
    setPopupStep(null);
    setPopupGoi(null);
    setChonGoiCuoc([]);
    setChonMon([]);
  };

  const handleMuaThanhCong = () => {
    if (!popupGoi) return;
    const ten = popupGoi.ten;
    setDanhSach((prev) => prev.map((g) => g.id === popupGoi.id ? { ...g, daMua: true } : g));
    closeAll();
    setToastMsg(`Thanh toán thành công! Bạn đã mở khoá gói "${ten}".`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f5f7fa", fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 20px", borderRadius: 12,
          background: "#ecfdf5", border: "1px solid #6ee7b7",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          fontSize: 14, fontWeight: 600, color: "#065f46", maxWidth: 380,
        }}>
          <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
          {toastMsg}
        </div>
      )}

      {/* ── Popup Bước 1: Chọn gói cước ── */}
      {popupStep === "chon-goi-cuoc" && popupGoi && (
        <ChonGoiCuocPopup
          goi={popupGoi}
          initialChon={chonGoiCuoc}
          onConfirm={(selected) => { setChonGoiCuoc(selected); setPopupStep("chon-mon"); }}
          onClose={closeAll}
        />
      )}

      {/* ── Popup Bước 2: Chọn môn học ── */}
      {popupStep === "chon-mon" && popupGoi && (
        <ChonMonHocPopup
          goi={popupGoi}
          initialChon={chonMon}
          onConfirm={(selected) => { setChonMon(selected); setPopupStep("xac-nhan"); }}
          onQuayLai={() => setPopupStep("chon-goi-cuoc")}
          onClose={closeAll}
        />
      )}

      {/* ── Popup Bước 3: Xác nhận & Thanh toán ── */}
      {popupStep === "xac-nhan" && popupGoi && (
        <XacNhanThanhToanPopup
          goi={popupGoi}
          goiCuocDaChon={chonGoiCuoc}
          monDaChon={chonMon}
          onQuayLai={() => setPopupStep("chon-mon")}
          onXacNhan={() => setPopupStep("thanh-toan")}
          onClose={closeAll}
        />
      )}

      {/* ── Popup Bước 4: Cổng thanh toán ── */}
      {popupStep === "thanh-toan" && popupGoi && (
        <CongThanhToanPopup
          goi={popupGoi}
          goiCuocDaChon={chonGoiCuoc}
          monDaChon={chonMon}
          onQuayLai={() => setPopupStep("xac-nhan")}
          onThanhCong={handleMuaThanhCong}
          onClose={closeAll}
        />
      )}

      <div style={{ padding: "20px 28px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 13, color: "#6b7280" }}>
          <Home size={13} /><span style={{ cursor: "pointer" }}>Trang chủ</span>
          <ChevronRight size={13} /><span style={{ cursor: "pointer" }}>Chương trình học</span>
          <ChevronRight size={13} /><span style={{ cursor: "pointer" }}>Gói chương trình học</span>
          <ChevronRight size={13} /><span style={{ color: "#1a1a2e", fontWeight: 600 }}>Danh sách gói</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 20px" }}>Danh sách gói</h1>

        {/* Bộ lọc */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <SelFilter value={filterKhoi} onChange={setFilterKhoi} options={DS_KHOI} placeholder="--Chọn khối lớp--" />
          <SelFilter value={filterMon}  onChange={setFilterMon}  options={DS_MON}  placeholder="--Chọn môn học/HĐGD--" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", minWidth: 260 }}>
            <input
              value={filterTen}
              onChange={(e) => setFilterTen(e.target.value)}
              placeholder="Tên gói chương trình học"
              style={{ border: "none", outline: "none", fontSize: 13, flex: 1, background: "transparent", fontFamily: "'Be Vietnam Pro', sans-serif" }}
            />
            {filterTen
              ? <X size={14} color="#9ca3af" style={{ cursor: "pointer" }} onClick={() => setFilterTen("")} />
              : <Search size={14} color="#9ca3af" />}
          </div>
        </div>

        {/* Grid cards */}
        {dsHienThi.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#9ca3af", fontSize: 15 }}>
            Không tìm thấy gói nào phù hợp.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {dsHienThi.map((goi) => (
              <GoiCard key={goi.id} goi={goi} onMuaNgay={() => openMua(goi)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP BƯỚC 1 — CHỌN GÓI CƯỚC
// ═══════════════════════════════════════════════════════════════════════════════

function ChonGoiCuocPopup({
  goi, initialChon, onConfirm, onClose,
}: {
  goi: GoiChuongTrinh;
  initialChon: string[];
  onConfirm: (selected: string[]) => void;
  onClose: () => void;
}) {
  const [chon, setChon] = useState<string[]>(initialChon);
  const { goiCuoc, ten } = goi;
  const soChon = chon.length;
  const coTheXacNhan = soChon >= 1;

  const toggle = (goiId: string) => {
    if (chon.includes(goiId)) {
      setChon(chon.filter((g) => g !== goiId));
    } else {
      setChon([...chon, goiId]);
    }
  };

  // Tính tổng tiền từ các gói đã chọn
  const tongTien = chon.reduce((sum, goiId) => {
    const g = goiCuoc.find(gc => gc.id === goiId);
    return sum + (g?.gia || 0);
  }, 0);

  return (
    <Backdrop onClose={onClose}>
      <PopupShell maxWidth={520}>
        {/* Header */}
        <PopupHeader
          badge="Bước 1 / 4 — Lựa chọn gói cước"
          title={ten}
          onClose={onClose}
          stepDots={1}
          totalSteps={4}
        />

        {/* Info banner */}
        <div style={{ margin: "16px 24px 0", padding: "12px 16px", borderRadius: 10,
          background: "#eff6ff", border: "1px solid #bfdbfe",
          display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={16} color="#2563eb" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#1e40af", fontWeight: 500 }}>
            Chọn một hoặc nhiều gói cước để bắt đầu.
          </span>
        </div>

        {/* Sub-header: counter */}
        <div style={{ padding: "12px 24px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Danh sách gói cước ({goiCuoc.length} gói)</span>
        </div>

        {/* Danh sách gói cước */}
        <div style={{ overflowY: "auto", padding: "4px 24px 20px", flex: 1 }}>
          {goiCuoc.map((g) => {
            const isChon = chon.includes(g.id);
            return (
              <GoiCuocCheckRow
                key={g.id}
                id={g.id}
                label={g.tenLoai}
                gia={g.gia}
                checked={isChon}
                onClick={() => toggle(g.id)}
                thoiGian={g.thoiGian}
                thoiGianDungThu={g.thoiGianDungThu}
              />
            );
          })}
        </div>

        {/* Tổng tiền */}
        {soChon > 0 && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Tổng tiền ({soChon} gói)</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#005CB6" }}>{formatGia(tongTien)}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <PopupFooter>
          <BtnOutline onClick={onClose}>Hủy</BtnOutline>
          <BtnPrimary disabled={!coTheXacNhan} onClick={() => coTheXacNhan && onConfirm(chon)}>
            <Check size={15} />
            Tiếp theo ({soChon}/{goiCuoc.length})
          </BtnPrimary>
        </PopupFooter>
      </PopupShell>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP BƯỚC 2 — CHỌN MÔN HỌC
// ═══════════════════════════════════════════════════════════════════════════════

function ChonMonHocPopup({
  goi, initialChon, onConfirm, onQuayLai, onClose,
}: {
  goi: GoiChuongTrinh;
  initialChon: string[];
  onConfirm: (selected: string[]) => void;
  onQuayLai?: () => void;
  onClose: () => void;
}) {
  const [chon, setChon] = useState<string[]>(initialChon);
  const { monHoc, maxMon, ten } = goi;
  const soChon = chon.length;
  const datGioiHan = soChon >= maxMon;
  const coTheXacNhan = soChon >= 1 && soChon <= maxMon;

  const toggle = (mon: string) => {
    if (chon.includes(mon)) setChon(chon.filter((m) => m !== mon));
    else if (!datGioiHan) setChon([...chon, mon]);
  };

  return (
    <Backdrop onClose={onClose}>
      <PopupShell maxWidth={520}>
        {/* Header */}
        <PopupHeader
          badge="Bước 2 / 4 — Lựa chọn nội dung học"
          title={ten}
          onClose={onClose}
          stepDots={2}
          totalSteps={4}
        />

        {/* Quota banner */}
        <div style={{ margin: "16px 24px 0", padding: "12px 16px", borderRadius: 10,
          background: datGioiHan ? "#fef3c7" : "#eff6ff",
          border: `1px solid ${datGioiHan ? "#fcd34d" : "#bfdbfe"}`,
          display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={16} color={datGioiHan ? "#d97706" : "#2563eb"} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: datGioiHan ? "#92400e" : "#1e40af", fontWeight: 500 }}>
            {datGioiHan
              ? `Bạn đã chọn đủ ${maxMon} môn học — giới hạn gói.`
              : `Bạn được chọn tối đa ${maxMon} môn học trong gói này.`}
          </span>
        </div>

        {/* Sub-header: counter */}
        <div style={{ padding: "12px 24px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Danh sách môn học ({monHoc.length} môn)</span>
          <CounterBadge current={soChon} max={maxMon} />
        </div>

        {/* Danh sách checkbox */}
        <div style={{ overflowY: "auto", padding: "4px 24px 20px", flex: 1 }}>
          {monHoc.map((mon) => {
            const isChon = chon.includes(mon);
            const isDisabled = !isChon && datGioiHan;
            return (
              <MonCheckRow
                key={mon} label={mon}
                checked={isChon} disabled={isDisabled}
                onClick={() => toggle(mon)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <PopupFooter>
          {onQuayLai ? (
            <>
              <BtnOutline onClick={onQuayLai}>
                <ArrowLeft size={15} />
                Quay lại
              </BtnOutline>
              <BtnPrimary disabled={!coTheXacNhan} onClick={() => coTheXacNhan && onConfirm(chon)}>
                <Check size={15} />
                Tiếp theo ({soChon}/{maxMon})
              </BtnPrimary>
            </>
          ) : (
            <>
              <BtnOutline onClick={onClose}>Hủy</BtnOutline>
              <BtnPrimary disabled={!coTheXacNhan} onClick={() => coTheXacNhan && onConfirm(chon)}>
                <Check size={15} />
                Tiếp theo ({soChon}/{maxMon})
              </BtnPrimary>
            </>
          )}
        </PopupFooter>
      </PopupShell>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP BƯỚC 3 — XÁC NHẬN & THANH TOÁN
// ═══════════════════════════════════════════════════════════════════════════════

function XacNhanThanhToanPopup({
  goi, goiCuocDaChon, monDaChon, onQuayLai, onXacNhan, onClose,
}: {
  goi: GoiChuongTrinh;
  goiCuocDaChon: string[];
  monDaChon: string[];
  onQuayLai: () => void;
  onXacNhan: () => void;
  onClose: () => void;
}) {
  // Lấy thông tin gói cước đã chọn
  const goiCuocChon = goiCuocDaChon.map(id => goi.goiCuoc.find(gc => gc.id === id)).filter(Boolean) as GoiCuoc[];
  const tongTienGoiCuoc = goiCuocChon.reduce((sum, g) => sum + g.gia, 0);

  return (
    <Backdrop onClose={onClose}>
      <PopupShell maxWidth={500}>
        <PopupHeader
          badge="Bước 3 / 4 — Xác nhận lựa chọn"
          title="Xác nhận lựa chọn & Thanh toán"
          onClose={onClose}
          stepDots={3}
          totalSteps={4}
        />

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Thông tin gói */}
          <div style={{ borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Thông tin gói
              </span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <SummaryRow label="Tên gói" value={goi.ten} bold />
              <SummaryRow label="Thời hạn" value={goi.thoiGian} />
              <SummaryRow label="Khối lớp" value={goi.khoiLop.join(", ")} />
            </div>
          </div>

          {/* Gói cước đã chọn */}
          <div style={{ borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Gói cước đã chọn
              </span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {goiCuocChon.map((g) => (
                <div key={g.id} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 10, borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{g.tenLoai}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#005CB6" }}>{formatGia(g.gia)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
                    <Clock size={12} />
                    {g.thoiGian}
                  </div>
                  {g.thoiGianDungThu && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 500 }}>
                      🎁 Dùng thử: {g.thoiGianDungThu}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Môn học đã chọn */}
          <div style={{ borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Môn học đã chọn
              </span>
              <CounterBadge current={monDaChon.length} max={goi.maxMon} small />
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {monDaChon.map((mon) => (
                <span key={mon} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 20,
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  fontSize: 13, fontWeight: 600, color: "#1d4ed8",
                }}>
                  <Check size={12} strokeWidth={3} />
                  {mon}
                </span>
              ))}
            </div>
          </div>

          {/* Tổng thanh toán */}
          <div style={{ borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", background: "#f0f9ff" }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#005CB6" }}>Tổng thanh toán</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#005CB6" }}>{formatGia(tongTienGoiCuoc)}</span>
            </div>
          </div>

          {/* Cảnh báo */}
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "#fff7ed", border: "1px solid #fed7aa",
            display: "flex", gap: 10,
          }}>
            <AlertCircle size={16} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, color: "#9a3412", lineHeight: 1.6 }}>
              <strong>Vui lòng kiểm tra kỹ.</strong> Sau khi xác nhận thanh toán, bạn sẽ{" "}
              <strong>không thể thay đổi</strong> danh sách gói cước và môn học.
            </p>
          </div>
        </div>

        <PopupFooter>
          <BtnOutline onClick={onQuayLai}>
            <ArrowLeft size={15} />
            Quay lại
          </BtnOutline>
          <BtnPrimary onClick={onXacNhan}>
            <Shield size={15} />
            Xác nhận &amp; Thanh toán
          </BtnPrimary>
        </PopupFooter>
      </PopupShell>
    </Backdrop>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP BƯỚC 4 — CỔNG THANH TOÁN (K12PaymentHub Style)
// ═══════════════════════════════════════════════════════════════════════════════

function CongThanhToanPopup({
  goi, goiCuocDaChon, monDaChon, onQuayLai, onThanhCong, onClose,
}: {
  goi: GoiChuongTrinh;
  goiCuocDaChon: string[];
  monDaChon: string[];
  onQuayLai: () => void;
  onThanhCong: () => void;
  onClose: () => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [countdown, setCountdown]   = useState(592); // 9:52 như ảnh
  const [txId] = useState(() =>
    `VDS-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 7)}`
  );

  // Tính tổng tiền từ gói cước đã chọn
  const goiCuocChon = goiCuocDaChon.map(id => goi.goiCuoc.find(gc => gc.id === id)).filter(Boolean) as GoiCuoc[];
  const tongTienGoiCuoc = goiCuocChon.reduce((sum, g) => sum + g.gia, 0);

  useEffect(() => {
    if (processing || success) return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [processing, success]);

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss2 = String(countdown % 60).padStart(2, "0");

  const handleXacNhan = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); }, 2000);
    setTimeout(() => onThanhCong(), 3800);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget && !processing && !success) onClose(); }}
    >
      <div style={{ background: "#f0f2f5", borderRadius: 16, width: "min(960px, 98vw)", maxHeight: "94vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 28px 80px rgba(0,0,0,0.28)" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* ── Header bar (K12PaymentHub) ─────────────────────────────────────── */}
        <div style={{ background: "#fff", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ fontSize: 18, fontWeight: 800, color: "#005CB6", letterSpacing: "-0.4px" }}>
            K12PaymentHub
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: success ? "#22c55e" : "#005CB6", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {success ? <Check size={14} strokeWidth={3} /> : "1"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: success ? "#9ca3af" : "#005CB6" }}>Thanh toán</span>
            </div>
            <div style={{ width: 56, height: 2, background: success ? "#22c55e" : "#d1d5db", margin: "0 10px", borderRadius: 2, transition: "background 0.4s" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${success ? "#22c55e" : "#d1d5db"}`, background: success ? "#22c55e" : "#fff", color: success ? "#fff" : "#9ca3af", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s" }}>
                {success ? <Check size={14} strokeWidth={3} /> : "2"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: success ? "#22c55e" : "#9ca3af", transition: "color 0.4s" }}>Hoàn tất</span>
            </div>
          </div>

          {/* Avatar */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="#fff" />
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        {success ? (
          /* Màn hình Hoàn tất */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "60px 40px", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={40} color="#22c55e" />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>Thanh toán thành công!</div>
              <div style={{ fontSize: 14, color: "#6b7280", maxWidth: 360, lineHeight: 1.7 }}>
                Gói <strong>{goi.ten}</strong> đã được kích hoạt. Các môn học đã chọn sẵn sàng để học.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 }}>
                {monDaChon.map((m) => (
                  <span key={m} style={{ fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", gap: 5 }}>
                    <Check size={12} strokeWidth={3} />{m}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Đang chuyển hướng...</div>
            </div>
          </div>
        ) : processing ? (
          /* Màn hình xử lý */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "60px 40px" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ animation: "spin 0.9s linear infinite" }}>
                <Loader2 size={52} color="#005CB6" />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>Đang xử lý giao dịch...</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Vui lòng không đóng cửa sổ này.</div>
              </div>
            </div>
          </div>
        ) : (
          /* Màn hình chính: 2 cột */
          <div style={{ display: "flex", gap: 20, padding: "24px 28px", overflowY: "auto", flex: 1 }}>

            {/* ── Cột trái: Chi tiết giao dịch ── */}
            <div style={{ width: 290, flexShrink: 0, background: "#fff", borderRadius: 14, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: "#1a4f9c" }}>Chi tiết giao dịch</h3>

              {/* Số tiền */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Số tiền thanh toán</div>
                {tongTienGoiCuoc === 0 ? (
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>MIỄN PHÍ</div>
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: "#1a4f9c" }}>{tongTienGoiCuoc.toLocaleString("vi-VN")}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af" }}>VND</span>
                  </div>
                )}
              </div>

              {/* Phí nền tảng / VAT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Phí nền tảng</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>MIỄN PHÍ</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Thuế VAT (10%)</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>Đã bao gồm</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f0f0f0", marginBottom: 18 }} />

              {/* Thông tin giao dịch */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                <TxField label="Mã giao dịch" value={txId} mono />
                <TxField label="Nội dung" value={`Thanh toán ${goi.ten}`} />
                <TxField label="Nhà cung cấp" value="K12Online Education System" />
                <TxField label="Phương thức" value="ViettelPay QR" icon={<ViettelIcon />} />
              </div>

              {/* Gói cước & Môn học */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Gói cước được mở khoá</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                  {goiCuocChon.map((g) => (
                    <div key={g.id} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 12px", borderRadius: 8, background: "#dbeafe", border: "1px solid #bfdbfe" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>{g.tenLoai}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                        <Clock size={11} />
                        {g.thoiGian}
                      </div>
                      {g.thoiGianDungThu && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 500 }}>
                          🎁 Dùng thử: {g.thoiGianDungThu}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Môn học được mở khoá</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {monDaChon.map((m) => (
                    <span key={m} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Nút CTA */}
              <button
                onClick={handleXacNhan}
                style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: "#1a4f9c", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "auto", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a4f9c")}
              >
                Xác nhận thanh toán <ChevronRight size={16} />
              </button>
            </div>

            {/* ── Cột phải: ViettelPay QR ── */}
            <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              {/* QR Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ViettelIcon size={40} />
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e" }}>ViettelPay QR</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Quét mã QR bằng ứng dụng ViettelPay để thanh toán</div>
                  </div>
                </div>
                {/* Timer pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
                  <Clock size={13} color="#6b7280" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mã QR hiệu lực trong: {mm}:{ss2}</span>
                </div>
              </div>

              {/* QR Area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 0", gap: 16 }}>
                {/* Scan frame */}
                <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                  {/* ViettelPay logo above QR */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <ViettelIcon size={28} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>ViettelPay</span>
                  </div>

                  {/* Scan brackets wrapper */}
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <ScanBrackets />
                    <FakeQR size={200} seed={goi.ten + "-vtp"} />
                  </div>
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Quét mã để thanh toán qua ViettelPay</div>
              </div>

              {/* Instruction bar */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#fff5f5", border: "1px solid #fecaca" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#e31f26", flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  Mở ứng dụng <strong>ViettelPay</strong>, chọn <strong>Quét mã QR</strong> và quét mã trên để hoàn tất thanh toán tự động.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quay lại (footer link) */}
        {!processing && !success && (
          <div style={{ padding: "0 28px 18px", flexShrink: 0 }}>
            <button onClick={onQuayLai} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "#6b7280", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <ArrowLeft size={14} /> Quay lại bước trước
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ViettelPay Icon ───────────────────────────────────────────────────────────

function ViettelIcon({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#e31f26", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Check size={size * 0.45} color="#fff" strokeWidth={3} />
    </div>
  );
}

// ── Scan brackets (góc đỏ bao quanh QR) ──────────────────────────────────────

function ScanBrackets() {
  const L = 22; // chiều dài nhánh
  const T = 3;  // độ dày
  const C = "#e31f26";
  const cornerStyle = (pos: { top?: number; bottom?: number; left?: number; right?: number }) => ({
    position: "absolute" as const,
    width: L, height: L,
    ...pos,
    zIndex: 2,
  });
  const hBar = (flip: boolean) => ({ width: L, height: T, background: C, borderRadius: 2, position: "absolute" as const, top: flip ? L - T : 0 });
  const vBar = (flip: boolean) => ({ width: T, height: L, background: C, borderRadius: 2, position: "absolute" as const, left: flip ? L - T : 0 });

  return (
    <>
      {/* Top-left */}
      <div style={cornerStyle({ top: -4, left: -4 })}>
        <div style={hBar(false)} /><div style={vBar(false)} />
      </div>
      {/* Top-right */}
      <div style={cornerStyle({ top: -4, right: -4 })}>
        <div style={{ ...hBar(false), right: 0, left: "auto" }} /><div style={vBar(true)} />
      </div>
      {/* Bottom-left */}
      <div style={cornerStyle({ bottom: -4, left: -4 })}>
        <div style={{ ...hBar(false), top: "auto", bottom: 0 }} /><div style={vBar(false)} />
      </div>
      {/* Bottom-right */}
      <div style={cornerStyle({ bottom: -4, right: -4 })}>
        <div style={{ ...hBar(false), top: "auto", bottom: 0, right: 0, left: "auto" }} /><div style={vBar(true)} />
      </div>
    </>
  );
}

// ── TxField ───────────────────────────────────────────────────────────────────

function TxField({ label, value, mono, icon }: { label: string; value: string; mono?: boolean; icon?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#1a1a2e", fontFamily: mono ? "monospace" : undefined }}>
        {icon}{value}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAKE QR CODE (SVG)
// ═══════════════════════════════════════════════════════════════════════════════

function FakeQR({ size = 160, seed = "default" }: { size?: number; seed?: string }) {
  const CELLS = 21;
  const cell = size / CELLS;

  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) >>> 0;
  const rng = () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };

  const grid: boolean[][] = Array.from({ length: CELLS }, (_, r) =>
    Array.from({ length: CELLS }, (_, c) => {
      const inCorner = (r < 7 && c < 7) || (r < 7 && c >= CELLS - 7) || (r >= CELLS - 7 && c < 7);
      if (inCorner) {
        const lr = r < 7 ? r : CELLS - 1 - r;
        const lc = c < 7 ? c : CELLS - 1 - c;
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
        if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
        return false;
      }
      rng();
      return rng() > 0.45;
    })
  );

  return (
    <div style={{ background: "#fff", display: "inline-block" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        {grid.flatMap((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 0.5} height={cell - 0.5} fill="#1a1a2e" rx={0.5} />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD GÓI
// ═══════════════════════════════════════════════════════════════════════════════

function GoiCard({ goi, onMuaNgay }: { goi: GoiChuongTrinh; onMuaNgay: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,92,182,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Ảnh + Tags */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#e8f4fd" }}>
        {!imgErr ? (
          <img src={goi.img} alt={goi.ten} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e8f4fd 0%, #d1e9f6 100%)" }}>
            <BookOpen size={48} color="#005CB6" style={{ opacity: 0.3 }} />
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: goi.daMua ? "#22c55e" : "#f97316", color: "#fff" }}>
          {goi.daMua && <Check size={11} strokeWidth={3} />}
          {goi.daMua ? "Đã mua" : "Chưa mua"}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)" }}>
          Chọn tối đa {goi.maxMon} môn
        </div>
      </div>

      {/* Nội dung */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.4 }}>{goi.ten}</div>
        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{goi.moTa}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: goi.goiCuoc.length > 0 && goi.goiCuoc[0].gia === 0 && goi.goiCuoc.every(g => g.gia === 0) ? "#059669" : "#005CB6", margin: "2px 0" }}>{formatGiaRange(goi.goiCuoc)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <InfoRow icon={<GraduationCap size={13} color="#005CB6" />} text={goi.khoiLop.join(", ")} />
          <InfoRow icon={<BookOpen size={13} color="#005CB6" />} text={goi.monHoc.join(", ")} />
          <InfoRow icon={<Clock size={13} color="#005CB6" />} text={goi.thoiGian} />
        </div>
        <div style={{ marginTop: "auto", paddingTop: 10 }}>
          {goi.daMua ? (
            <button style={{ width: "100%", padding: "10px 0", borderRadius: 24, border: "1.5px solid #005CB6", background: "#005CB6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <BookOpen size={15} /> Học ngay
            </button>
          ) : (
            <button
              onClick={onMuaNgay}
              style={{ width: "100%", padding: "10px 0", borderRadius: 24, border: "1.5px solid #005CB6", background: "#fff", color: "#005CB6", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#005CB6"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#005CB6"; }}
            >
              <ShoppingCart size={15} /> Mua ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      {children}
    </div>
  );
}

function PopupShell({ children, maxWidth }: { children: React.ReactNode; maxWidth: number }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "92vh", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function PopupHeader({ badge, title, onClose, stepDots, totalSteps = 3 }: { badge: string; title: string; onClose?: () => void; stepDots: number; totalSteps?: number }) {
  return (
    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0" }}>
      {/* Step dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const n = i + 1;
          return (
            <div key={n} style={{ width: n === stepDots ? 20 : 8, height: 8, borderRadius: 4, background: n === stepDots ? "#005CB6" : n < stepDots ? "#93c5fd" : "#e5e7eb", transition: "all 0.3s" }} />
          );
        })}
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginLeft: 6 }}>{badge}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.35 }}>{title}</h2>
        {onClose && (
          <button onClick={onClose} style={{ flexShrink: 0, background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="#6b7280" />
          </button>
        )}
      </div>
    </div>
  );
}

function PopupFooter({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 10, justifyContent: "flex-end", ...style }}>
      {children}
    </div>
  );
}

function BtnOutline({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
}

function BtnPrimary({ onClick, children, disabled }: { onClick?: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: disabled ? "#e5e7eb" : "#005CB6", fontSize: 14, fontWeight: 600, color: disabled ? "#9ca3af" : "#fff", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}>
      {children}
    </button>
  );
}

function BtnSuccess({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: "#059669", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
    >
      {children}
    </button>
  );
}

function CounterBadge({ current, max, small }: { current: number; max: number; small?: boolean }) {
  const full = current >= max;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: small ? "2px 8px" : "4px 12px", borderRadius: 20, background: current === 0 ? "#f3f4f6" : full ? "#22c55e" : "#005CB6", transition: "background 0.2s" }}>
      <span style={{ fontSize: small ? 11 : 13, fontWeight: 700, color: current === 0 ? "#6b7280" : "#fff" }}>
        {current}/{max} môn
      </span>
    </div>
  );
}

function MonCheckRow({ label, checked, disabled, onClick }: { label: string; checked: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", marginBottom: 6, borderRadius: 10, border: `1.5px solid ${checked ? "#005CB6" : "#e5e7eb"}`, background: checked ? "#eff6ff" : disabled ? "#f9fafb" : "#fff", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, transition: "all 0.15s", userSelect: "none" }}
      onMouseEnter={(e) => { if (!disabled && !checked) { e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.borderColor = "#93c5fd"; } }}
      onMouseLeave={(e) => { if (!checked) { e.currentTarget.style.background = disabled ? "#f9fafb" : "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; } }}
    >
      <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `2px solid ${checked ? "#005CB6" : "#d1d5db"}`, background: checked ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {checked && <Check size={12} strokeWidth={3} color="#fff" />}
      </div>
      <span style={{ fontSize: 14, fontWeight: checked ? 600 : 400, color: checked ? "#005CB6" : disabled ? "#9ca3af" : "#374151", flex: 1 }}>{label}</span>
      {checked && <span style={{ fontSize: 11, fontWeight: 600, color: "#005CB6", background: "#dbeafe", padding: "2px 8px", borderRadius: 12 }}>Đã chọn</span>}
    </div>
  );
}

function GoiCuocCheckRow({ id, label, gia, checked, onClick, thoiGian, thoiGianDungThu }: { id: string; label: string; gia: number; checked: boolean; onClick: () => void; thoiGian?: string; thoiGianDungThu?: string }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 16px", marginBottom: 6, borderRadius: 10, border: `1.5px solid ${checked ? "#005CB6" : "#e5e7eb"}`, background: checked ? "#eff6ff" : "#fff", cursor: "pointer", transition: "all 0.15s", userSelect: "none" }}
      onMouseEnter={(e) => { if (!checked) { e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.borderColor = "#93c5fd"; } }}
      onMouseLeave={(e) => { if (!checked) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; } }}
    >
      <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `2px solid ${checked ? "#005CB6" : "#d1d5db"}`, background: checked ? "#005CB6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", marginTop: 2 }}>
        {checked && <Check size={12} strokeWidth={3} color="#fff" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: checked ? 600 : 400, color: checked ? "#005CB6" : "#374151", marginBottom: 6 }}>{label}</div>
        {thoiGian && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
            <Clock size={12} />
            {thoiGian}
          </div>
        )}
        {thoiGianDungThu && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 500, marginTop: 4 }}>
            🎁 Dùng thử: {thoiGianDungThu}
          </div>
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: checked ? "#005CB6" : "#1a1a2e", whiteSpace: "nowrap", marginLeft: 12 }}>{formatGia(gia)}</span>
      {checked && <span style={{ fontSize: 11, fontWeight: 600, color: "#005CB6", background: "#dbeafe", padding: "2px 8px", borderRadius: 12, marginLeft: 8 }}>Đã chọn</span>}
    </div>
  );
}

function SummaryRow({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <span style={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: highlight ? 18 : 13, fontWeight: bold || highlight ? 700 : 500, color: highlight ? "#005CB6" : "#1a1a2e", textAlign: "right" }}>{value}</span>
    </div>
  );
}


function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#374151" }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function SelFilter({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ appearance: "none", padding: "9px 32px 9px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, color: value ? "#1a1a2e" : "#6b7280", cursor: "pointer", outline: "none", fontFamily: "'Be Vietnam Pro', sans-serif", minWidth: 170 }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }} />
    </div>
  );
}
