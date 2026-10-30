# Sủi Study Lab v3 — Toán rời rạc

Website học tập bằng **HTML, CSS, JavaScript thuần**, dành cho máy tính và điện thoại. Không cần đăng nhập, backend, npm, thư viện icon hay đường truyền mạng để hiển thị công thức.

## Nội dung

| Mục | Số lượng | Cấu trúc |
|---|---:|---|
| Tổng hợp công thức | 20 công thức | Công thức toán học (MathML) → Điều kiện dùng → Cách áp dụng → Ví dụ → Lỗi cần tránh |
| Đề mẫu | 19 câu | Đề → Nhận dạng → Công thức tổng quát → Phương pháp → Lời giải từng bước → Đáp án |
| Ôn tập vận dụng | 50 câu mới | Đề đầy đủ → **Xem gợi ý/ví dụ** → **Xem lời giải** → Đánh dấu đã nắm |
| Chủ đề | 8 nhóm | Ánh xạ; Stars and Bars; Venn; khai triển; quy tắc đếm; Fibonacci; tổ hợp; chia nhóm |

- Tìm kiếm, lọc chủ đề, chuyển bài trước/sau.
- Đánh dấu tiến độ riêng cho 19 đề mẫu và 50 bài mới; lưu trong localStorage trên trình duyệt.
- Có chế độ sáng/tối, điều chỉnh cỡ chữ và điều hướng bằng bàn phím.
- Công thức dùng **MathML gốc của trình duyệt**; không cần kết nối tới KaTeX/MathJax CDN, không xuất hiện mã LaTeX thô khi offline.
- Không có icon tự vẽ, emoji trang trí hay thư viện icon ngoài.

## Cách sử dụng nhanh

**Chỉ tải 1 file**: mở `index.html` bằng Chrome/Edge/Firefox/Safari phiên bản hiện đại. Chuyển tới "Tổng hợp công thức", "Đề mẫu" hoặc "Ôn tập 50 bài" qua thanh điều hướng.

### Đưa lên GitHub Pages

1. Tạo repository, ví dụ `sui-study-lab`.
2. Upload **file `index.html` vào thư mục gốc** của nhánh `main`. Có thể upload toàn bộ source để dễ chỉnh sửa.
3. GitHub repository → **Settings → Pages → Build and deployment**.
4. Chọn **Deploy from a branch**, branch **main**, folder **/(root)** và Save.
5. Đường dẫn thường là `https://TÊN_TÀI_KHOẢN.github.io/sui-study-lab/` khi GitHub Pages triển khai xong.

Không cần chạy build để **xem trang web** hoặc để up file `index.html` đã đóng gói.

## Chỉnh mã nguồn, thêm câu hỏi

```text
sui-study-lab-v3/
  index.html             # Bản độc lập, hoàn chỉnh, đưa lên GitHub Pages
  template.html          # HTML khung
  styles.css             # Tất cả CSS
  app.js                 # Điều hướng, hiển thị, luyện tập và tiến độ
  data.json              # Công thức, 19 đề mẫu và 50 đề ôn tập
  build.py               # Đóng gói source thành index.html
  generate_data.py       # Script dùng để dựng dữ liệu phiên bản này
  old-data.json          # Dữ liệu tham khảo của 19 đề gốc
  tests/
    verify_content.py    # Đối chiếu các đáp án toán học
    verify_interactions.py # Test chức năng bằng Playwright (tùy chọn)
  README.md
```

Muốn sửa công thức, cách giải hoặc thêm bài ôn tập: chỉnh `data.json`, sau đó chạy:

```bash
python build.py
```

Sau đó commit `index.html` mới. **Không cần chạy `generate_data.py` sau khi sửa `data.json`**; script đó là nguồn tạo dữ liệu ban đầu và sẽ ghi đè nội dung mặc định nếu chạy lại.

### Trường dữ liệu

- `topics[]`: danh sách 8 chủ đề (`id`, `name`, `short`, `description`).
- `formulas[]`: `id`, `topic`, `title`, `mathml`, `general`, `when`, `apply`, `example`, `mistake`.
- `samples[]`: 19 bài đã giải. Bài liên kết công thức qua `formulaId`.
- `reviews[]`: 50 bài ôn tập. Bài liên kết công thức qua `formulaId`, có `steps[]` gồm `title` và `detail`.

Khi thêm bài, đặt `id` tuần tự mới và cập nhật nhãn số lượng ở HTML/JS nếu bộ bài vượt 19/50. Cấu trúc sidebar đã chừa chỗ cho các môn khác, nhưng **phiên bản này chỉ có nội dung Toán rời rạc**; để thêm nhiều môn mặc định với điều hướng riêng, cần mở rộng cấu trúc dữ liệu và giao diện lựa chọn môn ở lần cập nhật tiếp theo.

## Kiểm thử

```bash
python tests/verify_content.py
python tests/verify_interactions.py  # cần playwright và chromium
```

Kiểm thử giao diện đã chạy ở độ rộng 320px, 390px, 820px và 1440px. Lưu ý môi trường kiểm thử đã dùng `page.set_content` vì trình duyệt trong môi trường tạo file không cho điều hướng tới file URL/localhost, nên chưa có kiểm thử tự động lưu tiến độ qua một lần reload thực tế. Đã kiểm thử thao tác đánh dấu trong một phiên.

## Lưu ý toán học

- Câu 8/19 đề mẫu sử dụng **số liệu Venn minh họa**, vì số liệu đề gốc không được ghi lại đầy đủ.
- Câu 14/19 giải cả hai giả định: cho phép và không cho phép dùng lại tuyến ở lượt về.
- Bộ 50 câu ôn tập được biên soạn riêng dựa trên các dạng của 19 câu gốc; không phải đề thi chính thức.
- Tiến độ chỉ lưu trên **trình duyệt hiện tại**; xóa dữ liệu trang có thể làm mất trạng thái đã nắm.

## Nguyên tắc giao diện

Ưu tiên nội dung theo thứ tự **đề bài → công thức → cách áp dụng → lời giải**, kiểu chữ dễ đọc, nút thao tác rõ, vùng chạm đủ lớn, không dùng icon tự tạo. Thiết kế có tham khảo các nguyên tắc khả dụng từ repository `nextlevelbuilder/ui-ux-pro-max-skill`, nhưng mã nguồn và nội dung được biên soạn riêng.
