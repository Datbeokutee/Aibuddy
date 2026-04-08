# Nghiệp vụ Admin — 3 Menu Quản lý Nội dung K12Online

> Tài liệu này mô tả **trạng thái hiện tại** (bản mới nhất) của 3 menu dành cho Role Admin.  
> Dùng làm nền tảng để viết yêu cầu thay đổi tiếp theo.

---

## 1. Danh mục Chương trình (`ChuongTrinhHocPage`)

### 1.1 Mục đích
Admin khai báo và quản lý danh mục các **chương trình học** (tên chương trình, mã định danh, đơn vị trường áp dụng). Đây là tầng "tiêu đề" — chưa bao gồm nội dung bài học chi tiết.

### 1.2 Cấu trúc dữ liệu một Chương trình

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | ID nội bộ |
| `maChuongTrinh` | string | Mã định danh, bắt buộc, không trùng |
| `tenChuongTrinh` | string | Tên hiển thị, bắt buộc |
| `ngayTao` | string | Ngày tạo (dd/mm/yyyy) |
| `nguoiTao` | string | Tên người tạo |
| `donViApDung` | DonViRow[] | Danh sách trường được áp dụng |

**DonViRow:**
```
{ id, tinhThanh, capHoc, truong }
```
- `tinhThanh`: chọn từ danh sách tỉnh cố định (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng, Cần Thơ)
- `capHoc`: Tiểu học / THCS / THPT
- `truong`: chọn từ danh sách trường theo tỉnh (có thể để trống = áp dụng toàn tỉnh/cấp)

### 1.3 Bảng dữ liệu

**Các cột hiển thị:**
1. Checkbox chọn
2. STT
3. Mã chương trình
4. Tên chương trình
5. Đơn vị áp dụng (hiển thị pill xanh: "Tỉnh – Cấp học")
6. Ngày tạo
7. Người tạo
8. Hành động: `Pencil` (sửa), `Trash2` (xóa)

**Bộ lọc phía trên bảng:**
- Dropdown **Tỉnh thành**
- Dropdown **Cấp học**
- Dropdown **Người tạo** (dynamic từ dữ liệu)
- Ô tìm kiếm theo tên / mã chương trình
- Nút **Xóa lọc** (hiện khi đang có filter)

### 1.4 Popup Thêm mới / Chỉnh sửa

**Trường nhập:**
- Mã chương trình (bắt buộc, validate trùng)
- Tên chương trình (bắt buộc)
- **Đơn vị áp dụng** — 2 chế độ:
  - `Chọn từ danh sách`: thêm nhiều dòng (tỉnh → cấp học → trường), có nút "Thêm dòng" và "Xóa dòng"
  - `Nhập mã trường`: nhập tay mã trường (text input)

**Lưu ý:**
- Trùng mã → báo lỗi inline, không lưu
- Người tạo mặc định = "Admin VTS"

---

## 2. Quản lý Gói cước (`GoiCuocPage`)

### 2.1 Mục đích
Admin cấu hình các **gói cước thương mại** bán cho đơn vị trường (mapping với mã BCCS, xác định giá, thời hạn, chương trình học đính kèm). Không có nút "Xem chi tiết" riêng — chi tiết xem ngay bằng Drawer bên phải khi click vào hàng hoặc nút Eye (nếu được thêm lại).

> **Lưu ý hiện tại:** Nút Eye (Xem chi tiết) đã bị xóa khỏi bảng. Drawer xem chi tiết có thể kích hoạt bằng cách click vào tên gói (tuỳ cấu hình thêm sau).

