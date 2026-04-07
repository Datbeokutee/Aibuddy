import { useState, useMemo, useRef, useEffect } from "react";
import {
  ClipboardList, Clock, CheckCircle2, XCircle, AlertTriangle,
  Eye, ShieldCheck, Search, Filter, ChevronDown, X, RefreshCw,
  Building2, User, Gift, Hash, Calendar, MapPin, Info,
  Shield, Lock, Send, MessageSquare, AlertCircle, ChevronRight,
  Zap, Star, Timer, TrendingUp, FileText, UserCheck, SlidersHorizontal,
  ArrowRight, Bell, Layers, Activity,
} from "lucide-react";

// ── KIỂU DỮ LIỆU ──────────────────────────────────────────────────────────────

type TrangThai = "Chờ duyệt" | "Cảnh báo vượt HM";
type LoaiGoi   = "BASIC" | "PLUS" | "VIP";
type LoaiDV    = "Trường học" | "Đại lý";
type KetQua    = "approved" | "rejected" | "revise" | null;

interface YeuCau {
  id: string;
  maYeuCau: string;
  maker: string;
  maMaker: string;
  doiTuong: string;
  loaiDV: LoaiDV;
  diaChi: string;
  loaiGoi: LoaiGoi;
  soLuong: number;
  hanMucConLai: number;   // hạn mức thực tế của đơn vị cấp trên
  ngayGui: string;
  thoiGianCho: string;
  ghiChuMaker?: string;
}

// ── DỮ LIỆU MẪU 10 BẢN GHI ───────────────────────────────────────────────────

const DATA: YeuCau[] = [
  {
    id: "1", maYeuCau: "LG-CG-011", maker: "Nguyễn Văn Minh",   maMaker: "MK-CG-0042",
    doiTuong: "Trường THPT Cầu Giấy",         loaiDV: "Trường học", diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS",  soLuong: 150, hanMucConLai: 200,  ngayGui: "01/04/2026", thoiGianCho: "6 giờ",
  },
  {
    id: "2", maYeuCau: "LG-HD-023", maker: "Trần Minh Đức",     maMaker: "MK-HD-0011",
    doiTuong: "Đại lý Hoàn Kiếm A",           loaiDV: "Đại lý",    diaChi: "Hoàn Kiếm, Hà Nội",
    loaiGoi: "BASIC", soLuong: 120, hanMucConLai: 80,   ngayGui: "01/04/2026", thoiGianCho: "5 giờ",
    ghiChuMaker: "Đại lý yêu cầu cấp bổ sung cuối quý, ưu tiên xử lý nhanh.",
  },
  {
    id: "3", maYeuCau: "LG-DD-007", maker: "Phạm Thị Lan",      maMaker: "MK-DD-0029",
    doiTuong: "Trường THCS Đống Đa",           loaiDV: "Trường học", diaChi: "Đống Đa, Hà Nội",
    loaiGoi: "BASIC", soLuong: 90,  hanMucConLai: 150,  ngayGui: "31/03/2026", thoiGianCho: "1 ngày",
  },
  {
    id: "4", maYeuCau: "LG-TH-019", maker: "Nguyễn Văn Minh",   maMaker: "MK-CG-0042",
    doiTuong: "Trường Tiểu học Đội Cấn",       loaiDV: "Trường học", diaChi: "Ba Đình, Hà Nội",
    loaiGoi: "VIP",   soLuong: 60,  hanMucConLai: 300,  ngayGui: "31/03/2026", thoiGianCho: "1 ngày",
    ghiChuMaker: "Trường đăng ký gói VIP cho năm học mới 2026–2027.",
  },
  {
    id: "5", maYeuCau: "LG-NR-005", maker: "Lê Hoàng Nam",      maMaker: "MK-NR-0055",
    doiTuong: "Đại lý Cầu Giấy Premium",       loaiDV: "Đại lý",    diaChi: "Cầu Giấy, Hà Nội",
    loaiGoi: "PLUS",  soLuong: 45,  hanMucConLai: 100,  ngayGui: "30/03/2026", thoiGianCho: "2 ngày",
  },
  {
    id: "6", maYeuCau: "LG-BT-012", maker: "Vũ Thị Hương",      maMaker: "MK-BT-0038",
    doiTuong: "Trường THPT Bắc Từ Liêm",       loaiDV: "Trường học", diaChi: "Bắc Từ Liêm, Hà Nội",
    loaiGoi: "BASIC", soLuong: 200, hanMucConLai: 120,  ngayGui: "30/03/2026", thoiGianCho: "2 ngày",
    ghiChuMaker: "Trường mở rộng sĩ số, cần cấp thêm 200 license cho học kỳ 2.",
  },
  {
    id: "7", maYeuCau: "LG-TL-008", maker: "Đinh Quang Hải",    maMaker: "MK-TL-0014",
    doiTuong: "Trường THCS Từ Liêm",           loaiDV: "Trường học", diaChi: "Nam Từ Liêm, Hà Nội",
    loaiGoi: "PLUS",  soLuong: 70,  hanMucConLai: 180,  ngayGui: "29/03/2026", thoiGianCho: "3 ngày",
  },
  {
    id: "8", maYeuCau: "LG-HB-031", maker: "Trần Minh Đức",     maMaker: "MK-HD-0011",
    doiTuong: "Đại lý Hai Bà Trưng",           loaiDV: "Đại lý",    diaChi: "Hai Bà Trưng, Hà Nội",
    loaiGoi: "BASIC", soLuong: 110, hanMucConLai: 250,  ngayGui: "29/03/2026", thoiGianCho: "3 ngày",
    ghiChuMaker: "Đại lý khai thác thị trường mới, đề nghị ưu tiên duyệt.",
  },
  {
    id: "9", maYeuCau: "LG-GV-003", maker: "Phạm Thị Lan",      maMaker: "MK-DD-0029",
    doiTuong: "Trường THPT Gia Lâm",           loaiDV: "Trường học", diaChi: "Gia Lâm, Hà Nội",
    loaiGoi: "VIP",   soLuong: 85,  hanMucConLai: 50,   ngayGui: "28/03/2026", thoiGianCho: "4 ngày",
    ghiChuMaker: "Trường yêu cầu gói VIP nâng cấp từ PLUS, hợp đồng đã ký.",
  },
  {
    id: "10", maYeuCau: "LG-CG-010", maker: "Lê Hoàng Nam",     maMaker: "MK-NR-0055",
    doiTuong: "Trường Tiểu học Đoàn Thị Điểm", loaiDV: "Trường học", diaChi: "Nam Từ Liêm, Hà Nội",
    loaiGoi: "BASIC", soLuong: 90,  hanMucConLai: 160,  ngayGui: "28/03/2026", thoiGianCho: "4 ngày",
  },
];

