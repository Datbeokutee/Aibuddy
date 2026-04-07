import {
  Building2,
  Users,
  Package,
  Key,
  BarChart3,
  Share2,
  History,
  ClipboardList,
  PieChart,
  Plus,
  Upload,
  Search,
  LayoutDashboard,
} from "lucide-react";
import type { ActivePage } from "./Sidebar";

interface PlaceholderPageProps {
  page: ActivePage;
}

const CAU_HINH_TRANG: Record<
  ActivePage,
  {
    tieuDe: string;
    moTa: string;
    icon: React.ElementType;
    mauSac: string;
    nenMau: string;
    hanhDong: string[];
    cot: string[];
    dong: string[][];
  }
> = {
  // ── TRANG CHUNG ────────────────────────────────────────────────────────────
  dashboard: {
    tieuDe: "Tổng quan",
    moTa: "",
    icon: LayoutDashboard,
    mauSac: "#005CB6",
    nenMau: "rgba(0,92,182,0.08)",
    hanhDong: [],
    cot: [],
    dong: [],
  },

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  "unit-management": {
    tieuDe: "Quản lý đơn vị",
    moTa: "Quản lý toàn bộ đơn vị nội dung, phân loại theo môn học và khối lớp.",
    icon: Building2,
    mauSac: "#005CB6",
    nenMau: "rgba(0,92,182,0.08)",
    hanhDong: ["Thêm đơn vị", "Nhập dữ liệu"],
    cot: ["Mã đơn vị", "Tên đơn vị", "Môn học", "Khối lớp", "Trạng thái", "Thao tác"],
    dong: [
      ["ĐV-001", "Đại số cơ bản – Chương 1", "Toán học", "Lớp 7", "Hoạt động", ""],
      ["ĐV-002", "Định luật Newton về chuyển động", "Vật lý", "Lớp 8", "Hoạt động", ""],
      ["ĐV-003", "Truyện Kiều – Đoạn trích 1", "Ngữ văn", "Lớp 9", "Nháp", ""],
      ["ĐV-004", "Chiến tranh Thế giới thứ II", "Lịch sử", "Lớp 10", "Hoạt động", ""],
      ["ĐV-005", "Sinh học tế bào – Cơ bản", "Sinh học", "Lớp 11", "Đang xét", ""],
    ],
  },

  "account-management": {
    tieuDe: "Quản lý tài khoản",
    moTa: "Quản lý tài khoản người dùng, phân quyền và vai trò trên hệ thống.",
    icon: Users,
    mauSac: "#0284C7",
    nenMau: "rgba(2,132,199,0.08)",
    hanhDong: ["Thêm tài khoản", "Nhập hàng loạt"],
    cot: ["Mã tài khoản", "Họ và tên", "Email", "Vai trò", "Trạng thái", "Thao tác"],
    dong: [
      ["TK-001", "Nguyễn Văn An", "an.nguyen@phuongnam.com.vn", "Admin Đối tác", "Hoạt động", ""],
      ["TK-002", "Trần Thị Bình", "binh.tran@phuongnam.com.vn", "Người thực hiện", "Hoạt động", ""],
      ["TK-003", "Lê Minh Châu", "chau.le@phuongnam.com.vn", "Người duyệt", "Hoạt động", ""],
      ["TK-004", "Phạm Minh Quân", "quan.pham@phuongnam.com.vn", "Người thực hiện", "Không hoạt động", ""],
      ["TK-005", "Hoàng Thị Lan", "lan.hoang@phuongnam.com.vn", "Người duyệt", "Hoạt động", ""],
    ],
  },

  "content-packages": {
    tieuDe: "Gói nội dung",
    moTa: "Cấu hình và quản lý các gói nội dung phân phối đến trường học.",
    icon: Package,
    mauSac: "#7C3AED",
    nenMau: "rgba(124,58,237,0.08)",
    hanhDong: ["Tạo gói mới", "Nhập dữ liệu"],
    cot: ["Mã gói", "Tên gói nội dung", "Phân loại gói", "Số lượng tối đa", "Ngày hết hạn", "Trạng thái"],
    dong: [
      ["GOI-001", "Toán lớp 7 – Cả năm học", "BASIC", "5.000", "31/12/2026", "Hoạt động"],
      ["GOI-002", "Khoa học lớp 8 – Học kỳ 1", "PLUS", "3.200", "30/06/2026", "Hoạt động"],
      ["GOI-003", "Ngữ văn lớp 9 – Nâng cao", "PLUS", "2.800", "31/12/2026", "Hoạt động"],
      ["GOI-004", "Tiếng Anh lớp 10", "BASIC", "1.500", "31/08/2026", "Nháp"],
      ["GOI-005", "Vật lý lớp 11 – Thực hành", "PLUS", "900", "31/12/2026", "Hoạt động"],
    ],
  },

  "license-bccs": {
    tieuDe: "Quản lý License & BCCS",
    moTa: "Quản lý phân phối license và đồng bộ dữ liệu với hệ thống BCCS.",
    icon: Key,
    mauSac: "#0F766E",
    nenMau: "rgba(15,118,110,0.08)",
    hanhDong: ["Đồng bộ ngay", "Xem lịch sử"],
    cot: ["Mã đồng bộ", "Gói nội dung", "Số lượng đã gán", "Thời gian đồng bộ", "Trạng thái"],
    dong: [
      ["ĐB-001", "Toán lớp 7", "5.000", "01/04/2026 09:00", "Thành công"],
      ["ĐB-002", "Khoa học lớp 8", "3.200", "01/04/2026 08:45", "Thành công"],
      ["ĐB-003", "Ngữ văn lớp 9", "2.800", "31/03/2026 17:00", "Thành công"],
      ["ĐB-004", "Tiếng Anh lớp 10", "1.500", "31/03/2026 16:30", "Thất bại"],
      ["ĐB-005", "Vật lý lớp 11", "900", "30/03/2026 14:00", "Thành công"],
    ],
  },

  "bao-cao-doi-soat": {
    tieuDe: "Báo cáo đối soát",
    moTa: "Tạo và tải xuống báo cáo đối soát phân phối nội dung theo kỳ.",
    icon: BarChart3,
    mauSac: "#D97706",
    nenMau: "rgba(217,119,6,0.08)",
    hanhDong: ["Tạo báo cáo", "Lên lịch tự động"],
    cot: ["Mã báo cáo", "Tên báo cáo", "Người tạo", "Ngày tạo", "Định dạng", "Thao tác"],
    dong: [
      ["BC-001", "Đối soát sử dụng License – Tháng 3/2026", "Nguyễn Văn An", "01/04/2026", "PDF", ""],
      ["BC-002", "Tóm tắt đồng bộ BCCS – Quý 1/2026", "Hệ thống", "31/03/2026", "XLSX", ""],
      ["BC-003", "Tổng quan phân phối gói nội dung", "Trần Thị Bình", "28/03/2026", "PDF", ""],
      ["BC-004", "Báo cáo hoạt động tài khoản", "Hệ thống", "25/03/2026", "CSV", ""],
      ["BC-005", "Đối soát số lượng tối đa – Tháng 2/2026", "Nguyễn Văn An", "01/03/2026", "PDF", ""],
    ],
  },

  // ── MAKER ──────────────────────────────────────────────────────────────────
  "chia-se-goi": {
    tieuDe: "Chia sẻ gói",
    moTa: "",
    icon: Share2,
    mauSac: "#005CB6",
    nenMau: "rgba(0,92,182,0.08)",
    hanhDong: [],
    cot: [],
    dong: [],
  },

  "lich-su-giao-dich": {
    tieuDe: "Lịch sử giao dịch",
    moTa: "Theo dõi toàn bộ lịch sử giao dịch chia sẻ gói nội dung.",
    icon: History,
    mauSac: "#0284C7",
    nenMau: "rgba(2,132,199,0.08)",
    hanhDong: ["Xuất dữ liệu", "Lọc nâng cao"],
    cot: ["Mã giao dịch", "Gói nội dung", "Đơn vị nhận", "Số lượng", "Ngày thực hiện", "Trạng thái"],
    dong: [
      ["GD-20260401-001", "Toán lớp 7 – HK1", "THCS Nguyễn Du", "5.000", "01/04/2026", "Hoàn thành"],
      ["GD-20260401-002", "Khoa học lớp 8", "THCS Lê Quý Đôn", "3.200", "01/04/2026", "Chờ duyệt"],
      ["GD-20260331-003", "Ngữ văn lớp 9", "THPT Gia Định", "2.800", "31/03/2026", "Hoàn thành"],
      ["GD-20260331-004", "Tiếng Anh lớp 10", "THCS Trần Phú", "1.500", "31/03/2026", "Đang xử lý"],
      ["GD-20260330-005", "Lịch sử lớp 7", "THPT Nguyễn Thị Minh Khai", "4.100", "30/03/2026", "Thất bại"],
    ],
  },

  // ── CHECKER ────────────────────────────────────────────────────────────────
  "duyet-chia-se": {
    tieuDe: "Duyệt chia sẻ",
    moTa: "Xem xét và phê duyệt các lệnh chia sẻ gói đang chờ duyệt.",
    icon: ClipboardList,
    mauSac: "#0F766E",
    nenMau: "rgba(15,118,110,0.08)",
    hanhDong: ["Duyệt tất cả", "Lọc chờ duyệt"],
    cot: ["Mã yêu cầu", "Gói nội dung", "Người thực hiện", "Đơn vị nhận", "Số lượng", "Trạng thái"],
    dong: [
      ["YC-20260401-001", "Toán lớp 7 – HK1", "Trần Thị Bình", "THCS Nguyễn Du", "5.000", "Chờ duyệt"],
      ["YC-20260401-002", "Khoa học lớp 8", "Trần Thị Bình", "THCS Lê Quý Đôn", "3.200", "Chờ duyệt"],
      ["YC-20260331-003", "Tiếng Anh lớp 10", "Phạm Minh Quân", "THCS Trần Phú", "1.500", "Chờ duyệt"],
      ["YC-20260330-004", "Vật lý lớp 11", "Trần Thị Bình", "THPT Gia Định", "900", "Đã duyệt"],
      ["YC-20260329-005", "Sinh học lớp 10", "Phạm Minh Quân", "THPT Nguyễn Thị Minh Khai", "2.200", "Đã duyệt"],
    ],
  },

  "bao-cao-don-vi": {
    tieuDe: "Báo cáo đơn vị",
    moTa: "Xem thống kê và báo cáo hoạt động theo từng đơn vị trực thuộc.",
    icon: PieChart,
    mauSac: "#7C3AED",
    nenMau: "rgba(124,58,237,0.08)",
    hanhDong: ["Xuất báo cáo", "Lọc đơn vị"],
    cot: ["Tên đơn vị", "Số gói tiếp nhận", "Số lượng đã gán", "Số lượng còn lại", "Tỷ lệ sử dụng"],
    dong: [
      ["THCS Nguyễn Du", "3", "4.850", "150", "97%"],
      ["THCS Lê Quý Đôn", "2", "3.100", "100", "97%"],
      ["THPT Gia Định", "4", "7.200", "800", "90%"],
      ["THCS Trần Phú", "2", "1.400", "100", "93%"],
      ["THPT Nguyễn Thị Minh Khai", "3", "5.600", "400", "93%"],
    ],
  },
};