### 2.2 Cấu trúc dữ liệu một Gói cước

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | ID nội bộ |
| `tenGoi` | string | Tên gói hiển thị |
| `maBCSS` | string | Mã gói trên hệ thống BCCS |
| `phanLoai` | string | Phân loại tự do (text) |
| `loaiGia` | `"dong-gia"` / `"khac-gia"` / `"free"` | Cấu trúc giá |
| `giaFrom` | number | Giá từ (nghìn đồng) |
| `giaTo` | number | Giá đến (nghìn đồng) |
| `thoiLuongThuNghiem` | number | Số ngày dùng thử |
| `thoiLuongSuDung` | number | Số tháng sử dụng |
| `chuongTrinhIds` | string[] | ID các chương trình học gắn vào gói |
| `monHocIds` | string[] | ID các môn học liên kết |
| `quotaToiDa` | number | Số license tối đa |
| `soGoiNoiDungDaDung` | number | Số gói nội dung đã sử dụng |
| `trangThai` | `"Đang hoạt động"` / `"Tạm dừng"` | Trạng thái gói |
| `ghiChu` | string | Ghi chú tự do |
| `ngayTao` | string | Ngày tạo |
| `donViGan` | DonViGan[] | Danh sách đơn vị được gán gói này |

**DonViGan** (thông tin sử dụng của một trường):
```
{ id, tenDonVi, tinhThanh, capHoc, soHocSinh,
  soLicenseCapPhat, soLicenseDaDung,
  ngayKichHoat, trangThai: "Đang dùng"|"Hết hạn"|"Chưa kích hoạt",
  soMonDaHoc, soTietDaHoc, tiLeHoanThanh }
```

### 2.3 Bảng dữ liệu

**Các cột hiển thị:**
1. Checkbox chọn
2. STT
3. Tên gói / Mã BCCS
4. Phân loại
5. Loại giá (pill: Đồng giá / Khác giá / Miễn phí)
6. Khoảng giá
7. Thời lượng (thử nghiệm + sử dụng)
8. Chương trình học (pills)
9. Trạng thái (pill: Đang hoạt động / Tạm dừng)
10. Hành động: `Edit2` (sửa), `Trash2` (xóa), `Copy` (sao chép)

**Bộ lọc:**
- Dropdown **Trạng thái** (Đang hoạt động / Tạm dừng)
- Dropdown **Loại giá**
- Ô search tên gói
- Nút **Tải lại**, **Sắp xếp**

### 2.4 Popup Thêm mới / Chỉnh sửa

Popup 2 cột, gồm các section:

**Cột trái:**
- Tên gói (bắt buộc)
- Mã BCCS (dropdown tìm kiếm, badge "Đang dùng" / "Khả dụng")
- Phân loại (text)
- Loại giá: chọn 1 trong 3 (Đồng giá / Khác giá / Miễn phí) → ảnh hưởng hiển thị field giá
- Khoảng giá (giaFrom → giaTo)
- Thời lượng dùng thử (ngày) + thời lượng sử dụng (tháng)

**Cột phải:**
- Chương trình học (multi-select, chọn từ danh sách đã khai báo ở menu Danh mục Chương trình)
- Môn học K12 (multi-select theo nhóm: KHTN / KHXH / Ngoại ngữ / Năng khiếu)
- Khối lớp áp dụng (multi-select: Lớp 1–12, grouped theo cấp)
- Quota tối đa (số)
- Trạng thái (toggle: Đang hoạt động / Tạm dừng)
- Ghi chú

### 2.5 Drawer Xem chi tiết (3 tab)

Khi mở drawer (width 540px), hiển thị 3 tab:

**Tab 1 — Tổng quan:**
- Thông tin cơ bản: tên, mã BCCS, loại giá, khoảng giá, thời lượng, trạng thái
- Danh sách chương trình học đính kèm
- Môn học liên kết

**Tab 2 — Đơn vị:**
- Bảng đơn vị đã được gán gói này (`donViGan[]`)
- Cột: Tên đơn vị / Tỉnh thành / Cấp học / Số học sinh / License cấp phát / License đã dùng / Ngày kích hoạt / Trạng thái
- Summary thống kê tổng (tổng trường, tổng học sinh, tổng license)

