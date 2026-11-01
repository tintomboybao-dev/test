# Sủi Study Lab — bản cập nhật v6

Website ôn tập hai môn độc lập: Toán rời rạc và Cơ sở dữ liệu. Dùng chung giao diện sáng/tối, cỡ chữ, danh mục và cách hiển thị tiến độ. Hoạt động offline, không cần npm hay dịch vụ bên ngoài.

## Cập nhật GitHub Pages

1. Giải nén bộ mã.
2. Upload **các file bên trong** vào thư mục gốc repo `test`, ghi đè file cùng tên và thêm các file mới, nhất là `db-practice.json`.
3. Giữ `index.html` ngay thư mục gốc. Không upload nguyên ZIP thay cho bộ mã.
4. Commit thay đổi vào nhánh GitHub Pages đang sử dụng; chờ lượt triển khai hoàn tất rồi tải lại trang.

`index.html` đã được build sẵn, tự chứa CSS, JavaScript và dữ liệu. Khi cập nhật mã nguồn sau này, chạy lại `python build.py` để đồng bộ nội dung triển khai.

## Cơ sở dữ liệu

- 4 chủ đề, 22 mục kiến thức được mở rộng: giải thích bằng lời, cách làm, ví dụ, lỗi dễ nhầm, câu tự kiểm tra và liên kết đến bài luyện.
- 39 bài và bộ bài từ các mục bài tập của 4 tài liệu bài học: 7 thiết kế CSDL/ER, 5 bộ truy vấn đại số quan hệ, 15 bài phụ thuộc hàm/khóa và 12 bài chuẩn hóa/phân rã. Một bộ bài có thể gồm nhiều câu nhỏ.
- Bài 3–7 của đề ôn tập giữa kỳ: đề đầy đủ, đọc đề, lời giải từng ý, bảng suy diễn/bao đóng/khóa và giải thích từng kết luận.
- Tìm kiếm không phân biệt dấu; lọc chủ đề và trạng thái đã nắm; gợi ý/lời giải đóng mở; mục lục trong bài dài.
- Tiến độ gồm 22 kiến thức + 5 bài giữa kỳ + 39 bài ôn tập = 66 nội dung.

Lời giải được biên soạn từ các đề trong tài liệu người dùng cung cấp; không gắn nhãn là đáp án chính thức của giảng viên. Bài mở nêu rõ giả thiết và dữ liệu minh họa tự tạo. Xem `CONTENT_SOURCES.md` để đối chiếu.

## Giữ tiến độ cũ

Tiếp tục dùng khóa lưu `sui-db-progress` và `sui-study-lab-v3-progress`. Danh sách 22 kiến thức và ID bài 3–7 không bị đổi; thêm trường `practice` riêng. Dữ liệu CSDL cũ từ `sui-db-done` cũng được đọc khi chưa có tiến độ mới. Tiến độ Toán rời rạc không đổi.

Tiến độ được giữ khi mở cùng địa chỉ website trên cùng trình duyệt, không xóa dữ liệu trang. Tỷ lệ CSDL có thể giảm vì tổng số nội dung tăng từ 27 lên 66; các dấu đã học cũ vẫn còn. Tiến độ không tự đồng bộ giữa thiết bị hoặc tên miền khác nhau.

## Cấu trúc mã

- `template.html`, `styles.css`, `theme.css`: khung và giao diện chung.
- `app.js`, `data.json`: Toán rời rạc.
- `db.js`: điều hướng, tìm kiếm, bài ôn tập và tiến độ CSDL.
- `db-knowledge.json`: kiến thức; giữ thứ tự để tương thích tiến độ.
- `db-data.json`: đề mẫu và lời giải giữa kỳ, ID 3–7.
- `db-practice.json`: 39 bài/bộ bài, ID ổn định theo chủ đề và số bài.
- `db-chapters.json`: bản trích chữ tài liệu gốc; giữ số trang/slide.
- `build.py`: đóng gói các nguồn trên thành `index.html` bằng Python chuẩn.

Không sửa riêng `index.html` rồi chạy build, vì bản build sẽ lấy lại từ các file nguồn.

## Kiểm tra

```sh
python build.py
python tests/verify_database.py
node tests/verify_ui.cjs
node --check db.js
node --check app.js
```

Các kiểm tra mới dùng Python/Node chuẩn, không cần cài thư viện. Kiểm tra CSDL dùng định nghĩa bao đóng, liệt kê khóa, tương đương phủ, tập PTH chiếu, chase kiểm tra lossless và dữ liệu phản ví dụ. Kiểm tra UI dùng DOM mô phỏng để kiểm tra tuyến trang, lọc, tiến độ và chuyển môn; không thay thế kiểm tra bố cục trên trình duyệt thật. Hai file kiểm tra Toán rời rạc cũ được giữ nguyên và có thể cần thư viện riêng.

Bản v6 đã kiểm tra chức năng và tính toán; chưa xác minh trực quan bằng trình duyệt thật trong môi trường biên soạn.
