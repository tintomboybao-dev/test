# Nguồn và quy ước biên soạn OOP

## Tài liệu bài học

Đọc đủ bốn PDF trong `BaihocOOP.zip`: `Topic 1 - Aug26.pdf`, `Topic 2-Aug26.pdf`, `Topic 3 - Aug26.pdf`, `Topic 4-Aug26.pdf`. Website tổng hợp thành 38 mục tiếng Việt, có tham chiếu số trang, cách áp dụng, ví dụ và lỗi thường gặp. Bản trích chữ gốc theo trang nằm trong `oop-sources.json`.

- Chủ đề 1: mô hình lập trình, trạng thái/hành vi, lớp/đối tượng, thông điệp, bốn nguyên lý, ưu/nhược điểm và ngôn ngữ OOP.
- Chủ đề 2: .NET/CLR/BCL, IDE/project/namespace, Main/Console, định dạng, kiểu/biến/hằng/chuyển kiểu, toán tử, rẽ nhánh/vòng lặp, hàm/ref/out, enum/mảng/List và ngoại lệ.
- Chủ đề 3: quy trình phát triển, tìm lớp/trách nhiệm, UML, bội số/hướng liên kết, aggregation/composition/dependency, generalization/realization và ba bài thiết kế cuối chủ đề. Các công thức GPA/điểm thành phần/lương được giải thích theo giả thiết nguồn.
- Chủ đề 4: phạm vi truy cập, property, constructor/sao chép/finalizer, this/static, cài đặt quan hệ và operator. Các quy tắc C# cần để mã biên dịch đúng được chú thích riêng.

Một số trang dùng hình nhúng không có trong lớp chữ đã được xem trực tiếp, gồm bảng kiểu, sơ đồ UML/quan hệ, ví dụ code và Lab 2 trang 6.

## Toàn bộ câu hỏi từ BaiTapOOP

42 ảnh trong `BaiTapOOP.zip` tương ứng đúng 42 bản ghi. Mỗi câu giữ tên ảnh nguồn, dịch đề và lựa chọn sang tiếng Việt, giữ nguyên tên kiểu/từ khóa/chuỗi xuất trong các đoạn C# khi chúng là dữ kiện.

| Nhóm nguồn | Mã trên website | Số lượng |
| --- | --- | ---: |
| 15 câu OOP đầu tiên | t1-01…t1-15 | 15 |
| 2 bài tự luận viết chương trình | t2-p01,t2-p02 | 2 |
| 10 câu điều kiện/vòng lặp | t2-01…t2-10 | 10 |
| 15 câu lớp/property/static/operator | t4-01…t4-15 | 15 |

Tổng cộng **20 câu trắc nghiệm**, mỗi câu đúng bốn lựa chọn A–D và một đáp án có thể bảo vệ được; **22 câu tự luận/viết mã** có đáp án và giải thích. Trắc nghiệm chọn xong bấm kiểm tra mới thấy lý do cho cả bốn lựa chọn. Câu tự luận có phần mở lời giải. Chấm trắc nghiệm không tự đánh dấu “đã nắm”; người học tự đánh dấu sau khi giải thích được.

### Những hiệu chỉnh quan trọng

- t1-01: tên đầy đủ Object-Oriented Programming không sai chỉ vì bộ chấm đòi chuỗi Object-Oriented.
- t1-08: first-class functions và tránh mutable state mô tả Functional Programming; đáp án Procedural trong ảnh sai.
- t1-15: ảnh không có lựa chọn đúng và lặp hai phương án. Thay D bằng “Đối tượng là một thể hiện của lớp”; ghi rõ hiệu chỉnh ngay trong bài.
- t2-02: false là từ khóa; False là cách Console hiển thị bool, không phải hai giá trị logic khác nhau.
- t2-08: x=10,if(x>5) in A, dù ảnh chấm B.
- t4-01: A,B cũng có thể là property hợp lệ. Làm rõ yêu cầu là property public đọc/ghi để chỉ D đáp ứng.
- t4-04,t4-06: làm rõ ngữ cảnh lớp khác/Main để tránh các giả định ẩn về scope và using static.
- t4-09: WriteLine(s.Name) hợp lệ; lớp gốc còn nhầm Name/name, phải sửa tên trước khi biên dịch.
- t4-11: ảnh lẫn float/double; thống nhất double theo property/chữ ký mẫu và ghi chú tại bài.
- t4-15: tên biến student hay s đều được; không chấm sai ngữ nghĩa chỉ vì khác tên biến.

## Các PDF Lab