**Tab 3 — Sử dụng nội dung:**
- Thống kê sử dụng: số môn đã học, số tiết đã học, tỉ lệ hoàn thành trung bình
- Dữ liệu tổng hợp từ tất cả đơn vị trong `donViGan[]`

---

## 3. Quản lý & Phê duyệt Nội dung — Role Admin (`AdminNoiDungPage`)

### 3.1 Mục đích
Admin xem toàn bộ nội dung học từ tất cả các đối tác + nội dung Admin tự tạo. Admin có quyền **phê duyệt** hoặc **từ chối** nội dung do đối tác nộp.

### 3.2 Cấu trúc dữ liệu một Nội dung học

| Trường | Kiểu | Mô tả |
|---|---|---|
| `id` | string | ID nội bộ |
| `ten` | string | Tên chương trình học (từ MASTER_DATA) |
| `goiCuoc` | string | Tên gói cước gắn kèm |
| `khoiLop` | string | Khối lớp áp dụng (text, VD: "Lớp 1, 2") |
| `monHoc` | string | Môn học (text) |
| `soHocLieu` | object | `{ baiGiang, baiKiemTra, nganHangCauHoi }` |
| `nguoiTao` | string | Username người tạo |
| `tenDoiTac` | string | Tên đối tác hiển thị (VD: "Đối tác A", "Admin VTS") |
| `nguon` | `"admin"` / `"doitac"` | Phân biệt nội dung Admin hay Đối tác tạo |
| `lanSuaCuoi` | string | Timestamp lần sửa cuối |
| `trangThai` | `"Chưa phê duyệt"` / `"Đã phê duyệt"` | Trạng thái phê duyệt |

### 3.3 Quy tắc trạng thái

| Tình huống | trangThai |
|---|---|
| Admin tạo mới | **Tự động "Đã phê duyệt"** (auto-approved) |
| Đối tác tạo mới | "Chưa phê duyệt" |
| Admin nhấn **Phê duyệt** | → "Đã phê duyệt" |
| Admin nhấn **Từ chối** | → "Chưa phê duyệt" (đối tác cần chỉnh sửa lại) |

> Không có trạng thái trung gian "Chờ phê duyệt" từ góc nhìn Admin.

### 3.4 Bảng dữ liệu

