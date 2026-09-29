# C Lab — chấm 16 bài tập C

Trang web chấm trực tiếp 16 bài trong tài liệu “BÀI TẬP NGÔN NGỮ LẬP TRÌNH C”. Có đề bài, trình soạn thảo, chạy với input tự nhập, nộp để chấm nhiều test và lịch sử lưu trong trình duyệt.

## Cài đặt và chạy trên Windows với Visual Studio Code

1. Cài **Node.js 20 trở lên** và **Docker Desktop**. Mở Docker Desktop và chờ thông báo engine đang chạy (Linux containers).
2. Mở thư mục `c-judge` bằng Visual Studio Code. Mở Terminal trong VS Code (`Ctrl` + `` ` ``).
3. Chạy `docker pull gcc:14` (lần đầu cần tải image). Chạy `npm start`.
4. Mở `http://localhost:3000` trong trình duyệt. Nếu muốn cổng khác: PowerShell dùng `$env:PORT=3001; npm start`.

Không cần cài extension hoặc `npm install`: backend chỉ dùng thư viện chuẩn Node. Có thể cài extension **C/C++** của Microsoft để sửa file C ngoài web, nhưng không cần cho việc nộp trên web. Trên Windows, Docker Desktop cần WSL 2 và bật chế độ Linux containers.

## Cách dùng

Chọn bài ở thanh trái; đọc phần “Định dạng chấm”; viết một chương trình C đọc **stdin** bằng `scanf` và in kết quả ra **stdout** bằng `printf`. Bấm **Chạy thử** để dùng input tự nhập; bấm **Nộp bài** để chấm các test lưu trên server. Không in lời mời nhập dữ liệu. Kết quả và code được lưu bằng localStorage trên chính trình duyệt này; máy khác không thấy lịch sử.

## Quy tắc chấm

- GCC 14 biên dịch `-std=c11 -O2 -Wall -Wextra`. Lỗi biên dịch, lỗi chạy, quá thời gian và sai kết quả được báo riêng.
- Giới hạn mỗi lần chạy: 2 giây, 128 MiB RAM, tối đa 64 tiến trình, không có mạng. Output tối đa khoảng 64 KiB; code tối đa 32 KiB; input chạy thử tối đa 8 KiB.
- Với bài có đầu ra dạng số, so sánh các số theo thứ tự với sai số `1e-4` (sai số tương đối tối thiểu `1e-5`). Các bài chữ so sánh các token, không phân biệt khoảng trắng. Bài 13 so sánh byte ASCII mở rộng (33–255), chấp nhận khoảng trắng cuối dòng.
- “Chạy thử” chỉ hiển thị stdout/stderr và không chấm; “Nộp bài” chấm các test cố định ở `problems.js`. Các test chấm để ở backend; không được gửi về API đề bài.
- Đề gốc không quy định format cho nhiều bài. Mỗi bài có một định dạng chấm được nêu rõ trong giao diện. Bài 11 quy ước tháng 2 có 28 ngày vì đề không nhập năm. Bài 16 xuất bốn tổng a, b, c, d theo đúng thứ tự.
- Bài 6–8 yêu cầu toán tử điều kiện; bài 12 yêu cầu switch-case; hệ thống chấm **kết quả**, không kiểm tra cấu trúc mã nguồn. Giảng viên cần kiểm tra thủ công nếu chấm cả phương pháp.

## An toàn khi sử dụng

Mã C chỉ được biên dịch và chạy trong Docker container tách biệt, không có mạng, không có đặc quyền, với thư mục tạm riêng từng lần chấm. Không sửa server để chạy trực tiếp `gcc` hoặc file thực thi từ bản nộp trên máy chủ. Đây là bản dành cho học tập cục bộ; trước khi cho nhiều người truy cập qua Internet cần thêm xác thực, hàng đợi, giới hạn lưu lượng và giám sát Docker.

Chạy `npm test` để kiểm tra dữ liệu bài và quy tắc so sánh. Docker Desktop phải chạy khi dùng nút Chạy thử / Nộp bài.