// ── MÀU TRẠNG THÁI ─────────────────────────────────────────────────────────────

const MAU_TRANG_THAI: Record<string, { color: string; bg: string }> = {
  "Hoạt động":       { color: "#0F766E", bg: "rgba(15,118,110,0.1)" },
  "Không hoạt động": { color: "#94A3B8", bg: "#F1F5F9" },
  "Nháp":            { color: "#D97706", bg: "rgba(217,119,6,0.1)" },
  "Đang xét":        { color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  "Thành công":      { color: "#0F766E", bg: "rgba(15,118,110,0.1)" },
  "Thất bại":        { color: "#D4183D", bg: "rgba(212,24,61,0.1)" },
  "Hoàn thành":      { color: "#0F766E", bg: "rgba(15,118,110,0.1)" },
  "Chờ duyệt":       { color: "#D97706", bg: "rgba(217,119,6,0.1)" },
  "Đang xử lý":      { color: "#005CB6", bg: "rgba(0,92,182,0.1)" },
  "Đã duyệt":        { color: "#0F766E", bg: "rgba(15,118,110,0.1)" },
};

// ── COMPONENT ──────────────────────────────────────────────────────────────────

export function PlaceholderPage({ page }: PlaceholderPageProps) {
  const ch = CAU_HINH_TRANG[page];
  if (!ch || ch.cot.length === 0) return null;
  const Icon = ch.icon;

  return (
    <div
      className="flex-1 overflow-y-auto p-6 h-full"
      style={{ background: "#F8F9FA", fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      <div className="max-w-screen-xl mx-auto space-y-5">

        {/* Thanh tiêu đề trang */}
        <div
          className="flex items-center justify-between p-5 rounded-2xl"
          style={{
            background: "#fff",
            border: "1px solid #EEF0F4",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: ch.nenMau }}
            >
              <Icon size={22} color={ch.mauSac} strokeWidth={2} />
            </div>
            <div>
              <h2 style={{ color: "#0F172A", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}>
                {ch.tieuDe}
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.78rem", marginTop: 4 }}>
                {ch.moTa}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ch.hanhDong.map((hd, i) => (
              <button
                key={hd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: i === 0 ? ch.mauSac : "#F8F9FA",
                  color: i === 0 ? "#fff" : "#64748B",
                  border: `1.5px solid ${i === 0 ? ch.mauSac : "#EEF0F4"}`,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  boxShadow: i === 0 ? `0 2px 8px ${ch.mauSac}40` : "none",
                }}
              >
                {i === 0 ? <Plus size={14} /> : <Upload size={14} />}
                {hd}
              </button>
            ))}
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
          style={{
            background: "#fff",
            border: "1px solid #EEF0F4",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder={`Tìm kiếm ${ch.tieuDe.toLowerCase()}…`}
            className="flex-1 outline-none"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "0.85rem",
              color: "#0F172A",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: "#94A3B8",
              background: "#F8F9FA",
              border: "1.5px solid #EEF0F4",
              padding: "3px 10px",
              borderRadius: 8,
            }}
          >
            ⌘ K
          </span>
        </div>

        {/* Bảng dữ liệu */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #EEF0F4",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  {ch.cot.map((col, idx) => (
                    <th
                      key={`col-${idx}`}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#94A3B8",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid #EEF0F4",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ch.dong.map((dong, ri) => (
                  <tr
                    key={ri}
                    style={{
                      borderBottom: ri < ch.dong.length - 1 ? "1px solid #F8F9FA" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background =
                        "rgba(0,92,182,0.02)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                    }
                  >
                    {dong.map((o, ci) => {
                      const laCot0 = ci === 0;
                      const laTrangThai = ch.cot[ci] === "Trạng thái";
                      const laThaoTac = ch.cot[ci] === "Thao tác";
                      const laLoaiGoi = ch.cot[ci] === "Phân loại gói";
                      const laVaiTro = ch.cot[ci] === "Vai trò";

                      if (laThaoTac) {
                        return (
                          <td key={ci} style={{ padding: "14px 16px" }}>
                            <div className="flex items-center gap-1.5">
                              <button
                                style={{
                                  background: ch.nenMau,
                                  color: ch.mauSac,
                                  border: "none",
                                  cursor: "pointer",
                                  fontFamily: "'Be Vietnam Pro', sans-serif",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  padding: "4px 10px",
                                  borderRadius: 8,
                                }}
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                style={{
                                  background: "rgba(212,24,61,0.07)",
                                  color: "#D4183D",
                                  border: "none",
                                  cursor: "pointer",
                                  fontFamily: "'Be Vietnam Pro', sans-serif",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  padding: "4px 10px",
                                  borderRadius: 8,
                                }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        );
                      }

                      if (laTrangThai) {
                        const mauTS = MAU_TRANG_THAI[o] ?? { color: "#94A3B8", bg: "#F1F5F9" };
                        return (
                          <td key={ci} style={{ padding: "14px 16px" }}>
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-1"
                              style={{
                                background: mauTS.bg,
                                color: mauTS.color,
                                fontSize: "0.72rem",
                                fontWeight: 600,
                              }}
                            >
                              {o}
                            </span>
                          </td>
                        );
                      }

                      if (laLoaiGoi) {
                        const loaiMau: Record<string, { color: string; bg: string }> = {
                          BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.1)" },
                          PLUS: { color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
                        };
                        const m = loaiMau[o] ?? loaiMau.BASIC;
                        return (
                          <td key={ci} style={{ padding: "14px 16px" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: m.color,
                                background: m.bg,
                                padding: "3px 10px",
                                borderRadius: 99,
                              }}
                            >
                              {o}
                            </span>
                          </td>
                        );
                      }

                      if (laVaiTro) {
                        const vaiTroMau: Record<string, { color: string; bg: string }> = {
                          "Admin Đối tác":    { color: "#005CB6", bg: "rgba(0,92,182,0.08)" },
                          "Người thực hiện":  { color: "#0284C7", bg: "rgba(2,132,199,0.08)" },
                          "Người duyệt":      { color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
                        };
                        const vm = vaiTroMau[o] ?? { color: "#64748B", bg: "#F1F5F9" };
                        return (
                          <td key={ci} style={{ padding: "14px 16px" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                color: vm.color,
                                background: vm.bg,
                                padding: "3px 10px",
                                borderRadius: 99,
                              }}
                            >
                              {o}
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={ci} style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              fontSize: laCot0 ? "0.73rem" : "0.83rem",
                              fontWeight: laCot0 ? 600 : ci === 1 ? 600 : 400,
                              color: laCot0 ? ch.mauSac : ci === 1 ? "#1E293B" : "#64748B",
                              background: laCot0 ? ch.nenMau : "transparent",
                              padding: laCot0 ? "3px 8px" : "0",
                              borderRadius: laCot0 ? 6 : 0,
                              fontFamily: laCot0
                                ? "monospace, sans-serif"
                                : "'Be Vietnam Pro', sans-serif",
                            }}
                          >
                            {o}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div
            className="flex items-center justify-between px-6 py-3.5"
            style={{ borderTop: "1px solid #EEF0F4" }}
          >
            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Hiển thị{" "}
              <strong style={{ color: "#334155" }}>1–{ch.dong.length}</strong> trong{" "}
              <strong style={{ color: "#334155" }}>{ch.dong.length}</strong> bản ghi
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{
                    background: p === 1 ? ch.mauSac : "#F8F9FA",
                    border: `1.5px solid ${p === 1 ? ch.mauSac : "#EEF0F4"}`,
                    color: p === 1 ? "#fff" : "#64748B",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