**Các cột hiển thị:**
1. Checkbox chọn
2. STT
3. Tên nội dung học (+ Khối lớp, Môn học sub-text)
4. Gói cước (pills xanh)
5. Số học liệu (bài giảng / bài kiểm tra / ngân hàng câu hỏi)
6. **Trạng thái** — 2 giá trị:
   - `"Chưa phê duyệt"` → pill màu cam nhạt (#fff7ed / #c2410c)
   - `"Đã phê duyệt"` → pill màu xanh lá (#f0fdf4 / #15803d)
7. **Đối tác** (tên đối tác + username + badge "Admin" nếu nguon = admin)
8. Lần sửa cuối
9. **Hành động** (xem mục 3.5)

**Highlight dòng:** Các dòng của đối tác chưa phê duyệt (`nguon === "doitac"` && `trangThai === "Chưa phê duyệt"`) có nền cam cực nhạt.

**Banner cảnh báo:** Góc trên phải tiêu đề hiển thị số nội dung đối tác chờ duyệt (cam, có AlertCircle icon).

### 3.5 Cột Hành động

| Icon | Điều kiện hiển thị | Hành động |
|---|---|---|
| `CheckCircle2` (xanh lá) — **Phê duyệt** | `trangThai === "Chưa phê duyệt"` && `nguon === "doitac"` | Mở dialog xác nhận → phê duyệt |
| `XCircle` (đỏ) — **Từ chối** | Cùng điều kiện với Phê duyệt | Mở dialog xác nhận → từ chối |
| `Pencil` (xanh) — **Sửa** | Luôn hiển thị | Mở popup chỉnh sửa |
| `Trash2` (đỏ) — **Xóa** | Luôn hiển thị | Mở dialog xác nhận xóa |
| `Copy` (xám) — **Sao chép** | Luôn hiển thị | Toast thông báo |

### 3.6 Bộ lọc

Thứ tự từ trái sang phải:
1. **Lọc theo đối tác** (dropdown: Đối tác A / Đối tác B / Đối tác STEM / Admin VTS)
2. **Lọc theo trạng thái** (Chưa phê duyệt / Đã phê duyệt)
3. **Lọc theo khối lớp** (Khối 1 → Khối 12)
4. **Lọc theo môn học**
5. **Ô tìm kiếm** tên nội dung
6. (Spacer)
7. Nút **Tải lại** (reset tất cả filter)
8. Nút **Sắp xếp**
9. Nút **Import Json**
10. Nút **Thêm mới** (primary #005CB6)

### 3.7 Dialog xác nhận Phê duyệt / Từ chối

**Phê duyệt:**
- Icon: `CheckCircle2` xanh lá, nền #f0fdf4
- Nội dung: "Phê duyệt nội dung **[tên]**? Học sinh sẽ có thể xem nội dung này sau khi phê duyệt."
- Nút: Hủy | **Phê duyệt** (xanh lá)

**Từ chối:**
- Icon: `XCircle` đỏ, nền #fef2f2
- Nội dung: "Từ chối nội dung **[tên]**? Đối tác sẽ cần chỉnh sửa và gửi lại yêu cầu phê duyệt."
- Nút: Hủy | **Từ chối** (đỏ)

### 3.8 Popup Thêm mới / Chỉnh sửa (Admin tạo)

Giống popup của Đối tác nhưng có thêm **thông báo** ở header:
> ✅ "Nội dung do Admin tạo sẽ được phê duyệt tự động"

Các field:
- Chương trình học (dropdown, bắt buộc)
- Gói cước (multi-select checkbox, hiện sau khi chọn chương trình)
- Bảng tóm tắt gói đã chọn (read-only: giá, thời lượng, khối lớp, môn học)
- Khối lớp áp dụng (chip multi-select, dynamic theo gói)
- Môn học (chip multi-select, dynamic theo gói)
- Giới thiệu nội dung (textarea)
- Mục tiêu học tập (textarea)
- Ảnh đại diện (upload)
- Checkbox "Lưu và thêm tiếp" (chỉ ở chế độ thêm mới)

---

## 4. Liên kết giữa 3 menu

```
Danh mục Chương trình  →  Gói cước  →  Nội dung học
       (ChuongTrinhHocPage)   (GoiCuocPage)   (AdminNoiDungPage)
            ↓                      ↓                  ↓
   Khai báo tên CT,         Gắn CT vào gói,    Đối tác tạo nội dung
   mã, đơn vị áp dụng      định giá, thời hạn  → Admin phê duyệt
```

- **GoiCuocPage** import danh sách chương trình từ `ChuongTrinhHocPage.SAMPLE_DATA`
- **AdminNoiDungPage** dùng `MASTER_DATA` (cấu trúc tương tự) để tạo nội dung mới
- Khi Admin phê duyệt → `trangThai = "Đã phê duyệt"` → học sinh có thể xem

---

## 5. Hằng số & Style chung

| Hằng số | Giá trị |
|---|---|
| Màu chủ đạo | `#005CB6` |
| Font | `'Be Vietnam Pro', sans-serif` |
| Border radius card | `10px` |
| Pill Đã phê duyệt | bg `#f0fdf4`, color `#15803d`, border `#bbf7d0` |
| Pill Chưa phê duyệt | bg `#fff7ed`, color `#c2410c`, border `#fed7aa` |
| Pill Đang hoạt động | bg `rgba(15,118,110,0.08)`, color `#0F766E` |
| Pill Tạm dừng | bg `rgba(212,24,61,0.07)`, color `#D4183D` |