| Tệp | Bài được đưa vào | Cấu trúc |
| --- | --- | --- |
| Lab_1 (1).pdf | 1.1–1.13 | 13 bài, gồm cả bài tự luyện * |
| Lab 2_Sep26 (1).pdf | 2.1–2.8 | 8 bài, gồm cả bài * và code nhúng trong hình |
| Lab 3_Sept26 (1).pdf | 3.1–3.6 | 6 bài, gồm cả bài * |

27 bài là 27 project Console riêng; 63 file C# (kể cả lớp hỗ trợ nhập liệu). Bài dự đoán lỗi có phần giải thích đoạn nguyên gốc, còn project minh họa tách/sửa lỗi có chủ đích để người học đối chiếu. Không giả vờ các đoạn không biên dịch có kết quả chạy.

### Cách viết theo bài học

Biến/tham số/trường bắt đầu chữ thường; class/method/property bắt đầu chữ hoa; giữ tên bắt buộc trong sơ đồ như BankAccount,Adult,Time,Circle,Cal_Perimeter,Cal_Area,Info. Dùng Program.Main truyền thống; trường private, property/phương thức public; mảng và vòng lặp cơ bản,ref ở hoán đổi. Mỗi lớp/file có trách nhiệm rõ. Không đưa LINQ,record,top-level statements hoặc các mẫu kiến trúc không cần thiết vào lời giải Lab.

Thêm `>` cùng `<`, `!=` cùng `==`; Equals/GetHashCode cho lớp có so sánh bằng theo giá trị. Dùng checked phát hiện tràn phân số thay vì im lặng sai số. `NhapLieu.cs` là lớp hỗ trợ, hiển thị đầy đủ trên website và có trong từng project.

### Giả thiết cần công khai

- Lab 1.6: “sai quá 3” được hiểu là dừng ở lần sai thứ tư. Nếu giảng viên yêu cầu tối đa ba lần thì đổi điều kiện như ghi chú trong bài.
- Lab 1.11: nguyên âm/phụ âm theo bảng chữ cái tiếng Anh a–z.
- Lab 1.12: tăng trưởng lũy kế,tỷ lệ không âm,số năm nguyên không âm. Làm tròn dân số chỉ để hiển thị.
- Lab 2.3: cửa sổ Console thật,chuỗi ASCII để mỗi ký tự một cột; các thao tác con trỏ không phải một bài web chạy trực tiếp.
- Lab 2.4: hai mốc trong cùng ngày,hiệu tuyệt đối; không tự tính qua đêm.
- Lab 2.6/3.5: ngưỡng BMI và lời tính số kg chỉ theo PDF; biên 25 vẫn là nhóm bình thường của đề. Không coi đó là đánh giá sức khỏe/tuyển quân thực tế.
- Lab 2.7: pt1 chưa khai báo là lỗi; nếu sửa thành pt mới có 3*6=18.
- Lab 3.3: dùng đúng mức 450/710 theo đơn vị đề; không tự nhân 1000. Tín chỉ dùng byte dương,không tự gán giới hạn 10 khi PDF chưa cho.
- Lab 3.4: đáp án chính đếm theo ngày đến trong quý4/2024; bổ sung cách đếm có khoảng lưu trú giao quý với ngày đi là mốc loại trừ,ở cùng ngày tính một ngày.
- Lab 3.6: b.price là lỗi truy cập static; b1 cũng bị ảnh hưởng khi b2 đổi price chung.

## Tài liệu C# chính thức dùng để đối chiếu

- [Access modifiers](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers)
- [Finalizers](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/finalizers)
- [Static classes and members](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/static-classes-and-static-class-members)
- [Operator overloading](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/operator-overloading)
- [Equality comparisons](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/how-to-define-value-equality-for-a-type)

Đặc biệt,finalizer không có access modifier và không có thời điểm chạy xác định. Một số câu trong slide được ghi chú hiệu chỉnh thay vì sao chép lỗi cú pháp.

## Kiểm tra và giới hạn

Đã kiểm tra độ phủ nguồn,các khóa đáp án đã rà soát,đường dẫn từng file,C# được nhúng khớp file thật,cặp operator,cấu trúc ngoặc và logic website bằng DOM mô phỏng. Không có trình biên dịch/SDK C# và trình duyệt thật khả dụng trong môi trường biên soạn; không tuyên bố đã biên dịch/chạy 27 project hoặc kiểm tra bố cục bằng trình duyệt.

`tests/OOPRegression` được cung cấp để người dùng có SDK .NET 8 chạy kiểm tra trực tiếp lên chính các lớp trong bộ mã. Đây là mã kiểm tra được chuẩn bị, chưa được chạy trong môi trường biên soạn.
