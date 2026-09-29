window.CLAB_PROBLEMS = [
  {
    "title": "Mã ASCII của ký tự",
    "category": "C cơ bản",
    "format": "Nhập một ký tự ASCII (không có khoảng trắng). In một số nguyên là mã ASCII.",
    "example": [
      "A",
      "65"
    ],
    "id": 1,
    "statement": "Bài 1. Viết chương trình nhập vào một ký tự bất kỳ, sau đó in ra màn hình mã ASCII tương ứng của ký tự. Ví dụ: Nhập vào ký tự ‘A’, mã ASCII của ‘A’ là 65."
  },
  {
    "title": "Đổi chữ hoa sang chữ thường",
    "category": "C cơ bản",
    "format": "Nhập một chữ cái in hoa A–Z. In đúng một chữ cái thường.",
    "example": [
      "A",
      "a"
    ],
    "id": 2,
    "statement": "Bài 2. Viết chương trình nhập vào một ký tự chữ cái in hoa, sau đó in ra màn hình chữ cái thường tương ứng. Ví dụ: Nhập vào ký tự ‘A’, chữ cái thường tương ứng là ‘a’."
  },
  {
    "title": "Chu vi và diện tích hình chữ nhật",
    "category": "C cơ bản",
    "format": "Nhập chiều dài và chiều rộng (hai số thực). In hai số: chu vi rồi diện tích.",
    "example": [
      "5 3",
      "16 15"
    ],
    "id": 3,
    "statement": "Bài 3: Viết chương trình nhập vào chiều dài và chiều rộng của một hình chữ nhật, tính chu vi và diện tích của hình chữ nhật đó."
  },
  {
    "title": "Chu vi và diện tích hình tròn",
    "category": "C cơ bản",
    "format": "Nhập bán kính (số thực). Dùng PI = 3.14. In hai số: chu vi rồi diện tích.",
    "example": [
      "2",
      "12.56 12.56"
    ],
    "id": 4,
    "statement": "Bài 4: Viết chương trình nhập vào bán kính của một hình tròn, tính chu vi và diện tích của hình tròn đó. Ghi chú: Phải khai báo 1 hằng số PI có giá trị là 3.14."
  },
  {
    "title": "Hoán đổi hai số",
    "category": "C cơ bản",
    "format": "Nhập hai số thực a b. In hai giá trị sau hoán đổi: b rồi a.",
    "example": [
      "35.5 50",
      "50 35.5"
    ],
    "id": 5,
    "statement": "*Bài 5: Viết chương trình nhập vào hai số thực a và b, in ra giá trị của a và b sau khi hoán đổi giá trị. Ví dụ: Nhập a = 35.5, b = 50. Kết quả sau khi hoán đổi giá trị: a = 50, b = 35.5."
  },
  {
    "title": "Giá trị nhỏ nhất và lớn nhất",
    "category": "Toán tử điều kiện",
    "format": "Nhập ba số nguyên. In hai số: nhỏ nhất rồi lớn nhất. Đề yêu cầu dùng toán tử điều kiện ?: (cần tự tuân thủ).",
    "example": [
      "5 1 9",
      "1 9"
    ],
    "id": 6,
    "statement": "Bài 6: Viết chương trình nhập vào ba số nguyên a, b, và c, sau đó tìm và in ra giá trị nhỏ nhất, giá trị lớn nhất trong ba số này."
  },
  {
    "title": "Năm nhuận",
    "category": "Toán tử điều kiện",
    "format": "Nhập một năm dương. In 1 nếu nhuận, in 0 nếu không nhuận. Đề yêu cầu dùng toán tử điều kiện ?:.",
    "example": [
      "2000",
      "1"
    ],
    "id": 7,
    "statement": "Bài 7: Nhập vào một năm bất kỳ. Kiểm tra xem năm đó có phải năm nhuận hay không (năm nhuận là năm chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100)."
  },
  {
    "title": "Tháng thuộc quý mấy",
    "category": "Toán tử điều kiện",
    "format": "Nhập số tháng. In số quý 1–4; tháng không hợp lệ in 0. Đề yêu cầu dùng toán tử điều kiện ?:.",
    "example": [
      "8",
      "3"
    ],
    "id": 8,
    "statement": "*Bài 8: Nhập vào một tháng trong năm. Sử dụng toán tử điều kiện để in ra tháng đó thuộc quý mấy (Quý 1: tháng 1-3, Quý 2: tháng 4-6, Quý 3: tháng 7-9, Quý 4: tháng 10-12). Kiểm tra luôn trường hợp tháng không hợp lệ."
  },
  {
    "title": "Phân loại ký tự",
    "category": "If / For",
    "format": "Nhập một ký tự ASCII không phải khoảng trắng. In chính xác một trong bốn chuỗi của đề: La so / La chu hoa / La chu thuong / Khong la chu cai hay chu so.",
    "example": [
      "A",
      "La chu hoa"
    ],
    "id": 9,
    "statement": "Bài 9: Viết chương trình nhập vào một ký tự từ bàn phím, sau đó thực hiện:\n- Hiển thị thông báo \"La so\" nếu nhập vào là số.\n- Hiển thị thông báo \"La chu hoa\" nếu nhập vào là chữ hoa.\n- Hiển thị thông báo \"La chu thuong\" nếu nhập vào là chữ thường.\n- Hiển thị thông báo \"Khong la chu cai hay chu so\" nếu nhập vào không thuộc ba trường hợp trên."
  },
  {
    "title": "Đổi hoa thường",
    "category": "If / For",
    "format": "Nhập một chữ cái A–Z hoặc a–z. In hai ký tự cách nhau bởi khoảng trắng: ký tự ban đầu rồi ký tự sau khi đổi.",
    "example": [
      "a",
      "a A"
    ],
    "id": 10,
    "statement": "Bài 10: Viết chương trình nhập vào một ký tự chữ cái bất kỳ, sau đó thực hiện:\n- Nếu ký tự nhập vào là chữ thường thì đổi sang chữ in hoa.\n- Nếu ký tự nhập vào là chữ in hoa thì đổi sang chữ thường.\n- Hiển thị kết quả trên màn hình ký tự chữ cái trước và sau khi chuyển đổi."
  },
  {
    "title": "Số ngày trong tháng",
    "category": "If / For",
    "format": "Nhập tháng 1–12. In số ngày. Do đề không nhập năm, tháng 2 quy ước 28 ngày. Tháng không hợp lệ in 0.",
    "example": [
      "2",
      "28"
    ],
    "id": 11,
    "statement": "*Bài 11: Viết chương trình nhập vào tháng của năm bất kì, cho biết tháng đó có bao nhiêu ngày?"
  },
  {
    "title": "Quý của tháng với switch-case",
    "category": "If / For",
    "format": "Giống bài 8: nhập tháng; in quý 1–4 hoặc 0 nếu không hợp lệ. Đề yêu cầu dùng switch-case (cần tự tuân thủ).",
    "example": [
      "12",
      "4"
    ],
    "id": 12,
    "statement": "Bài 12: Dùng cấu trúc Switch-Case để thực hiện lại câu 8 theo hướng đơn giản nhất."
  },
  {
    "title": "Các ký tự mã 33 đến 255",
    "category": "If / For",
    "format": "Không có input. In liên tiếp đúng 223 BYTE mã 33, 34, …, 255 theo thứ tự, ví dụ dùng printf(\"%c\", i). Có thể thêm ký tự xuống dòng ở cuối. Byte 128–255 có thể hiển thị không đúng trong trình duyệt do mã hóa; hệ thống so sánh byte.",
    "example": [
      "",
      "Ký tự đầu: !\"# … | Ký tự cuối: ýþÿ (hiển thị tùy bảng mã)"
    ],
    "id": 13,
    "statement": "Bài 13: Viết chương trình hiển thị lên màn hình các ký tự có mã ASCII từ 33 đến 255."
  },
  {
    "title": "Bảng cửu chương 1 đến 9",
    "category": "If / For",
    "format": "Không có input. In 81 dòng theo thứ tự bảng 1 đến bảng 9; mỗi bảng nhân lần lượt 1 đến 9. Mỗi dòng: i x j = tích. Có thể thay x bằng *, dấu = là tùy chọn; hệ thống so sánh các số trên từng dòng.",
    "example": [
      "",
      "1 x 1 = 1\n1 x 2 = 2\n...\n9 x 9 = 81"
    ],
    "id": 14,
    "statement": "Bài 14: Viết chương trình in ra bảng cửu chương (từ 1 đến 9)."
  },
  {
    "title": "Kiểm tra số nguyên tố",
    "category": "If / For",
    "format": "Nhập một số nguyên dương n. In 1 nếu là số nguyên tố, 0 nếu không.",
    "example": [
      "7",
      "1"
    ],
    "id": 15,
    "statement": "Bài 15: Nhập một số nguyên dương n (Điều kiện: n > 0). Kiểm tra n có là số nguyên tố không?"
  },
  {
    "title": "Bốn tổng phân số",
    "category": "If / For",
    "format": "Nhập n > 0. In lần lượt bốn số thực a b c d (có thể mỗi số trên một dòng), sai số cho phép 1e-4. Chú ý tổng a có n+1 số hạng: từ k=0 đến k=n; b, c, d có n số hạng.",
    "example": [
      "1",
      "1.25 0.666667 0.5 1"
    ],
    "id": 16,
    "statement": "Bài 16: Viết chương trình nhập vào một số nguyên (Điều kiện: n > 0). Thực hiện phép tính tổng sau:\na) Sₙ = 1/2 + 3/4 + 5/6 + … + (2n+1)/(2n+2).\nb) Sₙ = 2/3 + 4/5 + 6/7 + … + 2n/(2n+1).\nc) Sₙ = 1/(1·2) + 1/(2·3) + … + 1/(n(n+1)).\nd) Sₙ = 1 + 1/(1+2) + 1/(1+2+3) + … + 1/(1+2+…+n)."
  }
];
