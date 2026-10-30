# Sủi Study Lab — Design System

## Mục tiêu

- Hỗ trợ học thuật chứ không phải landing page bán hàng. Tập trung nội dung, dễ đọc trong nhiều phút.
- **Một vấn đề / một màn hình** khi xem chi tiết bài, với lộ trình logic: đề bài → nhận dạng → ý tưởng → vì sao đúng → các bước → kết quả → kiểm tra → ghi chú.
- Bố cục mobile-first, panel chỉ để bổ sung kiến thức; trên điện thoại nội dung bài giải luôn đi trước panel phụ.

## Visual language

- Phong cách **minimal academic workspace**: nền off-white, card trắng, đường viền mảnh, tương phản rõ, cobalt làm màu hành động, xanh ngọc cho tiến độ/đáp án, hổ phách cho lỗi thường gặp.
- Font hệ thống ưu tiên hiển thị tiếng Việt ổn định và offline.
- Icon stroke SVG thống nhất, không dùng emoji làm icon điều hướng.
- Các biến `--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--teal`, `--amber`, `--border` là semantic tokens, cung cấp cả light và dark.

## Giao diện & tương tác

- Bàn phím: focus hiển thị; nút HTML thật; liên kết bỏ qua menu; dialog native đóng bằng Escape.
- Điện thoại: menu trượt có lớp phủ và nút đóng; điều hướng 4 mục; vùng bấm mục tiêu ≥44px ở nút quan trọng.
- Không khóa zoom; công thức có `overflow-wrap:anywhere` tránh tràn ngang.
- Chuyển động ngắn, hỗ trợ `prefers-reduced-motion`.
- Tìm kiếm giữ focus khi lọc; bộ lọc chip có `aria-pressed`, trạng thái chọn không chỉ thể hiện bằng màu.
- Giao diện học sử dụng `<button>`/`<nav>`/`<main>`/`<article>`/`<section>` có ý nghĩa; thông báo có `role=status`.
- Dữ liệu nhập được HTML-escape, không render HTML tùy ý từ ghi chú/tệp JSON.

## Breakpoints đã kiểm thử

- 320px, 375px (điện thoại), 768px (tablet), 1024px (laptop), 1440px (desktop).
- Chế độ sáng/tối, mở bài chi tiết, tìm kiếm, trắc nghiệm, hoàn thành bài, ghi chú.

## Tài liệu gợi ý

- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- `.claude/skills/ui-ux-pro-max/SKILL.md`
- `.claude/skills/ui-ux-pro-max/references/quick-reference.md`

Chỉ áp dụng các nguyên tắc liên quan đến website học tập; không coi toàn bộ hướng dẫn thiết kế native app là yêu cầu bắt buộc cho website.
