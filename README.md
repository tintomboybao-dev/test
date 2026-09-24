# ChemLab Studio

Bản thiết kế lại phòng thí nghiệm hóa học ảo theo hướng sandbox tương tác trực tiếp.

## Chạy nhanh

- Cách đơn giản nhất trên Windows: mở `index.html` bằng Chrome hoặc Edge.
- Không cần cài package, Node.js hay server.
- Nếu trình duyệt chặn một số tính năng PWA khi mở bằng `file://`, phần mô phỏng chính vẫn hoạt động bình thường.

## Tương tác

- Kéo trực tiếp chai, cốc, ống nghiệm, bình tam giác và đèn Bunsen trên bàn.
- Kéo chai hóa chất tới miệng dụng cụ để thêm một liều.
- Chọn dụng cụ rồi nhấn `Q` / `E` hoặc lăn chuột trên dụng cụ để nghiêng.
- Khi miệng dụng cụ đang nghiêng nằm gần miệng một dụng cụ khác, chất lỏng được rót liên tục.
- Kéo đèn Bunsen xuống dưới dụng cụ để gia nhiệt theo thời gian.
- Click đèn Bunsen để bật/tắt.
- `Space` để lắc dụng cụ; `Delete` để xóa vật thể đang chọn.

## Nội dung hóa học

- Bảng tuần hoàn đủ 118 nguyên tố.
- Kho hóa chất gồm axit, bazơ, muối, kim loại, chất rắn, chất oxi hóa và xúc tác thường dùng.
- Engine mẫu hiện có 22 phản ứng thật để minh họa: trung hòa, tạo kết tủa, thế kim loại, giải phóng khí, phân hủy có điều kiện, phản ứng tỏa nhiệt và mô phỏng phản ứng mạnh.
- Hiệu ứng trực quan gồm: chất lỏng, dòng rót, bọt khí, hơi nước, kết tủa, kim loại bám, tia lửa, khói, flash và rung camera.
- Web Audio tạo âm thanh phản ứng bằng tổng hợp âm, không cần file âm thanh ngoài.

## Cấu trúc

- `index.html`: giao diện chính.
- `styles.css`: hệ thống giao diện glass/dark laboratory.
- `data.js`: 118 nguyên tố, hóa chất và database phản ứng.
- `chemistry.js`: reaction engine, pH ước tính, truyền dung dịch, màu hỗn hợp.
- `app.js`: canvas renderer, drag/drop, pouring, heating, particles, audio, UI.
- `manifest.webmanifest`: metadata cho trình duyệt/PWA.

## Lưu ý

Đây là mô phỏng giáo dục. Hình ảnh phản ứng mạnh, ngọn lửa và nhiệt độ chỉ phục vụ trực quan; không được xem là hướng dẫn tiến hành thí nghiệm thật.
