# Sủi Study Lab 📚

Trang web tự học thuần **HTML + CSS + JavaScript**, có thể mở offline và triển khai lên GitHub Pages. Môn mặc định là **Toán rời rạc**, gồm 19 bài giải từng bước, 8 chủ đề, 11 thẻ công thức và 19 câu tự luyện.

## Chạy nhanh

1. Tải `index.html`.
2. Nhấp đúp để mở bằng Chrome, Edge, Safari hoặc Firefox.
3. Không cần cài Node.js, npm hay thư viện ngoài.

## Đăng lên GitHub Pages

1. Tạo repository mới (ví dụ `sui-study-lab`).
2. Tải `index.html` lên thư mục gốc của nhánh `main`. Có thể tải kèm README.
3. Vào **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. Mở địa chỉ GitHub Pages hiển thị trong phần Pages sau khi triển khai hoàn tất.

## Thêm môn học và bài tập

- Trong giao diện: chọn **Thêm môn học**, rồi **Thêm bài tập**. Khi thêm bài đầu tiên, tạo chủ đề mới.
- Môn học tự tạo và tiến độ được lưu bằng `localStorage` trên trình duyệt, **không tự đồng bộ lên GitHub hoặc sang thiết bị khác**.
- Chọn **Xuất dữ liệu JSON** để lưu bản sao; chọn **Nhập dữ liệu JSON** để chuyển sang trình duyệt khác.
- Để mọi người truy cập thấy cùng nội dung môn học mới: cần tích hợp dữ liệu vào mã nguồn `index.html`, hoặc xây thêm cơ sở dữ liệu/backend (phiên bản này chưa có).

## Sửa bộ dữ liệu mặc định

Trong thẻ `<script>` của `index.html`:

- `TOPICS`: danh sách các chủ đề.
- `F`: thẻ công thức và điều kiện áp dụng.
- `P`: 19 bài tập (mỗi bài gồm `statement`, `steps`, `answer`, `tip`).
- `QA`: 19 câu hỏi trắc nghiệm.
- `DEFAULT`: định nghĩa môn Toán rời rạc đầu tiên.

Nếu muốn mặc định thêm môn mới trong source, tạo một đối tượng môn học theo cấu trúc `DEFAULT` rồi thêm vào mảng `subjects` khởi tạo.

## Lưu ý về nội dung

- Câu 8 (Venn) dùng **số liệu minh họa được tự đặt**, không phải đề gốc.
- Câu 14 giải cả hai trường hợp **được** và **không được** dùng lại tuyến xe.
- Các bài yêu cầu tính tổ hợp giả định các đối tượng và/hoặc người nhận phân biệt như trong đề.

## Công nghệ

HTML/CSS/JS thuần, không có dependency, không gọi API, không cần Internet, responsive cho desktop và mobile.
