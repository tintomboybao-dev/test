# SIGNAL // 47 v3.0 — Living Station

Một mini-game sci-fi / mystery chạy hoàn toàn trong trình duyệt. Không npm, không server, không PWA: mở `index.html` là chơi được và có thể đưa thẳng lên GitHub Pages.

## Hệ thống chính

- Song ngữ Tiếng Việt / English, lưu lựa chọn tự động.
- 12 transmission có chuỗi mở khóa, decoder, archive, spectrum analyzer và secret hydrogen band 1420.405 MHz.
- Web Audio: radio static, carrier tone, beep và lệnh `play` / `listen` để phát fingerprint tín hiệu.
- Star Map, Transmission Database, upgrades, achievements, AP progression.
- Station Exploration với 5 khu vực, hotspot, inventory, puzzle và 5 Memory Tapes.
- Power Grid: bật/tắt Receiver, Archive Core, Observatory, CCTV, Life Support.
- Station Integrity + Signal Contamination; PING/giải mã một số nguồn nguy hiểm có hậu quả.
- CCTV Matrix với camera anomaly và frame điều tra.
- Procedural Exoplanet Survey: 6 mục tiêu thay đổi theo ngày thật và tiến độ game.
- Side Missions + Daily Log để tạo vòng lặp chơi dài hơn.
- Daily Anomaly + sự kiện hệ thống ngẫu nhiên theo phiên.
- Settings: bật/tắt CRT scanlines, animation, Export/Import save.
- 4 ending: SILENCE, REPLY, LOOP và ending bí mật WITNESS.
- Save tự động bằng `localStorage`, migrate từ save v2.x.

## Terminal

`help`, `scan`, `tune 94.7`, `decode`, `archive`, `analyze`, `play`, `map`, `database`, `explore`, `memories`, `inventory`, `systems`, `cctv`, `planets`, `quests`, `decon`, `settings`, `upgrades`, `achievements`, `status`, `final`, `clear`, `reset`.

## Chạy

1. Mở `index.html` bằng Chrome/Edge/Firefox hiện đại.
2. Bấm `AUDIO` một lần nếu muốn bật Web Audio; trình duyệt yêu cầu tương tác người dùng trước khi phát âm thanh.
3. Có thể upload đúng file `index.html` lên GitHub Pages.

## Ghi chú QA

JavaScript được kiểm tra syntax bằng Node.js. Browser headless trong container hiện không khởi động hoàn chỉnh do DBus của môi trường, nên kiểm thử giao diện cuối cùng nên được mở trực tiếp trong trình duyệt máy người dùng.
