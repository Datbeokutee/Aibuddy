import { useState, useRef, useEffect } from "react";
import type { UserRole } from "../LoginScreen";
import { SAMPLE_DATA as DS_CHUONG_TRINH_HOC_PAGE } from "./ChuongTrinhHocPage";
import {
  Tags, Plus, Edit2, Eye, X, Check, AlertCircle, CheckCircle,
  ChevronDown, Search, Trash2,
  RefreshCw, Info, ChevronRight, ChevronUp, ArrowUpDown,
  Database, BookOpen, FlaskConical, Globe2, Palette,
  BadgePercent, DollarSign, Gift, Code2, Hash,
  Clock, Calendar, Timer, TrendingUp, ShieldCheck,
  Link2, GraduationCap, BookMarked, Rocket, ListChecks, Lock,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ─────────────────────────────────────────────────────────────

type LoaiGia      = "dong-gia" | "khac-gia" | "free";
type TrangThai    = "Đang hoạt động" | "Tạm dừng";

interface ChuongTrinh {
  id: string; ten: string; kyHieu: string;
  nhom: "khtn" | "khxh" | "ngoai-ngu" | "nang-khieu";
}

interface DonViGan {
  id: string;
  tenDonVi: string;
  tinhThanh: string;
  capHoc: string;
  soHocSinh: number;
  soLicenseCapPhat: number;
  soLicenseDaDung: number;
  ngayKichHoat: string;
  trangThai: "Đang dùng" | "Hết hạn" | "Chưa kích hoạt";
  soMonDaHoc: number;
  soTietDaHoc: number;
  tiLeHoanThanh: number; // %
}

interface GoiCuoc {
  id: string;
  tenGoi: string;
  maBCSS: string;
  phanLoai: string;
  loaiGia: LoaiGia;
  giaFrom: number;
  giaTo: number;
  thoiLuongThuNghiem: number; // ngày
  thoiLuongSuDung: number;    // tháng
  chuongTrinhIds: string[];
  monHocIds: string[]; // Linked K12 subject IDs
  quotaToiDa: number;
  soGoiNoiDungDaDung: number;
  trangThai: TrangThai;
  ghiChu: string;
  ngayTao: string;
  donViGan: DonViGan[];
}

// ── CHƯƠNG TRÌNH HỌC (Curriculum Programs) ────────────────────────────────────

type LoaiChuongTrinh = "Cơ bản" | "Nâng cao" | "Chuyên sâu" | "Ôn tập";

interface ChuongTrinhHoc {
  id: string;
  ten: string;
  monHocId: string;   // maps to DS_CHUONG_TRINH id
  khoiLop: number;    // 1–12
  capHoc: CapHoc;
  loai: LoaiChuongTrinh;
  soTiet: number;
  soChude: number;
  trangThai: "Hoạt động" | "Bản nháp";
}

const LOAI_CFG: Record<LoaiChuongTrinh, { color: string; bg: string; border: string }> = {
  "Cơ bản":    { color: "#0284C7", bg: "rgba(2,132,199,0.08)",   border: "rgba(2,132,199,0.2)"   },
  "Nâng cao":  { color: "#7C3AED", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.2)"  },
  "Chuyên sâu":{ color: "#D97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)"   },
  "Ôn tập":    { color: "#0F766E", bg: "rgba(15,118,110,0.08)",  border: "rgba(15,118,110,0.2)"  },
};

const DS_CHUONG_TRINH_HOC: ChuongTrinhHoc[] = [
  // ── Tiểu học ──
  { id:"CP001", ten:"Toán 1 – Kết nối tri thức",                monHocId:"toan",  khoiLop:1,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:140, soChude:8,  trangThai:"Hoạt động" },
  { id:"CP002", ten:"Tiếng Việt 2 – Cánh diều",                 monHocId:"nvan",  khoiLop:2,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:175, soChude:10, trangThai:"Hoạt động" },
  { id:"CP003", ten:"Toán 3 – Chân trời sáng tạo",              monHocId:"toan",  khoiLop:3,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:140, soChude:9,  trangThai:"Hoạt động" },
  { id:"CP004", ten:"Tiếng Anh 3 – Global Success",             monHocId:"ta",    khoiLop:3,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:70,  soChude:10, trangThai:"Hoạt động" },
  { id:"CP005", ten:"Toán 4 – Nâng cao & Phát triển tư duy",    monHocId:"toan",  khoiLop:4,  capHoc:"tieuhoc", loai:"Nâng cao",  soTiet:35,  soChude:6,  trangThai:"Hoạt động" },
  { id:"CP006", ten:"Tiếng Việt 4 – Kết nối tri thức",          monHocId:"nvan",  khoiLop:4,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:175, soChude:10, trangThai:"Hoạt động" },
  { id:"CP007", ten:"Toán 5 – Ôn tập & Luyện đề cuối cấp",      monHocId:"toan",  khoiLop:5,  capHoc:"tieuhoc", loai:"Ôn tập",    soTiet:70,  soChude:7,  trangThai:"Hoạt động" },
  { id:"CP008", ten:"Tiếng Anh 5 – I-Learn Smart Start",        monHocId:"ta",    khoiLop:5,  capHoc:"tieuhoc", loai:"Cơ bản",    soTiet:70,  soChude:10, trangThai:"Hoạt động" },
  // ── THCS ──
  { id:"CP009", ten:"Toán 6 – Kết nối tri thức (Đại số)",       monHocId:"toan",  khoiLop:6,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:140, soChude:10, trangThai:"Hoạt động" },
  { id:"CP010", ten:"Ngữ văn 7 – Chân trời sáng tạo",           monHocId:"nvan",  khoiLop:7,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:140, soChude:9,  trangThai:"Hoạt động" },
  { id:"CP011", ten:"Vật lý 8 – Cơ học và Nhiệt học",           monHocId:"ly",    khoiLop:8,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:70,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP012", ten:"Hóa học 8 – Kết nối tri thức",             monHocId:"hoa",   khoiLop:8,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:70,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP013", ten:"Sinh học 8 – Giải phẫu người",             monHocId:"sinh",  khoiLop:8,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:52,  soChude:7,  trangThai:"Hoạt động" },
  { id:"CP014", ten:"Toán 8 – Nâng cao và Bài tập tư duy",      monHocId:"toan",  khoiLop:8,  capHoc:"thcs",    loai:"Nâng cao",  soTiet:52,  soChude:6,  trangThai:"Hoạt động" },
  { id:"CP015", ten:"Tiếng Anh 9 – Global Success",             monHocId:"ta",    khoiLop:9,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:105, soChude:10, trangThai:"Hoạt động" },
  { id:"CP016", ten:"Toán 9 – Luyện thi vào lớp 10",            monHocId:"toan",  khoiLop:9,  capHoc:"thcs",    loai:"Ôn tập",    soTiet:70,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP017", ten:"Lịch sử 7 – Thế giới và Việt Nam",         monHocId:"su",    khoiLop:7,  capHoc:"thcs",    loai:"Cơ bản",    soTiet:52,  soChude:8,  trangThai:"Hoạt động" },
  // ── THPT ──
  { id:"CP018", ten:"Toán 10 – Đại số & Giải tích cơ bản",      monHocId:"toan",  khoiLop:10, capHoc:"thpt",    loai:"Cơ bản",    soTiet:87,  soChude:9,  trangThai:"Hoạt động" },
  { id:"CP019", ten:"Vật lý 10 – Cơ học và Nhiệt động lực học", monHocId:"ly",    khoiLop:10, capHoc:"thpt",    loai:"Cơ bản",    soTiet:70,  soChude:7,  trangThai:"Hoạt động" },
  { id:"CP020", ten:"Hóa học 11 – Hữu cơ nâng cao",             monHocId:"hoa",   khoiLop:11, capHoc:"thpt",    loai:"Nâng cao",  soTiet:70,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP021", ten:"Vật lý 11 – Điện học & Từ trường nâng cao",monHocId:"ly",    khoiLop:11, capHoc:"thpt",    loai:"Nâng cao",  soTiet:52,  soChude:6,  trangThai:"Hoạt động" },
  { id:"CP022", ten:"Tiếng Anh 11 – Nâng cao & IELTS Foundation",monHocId:"ta",   khoiLop:11, capHoc:"thpt",    loai:"Nâng cao",  soTiet:70,  soChude:10, trangThai:"Hoạt động" },
  { id:"CP023", ten:"Toán 12 – Luyện thi THPTQG toàn diện",      monHocId:"toan", khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:105, soChude:12, trangThai:"Hoạt động" },
  { id:"CP024", ten:"Ngữ văn 12 – Luyện thi THPTQG",             monHocId:"nvan", khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:70,  soChude:9,  trangThai:"Hoạt động" },
  { id:"CP025", ten:"Hóa học 12 – Luyện thi THPTQG",             monHocId:"hoa",  khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:70,  soChude:9,  trangThai:"Hoạt động" },
  { id:"CP026", ten:"Sinh học 12 – Di truyền & Tiến hóa",        monHocId:"sinh", khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:70,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP027", ten:"Lịch sử 12 – Luyện thi THPTQG",             monHocId:"su",   khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:52,  soChude:8,  trangThai:"Hoạt động" },
  { id:"CP028", ten:"Địa lý 12 – Địa lý KT–XH Việt Nam",         monHocId:"dia",  khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:52,  soChude:7,  trangThai:"Hoạt động" },
  { id:"CP029", ten:"Tiếng Anh 12 – THPTQG & IELTS Target 6.0", monHocId:"ta",   khoiLop:12, capHoc:"thpt",    loai:"Chuyên sâu",soTiet:70,  soChude:10, trangThai:"Hoạt động" },
  { id:"CP030", ten:"Tin học 10 – Khoa học máy tính",            monHocId:"tin",  khoiLop:10, capHoc:"thpt",    loai:"Cơ bản",    soTiet:52,  soChude:7,  trangThai:"Bản nháp"  },
];

// ── CHƯƠNG TRÌNH HỌC ────────────────────────────────────────────────────────

const DS_CHUONG_TRINH: ChuongTrinh[] = [
  { id: "toan", ten: "Toán học",          kyHieu: "TOÁN", nhom: "khtn"      },
  { id: "ly",   ten: "Vật lý",            kyHieu: "LÝ",   nhom: "khtn"      },
  { id: "hoa",  ten: "Hóa học",           kyHieu: "HÓA",  nhom: "khtn"      },
  { id: "sinh", ten: "Sinh học",          kyHieu: "SINH", nhom: "khtn"      },
  { id: "tin",  ten: "Tin học",           kyHieu: "TIN",  nhom: "khtn"      },
  { id: "nvan", ten: "Ngữ văn",           kyHieu: "VĂN",  nhom: "khxh"      },
  { id: "su",   ten: "Lịch sử",           kyHieu: "SỬ",   nhom: "khxh"      },
  { id: "dia",  ten: "Địa lý",            kyHieu: "ĐỊA",  nhom: "khxh"      },
  { id: "gdcd", ten: "GDCD / GDKTPL",     kyHieu: "GDCD", nhom: "khxh"      },
  { id: "ta",   ten: "Tiếng Anh",         kyHieu: "ANH",  nhom: "ngoai-ngu" },
  { id: "am",   ten: "Âm nhạc & MT",      kyHieu: "NT",   nhom: "nang-khieu"},
  { id: "tdtt", ten: "Thể dục",           kyHieu: "TD",   nhom: "nang-khieu"},
];

const NHOM_CFG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  khtn:        { label: "Khoa học Tự nhiên", color: "#0284C7", bg: "rgba(2,132,199,0.08)",  icon: FlaskConical },
  khxh:        { label: "Khoa học Xã hội",  color: "#7C3AED", bg: "rgba(124,58,237,0.08)", icon: BookOpen     },
  "ngoai-ngu": { label: "Ngoại ngữ",        color: "#0F766E", bg: "rgba(15,118,110,0.08)", icon: Globe2       },
  "nang-khieu":{ label: "Năng khiếu & TD",  color: "#D97706", bg: "rgba(217,119,6,0.08)",  icon: Palette      },
};



const LG_CFG: Record<LoaiGia, { label: string; color: string; bg: string; border: string; icon: React.ElementType; desc: string }> = {
  "dong-gia": { label: "Đồng giá",  color: "#005CB6", bg: "rgba(0,92,182,0.08)",   border: "rgba(0,92,182,0.2)",   icon: DollarSign,   desc: "Một mức giá cho mọi khối lớp" },
  "khac-gia": { label: "Khác giá",  color: "#D97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.2)",  icon: BadgePercent, desc: "Giá dao động theo từng khối"  },
  "free":     { label: "Miễn phí",  color: "#0F766E", bg: "rgba(15,118,110,0.08)", border: "rgba(15,118,110,0.2)", icon: Gift,         desc: "Không thu phí — gói trải nghiệm" },
};

const TS_CFG: Record<TrangThai, { color: string; bg: string; dot: string }> = {
  "Đang hoạt động": { color: "#0F766E", bg: "rgba(15,118,110,0.08)", dot: "#0F766E" },
  "Tạm dừng":       { color: "#D4183D", bg: "rgba(212,24,61,0.07)",  dot: "#D4183D" },
};

const DS_LG: LoaiGia[]      = ["dong-gia", "khac-gia", "free"];

// ── CẤP HỌC / LỚP ────────────────────────────────────────────────────────────

type CapHoc = "tieuhoc" | "thcs" | "thpt";

const DS_LOP = Array.from({ length: 12 }, (_, i) => ({
  id: `lop${i + 1}`,
  ten: `Khối ${i + 1}`,
  so: i + 1,
  cap: (i < 5 ? "tieuhoc" : i < 9 ? "thcs" : "thpt") as CapHoc,
}));

const CAP_CFG: Record<CapHoc, { label: string; range: string; color: string; bg: string; border: string }> = {
  tieuhoc: { label: "Tiểu học", range: "1–5",   color: "#0284C7", bg: "rgba(2,132,199,0.08)",  border: "rgba(2,132,199,0.25)"  },
  thcs:    { label: "THCS",     range: "6–9",   color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.25)" },
  thpt:    { label: "THPT",     range: "10–12", color: "#D97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.25)"  },
};

// ── DEMO MÃ BCCS (sẽ gọi API thật khi triển khai) ────────────────────────────

interface MaBCCSItem {
  ma: string;
  moTa: string;
  trangThai: "Khả dụng" | "Đang dùng";
}

const DEMO_MA_BCSS: MaBCCSItem[] = [
  { ma:"BCCS-TH-001",  moTa:"Gói Tiểu học – Toàn diện",            trangThai:"Đang dùng"  },
  { ma:"BCCS-TH-002",  moTa:"Gói Tiểu học – Toán & Tiếng Việt",    trangThai:"Đang dùng"  },
  { ma:"BCCS-TH-003",  moTa:"Gói Tiểu học – Tiếng Anh cơ bản",     trangThai:"Khả dụng"   },
  { ma:"BCCS-TC-001",  moTa:"Gói THCS – 3 môn nền tảng",           trangThai:"Đang dùng"  },
  { ma:"BCCS-TC-002",  moTa:"Gói THCS – Khoa học Tự nhiên",         trangThai:"Đang dùng"  },
  { ma:"BCCS-TC-003",  moTa:"Gói THCS – Ngoại ngữ & Xã hội",       trangThai:"Đang dùng"  },
  { ma:"BCCS-TC-004",  moTa:"Gói THCS – Ôn tập học kỳ Lớp 9",      trangThai:"Khả dụng"   },
  { ma:"BCCS-TP-001",  moTa:"Gói THPT – Luyện thi THPTQG",          trangThai:"Đang dùng"  },
  { ma:"BCCS-TP-002",  moTa:"Gói THPT – Khoa học Tự nhiên NC",      trangThai:"Đang dùng"  },
  { ma:"BCCS-TP-003",  moTa:"Gói THPT – Chuyên sâu Toán Lý Hóa",   trangThai:"Đang dùng"  },
  { ma:"BCCS-TP-004",  moTa:"Gói THPT – Tiếng Anh IELTS Target",    trangThai:"Khả dụng"   },
  { ma:"BCCS-TP-005",  moTa:"Gói THPT – Xã hội & Ngoại ngữ NC",    trangThai:"Khả dụng"   },
  { ma:"BCCS-K12-001", moTa:"Gói K12 – Toàn diện tất cả môn",       trangThai:"Đang dùng"  },
  { ma:"BCCS-K12-002", moTa:"Gói K12 – STEM & Tin học",             trangThai:"Đang dùng"  },
  { ma:"BCCS-K12-003", moTa:"Gói K12 – Năng khiếu & Kỹ năng sống", trangThai:"Khả dụng"   },
  { ma:"BCCS-FREE-001",moTa:"Gói dùng thử miễn phí",                trangThai:"Đang dùng"  },
  { ma:"BCCS-FREE-002",moTa:"Gói hè miễn phí K1–K9",                trangThai:"Khả dụng"   },
];

// ── BCCS PACKAGES (cấu trúc đa mã — dùng cho form Thêm mới) ─────────────────

interface BCCSMaGoi {
  ma: string;
  moTa: string;
  giaSauVAT: number;  // đơn giá sau VAT (đồng)
  thoiHan: number;    // Thời hạn (tháng)
}

interface BCCSGoi {
  id: string;
  ten: string;        // tên hiển thị trong dropdown
  maGois: BCCSMaGoi[];
  trangThai: "Khả dụng" | "Đang dùng";
  thoiLuongSuDung: number;  // Thời lượng sử dụng (tháng): 3, 6, 12
}

const DEMO_BCCS_PACKAGES: BCCSGoi[] = [
  {
    id: "lt10",
    ten: "Luyện thi vào lớp 10",
    maGois: [
      { ma: "k12_u10s", moTa: "Ôn tập THCS thi vào 10 (cơ bản)",   giaSauVAT: 10000,  thoiHan: 0 },
      { ma: "k12_LT20", moTa: "Luyện đề chuyên sâu vào lớp 10",    giaSauVAT: 300000, thoiHan: 0 },
    ],
    trangThai: "Khả dụng",
    thoiLuongSuDung: 3,
  },
  {
    id: "ltthptqg",
    ten: "Luyện thi THPTQG",
    maGois: [
      { ma: "k12_LTQG_A", moTa: "Khối A – Toán Lý Hóa",  giaSauVAT: 400000, thoiHan: 0 },
      { ma: "k12_LTQG_B", moTa: "Khối B – Toán Hóa Sinh", giaSauVAT: 400000, thoiHan: 0 },
      { ma: "k12_LTQG_D", moTa: "Khối D – Toán Văn Anh",  giaSauVAT: 350000, thoiHan: 0 },
    ],
    trangThai: "Khả dụng",
    thoiLuongSuDung: 6,
  },
  {
    id: "th-toan-dien",
    ten: "Gói Tiểu học – Toàn diện",
    maGois: [
      { ma: "k12_TH_CB", moTa: "Chương trình cơ bản Tiểu học",  giaSauVAT: 150000, thoiHan: 0 },
      { ma: "k12_TH_NC", moTa: "Nâng cao & Phát triển tư duy",  giaSauVAT: 80000,  thoiHan: 0 },
    ],
    trangThai: "Đang dùng",
    thoiLuongSuDung: 12,
  },
  {
    id: "thcs-khtn",
    ten: "Gói THCS – Khoa học Tự nhiên",
    maGois: [
      { ma: "k12_KHTN69", moTa: "KHTN lớp 6–9 (Toán Lý Hóa Sinh)", giaSauVAT: 280000, thoiHan: 0 },
    ],
    trangThai: "Khả dụng",
    thoiLuongSuDung: 6,
  },
  {
    id: "thpt-stem",
    ten: "Gói THPT – Chuyên sâu Toán Lý Hóa",
    maGois: [
      { ma: "k12_T10", moTa: "Toán nâng cao lớp 10",    giaSauVAT: 200000, thoiHan: 0 },
      { ma: "k12_L10", moTa: "Vật lý nâng cao lớp 10",  giaSauVAT: 180000, thoiHan: 0 },
      { ma: "k12_H10", moTa: "Hóa học nâng cao lớp 10", giaSauVAT: 180000, thoiHan: 0 },
    ],
    trangThai: "Khả dụng",
    thoiLuongSuDung: 12,
  },
  {
    id: "k12-all",
    ten: "Gói K12 – Toàn diện tất cả môn",
    maGois: [
      { ma: "k12_ALL_TH",   moTa: "Tất cả môn Tiểu học", giaSauVAT: 200000, thoiHan: 0 },
      { ma: "k12_ALL_THCS", moTa: "Tất cả môn THCS",     giaSauVAT: 350000, thoiHan: 0 },
      { ma: "k12_ALL_THPT", moTa: "Tất cả môn THPT",     giaSauVAT: 450000, thoiHan: 0 },
    ],
    trangThai: "Đang dùng",
    thoiLuongSuDung: 12,
  },
  {
    id: "free-trial",
    ten: "Gói dùng thử miễn phí",
    maGois: [
      { ma: "k12_FREE", moTa: "Trải nghiệm miễn phí 7 ngày", giaSauVAT: 0, thoiHan: 0 },
    ],
    trangThai: "Đang dùng",
    thoiLuongSuDung: 1,
  },
];

// ── DỮ LIỆU MẪU ──────────────────────────────────────────────────────────────

// ── DỮ LIỆU ĐƠN VỊ GÁN MẪU ──────────────────────────────────────────────────

const MOCK_DON_VI_GAN: Record<string, DonViGan[]> = {
  "1": [
    { id:"dv1", tenDonVi:"Trường TH Kim Liên",         tinhThanh:"Hà Nội",           capHoc:"Tiểu học", soHocSinh:620,  soLicenseCapPhat:580,  soLicenseDaDung:512, ngayKichHoat:"05/01/2025", trangThai:"Đang dùng",      soMonDaHoc:5,  soTietDaHoc:740,  tiLeHoanThanh:72 },
    { id:"dv2", tenDonVi:"Trường TH Lê Văn Tám",       tinhThanh:"TP. Hồ Chí Minh", capHoc:"Tiểu học", soHocSinh:445,  soLicenseCapPhat:400,  soLicenseDaDung:387, ngayKichHoat:"10/01/2025", trangThai:"Đang dùng",      soMonDaHoc:5,  soTietDaHoc:610,  tiLeHoanThanh:65 },
    { id:"dv3", tenDonVi:"Trường TH Lý Thường Kiệt",   tinhThanh:"Đà Nẵng",         capHoc:"Tiểu học", soHocSinh:310,  soLicenseCapPhat:310,  soLicenseDaDung:89,  ngayKichHoat:"01/03/2025", trangThai:"Đang dùng",      soMonDaHoc:3,  soTietDaHoc:210,  tiLeHoanThanh:28 },
    { id:"dv4", tenDonVi:"Trường TH Hồng Bàng",        tinhThanh:"Hải Phòng",        capHoc:"Tiểu học", soHocSinh:280,  soLicenseCapPhat:280,  soLicenseDaDung:0,   ngayKichHoat:"—",          trangThai:"Chưa kích hoạt", soMonDaHoc:0,  soTietDaHoc:0,    tiLeHoanThanh:0  },
  ],
  "2": [
    { id:"dv1", tenDonVi:"Trường THCS Nguyễn Du",      tinhThanh:"Hà Nội",           capHoc:"THCS",     soHocSinh:890,  soLicenseCapPhat:850,  soLicenseDaDung:798, ngayKichHoat:"03/01/2025", trangThai:"Đang dùng",      soMonDaHoc:3,  soTietDaHoc:1240, tiLeHoanThanh:83 },
    { id:"dv2", tenDonVi:"Trường THCS Nguyễn Trãi",    tinhThanh:"TP. Hồ Chí Minh", capHoc:"THCS",     soHocSinh:650,  soLicenseCapPhat:620,  soLicenseDaDung:571, ngayKichHoat:"05/01/2025", trangThai:"Đang dùng",      soMonDaHoc:3,  soTietDaHoc:985,  tiLeHoanThanh:77 },
  ],
  "3": [
    { id:"dv1", tenDonVi:"Trường THCS Trần Phú",       tinhThanh:"Đà Nẵng",         capHoc:"THCS",     soHocSinh:520,  soLicenseCapPhat:500,  soLicenseDaDung:432, ngayKichHoat:"20/01/2025", trangThai:"Đang dùng",      soMonDaHoc:4,  soTietDaHoc:890,  tiLeHoanThanh:68 },
    { id:"dv2", tenDonVi:"Trường THCS Lê Hồng Phong",  tinhThanh:"Hải Phòng",        capHoc:"THCS",     soHocSinh:380,  soLicenseCapPhat:350,  soLicenseDaDung:120, ngayKichHoat:"01/02/2025", trangThai:"Đang dùng",      soMonDaHoc:2,  soTietDaHoc:340,  tiLeHoanThanh:32 },
  ],
  "4": [
    { id:"dv1", tenDonVi:"Trường TH Bình Thuỷ",        tinhThanh:"Cần Thơ",          capHoc:"Tiểu học", soHocSinh:200,  soLicenseCapPhat:200,  soLicenseDaDung:185, ngayKichHoat:"10/02/2025", trangThai:"Đang dùng",      soMonDaHoc:2,  soTietDaHoc:220,  tiLeHoanThanh:55 },
    { id:"dv2", tenDonVi:"Trường TH Kim Liên",         tinhThanh:"Hà Nội",           capHoc:"Tiểu học", soHocSinh:150,  soLicenseCapPhat:150,  soLicenseDaDung:102, ngayKichHoat:"12/02/2025", trangThai:"Hết hạn",        soMonDaHoc:2,  soTietDaHoc:145,  tiLeHoanThanh:41 },
  ],
  "5": [
    { id:"dv1", tenDonVi:"Trường THPT Chu Văn An",     tinhThanh:"Hà Nội",           capHoc:"THPT",     soHocSinh:1200, soLicenseCapPhat:1100, soLicenseDaDung:987, ngayKichHoat:"01/01/2025", trangThai:"Đang dùng",      soMonDaHoc:11, soTietDaHoc:3200, tiLeHoanThanh:61 },
    { id:"dv2", tenDonVi:"Trường THPT Lê Quý Đôn",     tinhThanh:"TP. Hồ Chí Minh", capHoc:"THPT",     soHocSinh:980,  soLicenseCapPhat:900,  soLicenseDaDung:754, ngayKichHoat:"03/01/2025", trangThai:"Đang dùng",      soMonDaHoc:9,  soTietDaHoc:2410, tiLeHoanThanh:55 },
    { id:"dv3", tenDonVi:"Trường THPT Phan Châu Trinh", tinhThanh:"Đà Nẵng",         capHoc:"THPT",     soHocSinh:760,  soLicenseCapPhat:700,  soLicenseDaDung:142, ngayKichHoat:"15/02/2025", trangThai:"Đang dùng",      soMonDaHoc:4,  soTietDaHoc:620,  tiLeHoanThanh:18 },
  ],
  "6": [
    { id:"dv1", tenDonVi:"Trường THPT Lê Quý Đôn",     tinhThanh:"TP. Hồ Chí Minh", capHoc:"THPT",     soHocSinh:560,  soLicenseCapPhat:500,  soLicenseDaDung:467, ngayKichHoat:"20/01/2025", trangThai:"Đang dùng",      soMonDaHoc:5,  soTietDaHoc:1340, tiLeHoanThanh:79 },
    { id:"dv2", tenDonVi:"Trường THPT Chu Văn An",     tinhThanh:"Hà Nội",           capHoc:"THPT",     soHocSinh:420,  soLicenseCapPhat:400,  soLicenseDaDung:0,   ngayKichHoat:"—",          trangThai:"Chưa kích hoạt", soMonDaHoc:0,  soTietDaHoc:0,    tiLeHoanThanh:0  },
  ],
  "7": [
    { id:"dv1", tenDonVi:"Trường THCS Châu Văn Liêm",  tinhThanh:"Cần Thơ",          capHoc:"THCS",     soHocSinh:340,  soLicenseCapPhat:320,  soLicenseDaDung:284, ngayKichHoat:"05/02/2025", trangThai:"Hết hạn",        soMonDaHoc:5,  soTietDaHoc:670,  tiLeHoanThanh:52 },
  ],
  "8": [
    { id:"dv1", tenDonVi:"Trường THPT Chu Văn An",     tinhThanh:"Hà Nội",           capHoc:"THPT",     soHocSinh:420,  soLicenseCapPhat:400,  soLicenseDaDung:388, ngayKichHoat:"01/01/2025", trangThai:"Đang dùng",      soMonDaHoc:10, soTietDaHoc:1820, tiLeHoanThanh:88 },
    { id:"dv2", tenDonVi:"Trường THPT Thái Phiên",     tinhThanh:"Hải Phòng",        capHoc:"THPT",     soHocSinh:280,  soLicenseCapPhat:250,  soLicenseDaDung:198, ngayKichHoat:"10/01/2025", trangThai:"Hết hạn",        soMonDaHoc:8,  soTietDaHoc:940,  tiLeHoanThanh:42 },
  ],
  "9": [
    { id:"dv1", tenDonVi:"Trường THPT Chu Văn An",     tinhThanh:"Hà Nội",           capHoc:"THPT",     soHocSinh:350,  soLicenseCapPhat:320,  soLicenseDaDung:301, ngayKichHoat:"15/02/2025", trangThai:"Đang dùng",      soMonDaHoc:5,  soTietDaHoc:1540, tiLeHoanThanh:91 },
    { id:"dv2", tenDonVi:"Trường THPT Phan Châu Trinh", tinhThanh:"Đà Nẵng",         capHoc:"THPT",     soHocSinh:290,  soLicenseCapPhat:280,  soLicenseDaDung:254, ngayKichHoat:"15/02/2025", trangThai:"Đang dùng",      soMonDaHoc:5,  soTietDaHoc:1280, tiLeHoanThanh:86 },
  ],
  "10": [
    { id:"dv1", tenDonVi:"Trường THPT Phan Châu Trinh", tinhThanh:"Đà Nẵng",         capHoc:"THPT",     soHocSinh:180,  soLicenseCapPhat:150,  soLicenseDaDung:0,   ngayKichHoat:"—",          trangThai:"Chưa kích hoạt", soMonDaHoc:0,  soTietDaHoc:0,    tiLeHoanThanh:0  },
  ],
};

const DU_LIEU_GOI_CUOC: GoiCuoc[] = [
  { id: "1",  tenGoi: "Toàn diện Tiểu học",          maBCSS: "BCCS-TH-001",  phanLoai: "", loaiGia: "dong-gia", giaFrom: 200000,  giaTo: 200000,  thoiLuongThuNghiem: 7,  thoiLuongSuDung: 12, chuongTrinhIds: ["toan","nvan","ta","sinh","tin"], monHocIds: ["01","02","03","04","08","09","13"], quotaToiDa: 5000,  soGoiNoiDungDaDung: 2, trangThai: "Đang hoạt động", ghiChu: "Gói toàn diện cho cấp Tiểu học.",             ngayTao: "01/01/2025", donViGan: MOCK_DON_VI_GAN["1"] },
  { id: "2",  tenGoi: "Cơ bản THCS",                 maBCSS: "BCCS-TC-001",  phanLoai: "", loaiGia: "dong-gia", giaFrom: 250000,  giaTo: 250000,  thoiLuongThuNghiem: 7,  thoiLuongSuDung: 12, chuongTrinhIds: ["toan","nvan","ta"],               monHocIds: ["01","18","08"], quotaToiDa: 4000,  soGoiNoiDungDaDung: 1, trangThai: "Đang hoạt động", ghiChu: "Gói 3 môn nền tảng dành cho học sinh THCS.", ngayTao: "01/01/2025", donViGan: MOCK_DON_VI_GAN["2"] },
  { id: "3",  tenGoi: "Khoa học TN THCS",            maBCSS: "BCCS-TC-002",  phanLoai: "", loaiGia: "khac-gia", giaFrom: 200000,  giaTo: 280000,  thoiLuongThuNghiem: 0,  thoiLuongSuDung: 12, chuongTrinhIds: ["toan","ly","hoa","sinh"],         monHocIds: ["01","17","16","15"], quotaToiDa: 3000,  soGoiNoiDungDaDung: 1, trangThai: "Đang hoạt động", ghiChu: "Nhóm môn KHTN khác giá theo khối lớp.",     ngayTao: "15/01/2025", donViGan: MOCK_DON_VI_GAN["3"] },
  { id: "4",  tenGoi: "Trải nghiệm Miễn phí",        maBCSS: "BCCS-FREE-001",phanLoai: "", loaiGia: "free",     giaFrom: 0,       giaTo: 0,       thoiLuongThuNghiem: 15, thoiLuongSuDung: 1,  chuongTrinhIds: ["toan","nvan"],                   monHocIds: ["01","02"], quotaToiDa: 99999, soGoiNoiDungDaDung: 1, trangThai: "Đang hoạt động", ghiChu: "Gói dùng thử miễn phí, không giới hạn.",    ngayTao: "01/02/2025", donViGan: MOCK_DON_VI_GAN["4"] },
  { id: "5",  tenGoi: "Toàn diện K12",               maBCSS: "BCCS-K12-001", phanLoai: "", loaiGia: "dong-gia", giaFrom: 500000,  giaTo: 500000,  thoiLuongThuNghiem: 7,  thoiLuongSuDung: 12, chuongTrinhIds: ["toan","ly","hoa","sinh","tin","nvan","su","dia","gdcd","ta","am"], monHocIds: ["01","17","16","15","09","18","12","14","19","08","06"], quotaToiDa: 3000, soGoiNoiDungDaDung: 3, trangThai: "Đang hoạt động", ghiChu: "Gói toàn diện tất cả 11 môn K12.",           ngayTao: "01/01/2025", donViGan: MOCK_DON_VI_GAN["5"] },
  { id: "6",  tenGoi: "Khoa học TN Nâng cao",        maBCSS: "BCCS-TP-002",  phanLoai: "", loaiGia: "dong-gia", giaFrom: 550000,  giaTo: 550000,  thoiLuongThuNghiem: 7,  thoiLuongSuDung: 12, chuongTrinhIds: ["toan","ly","hoa","sinh","tin"],   monHocIds: ["01","17","16","15","09"], quotaToiDa: 2500,  soGoiNoiDungDaDung: 2, trangThai: "Đang hoạt động", ghiChu: "KHTN nâng cao với bài tập mở rộng.",         ngayTao: "15/01/2025", donViGan: MOCK_DON_VI_GAN["6"] },
  { id: "7",  tenGoi: "Xã hội & Ngoại ngữ",          maBCSS: "BCCS-TC-003",  phanLoai: "", loaiGia: "khac-gia", giaFrom: 400000,  giaTo: 550000,  thoiLuongThuNghiem: 0,  thoiLuongSuDung: 12, chuongTrinhIds: ["nvan","su","dia","gdcd","ta"],    monHocIds: [], quotaToiDa: 2000,  soGoiNoiDungDaDung: 0, trangThai: "Tạm dừng",       ghiChu: "Tạm dừng do cập nhật nội dung chương trình.", ngayTao: "01/02/2025", donViGan: MOCK_DON_VI_GAN["7"] },
  { id: "8",  tenGoi: "Chuyên sâu Luyện thi Toàn diện", maBCSS: "BCCS-TP-001",phanLoai: "", loaiGia: "dong-gia", giaFrom: 1000000, giaTo: 1000000, thoiLuongThuNghiem: 10, thoiLuongSuDung: 12, chuongTrinhIds: ["toan","ly","hoa","sinh","tin","nvan","su","dia","gdcd","ta"], monHocIds: ["01","17","16","15","09","18","12","14","19","08"], quotaToiDa: 1500, soGoiNoiDungDaDung: 1, trangThai: "Đang hoạt động", ghiChu: "Gói chuyên sâu luyện thi toàn diện 10 môn.", ngayTao: "01/01/2025", donViGan: MOCK_DON_VI_GAN["8"] },
  { id: "9",  tenGoi: "Luyện thi THPTQG",            maBCSS: "BCCS-TP-001",  phanLoai: "", loaiGia: "dong-gia", giaFrom: 1200000, giaTo: 1200000, thoiLuongThuNghiem: 0,  thoiLuongSuDung: 6,  chuongTrinhIds: ["toan","ly","hoa","nvan","ta"],    monHocIds: ["01","17","16","18","08"], quotaToiDa: 1000,  soGoiNoiDungDaDung: 1, trangThai: "Đang hoạt động", ghiChu: "5 môn thi THPTQG với mô phỏng đề thi AI.",  ngayTao: "15/02/2025", donViGan: MOCK_DON_VI_GAN["9"] },
  { id: "10", tenGoi: "Chuyên Toán Lý Hóa",          maBCSS: "BCCS-TP-003",  phanLoai: "", loaiGia: "khac-gia", giaFrom: 800000,  giaTo: 1500000, thoiLuongThuNghiem: 0,  thoiLuongSuDung: 6,  chuongTrinhIds: ["toan","ly","hoa"],               monHocIds: [], quotaToiDa: 800,   soGoiNoiDungDaDung: 0, trangThai: "Tạm dừng",       ghiChu: "Tạm dừng chờ cập nhật nội dung lớp 10-12.",  ngayTao: "01/03/2025", donViGan: MOCK_DON_VI_GAN["10"] },
];

// ── MÔN HỌC K12HOME ──────────────────────────────────────────────────────────

interface MonHocK12 {
  id: string;   // = ma
  ten: string;
  ma: string;   // "01", "02", ...
  khoiLop: string[]; // "1"–"12", "GDTX", "Mẫu giáo"
}

const DS_MON_HOC_K12: MonHocK12[] = [
  { id:"01", ten:"Toán",                  ma:"01", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12","GDTX"] },
  { id:"02", ten:"Tiếng Việt",            ma:"02", khoiLop:["1","2","3","4","5"] },
  { id:"03", ten:"Đạo đức",              ma:"03", khoiLop:["1","2","3","4","5"] },
  { id:"04", ten:"Tự nhiên và Xã hội",   ma:"04", khoiLop:["1","2","3"] },
  { id:"05", ten:"Lịch sử và Địa lí",    ma:"05", khoiLop:["4","5","6","7","8","9"] },
  { id:"06", ten:"Âm nhạc",              ma:"06", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12"] },
  { id:"07", ten:"Mĩ thuật",             ma:"07", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12"] },
  { id:"08", ten:"Tiếng Anh",            ma:"08", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12","Mẫu giáo","GDTX"] },
  { id:"09", ten:"Tin học",              ma:"09", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12","GDTX"] },
  { id:"10", ten:"Công nghệ",            ma:"10", khoiLop:["3","4","5","6","7","8","9","10","11","12","GDTX"] },
  { id:"11", ten:"Thể dục",              ma:"11", khoiLop:["1","2","3","4","5","6","7","8","9","10","11","12","GDTX"] },
  { id:"12", ten:"Lịch sử",              ma:"12", khoiLop:["6","7","8","9","10","11","12","GDTX"] },
  { id:"13", ten:"Khoa học",             ma:"13", khoiLop:["4","5"] },
  { id:"14", ten:"Địa lí",               ma:"14", khoiLop:["6","7","8","9","10","11","12","GDTX"] },
  { id:"15", ten:"Sinh học",             ma:"15", khoiLop:["6","7","8","9","10","11","12","GDTX"] },
  { id:"16", ten:"Hóa học",              ma:"16", khoiLop:["8","9","10","11","12","GDTX"] },
  { id:"17", ten:"Vật lí",               ma:"17", khoiLop:["6","7","8","9","10","11","12","GDTX"] },
  { id:"18", ten:"Ngữ văn",              ma:"18", khoiLop:["6","7","8","9","10","11","12","GDTX"] },
  { id:"19", ten:"GDCD / GDKTPL",        ma:"19", khoiLop:["6","7","8","9","10","11","12"] },
];

// ── TIỆN ÍCH ─────────────────────────────────────────────────────────────────

const fmt      = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n: number) => n >= 1000000 ? `${(n/1e6).toFixed(n%1e6===0?0:1)}tr` : n >= 1000 ? `${Math.round(n/1000)}k` : n === 0 ? "0đ" : String(n);

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: "success"|"error"|"info"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  const c = { success:"#0F766E", error:"#D4183D", info:"#005CB6" }[type];
  return (
    <div className="fixed top-5 right-5 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl"
      style={{ background:"#fff", border:`1.5px solid ${c}40`, boxShadow:"0 8px 32px rgba(0,0,0,0.14)", animation:"toastSlide 0.32s cubic-bezier(0.34,1.56,0.64,1)", maxWidth:400, fontFamily:"'Be Vietnam Pro',sans-serif" }}>
      {type==="success" ? <CheckCircle size={16} color={c}/> : type==="error" ? <AlertCircle size={16} color={c}/> : <Info size={16} color={c}/>}
      <span style={{ fontSize:"0.84rem", fontWeight:600, color:"#1E293B" }}>{msg}</span>
    </div>
  );
}

// ── BADGES ────────────────────────────────────────────────────────────────────

function PhanLoaiBadge({ pl }: { pl: string }) {
  if (!pl) return <span style={{ color:"#CBD5E1", fontSize:"0.72rem" }}>—</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background:"rgba(0,92,182,0.07)", border:"1px solid rgba(0,92,182,0.18)", fontSize:"0.72rem", fontWeight:700, color:"#005CB6" }}>{pl}</span>;
}
function LoaiGiaBadge({ lg }: { lg: LoaiGia }) {
  const c = LG_CFG[lg]; const Icon = c.icon;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background:c.bg, border:`1px solid ${c.border}`, fontSize:"0.72rem", fontWeight:700, color:c.color }}><Icon size={10}/>{c.label}</span>;
}
function TrangThaiBadge({ ts }: { ts: TrangThai }) {
  const c = TS_CFG[ts];
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background:c.bg, fontSize:"0.72rem", fontWeight:700, color:c.color }}><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:c.dot }}/>{ts}</span>;
}

