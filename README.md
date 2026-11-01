# Sủi Study Lab v7

Website ôn tập ba môn độc lập: **Toán rời rạc**, **Cơ sở dữ liệu**, **Lập trình hướng đối tượng (OOP/C#)**. Giao diện sáng/tối,cỡ chữ,danh mục và tiến độ thống nhất. Website hoạt động offline,không cần npm hay đăng nhập.

## Cập nhật GitHub Pages

Giải nén ZIP rồi upload **các file và thư mục bên trong** vào thư mục gốc repository,ghi đè file cùng tên và giữ các file mới. `index.html` nằm ngay thư mục gốc; giữ cả thư mục `oop-code` để nút tải file C# hoạt động. Không upload nguyên ZIP thay cho bộ mã.

Commit lên nhánh GitHub Pages đang dùng,chờ triển khai rồi tải lại trang. Tiến độ cũ được giữ khi mở cùng địa chỉ trên cùng trình duyệt và không xóa dữ liệu trang.

## Nội dung OOP

- 38 mục kiến thức/công thức từ đủ 4 chủ đề PDF,ví dụ và lỗi dễ nhầm.
- 42 câu/bài từ BaiTapOOP:20 trắc nghiệm (mỗi câu4 đáp án,giải thích cả4);22 tự luận/viết mã có đáp án đầy đủ.
- 27 bài lập trình:Lab1 có13,Lab2 có8,Lab3 có6;kể cả bài dấu*. Mỗi Lab có danh mục riêng,mỗi bài có đề,phân tích lớp,từng filecode,cách làm,ví dụ và tự kiểm tra.
- 63 file C# trong27 project Console độc lập,có nút sao chép/tải từng file.
- Tìm kiếm không phân biệt dấu,lọc chủ đề/loại câu,tiến độ OOP riêng gồm107 nội dung.

Những đáp án sai/mơ hồ trong ảnh có ghi chú hiệu chỉnh rõ. Xem `OOP_CONTENT_SOURCES.md` để đối chiếu đầy đủ. Website hiển thị mã; không chạy C# trong trình duyệt.

## Mở và chạy bài Lab

Chọn Lab,bài rồi đọc các file. Ví dụ bài3.3 ở `oop-code/Lab3/Bai03/`:

1. Mở `Lab3_Bai03.csproj` bằng Visual Studio có SDK .NET8 phù hợp,hoặc mở terminal tại thư mục đó.
2. Chạy `dotnet run`.
3. Nhập theo nhắc;đối chiếu ví dụ trên website.

Mỗi bài là project riêng;không dán nhiều Main từ nhiều bài vào cùng project. Project dùng cú pháp truyền thống như bài giảng,không dùng các tính năng ngôn ngữ mới chỉ để rút ngắn code.

`NhapLieu.cs` là lớp hỗ trợ kiểm tra dữ liệu được đưa đầy đủ vào từng bài cần dùng. Các bài giao diện Console như2.3 phải chạy trong terminal có bàn phím/cửa sổ thật;không dùng ô kết quả văn bản tĩnh.

## Mã nguồn website

`template.html`,`styles.css`,`theme.css` là giao diện chung;`app.js`,`data.json` cho Toán;`db.js` và nhóm `db-*.json` cho CSDL;`oop.js` và nhóm `oop-*.json` cho OOP. Chạy `python build.py` sau khi sửa các nguồn để tạo lại `index.html`.

`index.html` đã build sẵn,tự chứa CSS/JavaScript/dữ liệu;không tải thư viện ngoài khi học. Các file C# tải bằng đường dẫn tương đối trong `oop-code`.

## Tiến độ

Toán tiếp tục dùng `sui-study-lab-v3-progress`;CSDL dùng `sui-db-progress` và hỗ trợ dữ liệu cũ `sui-db-done`;OOP dùng `sui-oop-progress`. Việc chọn đáp án không tự đánh dấu đã nắm;người học tự đánh dấu khi có thể giải thích. Tiến độ lưu trên trình duyệt,không tự đồng bộ nhiều thiết bị.

## Kiểm tra đã chạy

```sh
python build.py
python tests/verify_database.py
python tests/verify_oop.py
node tests/verify_ui.cjs
node --check app.js
node --check db.js
node --check oop.js
```

Các kiểm tra Python/Node trên dùng thư viện chuẩn. Kiểm tra UI dùng DOM mô phỏng:tuyến trang,lựa chọn/chấm/làm lại trắc nghiệm,lọc,tiến độ và chuyển ba môn. Kiểm tra nội dung OOP gồmđộ phủ nguồn,đáp án,đường dẫn và cấu trúc mã;không thay thế trình biên dịch C#.

**Giới hạn xác minh:** môi trường biên soạn không có SDK/trình biên dịch C# và trình duyệt thật. Chưa chạy biên dịch/thực thi27 project,chưa kiểm tra trực quan bố cục bằng trình duyệt.

## Kiểm tra C# trên máy có SDK .NET8

```sh
dotnet run --project tests/OOPRegression/OOPRegression.csproj
```

Project này liên kết toàn bộ mã Lab trong đúng namespace của chúng,chọn một Main kiểm tra riêng và kiểm tra tuổi,Armstrong,sắp xếp,tài khoản,hình học,thời gian,BMI,phân số,operator,học phí,lưu trú/static. Nó cũng buộc bộ biên dịch kiểm tra tất cả63 file C#. Mã kiểm tra này đã được chuẩn bị,chưa được chạy tại môi trường biên soạn.

Các kiểm tra Toán rời rạc cũ vẫn có trong thư mục tests và có thể cần thư viện riêng. Nội dung hai môn cũ được giữ tương thích.
