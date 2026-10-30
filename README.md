# Sủi Study Lab — phiên bản 2

Trang học tập cá nhân viết bằng HTML, CSS và JavaScript thuần. Mở `index.html` để học trực tiếp, không cần server, tài khoản hay kết nối Internet.

## Nội dung hiện có

- Môn đầu tiên: **Toán rời rạc**, gồm **19 bài giải đầy đủ** thuộc **8 chủ đề**.
- Mỗi bài: **Nhận dạng → Ý tưởng → Lý do chọn cách giải → Các bước → Đáp án → Tự kiểm tra → Lỗi dễ mắc**.
- Sơ đồ Venn ở câu 8, sơ đồ đường đi ở câu 14, bảng truy hồi Fibonacci ở câu 15.
- Tìm kiếm bài/công thức, lọc theo chủ đề, xem công thức liên quan, trắc nghiệm 19 câu.
- Ghi chú theo từng bài, đánh dấu đã nắm, tiến độ, giao diện sáng/tối, tùy chọn cỡ chữ.
- Có thể tạo môn học mới, chủ đề, công thức và bài tập ngay trên giao diện.
- Xuất/nhập bản sao dữ liệu JSON. Giao diện hỗ trợ điện thoại và bàn phím.

> Lưu ý: Số liệu câu 8 là **minh họa** chứ không phải đề thi gốc. Câu 14 trình bày cả hai giả định (được / không được sử dụng lại tuyến).

## Sử dụng ngay

Mở `index.html` bằng Chrome, Edge, Firefox hoặc Safari. Trang này hoạt động offline vì toàn bộ mã nguồn, CSS và bộ câu hỏi được đóng gói trong **một file HTML**.

## Triển khai GitHub Pages

1. Tạo repository mới trên GitHub, ví dụ `sui-study-lab`.
2. Đưa `index.html` (và các tệp mã nguồn nếu muốn quản lý lịch sử) vào thư mục gốc của nhánh `main`.
3. Vào **Settings → Pages → Build and deployment** và chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)**.
4. Chờ GitHub Pages hoàn tất. Đường dẫn thường có dạng `https://TEN_USER.github.io/sui-study-lab/`.

Không cần npm, hosting có backend, tài khoản cloud hay API key.

## Thêm môn học / nội dung

**Cách 1 — Ngay trên giao diện:** Bấm **Thêm môn học**, sau đó **Thêm bài** hoặc **Thêm công thức**. Môn/chủ đề sẽ được lưu trên trình duyệt đang sử dụng. Bấm **Xuất bản sao dữ liệu** để tải JSON, sau đó **Nhập bản sao dữ liệu** trên thiết bị khác.

**Cách 2 — Sửa nội dung mặc định trong repository:** Mở `data.json` để chỉnh `TOPICS` (chủ đề), `F` (công thức), `P` (bài tập), `QA` (trắc nghiệm). Sau khi sửa, chạy:

```bash
python build.py
```

Lệnh này tái tạo `index.html` từ `template.html`, `styles.css`, `app.js` và `data.json`. Đưa `index.html` mới lên GitHub để tất cả người truy cập thấy nội dung mới.

Hiện tại nội dung mặc định chỉ đóng gói sẵn **Toán rời rạc**. Nếu muốn tạo nhiều môn mặc định ở cấp mã nguồn, có thể mở rộng mảng `courses` khởi tạo trong `app.js`.

**Quan trọng:** Nội dung Sủi thêm **trên giao diện** chỉ nằm trong localStorage của thiết bị, **không tự cập nhật repository** hay đồng bộ giữa các trình duyệt. Xuất JSON giúp sao lưu/trao đổi, nhưng muốn mọi người truy cập thấy môn mới thì cần đưa nội dung vào mã nguồn trước khi build & commit.

## Cấu trúc project

```text
sui-study-lab-v2/
├── index.html           # File duy nhất cần đưa lên GitHub Pages
├── template.html        # Bộ khung HTML (source)
├── styles.css           # Giao diện responsive, sáng/tối (source)
├── app.js               # Logic giao diện, tìm kiếm, lưu tiến độ (source)
├── data.json            # 19 bài và toàn bộ công thức (source)
├── build.py             # Tạo bản index.html độc lập, không phụ thuộc thư viện
├── DESIGN_SYSTEM.md     # Quy tắc thiết kế
└── tests/
    ├── verify_math.py  # Đối chiếu kết quả toán học
    └── smoke.py         # Kiểm thử giao diện bằng Playwright (tùy chọn)
```

## Kiểm thử

```bash
python tests/verify_math.py
# cần cài Playwright + Chromium để kiểm thử trình duyệt:
python tests/smoke.py
```

Script smoke dùng `set_content()` trong môi trường kiểm thử hạn chế. Trong trình duyệt thật, các chức năng lưu nội dung hoạt động với `localStorage` bình thường.

## Thiết kế và nguồn tham khảo

Thiết kế tham khảo nguyên tắc accessibility, cấu trúc thông tin, khả năng đọc, responsive, xử lý trạng thái tương tác từ dự án mở [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). Mã HTML/CSS/JS của Sủi Study Lab được viết riêng, không phải sao chép code giao diện từ repository đó.

## Quyền riêng tư

Trang không tải dữ liệu của Sủi lên máy chủ. Dữ liệu tự thêm, ghi chú, tiến độ được lưu trong bộ nhớ cục bộ của trình duyệt. Xóa dữ liệu trình duyệt có thể làm mất thông tin chưa xuất JSON.
