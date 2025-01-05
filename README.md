# Dự Án Phần Mềm Quản Lý Khay Ăn Học Sinh

## Giới Thiệu Dự Án
Dự án của chúng tôi được thiết kế để kiểm tra và quản lý tình trạng khay trong các môi trường nội trú và bán trú. Hệ thống giúp ghi nhận chi tiết thời gian nhận và trả khay, hỗ trợ quản lý hiệu quả.

### Các Tính Năng Nổi Bật
- **Tùy biến sản phẩm:** Cho phép biến đổi khay thành các thiết bị công cụ đặc thù.
- **Xuất mã QR:** Hỗ trợ xuất mã QR cho toàn bộ sản phẩm.
- **Chức năng cơ bản:** Đăng ký, đăng nhập người dùng, đăng ký khay và lớp học.
- **Quét mã QR:** Kiểm tra và xác minh mã QR.

### Công Nghệ Sử Dụng
- **Node.js:** Phát triển dự án.
- **React.js:** Xây dựng giao diện người dùng.
- **Express:** Hỗ trợ backend.
- **MongoDB:** Quản lý dữ liệu.

## Cấu Trúc Thư Mục
Dự án được chia thành hai thư mục chính:
- **frontend:** Chứa mã nguồn React.js cho giao diện người dùng.
- **backend:** Chứa mã nguồn Node.js và Express cho hệ thống backend.

## Hướng Dẫn Sử Dụng

### 1. Cài Đặt Dự Án

#### Yêu Cầu Hệ Thống
- Node.js (khuyến nghị nên dùng phiên bản v23.5.0), MongoDB, Git đã cài đặt.

#### Bước 1: Clone Dự Án
```bash
git clone https://github.com/RinhRT/khayandtnt_public
cd khayandtnt_public
```

#### Bước 2: Cài Đặt Phụ Thuộc
Cài đặt phụ thuộc cho frontend:
```bash
cd frontend
npm install
```
Cài đặt phụ thuộc cho backend:
```bash
cd ../backend
npm install
```

#### Bước 3: Khởi Động MongoDB
- Đảm bảo MongoDB đang chạy.

#### Bước 4: Thiết Lập Biến Môi Trường
Tạo tệp `.env` cho backend:
```env
MONGO_URL=<your mongodb url>
DATABASE=<DATABASE_NAME>
ACCESS_TOKEN=<your password ACCESS_TOKEN>
REFRESH_TOKEN=<your password REFRESH_TOKEN>
GOOGLE_PASSWORD=<YOUR GOOGLE PASSWORD>
MAIL_USER=<YOUR EMAIL>
```

Tạo tệp `.env` cho frontend:
```env
VITE_API_URL=http://localhost:8080
```

#### Bước 5: Khởi Động Dự Án
Khởi động backend (chế độ dev mode):
```bash
cd backend
npm run dev
```
Khởi động frontend (chế độ dev mode):
```bash
cd ../frontend
npm run dev
```
Frontend sẽ chạy tại `http://localhost:5173` và backend tại `http://localhost:8080`.

### 2. Sử Dụng Hệ Thống

#### Đăng Ký Tài Khoản
1. Truy cập `http://localhost:5173`.
2. Chọn "Đăng ký" và nhập thông tin cá nhân.
3. Nhấn "Đăng ký" để hoàn tất.

#### Đăng Nhập
1. Nhập email và mật khẩu.
2. Nhấn "lấy mã OTP". Mã OTP sẽ được gửi qua email
3. Nhập mã OTP và nhấn "Đăng nhập"

#### Quản Lý Khay
1. Thêm khay mới từ bảng điều khiển bằng cách nhấn "Thêm khay".
2. Nhập thông tin khay và lưu lại.

#### Xuất Mã QR
1. Chọn khay cần xuất mã QR từ danh sách.
2. Nhấn "Xuất mã QR" và tải mã QR về.

#### Quét Mã QR
1. Sử dụng chức năng quét mã QR trong hệ thống.
2. Tải lên mã QR hoặc sử dụng camera.

#### Quản Lý Lớp Học
1. Thêm lớp học mới từ trang quản lý lớp học.
2. Nhập thông tin lớp học và lưu lại.
