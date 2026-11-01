# Sủi Study Lab v5

Website ôn tập Toán rời rạc và Cơ sở dữ liệu. Giao diện thống nhất cho hai môn, có chế độ sáng/tối, tìm kiếm, lọc chủ đề và lưu tiến độ trên trình duyệt.

## Upload GitHub Pages

Giải nén file ZIP. Tải các file bên trong lên thư mục gốc của repository test, ghi đè file cùng tên. Không tải nguyên file ZIP lên repo. index.html phải nằm ngay thư mục gốc. GitHub Pages đang dùng nhánh main sẽ triển khai từ bản cập nhật đó.

## Chỉnh sửa và xây dựng

Chạy python build.py để tạo lại index.html. styles.css là cấu trúc giao diện, theme.css chứa hệ màu và các thành phần v5. app.js điều khiển Toán rời rạc; db.js điều khiển Cơ sở dữ liệu. Dữ liệu nằm trong các file JSON. Không cần npm hay máy chủ để dùng trang web.

## Nội dung

Toán rời rạc: 20 công thức, 19 đề mẫu, 50 bài ôn tập. CSDL: 4 chủ đề, 22 mục kiến thức, lời giải bài 3–7. Mọi tiến độ được lưu riêng theo môn trên trình duyệt. Tiến độ của các phiên bản trước được giữ khi dùng cùng địa chỉ website.

## Thiết kế

Tham khảo UI/UX Pro Max và xem DESIGN_SYSTEM.md. Hai môn dùng chung phân cấp chữ, bố cục, thẻ chủ đề, nút và bảng tiến độ. Không tải font hoặc thư viện ngoài khi mở trang.
