# C Lab — bộ file tải lên GitHub

Tất cả file đặt cùng một cấp, không cần tạo các thư mục con. Giữ nguyên tên file.

## Upload lên GitHub

1. Giải nén C-Lab-GitHub-Files.zip.
2. Mở repository trên GitHub, chọn Add file → Upload files.
3. Kéo tất cả FILE vừa giải nén vào khung upload; không upload file ZIP.
4. Commit changes. File index.html phải nằm ngay ở thư mục gốc repository.
5. Muốn hiển thị bằng GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root) → Save.

## Phân biệt hiển thị và chấm bài

Mở index.html trực tiếp hoặc GitHub Pages: giao diện, 16 đề bài, trình soạn thảo và lưu code hoạt động. Trang thông báo rõ chưa kết nối máy chấm. GitHub Pages không chạy backend Node.js hay Docker, nên không thể tự chấm C chỉ bằng upload file.

Để chạy thử và chấm thật trên máy: cài Node.js 20.10 trở lên và Docker Desktop, bật Docker Desktop ở chế độ Linux containers, mở Terminal tại thư mục chứa package.json rồi chạy:

```bash
docker pull gcc:14
npm start
```

Mở http://localhost:3000. Không cần npm install. Backend vẫn chạy C trong container riêng, không mạng, giới hạn RAM 128 MiB, 64 tiến trình; mỗi lần chạy tối đa 4 giây tường (bao gồm khởi động Docker) với giới hạn 0.5 CPU. Biên dịch tối đa 15 giây. Đây là bản dùng cục bộ; không tự bật truy cập Internet cho máy chấm.

## Nội dung

- index.html, style.css, app.js: giao diện.
- problems-data.js: dữ liệu đề dành cho trình duyệt, không có test chấm.
- server.js, judge.js: máy chủ và bộ chạy code Docker.
- problems.js, statements.json: đề và test chấm phía máy chủ.
- package.json: lệnh khởi động.
- problems.test.js: kiểm tra bộ đề; chạy npm test.

Khi đưa toàn bộ mã nguồn lên repository công khai, người đọc repository có thể xem test trong problems.js.

Bài 11 quy ước tháng 2 có 28 ngày vì đề không nhập năm. Bài 16 in bốn tổng a, b, c, d. Đọc định dạng chấm từng bài; không in lời nhắc nhập dữ liệu. Chấm kết quả, không tự xác nhận yêu cầu dùng toán tử ?: hoặc switch-case. Lịch sử và bản nháp lưu trên trình duyệt.
