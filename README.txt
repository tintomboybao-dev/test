ARCANA NOCTIS V21.3 WEB STABLE

Fix chính:
- Safe localStorage cho chế độ file:// trên Windows.
- Không để SecurityError từ localStorage dừng script trước khi tạo bộ bài Tarot.
- Không PWA / không service worker / không manifest.
- Core UI và Tarot dùng JavaScript thường, ưu tiên mở trực tiếp index.html.
- CDN ngoài vẫn là optional/fail-soft cho các tính năng cần dữ liệu mạng.

Cách chạy Windows:
1. Giải nén toàn bộ thư mục.
2. Double-click index.html bằng Chrome hoặc Edge.

GitHub Pages:
- Đưa các file vào root repo.
- Settings > Pages > Deploy from a branch > main / root.