function HienThiGia({ goi }: { goi: GoiCuoc }) {
  if (goi.loaiGia === "free") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background:"rgba(15,118,110,0.08)", fontSize:"0.78rem", fontWeight:800, color:"#0F766E" }}>Miễn phí</span>;
  if (goi.loaiGia === "khac-gia") return <div><div style={{ fontSize:"0.82rem", fontWeight:800, color:"#0F172A" }}>{fmtShort(goi.giaFrom)} – {fmtShort(goi.giaTo)}</div><div style={{ fontSize:"0.62rem", color:"#94A3B8" }}>theo khối</div></div>;
  return <div><div style={{ fontSize:"0.82rem", fontWeight:800, color:"#005CB6" }}>{fmtShort(goi.giaFrom)}</div><div style={{ fontSize:"0.62rem", color:"#94A3B8" }}>đồng giá</div></div>;
}

function ChuongTrinhTags({ ids, maxShow=4 }: { ids: string[]; maxShow?: number }) {
  const cts = ids.map(id => DS_CHUONG_TRINH.find(c => c.id===id)).filter(Boolean) as ChuongTrinh[];
  if (!cts.length) return <span style={{ color:"#94A3B8", fontSize:"0.72rem" }}>—</span>;
  if (cts.length === DS_CHUONG_TRINH.length) return <span className="px-2 py-0.5 rounded-lg" style={{ background:"rgba(0,92,182,0.07)", fontSize:"0.68rem", fontWeight:700, color:"#005CB6" }}>Tất cả {DS_CHUONG_TRINH.length} môn</span>;
  const shown = cts.slice(0, maxShow); const rest = cts.length - maxShow;
  return <div className="flex flex-wrap gap-1">{shown.map(ct => { const n = NHOM_CFG[ct.nhom]; return <span key={ct.id} className="px-1.5 py-0.5 rounded" style={{ background:n.bg, fontSize:"0.63rem", fontWeight:700, color:n.color }}>{ct.kyHieu}</span>; })}{rest>0 && <span className="px-1.5 py-0.5 rounded" style={{ background:"#F1F5F9", fontSize:"0.63rem", fontWeight:700, color:"#64748B" }}>+{rest}</span>}</div>;
}



// ─��� PICKER CHƯƠNG TRÌNH ───────────────────────────────────────────────────────

function ChuongTrinhPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => value.includes(id) ? onChange(value.filter(v=>v!==id)) : onChange([...value,id]);
  const toggleNhom = (nhom: string) => {
    const ids = DS_CHUONG_TRINH.filter(c=>c.nhom===nhom).map(c=>c.id);
    const allIn = ids.every(id=>value.includes(id));
    if (allIn) onChange(value.filter(v=>!ids.includes(v)));
    else onChange([...new Set([...value,...ids])]);
  };
  const allIds = DS_CHUONG_TRINH.map(c=>c.id);
  const toggleAll = () => value.length===allIds.length ? onChange([]) : onChange(allIds);

  return (
    <div className="space-y-2">
      <button type="button" onClick={toggleAll}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors"
        style={{ background: value.length===allIds.length ? "rgba(0,92,182,0.07)" : "#F8FAFB", border:`1.5px solid ${value.length===allIds.length ? "rgba(0,92,182,0.22)" : "#EEF0F4"}`, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
        <div style={{ width:18, height:18, borderRadius:5, background: value.length===allIds.length ? "#005CB6" : "transparent", border:`2px solid ${value.length>0?"#005CB6":"#CBD5E1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {value.length===allIds.length && <Check size={11} color="#fff" strokeWidth={3}/>}
          {value.length>0 && value.length<allIds.length && <div style={{ width:8,height:2,background:"#005CB6",borderRadius:2 }}/>}
        </div>
        <span style={{ fontSize:"0.8rem", fontWeight:700, color: value.length>0?"#005CB6":"#374151" }}>Tất cả môn học</span>
        <span className="ml-auto px-2 py-0.5 rounded-full" style={{ background:"rgba(0,92,182,0.08)", fontSize:"0.62rem", fontWeight:800, color:"#005CB6" }}>{value.length}/{allIds.length}</span>
      </button>
      {Object.keys(NHOM_CFG).map(nhom => {
        const cfg = NHOM_CFG[nhom]; const NIcon = cfg.icon;
        const cts = DS_CHUONG_TRINH.filter(c=>c.nhom===nhom);
        const allIn = cts.every(c=>value.includes(c.id));
        const someIn = cts.some(c=>value.includes(c.id)) && !allIn;
        return (
          <div key={nhom} className="rounded-xl overflow-hidden" style={{ border:"1.5px solid #EEF0F4" }}>
            <button type="button" onClick={() => toggleNhom(nhom)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors"
              style={{ background: allIn ? cfg.bg : someIn ? `${cfg.bg}70` : "#F8FAFB", border:"none", cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              <div style={{ width:18, height:18, borderRadius:5, background: allIn?cfg.color:"transparent", border:`2px solid ${allIn||someIn?cfg.color:"#CBD5E1"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {allIn && <Check size={11} color="#fff" strokeWidth={3}/>}
                {someIn && <div style={{ width:8,height:2,background:cfg.color,borderRadius:2 }}/>}
              </div>
              <NIcon size={14} color={allIn||someIn?cfg.color:"#94A3B8"}/>
              <span style={{ fontSize:"0.79rem", fontWeight:700, color: allIn||someIn?cfg.color:"#374151" }}>{cfg.label}</span>
              <span className="ml-auto px-2 py-0.5 rounded-full" style={{ background:cfg.bg, fontSize:"0.62rem", fontWeight:800, color:cfg.color }}>{cts.filter(c=>value.includes(c.id)).length}/{cts.length}</span>
            </button>
            <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-2" style={{ background:"#fff" }}>
              {cts.map(ct => {
                const sel = value.includes(ct.id);
                return (
                  <button key={ct.id} type="button" onClick={()=>toggle(ct.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
                    style={{ background: sel?cfg.bg:"#F8FAFB", border:`1.5px solid ${sel?cfg.color:"#E2E8F0"}`, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
                    <div style={{ width:14, height:14, borderRadius:4, background: sel?cfg.color:"transparent", border:`1.5px solid ${sel?cfg.color:"#CBD5E1"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {sel && <Check size={9} color="#fff" strokeWidth={3}/>}
                    </div>
                    <span style={{ fontSize:"0.74rem", fontWeight: sel?700:500, color: sel?cfg.color:"#374151" }}>{ct.ten}</span>
                    <span className="px-1 rounded" style={{ fontSize:"0.58rem", fontWeight:800, background: sel?cfg.color:"#E2E8F0", color: sel?"#fff":"#94A3B8" }}>{ct.kyHieu}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── LỚP SELECTOR ─────────────────────────────────────────────────────────────

function LopSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const caps: CapHoc[] = ["tieuhoc", "thcs", "thpt"];
  const toggle = (id: string) =>
    value.includes(id) ? onChange(value.filter(v => v !== id)) : onChange([...value, id]);
  const toggleCap = (cap: CapHoc) => {
    const ids = DS_LOP.filter(l => l.cap === cap).map(l => l.id);
    const allIn = ids.every(id => value.includes(id));
    allIn ? onChange(value.filter(v => !ids.includes(v))) : onChange([...new Set([...value, ...ids])]);
  };
  const toggleAll = () => value.length === 12 ? onChange([]) : onChange(DS_LOP.map(l => l.id));

  return (
    <div className="space-y-3">
      {/* Chọn tất cả */}
      <button type="button" onClick={toggleAll}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors"
        style={{ background: value.length === 12 ? "rgba(0,92,182,0.07)" : "#F8FAFB", border: `1.5px solid ${value.length === 12 ? "rgba(0,92,182,0.22)" : "#EEF0F4"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: value.length === 12 ? "#005CB6" : "transparent", border: `2px solid ${value.length > 0 ? "#005CB6" : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {value.length === 12 && <Check size={10} color="#fff" strokeWidth={3} />}
          {value.length > 0 && value.length < 12 && <div style={{ width: 6, height: 2, background: "#005CB6", borderRadius: 2 }} />}
        </div>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: value.length > 0 ? "#005CB6" : "#374151" }}>Tất cả khối lớp (1–12)</span>
        <span className="ml-auto px-2 py-0.5 rounded-full" style={{ background: "rgba(0,92,182,0.08)", fontSize: "0.62rem", fontWeight: 800, color: "#005CB6" }}>{value.length}/12</span>
      </button>

      {/* Nút chọn nhanh theo cấp */}
      <div className="grid grid-cols-3 gap-2">
        {caps.map(cap => {
          const cfg = CAP_CFG[cap];
          const lopsCap = DS_LOP.filter(l => l.cap === cap);
          const allIn  = lopsCap.every(l => value.includes(l.id));
          const someIn = lopsCap.some(l => value.includes(l.id)) && !allIn;
          const count  = lopsCap.filter(l => value.includes(l.id)).length;
          return (
            <button key={cap} type="button" onClick={() => toggleCap(cap)}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all"
              style={{ background: allIn ? cfg.bg : someIn ? `${cfg.bg}80` : "#F8FAFB", border: `1.5px solid ${allIn || someIn ? cfg.color : "#E2E8F0"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: allIn ? cfg.color : "transparent", border: `2px solid ${allIn || someIn ? cfg.color : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {allIn && <Check size={9} color="#fff" strokeWidth={3} />}
                {someIn && <div style={{ width: 6, height: 2, background: cfg.color, borderRadius: 2 }} />}
              </div>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: allIn || someIn ? cfg.color : "#374151" }}>{cfg.label}</span>
              <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>Khối {cfg.range}</span>
              <span className="px-2 py-0.5 rounded-full" style={{ background: allIn || someIn ? cfg.bg : "#F1F5F9", fontSize: "0.6rem", fontWeight: 800, color: allIn || someIn ? cfg.color : "#94A3B8" }}>{count}/{lopsCap.length}</span>
            </button>
          );
        })}
      </div>

      {/* Grid checkbox từng lớp */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #EEF0F4" }}>
        {caps.map((cap, ci) => {
          const cfg = CAP_CFG[cap];
          const lopsCap = DS_LOP.filter(l => l.cap === cap);
          return (
            <div key={cap} style={{ borderTop: ci > 0 ? "1px solid #EEF0F4" : "none" }}>
              <div className="flex items-center gap-2 px-3.5 py-2" style={{ background: cfg.bg }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: cfg.color, letterSpacing: "0.03em" }}>
                  {cfg.label} · Khối {cfg.range}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-2.5" style={{ background: "#fff" }}>
                {lopsCap.map(lop => {
                  const sel = value.includes(lop.id);
                  return (
                    <button key={lop.id} type="button" onClick={() => toggle(lop.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
                      style={{ background: sel ? cfg.bg : "#F8FAFB", border: `1.5px solid ${sel ? cfg.color : "#E2E8F0"}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro',sans-serif", minWidth: 72 }}>
                      <div style={{ width: 13, height: 13, borderRadius: 3, background: sel ? cfg.color : "transparent", border: `1.5px solid ${sel ? cfg.color : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {sel && <Check size={8} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: "0.76rem", fontWeight: sel ? 700 : 500, color: sel ? cfg.color : "#374151" }}>{lop.ten}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FORM STATE ────────────────────────────────────────────────────────────────

interface KhacGiaEntry { giaGoc: string; giaBan: string; }

interface FormState {
  ctHocIds: string[];              // Chương trình học liên kết
  tenGoi: string;
  phanLoai: string;
  thoiLuongThuNghiem: string;
  thoiLuongSuDung: string;
  sdStart: string;                 // Ngày bắt đầu gói cước (DD/MM/YYYY)
  sdEnd: string;                   // Ngày kết thúc gói cước (DD/MM/YYYY)
  tnStart: string;                 // Ngày bắt đầu dùng thử (DD/MM/YYYY)
  tnEnd: string;                   // Ngày kết thúc dùng thử (DD/MM/YYYY)
  // step 2
  maBCSS: string;
  lopIds: string[];                               // Lớp được áp dụng
  loaiGia: LoaiGia;
  giaGoc: string;                                 // Giá gốc (Đồng giá)
  giaFrom: string;                                // Giá bán (Đồng giá) hoặc min (Khác giá)
  giaTo: string;                                  // max (Khác giá, computed)
  khacGiaData: Record<string, KhacGiaEntry>;      // Per-class prices (Khác giá)
  quotaToiDa: string;
  trangThai: TrangThai;
  ghiChu: string;
  // step 3
  chuongTrinhIds: string[];
  monHocIds: string[];          // K12 subject IDs linked to this package
  gioiHanMonHoc: string;        // Số môn tối đa học sinh được chọn
}

const FORM_RONG: FormState = {
  ctHocIds: [],
  tenGoi: "", phanLoai: "", thoiLuongThuNghiem: "7", thoiLuongSuDung: "12",
  sdStart: "", sdEnd: "", tnStart: "", tnEnd: "",
  maBCSS: "", lopIds: [], loaiGia: "dong-gia",
  giaGoc: "", giaFrom: "", giaTo: "",
  khacGiaData: {}, quotaToiDa: "1000", trangThai: "Đang hoạt động", ghiChu: "",
  chuongTrinhIds: [],
  monHocIds: [],
  gioiHanMonHoc: "",
};

// ── STEP INDICATOR ────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Thông tin chung",         icon: Tags        },
  { label: "Cấu hình giá & đối tượng", icon: DollarSign  },
  { label: "Danh sách Môn học",        icon: BookOpen    },
];

// ── DATE RANGE PICKER ──────────────────────────────────────────────────────────

const MONTH_VI = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const DAY_VI   = ["T2","T3","T4","T5","T6","T7","CN"];

function parseDMY(s: string): Date | null {
  if (!s) return null;
  const [d, m, y] = s.split("/").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}
function fmtDMY(d: Date): string {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

function CalendarMonth({
  year, month, onMonthChange, onYearChange,
  start, end, hovered,
  onDayClick, onDayHover,
  showNavLeft, showNavRight, onNavLeft, onNavRight,
}: {
  year: number; month: number;
  onMonthChange: (m: number) => void; onYearChange: (y: number) => void;
  start: Date|null; end: Date|null; hovered: Date|null;
  onDayClick: (d: Date) => void; onDayHover: (d: Date|null) => void;
  showNavLeft: boolean; showNavRight: boolean;
  onNavLeft: () => void; onNavRight: () => void;
}) {
  const PRIMARY = "#005CB6";
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });

  const rangeEnd = end ?? hovered;
  const lo = start && rangeEnd ? (start <= rangeEnd ? start : rangeEnd) : null;
  const hi = start && rangeEnd ? (start <= rangeEnd ? rangeEnd : start) : null;

  return (
    <div style={{ width: 220 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 8 }}>
        {showNavLeft
          ? <button onClick={onNavLeft} style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 6px", fontSize:14, color:"#374151" }}>{"<"}</button>
          : <span style={{ width: 28 }} />}
        <div style={{ display:"flex", gap: 4 }}>
          <select value={month} onChange={e => onMonthChange(Number(e.target.value))}
            style={{ fontSize:"0.72rem", fontWeight:700, border:"1px solid #e2e8f0", borderRadius:4, padding:"2px 4px", cursor:"pointer" }}>
            {MONTH_VI.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => onYearChange(Number(e.target.value))}
            style={{ fontSize:"0.72rem", fontWeight:700, border:"1px solid #e2e8f0", borderRadius:4, padding:"2px 4px", cursor:"pointer" }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {showNavRight
          ? <button onClick={onNavRight} style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 6px", fontSize:14, color:"#374151" }}>{">"}</button>
          : <span style={{ width: 28 }} />}
      </div>
      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center", marginBottom:2 }}>
        {DAY_VI.map(d => <div key={d} style={{ fontSize:"0.65rem", fontWeight:700, color:"#94A3B8", padding:"2px 0" }}>{d}</div>)}
      </div>
      {/* Cells */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
        {cells.map((c, i) => {
          const isStart = start && c.date.toDateString() === start.toDateString();
          const isEnd   = end   && c.date.toDateString() === end.toDateString();
          const inRange = lo && hi && c.date > lo && c.date < hi;
          const today   = c.date.toDateString() === new Date().toDateString();
          return (
            <div key={i}
              onClick={() => c.current && onDayClick(c.date)}
              onMouseEnter={() => c.current && onDayHover(c.date)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                textAlign:"center", padding:"4px 0", fontSize:"0.72rem", cursor: c.current ? "pointer" : "default",
                color: !c.current ? "#CBD5E1" : (isStart || isEnd) ? "#fff" : today ? PRIMARY : "#1e293b",
                fontWeight: (isStart || isEnd || today) ? 700 : 400,
                background: (isStart || isEnd) ? PRIMARY : inRange ? "rgba(0,92,182,0.1)" : "transparent",
                borderRadius: isStart ? "50% 0 0 50%" : isEnd ? "0 50% 50% 0" : 0,
                ...(isStart && isEnd ? { borderRadius:"50%" } : {}),
              }}
            >
              <span style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                width: 24, height: 24, borderRadius:"50%",
                border: today && !isStart && !isEnd ? `1.5px solid ${PRIMARY}` : "none",
              }}>
                {c.date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DateRangePicker({
  label, required,
  startValue, endValue,
  onStartChange, onEndChange,
  error,
}: {
  label: string; required?: boolean;
  startValue: string; endValue: string;
  onStartChange: (v: string) => void; onEndChange: (v: string) => void;
  error?: string;
}) {
  const PRIMARY = "#005CB6";
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<"start"|"end">("start");
  const [hovered, setHovered] = useState<Date|null>(null);
  const now = new Date();
  const [leftYear,  setLeftYear]  = useState(now.getFullYear());
  const [leftMonth, setLeftMonth] = useState(now.getMonth());
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear  = leftMonth === 11 ? leftYear + 1 : leftYear;

  const start = parseDMY(startValue);
  const end   = parseDMY(endValue);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !dropRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const handleDayClick = (d: Date) => {
    if (selecting === "start" || !start) {
      onStartChange(fmtDMY(d));
      onEndChange("");
      setSelecting("end");
    } else {
      if (d < start) { onStartChange(fmtDMY(d)); onEndChange(""); setSelecting("end"); }
      else { onEndChange(fmtDMY(d)); setSelecting("start"); setOpen(false); setHovered(null); }
    }
  };

  const navLeft  = () => { if (leftMonth === 0) { setLeftMonth(11); setLeftYear(y => y-1); } else setLeftMonth(m => m-1); };
  const navRight = () => { if (leftMonth === 11) { setLeftMonth(0); setLeftYear(y => y+1); } else setLeftMonth(m => m+1); };

  const display = startValue && endValue ? `${startValue} → ${endValue}` : startValue ? `${startValue} → ...` : "";

  return (
    <div>
      <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
        <Calendar size={11} style={{ display:"inline", marginRight:4, verticalAlign:"middle" }}/>
        {label} {required && <span style={{ color:"#D4183D" }}>*</span>}
      </label>
      <div ref={triggerRef} className="relative">
        <input
          readOnly
          value={display}
          onClick={() => { setOpen(o => !o); }}
          placeholder="Chọn khoảng thời gian..."
          style={{
            width:"100%", padding:"10px 40px 10px 12px", borderRadius:8,
            border:`1.5px solid ${error ? "#D4183D" : open ? PRIMARY : "#d1d5db"}`,
            fontSize:"0.8rem", cursor:"pointer", boxSizing:"border-box",
            background:"#fff", outline:"none", color: display ? "#1e293b" : "#94A3B8",
          }}
        />
        <Calendar size={14} color="#94A3B8" style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
      </div>
      {error && <div className="flex items-center gap-1 mt-1"><AlertCircle size={11} color="#D4183D"/><p style={{ fontSize:"0.67rem", color:"#D4183D", fontWeight:600 }}>{error}</p></div>}

      {/* Dropdown calendar – position:fixed để không bị clip */}
      {open && (() => {
        const rect = triggerRef.current?.getBoundingClientRect();
        const POPUP_H = 320;
        const spaceBelow = rect ? window.innerHeight - rect.bottom : 0;
        const openUp = spaceBelow < POPUP_H + 8;
        return (
          <div ref={dropRef} style={{
            position:"fixed",
            ...(openUp
              ? { bottom: rect ? window.innerHeight - rect.top + 4 : 0 }
              : { top: rect ? rect.bottom + 4 : 0 }),
            left: rect ? Math.min(rect.left, window.innerWidth - 490) : 0,
            zIndex: 3000,
            background:"#fff",
            border:"1.5px solid #e2e8f0",
            borderRadius:12,
            boxShadow:"0 12px 40px rgba(0,0,0,0.15)",
            padding:16,
          }}>
            <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>
              <CalendarMonth
                year={leftYear} month={leftMonth}
                onMonthChange={m => { setLeftMonth(m); }} onYearChange={y => setLeftYear(y)}
                start={start} end={end} hovered={hovered}
                onDayClick={handleDayClick} onDayHover={setHovered}
                showNavLeft showNavRight={false} onNavLeft={navLeft} onNavRight={navRight}
              />
              <CalendarMonth
                year={rightYear} month={rightMonth}
                onMonthChange={m => { setLeftMonth(m === 0 ? 11 : m - 1); if (m === 0) setLeftYear(y => y - 1); }}
                onYearChange={y => setLeftYear(y)}
                start={start} end={end} hovered={hovered}
                onDayClick={handleDayClick} onDayHover={setHovered}
                showNavLeft={false} showNavRight onNavLeft={navLeft} onNavRight={navRight}
              />
            </div>
            <div style={{ marginTop:10, fontSize:"0.7rem", color:"#94A3B8", textAlign:"center" }}>
              {selecting === "start" ? "Chọn ngày bắt đầu" : "Chọn ngày kết thúc"}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Chọn Chương trình học (multi-select từ ChuongTrinhHocPage) ────────────────

function CtHocPicker({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = useState("");
  const filtered = DS_CHUONG_TRINH_HOC_PAGE.filter(ct =>
    ct.tenChuongTrinh.toLowerCase().includes(search.toLowerCase()) ||
    ct.maChuongTrinh.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id]);

  const selectedItems = DS_CHUONG_TRINH_HOC_PAGE.filter(ct => value.includes(ct.id));

  return (
    <div>
      {/* Selected chips */}
      {selectedItems.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"10px 12px", borderBottom:"1px solid #E2E8F0", background:"#F8FAFC" }}>
          {selectedItems.map(ct => (
            <span key={ct.id} style={{
              display:"inline-flex", alignItems:"center", gap:5,
              padding:"3px 10px", borderRadius:20,
              background:"rgba(0,92,182,0.08)", border:"1px solid rgba(0,92,182,0.22)",
              fontSize:"0.75rem", fontWeight:600, color:"#005CB6",
            }}>
              {ct.tenChuongTrinh}
              <span
                onClick={() => toggle(ct.id)}
                style={{ cursor:"pointer", display:"flex", alignItems:"center", opacity:0.7 }}
              >
                <X size={11} />
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom:"1px solid #E2E8F0" }}>
        <Search size={13} color="#94A3B8" style={{ flexShrink:0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm chương trình học..."
          style={{ flex:1, border:"none", outline:"none", fontSize:"0.78rem", background:"transparent", fontFamily:"inherit", color:"#374151" }}
        />
        {search && <X size={12} color="#94A3B8" style={{ cursor:"pointer" }} onClick={() => setSearch("")} />}
      </div>

      {/* List */}
      <div style={{ maxHeight:200, overflowY:"auto" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"20px 12px", textAlign:"center", fontSize:"0.75rem", color:"#94A3B8" }}>
            Không tìm thấy chương trình nào
          </div>
        ) : filtered.map((ct, idx) => {
          const sel = value.includes(ct.id);
          return (
            <div
              key={ct.id}
              onClick={() => toggle(ct.id)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderTop: idx > 0 ? "1px solid #F1F5F9" : "none",
                background: sel ? "rgba(0,92,182,0.04)" : "transparent",
                cursor:"pointer", transition:"background 0.12s",
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#F8FAFC"; }}
              onMouseLeave={e => { e.currentTarget.style.background = sel ? "rgba(0,92,182,0.04)" : "transparent"; }}
            >
              {/* Checkbox */}
              <div style={{
                width:16, height:16, borderRadius:4, flexShrink:0,
                border:`2px solid ${sel ? "#005CB6" : "#CBD5E1"}`,
                background: sel ? "#005CB6" : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {sel && <Check size={9} color="#fff" strokeWidth={3} />}
              </div>
              {/* Tên */}
              <span style={{ fontSize:"0.82rem", fontWeight: sel ? 600 : 400, color: sel ? "#005CB6" : "#0F172A", flex:1 }}>
                {ct.tenChuongTrinh}
              </span>
              {/* Mã */}
              <span style={{
                fontSize:"0.68rem", fontWeight:700, color:"#005CB6", fontFamily:"monospace",
                background:"rgba(0,92,182,0.07)", border:"1px solid rgba(0,92,182,0.18)",
                padding:"1px 7px", borderRadius:5,
              }}>
                {ct.maChuongTrinh}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: 1|2|3 }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((s, i) => {
        const n = i + 1 as 1|2|3;
        const done = n < current;
        const active = n === current;
        const SIcon = s.icon;
        return (
          <div key={n} className="flex items-center" style={{ flex: 1 }}>
            <div className="flex flex-col items-center gap-1" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
                style={{ background: done ? "rgba(255,255,255,0.9)" : active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)", boxShadow: active ? "0 0 0 3px rgba(255,255,255,0.3)" : "none" }}>
                {done
                  ? <Check size={14} color="#005CB6" strokeWidth={3}/>
                  : <SIcon size={14} color={active ? "#005CB6" : "rgba(255,255,255,0.6)"}/>}
              </div>
              <span style={{ fontSize:"0.6rem", fontWeight: active?800:600, color: active||done?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.5)", whiteSpace:"nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length-1 && (
              <div className="flex-1 h-px mx-2" style={{ background: n < current ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", marginBottom:14 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── INPUT CHỌN MÃ BCCS ────────────────────────────────────────────────────────

function MaBCSSSelect({
  value, onChange, hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const [open, setOpen]   = useState(false);
  const [q,    setQ]      = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Simulate API loading on open
  const handleOpen = () => {
    if (open) { setOpen(false); return; }
    setLoading(true);
    setOpen(true);
    setTimeout(() => { setLoading(false); searchRef.current?.focus(); }, 480);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DEMO_MA_BCSS.filter(m => {
    if (!q) return true;
    return m.ma.toLowerCase().includes(q.toLowerCase()) ||
           m.moTa.toLowerCase().includes(q.toLowerCase());
  });

  const selectedItem = DEMO_MA_BCSS.find(m => m.ma === value);

  return (
    <div ref={ref} style={{ position:"relative", width:"100%" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        style={{
          width:"100%", display:"flex", alignItems:"center", gap:8,
          border: `1.5px solid ${hasError ? "#D4183D" : open ? "#005CB6" : "#E2E8F0"}`,
          borderRadius:10, padding:"9px 12px", background: open ? "#fff" : "#F8F9FA",
          cursor:"pointer", textAlign:"left", fontFamily:"'Be Vietnam Pro',sans-serif",
          boxShadow: open ? "0 0 0 3px rgba(0,92,182,0.08)" : "none",
          transition:"all 0.15s ease",
        }}>
        {/* Prefix icon */}
        <div style={{ width:20, height:20, borderRadius:6, background:"rgba(0,92,182,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Hash size={11} color="#005CB6"/>
        </div>

        {/* Value or placeholder */}
        {value ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, overflow:"hidden" }}>
            <span style={{ fontFamily:"monospace", fontSize:"0.83rem", fontWeight:800, color:"#005CB6", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{value}</span>
            {selectedItem && (
              <span style={{ fontSize:"0.67rem", color:"#94A3B8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedItem.moTa}</span>
            )}
          </div>
        ) : (
          <span style={{ flex:1, fontSize:"0.8rem", color:"#94A3B8" }}>Chọn mã gói từ hệ thống BCCS…</span>
        )}

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          {loading && <div style={{ width:12, height:12, borderRadius:"50%", border:"2px solid rgba(0,92,182,0.2)", borderTopColor:"#005CB6", animation:"spin 0.6s linear infinite" }}/>}
          <ChevronDown size={14} color="#94A3B8" style={{ transform: open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s ease" }}/>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:200,
          background:"#fff", borderRadius:12, border:"1.5px solid #E2E8F0",
          boxShadow:"0 12px 40px rgba(0,0,0,0.14)", overflow:"hidden",
          animation:"dropIn 0.15s ease",
        }}>
          {/* Header */}
          <div style={{ padding:"10px 12px 8px", borderBottom:"1px solid #F1F5F9", background:"#FAFBFC" }}>
            <div style={{ fontSize:"0.62rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:7 }}>
              Danh sách mã từ hệ thống BCCS
            </div>
            {/* Search */}
            <div style={{ position:"relative" }}>
              <Search size={12} color="#94A3B8" style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <input
                ref={searchRef}
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Tìm mã hoặc mô tả…"
                style={{
                  width:"100%", border:"1.5px solid #E2E8F0", borderRadius:8,
                  padding:"7px 30px 7px 28px", fontSize:"0.76rem",
                  fontFamily:"'Be Vietnam Pro',sans-serif", outline:"none",
                  background:"#fff", color:"#374151",
                }}
                onFocus={e => Object.assign(e.target.style, { borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" })}
                onBlur={e  => Object.assign(e.target.style, { borderColor:"#E2E8F0", boxShadow:"none" })}
              />
              {q && (
                <button type="button" onClick={() => setQ("")}
                  style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"#E2E8F0", border:"none", borderRadius:"50%", width:16, height:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <X size={9} color="#64748B"/>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight:264, overflowY:"auto" }}>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 0", gap:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", border:"2.5px solid rgba(0,92,182,0.15)", borderTopColor:"#005CB6", animation:"spin 0.7s linear infinite" }}/>
                <span style={{ fontSize:"0.72rem", color:"#94A3B8", fontWeight:600 }}>Đang tải từ BCCS…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 0", gap:8 }}>
                <Database size={24} color="#CBD5E1"/>
                <span style={{ fontSize:"0.76rem", color:"#94A3B8" }}>Không tìm thấy mã phù hợp</span>
              </div>
            ) : (
              filtered.map((item, idx) => {
                const isSelected = item.ma === value;
                return (
                  <div key={item.ma}
                    onClick={() => { onChange(item.ma); setQ(""); setOpen(false); }}
                    style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"9px 14px",
                      background: isSelected ? "rgba(0,92,182,0.06)" : idx%2===0 ? "#fff" : "#FAFCFF",
                      boxShadow:"inset 0 -1px 0 0 #F8FAFC",
                      cursor:"pointer", transition:"background 0.12s",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "rgba(0,92,182,0.04)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = idx%2===0?"#fff":"#FAFCFF"; }}
                  >
                    <div style={{ width:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {isSelected && <Check size={12} color="#005CB6" strokeWidth={3}/>}
                    </div>
                    <span style={{ fontFamily:"monospace", fontSize:"0.78rem", fontWeight:800, color: isSelected?"#005CB6":"#1E293B", letterSpacing:"0.03em", whiteSpace:"nowrap", flexShrink:0 }}>
                      {item.ma}
                    </span>
                    <span style={{ fontSize:"0.7rem", color:"#64748B", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {item.moTa}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:"8px 14px", borderTop:"1px solid #F1F5F9", background:"#FAFBFC", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontSize:"0.62rem", color:"#94A3B8" }}>
              API BCCS · {DEMO_MA_BCSS.length} mã gói
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-6px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
      `}</style>
    </div>
  );
}

// ── BẢNG MÔN HỌC K12HOME (Bước 3) ────────────────────────────────────────────

function MonHocTable({
  value, onChange, selectedLopIds,
}: { value: string[]; onChange: (v: string[]) => void; selectedLopIds: string[] }) {
  const [search,    setSearch]    = useState("");
  const [filterCap, setFilterCap] = useState<CapHoc | "">("");

  // Convert lopIds ("lop1"→"1", ...) to khoi numbers
  const selectedKhoi = selectedLopIds
    .map(id => DS_LOP.find(l => l.id === id))
    .filter(Boolean)
    .map(l => String(l!.so));

  const CAP_KHOI: Record<CapHoc, string[]> = {
    tieuhoc: ["1","2","3","4","5"],
    thcs:    ["6","7","8","9"],
    thpt:    ["10","11","12"],
  };

  const filtered = DS_MON_HOC_K12.filter(mon => {
    // Smart filter: only show subjects overlapping selected lop
    if (selectedKhoi.length > 0 && !selectedKhoi.some(k => mon.khoiLop.includes(k))) return false;
    if (search && !mon.ten.toLowerCase().includes(search.toLowerCase()) && !mon.ma.includes(search)) return false;
    if (filterCap && !mon.khoiLop.some(k => CAP_KHOI[filterCap].includes(k))) return false;
    return true;
  });

  const filteredIds = filtered.map(m => m.id);
  const allSel   = filteredIds.length > 0 && filteredIds.every(id => value.includes(id));
  const someSel  = filteredIds.some(id => value.includes(id)) && !allSel;

  const toggleAll = () => {
    if (allSel) onChange(value.filter(id => !filteredIds.includes(id)));
    else onChange([...new Set([...value, ...filteredIds])]);
  };
  const toggle = (id: string) =>
    value.includes(id) ? onChange(value.filter(v => v !== id)) : onChange([...value, id]);

  const inputBase: React.CSSProperties = {
    border: "1.5px solid #E2E8F0", padding: "8px 14px", fontSize: "0.8rem",
    background: "#F8F9FA", borderRadius: 10, outline: "none",
    fontFamily: "'Be Vietnam Pro',sans-serif", color: "#374151",
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm tên môn học..."
            style={{ ...inputBase, paddingLeft:34, width:"100%" }}
            onFocus={e => Object.assign(e.target.style, { borderColor:"#005CB6", background:"#fff", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" })}
            onBlur={e  => Object.assign(e.target.style, { borderColor:"#E2E8F0", background:"#F8F9FA", boxShadow:"none" })}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full"
              style={{ background:"#E2E8F0", border:"none", cursor:"pointer" }}>
              <X size={10} color="#64748B"/>
            </button>
          )}
        </div>
        <div className="relative">
          <select value={filterCap} onChange={e => setFilterCap(e.target.value as CapHoc | "")}
            style={{ ...inputBase, paddingRight:28, appearance:"none", cursor:"pointer", minWidth:130 }}>
            <option value="">Tất cả cấp</option>
            <option value="tieuhoc">Tiểu học</option>
            <option value="thcs">THCS</option>
            <option value="thpt">THPT</option>
          </select>
          <ChevronDown size={13} color="#94A3B8" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
        <div className="flex items-center gap-2">
          <ListChecks size={14} color="#005CB6"/>
          <span style={{ fontSize:"0.74rem", color:"#64748B" }}>
            Hiển thị <strong style={{ color:"#0F172A" }}>{filtered.length}</strong> môn học
            {selectedLopIds.length > 0 && <span style={{ color:"#D97706", fontWeight:600, marginLeft:4 }}>· lọc theo khối lớp đã chọn</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {value.length > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background:"rgba(0,92,182,0.1)", border:"1px solid rgba(0,92,182,0.2)", fontSize:"0.72rem", fontWeight:800, color:"#005CB6" }}>
              <CheckCircle size={11}/> Đã chọn {value.length}
            </span>
          )}
          {value.length > 0 && (
            <button type="button" onClick={() => onChange([])}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors"
              style={{ background:"rgba(212,24,61,0.06)", border:"1px solid rgba(212,24,61,0.18)", fontSize:"0.68rem", fontWeight:600, color:"#D4183D", cursor:"pointer" }}>
              <X size={10}/> Bỏ chọn tất cả
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border:"1.5px solid #E2E8F0" }}>
        {/* Header */}
        <div className="grid items-center px-3.5 py-2.5"
          style={{ gridTemplateColumns:"32px 1fr 90px", background:"#F8FAFC", borderBottom:"1.5px solid #E2E8F0" }}>
          <button type="button" onClick={toggleAll}
            style={{ width:16, height:16, borderRadius:4, background:allSel?"#005CB6":"transparent",
              border:`2px solid ${allSel||someSel?"#005CB6":"#CBD5E1"}`,
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            {allSel  && <Check size={9} color="#fff" strokeWidth={3}/>}
            {someSel && <div style={{ width:6, height:2, background:"#005CB6", borderRadius:2 }}/>}
          </button>
          <span style={{ fontSize:"0.67rem", fontWeight:700, color:"#64748B", letterSpacing:"0.05em", textTransform:"uppercase" }}>Tên môn học</span>
          <span style={{ fontSize:"0.67rem", fontWeight:700, color:"#64748B", letterSpacing:"0.05em", textTransform:"uppercase" }}>Mã môn học</span>
        </div>

        {/* Body */}
        <div style={{ maxHeight:340, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <BookOpen size={28} color="#CBD5E1"/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#64748B" }}>Không tìm thấy môn học</div>
                <div style={{ fontSize:"0.7rem", color:"#94A3B8", marginTop:3 }}>Thử thay đổi bộ lọc hoặc từ khóa</div>
              </div>
              <button type="button" onClick={() => { setSearch(""); setFilterCap(""); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background:"rgba(0,92,182,0.08)", border:"1px solid rgba(0,92,182,0.18)", fontSize:"0.72rem", fontWeight:600, color:"#005CB6", cursor:"pointer" }}>
                <RefreshCw size={11}/> Xóa bộ lọc
              </button>
            </div>
          ) : (
            filtered.map((mon, idx) => {
              const sel = value.includes(mon.id);
              return (
                <div key={mon.id}
                  className="grid items-center px-3.5 py-2.5 cursor-pointer transition-colors"
                  style={{
                    gridTemplateColumns:"32px 1fr 90px",
                    borderTop: idx > 0 ? "1px solid #F1F5F9" : "none",
                    background: sel ? "rgba(0,92,182,0.04)" : idx%2===0 ? "#fff" : "#FAFBFC",
                  }}
                  onClick={() => toggle(mon.id)}>
                  {/* Checkbox */}
                  <div style={{ width:16, height:16, borderRadius:4, background:sel?"#005CB6":"transparent",
                    border:`2px solid ${sel?"#005CB6":"#CBD5E1"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {sel && <Check size={9} color="#fff" strokeWidth={3}/>}
                  </div>
                  {/* Tên môn */}
                  <span style={{ fontSize:"0.83rem", fontWeight:sel?700:500, color:sel?"#005CB6":"#0F172A" }}>
                    {mon.ten}
                  </span>
                  {/* Mã môn */}
                  <div>
                    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px",
                      background:"rgba(0,92,182,0.07)", border:"1px solid rgba(0,92,182,0.18)",
                      borderRadius:6, fontSize:"0.8rem", fontWeight:800, color:"#005CB6", fontFamily:"monospace" }}>
                      {mon.ma}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected preview */}
      {value.length > 0 && (
        <div className="rounded-xl p-3.5 space-y-2" style={{ background:"rgba(0,92,182,0.04)", border:"1.5px solid rgba(0,92,182,0.14)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle size={13} color="#005CB6"/>
            <span style={{ fontSize:"0.74rem", fontWeight:700, color:"#005CB6" }}>
              {value.length} môn học đã chọn
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {value.map(id => {
              const mon = DS_MON_HOC_K12.find(m => m.id === id);
              if (!mon) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded-lg"
                  style={{ background:"#fff", border:"1px solid rgba(0,92,182,0.22)", fontSize:"0.67rem", fontWeight:600, color:"#005CB6" }}>
                  <span style={{ fontFamily:"monospace", fontSize:"0.6rem", opacity:0.75 }}>{mon.ma}</span>
                  {mon.ten}
                  <button type="button" onClick={e => { e.stopPropagation(); toggle(id); }}
                    className="flex items-center justify-center w-3.5 h-3.5 rounded-full"
                    style={{ background:"rgba(0,92,182,0.15)", border:"none", cursor:"pointer", flexShrink:0 }}>
                    <X size={8} color="#005CB6"/>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── BCCS PACKAGE DROPDOWN (multi-code) ───────────────────────────────────────

function BCCSPackageSelect({
  value, onChange, hasError,
}: { value: string; onChange: (id: string) => void; hasError?: boolean }) {
  const [open, setOpen]       = useState(false);
  const [q, setQ]             = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    if (open) { setOpen(false); return; }
    setLoading(true); setOpen(true);
    setTimeout(() => { setLoading(false); searchRef.current?.focus(); }, 460);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DEMO_BCCS_PACKAGES.filter(p =>
    !q || p.ten.toLowerCase().includes(q.toLowerCase()) ||
    p.maGois.some(m => m.ma.toLowerCase().includes(q.toLowerCase()))
  );
  const selected = DEMO_BCCS_PACKAGES.find(p => p.id === value);
  const totalSel = selected ? selected.maGois.reduce((s, m) => s + m.giaSauVAT, 0) : 0;

  return (
    <div ref={ref} style={{ position:"relative", width:"100%" }}>
      <button type="button" onClick={handleOpen} style={{
        width:"100%", display:"flex", alignItems:"center", gap:8,
        border:`1.5px solid ${hasError?"#D4183D":open?"#005CB6":"#E2E8F0"}`,
        borderRadius:10, padding:"10px 14px", background:open?"#fff":"#F8F9FA",
        cursor:"pointer", textAlign:"left", fontFamily:"'Be Vietnam Pro',sans-serif",
        boxShadow:open?"0 0 0 3px rgba(0,92,182,0.08)":"none", transition:"all 0.15s ease",
      }}>
        <div style={{ width:20, height:20, borderRadius:6, background:"rgba(0,92,182,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Hash size={11} color="#005CB6"/>
        </div>
        {selected ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, overflow:"hidden", minWidth:0 }}>
            <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#005CB6", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{selected.ten}</span>
            <span style={{ fontSize:"0.67rem", color:"#94A3B8", whiteSpace:"nowrap", flexShrink:0 }}>
              {selected.maGois.length} mã · {totalSel === 0 ? "Miễn phí" : fmt(totalSel)}
            </span>
          </div>
        ) : (
          <span style={{ flex:1, fontSize:"0.8rem", color:"#94A3B8" }}>--Chọn--</span>
        )}
        {loading && <div style={{ width:12, height:12, borderRadius:"50%", border:"2px solid rgba(0,92,182,0.2)", borderTopColor:"#005CB6", animation:"spin 0.6s linear infinite", flexShrink:0 }}/>}
        <ChevronDown size={14} color="#94A3B8" style={{ transform:open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s ease", flexShrink:0 }}/>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:300,
          background:"#fff", borderRadius:12, border:"1.5px solid #E2E8F0",
          boxShadow:"0 12px 40px rgba(0,0,0,0.14)", overflow:"hidden",
          animation:"dropIn 0.15s ease",
        }}>
          <div style={{ padding:"10px 12px 8px", borderBottom:"1px solid #F1F5F9", background:"#FAFBFC" }}>
            <div style={{ fontSize:"0.62rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:7 }}>
              Danh sách gói từ hệ thống BCCS
            </div>
            <div style={{ position:"relative" }}>
              <Search size={12} color="#94A3B8" style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)}
                placeholder="Tìm tên gói hoặc mã…"
                style={{ width:"100%", border:"1.5px solid #E2E8F0", borderRadius:8, padding:"7px 30px 7px 28px", fontSize:"0.76rem", fontFamily:"'Be Vietnam Pro',sans-serif", outline:"none", background:"#fff", color:"#374151" }}
                onFocus={e => Object.assign(e.target.style, { borderColor:"#005CB6", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" })}
                onBlur={e  => Object.assign(e.target.style, { borderColor:"#E2E8F0", boxShadow:"none" })}
              />
              {q && (
                <button type="button" onClick={() => setQ("")}
                  style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"#E2E8F0", border:"none", borderRadius:"50%", width:16, height:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <X size={9} color="#64748B"/>
                </button>
              )}
            </div>
          </div>

          <div style={{ maxHeight:300, overflowY:"auto" }}>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 0", gap:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", border:"2.5px solid rgba(0,92,182,0.15)", borderTopColor:"#005CB6", animation:"spin 0.7s linear infinite" }}/>
                <span style={{ fontSize:"0.72rem", color:"#94A3B8", fontWeight:600 }}>Đang tải từ BCCS…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 0", gap:8 }}>
                <Database size={24} color="#CBD5E1"/>
                <span style={{ fontSize:"0.76rem", color:"#94A3B8" }}>Không tìm thấy gói phù hợp</span>
              </div>
            ) : (
              filtered.map((goi, idx) => {
                const isSel = goi.id === value;
                const total = goi.maGois.reduce((s, m) => s + m.giaSauVAT, 0);
                return (
                  <div key={goi.id}
                    onClick={() => { onChange(goi.id); setQ(""); setOpen(false); }}
                    style={{
                      padding:"10px 14px",
                      background: isSel ? "rgba(0,92,182,0.06)" : idx%2===0 ? "#fff" : "#FAFCFF",
                      cursor:"pointer", transition:"background 0.12s",
                      boxShadow:"inset 0 -1px 0 0 #F8FAFC",
                    }}
                    onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.background = "rgba(0,92,182,0.04)"; }}
                    onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLDivElement).style.background = idx%2===0 ? "#fff" : "#FAFCFF"; }}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        {isSel && <Check size={12} color="#005CB6" strokeWidth={3}/>}
                        <span style={{ fontSize:"0.83rem", fontWeight:700, color:isSel?"#005CB6":"#1E293B" }}>{goi.ten}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                        <span style={{ fontSize:"0.72rem", fontWeight:800, color:total===0?"#0F766E":"#005CB6" }}>
                          {total === 0 ? "Miễn phí" : fmt(total)}
                        </span>
                        <span style={{ fontSize:"0.62rem", color:"#64748B", background:"#F1F5F9", padding:"1px 6px", borderRadius:4 }}>
                          {goi.maGois.length} mã
                        </span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {goi.maGois.map(m => (
                        <code key={m.ma} style={{ fontSize:"0.62rem", fontWeight:700, color:"#64748B", background:"#F1F5F9", padding:"1px 6px", borderRadius:4, fontFamily:"monospace" }}>
                          {m.ma}
                        </code>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ padding:"7px 14px", borderTop:"1px solid #F1F5F9", background:"#FAFBFC", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }}/>
            <span style={{ fontSize:"0.62rem", color:"#94A3B8" }}>API BCCS · {DEMO_BCCS_PACKAGES.length} gói</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MODAL THÊM GÓI CƯỚC MỚI (flat, single-page) ──────────────────────────────

// Flat list of all BCCS codes across all packages (for Khác giá row picker)
const ALL_MA_GOIS: BCCSMaGoi[] = DEMO_BCCS_PACKAGES.flatMap(p => p.maGois);

interface KhacGiaRow {
  _id: string;
  khoiLopIds: string[];  // multi-select, e.g. ["lop1","lop2"]
  maGoiId:    string;    // e.g. "k12_LTQG_A"
  giaBan:     string;    // auto-filled from giaSauVAT
  thoiHan:    string;    // Thời hạn (tháng): 1, 3, 6, 12, ...
}

interface FormThemFlat {
  chuongTrinhIds: string[];        // Chương trình học
  tenGoi: string;
  loaiGia: LoaiGia;
  bccsGoiId: string;
  giaBan: string;
  // Đồng giá / Miễn phí: chung 1 danh sách lớp
  khoiLopIds: string[];
  // Khác giá: danh sách dòng (Khối lớp → Mã → Giá)
  khacGiaRows: KhacGiaRow[];
  thoiLuongSuDung: string;         // Thời lượng sử dụng (tháng): 3, 6, 12 — auto-fill từ BCCS
  thoiLuongThuNghiem: string;      // Thời lượng sử dụng thử (ngày)
  monHocIds: string[];
  gioiHanMonHoc: string;
  sdEnd: string;
  trangThai: TrangThai;
  ghiChu: string;
}

const FORM_THEM_FLAT_RONG: FormThemFlat = {
  chuongTrinhIds: [],
  tenGoi: "", loaiGia: "dong-gia", bccsGoiId: "", giaBan: "",
  khoiLopIds: [], khacGiaRows: [], thoiLuongSuDung: "", thoiLuongThuNghiem: "", monHocIds: [], gioiHanMonHoc: "",
  sdEnd: "",
  trangThai: "Đang hoạt động", ghiChu: "",
};

function ModalThemGoiCuocFlat({
  allGoi, onClose, onSave,
}: {
  allGoi: GoiCuoc[];
  onClose: () => void;
  onSave: (f: FormThemFlat, bccsCodes: BCCSMaGoi[]) => void;
}) {
  const [form, setForm] = useState<FormThemFlat>({ ...FORM_THEM_FLAT_RONG });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [ghiChuLen, setGhiChuLen] = useState(0);

  const set = (k: keyof FormThemFlat, v: string | string[] | Record<string, string[]>) =>
    setForm(f => ({ ...f, [k]: v }));

  /* ── BCCS ── */
  const selectedBCCSGoi = DEMO_BCCS_PACKAGES.find(p => p.id === form.bccsGoiId);
  const totalVAT = selectedBCCSGoi
    ? selectedBCCSGoi.maGois.reduce((s, m) => s + m.giaSauVAT, 0) : 0;

  /* Khi chọn gói BCCS → auto-fill giá bán (nếu Đồng giá) + thời lượng sử dụng */
  const handleBCCSChange = (goiId: string) => {
    const goi = DEMO_BCCS_PACKAGES.find(p => p.id === goiId);
    const total = goi ? goi.maGois.reduce((s, m) => s + m.giaSauVAT, 0) : 0;
    setForm(f => ({
      ...f,
      bccsGoiId: goiId,
      giaBan: f.loaiGia === "dong-gia" && total > 0 ? String(total) : f.giaBan,
      thoiLuongSuDung: goi ? String(goi.thoiLuongSuDung) : "",
    }));
  };

  /* Khi đổi loại giá → reset BCCS và giá nếu cần */
  const handleLoaiGiaChange = (lg: LoaiGia) => {
    const defaultKhacGiaRows: KhacGiaRow[] = lg === "khac-gia"
      ? [
          { _id: String(Date.now()),     khoiLopIds: [], maGoiId: "", giaBan: "" },
          { _id: String(Date.now() + 1), khoiLopIds: [], maGoiId: "", giaBan: "" },
          { _id: String(Date.now() + 2), khoiLopIds: [], maGoiId: "", giaBan: "" },
        ]
      : [];
    setForm(f => ({
      ...f,
      loaiGia: lg,
      bccsGoiId: lg === "free" ? "" : f.bccsGoiId,
      giaBan: lg === "free" ? "" : f.giaBan,
      khacGiaRows: defaultKhacGiaRows,
      khoiLopIds: lg === "free" ? f.khoiLopIds : [],
    }));
  };

  /* ── Khác giá: thêm / sửa / xóa dòng ── */
  const addKhacGiaRow = () =>
    setForm(f => ({ ...f, khacGiaRows: [...f.khacGiaRows, { _id: String(Date.now()), khoiLopIds: [], maGoiId: "", giaBan: "", thoiHan: "" }] }));

  const removeKhacGiaRow = (id: string) =>
    setForm(f => ({ ...f, khacGiaRows: f.khacGiaRows.filter(r => r._id !== id) }));

  const updateKhacGiaRow = (id: string, patch: Partial<KhacGiaRow>) =>
    setForm(f => ({ ...f, khacGiaRows: f.khacGiaRows.map(r => r._id === id ? { ...r, ...patch } : r) }));

  const handleKhacGiaMa = (rowId: string, maGoiId: string) => {
    const maInfo = ALL_MA_GOIS.find(m => m.ma === maGoiId);
    const price = maInfo?.giaSauVAT ?? 0;
    const thoiHan = maInfo?.thoiHan ?? 0;
    updateKhacGiaRow(rowId, {
      maGoiId,
      giaBan: price > 0 ? String(price) : "",
      thoiHan: thoiHan > 0 ? String(thoiHan) : ""
    });
  };

  /* ── Đồng giá / Miễn phí: toggle chung ── */
  const toggleLop = (id: string) =>
    set("khoiLopIds", form.khoiLopIds.includes(id)
      ? form.khoiLopIds.filter(x => x !== id)
      : [...form.khoiLopIds, id]);

  const toggleMon = (id: string) =>
    set("monHocIds", form.monHocIds.includes(id)
      ? form.monHocIds.filter(x => x !== id)
      : [...form.monHocIds, id]);

  /* ── Styles ── */
  const iStyle = (k?: string): React.CSSProperties => ({
    border:`1.5px solid ${errors[k||""] ? "#D4183D" : "#E2E8F0"}`,
    padding:"10px 14px", fontSize:"0.85rem", background:"#F8F9FA",
    borderRadius:10, outline:"none", width:"100%", fontFamily:"'Be Vietnam Pro',sans-serif",
  });
  const fcs = { borderColor:"#005CB6", background:"#fff", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" };
  const blr = (k?: string) => ({ borderColor:errors[k||""]?"#D4183D":"#E2E8F0", background:"#F8F9FA", boxShadow:"none" });

  const ErrMsg = ({ f }: { f: string }) =>
    errors[f] ? (
      <div className="flex items-center gap-1.5 mt-1.5">
        <AlertCircle size={11} color="#D4183D"/>
        <span style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors[f]}</span>
      </div>
    ) : null;

  /* ── Validate ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.tenGoi.trim()) e.tenGoi = "Tên gói không được để trống";
    else if (allGoi.find(g => g.tenGoi.trim().toLowerCase() === form.tenGoi.trim().toLowerCase()))
      e.tenGoi = "Tên gói đã tồn tại";
    if (form.loaiGia !== "khac-gia" && (!form.thoiLuongSuDung || Number(form.thoiLuongSuDung) <= 0)) e.sdEnd = "Vui lòng chọn thời lượng sử dụng";
    if (form.loaiGia === "dong-gia") {
      if (!form.bccsGoiId) e.bccsGoiId = "Vui lòng chọn gói BCCS";
      if (!form.giaBan || Number(form.giaBan) <= 0) e.giaBan = "Giá bán không hợp lệ";
      if (form.khoiLopIds.length === 0) e.khoiLopIds = "Vui lòng chọn ít nhất 1 khối lớp";
    }
    if (form.loaiGia === "khac-gia") {
      if (form.khacGiaRows.length === 0) {
        e.khacGiaRows = "Vui lòng thêm ít nhất 1 dòng cấu hình";
      } else {
        const bad = form.khacGiaRows.find(r => r.khoiLopIds.length === 0 || !r.maGoiId || !r.giaBan || Number(r.giaBan) <= 0 || !r.thoiHan || Number(r.thoiHan) <= 0);
        if (bad) e.khacGiaRows = "Vui lòng điền đầy đủ Khối lớp, Mã gói, Giá tiền và Thời hạn cho tất cả các dòng";

        // Check for duplicate class levels
        const lopIds = form.khacGiaRows.flatMap(r => r.khoiLopIds).filter(Boolean);
        const dupLops = lopIds.filter((id, idx) => lopIds.indexOf(id) !== idx);
        if (dupLops.length > 0) e.khacGiaRows = "Mỗi khối lớp chỉ có thể được chọn 1 lần";

        // Check for duplicate packages
        const maGoiIds = form.khacGiaRows.map(r => r.maGoiId).filter(Boolean);
        const dupMaGoi = maGoiIds.filter((id, idx) => maGoiIds.indexOf(id) !== idx);
        if (dupMaGoi.length > 0) e.khacGiaRows = "Mỗi gói BCCS chỉ có thể được sử dụng 1 lần — không được trùng gói";
      }
    }
    if (form.loaiGia === "free") {
      if (form.khoiLopIds.length === 0) e.khoiLopIds = "Vui lòng chọn ít nhất 1 khối lớp";
    }
    if (form.monHocIds.length === 0) e.monHocIds = "Vui lòng chọn ít nhất 1 môn học";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave(form, selectedBCCSGoi?.maGois ?? []);
    }, 700);
  };

  /* ── Helper: khối lớp picker (dùng cho Đồng giá & Miễn phí) ── */
  const KhoiLopPicker = ({ value, onChange, errKey }: {
    value: string[]; onChange: (ids: string[]) => void; errKey: string;
  }) => (
    <div className="rounded-xl overflow-hidden" style={{ border:`1.5px solid ${errors[errKey]?"#D4183D":"#E2E8F0"}` }}>
      {(["tieuhoc","thcs","thpt"] as CapHoc[]).map((cap, ci) => {
        const c = CAP_CFG[cap];
        const lops = DS_LOP.filter(l => l.cap === cap);
        return (
          <div key={cap} style={{ borderBottom: ci < 2 ? "1px solid #EEF0F4" : "none" }}>
            <div className="px-3 py-1.5" style={{ background:"#F8FAFC", borderBottom:"1px solid #EEF0F4" }}>
              <span style={{ fontSize:"0.67rem", fontWeight:800, color:c.color, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                {c.label} ({c.range})
              </span>
            </div>
            <div className="flex flex-wrap gap-2 px-3 py-2.5">
              {lops.map(lop => {
                const sel = value.includes(lop.id);
                return (
                  <button key={lop.id} type="button"
                    onClick={() => onChange(sel ? value.filter(x=>x!==lop.id) : [...value,lop.id])}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
                    style={{ background:sel?c.bg:"#F1F5F9", border:`1.5px solid ${sel?c.color:"#E2E8F0"}`, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
                    <span style={{ fontSize:"0.74rem", fontWeight:sel?700:500, color:sel?c.color:"#64748B" }}>Lớp {lop.so}</span>
                    {sel && <Check size={9} color={c.color} strokeWidth={3}/>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const selectStyle: React.CSSProperties = {
    border:"1.5px solid #E2E8F0", borderRadius:10, padding:"10px 36px 10px 14px",
    fontSize:"0.85rem", background:"#F8F9FA", outline:"none",
    width:"100%", fontFamily:"'Be Vietnam Pro',sans-serif", appearance:"none", cursor:"pointer",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background:"rgba(15,23,42,0.58)", backdropFilter:"blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width:660, maxHeight:"94vh", background:"#fff", boxShadow:"0 32px 80px rgba(0,0,0,0.28)", fontFamily:"'Be Vietnam Pro',sans-serif" }}>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom:"1.5px solid #EEF0F4" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background:"linear-gradient(135deg,#004A9B,#0074E4)" }}>
              <Tags size={17} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:"1rem", fontWeight:900, color:"#0F172A", lineHeight:1.2 }}>Thêm mới gói cước</div>
              <div style={{ fontSize:"0.68rem", color:"#94A3B8", marginTop:2 }}>Điền thông tin để tạo gói cước mới</div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background:"#F1F5F9", border:"none", cursor:"pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#E2E8F0")}
            onMouseLeave={e => (e.currentTarget.style.background = "#F1F5F9")}>
            <X size={16} color="#64748B"/>
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* 0. Chọn Chương trình học */}
          <div>
            <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
              Chương trình học <span style={{ color:"#D4183D" }}>*</span>
            </label>
            <select
              value={form.chuongTrinhIds[0] || ""}
              onChange={e => set("chuongTrinhIds", e.target.value ? [e.target.value] : [])}
              style={{
                border: `1.5px solid #E2E8F0`,
                padding: "10px 14px",
                fontSize: "0.85rem",
                background: "#F8F9FA",
                outline: "none",
                width: "100%",
                borderRadius: 10,
                fontFamily: "'Be Vietnam Pro',sans-serif",
                appearance: "none",
                cursor: "pointer",
                paddingRight: 36,
              }}
            >
              <option value="">-- Chọn --</option>
              {DS_CHUONG_TRINH_HOC_PAGE.map(prog => (
                <option key={prog.id} value={prog.id}>{prog.tenChuongTrinh}</option>
              ))}
            </select>
          </div>

          {/* 1. Tên gói cước */}
          <div>
            <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
              Tên gói cước <span style={{ color:"#D4183D" }}>*</span>
            </label>
            <input type="text" value={form.tenGoi} onChange={e => set("tenGoi", e.target.value)}
              placeholder="VD: Gói học tập Tiểu học 2025"
              style={iStyle("tenGoi")}
              onFocus={e => Object.assign(e.target.style, fcs)}
              onBlur={e  => Object.assign(e.target.style, blr("tenGoi"))}
            />
            <ErrMsg f="tenGoi"/>
          </div>

          {/* 3. Cấu hình giá — chọn TRƯỚC */}
          <div>
            <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>
              Cấu hình giá <span style={{ color:"#D4183D" }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(DS_LG).map(lg => {
                const c = LG_CFG[lg]; const Ic = c.icon; const sel = form.loaiGia === lg;
                return (
                  <button key={lg} type="button"
                    onClick={() => handleLoaiGiaChange(lg)}
                    className="relative flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all"
                    style={{
                      background: sel ? c.bg : "#F8FAFB",
                      border:`2px solid ${sel ? c.color : "#E2E8F0"}`,
                      cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif",
                      boxShadow: sel ? `0 4px 14px ${c.color}22` : "none",
                    }}>
                    {sel && (
                      <div className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full" style={{ background:c.color }}>
                        <Check size={9} color="#fff" strokeWidth={3}/>
                      </div>
                    )}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: sel ? c.color : "#E2E8F0" }}>
                      <Ic size={17} color={sel ? "#fff" : "#94A3B8"}/>
                    </div>
                    <span style={{ fontSize:"0.82rem", fontWeight:800, color:sel?c.color:"#374151" }}>{c.label}</span>
                    <span style={{ fontSize:"0.62rem", color:"#94A3B8", textAlign:"center", lineHeight:1.4 }}>{c.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3a. BCCS + Giá bán + Khối lớp cho ĐỒNG GIÁ */}
          {form.loaiGia === "dong-gia" && (
            <div className="space-y-4 rounded-2xl p-4" style={{ background:"rgba(0,92,182,0.03)", border:"1.5px solid rgba(0,92,182,0.12)" }}>
              <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#005CB6", display:"flex", alignItems:"center", gap:6 }}>
                <DollarSign size={13}/> Cấu hình Đồng giá
              </div>

              {/* BCCS chọn gói */}
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Chọn Gói cước từ hệ thống BCCS <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <BCCSPackageSelect value={form.bccsGoiId} onChange={handleBCCSChange} hasError={!!errors.bccsGoiId}/>
                <ErrMsg f="bccsGoiId"/>

                {/* Mapped codes — hiển thị khi đã chọn */}
                {selectedBCCSGoi && (
                  <div className="mt-2.5 rounded-xl overflow-hidden" style={{ border:"1.5px solid rgba(0,92,182,0.2)" }}>
                    <div className="flex items-center justify-between px-4 py-2"
                      style={{ background:"rgba(0,92,182,0.06)", borderBottom:"1px solid rgba(0,92,182,0.12)" }}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} color="#005CB6"/>
                        <span style={{ fontSize:"0.72rem", fontWeight:800, color:"#005CB6" }}>
                          {selectedBCCSGoi.maGois.length} mã gói được mapping
                        </span>
                      </div>
                      <span style={{ fontSize:"0.74rem", fontWeight:900, color:"#005CB6" }}>
                        Tổng: {fmt(totalVAT)}
                      </span>
                    </div>
                    {selectedBCCSGoi.maGois.map((m, idx) => (
                      <div key={m.ma} className="flex items-center justify-between px-4 py-2"
                        style={{ borderTop:idx>0?"1px solid #F1F5F9":"none", background:idx%2===0?"#fff":"#FAFCFF" }}>
                        <div className="flex items-center gap-2.5">
                          <code style={{ fontSize:"0.72rem", fontWeight:900, color:"#005CB6", background:"rgba(0,92,182,0.08)", padding:"1px 7px", borderRadius:5, fontFamily:"monospace" }}>
                            {m.ma}
                          </code>
                        </div>
                        <span style={{ fontSize:"0.76rem", fontWeight:700, color:"#1E293B", whiteSpace:"nowrap" }}>
                          {fmt(m.giaSauVAT)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Giá bán */}
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Giá bán (VNĐ) <span style={{ color:"#D4183D" }}>*</span>
                  {selectedBCCSGoi && totalVAT > 0 && (
                    <span style={{ fontSize:"0.63rem", color:"#005CB6", fontWeight:500, marginLeft:8 }}>· Tự động từ BCCS</span>
                  )}
                </label>
                <div className="relative">
                  <input type="number" min="1" value={form.giaBan}
                    onChange={e => set("giaBan", e.target.value)}
                    placeholder="0"
                    style={{ ...iStyle("giaBan"), paddingRight:52 }}
                    onFocus={e => Object.assign(e.target.style, fcs)}
                    onBlur={e  => Object.assign(e.target.style, blr("giaBan"))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600 }}>VNĐ</span>
                </div>
                {form.giaBan && !isNaN(Number(form.giaBan)) && Number(form.giaBan) > 0 && (
                  <p style={{ fontSize:"0.68rem", color:"#005CB6", marginTop:3, fontWeight:700 }}>{fmt(Number(form.giaBan))}</p>
                )}
                <ErrMsg f="giaBan"/>
              </div>

              {/* Khối lớp */}
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Khối lớp áp dụng <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <KhoiLopPicker value={form.khoiLopIds} onChange={v => set("khoiLopIds", v)} errKey="khoiLopIds"/>
                {form.khoiLopIds.length > 0 && (
                  <p style={{ fontSize:"0.68rem", color:"#005CB6", marginTop:4, fontWeight:600 }}>Đã chọn {form.khoiLopIds.length} khối lớp</p>
                )}
                <ErrMsg f="khoiLopIds"/>
              </div>

              {/* Thời lượng sử dụng */}
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Thời lượng sử dụng <span style={{ color:"#D4183D" }}>*</span>
                  {selectedBCCSGoi && (
                    <span style={{ fontSize:"0.63rem", color:"#005CB6", fontWeight:500, marginLeft:8 }}>· Tự động từ BCCS</span>
                  )}
                </label>
                <div className="relative" style={{ width:160 }}>
                  <input
                    type="number"
                    min="0"
                    value={form.thoiLuongSuDung}
                    onChange={e => set("thoiLuongSuDung", e.target.value)}
                    placeholder="0"
                    readOnly={selectedBCCSGoi ? true : false}
                    style={{
                      ...iStyle("thoiLuongSuDung"),
                      paddingRight: 48,
                      background: selectedBCCSGoi ? "#F1F5F9" : "#F8F9FA",
                      cursor: selectedBCCSGoi ? "default" : "text",
                      opacity: selectedBCCSGoi ? 0.7 : 1,
                    }}
                    onFocus={e => !selectedBCCSGoi && Object.assign(e.target.style, fcs)}
                    onBlur={e => !selectedBCCSGoi && Object.assign(e.target.style, blr("thoiLuongSuDung"))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600 }}>Tháng</span>
                </div>
                {form.thoiLuongSuDung && !isNaN(Number(form.thoiLuongSuDung)) && Number(form.thoiLuongSuDung) > 0 && (
                  <p style={{ fontSize:"0.68rem", color:"#005CB6", marginTop:3, fontWeight:600 }}>{form.thoiLuongSuDung} tháng</p>
                )}
                <ErrMsg f="thoiLuongSuDung"/>
              </div>
            </div>
          )}

          {/* 3b. Khác giá — bảng dòng Khối lớp / Mã / Giá */}
          {form.loaiGia === "khac-gia" && (
            <div className="space-y-3 rounded-2xl p-4" style={{ background:"rgba(217,119,6,0.03)", border:`1.5px solid ${errors.khacGiaRows?"#D4183D":"rgba(217,119,6,0.18)"}` }}>
              <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#D97706", display:"flex", alignItems:"center", gap:6 }}>
                <BadgePercent size={13}/> Cấu hình Khác giá
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden" style={{ border:"1.5px solid rgba(217,119,6,0.22)" }}>
                {/* Header */}
                <div className="grid px-3 py-2"
                  style={{ gridTemplateColumns:"1fr 1fr 120px 100px 36px", background:"rgba(217,119,6,0.07)", borderBottom:"1px solid rgba(217,119,6,0.15)" }}>
                  <span style={{ fontSize:"0.66rem", fontWeight:800, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.06em" }}>Khối lớp <span style={{ color:"#D4183D" }}>*</span></span>
                  <span style={{ fontSize:"0.66rem", fontWeight:800, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.06em" }}>Mã gói BCCS <span style={{ color:"#D4183D" }}>*</span></span>
                  <span style={{ fontSize:"0.66rem", fontWeight:800, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"right" }}>Giá tiền <span style={{ color:"#D4183D" }}>*</span></span>
                  <span style={{ fontSize:"0.66rem", fontWeight:800, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.06em" }}>Thời hạn <span style={{ color:"#D4183D" }}>*</span></span>
                  <span/>
                </div>

                {/* Rows */}
                {form.khacGiaRows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-1.5">
                    <BadgePercent size={22} color="#FCD34D"/>
                    <span style={{ fontSize:"0.72rem", color:"#92400E" }}>Chưa có dòng nào — nhấn "+ Thêm dòng" để bắt đầu</span>
                  </div>
                ) : form.khacGiaRows.map((row, idx) => {
                  const maInfo = ALL_MA_GOIS.find(m => m.ma === row.maGoiId);
                  const selectedLopId = row.khoiLopIds[0];
                  const selectedLop = selectedLopId ? DS_LOP.find(l => l.id === selectedLopId) : null;
                  const hasRowErr = !!errors.khacGiaRows && (row.khoiLopIds.length === 0 || !row.maGoiId || !row.giaBan || Number(row.giaBan) <= 0);

                  // Get available class levels (ones not already selected in other rows)
                  const usedLopIds = form.khacGiaRows
                    .filter(r => r._id !== row._id && r.khoiLopIds.length > 0)
                    .flatMap(r => r.khoiLopIds);
                  const availableLops = DS_LOP.filter(l => !usedLopIds.includes(l.id));

                  // Check if this row's package is duplicated in other rows
                  const isDupPackage = row.maGoiId && form.khacGiaRows
                    .some(r => r._id !== row._id && r.maGoiId === row.maGoiId);

                  return (
                    <div key={row._id}
                      style={{ borderTop: idx > 0 ? "1px solid #FEF3C7" : "none", background: idx%2===0?"#fff":"#FFFBF5" }}>
                      <div className="grid items-start gap-2 px-3 py-2.5"
                        style={{ gridTemplateColumns:"1fr 1fr 120px 100px 36px" }}>

                        {/* Khối lớp — dropdown select */}
                        <div>
                          <select
                            value={selectedLopId || ""}
                            onChange={e => updateKhacGiaRow(row._id, { khoiLopIds: e.target.value ? [e.target.value] : [] })}
                            style={{ width:"100%", padding:"6px 10px", fontSize:"0.78rem", borderRadius:8,
                              border:`1.5px solid ${hasRowErr&&row.khoiLopIds.length===0?"#D4183D":"#E2E8F0"}`,
                              background:selectedLopId?"#FFF7ED":"#F8F9FA",
                              outline:"none", fontFamily:"'Be Vietnam Pro',sans-serif", color:"#0F172A", cursor:"pointer" }}>
                            <option value="">-- Chọn khối --</option>
                            {availableLops.map(lop => (
                              <option key={lop.id} value={lop.id}>Lớp {lop.so}</option>
                            ))}
                            {selectedLopId && (
                              <option value={selectedLopId} style={{ fontWeight:"bold" }}>Lớp {selectedLop?.so} (hiện tại)</option>
                            )}
                          </select>
                          {selectedLop && (
                            <div style={{ fontSize:"0.62rem", color:"#0F766E", fontWeight:600, marginTop:3 }}>
                              ✓ Lớp {selectedLop.so}
                            </div>
                          )}
                        </div>

                        {/* Mã gói BCCS */}
                        <div>
                          <select
                            value={row.maGoiId}
                            onChange={e => handleKhacGiaMa(row._id, e.target.value)}
                            style={{ width:"100%", padding:"6px 10px", fontSize:"0.78rem", borderRadius:8,
                              border:`1.5px solid ${isDupPackage?"#D97706":(hasRowErr&&!row.maGoiId?"#D4183D":"#E2E8F0")}`,
                              background:row.maGoiId?"#FFF7ED":"#F8F9FA",
                              outline:"none", fontFamily:"'Be Vietnam Pro',sans-serif", color:"#0F172A", cursor:"pointer" }}>
                            <option value="">-- Chọn mã --</option>
                            {DEMO_BCCS_PACKAGES.map(pkg => (
                              <optgroup key={pkg.id} label={pkg.ten}>
                                {pkg.maGois.map(m => (
                                  <option key={m.ma} value={m.ma}>{m.ma} — {m.moTa}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          {isDupPackage && (
                            <div style={{ fontSize:"0.62rem", color:"#D97706", fontWeight:600, marginTop:3, display:"flex", alignItems:"center", gap:4 }}>
                              ⚠️ Gói trùng
                            </div>
                          )}
                          {maInfo && !isDupPackage && (
                            <div className="mt-1">
                              <span style={{ fontSize:"0.62rem", color:"#92400E" }}>{maInfo.moTa}</span>
                            </div>
                          )}
                        </div>

                        {/* Giá tiền */}
                        <div className="relative">
                          <input
                            type="text"
                            value={row.giaBan ? Number(row.giaBan).toLocaleString("vi-VN") : ""}
                            readOnly
                            placeholder="Tự động"
                            style={{ width:"100%", padding:"6px 36px 6px 10px", fontSize:"0.78rem", borderRadius:8, textAlign:"right",
                              border:`1.5px solid ${hasRowErr&&(!row.giaBan||Number(row.giaBan)<=0)?"#D4183D":"#E2E8F0"}`,
                              background:"#F1F5F9", outline:"none", fontFamily:"'Be Vietnam Pro',sans-serif",
                              cursor:"default", color: row.giaBan ? "#0F172A" : "#94A3B8" }}/>
                          <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:"0.62rem", color:"#94A3B8", fontWeight:600, pointerEvents:"none" }}>₫</span>
                          {row.giaBan && Number(row.giaBan) > 0 && (
                            <div style={{ fontSize:"0.62rem", color:"#D97706", fontWeight:600, textAlign:"right", marginTop:2 }}>{fmtShort(Number(row.giaBan))}</div>
                          )}
                        </div>

                        {/* Thời hạn */}
                        <div>
                          <input
                            type="number"
                            value={row.thoiHan}
                            onChange={e => updateKhacGiaRow(row._id, { thoiHan: e.target.value })}
                            placeholder="Nhập tháng"
                            min="1"
                            style={{ width:"100%", padding:"6px 10px", fontSize:"0.78rem", borderRadius:8,
                              border:`1.5px solid ${hasRowErr&&!row.thoiHan?"#D4183D":"#E2E8F0"}`,
                              background:row.thoiHan?"#FFF7ED":"#F8F9FA",
                              outline:"none", fontFamily:"'Be Vietnam Pro',sans-serif", color:"#0F172A" }}/>
                          {row.thoiHan && (
                            <div style={{ fontSize:"0.62rem", color:"#0F766E", fontWeight:600, marginTop:3 }}>
                              ✓ {row.thoiHan} tháng
                            </div>
                          )}
                        </div>

                        {/* Xóa */}
                        <div className="flex items-center justify-center" style={{ paddingTop:4 }}>
                          <button type="button" onClick={() => removeKhacGiaRow(row._id)}
                            className="flex items-center justify-center w-7 h-7 rounded-lg"
                            style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", cursor:"pointer" }}
                            onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.14)")}
                            onMouseLeave={e=>(e.currentTarget.style.background="rgba(239,68,68,0.07)")}>
                            <Trash2 size={12} color="#ef4444"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Footer: tổng + nút thêm */}
                <div className="flex items-center justify-between px-3 py-2.5"
                  style={{ background:"rgba(217,119,6,0.06)", borderTop:"1px solid rgba(217,119,6,0.15)" }}>
                  <div>
                    {form.khacGiaRows.length > 0 ? (
                      <span style={{ fontSize:"0.7rem", color:"#92400E", fontWeight:700 }}>
                        {form.khacGiaRows.length} dòng
                        {form.khacGiaRows.some(r=>r.giaBan&&Number(r.giaBan)>0) && (
                          <> · <span style={{ color:"#D97706" }}>{fmtShort(Math.min(...form.khacGiaRows.filter(r=>Number(r.giaBan)>0).map(r=>Number(r.giaBan))))}
                          {" – "}{fmtShort(Math.max(...form.khacGiaRows.filter(r=>Number(r.giaBan)>0).map(r=>Number(r.giaBan))))}</span></>
                        )}
                      </span>
                    ) : (
                      <span style={{ fontSize:"0.7rem", color:"#92400E" }}>Chưa có dòng nào</span>
                    )}
                  </div>
                  <button type="button" onClick={addKhacGiaRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background:"rgba(217,119,6,0.1)", border:"1.5px solid rgba(217,119,6,0.3)", cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(217,119,6,0.18)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(217,119,6,0.1)")}>
                    <Plus size={12} color="#D97706"/>
                    <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#D97706" }}>Thêm dòng</span>
                  </button>
                </div>
              </div>

              {errors.khacGiaRows && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={11} color="#D4183D"/>
                  <span style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors.khacGiaRows}</span>
                </div>
              )}
            </div>
          )}

          {/* 3c. Miễn phí */}
          {form.loaiGia === "free" && (
            <div className="space-y-4 rounded-2xl p-4" style={{ background:"rgba(15,118,110,0.03)", border:"1.5px solid rgba(15,118,110,0.18)" }}>
              <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#0F766E", display:"flex", alignItems:"center", gap:6 }}>
                <Gift size={13}/> Gói miễn phí — không thu phí
              </div>
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Khối lớp áp dụng <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <KhoiLopPicker value={form.khoiLopIds} onChange={v => set("khoiLopIds", v)} errKey="khoiLopIds"/>
                {form.khoiLopIds.length > 0 && (
                  <p style={{ fontSize:"0.68rem", color:"#0F766E", marginTop:4, fontWeight:600 }}>Đã chọn {form.khoiLopIds.length} khối lớp</p>
                )}
                <ErrMsg f="khoiLopIds"/>
              </div>

              {/* Thời gian sử dụng */}
              <div>
                <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Thời gian áp dụng <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.7rem", color:"#64748B", fontWeight:600, marginBottom:4 }}>Ngày bắt đầu</div>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={form.sdStart || ""}
                      onChange={e => set("sdStart", e.target.value)}
                      style={{
                        ...iStyle("sdStart"),
                        width:"100%",
                        padding:"10px 12px",
                        fontSize:"0.85rem",
                      }}
                      onFocus={e => Object.assign(e.target.style, fcs)}
                      onBlur={e => Object.assign(e.target.style, blr("sdStart"))}
                    />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.7rem", color:"#64748B", fontWeight:600, marginBottom:4 }}>Ngày kết thúc</div>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={form.sdEnd || ""}
                      onChange={e => set("sdEnd", e.target.value)}
                      style={{
                        ...iStyle("sdEnd"),
                        width:"100%",
                        padding:"10px 12px",
                        fontSize:"0.85rem",
                      }}
                      onFocus={e => Object.assign(e.target.style, fcs)}
                      onBlur={e => Object.assign(e.target.style, blr("sdEnd"))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* 4. Thời lượng dùng thử — chỉ cho Đồng giá / Khác giá */}
          {form.loaiGia !== "free" && (
            <div>
              <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                Thời lượng dùng thử
                <span style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:400, marginLeft:8 }}>Không bắt buộc</span>
              </label>
              <div className="relative" style={{ width:180 }}>
                <input type="number" min="1" value={form.thoiLuongThuNghiem}
                  onChange={e => set("thoiLuongThuNghiem", e.target.value)}
                  placeholder="VD: 7"
                  style={{ ...iStyle(), paddingRight:46 }}
                  onFocus={e => Object.assign(e.target.style, fcs)}
                  onBlur={e  => Object.assign(e.target.style, blr())}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600 }}>ngày</span>
              </div>
              {form.thoiLuongThuNghiem && !isNaN(Number(form.thoiLuongThuNghiem)) && Number(form.thoiLuongThuNghiem) > 0 && (
                <p style={{ fontSize:"0.68rem", color:"#005CB6", marginTop:3, fontWeight:600 }}>Dùng thử {form.thoiLuongThuNghiem} ngày</p>
              )}
            </div>
          )}

          {/* 5. Môn học */}
          <div>
            <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
              Môn học <span style={{ color:"#D4183D" }}>*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DS_MON_HOC_K12.map(mon => {
                const sel = form.monHocIds.includes(mon.id);
                return (
                  <button key={mon.id} type="button" onClick={() => toggleMon(mon.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: sel ? "rgba(0,92,182,0.08)" : "#F1F5F9",
                      border:`1.5px solid ${sel ? "#005CB6" : "#E2E8F0"}`,
                      cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif",
                    }}>
                    <span style={{ fontSize:"0.75rem", fontWeight:sel?700:500, color:sel?"#005CB6":"#64748B" }}>{mon.ten}</span>
                    {sel && <Check size={10} color="#005CB6" strokeWidth={3}/>}
                  </button>
                );
              })}
            </div>
            {form.monHocIds.length > 0 && (
              <p style={{ fontSize:"0.68rem", color:"#005CB6", marginTop:4, fontWeight:600 }}>Đã chọn {form.monHocIds.length} môn học</p>
            )}
            <ErrMsg f="monHocIds"/>
          </div>

          {/* 6. Giới hạn lựa chọn môn học */}
          <div>
            <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
              Giới hạn lựa chọn môn học
              <span style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:400, marginLeft:8 }}>Không bắt buộc — để trống = không giới hạn</span>
            </label>
            <div className="relative" style={{ width:180 }}>
              <input type="number" min="1" value={form.gioiHanMonHoc}
                onChange={e => set("gioiHanMonHoc", e.target.value)}
                placeholder="VD: 5"
                style={{ ...iStyle(), paddingRight:46 }}
                onFocus={e => Object.assign(e.target.style, fcs)}
                onBlur={e  => Object.assign(e.target.style, blr())}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600 }}>môn</span>
            </div>
          </div>

          {/* 7. Ghi chú */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151" }}>Ghi chú</label>
              <span style={{ fontSize:"0.67rem", color:"#94A3B8" }}>{ghiChuLen}/2000</span>
            </div>
            <textarea
              value={form.ghiChu}
              onChange={e => {
                if (e.target.value.length <= 2000) {
                  set("ghiChu", e.target.value);
                  setGhiChuLen(e.target.value.length);
                }
              }}
              placeholder="Nhập nội dung…"
              rows={4}
              className="w-full outline-none rounded-xl resize-none"
              style={{ border:"1.5px solid #E2E8F0", padding:"10px 14px", fontSize:"0.83rem", fontFamily:"'Be Vietnam Pro',sans-serif", background:"#F8F9FA", lineHeight:1.6 }}
              onFocus={e => { e.target.style.borderColor="#005CB6"; e.target.style.background="#fff"; e.target.style.boxShadow="0 0 0 3px rgba(0,92,182,0.08)"; }}
              onBlur={e  => { e.target.style.borderColor="#E2E8F0"; e.target.style.background="#F8F9FA"; e.target.style.boxShadow="none"; }}
            />
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
          <button onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
            style={{ background:"#F1F5F9", border:"1.5px solid #E2E8F0", color:"#64748B", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
            Hủy bỏ
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl"
            style={{ background:saving?"#94A3B8":"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.85rem", fontWeight:800, cursor:saving?"not-allowed":"pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow:saving?"none":"0 4px 14px rgba(0,92,182,0.4)" }}>
            {saving
              ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Đang tạo…</>
              : <><Rocket size={15}/> Tạo gói cước</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL FORM ────────────────────────────────────────────────────────────────

function ModalGoiCuoc({ mode, goiEdit, allGoi, onClose, onSave, userRole }: {
  mode: "add"|"edit"; goiEdit: GoiCuoc|null;
  allGoi: GoiCuoc[]; onClose: () => void;
  onSave: (f: FormState) => void;
  userRole: UserRole;
}) {
  const [form, setForm] = useState<FormState>(goiEdit ? {
    ctHocIds: [],
    tenGoi: goiEdit.tenGoi, phanLoai: goiEdit.phanLoai,
    thoiLuongThuNghiem: String(goiEdit.thoiLuongThuNghiem),
    thoiLuongSuDung: String(goiEdit.thoiLuongSuDung),
    sdStart: "", sdEnd: "", tnStart: "", tnEnd: "",
    maBCSS: goiEdit.maBCSS, loaiGia: goiEdit.loaiGia,
    lopIds: [], giaGoc: "", khacGiaData: {},
    giaFrom: String(goiEdit.giaFrom), giaTo: String(goiEdit.giaTo),
    quotaToiDa: String(goiEdit.quotaToiDa), trangThai: goiEdit.trangThai,
    ghiChu: goiEdit.ghiChu, chuongTrinhIds: [...goiEdit.chuongTrinhIds],
    monHocIds: [...(goiEdit.monHocIds || [])],
    gioiHanMonHoc: "",
  } : { ...FORM_RONG });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);
  const [step, setStep]       = useState<1|2|3>(1);
  const set = (k: keyof FormState, v: string|string[]) => setForm(f => ({ ...f, [k]: v }));

  /* ── Validation theo bước ── */
  const validateStep1 = () => {
    const e: Record<string,string> = {};
    if (!form.tenGoi.trim()) e.tenGoi = "Tên gói không được để trống";
    else {
      const dup = allGoi.find(g => g.tenGoi.trim().toLowerCase() === form.tenGoi.trim().toLowerCase() && g.id !== goiEdit?.id);
      if (dup) e.tenGoi = "Tên gói đã tồn tại, vui lòng chọn tên khác";
    }
    if (!form.sdStart || !form.sdEnd) e.sdStart = "Vui lòng chọn thời lượng sử dụng";
    if (form.tnStart && !form.tnEnd) e.tnStart = "Vui lòng chọn ngày kết thúc dùng thử";
    // Tính thoiLuongSuDung / ThuNghiem để các logic sau dùng
    const sdS = parseDMY(form.sdStart), sdE = parseDMY(form.sdEnd);
    const tnS = parseDMY(form.tnStart), tnE = parseDMY(form.tnEnd);
    if (!e.sdStart && sdS && sdE && tnS && tnE && tnE > sdE)
      e.tnStart = "Ngày kết thúc dùng thử không được vượt quá ngày kết thúc gói cước";
    if (!form.quotaToiDa || Number(form.quotaToiDa) <= 0) e.quotaToiDa = "Hạn mức phải > 0";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string,string> = {};
    if (form.lopIds.length === 0) e.lopIds = "Vui lòng chọn ít nhất 1 khối lớp áp dụng";
    if (form.maBCSS.trim() && allGoi.find(g => g.maBCSS===form.maBCSS.trim() && g.id!==goiEdit?.id)) e.maBCSS = "Mã BCCS đã tồn tại";
    if (form.loaiGia === "dong-gia") {
      if (!form.giaFrom || Number(form.giaFrom) <= 0) e.giaFrom = "Giá bán không hợp lệ";
    } else if (form.loaiGia === "khac-gia") {
      const missing = form.lopIds.some(id => !form.khacGiaData[id]?.giaBan || Number(form.khacGiaData[id].giaBan) <= 0);
      if (form.lopIds.length === 0) e.khacGia = "Vui lòng chọn khối lớp trước";
      else if (missing) e.khacGia = "Vui lòng nhập giá bán cho tất cả các khối lớp đã chọn";
    }
    return e;
  };

  const validateStep3 = () => {
    const e: Record<string,string> = {};
    if (form.monHocIds.length === 0) e.monHocIds = "Vui lòng liên kết ít nhất 1 môn học";
    if (form.gioiHanMonHoc && (isNaN(Number(form.gioiHanMonHoc)) || Number(form.gioiHanMonHoc) < 1))
      e.gioiHanMonHoc = "Giới hạn phải là số nguyên ≥ 1";
    return e;
  };

  const handleNext = () => {
    const e = step===1 ? validateStep1() : validateStep2();
    setErrors(e);
    if (!Object.keys(e).length) {
      // Nếu sang bước 2 mà chưa chọn BCCS → tự động chuyển sang Free
      if (step === 1 && !form.maBCSS.trim()) {
        setForm(f => ({ ...f, loaiGia: "free" }));
      }
      setStep(s => (s+1) as 1|2|3);
    }
  };

  const handleSubmit = () => {
    const allE = { ...validateStep1(), ...validateStep2(), ...validateStep3() };
    if (Object.keys(allE).length) { setErrors(allE); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(form); }, 700);
  };

  const iStyle = (k?: string): React.CSSProperties => ({
    border: `1.5px solid ${errors[k||""]?"#D4183D":"#E2E8F0"}`,
    padding:"10px 14px", fontSize:"0.85rem", background:"#F8F9FA",
    borderRadius:12, outline:"none", width:"100%", fontFamily:"'Be Vietnam Pro',sans-serif",
  });
  const fcs = { borderColor:"#005CB6", background:"#fff", boxShadow:"0 0 0 3px rgba(0,92,182,0.08)" };
  const blr = (k?: string) => ({ borderColor: errors[k||""]?"#D4183D":"#E2E8F0", background:"#F8F9FA", boxShadow:"none" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background:"rgba(15,23,42,0.58)", backdropFilter:"blur(6px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: step === 3 ? 780 : 680, maxHeight:"94vh", background:"#fff", boxShadow:"0 32px 80px rgba(0,0,0,0.28)", fontFamily:"'Be Vietnam Pro',sans-serif", transition:"width 0.2s ease" }}>

        {/* ══ HEADER ══ */}
        <div className="flex-shrink-0 px-7 pt-6 pb-5"
          style={{ background:"linear-gradient(135deg,#004A9B 0%,#005CB6 45%,#0074E4 100%)" }}>

          {/* Title row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl" style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)" }}>
                <Tags size={20} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize:"1.05rem", fontWeight:900, color:"#fff", lineHeight:1.2 }}>
                  {mode==="add" ? "Thiết lập Gói cước mới" : `Chỉnh sửa: ${goiEdit?.tenGoi}`}
                </div>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.7)", marginTop:3 }}>
                  Bước {step} / {STEPS.length} · {STEPS[step-1].label}
                </div>
              </div>
            </div>
            <button onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
              style={{ background:"rgba(255,255,255,0.12)", border:"none", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.22)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.12)")}>
              <X size={16} color="#fff"/>
            </button>
          </div>

          {/* Step indicator */}
          <StepIndicator current={step}/>
        </div>

        {/* ══ BODY ══ */}
        <div className="flex-1 overflow-y-auto">

          {/* ── BƯỚC 1: THÔNG TIN CHUNG ── */}
          {step === 1 && (
            <div className="px-7 py-6 space-y-5">

              {/* Chương trình học */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Chương trình học <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <div style={{ border:"1.5px solid #E2E8F0", borderRadius:10, overflow:"hidden" }}>
                  {/* Search inside */}
                  <CtHocPicker
                    value={form.ctHocIds}
                    onChange={ids => set("ctHocIds", ids)}
                  />
                </div>
                {errors.ctHocIds && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle size={12} color="#D4183D"/>
                    <p style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors.ctHocIds}</p>
                  </div>
                )}
              </div>

              {/* Tên gói */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Tên gói cước <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <input type="text" value={form.tenGoi} onChange={e => set("tenGoi",e.target.value)}
                  placeholder="VD: Gói học tập Tiểu học 2025"
                  style={iStyle("tenGoi")}
                  onFocus={e => Object.assign(e.target.style, fcs)}
                  onBlur={e  => Object.assign(e.target.style, blr("tenGoi"))}
                />
                {errors.tenGoi && (
                  <div className="flex items-center gap-1.5 mt-2"><AlertCircle size={12} color="#D4183D"/>
                    <p style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors.tenGoi}</p>
                  </div>
                )}
              </div>

              {/* Chọn Gói cước BCCS */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:4 }}>
                  Chọn Gói cước từ hệ thống BCCS
                </label>
                <p style={{ fontSize:"0.68rem", color:"#64748B", marginBottom:10 }}>
                  Danh sách mã gói được tải trực tiếp từ API BCCS. Chọn mã để tự động điền thông tin.
                </p>

                {/* Dropdown chọn gói từ API BCCS */}
                <MaBCSSSelect
                  value={form.maBCSS}
                  onChange={v => { set("maBCSS", v); }}
                />

                {/* Info box sau khi chọn */}
                {form.maBCSS ? (() => {
                  const pkg = DEMO_MA_BCSS.find(m => m.ma === form.maBCSS);
                  return (
                    <div className="flex items-start gap-2.5 mt-3 px-4 py-3.5 rounded-xl"
                      style={{ background:"rgba(0,92,182,0.06)", border:"1.5px solid rgba(0,92,182,0.2)" }}>
                      <ShieldCheck size={14} color="#005CB6" className="flex-shrink-0 mt-0.5"/>
                      <div style={{ flex:1 }}>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <code style={{ fontFamily:"monospace", fontSize:"0.78rem", fontWeight:900, color:"#005CB6",
                            background:"rgba(0,92,182,0.1)", padding:"2px 8px", borderRadius:6, letterSpacing:"0.04em" }}>
                            {form.maBCSS}
                          </code>
                        </div>
                        <p style={{ fontSize:"0.71rem", color:"#005CB6", lineHeight:1.65, fontWeight:500 }}>
                          {pkg?.moTa} — Khi lưu, hệ thống BCCS sẽ tự động ghi nhận và trừ 1 quota cho gói này.
                        </p>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="flex items-start gap-2.5 mt-3 px-4 py-3 rounded-xl"
                    style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
                    <Info size={14} color="#94A3B8" className="flex-shrink-0 mt-0.5"/>
                    <p style={{ fontSize:"0.71rem", color:"#94A3B8", lineHeight:1.65 }}>
                      Chưa chọn mã gói. Vui lòng chọn từ danh sách BCCS để điền thông tin tự động.
                    </p>
                  </div>
                )}
              </div>

              {/* Thời lượng */}
              <div className="grid grid-cols-1 gap-4">
                <DateRangePicker
                  label="Thời lượng sử dụng" required
                  startValue={form.sdStart} endValue={form.sdEnd}
                  onStartChange={v => set("sdStart", v)} onEndChange={v => set("sdEnd", v)}
                  error={errors.sdStart}
                />
                <DateRangePicker
                  label="Thời gian sử dụng thử"
                  startValue={form.tnStart} endValue={form.tnEnd}
                  onStartChange={v => set("tnStart", v)} onEndChange={v => set("tnEnd", v)}
                  error={errors.tnStart}
                />
              </div>

              {/* Preview tóm tắt */}
              {form.tenGoi && form.sdStart && form.sdEnd && (
                <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"#F8FAFB", border:"1.5px solid #EEF0F4" }}>
                  <Tags size={16} color="#005CB6"/>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#0F172A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{form.tenGoi}</div>
                    <div style={{ fontSize:"0.67rem", color:"#64748B", marginTop:2 }}>
                      {form.maBCSS && <span className="inline-flex items-center gap-1 mr-3" style={{ color:"#005CB6", fontWeight:700, fontFamily:"monospace" }}>{form.maBCSS}</span>}
                      {form.tnStart && form.tnEnd && <span className="mr-3">🎁 Dùng thử: {form.tnStart} → {form.tnEnd}</span>}
                      <span>📅 {form.sdStart} → {form.sdEnd}</span>
                    </div>
                  </div>
                  <CheckCircle size={16} color="#059669"/>
                </div>
              )}
            </div>
          )}

          {/* ── BƯỚC 2: CẤU HÌNH GIÁ VÀ ĐỐI TƯỢNG ── */}
          {step === 2 && (
            <div className="px-7 py-6 space-y-6">
              {/* Summary from step 1 */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background:"rgba(0,92,182,0.06)", border:"1px solid rgba(0,92,182,0.18)" }}>
                <Tags size={16} color="#005CB6"/>
                <div className="flex-1">
                  <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#005CB6" }}>{form.tenGoi}</div>
                  <div style={{ fontSize:"0.67rem", color:"#64748B" }}>{form.maBCSS && <span style={{ fontFamily:"monospace", marginRight:6 }}>{form.maBCSS}</span>}{form.sdStart && form.sdEnd ? `${form.sdStart} → ${form.sdEnd}` : ""}{form.tnStart && form.tnEnd ? ` · Thử: ${form.tnStart} → ${form.tnEnd}` : ""}</div>
                </div>
              </div>

              {/* ── PHẦN 1: CẤU HÌNH LỚP ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-md" style={{ background:"rgba(0,92,182,0.1)" }}>
                    <span style={{ fontSize:"0.6rem", fontWeight:900, color:"#005CB6" }}>1</span>
                  </div>
                  <label style={{ fontSize:"0.82rem", fontWeight:800, color:"#0F172A" }}>
                    Cấu hình Khối lớp <span style={{ color:"#D4183D" }}>*</span>
                  </label>
                  <span style={{ fontSize:"0.68rem", color:"#94A3B8", fontWeight:400 }}>Chọn các khối lớp được áp dụng gói cước này</span>
                </div>
                <LopSelector value={form.lopIds} onChange={v => set("lopIds", v)}/>
                {errors.lopIds && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background:"rgba(212,24,61,0.06)", border:"1px solid rgba(212,24,61,0.18)" }}>
                    <AlertCircle size={12} color="#D4183D"/>
                    <p style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors.lopIds}</p>
                  </div>
                )}
              </div>

              {/* ── PHẦN 2: CẤU HÌNH GIÁ ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-md" style={{ background:"rgba(0,92,182,0.1)" }}>
                    <span style={{ fontSize:"0.6rem", fontWeight:900, color:"#005CB6" }}>2</span>
                  </div>
                  <label style={{ fontSize:"0.82rem", fontWeight:800, color:"#0F172A" }}>
                    Cấu hình Giá <span style={{ color:"#D4183D" }}>*</span>
                  </label>
                  <span style={{ fontSize:"0.68rem", color:"#94A3B8", fontWeight:400 }}>Chọn loại giá và nhập mức giá áp dụng</span>
                </div>

                {/* Notice khi không có BCCS */}
                {!form.maBCSS.trim() && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background:"rgba(217,119,6,0.06)", border:"1px solid rgba(217,119,6,0.22)" }}>
                    <AlertCircle size={14} color="#D97706" style={{ flexShrink:0, marginTop:1 }}/>
                    <p style={{ fontSize:"0.71rem", color:"#92400E", lineHeight:1.6, fontWeight:500, margin:0 }}>
                      Bạn chưa liên kết mã <strong>BCCS</strong>. Gói cước chỉ có thể áp dụng kiểu{" "}
                      <strong>Miễn phí</strong>. Quay lại Bước 1 để chọn mã BCCS nếu muốn cấu hình giá có phí.
                    </p>
                  </div>
                )}

                {/* 3 Radio cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  {DS_LG.map(lg => {
                    const c = LG_CFG[lg]; const Ic = c.icon; const sel = form.loaiGia === lg;
                    const noBcss = !form.maBCSS.trim();
                    const locked = noBcss && lg !== "free";
                    return (
                      <button key={lg} type="button"
                        onClick={() => !locked && set("loaiGia", lg)}
                        disabled={locked}
                        title={locked ? "Yêu cầu liên kết mã BCCS ở Bước 1" : undefined}
                        className="relative flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all"
                        style={{
                          background: locked ? "#F1F5F9" : sel ? c.bg : "#F8FAFB",
                          border: `2px solid ${locked ? "#E2E8F0" : sel ? c.color : "#E2E8F0"}`,
                          cursor: locked ? "not-allowed" : "pointer",
                          opacity: locked ? 0.5 : 1,
                          fontFamily:"'Be Vietnam Pro',sans-serif",
                          boxShadow: sel && !locked ? `0 4px 14px ${c.color}22` : "none",
                        }}>
                        {sel && !locked && (
                          <div className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full" style={{ background:c.color }}>
                            <Check size={9} color="#fff" strokeWidth={3}/>
                          </div>
                        )}
                        {locked && (
                          <div className="absolute top-2 right-2">
                            <Lock size={11} color="#94A3B8"/>
                          </div>
                        )}
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: sel && !locked ? c.color : "#E2E8F0" }}>
                          <Ic size={17} color={sel && !locked ? "#fff" : "#94A3B8"}/>
                        </div>
                        <span style={{ fontSize:"0.82rem", fontWeight:800, color: sel && !locked ? c.color : locked ? "#94A3B8" : "#374151" }}>{c.label}</span>
                        <span style={{ fontSize:"0.62rem", color:"#94A3B8", textAlign:"center", lineHeight:1.4 }}>{locked ? "Cần mã BCCS" : c.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Miễn phí ── */}
                {form.loaiGia === "free" && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background:"rgba(15,118,110,0.06)", border:"1px solid rgba(15,118,110,0.2)" }}>
                    <Gift size={15} color="#0F766E"/>
                    <div>
                      <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#0F766E" }}>Gói miễn phí — không thu phí</div>
                      <div style={{ fontSize:"0.67rem", color:"#0F766E", opacity:0.8 }}>Áp dụng đồng đều cho tất cả {form.lopIds.length > 0 ? `${form.lopIds.length} khối lớp đã chọn` : "các khối lớp được chọn"}</div>
                    </div>
                  </div>
                )}

                {/* ── Đồng giá: 2 ô nhập (Giá gốc + Giá bán) ── */}
                {form.loaiGia === "dong-gia" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ background:"rgba(0,92,182,0.05)", border:"1px solid rgba(0,92,182,0.12)" }}>
                      <Info size={12} color="#005CB6" className="flex-shrink-0 mt-0.5"/>
                      <span style={{ fontSize:"0.68rem", color:"#005CB6", fontWeight:500 }}>
                        Một mức giá áp dụng đồng đều cho <strong>tất cả {form.lopIds.length > 0 ? `${form.lopIds.length} khối lớp` : "các khối lớp"}</strong> đã chọn bên trên.
                      </span>
                    </div>
                    {/* Giá bán */}
                    <div>
                      <label style={{ fontSize:"0.76rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                        Giá bán (VNĐ) <span style={{ color:"#D4183D" }}>*</span>
                      </label>
                      <div className="relative">
                        <input type="number" min="1" value={form.giaFrom}
                          onChange={e => set("giaFrom", e.target.value)}
                          placeholder="200000"
                          style={{ ...iStyle("giaFrom"), paddingRight:52 }}
                          onFocus={e=>Object.assign(e.target.style,fcs)}
                          onBlur={e=>Object.assign(e.target.style,blr("giaFrom"))}/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize:"0.65rem", color:"#94A3B8", fontWeight:600 }}>VNĐ</span>
                      </div>
                      {errors.giaFrom && <p style={{ fontSize:"0.67rem", color:"#D4183D", marginTop:2 }}>{errors.giaFrom}</p>}
                      {form.giaFrom && !isNaN(Number(form.giaFrom)) && Number(form.giaFrom) > 0 && (
                        <p style={{ fontSize:"0.67rem", color:"#005CB6", marginTop:3, fontWeight:700 }}>{fmt(Number(form.giaFrom))}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Khác giá: nhập giá riêng từng lớp ── */}
                {form.loaiGia === "khac-gia" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg" style={{ background:"rgba(217,119,6,0.06)", border:"1px solid rgba(217,119,6,0.18)" }}>
                      <Info size={12} color="#D97706" className="flex-shrink-0 mt-0.5"/>
                      <span style={{ fontSize:"0.68rem", color:"#D97706", fontWeight:500 }}>
                        Mỗi lớp được thiết lập <strong>Giá bán</strong> riêng theo từng khối lớp.
                      </span>
                    </div>

                    {form.lopIds.length === 0 ? (
                      <div className="flex items-center gap-2.5 p-4 rounded-xl" style={{ background:"rgba(251,191,36,0.07)", border:"1.5px dashed rgba(217,119,6,0.3)" }}>
                        <AlertCircle size={16} color="#D97706"/>
                        <span style={{ fontSize:"0.78rem", color:"#D97706", fontWeight:600 }}>Vui lòng chọn khối lớp ở Phần 1 trước khi nhập giá</span>
                      </div>
                    ) : (
                      <div className="rounded-xl overflow-hidden" style={{ border:"1.5px solid #E2E8F0" }}>
                        {/* Header */}
                        <div className="grid gap-2 px-3.5 py-2.5" style={{ gridTemplateColumns:"110px 1fr", background:"#F8FAFC", borderBottom:"1px solid #EEF0F4" }}>
                          <span style={{ fontSize:"0.66rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em" }}>Lớp</span>
                          <span style={{ fontSize:"0.66rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em" }}>Giá bán (VNĐ) <span style={{ color:"#D4183D" }}>*</span></span>
                        </div>
                        {/* Rows */}
                        {form.lopIds.map((lopId, idx) => {
                          const lop = DS_LOP.find(l => l.id === lopId)!;
                          const cap = CAP_CFG[lop.cap];
                          const entry = form.khacGiaData[lopId] || { giaGoc:"", giaBan:"" };
                          const updateEntry = (field: keyof KhacGiaEntry, val: string) =>
                            setForm(f => ({ ...f, khacGiaData: { ...f.khacGiaData, [lopId]: { ...entry, [field]: val } } }));
                          return (
                            <div key={lopId} className="grid gap-2 px-3.5 py-2.5 items-center"
                              style={{ gridTemplateColumns:"110px 1fr", borderTop: idx > 0 ? "1px solid #EEF0F4" : "none", background: idx%2===0?"#fff":"#FAFBFC" }}>
                              <span className="inline-flex items-center">
                                <span className="px-2 py-1 rounded-lg" style={{ background:cap.bg, border:`1px solid ${cap.border}`, fontSize:"0.72rem", fontWeight:700, color:cap.color }}>
                                  {lop.ten}
                                </span>
                              </span>
                              {/* Giá bán */}
                              <div className="relative">
                                <input type="number" min="1" value={entry.giaBan}
                                  onChange={e => updateEntry("giaBan", e.target.value)}
                                  placeholder="Bắt buộc"
                                  style={{ border:`1.5px solid ${!entry.giaBan && errors.khacGia ? "#D4183D" : "#E2E8F0"}`, padding:"7px 40px 7px 10px", fontSize:"0.78rem", background:"#F8F9FA", borderRadius:8, outline:"none", width:"100%", fontFamily:"'Be Vietnam Pro',sans-serif" }}
                                  onFocus={e => Object.assign(e.target.style, fcs)}
                                  onBlur={e => Object.assign(e.target.style, { borderColor: !entry.giaBan && errors.khacGia?"#D4183D":"#E2E8F0", background:"#F8F9FA", boxShadow:"none" })}/>
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ fontSize:"0.6rem", color:"#94A3B8", fontWeight:600 }}>VNĐ</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {errors.khacGia && (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background:"rgba(212,24,61,0.06)", border:"1px solid rgba(212,24,61,0.18)" }}>
                        <AlertCircle size={12} color="#D4183D"/>
                        <p style={{ fontSize:"0.68rem", color:"#D4183D", fontWeight:600 }}>{errors.khacGia}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trạng thái */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:7 }}>Trạng thái</label>
                <div className="flex gap-2">
                  {(["Đang hoạt động","Tạm dừng"] as TrangThai[]).map(ts => {
                    const c = TS_CFG[ts]; const sel = form.trangThai===ts;
                    return (
                      <button key={ts} type="button" onClick={()=>set("trangThai",ts)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                        style={{ background: sel?c.bg:"#F8F9FA", border:`1.5px solid ${sel?c.dot:"#E2E8F0"}`, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: sel?c.dot:"#CBD5E1" }}/>
                        <span style={{ fontSize:"0.8rem", fontWeight: sel?700:400, color: sel?c.color:"#64748B" }}>{ts}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Ghi chú</label>
                <textarea value={form.ghiChu} onChange={e=>set("ghiChu",e.target.value)}
                  placeholder="Mô tả gói cước, phạm vi áp dụng, lưu ý đặc biệt…"
                  rows={2} className="w-full outline-none rounded-xl resize-none"
                  style={{ border:"1.5px solid #E2E8F0", padding:"10px 14px", fontSize:"0.83rem", fontFamily:"'Be Vietnam Pro',sans-serif", background:"#F8F9FA", lineHeight:1.6 }}
                  onFocus={e=>{e.target.style.borderColor="#005CB6";e.target.style.background="#fff";e.target.style.boxShadow="0 0 0 3px rgba(0,92,182,0.08)";}}
                  onBlur={e=>{e.target.style.borderColor="#E2E8F0";e.target.style.background="#F8F9FA";e.target.style.boxShadow="none";}}
                />
              </div>
            </div>
          )}

          {/* ── BƯỚC 3: LIÊN KẾT MÔN HỌC ── */}
          {step === 3 && (
            <div className="px-7 py-6 space-y-5">

              {/* Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151" }}>
                    Danh sách Môn học <span style={{ color:"#D4183D" }}>*</span>
                  </label>
                  <span style={{ fontSize:"0.68rem", color:"#94A3B8" }}>
                    {DS_MON_HOC_K12.length} môn học trong hệ thống K12Home
                  </span>
                </div>
                <MonHocTable
                  value={form.monHocIds}
                  onChange={v => setForm(f => ({ ...f, monHocIds: v }))}
                  selectedLopIds={form.lopIds}
                />
                {errors.monHocIds && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl" style={{ background:"rgba(212,24,61,0.06)", border:"1px solid rgba(212,24,61,0.2)" }}>
                    <AlertCircle size={13} color="#D4183D"/>
                    <p style={{ fontSize:"0.72rem", color:"#D4183D", fontWeight:600 }}>{errors.monHocIds}</p>
                  </div>
                )}
              </div>

              {/* Giới hạn lựa chọn môn học */}
              <div className="rounded-xl p-4" style={{ background:"rgba(0,92,182,0.03)", border:"1.5px solid rgba(0,92,182,0.12)" }}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mt-0.5" style={{ background:"rgba(0,92,182,0.1)" }}>
                    <Hash size={13} color="#005CB6"/>
                  </div>
                  <div className="flex-1">
                    <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:4 }}>
                      Giới hạn lựa chọn môn học
                      <span style={{ fontSize:"0.62rem", color:"#94A3B8", fontWeight:400, marginLeft:6 }}>Không bắt buộc — để trống = không giới hạn</span>
                    </label>
                    <p style={{ fontSize:"0.68rem", color:"#64748B", lineHeight:1.6, marginBottom:10 }}>
                      Khi học sinh mua gói này, họ chỉ được học tối đa <strong>số môn</strong> bạn khai báo từ danh sách đã liên kết bên dưới.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative" style={{ width:140 }}>
                        <input
                          type="number" min="1"
                          value={form.gioiHanMonHoc}
                          onChange={e => set("gioiHanMonHoc", e.target.value)}
                          placeholder="VD: 5"
                          style={{ ...iStyle("gioiHanMonHoc"), paddingRight:52 }}
                          onFocus={e => Object.assign(e.target.style, fcs)}
                          onBlur={e  => Object.assign(e.target.style, blr("gioiHanMonHoc"))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize:"0.62rem", color:"#94A3B8", fontWeight:600, whiteSpace:"nowrap" }}>môn</span>
                      </div>
                      {form.gioiHanMonHoc && Number(form.gioiHanMonHoc) >= 1 && !errors.gioiHanMonHoc && (
                        <span style={{ fontSize:"0.71rem", color:"#005CB6", fontWeight:700 }}>
                          → Học sinh chọn tối đa {Number(form.gioiHanMonHoc).toLocaleString("vi-VN")} / {form.monHocIds.length} môn học
                        </span>
                      )}
                      {!form.gioiHanMonHoc && (
                        <span style={{ fontSize:"0.71rem", color:"#94A3B8", fontWeight:500 }}>→ Không giới hạn (học sinh được học tất cả môn)</span>
                      )}
                    </div>
                    {errors.gioiHanMonHoc && (
                      <p style={{ fontSize:"0.67rem", color:"#D4183D", marginTop:4 }}>{errors.gioiHanMonHoc}</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ══ FOOTER ══ */}
        <div className="flex items-center justify-between px-7 py-4 flex-shrink-0" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
          <button onClick={step===1 ? onClose : () => setStep(s=>(s-1) as 1|2|3)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
            style={{ background:"#F1F5F9", border:"1.5px solid #E2E8F0", color:"#64748B", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
            {step===1 ? "Hủy bỏ" : "← Quay lại"}
          </button>

          {step < 3 ? (
            <button
              onClick={() => {
                const raw = step === 1 ? validateStep1() : validateStep2();
                const e: Record<string,string> = { ...raw };
                delete e.maBCSS;
                setErrors(e);
                if (!Object.keys(e).length) setStep(s => (s + 1) as 1|2|3);
              }}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl"
              style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.85rem", fontWeight:800, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow:"0 4px 14px rgba(0,92,182,0.4)", letterSpacing:"0.01em" }}>
              Tiếp theo <ChevronRight size={16}/>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl"
              style={{ background: saving?"#94A3B8":"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.85rem", fontWeight:800, cursor: saving?"not-allowed":"pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow: saving?"none":"0 4px 14px rgba(0,92,182,0.4)" }}>
              {saving
                ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>Đang kích hoạt…</>
                : mode==="add"
                  ? <><Rocket size={15}/> Tạo gói cước</>
                  : <><CheckCircle size={15}/> Lưu thay đổi</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DRAWER CHI TIẾT ───────────────────────────────────────────────────────────

function DrawerChiTiet({ goi, onClose, onEdit }: { goi: GoiCuoc; onClose: ()=>void; onEdit: ()=>void }) {
  const [tab, setTab] = useState<"tongquan"|"donvi"|"noidung">("tongquan");

  const cts = goi.chuongTrinhIds.map(id=>DS_CHUONG_TRINH_HOC_PAGE.find(c=>c.id===id)).filter(Boolean);
  const linkedMonHoc = (goi.monHocIds||[]).map(id=>DS_MON_HOC_K12.find(m=>m.id===id)).filter(Boolean) as MonHocK12[];
  const pct = Math.round((goi.soGoiNoiDungDaDung / Math.max(goi.quotaToiDa,1))*100);
  const donViGan = goi.donViGan || [];

  const tsTT = { "Đang dùng":{ color:"#0F766E", bg:"rgba(15,118,110,0.08)", dot:"#0F766E" }, "Hết hạn":{ color:"#D4183D", bg:"rgba(212,24,61,0.07)", dot:"#D4183D" }, "Chưa kích hoạt":{ color:"#9CA3AF", bg:"rgba(156,163,175,0.1)", dot:"#9CA3AF" } };

  const tongHocSinh = donViGan.reduce((s,d)=>s+d.soHocSinh,0);
  const tongLicense = donViGan.reduce((s,d)=>s+d.soLicenseDaDung,0);
  const tongTiet = donViGan.reduce((s,d)=>s+d.soTietDaHoc,0);

  const TABS = [
    { key:"tongquan", label:"Tổng quan" },
    { key:"donvi",    label:`Đơn vị (${donViGan.length})` },
    { key:"noidung",  label:"Sử dụng nội dung" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background:"rgba(15,23,42,0.42)", backdropFilter:"blur(3px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="flex flex-col h-full" style={{ width:540, background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.14)", fontFamily:"'Be Vietnam Pro',sans-serif", animation:"slideIn 0.22s ease" }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="px-5 py-5 flex-shrink-0" style={{ background:"linear-gradient(135deg,#004A9B 0%,#005CB6 45%,#0074E4 100%)", color:"#fff" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl" style={{ background:"rgba(255,255,255,0.18)" }}>
                <Tags size={20} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.1em", opacity:0.72, textTransform:"uppercase", marginBottom:2 }}>Chi tiết Gói cước</div>
                <div style={{ fontSize:"1.05rem", fontWeight:800, lineHeight:1.3 }}>{goi.tenGoi}</div>
                <div style={{ fontSize:"0.72rem", opacity:0.75, marginTop:2, fontFamily:"monospace" }}>{goi.maBCSS}</div>
              </div>
            </div>
            <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer" }}><X size={15} color="#fff"/></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label:"Giá tiền",   val: goi.loaiGia==="free"?"Miễn phí":goi.loaiGia==="khac-gia"?`${fmtShort(goi.giaFrom)}–${fmtShort(goi.giaTo)}`:fmtShort(goi.giaFrom) },
              { label:"Dùng thử",  val: goi.thoiLuongThuNghiem>0?`${goi.thoiLuongThuNghiem} ngày`:"Không có" },
              { label:"Sử dụng",   val: `${goi.thoiLuongSuDung} tháng` },
              { label:"Đơn vị",    val: `${donViGan.length} trường` },
            ].map(c=>(
              <div key={c.label} className="rounded-xl p-2.5" style={{ background:"rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize:"0.58rem", opacity:0.72, marginBottom:3 }}>{c.label}</div>
                <div style={{ fontSize:"0.88rem", fontWeight:800 }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0" style={{ borderBottom:"2px solid #EEF0F4", background:"#fff" }}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{ flex:1, padding:"11px 8px", border:"none", background:"transparent", cursor:"pointer",
                fontSize:"0.78rem", fontWeight: tab===t.key?700:500,
                color: tab===t.key?"#005CB6":"#64748B",
                borderBottom: tab===t.key?"2.5px solid #005CB6":"2.5px solid transparent",
                marginBottom:-2, transition:"all 0.15s", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Nội dung tab ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ===== TAB: TỔNG QUAN ===== */}
          {tab==="tongquan" && <>
            {/* Trạng thái + mã */}
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background:"rgba(0,92,182,0.05)", border:"1.5px solid rgba(0,92,182,0.18)" }}>
              <div className="flex items-center gap-2">
                <Database size={15} color="#005CB6"/>
                <div>
                  <div style={{ fontSize:"0.65rem", color:"#94A3B8", marginBottom:1 }}>Mã gói BCCS</div>
                  <div style={{ fontSize:"0.95rem", fontWeight:900, color:"#005CB6", fontFamily:"monospace" }}>{goi.maBCSS}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20,
                  background:TS_CFG[goi.trangThai].bg, fontSize:"0.72rem", fontWeight:700, color:TS_CFG[goi.trangThai].color }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:TS_CFG[goi.trangThai].dot, display:"inline-block" }}/>
                  {goi.trangThai}
                </span>
                <button onClick={()=>navigator.clipboard.writeText(goi.maBCSS)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                  style={{ background:"rgba(0,92,182,0.08)", border:"1px solid rgba(0,92,182,0.15)", cursor:"pointer" }}>
                  <Code2 size={11} color="#005CB6"/><span style={{ fontSize:"0.64rem", color:"#005CB6", fontWeight:600 }}>Copy</span>
                </button>
              </div>
            </div>

            {/* Quota bar */}
            <div className="rounded-2xl p-4" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize:"0.67rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Hạn mức Quota</span>
                <span style={{ fontSize:"0.78rem", fontWeight:700, color: pct>=80?"#D4183D":"#005CB6" }}>{pct}% đã dùng</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height:8, background:"#E2E8F0" }}>
                <div className="rounded-full" style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:pct>=80?"#D4183D":"#005CB6", transition:"width 0.6s ease" }}/>
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ fontSize:"0.65rem", color:"#94A3B8" }}>Đã gắn: {goi.soGoiNoiDungDaDung.toLocaleString()}</span>
                <span style={{ fontSize:"0.65rem", color:"#94A3B8" }}>Tổng: {goi.quotaToiDa.toLocaleString()}</span>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
              <p style={{ fontSize:"0.67rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Thông tin gói</p>
              {[
                { label:"Loại giá",            val:LG_CFG[goi.loaiGia].label, color:LG_CFG[goi.loaiGia].color },
                { label:"Thời lượng dùng thử", val:goi.thoiLuongThuNghiem>0?`${goi.thoiLuongThuNghiem} ngày`:"Không có", color:"#64748B" },
                { label:"Thời lượng sử dụng",  val:`${goi.thoiLuongSuDung} tháng`, color:"#005CB6" },
                { label:"Ngày tạo",            val:goi.ngayTao, color:"#64748B" },
              ].map(it=>(
                <div key={it.label} className="flex items-center justify-between">
                  <span style={{ fontSize:"0.73rem", color:"#94A3B8" }}>{it.label}</span>
                  <span style={{ fontSize:"0.82rem", fontWeight:700, color:it.color }}>{it.val}</span>
                </div>
              ))}
            </div>

            {/* Môn học liên kết */}
            <div className="rounded-2xl p-4" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} color="#005CB6"/>
                  <p style={{ fontSize:"0.67rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Môn học liên kết</p>
                </div>
                <span className="px-2 py-0.5 rounded-full" style={{ background:"rgba(0,92,182,0.1)", fontSize:"0.65rem", fontWeight:800, color:"#005CB6" }}>{linkedMonHoc.length} môn</span>
              </div>
              {linkedMonHoc.length===0 ? (
                <div className="flex items-center gap-2 py-1"><BookMarked size={14} color="#CBD5E1"/><span style={{ fontSize:"0.73rem", color:"#94A3B8" }}>Chưa liên kết môn học nào</span></div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {linkedMonHoc.map(mon=>(
                    <div key={mon.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background:"#fff", border:"1px solid rgba(0,92,182,0.15)" }}>
                      <span style={{ fontFamily:"monospace", fontSize:"0.62rem", fontWeight:800, color:"#005CB6", background:"rgba(0,92,182,0.08)", padding:"1px 5px", borderRadius:4 }}>{mon.ma}</span>
                      <span style={{ fontSize:"0.75rem", fontWeight:600, color:"#0F172A" }}>{mon.ten}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chương trình */}
            {cts.length>0 && (
              <div className="rounded-2xl p-4" style={{ background:"#F8FAFB", border:"1px solid #EEF0F4" }}>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={13} color="#005CB6"/>
                  <p style={{ fontSize:"0.67rem", fontWeight:800, color:"#94A3B8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Chương trình áp dụng</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cts.map(c=>(
                    <span key={c.id} style={{ padding:"3px 10px", borderRadius:6, background:NHOM_CFG[c.nhom].bg, color:NHOM_CFG[c.nhom].color, fontSize:"0.72rem", fontWeight:700 }}>{c.kyHieu}</span>
                  ))}
                </div>
              </div>
            )}

            {goi.ghiChu && (
              <div className="rounded-2xl p-4" style={{ background:"#FFFBEB", border:"1px solid #FDE68A" }}>
                <p style={{ fontSize:"0.67rem", fontWeight:800, color:"#92400E", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Ghi chú</p>
                <p style={{ fontSize:"0.8rem", color:"#78350F", lineHeight:1.7 }}>{goi.ghiChu}</p>
              </div>
            )}
          </>}

          {/* ===== TAB: ĐƠN VỊ ĐƯỢC GÁN ===== */}
          {tab==="donvi" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Tổng quan nhanh — 3 thẻ */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                  <GraduationCap size={16} color="#005CB6" style={{ margin:"0 auto 4px" }}/>
                  <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#005CB6" }}>{tongHocSinh.toLocaleString()}</div>
                  <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>Tổng học sinh</div>
                </div>
                <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                  <ShieldCheck size={16} color="#0F766E" style={{ margin:"0 auto 4px" }}/>
                  <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#0F766E" }}>{tongLicense.toLocaleString()}</div>
                  <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>License đã dùng</div>
                </div>
                <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                  <CheckCircle size={16} color="#7C3AED" style={{ margin:"0 auto 4px" }}/>
                  <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#7C3AED" }}>{donViGan.filter(d=>d.trangThai==="Đang dùng").length}</div>
                  <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>Đơn vị hoạt động</div>
                </div>
              </div>

              {/* Danh sách đơn vị */}
              {donViGan.length===0 ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 0", gap:12 }}>
                  <Lock size={32} color="#CBD5E1"/>
                  <p style={{ fontSize:"0.8rem", color:"#94A3B8" }}>Chưa có đơn vị nào được gán cho gói này</p>
                </div>
              ) : (
                donViGan.map(dv => {
                  const dotColor = dv.trangThai==="Đang dùng" ? "#0F766E" : dv.trangThai==="Hết hạn" ? "#D4183D" : "#9CA3AF";
                  const tagBg   = dv.trangThai==="Đang dùng" ? "rgba(15,118,110,0.08)" : dv.trangThai==="Hết hạn" ? "rgba(212,24,61,0.07)" : "rgba(156,163,175,0.1)";
                  const usePct  = Math.round((dv.soLicenseDaDung / Math.max(dv.soLicenseCapPhat, 1)) * 100);
                  return (
                    <div key={dv.id} style={{ background:"#fff", border:"1px solid #EEF0F4", borderRadius:16, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                      {/* Header */}
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                        <div>
                          <div style={{ fontSize:"0.85rem", fontWeight:700, color:"#0F172A" }}>{dv.tenDonVi}</div>
                          <div style={{ fontSize:"0.7rem", color:"#94A3B8", marginTop:2 }}>{dv.tinhThanh} · {dv.capHoc}</div>
                        </div>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:20, background:tagBg, fontSize:"0.68rem", fontWeight:700, color:dotColor, whiteSpace:"nowrap" }}>
                          <span style={{ width:5, height:5, borderRadius:"50%", background:dotColor, display:"inline-block" }}/>
                          {dv.trangThai}
                        </span>
                      </div>
                      {/* Stats */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                        <div style={{ background:"#F8FAFB", borderRadius:8, padding:"6px 10px" }}>
                          <div style={{ fontSize:"0.6rem", color:"#94A3B8", marginBottom:2 }}>Học sinh</div>
                          <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#0F172A" }}>{dv.soHocSinh.toLocaleString()}</div>
                        </div>
                        <div style={{ background:"#F8FAFB", borderRadius:8, padding:"6px 10px" }}>
                          <div style={{ fontSize:"0.6rem", color:"#94A3B8", marginBottom:2 }}>License cấp</div>
                          <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#0F172A" }}>{dv.soLicenseCapPhat.toLocaleString()}</div>
                        </div>
                        <div style={{ background:"#F8FAFB", borderRadius:8, padding:"6px 10px" }}>
                          <div style={{ fontSize:"0.6rem", color:"#94A3B8", marginBottom:2 }}>Kích hoạt</div>
                          <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#0F172A" }}>{dv.ngayKichHoat}</div>
                        </div>
                      </div>
                      {/* License bar */}
                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:"0.62rem", color:"#94A3B8" }}>License đã dùng</span>
                          <span style={{ fontSize:"0.62rem", fontWeight:700, color: usePct>=80?"#D4183D":"#0F766E" }}>{dv.soLicenseDaDung}/{dv.soLicenseCapPhat} ({usePct}%)</span>
                        </div>
                        <div style={{ height:5, background:"#E2E8F0", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ width:`${Math.min(usePct,100)}%`, height:"100%", background: usePct>=80?"#D4183D":"#0F766E", borderRadius:4 }}/>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ===== TAB: SỬ DỤNG NỘI DUNG ===== */}
          {tab==="noidung" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                <BookOpen size={16} color="#005CB6" style={{ margin:"0 auto 4px" }}/>
                <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#005CB6" }}>{tongTiet.toLocaleString()}</div>
                <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>Tổng tiết đã học</div>
              </div>
              <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                <TrendingUp size={16} color="#0F766E" style={{ margin:"0 auto 4px" }}/>
                <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#0F766E" }}>{donViGan.length>0?`${Math.round(donViGan.reduce((s,d)=>s+d.tiLeHoanThanh,0)/donViGan.length)}%`:"—"}</div>
                <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>TB hoàn thành</div>
              </div>
              <div style={{ background:"#F8FAFB", border:"1px solid #EEF0F4", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                <ListChecks size={16} color="#7C3AED" style={{ margin:"0 auto 4px" }}/>
                <div style={{ fontSize:"1.1rem", fontWeight:900, color:"#7C3AED" }}>{linkedMonHoc.length}</div>
                <div style={{ fontSize:"0.62rem", color:"#94A3B8", marginTop:2 }}>Môn đang học</div>
              </div>
            </div>

            {/* Per-unit content usage */}
            {donViGan.length===0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <BookMarked size={32} color="#CBD5E1"/>
                <p style={{ fontSize:"0.8rem", color:"#94A3B8" }}>Chưa có dữ liệu sử dụng nội dung</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid #EEF0F4" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.75rem" }}>
                  <thead>
                    <tr style={{ background:"rgba(0,92,182,0.06)" }}>
                      {["Đơn vị","Môn đã học","Tiết đã học","Hoàn thành"].map((h,i)=>(
                        <th key={i} style={{ padding:"10px 12px", textAlign: i===0?"left":"center", fontWeight:700, color:"#005CB6", fontSize:"0.66rem", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donViGan.map((dv,i)=>(
                      <tr key={dv.id} style={{ borderTop:"1px solid #F1F5F9", background: i%2===0?"#fff":"#FAFBFC" }}>
                        <td style={{ padding:"10px 12px" }}>
                          <div style={{ fontWeight:600, color:"#0F172A" }}>{dv.tenDonVi}</div>
                          <div style={{ fontSize:"0.65rem", color:"#94A3B8" }}>{dv.tinhThanh}</div>
                        </td>
                        <td style={{ padding:"10px 12px", textAlign:"center", fontWeight:700, color:"#005CB6" }}>{dv.soMonDaHoc}</td>
                        <td style={{ padding:"10px 12px", textAlign:"center", fontWeight:700, color:"#0F172A" }}>{dv.soTietDaHoc.toLocaleString()}</td>
                        <td style={{ padding:"10px 12px", textAlign:"center" }}>
                          <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:64 }}>
                            <span style={{ fontWeight:800, fontSize:"0.82rem", color: dv.tiLeHoanThanh>=70?"#0F766E":dv.tiLeHoanThanh>=40?"#D97706":"#D4183D" }}>{dv.tiLeHoanThanh}%</span>
                            <div style={{ width:60, height:4, background:"#E2E8F0", borderRadius:4, overflow:"hidden" }}>
                              <div style={{ width:`${dv.tiLeHoanThanh}%`, height:"100%", borderRadius:4, background: dv.tiLeHoanThanh>=70?"#0F766E":dv.tiLeHoanThanh>=40?"#D97706":"#D4183D" }}/>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Linked subjects usage hint */}
            {linkedMonHoc.length>0 && (
              <div className="rounded-2xl p-4" style={{ background:"rgba(0,92,182,0.04)", border:"1px dashed rgba(0,92,182,0.25)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Info size={13} color="#005CB6"/>
                  <span style={{ fontSize:"0.67rem", fontWeight:700, color:"#005CB6" }}>Môn học trong gói</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {linkedMonHoc.map(mon=>(
                    <span key={mon.id} style={{ padding:"2px 8px", borderRadius:6, background:"rgba(0,92,182,0.08)", color:"#005CB6", fontSize:"0.7rem", fontWeight:600 }}>{mon.ten}</span>
                  ))}
                </div>
              </div>
            )}
            </div>
          )}

        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-5 py-4 flex gap-3 flex-shrink-0" style={{ borderTop:"1px solid #EEF0F4" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl"
            style={{ background:"#F1F5F9", border:"1.5px solid #E2E8F0", color:"#64748B", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
            Đóng
          </button>
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
            style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.84rem", fontWeight:700, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow:"0 4px 14px rgba(0,92,182,0.38)" }}>
            <Edit2 size={14}/> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

type SortF = "tenGoi" | "giaFrom" | "thoiLuongSuDung";
type SortD = "asc" | "desc";

export function GoiCuocPage({ userRole }: { userRole: UserRole }) {
  const [list, setList]         = useState<GoiCuoc[]>(DU_LIEU_GOI_CUOC);
  const [modalMode, setModal]   = useState<"add"|"edit"|null>(null);
  const [editTarget, setEdit]   = useState<GoiCuoc|null>(null);
  const [toast, setToast]       = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);
  const [showEditDaysModal, setShowEditDaysModal] = useState(false);
  const [editDaysValue, setEditDaysValue] = useState("");
  const [search, setSearch]     = useState("");

  const [filterLG, setFilterLG] = useState<LoaiGia|"">("");
  const [filterThoiLuong, setFilterThoiLuong] = useState<number|"">("");
  const [sortF, setSortF]       = useState<SortF>("tenGoi");
  const [sortD, setSortD]       = useState<SortD>("asc");

  const showToast = (msg:string, type:"success"|"error"|"info"="success") => setToast({msg,type});

  const handleSaveEditDays = () => {
    if (editDaysValue && Number(editDaysValue) > 0) {
      showToast(`Cập nhật thời gian sửa môn: ${editDaysValue} ngày`, "success");
      setShowEditDaysModal(false);
      setEditDaysValue("");
    } else {
      showToast("Vui lòng nhập số ngày hợp lệ (> 0)", "error");
    }
  };

  const handleSort = (f: SortF) => {
    if (sortF===f) setSortD(d=>d==="asc"?"desc":"asc");
    else { setSortF(f); setSortD("asc"); }
  };

  const filtered = list.filter(g=>{
    if (search && !g.tenGoi.toLowerCase().includes(search.toLowerCase()) && !g.maBCSS.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterLG && g.loaiGia!==filterLG)  return false;
    if (filterThoiLuong && g.thoiLuongSuDung!==filterThoiLuong) return false;
    return true;
  }).sort((a,b)=>{
    let va: string|number, vb: string|number;
    if (sortF==="tenGoi") { va=a.tenGoi; vb=b.tenGoi; }
    else if (sortF==="giaFrom") { va=a.giaFrom; vb=b.giaFrom; }
    else { va=a.thoiLuongSuDung; vb=b.thoiLuongSuDung; }
    return (va<vb?-1:va>vb?1:0)*(sortD==="asc"?1:-1);
  });

  const handleSaveNew = (f: FormThemFlat, bccsCodes: BCCSMaGoi[]) => {
    const maBCSS = f.loaiGia === "khac-gia"
      ? [...new Set(f.khacGiaRows.map(r => r.maGoiId).filter(Boolean))].join(", ")
      : bccsCodes.length > 0 ? bccsCodes.map(m => m.ma).join(", ") : "";
    // Tính giaFrom / giaTo
    let giaFrom = 0, giaTo = 0;
    if (f.loaiGia === "dong-gia") {
      giaFrom = giaTo = Number(f.giaBan) || 0;
    } else if (f.loaiGia === "khac-gia") {
      const prices = f.khacGiaRows.map(r => Number(r.giaBan)).filter(p => p > 0);
      giaFrom = prices.length ? Math.min(...prices) : 0;
      giaTo   = prices.length ? Math.max(...prices) : 0;
    }
    // Tính thoiLuongSuDung (tháng) từ sdEnd
    const sdE = parseDMY(f.sdEnd);
    const today = new Date();
    const thoiLuongSuDung = sdE ? Math.max(1, Math.round((sdE.getTime() - today.getTime()) / (1000*60*60*24*30))) : 12;
    // Tổng hợp lopIds
    const allLopIds = f.loaiGia === "khac-gia"
      ? [...new Set(f.khacGiaRows.flatMap(r => r.khoiLopIds))]
      : f.khoiLopIds;
    const ng: GoiCuoc = {
      id: String(Date.now()),
      tenGoi: f.tenGoi.trim(),
      maBCSS,
      phanLoai: "",
      loaiGia: f.loaiGia,
      giaFrom, giaTo,
      thoiLuongThuNghiem: Number(f.thoiLuongThuNghiem) || 0,
      thoiLuongSuDung,
      chuongTrinhIds: [],
      monHocIds: f.monHocIds,
      quotaToiDa: 1000,
      soGoiNoiDungDaDung: 0,
      trangThai: f.trangThai,
      ghiChu: f.ghiChu,
      ngayTao: new Date().toLocaleDateString("vi-VN"),
      donViGan: [],
    };
    // Suppress unused var warning
    void allLopIds;
    setList(prev => [ng, ...prev]);
    showToast(`Tạo gói cước "${ng.tenGoi}" thành công!`, "success");
    setModal(null);
  };

  const handleSave = (f: FormState) => {
    // Tính giaFrom / giaTo từ khacGiaData nếu là Khác giá
    const computeGia = () => {
      if (f.loaiGia === "free") return { giaFrom: 0, giaTo: 0 };
      if (f.loaiGia === "dong-gia") return { giaFrom: Number(f.giaFrom), giaTo: Number(f.giaFrom) };
      const bans = f.lopIds.map(id => Number(f.khacGiaData[id]?.giaBan || 0)).filter(v => v > 0);
      return { giaFrom: bans.length ? Math.min(...bans) : 0, giaTo: bans.length ? Math.max(...bans) : 0 };
    };
    const { giaFrom, giaTo } = computeGia();
    // Tính thoiLuong từ date range
    const sdS = parseDMY(f.sdStart), sdE = parseDMY(f.sdEnd);
    const tnS = parseDMY(f.tnStart), tnE = parseDMY(f.tnEnd);
    const thoiLuongSuDung = sdS && sdE ? Math.round((sdE.getTime() - sdS.getTime()) / (1000*60*60*24*30)) : 0;
    const thoiLuongThuNghiem = tnS && tnE ? Math.round((tnE.getTime() - tnS.getTime()) / (1000*60*60*24)) : 0;
    if (modalMode==="add") {
      const ng: GoiCuoc = {
        id: String(Date.now()), tenGoi:f.tenGoi.trim(), maBCSS:f.maBCSS.trim(),
        phanLoai:f.phanLoai, loaiGia:f.loaiGia, giaFrom, giaTo,
        thoiLuongThuNghiem, thoiLuongSuDung,
        chuongTrinhIds:f.chuongTrinhIds, monHocIds:f.monHocIds,
        quotaToiDa:Number(f.quotaToiDa), soGoiNoiDungDaDung:0,
        trangThai:f.trangThai, ghiChu:f.ghiChu, ngayTao:new Date().toLocaleDateString("vi-VN"),
        donViGan: [],
      };
      setList(prev=>[ng,...prev]);
      showToast(`Tạo gói cước "${ng.tenGoi}" thành công!`, "success");
    } else if (editTarget) {
      setList(prev=>prev.map(g=>g.id!==editTarget.id?g:{
        ...g, tenGoi:f.tenGoi.trim(), maBCSS:f.maBCSS.trim(), phanLoai:f.phanLoai, loaiGia:f.loaiGia,
        giaFrom, giaTo, thoiLuongThuNghiem, thoiLuongSuDung,
        chuongTrinhIds:f.chuongTrinhIds, monHocIds:f.monHocIds,
        quotaToiDa:Number(f.quotaToiDa), trangThai:f.trangThai, ghiChu:f.ghiChu,
      }));
      showToast(`Cập nhật "${f.tenGoi}" thành công!`, "success");
    }
    setModal(null); setEdit(null);
  };

  const SI = ({ f }: { f: SortF }) => sortF!==f ? <ArrowUpDown size={11} color="#CBD5E1"/> : sortD==="asc" ? <ChevronUp size={11} color="#005CB6"/> : <ChevronDown size={11} color="#005CB6"/>;
  const thS: React.CSSProperties = { padding:"12px 14px", fontSize:"0.71rem", fontWeight:700, color:"#64748B", textAlign:"left", background:"#F8FAFC", whiteSpace:"nowrap", letterSpacing:"0.03em" };

  const totalGoi    = list.length;
  const activeGoi   = list.filter(g=>g.trangThai==="Đang hoạt động").length;
  const pausedGoi   = list.filter(g=>g.trangThai==="Tạm dừng").length;
  const freeGoi     = list.filter(g=>g.loaiGia==="free").length;
  const totalQuota  = list.reduce((a,g)=>a+g.quotaToiDa,0);
  const usedQuota   = list.reduce((a,g)=>a+g.soGoiNoiDungDaDung,0);

  return (
    <div className="h-full overflow-y-auto" style={{ background:"#F5F7FA", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
      <style>{`
        @keyframes toastSlide { from{opacity:0;transform:translateY(-12px) scale(0.95);}to{opacity:1;transform:none;} }
        @keyframes slideIn    { from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:none;} }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      {modalMode === "add" && (
        <ModalThemGoiCuocFlat
          allGoi={list}
          onClose={() => setModal(null)}
          onSave={handleSaveNew}
        />
      )}
      {modalMode === "edit" && (
        <ModalGoiCuoc
          mode="edit"
          goiEdit={editTarget}
          allGoi={list}
          onClose={() => { setModal(null); setEdit(null); }}
          onSave={handleSave}
          userRole={userRole}
        />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)" }}>
              <Tags size={19} color="#fff"/>
            </div>
            <div>
              <h1 style={{ fontSize:"1.25rem", fontWeight:900, color:"#0F172A", lineHeight:1.2 }}>Cấu hình Gói cước</h1>
              <p style={{ fontSize:"0.75rem", color:"#64748B", marginTop:2 }}>Mapping gói cước BCCS với chương trình học có sẵn</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowEditDaysModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl"
              style={{ border:"1.5px solid #E2E8F0", background:"#fff", cursor:"pointer", fontSize:"0.82rem", fontWeight:600, color:"#64748B", fontFamily:"'Be Vietnam Pro',sans-serif" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")}
              onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
              <Calendar size={14}/> Số ngày của môn
            </button>
            <button onClick={()=>setModal("add")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{ background:"linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.85rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(0,92,182,0.35)", fontFamily:"'Be Vietnam Pro',sans-serif" }}
              onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 6px 20px rgba(0,92,182,0.48)")}
              onMouseLeave={e=>(e.currentTarget.style.boxShadow="0 4px 16px rgba(0,92,182,0.35)")}>
              <Plus size={16}/> Thêm gói cước mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background:"#fff", border:"1.5px solid rgba(0,92,182,0.2)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0" style={{ background:"rgba(0,92,182,0.08)" }}><Tags size={19} color="#005CB6"/></div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-0.5"><span style={{ fontSize:"1.6rem", fontWeight:900, color:"#005CB6", lineHeight:1 }}>{totalGoi}</span><span style={{ fontSize:"0.7rem", color:"#94A3B8" }}>gói</span></div>
              <span style={{ fontSize:"0.84rem", fontWeight:800, color:"#0F172A" }}>Tổng gói cước</span>
              <div style={{ fontSize:"0.68rem", color:"#64748B", marginTop:3 }}><span style={{ color:"#0F766E", fontWeight:600 }}>{activeGoi} hoạt động</span>{pausedGoi>0&&<> · {pausedGoi} tạm dừng</>}</div>
            </div>
          </div>
          <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background:"#fff", border:"1.5px solid rgba(15,118,110,0.2)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0" style={{ background:"rgba(15,118,110,0.08)" }}><CheckCircle size={19} color="#0F766E"/></div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-0.5"><span style={{ fontSize:"1.6rem", fontWeight:900, color:"#0F766E", lineHeight:1 }}>{activeGoi}</span><span style={{ fontSize:"0.7rem", color:"#94A3B8" }}>gói</span></div>
              <span style={{ fontSize:"0.84rem", fontWeight:800, color:"#0F172A" }}>Đang hoạt động</span>
              <div style={{ fontSize:"0.68rem", color:"#64748B", marginTop:3 }}><span style={{ color:"#0F766E", fontWeight:600 }}>{freeGoi} gói miễn phí</span></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative" style={{ minWidth:240, maxWidth:320, flex:1 }}>
            <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Tìm theo tên gói hoặc mã BCCS…"
              className="w-full outline-none rounded-xl"
              style={{ border:"1.5px solid #E2E8F0", padding:"9px 14px 9px 36px", fontSize:"0.83rem", fontFamily:"'Be Vietnam Pro',sans-serif", background:"#fff" }}
              onFocus={e=>{e.target.style.borderColor="#005CB6";e.target.style.boxShadow="0 0 0 3px rgba(0,92,182,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="#E2E8F0";e.target.style.boxShadow="none";}}
            />
          </div>
          {[
            { val:filterLG, set:setFilterLG as (v:string)=>void, opts:DS_LG, label:"Tất cả loại giá", map:(v:string)=>LG_CFG[v as LoaiGia].label },
            { val:String(filterThoiLuong), set:(v:string)=>setFilterThoiLuong(v?Number(v):"") as (v:any)=>void, opts:[...new Set(list.map(g=>g.thoiLuongSuDung))].sort((a,b)=>a-b).map(String), label:"Tất cả thời lượng", map:(v:string)=>`${v} tháng` },
          ].map((f,i)=>(
            <select key={i} value={f.val} onChange={e=>f.set(e.target.value)} className="outline-none rounded-xl"
              style={{ border:"1.5px solid #E2E8F0", padding:"9px 14px", fontSize:"0.83rem", background:"#fff", cursor:"pointer", color:f.val?"#0F172A":"#94A3B8", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              <option value="">{f.label}</option>
              {f.opts.map(o=><option key={o} value={o}>{f.map?f.map(o):o}</option>)}
            </select>
          ))}
          {(search||filterLG||filterThoiLuong) && (
            <button onClick={()=>{setSearch("");setFilterLG("");setFilterThoiLuong("");}}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ border:"1.5px solid #E2E8F0", background:"#fff", cursor:"pointer", fontSize:"0.78rem", color:"#64748B", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
              <RefreshCw size={12}/> Xóa lọc
            </button>
          )}
          <div className="ml-auto" style={{ fontSize:"0.77rem", color:"#94A3B8", whiteSpace:"nowrap" }}>{filtered.length}/{list.length} gói</div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1.5px solid #EEF0F4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom:"2px solid #EEF0F4" }}>
                  <th style={{ ...thS, width:44, textAlign:"center" }}>#</th>
                  <th style={thS}><button onClick={()=>handleSort("tenGoi")} className="flex items-center gap-1.5 cursor-pointer" style={{ background:"none", border:"none", fontFamily:"'Be Vietnam Pro',sans-serif", fontWeight:700, color:"#64748B", fontSize:"0.71rem" }}>Tên gói cước <SI f="tenGoi"/></button></th>
                  <th style={thS}>Loại giá</th>
                  <th style={thS}><button onClick={()=>handleSort("giaFrom")} className="flex items-center gap-1.5 cursor-pointer" style={{ background:"none", border:"none", fontFamily:"'Be Vietnam Pro',sans-serif", fontWeight:700, color:"#64748B", fontSize:"0.71rem" }}>Giá tiền <SI f="giaFrom"/></button></th>
                  <th style={thS}><button onClick={()=>handleSort("thoiLuongSuDung")} className="flex items-center gap-1.5 cursor-pointer" style={{ background:"none", border:"none", fontFamily:"'Be Vietnam Pro',sans-serif", fontWeight:700, color:"#64748B", fontSize:"0.71rem" }}>Thời lượng <SI f="thoiLuongSuDung"/></button></th>
                  <th style={thS}>Chương trình</th>
                  <th style={{ ...thS, textAlign:"center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 ? (
                  <tr><td colSpan={7} style={{ padding:"52px 24px", textAlign:"center" }}>
                    <Tags size={32} color="#CBD5E1" style={{ margin:"0 auto 12px" }}/>
                    <p style={{ color:"#94A3B8", fontSize:"0.85rem" }}>Không tìm thấy gói cước phù hợp</p>
                  </td></tr>
                ) : filtered.map((g, idx) => {
                  return (
                    <tr key={g.id} style={{ borderBottom:"1px solid #F1F5F9", transition:"background 0.12s" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="#FAFBFE")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <td style={{ padding:"12px 14px", textAlign:"center" }}><span style={{ fontSize:"0.74rem", color:"#94A3B8", fontWeight:600 }}>{idx+1}</span></td>
                      <td style={{ padding:"12px 14px", maxWidth:200 }}>
                        <div style={{ fontSize:"0.84rem", fontWeight:700, color:"#0F172A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.tenGoi}</div>
                        <div style={{ fontSize:"0.65rem", color:"#94A3B8", fontFamily:"monospace", marginTop:1 }}>{g.maBCSS}</div>
                      </td>
                      <td style={{ padding:"12px 14px" }}><LoaiGiaBadge lg={g.loaiGia}/></td>
                      <td style={{ padding:"12px 14px" }}><HienThiGia goi={g}/></td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#005CB6" }}>{g.thoiLuongSuDung} tháng</div>
                        {g.thoiLuongThuNghiem>0 && <div style={{ fontSize:"0.64rem", color:"#059669", fontWeight:600 }}>Thử {g.thoiLuongThuNghiem} ngày</div>}
                      </td>
                      <td style={{ padding:"12px 14px", maxWidth:150 }}><ChuongTrinhTags ids={g.chuongTrinhIds} maxShow={4}/></td>
                      <td style={{ padding:"12px 14px", textAlign:"center" }}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button title="Chỉnh sửa" onClick={()=>{setEdit(g);setModal("edit");}} className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background:"rgba(124,58,237,0.07)", border:"none", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget.style.background="rgba(124,58,237,0.14)")} onMouseLeave={e=>(e.currentTarget.style.background="rgba(124,58,237,0.07)")}><Edit2 size={13} color="#7C3AED"/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
            <span style={{ fontSize:"0.75rem", color:"#94A3B8" }}>Hiển thị {filtered.length}/{list.length} gói cước · {list.filter(g=>g.trangThai==="Đang hoạt động").length} đang hoạt động</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" style={{ fontSize:"0.71rem", fontWeight:600, color:"#0F766E" }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:"#0F766E" }}/>Miễn phí: {list.filter(g=>g.loaiGia==="free").length}</span>
              <span className="flex items-center gap-1.5" style={{ fontSize:"0.71rem", fontWeight:600, color:"#005CB6" }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:"#005CB6" }}/>Đồng giá: {list.filter(g=>g.loaiGia==="dong-gia").length}</span>
              <span className="flex items-center gap-1.5" style={{ fontSize:"0.71rem", fontWeight:600, color:"#D97706" }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:"#D97706" }}/>Khác giá: {list.filter(g=>g.loaiGia==="khac-gia").length}</span>
            </div>
          </div>
        </div>
      </div>
      {showEditDaysModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ background:"rgba(15,23,42,0.58)", backdropFilter:"blur(6px)" }}
          onClick={e => { if(e.target===e.currentTarget) setShowEditDaysModal(false); }}>
          <div className="flex flex-col rounded-2xl overflow-hidden"
            style={{ width: 420, background:"#fff", boxShadow:"0 32px 80px rgba(0,0,0,0.28)", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
            
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-5 pb-4"
              style={{ background:"linear-gradient(135deg,#004A9B 0%,#005CB6 45%,#0074E4 100%)" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background:"rgba(255,255,255,0.15)" }}>
                    <Clock size={18} color="#fff"/>
                  </div>
                  <div>
                    <div style={{ fontSize:"0.95rem", fontWeight:800, color:"#fff" }}>Thời gian sửa môn</div>
                    <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.72)", marginTop:2 }}>Cài đặt số ngày được phép sửa môn học</div>
                  </div>
                </div>
                <button onClick={() => setShowEditDaysModal(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
                  style={{ background:"rgba(255,255,255,0.12)", border:"none", cursor:"pointer" }}>
                  <X size={16} color="#fff"/>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                  Thời gian được phép sửa môn <span style={{ color:"#D4183D" }}>*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    value={editDaysValue} 
                    onChange={e => setEditDaysValue(e.target.value)}
                    placeholder="Nhập số ngày..."
                    style={{
                      width:"100%",
                      border:`1.5px solid ${editDaysValue ? "#005CB6" : "#E2E8F0"}`,
                      padding:"11px 40px 11px 14px",
                      fontSize:"0.85rem",
                      background:"#F8F9FA",
                      borderRadius:12,
                      outline:"none",
                      fontFamily:"'Be Vietnam Pro',sans-serif",
                      transition:"all 0.2s ease"
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "#005CB6";
                      e.target.style.background = "#fff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = editDaysValue ? "#005CB6" : "#E2E8F0";
                      e.target.style.background = "#F8F9FA";
                      e.target.style.boxShadow = "none";
                    }}
                    onKeyDown={e => {
                      if(e.key === "Enter") handleSaveEditDays();
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ fontSize:"0.75rem", color:"#94A3B8", fontWeight:600, pointerEvents:"none" }}>ngày</span>
                </div>
              </div>

              {editDaysValue && Number(editDaysValue) > 0 && (
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{ background:"rgba(0,92,182,0.06)", border:"1px solid rgba(0,92,182,0.18)" }}>
                  <Info size={13} color="#005CB6" className="flex-shrink-0 mt-0.5"/>
                  <span style={{ fontSize:"0.72rem", color:"#005CB6", lineHeight:1.5 }}>
                    Học sinh có thể sửa đổi môn học trong vòng <strong>{editDaysValue} ngày</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop:"1px solid #EEF0F4", background:"#FAFBFC" }}>
              <button onClick={() => setShowEditDaysModal(false)}
                className="flex-1 py-2.5 rounded-xl"
                style={{ background:"#F1F5F9", border:"1.5px solid #E2E8F0", color:"#64748B", fontSize:"0.84rem", fontWeight:600, cursor:"pointer", fontFamily:"'Be Vietnam Pro',sans-serif" }}>
                Hủy bỏ
              </button>
              <button onClick={handleSaveEditDays}
                disabled={!editDaysValue || Number(editDaysValue) <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                style={{ background: !editDaysValue || Number(editDaysValue) <= 0 ? "#CBD5E1" : "linear-gradient(135deg,#005CB6,#0074E4)", border:"none", color:"#fff", fontSize:"0.84rem", fontWeight:700, cursor: !editDaysValue || Number(editDaysValue) <= 0 ? "not-allowed" : "pointer", fontFamily:"'Be Vietnam Pro',sans-serif", boxShadow: !editDaysValue || Number(editDaysValue) <= 0 ? "none" : "0 4px 14px rgba(0,92,182,0.35)" }}>
                <CheckCircle size={14}/> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