// ── CONFIG ────────────────────────────────────────────────────────────────────

const LOAI_GOI_CFG: Record<LoaiGoi, { color: string; bg: string; border: string }> = {
  BASIC: { color: "#0284C7", bg: "rgba(2,132,199,0.09)",   border: "rgba(2,132,199,0.22)"  },
  PLUS:  { color: "#7C3AED", bg: "rgba(124,58,237,0.09)", border: "rgba(124,58,237,0.22)" },
  VIP:   { color: "#D97706", bg: "rgba(217,119,6,0.09)",  border: "rgba(217,119,6,0.22)"  },
};

const fmtSL = (n: number) => n.toLocaleString("vi-VN");

const trangThaiRow = (row: YeuCau): "vuot" | "ok" => row.soLuong > row.hanMucConLai ? "vuot" : "ok";

// ── INPUT CÓ NHÃ ─────────────────────────────────────────────────────────────

function LyDoInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      rows={3}
      placeholder={placeholder ?? "Nhập lý do…"}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full outline-none rounded-xl resize-none"
      style={{ padding: "10px 14px", border: `1.5px solid ${value ? "#005CB6" : "#E2E8F0"}`, fontSize: "0.83rem", color: "#0F172A", fontFamily: "'Be Vietnam Pro',sans-serif", boxShadow: value ? "0 0 0 3px rgba(0,92,182,0.08)" : "none", lineHeight: 1.65, transition: "border-color 0.15s, box-shadow 0.15s" }}
      onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.09)"; }}
      onBlur={e => { if (!value) { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; } }}
    />
  );
}

// ── MODAL CHI TIẾT PHÊ DUYỆT ─────────────────────────────────────────────────

function ModalPheDuyet({
  row, onClose, onDecision,
}: {
  row: YeuCau;
  onClose: () => void;
  onDecision: (id: string, ket: KetQua, lyDo?: string) => void;
}) {
  const [tab, setTab]           = useState<"info" | "action">("info");
  const [action, setAction]     = useState<"approved" | "rejected" | "revise" | null>(null);
  const [lyDo, setLyDo]         = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const isVuot     = row.soLuong > row.hanMucConLai;
  const conLaiSau  = row.hanMucConLai - row.soLuong;
  const pctSoLuong = Math.min((row.soLuong / (row.hanMucConLai || 1)) * 100, 140);
  const pctHMCL    = 100;
  const goi        = LOAI_GOI_CFG[row.loaiGoi];

  const canApprove  = !isVuot;
  const canSubmit   = action === "approved"
    ? canApprove
    : action === "rejected"
    ? lyDo.trim().length >= 10
    : action === "revise"
    ? lyDo.trim().length >= 10
    : false;

  function handleSubmit() {
    if (!canSubmit) return;
    onDecision(row.id, action, lyDo);
    setConfirmed(true);
  }

  // close on backdrop
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (confirmed && action) {
    const cfg = {
      approved: { color: "#0F766E", bg: "rgba(15,118,110,0.09)", Icon: CheckCircle2, title: "Đã phê duyệt thành công!", sub: "License sẽ được cấp phát ngay đến đơn vị nhận." },
      rejected: { color: "#D4183D", bg: "rgba(212,24,61,0.09)",  Icon: XCircle,      title: "Đã từ chối lệnh gán.",      sub: "Maker sẽ nhận thông báo và lý do từ chối."   },
      revise:   { color: "#D97706", bg: "rgba(217,119,6,0.09)",  Icon: MessageSquare,title: "Đã yêu cầu chỉnh sửa.",     sub: "Maker sẽ được thông báo và tạo lại lệnh."   },
    }[action];
    const { Icon } = cfg;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}>
        <div className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
          style={{ width: 400, background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", fontFamily: "'Be Vietnam Pro',sans-serif", animation: "popIn 0.3s ease" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
            <Icon size={32} color={cfg.color} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A" }}>{cfg.title}</h3>
            <p style={{ fontSize: "0.78rem", color: "#64748B", marginTop: 6, lineHeight: 1.65 }}>{cfg.sub}</p>
          </div>
          <code style={{ fontSize: "0.82rem", fontFamily: "monospace", color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "5px 14px", borderRadius: 8 }}>{row.maYeuCau}</code>
          <button onClick={onClose}
            className="mt-2 px-8 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.87rem", fontWeight: 700, fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ background: "rgba(15,23,42,0.48)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}>

      <div className="flex flex-col h-full"
        style={{ width: 520, background: "#fff", boxShadow: "-10px 0 50px rgba(0,0,0,0.16)", fontFamily: "'Be Vietnam Pro',sans-serif", animation: "drawerIn 0.28s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column" }}>

        {/* ── HEADER ── */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0"
          style={{ background: isVuot ? "linear-gradient(135deg,#991B1B,#D4183D)" : "linear-gradient(135deg,#003D7A,#0074E4)" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.17)" }}>
                {isVuot ? <AlertTriangle size={22} color="#fff" /> : <ShieldCheck size={22} color="#fff" />}
              </div>
              <div>
                <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                  {isVuot ? "⚠ Cảnh báo vượt hạn mức" : "Chi tiết phê duyệt"}
                </div>
                <code style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>{row.maYeuCau}</code>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer" }}>
              <X size={15} color="#fff" />
            </button>
          </div>

          {/* Cảnh báo vượt HM */}
          {isVuot && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)" }}>
              <Lock size={14} color="#fff" className="flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: "0.73rem", color: "#fff", lineHeight: 1.6, fontWeight: 500 }}>
                <strong>Không thể duyệt do vượt quá hạn mức BCCS.</strong>{" "}
                Yêu cầu <strong>{fmtSL(row.soLuong)}</strong> license, vượt hạn mức còn lại{" "}
                <strong>{fmtSL(row.hanMucConLai)}</strong> license ({fmtSL(row.soLuong - row.hanMucConLai)} thiếu).
              </p>
            </div>
          )}

          {/* Tab */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { key: "info",   label: "Thông tin lệnh", icon: FileText    },
              { key: "action", label: "Phê duyệt",      icon: ShieldCheck },
            ].map(t => {
              const TIc = t.icon;
              return (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
                  style={{ background: tab === t.key ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.13)", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
                  <TIc size={12} color={tab === t.key ? "#005CB6" : "rgba(255,255,255,0.85)"} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: tab === t.key ? "#005CB6" : "rgba(255,255,255,0.85)" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {tab === "info" && (
            <>
              {/* Maker info */}
              <div className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,92,182,0.1)" }}>
                  <User size={18} color="#005CB6" />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A" }}>{row.maker}</div>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{row.maMaker} · Người thực hiện (Maker)</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} color="#94A3B8" />
                    <span style={{ fontSize: "0.7rem", color: "#64748B" }}>{row.ngayGui}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer size={11} color="#D97706" />
                    <span style={{ fontSize: "0.7rem", color: "#D97706", fontWeight: 700 }}>Chờ {row.thoiGianCho}</span>
                  </div>
                </div>
              </div>

              {/* Đơn vị nhận */}
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                <div style={{ fontSize: "0.63rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Đối tượng nhận</div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: row.loaiDV === "Trường học" ? "rgba(0,92,182,0.1)" : "rgba(124,58,237,0.1)" }}>
                    {row.loaiDV === "Trường học" ? <Building2 size={16} color="#005CB6" /> : <User size={16} color="#7C3AED" />}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>{row.doiTuong}</div>
                    <div className="flex items-center gap-1">
                      <MapPin size={10} color="#CBD5E1" />
                      <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{row.diaChi}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin gói */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Loại gói", content: (
                    <span className="flex items-center gap-1.5 w-fit rounded-full px-3 py-1"
                      style={{ fontSize: "0.8rem", fontWeight: 800, color: goi.color, background: goi.bg, border: `1.5px solid ${goi.border}` }}>
                      <Gift size={11} /> {row.loaiGoi}
                    </span>
                  )},
                  { label: "Người gửi", content: (
                    <div className="flex items-center gap-1.5">
                      <User size={13} color="#64748B" />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1E293B" }}>{row.maker}</span>
                    </div>
                  )},
                ].map(c => (
                  <div key={c.label} className="p-3.5 rounded-xl" style={{ background: "#F8FAFB", border: "1px solid #EEF0F4" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
                    {c.content}
                  </div>
                ))}
              </div>

              {/* Ghi chú Maker */}
              {row.ghiChuMaker && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
                  style={{ background: "rgba(0,92,182,0.04)", border: "1.5px solid rgba(0,92,182,0.14)" }}>
                  <MessageSquare size={13} color="#005CB6" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div style={{ fontSize: "0.63rem", fontWeight: 800, color: "#005CB6", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ghi chú từ Maker</div>
                    <p style={{ fontSize: "0.74rem", color: "#374151", lineHeight: 1.65 }}>{row.ghiChuMaker}</p>
                  </div>
                </div>
              )}

              {/* ── KIỂM TRA HẠN MỨC — quan trọng nhất ── */}
              <div className="rounded-2xl p-4 space-y-4"
                style={{ background: isVuot ? "rgba(212,24,61,0.04)" : "rgba(0,92,182,0.04)", border: `2px solid ${isVuot ? "rgba(212,24,61,0.3)" : "rgba(0,92,182,0.18)"}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isVuot ? <AlertTriangle size={15} color="#D4183D" /> : <ShieldCheck size={15} color="#005CB6" />}
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: isVuot ? "#D4183D" : "#005CB6" }}>
                      Kiểm tra hạn mức BCCS
                    </span>
                  </div>
                  {isVuot
                    ? <span className="rounded-full px-2.5 py-1 flex items-center gap-1"
                        style={{ background: "rgba(212,24,61,0.12)", fontSize: "0.65rem", fontWeight: 800, color: "#D4183D" }}>
                        <Lock size={9} /> Chặn duyệt
                      </span>
                    : <span className="rounded-full px-2.5 py-1 flex items-center gap-1"
                        style={{ background: "rgba(15,118,110,0.1)", fontSize: "0.65rem", fontWeight: 800, color: "#0F766E" }}>
                        <CheckCircle2 size={9} /> Đủ điều kiện
                      </span>}
                </div>

                {/* 2 số so sánh nổi bật */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3.5 text-center"
                    style={{ background: isVuot ? "rgba(212,24,61,0.07)" : "rgba(0,92,182,0.07)", border: `1.5px solid ${isVuot ? "rgba(212,24,61,0.2)" : "rgba(0,92,182,0.18)"}` }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Số lượng yêu cầu</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: isVuot ? "#D4183D" : "#005CB6", lineHeight: 1 }}>{fmtSL(row.soLuong)}</div>
                    <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginTop: 3 }}>license</div>
                  </div>
                  <div className="rounded-xl p-3.5 text-center"
                    style={{ background: "rgba(15,118,110,0.07)", border: "1.5px solid rgba(15,118,110,0.2)" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Hạn mức còn lại</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0F766E", lineHeight: 1 }}>{fmtSL(row.hanMucConLai)}</div>
                    <div style={{ fontSize: "0.62rem", color: "#94A3B8", marginTop: 3 }}>license</div>
                  </div>
                </div>

                {/* Progress bar so sánh */}
                <div className="space-y-2">
                  {/* Hạn mức thanh nền */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Hạn mức khả dụng</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0F766E" }}>{fmtSL(row.hanMucConLai)}</span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden relative" style={{ height: 10, background: "#EEF0F4" }}>
                      <div className="absolute left-0 top-0 h-full rounded-full"
                        style={{ width: "100%", background: "rgba(15,118,110,0.25)" }} />
                      {/* Yêu cầu */}
                      <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(pctSoLuong, 100)}%`,
                          background: isVuot ? "linear-gradient(90deg,#D4183D,#EF4444)" : "linear-gradient(90deg,#005CB6,#0284C7)",
                        }} />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#E2E8F0" }} />
                        <span style={{ fontSize: "0.63rem", color: "#94A3B8" }}>Khả dụng</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: isVuot ? "#D4183D" : "#005CB6" }} />
                        <span style={{ fontSize: "0.63rem", color: isVuot ? "#D4183D" : "#005CB6" }}>Yêu cầu ({fmtSL(row.soLuong)})</span>
                      </div>
                    </div>
                  </div>
                  {/* Kết quả sau duyệt */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                    style={{ background: isVuot ? "rgba(212,24,61,0.06)" : "rgba(15,118,110,0.06)", border: `1px solid ${isVuot ? "rgba(212,24,61,0.18)" : "rgba(15,118,110,0.18)"}` }}>
                    <span style={{ fontSize: "0.74rem", color: "#64748B" }}>Sau khi duyệt còn lại:</span>
                    <span style={{ fontSize: "0.92rem", fontWeight: 900, color: isVuot ? "#D4183D" : "#0F766E" }}>
                      {isVuot ? `−${fmtSL(row.soLuong - row.hanMucConLai)} (thiếu!)` : `${fmtSL(conLaiSau)} license`}
                    </span>
                  </div>
                </div>

                {/* Cảnh báo đỏ */}
                {isVuot && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
                    style={{ background: "rgba(212,24,61,0.07)", border: "1.5px solid rgba(212,24,61,0.25)" }}>
                    <AlertCircle size={15} color="#D4183D" className="flex-shrink-0 mt-0.5" />
                    <p style={{ fontSize: "0.73rem", color: "#D4183D", lineHeight: 1.65, fontWeight: 500 }}>
                      <strong>Không thể phê duyệt.</strong> Số lượng yêu cầu vượt <strong>{fmtSL(row.soLuong - row.hanMucConLai)}</strong> license so với hạn mức BCCS còn lại. Checker cần <em>Từ chối</em> hoặc <em>Yêu cầu chỉnh sửa</em>.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "action" && (
            <div className="space-y-4">
              {/* Nhắc tắt */}
              <div className="flex items-start gap-2 p-3.5 rounded-xl"
                style={{ background: "rgba(0,92,182,0.05)", border: "1.5px solid rgba(0,92,182,0.14)" }}>
                <Info size={13} color="#005CB6" className="flex-shrink-0 mt-0.5" />
                <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.65 }}>
                  Chọn hành động bên dưới. Thao tác phê duyệt sẽ có hiệu lực ngay và không thể hoàn tác.
                </p>
              </div>

              {/* 3 nút chọn hành động */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    key: "approved", label: "Phê duyệt", Icon: ShieldCheck,
                    color: "#0F766E", bg: "rgba(15,118,110,0.09)", border: "rgba(15,118,110,0.3)",
                    selBg: "#0F766E", disabled: !canApprove,
                  },
                  {
                    key: "rejected", label: "Từ chối", Icon: XCircle,
                    color: "#D4183D", bg: "rgba(212,24,61,0.09)", border: "rgba(212,24,61,0.3)",
                    selBg: "#D4183D", disabled: false,
                  },
                  {
                    key: "revise", label: "Chỉnh sửa", Icon: MessageSquare,
                    color: "#D97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.3)",
                    selBg: "#D97706", disabled: false,
                  },
                ].map(opt => {
                  const OIc = opt.Icon;
                  const sel = action === opt.key;
                  return (
                    <button key={opt.key}
                      disabled={opt.disabled}
                      onClick={() => !opt.disabled && setAction(opt.key as any)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200"
                      style={{
                        background: sel ? opt.selBg : opt.bg,
                        border: `2px solid ${sel ? opt.selBg : opt.border}`,
                        cursor: opt.disabled ? "not-allowed" : "pointer",
                        opacity: opt.disabled ? 0.45 : 1,
                        fontFamily: "'Be Vietnam Pro'",
                        boxShadow: sel ? `0 4px 16px ${opt.bg}` : "none",
                      }}>
                      <OIc size={20} color={sel ? "#fff" : opt.color} />
                      <span style={{ fontSize: "0.76rem", fontWeight: 800, color: sel ? "#fff" : opt.color }}>
                        {opt.label}
                      </span>
                      {opt.disabled && (
                        <span style={{ fontSize: "0.6rem", color: opt.color, fontWeight: 600 }}>Bị chặn</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Nếu phê duyệt */}
              {action === "approved" && (
                <div className="flex items-start gap-2.5 p-4 rounded-2xl"
                  style={{ background: "rgba(15,118,110,0.06)", border: "1.5px solid rgba(15,118,110,0.2)", animation: "fadeIn 0.2s ease" }}>
                  <CheckCircle2 size={15} color="#0F766E" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F766E" }}>Xác nhận phê duyệt lệnh này?</div>
                    <p style={{ fontSize: "0.71rem", color: "#374151", marginTop: 4, lineHeight: 1.65 }}>
                      <strong>{fmtSL(row.soLuong)}</strong> license gói <strong style={{ color: LOAI_GOI_CFG[row.loaiGoi].color }}>{row.loaiGoi}</strong> sẽ được cấp phát cho <strong>{row.doiTuong}</strong> ngay khi xác nhận. Mã giao dịch BCCS sẽ được tạo tự động.
                    </p>
                  </div>
                </div>
              )}

              {/* Nhập lý do (Từ chối / Yêu cầu chỉnh sửa) */}
              {(action === "rejected" || action === "revise") && (
                <div className="space-y-2.5" style={{ animation: "fadeIn 0.2s ease" }}>
                  <label className="flex items-center gap-2"
                    style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
                    {action === "rejected"
                      ? <><XCircle size={13} color="#D4183D" /> Lý do từ chối <span style={{ color: "#D4183D" }}>*</span></>
                      : <><MessageSquare size={13} color="#D97706" /> Nội dung yêu cầu chỉnh sửa <span style={{ color: "#D97706" }}>*</span></>}
                  </label>
                  <LyDoInput value={lyDo} onChange={setLyDo}
                    placeholder={action === "rejected"
                      ? "Mô tả rõ lý do từ chối để Maker hiểu và điều chỉnh… (tối thiểu 10 ký tự)"
                      : "Nêu cụ thể nội dung cần Maker chỉnh sửa trước khi gửi lại…"} />
                  {lyDo.length > 0 && lyDo.length < 10 && (
                    <p className="flex items-center gap-1.5" style={{ fontSize: "0.69rem", color: "#D4183D" }}>
                      <AlertCircle size={11} /> Cần ít nhất 10 ký tự ({lyDo.length}/10)
                    </p>
                  )}
                  {lyDo.length >= 10 && (
                    <p className="flex items-center gap-1.5" style={{ fontSize: "0.69rem", color: "#0F766E" }}>
                      <CheckCircle2 size={11} /> Đã điền đủ thông tin
                    </p>
                  )}
                </div>
              )}

              {/* Gợi ý nếu vượt hạn mức */}
              {isVuot && action === null && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
                  style={{ background: "rgba(212,24,61,0.06)", border: "1.5px solid rgba(212,24,61,0.2)" }}>
                  <Info size={13} color="#D4183D" className="flex-shrink-0 mt-0.5" />
                  <p style={{ fontSize: "0.71rem", color: "#D4183D", lineHeight: 1.65 }}>
                    Lệnh này vượt hạn mức. Bạn chỉ có thể <strong>Từ chối</strong> hoặc <strong>Yêu cầu Maker chỉnh sửa</strong> số lượng xuống ≤ {fmtSL(row.hanMucConLai)} license.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="px-6 py-4 flex-shrink-0 flex gap-3" style={{ borderTop: "1px solid #EEF0F4", background: "#FAFBFC" }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl"
            style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", flex: "none" }}>
            Đóng
          </button>

          {tab === "info" && (
            <button onClick={() => setTab("action")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
              style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", border: "none", color: "#fff", fontSize: "0.87rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
              Tiến hành phê duyệt <ArrowRight size={14} />
            </button>
          )}

          {tab === "action" && action && (
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl"
              style={{
                background: !canSubmit ? "#CBD5E1"
                  : action === "approved" ? "linear-gradient(135deg,#0F766E,#10B981)"
                  : action === "rejected" ? "linear-gradient(135deg,#D4183D,#EF4444)"
                  : "linear-gradient(135deg,#D97706,#F59E0B)",
                border: "none", color: "#fff",
                fontSize: "0.87rem", fontWeight: 700,
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "'Be Vietnam Pro'",
                boxShadow: canSubmit ? "0 4px 14px rgba(0,0,0,0.2)" : "none",
                opacity: canSubmit ? 1 : 0.6,
              }}>
              {action === "approved" ? <><ShieldCheck size={14} /> Xác nhận phê duyệt</>
               : action === "rejected" ? <><XCircle size={14} /> Xác nhận từ chối</>
               : <><Send size={14} /> Gửi yêu cầu chỉnh sửa</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT CHÍNH ────────────────────────────────────────────────────────────

export function DuyetChiaShePage() {
  const [search,       setSearch]       = useState("");
  const [locGoi,       setLocGoi]       = useState<LoaiGoi | "">("");
  const [locTrangThai, setLocTrangThai] = useState<"vuot" | "ok" | "">("");
  const [selectedRow,  setSelectedRow]  = useState<YeuCau | null>(null);
  const [decisions,    setDecisions]    = useState<Record<string, KetQua>>({});
  const [refreshing,   setRefreshing]   = useState(false);

  const data = useMemo(() => {
    return DATA.filter(row => {
      // Ẩn những lệnh đã xử lý
      if (decisions[row.id]) return false;
      const kwOk  = !search || row.doiTuong.toLowerCase().includes(search.toLowerCase()) || row.maYeuCau.toLowerCase().includes(search.toLowerCase()) || row.maker.toLowerCase().includes(search.toLowerCase());
      const goiOk = !locGoi || row.loaiGoi === locGoi;
      const tsOk  = !locTrangThai || (locTrangThai === "vuot" ? trangThaiRow(row) === "vuot" : trangThaiRow(row) === "ok");
      return kwOk && goiOk && tsOk;
    });
  }, [search, locGoi, locTrangThai, decisions]);

  const soVuot   = DATA.filter(r => !decisions[r.id] && trangThaiRow(r) === "vuot").length;
  const soBinhThuong = data.filter(r => trangThaiRow(r) === "ok").length;

  function handleDecision(id: string, ket: KetQua, _lyDo?: string) {
    setDecisions(prev => ({ ...prev, [id]: ket }));
    setTimeout(() => setSelectedRow(null), 1800);
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FA", fontFamily: "'Be Vietnam Pro',sans-serif" }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* ── TIÊU ĐỀ ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "0.73rem", color: "#94A3B8" }}>Trang chủ</span>
              <ChevronRight size={12} color="#CBD5E1" />
              <span style={{ fontSize: "0.73rem", color: "#005CB6", fontWeight: 600 }}>Duyệt chia sẻ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl"
                  style={{ background: "linear-gradient(135deg,#005CB6,#0074E4)", boxShadow: "0 4px 14px rgba(0,92,182,0.35)" }}>
                  <ClipboardList size={18} color="#fff" />
                </div>
                {data.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                    style={{ background: "#D4183D", border: "2px solid #F4F6FA", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.52rem", fontWeight: 900, color: "#fff" }}>{data.length}</span>
                  </span>
                )}
              </div>
              <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Phê duyệt gán gói</h1>
                <p style={{ fontSize: "0.71rem", color: "#94A3B8", marginTop: 3 }}>Viettel Hà Nội · Xem xét và phê duyệt lệnh từ Maker</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {soVuot > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(212,24,61,0.07)", border: "1.5px solid rgba(212,24,61,0.25)" }}>
                <Bell size={14} color="#D4183D" />
                <span style={{ fontSize: "0.77rem", fontWeight: 700, color: "#D4183D" }}>
                  {soVuot} lệnh vượt hạn mức
                </span>
              </div>
            )}
            <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "#fff", border: "1.5px solid #EEF0F4", color: "#374151", fontSize: "0.81rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Be Vietnam Pro'" }}>
              <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Làm mới
            </button>
          </div>
        </div>

        {/* ── KPI NHANH ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Chờ duyệt",         val: data.length,   color: "#D4183D", bg: "rgba(212,24,61,0.08)",   icon: Clock,        sub: "Cần xử lý"       },
            { label: "Cảnh báo vượt HM",  val: soVuot,        color: "#EF4444", bg: "rgba(239,68,68,0.08)",   icon: AlertTriangle,sub: "Không thể duyệt"  },
            { label: "Bình thường",        val: soBinhThuong,  color: "#0F766E", bg: "rgba(15,118,110,0.08)",  icon: CheckCircle2, sub: "Sẵn sàng duyệt"  },
            { label: "Đã xử lý (phiên)",  val: Object.keys(decisions).length, color: "#005CB6", bg: "rgba(0,92,182,0.08)", icon: ShieldCheck, sub: "Phiên này" },
          ].map(s => {
            const SIc = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl p-4"
                style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  <SIc size={18} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.63rem", color: "#94A3B8", marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: "0.62rem", color: s.color, fontWeight: 700, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BỘ LỌC ── */}
        <div className="flex items-center gap-3 flex-wrap p-4 rounded-2xl"
          style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
          {/* Tìm kiếm */}
          <div className="relative flex items-center flex-1" style={{ minWidth: 220 }}>
            <Search size={14} color="#94A3B8" className="absolute left-3.5 pointer-events-none" />
            <input type="text" placeholder="Tìm mã lệnh, tên trường, maker…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full outline-none rounded-xl"
              style={{ border: "1.5px solid #EEF0F4", padding: "9px 30px 9px 36px", fontSize: "0.83rem", background: "#F8F9FA", fontFamily: "'Be Vietnam Pro'" }}
              onFocus={e => { e.target.style.borderColor = "#005CB6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,92,182,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "#EEF0F4"; e.target.style.background = "#F8F9FA"; e.target.style.boxShadow = "none"; }} />
            {search && <button onClick={() => setSearch("")} className="absolute right-3" style={{ background: "none", border: "none", cursor: "pointer" }}><X size={13} color="#94A3B8" /></button>}
          </div>

          {/* Lọc gói */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F8F9FA", border: "1.5px solid #EEF0F4" }}>
            {(["", "BASIC", "PLUS", "VIP"] as (LoaiGoi | "")[]).map(g => {
              const sel = locGoi === g;
              const cfg = g ? LOAI_GOI_CFG[g as LoaiGoi] : null;
              return (
                <button key={g || "all"} onClick={() => setLocGoi(g as any)}
                  className="px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ background: sel ? (cfg?.color ?? "#005CB6") : "transparent", color: sel ? "#fff" : (cfg?.color ?? "#64748B"), border: "none", cursor: "pointer", fontSize: "0.73rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'" }}>
                  {g || "Tất cả"}
                </button>
              );
            })}
          </div>

          {/* Lọc trạng thái HM */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#F8F9FA", border: "1.5px solid #EEF0F4" }}>
            {([
              { key: "",      label: "Tất cả",      color: "#64748B" },
              { key: "vuot",  label: "⚠ Vượt HM",   color: "#D4183D" },
              { key: "ok",    label: "✓ Bình thường",color: "#0F766E" },
            ] as { key: string; label: string; color: string }[]).map(opt => {
              const sel = locTrangThai === opt.key;
              return (
                <button key={opt.key} onClick={() => setLocTrangThai(opt.key as any)}
                  className="px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap"
                  style={{ background: sel ? opt.color : "transparent", color: sel ? "#fff" : opt.color, border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: sel ? 700 : 500, fontFamily: "'Be Vietnam Pro'" }}>
                  {opt.label}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: "0.77rem", color: "#94A3B8", marginLeft: "auto" }}>
            <strong style={{ color: "#0F172A" }}>{data.length}</strong> / {DATA.length} lệnh
          </span>
        </div>

        {/* ── BẢNG ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #EEF0F4", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  {["#", "Mã yêu cầu", "Người yêu cầu (Maker)", "Đối tượng nhận", "Gói cước", "Số lượng", "Ngày gửi", "Thời gian chờ", "Hạn mức / Trạng thái", "Thao tác"].map((col, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.6rem", fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #EEF0F4", whiteSpace: "nowrap", fontFamily: "'Be Vietnam Pro'" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "56px 16px", textAlign: "center" }}>
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 size={40} color="#0F766E" />
                        <p style={{ color: "#0F172A", fontSize: "0.9rem", fontWeight: 700 }}>Không còn lệnh chờ duyệt!</p>
                        <p style={{ color: "#94A3B8", fontSize: "0.77rem" }}>Tất cả lệnh đã được xử lý trong phiên này.</p>
                      </div>
                    </td>
                  </tr>
                ) : data.map((row, idx) => {
                  const isVuot = trangThaiRow(row) === "vuot";
                  const goi    = LOAI_GOI_CFG[row.loaiGoi];
                  const isLast = idx === data.length - 1;
                  return (
                    <tr key={row.id}
                      onClick={() => setSelectedRow(row)}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid #F4F4F8",
                        borderLeft: `3px solid ${isVuot ? "#D4183D" : "#E2E8F0"}`,
                        background: isVuot ? "rgba(212,24,61,0.02)" : "transparent",
                        cursor: "pointer", transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = isVuot ? "rgba(212,24,61,0.05)" : "#F8FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = isVuot ? "rgba(212,24,61,0.02)" : "transparent")}>

                      {/* # */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: isVuot ? "rgba(212,24,61,0.1)" : "rgba(0,92,182,0.07)" }}>
                          <span style={{ fontSize: "0.63rem", fontWeight: 900, color: isVuot ? "#D4183D" : "#005CB6" }}>{idx + 1}</span>
                        </div>
                      </td>

                      {/* Mã yêu cầu */}
                      <td style={{ padding: "13px 14px" }}>
                        <code style={{ fontSize: "0.77rem", fontFamily: "monospace", fontWeight: 700, color: "#005CB6", background: "rgba(0,92,182,0.07)", padding: "2px 8px", borderRadius: 6 }}>
                          {row.maYeuCau}
                        </code>
                      </td>

                      {/* Maker */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(0,92,182,0.1)" }}>
                            <UserCheck size={12} color="#005CB6" />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{row.maker}</div>
                            <div style={{ fontSize: "0.63rem", color: "#94A3B8" }}>{row.maMaker}</div>
                          </div>
                        </div>
                      </td>

                      {/* Đối tượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: row.loaiDV === "Trường học" ? "rgba(0,92,182,0.09)" : "rgba(124,58,237,0.09)" }}>
                            {row.loaiDV === "Trường học" ? <Building2 size={11} color="#005CB6" /> : <User size={11} color="#7C3AED" />}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{row.doiTuong}</div>
                            <div className="flex items-center gap-1">
                              <MapPin size={9} color="#CBD5E1" />
                              <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>{row.diaChi}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gói */}
                      <td style={{ padding: "13px 14px" }}>
                        <span className="flex items-center gap-1 w-fit rounded-full px-2.5 py-1"
                          style={{ fontSize: "0.67rem", fontWeight: 800, color: goi.color, background: goi.bg, border: `1px solid ${goi.border}` }}>
                          <Gift size={9} /> {row.loaiGoi}
                        </span>
                      </td>

                      {/* Số lượng */}
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 900, color: isVuot ? "#D4183D" : "#0F172A" }}>
                          {fmtSL(row.soLuong)}
                        </span>
                        <span style={{ fontSize: "0.6rem", color: "#94A3B8", marginLeft: 2 }}>lic</span>
                      </td>

                      {/* Ngày gửi */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} color="#94A3B8" />
                          <span style={{ fontSize: "0.77rem", color: "#64748B" }}>{row.ngayGui}</span>
                        </div>
                      </td>

                      {/* Thời gian chờ */}
                      <td style={{ padding: "13px 14px" }}>
                        <div className="flex items-center gap-1.5">
                          <Timer size={12} color={parseInt(row.thoiGianCho) >= 2 || row.thoiGianCho.includes("ngày") ? "#D4183D" : "#D97706"} />
                          <span style={{ fontSize: "0.77rem", fontWeight: 700, color: parseInt(row.thoiGianCho) >= 2 || row.thoiGianCho.includes("ngày") ? "#D4183D" : "#D97706" }}>
                            {row.thoiGianCho}
                          </span>
                        </div>
                      </td>

                      {/* Hạn mức */}
                      <td style={{ padding: "13px 14px" }}>
                        {isVuot ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl w-fit"
                            style={{ background: "rgba(212,24,61,0.09)", border: "1px solid rgba(212,24,61,0.25)" }}>
                            <AlertTriangle size={11} color="#D4183D" />
                            <div>
                              <span style={{ fontSize: "0.67rem", fontWeight: 800, color: "#D4183D" }}>Vượt HM</span>
                              <div style={{ fontSize: "0.6rem", color: "#94A3B8" }}>YC: {fmtSL(row.soLuong)} vs HM: {fmtSL(row.hanMucConLai)}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl w-fit"
                            style={{ background: "rgba(15,118,110,0.08)", border: "1px solid rgba(15,118,110,0.2)" }}>
                            <ShieldCheck size={11} color="#0F766E" />
                            <div>
                              <span style={{ fontSize: "0.67rem", fontWeight: 800, color: "#0F766E" }}>Đủ HM</span>
                              <div style={{ fontSize: "0.6rem", color: "#94A3B8" }}>Còn {fmtSL(row.hanMucConLai - row.soLuong)} sau duyệt</div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td style={{ padding: "13px 10px" }} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedRow(row)}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl"
                            style={{ background: "rgba(0,92,182,0.07)", border: "1.5px solid rgba(0,92,182,0.2)", color: "#005CB6", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
                            <Eye size={11} /> Xem
                          </button>
                          {!isVuot && (
                            <button onClick={() => { setSelectedRow(row); }}
                              className="flex items-center gap-1 px-2.5 py-2 rounded-xl"
                              style={{ background: "rgba(15,118,110,0.09)", border: "1.5px solid rgba(15,118,110,0.25)", color: "#0F766E", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
                              <ShieldCheck size={11} /> Duyệt
                            </button>
                          )}
                          {isVuot && (
                            <button onClick={() => setSelectedRow(row)}
                              className="flex items-center gap-1 px-2.5 py-2 rounded-xl"
                              style={{ background: "rgba(212,24,61,0.09)", border: "1.5px solid rgba(212,24,61,0.25)", color: "#D4183D", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", whiteSpace: "nowrap" }}>
                              <Lock size={11} /> Xem lý do
                            </button>
                          )}
                        </div>
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
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4183D", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Vượt hạn mức: <strong style={{ color: "#D4183D" }}>{soVuot}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#0F766E", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Bình thường: <strong style={{ color: "#0F766E" }}>{soBinhThuong}</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info size={12} color="#94A3B8" />
              <span style={{ fontSize: "0.71rem", color: "#94A3B8" }}>Nhấn vào dòng bất kỳ để mở chi tiết phê duyệt</span>
            </div>
          </div>
        </div>

        {/* ── GIDE NGHIỆP VỤ ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { Icon: ShieldCheck, color: "#0F766E", bg: "rgba(15,118,110,0.08)", title: "Phê duyệt",
              desc: "Khi số lượng ≤ hạn mức còn lại. License được cấp phát ngay, mã giao dịch BCCS tạo tự động." },
            { Icon: XCircle,     color: "#D4183D", bg: "rgba(212,24,61,0.08)",  title: "Từ chối",
              desc: "Bắt buộc nhập lý do ≥ 10 ký tự. Maker nhận thông báo và có thể tạo lệnh mới với thông tin đã chỉnh sửa." },
            { Icon: MessageSquare, color: "#D97706", bg: "rgba(217,119,6,0.08)", title: "Yêu cầu chỉnh sửa",
              desc: "Khi lệnh vượt HM hoặc sai thông tin. Maker cần điều chỉnh và gửi lại. Lệnh cũ sẽ bị đóng." },
          ].map(s => {
            const SIc = s.Icon;
            return (
              <div key={s.title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #EEF0F4" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  <SIc size={16} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: "0.69rem", color: "#64748B", lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRow && (
        <ModalPheDuyet row={selectedRow} onClose={() => setSelectedRow(null)} onDecision={handleDecision} />
      )}

      <style>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes drawerIn{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
